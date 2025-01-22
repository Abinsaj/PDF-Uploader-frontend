import { useState, useEffect } from 'react';
import { FileText, Upload, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { pdfUpload, getSelectedPage } from '../Service/userAxiosCall';
import { toast } from 'sonner';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

export default function Home() {
    const user = useSelector((state) => state.user.userInfo);
    console.log(user, 'this is the userInfo in the home page');

    const [file, setFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfImages, setPdfImages] = useState([]);
    const [pdfData, setPdfData] = useState()
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedPages, setSelectedPages] = useState([]);

    useEffect(() => {
        if (pdfUrl) {
            renderPdf(pdfUrl);
        } else {
            setPdfImages([]);
            setCurrentPage(0);
        }
    }, [pdfUrl]);

    const renderPdf = async (url) => {
        setLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();

            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const images = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;
                images.push(canvas.toDataURL());
            }

            setPdfImages(images);
        } catch (error) {
            console.error('Error rendering PDF:', error);
            toast.error('Failed to render PDF.');
        }
        setLoading(false);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const fileType = selectedFile.type;
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

            if (fileType === 'application/pdf' && fileExtension === 'pdf') {
                setFile(selectedFile);
            } else {
                toast.error('Please select a valid PDF file.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('pdf-file', file);

            try {
                const response = await pdfUpload(formData, user._id);
                console.log(response, 'this is the response we got in the home page');

                if (response.success) {
                    setPdfUrl(response.result.pdf.url);
                    setPdfData(response.result)
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error('Error uploading PDF:', error);
                toast.error('Failed to upload PDF.');
            }
        }
    };

    const handleCheckboxChange = (page) => {
        setSelectedPages((prevSelected) =>
            prevSelected.includes(page)
                ? prevSelected.filter((p) => p !== page)
                : [...prevSelected, page] 
        );
    };

    const handleDownload = async () => {
        if (!pdfData.pdf.url || selectedPages.length === 0) {
            toast.error('No PDF URL or selected pages available.');
            return;
        }
        try {
            const response = await axios(pdfData.pdf.url, {
                responseType: 'arraybuffer', 
            })
            console.log(response,'this is the response to extract the data ')
            // if(response !== 200){
            //     throw new Error(`Failed to fetch PDF: ${response.statusText}`);
            // }

            const arrayBuffer = response.data;
            console.log(arrayBuffer,'this is the array buffer we got')

            const originalPdf = await PDFDocument.load(arrayBuffer);
            const newPDF = await PDFDocument.create()

            for (const page of selectedPages) {
                const [copiedPage] = await newPDF.copyPages(originalPdf, [page - 1]);
                newPDF.addPage(copiedPage);
            }

            console.log(newPDF,'this is the created new pdf')
            
            const newPdfBytes = await newPDF.save();
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);


            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'selected-pages.pdf';
            link.click();

        
            URL.revokeObjectURL(blobUrl);

            toast.success('PDF with selected pages downloaded successfully.');
            
        } catch (error) {
            
        }
    }

    return (
        <>
            <Navbar />
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white rounded-lg shadow-md w-full max-w-3xl p-8">
                    <div className="flex items-center mb-6 text-gray-700">
                        <User className="w-5 h-5 mr-2" />
                        {user && (
                            <div>
                            <h2 className="font-semibold">{user.name}</h2>
                            <p className="text-sm">{user.email}</p>
                        </div>
                        )}
                        
                    </div>

                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">PDF Uploader</h1>

                    {pdfImages.length > 0 && (
                        <div className="mb-6 relative">
                            <div className="flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden" style={{ height: '70vh', width: '80vh' }}>
                                <img
                                    src={pdfImages[currentPage]}
                                    alt={`Page ${currentPage + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                />

                                <input
                                    type="checkbox"
                                    className="absolute top-2 right-2 h-4 w-4"
                                    name={`page-${currentPage + 1}`}
                                    value={currentPage + 1}
                                    checked={selectedPages.includes(currentPage + 1)} // Controlled by selectedPages
                                    onChange={() => handleCheckboxChange(currentPage + 1)} // Update state
                                />
                            </div>
                            {pdfImages.length > 1 && (
                                <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))}
                                        className="bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors"
                                        disabled={currentPage === 0}
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((prev) => (prev < pdfImages.length - 1 ? prev + 1 : prev))}
                                        className="bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors"
                                        disabled={currentPage === pdfImages.length - 1}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            )}
                            <p className="text-center mt-2 text-sm text-gray-600">
                                Page {currentPage + 1} of {pdfImages.length}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                id="file-upload"
                                className="sr-only"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <FileText className="w-8 h-8 text-gray-400 mr-2" />
                                <span className="text-lg font-medium text-gray-600">
                                    {file ? file.name : 'Choose a PDF file'}
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                            disabled={!file || loading}
                        >
                            {loading ? (
                                <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                <Upload className="w-6 h-6 mr-2" />
                            )}
                            {loading ? 'Processing...' : 'Upload PDF'}
                        </button>

                        {pdfImages.length > 0 && (
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center justify-center text-lg mt-4"
                            >
                                Download Selected Pages
                            </button>
                        )}
                    </form>
                </div>
            </main>
        </>
    );
}
