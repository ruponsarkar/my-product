// // src/api/axios.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Optional: Add interceptors for auth tokens or error handling
// // api.interceptors.request.use(...)

// export default api;



import axios from "axios";
import { AUTH_TOKEN_KEY, clearAuthData } from "../utils/auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://api.example.com",
});

// Automatically adjust headers based on request type
api.interceptors.request.use(
  (config) => {
    // If the data is FormData, let the browser set the Content-Type (includes boundary)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    // Example: attach token if available
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);

    if (error.response?.status === 401) {
      clearAuthData();

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
