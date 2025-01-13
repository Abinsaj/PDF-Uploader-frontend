import React, { useEffect, useState,useRef } from 'react'
import { verifyOtp } from '../Service/userAxiosCall';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { values } from 'pdf-lib';

const Otp = () => {

    const location =  useLocation()
    const navigate = useNavigate()
    const [timeLeft, setTimeLeft] = useState(60)
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [timerActive, setTimerActive] = useState(true);
    const resendRef = useRef(null)
    const confirmRef = useRef(null)

    useEffect(() => {

        if (timeLeft <= 0) {
            if (confirmRef.current && resendRef.current) {
                resendRef.current.style.display = 'block'
            }
            return
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev > 0 ? prev - 1 : 0)
        }, 1000)
        return () => clearInterval(timer)


    }, [timerActive, timeLeft])

    const handleChange = (e, index) => {
        const newOtp = [...otp]
        newOtp[index] = e.target.value

        setOtp(newOtp)

        if (e.target.value.length > 0 && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            if (nextInput) {
                nextInput.focus()
            }
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            if (prevInput) {
                const newOtp = [...otp]
                newOtp[index - 1] = "";
                setOtp(newOtp);
                prevInput.focus()
            }
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const otpValue = otp.join('')
        console.log(otpValue)
        try {
            const otpVerification = await verifyOtp(otpValue,location.state)
            if(otpVerification.success){
                toast.success(otpVerification.message)
                navigate('/login')
            }else{
                toast.error(otpVerification.message)
                navigate('/signup')
            }
            console.log(otpVerification)
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <div className='flex items-center justify-center h-screen bg-gradient-to-r from-black to-gray-300 '>

                <div className="flex h-[60vh] w-full max-w-md flex-1 flex-col justify-center mt-20 mb-20 px-6 py-4 lg:px-8 border-current bg-white bg-opacity-10 rounded-md shadow-2xl">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Verify your OTP
                        </h2>
                    </div>

                    <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form  method="POST" className="space-y-6" onSubmit={handleSubmit} >
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
                                    Enter OTP
                                </label>
                                <div className="mt-2 flex space-x-2 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            name="otp"
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            autoComplete="one-time-code"
                                            className="w-10 h-10 text-center rounded-md border border-gray-300 bg-gray-600 bg-opacity-30 py-1.5 text-gray-900 shadow-sm ring-[#04A118] placeholder:text-gray-400 focus:ring-2 focus:ring-[#04A118] focus:border-[#04A118] focus:outline-none hover:border-[#04A118] sm:text-sm sm:leading-6"

                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-900">Time remaining:{
                                    timeLeft
                                } </span>
                                <button
                                    type="button"
                                    className="text-sm font-semibold text-black hover:underline hover:text-[#04A118]"
                                    style={{ display: 'none' }}
                                // onClick={resentOtp}
                                    ref={resendRef}
                                >
                                    Resend OTP
                                </button>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-gray-600 bg-opacity-30 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm "
                                    ref={confirmRef}
                                    style={{ display: 'block' }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Otp
