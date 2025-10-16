import api from "../axios";


export const getFeelings = ({page, limit}) => api.get(`/get?page=${page}&limit=${limit}`);
export const updateFeelings = (data) => api.post(`updateFeelings`, data);
export const getToday = ({date}) => api.get(`/getToday?date=${date}`);
// export const getFeelings = (id) => api.get(`/users/${id}`);
