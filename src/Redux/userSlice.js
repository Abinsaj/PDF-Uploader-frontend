import { createSlice } from "@reduxjs/toolkit";
import { verifyLogin } from "../Service/userAxiosCall.js";

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: null,
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        clearUser(state){
            state.userInfo = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userInfo');
        },
        setLoading(state,action){
            state.loading = action.payload
        },
        setError(state,action){
            state.error = action.payload    
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(verifyLogin.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase( verifyLogin.fulfilled, (state, action)=>{
            const data = action.payload.result
            state.userInfo = data.userInfo;
            state.accessToken = data.accessToken;
            state.loading = false

            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
        })
        .addCase(verifyLogin.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload  || 'Login failed'
        })
    }
})

export const { clearUser, setLoading, setError } = userSlice.actions
export default userSlice.reducer