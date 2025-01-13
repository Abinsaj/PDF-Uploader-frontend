import axios from 'axios'

const url = "http://localhost:5050"

const axiosInsance = axios.create({
    baseURL: url,
    withCredentials: true
})

export default axiosInsance