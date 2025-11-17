import { LoginCredentials } from "@/types";
import axios from "axios";


const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.iselftoken.com.br';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const PublicApi = {
    login: async (data: LoginCredentials) => {
        try {
            const response = await api.post('/login', data);
            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },
    register: async (data: any) => await api.post('/register', data),
    forgotPassword: async (data: any) => await api.post('/forgot-password', data),
    resetPassword: async (data: any) => await api.post('/reset-password', data),
    emailVerify: async (data: any) => await api.post('/email-verify', data),
    countries: async () => {
        try {
            const response = await api.get('/countries');
            return response.data;
        } catch (error) {
            console.error('Error fetching countries:', error);
            throw error;
        }
    },
};

export default PublicApi;