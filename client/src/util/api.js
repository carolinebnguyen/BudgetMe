import axios from 'axios';
import { logout } from '../slices/auth.js';
import store from '../store.js';

const apiClient = axios.create({
    baseURL: '/api',
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response.status === 401) {
            store.dispatch(logout());
        } else {
            return Promise.reject(err);
        }
    }
);

export const setAuthToken = (authToken) => {
    if (authToken) {
        apiClient.defaults.headers.common['x-auth-token'] = authToken;
        localStorage.setItem('authToken', authToken);
    } else {
        delete apiClient.defaults.headers.common['x-auth-token'];
        localStorage.removeItem('authToken');
    }
};

export default apiClient;
