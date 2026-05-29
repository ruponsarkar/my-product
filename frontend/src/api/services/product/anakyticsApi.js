import api from "../../axios";


// export const getProducts = (data) => api.get(`products?page=${data.page || 1}&limit=${data.limit || 10}&search=${data.search || ""}&sortBy=${data.sortBy || "createdAt"}&sortOrder=${data.sortOrder || "desc"}`);

const buildQuery = (params = {}) => {
  if (typeof params === "string") {
    return new URLSearchParams({ type: params }).toString();
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });
  return searchParams.toString();
};

export const dashboardOverview = (params = { type: "daily" }) =>
  api.get(`analytics/dashboard?${buildQuery(params)}`);
export const topSellingProducts = () => api.get(`analytics/top-products`);
export const summary = () => api.get(`analytics/summary`);
export const netProfit = () => api.get(`analytics/net-profit`);
export const paymentBreakdown = () => api.get(`analytics/payment-breakdown`);
export const salesByDate = (params = { type: "daily" }) =>
  api.get(`analytics/sales-by-date?${buildQuery(params)}`);
export const salesByHour = () => api.get(`analytics/sales-by-hour`);
export const ordersByUser = () => api.get(`analytics/orders-by-user`);
export const customReport = (payload) => api.post(`analytics/custom`, payload);
