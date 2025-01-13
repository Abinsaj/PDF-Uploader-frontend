import axiosInsance from "../config/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = async(email)=>{
    try {

        const response = await axiosInsance.post('/signup', {email:email})
        return response.data
    } catch (error) {
        if( error.response.data){
            return error.response.data
        }
        console.log(error)
    }
}

export const verifyOtp = async(otp, data)=>{
    try {
        const response = await axiosInsance.post('/otp', {otp,data})
        return response.data
    } catch (error) {
        if( error.response.data){
            return error.response.data
        }
        console.log(error)
    }
}

export const verifyLogin = createAsyncThunk(
    'user/verifyLogin', 
    async (data, { rejectWithValue }) => {
      try {
        const response = await axiosInsance.post('/login', { data });
        return response.data;
      } catch (error) {

        return rejectWithValue(error.response?.data || 'Login failed');
      }
    }
);

export const pdfUpload = async(formData, userId)=>{
    try {
        
        console.log(formData,'yeah we go the file')
        const response = await axiosInsance.post('/pdf-upload', formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            params:{
                userId
            }
        })
        console.log(response)
        return response.data
    } catch (error) {
        if( error.response.data){
            return error.response.data
        }
        console.log(error)
    }
}

export const getSelectedPage = async(pages, pdfId)=>{
    try {
        console.log(pages,'this is the pages')
        const response = await axiosInsance.post('/getpages',{pages, pdfId})

        return response.data
    } catch (error) {
        if( error.response.data){
            return error.response.data
        }
        console.log(error)
    }
}