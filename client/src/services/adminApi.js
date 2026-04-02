import api, { authHeader } from "./api.js";

export const adminApi = {
  overview: async (token) => {
    const { data } = await api.get("/admin/overview", authHeader(token));
    return data;
  },
};

