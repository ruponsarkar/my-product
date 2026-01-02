import api from "../../axios";


export const getProducts = (data) => api.get(`products?page=${data.page || 1}&limit=${data.limit || 10}&search=${data.search || ""}&sortBy=${data.sortBy || "createdAt"}&sortOrder=${data.sortOrder || "desc"}`);
export const getProductByIdOrSlug = (id) => api.get(`products/${id}`);
export const saveProducts = (data) => api.post(`products`, data); 
export const updateProduct = (id, payload) => api.put(`products/${id}`, payload); 

export const uploadProductImage = (id, formData) => api.post(`products/${id}/images`, formData);


export const getLastSkuNumber = (prefix) => api.get(`products/getLastSkuNumber/${prefix}`);
export const getCategories = () => api.get(`categorys`);
export const getBrands = (cat) => api.get(`categorys/brand/${cat}`);

