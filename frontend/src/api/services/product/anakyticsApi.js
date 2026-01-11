import api from "../../axios";


// export const getProducts = (data) => api.get(`products?page=${data.page || 1}&limit=${data.limit || 10}&search=${data.search || ""}&sortBy=${data.sortBy || "createdAt"}&sortOrder=${data.sortOrder || "desc"}`);

export const topSellingProducts = () => api.get(`analytics/top-products`);
export const summary = () => api.get(`analytics/summary`);
export const netProfit = () => api.get(`analytics/net-profit`);
export const paymentBreakdown = () => api.get(`analytics/payment-breakdown`);
export const salesByDate = (type) => api.get(`analytics/sales-by-date?type=${type}`);
export const salesByHour = () => api.get(`analytics/sales-by-hour`);
export const ordersByUser = () => api.get(`analytics/orders-by-user`);
export const customReport = (payload) => api.post(`analytics/custom`, payload);



