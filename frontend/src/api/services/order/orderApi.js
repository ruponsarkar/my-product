import api from "../../axios";

export const createOrder = (payload) => api.post("orders", payload);
export const getMyOrders = (params) => api.get("orders/my", { params });
export const getOrders = (params) => api.get("orders", { params });
export const getOrderById = (id) => api.get(`orders/${id}`);
