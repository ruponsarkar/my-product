import api from "../../axios";

export const createOrder = (payload) => api.post("orders", payload);
export const getMyOrders = () => api.get("orders/my");
export const getOrders = (params) => api.get("orders", { params });
