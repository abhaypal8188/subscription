import api, { authHeader } from "./api.js";

export const subscriptionApi = {
  list: async (token) => {
    const { data } = await api.get("/subscriptions", authHeader(token));
    return data;
  },
  create: async (payload, token) => {
    const { data } = await api.post("/subscriptions", payload, authHeader(token));
    return data;
  },
  update: async (id, payload, token) => {
    const { data } = await api.put(`/subscriptions/${id}`, payload, authHeader(token));
    return data;
  },
  remove: async (id, token) => {
    const { data } = await api.delete(`/subscriptions/${id}`, authHeader(token));
    return data;
  },
};

