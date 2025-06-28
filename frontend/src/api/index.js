import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});


apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Unauthorized, redirecting to login...');


        }
        return Promise.reject(error);
    }
);

export default apiClient;
