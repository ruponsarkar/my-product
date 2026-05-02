import api from '../../axios';

export const getSettings = () => api.get('/settings');
export const updateSettings = (payload) => api.put('/settings', payload);
