import axios from "axios";
import router from "./router";

const ApiConfig = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json'
    }
})

const errorHandler = async (error) => {
    const errorResponse: { status: null | string | number; message: null | string | number } = {
        status: null,
        message: null
    }

    if (error?.response?.status === 401) {
        router.replace('/auth')
        errorResponse.status = 401
        errorResponse.message = ''
        localStorage.removeItem('token')
    } else if (error?.response?.data?.message) {
        errorResponse.status = error.response.status
        errorResponse.message = error.response.data.message
    } else if (error?.response?.data?.errors) {
        const combined = Object.values(error?.response?.data?.errors)
            .flat() // flatten arrays of strings
            .join('\n'); // join each message with a newline or other separator
        errorResponse.status = error.response.status
        errorResponse.message = combined
    } else if (error.request.responseType === 'blob') {
        const responseObj = await error.response.data.text()
        const msg = JSON.parse(responseObj).error
        errorResponse.status = error.response.status
        errorResponse.message = msg
    } else {
        errorResponse.status = error.response?.status || 500
        errorResponse.message = error?.message || 'Serverda Xatolik'
    }
    return Promise.reject(errorResponse)
}

ApiConfig.interceptors.response.use((config) => config, errorHandler)

ApiConfig.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (config.url !== 'one-id/' && config.url !== 'basic-auth/') {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}, errorHandler)

export default ApiConfig