import { useEffect } from "react";
import { useAppStore } from "../store/appStore.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";

function AdminPage() {
  const { adminData, fetchAdmin } = useAppStore();

  useEffect(() => {
    fetchAdmin();
  }, [fetchAdmin]);

  if (!adminData) {
    return <div className="glass-panel p-6">Loading admin analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">Admin Panel</p>
        <h1 className="mt-4 text-4xl font-bold">Monitor platform-wide subscription activity</h1>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-panel p-5">
          <p className="text-sm text-slate-500 dark:text-slate-300">Users</p>
          <p className="mt-3 text-3xl font-bold">{adminData.metrics.totalUsers}</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-sm text-slate-500 dark:text-slate-300">Subscriptions</p>
          <p className="mt-3 text-3xl font-bold">{adminData.metrics.totalSubscriptions}</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-sm text-slate-500 dark:text-slate-300">Tracked revenue</p>
          <p className="mt-3 text-3xl font-bold">{formatCurrency(adminData.metrics.totalTrackedRevenue)}</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-sm text-slate-500 dark:text-slate-300">Transactions</p>
          <p className="mt-3 text-3xl font-bold">{adminData.metrics.totalTransactions}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel p-6">
          <p className="text-lg font-semibold">Users</p>
          <div className="mt-5 space-y-3">
            {adminData.users.map((user) => (
              <div key={user._id} className="rounded-2xl border border-slate-200/80 p-4 dark:border-white/10">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">{user.email}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-coral">{user.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <p className="text-lg font-semibold">Global subscriptions</p>
          <div className="mt-5 space-y-3">
            {adminData.subscriptions.map((subscription) => (
              <div key={subscription._id} className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                <p className="font-medium">{subscription.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  {subscription.user?.name} • {subscription.category} • {formatDate(subscription.nextBillingDate)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminPage;
