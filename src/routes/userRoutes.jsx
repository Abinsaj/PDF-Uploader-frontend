import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Signup from '../components/Signup'
import Home from '../components/Home'
import Otp from '../components/Otp'
import Login from '../components/Login'

const UserRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='' element={<Home/>}/>
                <Route path='/signup' element={<Signup />} />
                <Route path='/otp' element={<Otp/>} />
                <Route path='/login' element={<Login/>}/>
            </Routes>
        </>
    )
}

export default UserRoutes
