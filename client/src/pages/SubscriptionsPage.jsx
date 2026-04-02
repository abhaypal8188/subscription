import { useEffect, useMemo, useState } from "react";
import SubscriptionForm from "../components/subscriptions/SubscriptionForm.jsx";
import SubscriptionTable from "../components/subscriptions/SubscriptionTable.jsx";
import { useAppStore } from "../store/appStore.js";

function SubscriptionsPage() {
  const { subscriptions, fetchDashboard } = useAppStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const filteredSubscriptions = useMemo(
    () =>
      subscriptions.filter((subscription) => {
        const matchesQuery = subscription.name.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === "All" || subscription.category === category;
        return matchesQuery && matchesCategory;
      }),
    [category, query, subscriptions],
  );

  return (
    <div className="space-y-6">
      <section className="glass-panel p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">Subscription Hub</p>
        <h1 className="mt-4 text-4xl font-bold">Manage every service in one place</h1>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
          Edit renewals, assign categories, upload branding, and keep reminders and usage signals updated.
        </p>
      </section>

      <SubscriptionForm />

      <div className="glass-panel p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input-field" placeholder="Search subscriptions" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className="input-field" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Education</option>
            <option>Productivity</option>
            <option>Lifestyle</option>
            <option>Utilities</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <SubscriptionTable subscriptions={filteredSubscriptions} />
    </div>
  );
}

export default SubscriptionsPage;

