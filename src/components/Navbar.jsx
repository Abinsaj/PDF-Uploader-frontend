import React from 'react'
import { useSelector } from 'react-redux'

const Navbar = () => {

    const userInfo = useSelector((state)=>state.user.userInfo)
    const handleLogout = async()=>{
        localStorage.clear()
    }

    return (
        <>
            <div className=' flex justify-between p-5 border-b-2 bg-gray-50'>
                <div>
                    <span className='font-bold text-2xl pr-1 '>PDF</span><span className='text-xl font-semibold'>Uploader</span>
                </div> 
                {userInfo ? (
                    <div className='flex pr-5 pt-1 space-x-2'>
                       <h2 onClick={handleLogout} className='font-semibold text-md '>LOGOUT</h2> 
                    </div>
                ):(

                <div className='flex pr-5 pt-1 space-x-2'>
                    <h2 className='font-semibold text-md '>LOGIN</h2>
                    <p>|</p>
                    <h2 className='font-semibold text-md'>SIGNUP</h2>
                </div>
                )}
            </div>
        </>
    )
}

export default Navbar
