import { create } from "zustand";
import toast from "react-hot-toast";
import { authApi } from "../services/authApi.js";

const storedTheme = localStorage.getItem("ssm-theme") || "dark";
const storedSession = JSON.parse(localStorage.getItem("ssm-session") || "null");

export const useAuthStore = create((set, get) => ({
  user: storedSession?.user || null,
  accessToken: storedSession?.accessToken || null,
  refreshToken: storedSession?.refreshToken || null,
  theme: storedTheme,
  loading: false,
  bootstrap: async () => {
    const { user, accessToken } = get();

    if (!user || !accessToken) {
      return;
    }

    try {
      const profile = await authApi.me(accessToken);
      set({ user: profile.user });
    } catch (_error) {
      get().logout(false);
    }
  },
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("ssm-theme", theme);
      return { theme };
    }),
  setSession: (session) => {
    localStorage.setItem("ssm-session", JSON.stringify(session));
    set(session);
  },
  login: async (payload) => {
    set({ loading: true });

    try {
      const response = await authApi.login(payload);
      get().setSession(response);
      toast.success(`Welcome back, ${response.user.name}`);
      return response;
    } finally {
      set({ loading: false });
    }
  },
  register: async (payload) => {
    set({ loading: true });

    try {
      const response = await authApi.register(payload);
      get().setSession(response);
      toast.success("Your account is ready");
      return response;
    } finally {
      set({ loading: false });
    }
  },
  logout: (notify = true) => {
    localStorage.removeItem("ssm-session");
    set({ user: null, accessToken: null, refreshToken: null });
    if (notify) {
      toast.success("Logged out");
    }
  },
}));

