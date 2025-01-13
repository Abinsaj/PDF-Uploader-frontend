import axiosInsance from "../config/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = async(data)=>{
    try {
        console.log(data, ' this is the data we got in the service')
        const response = await axiosInsance.post('/signup', {data})
        return response.data
    } catch (error) {
        if( error.response.data){
            return error.response.data
        }
        console.log(error)
    }
}

export const verifyOtp = async(otp)=>{
    try {
        const response = await axiosInsance.post('/otp', {otp})
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