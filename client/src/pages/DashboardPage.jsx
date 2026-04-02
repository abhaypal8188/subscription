import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import toast from "react-hot-toast";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts.jsx";
import InsightsPanel from "../components/dashboard/InsightsPanel.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import UpcomingPayments from "../components/dashboard/UpcomingPayments.jsx";
import { useAppStore } from "../store/appStore.js";
import { formatCurrency } from "../utils/formatters.js";

function DashboardPage() {
  const { analytics, fetchDashboard } = useAppStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const downloadCsv = () => {
    const session = JSON.parse(localStorage.getItem("ssm-session") || "null");
    if (!session?.accessToken) {
      return;
    }

    const url = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/analytics/export.csv`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to export transactions");
        }

        return response.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "transactions.csv";
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch(() => {
        toast.error("Could not export transactions");
      });
  };

  if (!analytics) {
    return <div className="glass-panel p-6">Loading dashboard...</div>;
  }

  const { summary, categoryBreakdown, trends, upcomingPayments, savingsSuggestions, transactions } = analytics;

  return (
    <div className="space-y-6">
      <section className="glass-panel overflow-hidden p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">Overview</p>
            <h1 className="mt-4 text-4xl font-bold">Your recurring money map</h1>
            <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
              Monitor renewals, forecast next month, and spot subscriptions that deserve a second look.
            </p>
          </div>
          <button type="button" className="btn-secondary" onClick={downloadCsv}>
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            Export CSV
          </button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monthly spend" value={formatCurrency(summary.totalMonthlyCost)} hint="Recurring budget" />
        <StatCard label="Active subscriptions" value={summary.activeCount} hint="Currently renewing" />
        <StatCard label="Upcoming payments" value={summary.upcomingCount} hint="Next 10 days" />
        <StatCard label="Predicted next month" value={formatCurrency(summary.predictedNextMonth)} hint="Basic ML forecast" />
      </section>

      <AnalyticsCharts categoryBreakdown={categoryBreakdown} trends={trends} />
      <InsightsPanel insights={summary.insights} savingsSuggestions={savingsSuggestions} />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <UpcomingPayments items={upcomingPayments} />

        <div className="glass-panel p-6">
          <p className="text-lg font-semibold">Recent transactions</p>
          <div className="mt-5 space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                <div>
                  <p className="font-medium">{transaction.category}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {new Date(transaction.paidAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
