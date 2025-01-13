import axios from 'axios'

const url = "https://pdf-uploader-server.onrender.com"

const axiosInsance = axios.create({
    baseURL: url,
    withCredentials: true
})

export default axiosInsance