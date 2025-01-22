import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import pdfImage from '../assets/pdfapp.jpg'
import { verifyLogin } from '../Service/userAxiosCall.js'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .transform((value) => value.trim())
                .email('Invalid email address')
                .required("Email is required"),
            password: Yup.string()
                .transform((value) => value.trim())
                .min(8, "password must be atleast 8 characters")
                .required("password is required"),
        }),
        onSubmit: async(values,{resetForm})=>{
            console.log(values,'these are the values')
            try {
                const response = await dispatch(verifyLogin(values))
                console.log(response,'this is the response we got in the login page')
                if(response.payload.success){
                    toast.success(response.payload.message)
                    navigate('/')
                }else{
                    toast.error(response.payload.message)
                }
            } catch (error) {
                console.log(error)
            }finally{
                resetForm()
            }
        }
    })

    const handleSubmitClick = (e)=>{
        e.preventDefault()
        formik.handleSubmit()
    }

    return (
        <>
            <div className='flex items-center justify-center h-screen bg-gradient-to-r from-black to-gray-500 '>
                <div className="w-1/2 hidden md:flex items-center justify-center ">
                    <img
                        className="w-full h-full pl-10 object-cover opacity-90 "
                        src={pdfImage}
                        alt="Background Image"
                    />
                </div>
                <div className="flex h-full w-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="justify-center items-center pl-28 font-bold text-3xl text-gray-100">
                            Log In
                        </h2>

                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className='space-y-6' action="#" method="POST" onSubmit={formik.handleSubmit}>

                            <div>

                                <label htmlFor="" className='text-gray-300'>
                                    Email
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        name='email'
                                        placeholder='Enter your email'
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className='h-10 w-full px-2 py-2 text-sm text-white rounded-md bg-gray-500 border-2 outline-none border-gray-500'
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className='text-red-500 text-sm' >
                                            {formik.errors.email}
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div>

                                <label htmlFor="" className='text-gray-300'>
                                    Password
                                </label>
                                <div>
                                    <input
                                        type="password"
                                        name='password'
                                        placeholder='Enter your password'
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className='h-10 w-full px-2 py-2 text-sm text-white rounded-md bg-gray-500 border-2 outline-none border-gray-500'
                                    />
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className='text-red-500 text-sm' >
                                            {formik.errors.password}
                                        </div>
                                    ) : null}
                                </div>
                            </div>



                            <div>
                                <button
                                    onClick={handleSubmitClick}
                                    type='submit'
                                    className='h-10 w-full px-1 py-2 rounded-md bg-black text-white  outline-none'>
                                    Login
                                </button>

                                <p className="mt-10 text-center text-sm text-gray-500">
                                Don't have an PDF-Uploader account?{' '}
                                <a onClick={()=>navigate('/signup')} className="font-semibold leading-6 text-[#04A118] hover:text-[#04A118]">
                                    Sign Up
                                </a>
                            </p>

                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
