import api from "../../axios";


export const getProducts = (data = {}) => {
  const params = new URLSearchParams({
    page: String(data.page || 1),
    limit: String(data.limit || 10),
    search: data.search || "",
    sortBy: data.sortBy || "createdAt",
    sortOrder: data.sortOrder || "desc",
  });

  if (data.isFeatured !== undefined && data.isFeatured !== null && data.isFeatured !== "") {
    params.append("isFeatured", String(data.isFeatured));
  }

  return api.get(`products?${params.toString()}`);
};
export const getProductByIdOrSlug = (id) => api.get(`products/${id}`);
export const saveProducts = (data) => api.post(`products`, data); 
export const updateProduct = (id, payload) => api.put(`products/${id}`, payload); 

export const uploadProductImage = (id, formData) => api.post(`products/${id}/images`, formData);
export const deleteProductImages = (id, payload) => api.post(`products/deleteProductImages/${id}`, payload);


export const getLastSkuNumber = (prefix) => api.get(`products/getLastSkuNumber/${prefix}`);
export const getCategories = () => api.get(`categorys`);
export const getBrands = (cat) => api.get(`categorys/brand/${cat}`);
