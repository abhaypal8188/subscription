import api, { authHeader } from "./api.js";

export const analyticsApi = {
  summary: async (token) => {
    const { data } = await api.get("/analytics/summary", authHeader(token));
    return data;
  },
};

