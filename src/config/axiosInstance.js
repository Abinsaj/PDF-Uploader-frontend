import axios from 'axios'

const url = "http://www.stagmensfashion.online"

const axiosInsance = axios.create({
    baseURL: url,
    withCredentials: true
})

export default axiosInsance