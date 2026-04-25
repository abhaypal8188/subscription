import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const { refreshToken, setSession, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout(false);
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
        setSession(response.data);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logout(false);
        toast.error("Your session expired");
        return Promise.reject(refreshError);
      }
    }

    toast.error(error.response?.data?.message || "Something went wrong");
    return Promise.reject(error);
  },
);

export const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;

