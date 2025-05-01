import axios from 'axios';

const API_URL = 'https://be-9.vercel.app/'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => api.post('/user/register', null, { params: userData });
export const loginUser = (userData) => api.post('/user/login', null, { params: userData });

export const getAllItems = () => api.get('/item');
export const getItemById = (id) => api.get(`/item/byId/${id}`);
export const getItemsByStoreId = (storeId) => api.get(`/item/byStoreId/${storeId}`);

export const createTransaction = (transactionData) => api.post('/transaction', transactionData);
export const payTransaction = (transactionId) => api.post(`/transaction/${transactionId}/pay`);
export const getTransactionById = (id) => api.get(`/transaction/${id}`);
export const getAllTransactions = () => api.get('/transaction');
