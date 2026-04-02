import api, { authHeader } from "./api.js";

export const authApi = {
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },
  me: async (token) => {
    const { data } = await api.get("/auth/me", authHeader(token));
    return data;
  },
  forgotPassword: async (payload) => {
    const { data } = await api.post("/auth/forgot-password", payload);
    return data;
  },
};

