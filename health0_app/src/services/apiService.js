import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Config from '../config';

const api = axios.create({
    baseURL: Config.API_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export const authService = {
    login: (username, password) => api.post('/login/', { username, password }),
    register: (userData) => api.post('/register/', userData),
    getProfile: () => api.get('/profile/'),
    verifyNIN: (nin) => api.post('/verify-nin/', { nin }),
};

export const recordService = {
    getRecords: () => api.get('/records/'),
    uploadRecord: (formData) => api.post('/records/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const hospitalService = {
    searchPatients: (query) => api.get(`/hospital/search/?q=${query}`),
    getPatientDetail: (id) => api.get(`/hospital/patient/${id}/`),
    getAnalytics: () => api.get('/hospital/analytics/'),
};

export const appointmentService = {
    getAppointments: () => api.get('/appointments/'),
    createAppointment: (data) => api.post('/appointments/', data),
};

export default api;
