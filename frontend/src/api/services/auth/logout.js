import api from "../../axios";

export const logoutAPI = () => api.post("/auth/logout");
