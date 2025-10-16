import api from "../../axios";


export const post_form_attributes = (data) => api.post(`form_attritubess`, data);
export const get_form_attributes = () => api.get(`form_attritubess`);