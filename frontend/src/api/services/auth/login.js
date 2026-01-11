import api from "../../axios";


export const loginAPI = (formData) => api.post(`auth/login`, formData);

