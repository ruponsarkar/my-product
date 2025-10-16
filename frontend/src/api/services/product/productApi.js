import api from "../../axios";


export const getProducts = (data) => api.get(`products?page=${data.page || 1}&limit=${data.limit || 10}&search=${data.search || ""}&sortBy=${data.sortBy || "createdAt"}&sortOrder=${data.sortOrder || "desc"}`);

export const saveProducts = (data) => api.post(`products`, data); 