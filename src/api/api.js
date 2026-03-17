import axios from "axios"

export const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : "http://localhost:5000";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://hatims-backend-repo.onrender.com/api"
})

API.interceptors.request.use((req) => {

    const token = localStorage.getItem("token")

    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }

    return req
})

export default API
