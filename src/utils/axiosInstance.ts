import axios from 'axios';

// Criação da instância do Axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // URL base para suas requisições
});

// Adiciona o interceptor para incluir o token JWT no cabeçalho
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Recupera o token do localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
