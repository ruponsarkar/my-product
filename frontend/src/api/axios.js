// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for auth tokens or error handling
// api.interceptors.request.use(...)

export default api;
