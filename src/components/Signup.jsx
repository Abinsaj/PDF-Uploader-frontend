import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import pdfImage from '../assets/pdfapp.jpg';
import { registerUser } from '../Service/userAxiosCall';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


const Signup = () => {

    const navigate = useNavigate()
    const formik = useFormik({
        initialValues:{
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .transform((value) => value.trim())
                .matches(
                    /^[A-Z][a-zA-Z]*$/,
                    "First letter should be capital"
                )
                .required('Name is required'),
            email: Yup.string()
                .transform((value) => value.trim())
                .email('Invalid email address')
                .required("Email is required"),
            password: Yup.string()
                .transform((value) => value.trim())
                .min(8, "password must be atleast 8 characters")
                .required("password is required"),
            confirmPassword: Yup.string()
                .transform((value) => value.trim())
                .oneOf([Yup.ref("password"), ""], "Password must match")
                .required("Confirm password is required")
        }),
        onSubmit: async(values,{resetForm})=>{
            try {
                
                const response = await registerUser(values)
                console.log(response,'this is the response we got in frontend')
                if(response.success){
                    toast.success(response.message)
                    navigate('/otp')
                }
            } catch (error) {
                console.log(error)
            }finally{
                resetForm()
            }
        }
    })

    const handleSubmitClick = (e)=>{
        e.preventDefault();
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
                            Sign Up
                        </h2>

                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className='space-y-6' action="#" method="POST" onSubmit={formik.handleSubmit}>

                            <div>
                                <label htmlFor="" className='text-gray-300'>
                                    Name
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        name='name'
                                        placeholder='Enter your name'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className='h-10 w-full px-2 py-2 text-sm text-white rounded-md bg-gray-500 border-2 outline-none border-gray-500'
                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className='text-red-500 text-sm' >
                                            {formik.errors.name}
                                        </div>
                                    ): null}
                                </div>
                            </div>

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
                                    ): null}
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
                                    {formik.touched.password && formik.errors.password? (
                                        <div className='text-red-500 text-sm' >
                                            {formik.errors.password}
                                        </div>
                                    ): null}
                                </div>
                            </div>

                            <div>

                                <label htmlFor="" className='text-gray-300'>
                                    Confirm Password
                                </label>
                                <div>
                                    <input
                                        type="password"
                                        name='confirmPassword'
                                        placeholder='Confirm your password'
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className='h-10 w-full px-2 py-2 text-sm text-white rounded-md bg-gray-500 border-2 outline-none border-gray-500'
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <div className='text-red-500 text-sm' >
                                            {formik.errors.confirmPassword}
                                        </div>
                                    ): null}
                                </div>
                            </div>

                            <div>
                                <button
                                onClick={handleSubmitClick}
                                type='submit'
                                className='h-10 w-full px-1 py-2 rounded-md bg-black text-white  outline-none'>
                                    Signup
                                </button>

                                <p className="mt-10 text-center text-sm text-gray-500">
                                Already have an  account?{' '}
                                <a onClick={()=>navigate('/login')} className="font-semibold leading-6 text-[#04A118] hover:text-[#04A118]">
                                    Sign In
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

export default Signup
