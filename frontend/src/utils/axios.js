import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5002/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
    timeout: 5000
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response) {
            // Server responded with error
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({ message: 'No response from server. Please try again.' });
        } else {
            // Error in request configuration
            return Promise.reject({ message: 'Error in making request. Please try again.' });
        }
    }
);

export default axiosInstance; 