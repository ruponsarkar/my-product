import api from "../../axios";

const base = "/subscriptions/admin";
export const getBillingAdminCapabilities = () => api.get(`${base}/capabilities`);
export const getAdminPlans = () => api.get(`${base}/plans`);
export const createAdminPlan = (payload) => api.post(`${base}/plans`, payload);
export const updateAdminPlan = (code, payload) => api.patch(`${base}/plans/${encodeURIComponent(code)}`, payload);
export const deleteAdminPlan = (code) => api.delete(`${base}/plans/${encodeURIComponent(code)}`);
export const getAdminTenants = (q, page) => api.get(`${base}/tenants`, { params: { q, page } });
export const extendTenantAccess = (tenantId, payload) => api.post(`${base}/tenants/${encodeURIComponent(tenantId)}/extend`, payload);
