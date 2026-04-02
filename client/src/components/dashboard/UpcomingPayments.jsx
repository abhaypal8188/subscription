import { formatCurrency, formatDate } from "../../utils/formatters.js";

function UpcomingPayments({ items = [] }) {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Upcoming payments</p>
          <p className="text-sm text-slate-500 dark:text-slate-300">Reminder-ready renewals due soon.</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-2xl border border-slate-200/80 p-4 dark:border-white/10"
            >
              <div className="flex items-center gap-3">
                {item.logoUrl ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${item.logoUrl}`}
                    alt={item.name}
                    className="h-10 w-10 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral/15 font-semibold text-coral">
                    {item.name.slice(0, 1)}
                  </div>
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{formatDate(item.nextBillingDate)}</p>
                </div>
              </div>
              <p className="font-semibold">{formatCurrency(item.price)}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-300">No renewals due in the next 10 days.</p>
        )}
      </div>
    </div>
  );
}

export default UpcomingPayments;

