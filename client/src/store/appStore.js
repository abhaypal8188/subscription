import { create } from "zustand";
import toast from "react-hot-toast";
import { analyticsApi } from "../services/analyticsApi.js";
import { subscriptionApi } from "../services/subscriptionApi.js";
import { adminApi } from "../services/adminApi.js";
import { useAuthStore } from "./authStore.js";

export const useAppStore = create((set, get) => ({
  subscriptions: [],
  analytics: null,
  adminData: null,
  fetching: false,
  selectedSubscription: null,
  fetchDashboard: async () => {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      return;
    }

    set({ fetching: true });
    try {
      const [subscriptionsData, analytics] = await Promise.all([
        subscriptionApi.list(token),
        analyticsApi.summary(token),
      ]);

      set({
        subscriptions: subscriptionsData.subscriptions,
        analytics,
      });
    } finally {
      set({ fetching: false });
    }
  },
  fetchAdmin: async () => {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      return;
    }

    const adminData = await adminApi.overview(token);
    set({ adminData });
  },
  saveSubscription: async (payload) => {
    const token = useAuthStore.getState().accessToken;
    const current = get().selectedSubscription;

    if (!token) {
      return;
    }

    if (current?._id) {
      await subscriptionApi.update(current._id, payload, token);
      toast.success("Subscription updated");
    } else {
      await subscriptionApi.create(payload, token);
      toast.success("Subscription added");
    }

    set({ selectedSubscription: null });
    await get().fetchDashboard();
  },
  deleteSubscription: async (id) => {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      return;
    }

    await subscriptionApi.remove(id, token);
    toast.success("Subscription removed");
    await get().fetchDashboard();
  },
  selectSubscription: (subscription) => set({ selectedSubscription: subscription }),
}));

