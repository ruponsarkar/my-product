import api from "../../axios";

export const getSubscriptionOverview = () => api.get("/subscriptions/overview");
export const getSubscriptionPlans = () => api.get("/subscriptions/plans");
export const createSubscriptionCheckoutOrder = (payload) =>
  api.post("/subscriptions/checkout-order", payload);
export const verifySubscriptionPayment = (payload) =>
  api.post("/subscriptions/verify-payment", payload);
export const cancelSubscriptionAutopay = () =>
  api.post("/subscriptions/cancel-autopay");
export const getSubscriptionTransactions = () => api.get("/subscriptions/transactions");
export const getInvoiceDetails = (invoiceNumber) =>
  api.get(`/subscriptions/invoices/${invoiceNumber}`);
