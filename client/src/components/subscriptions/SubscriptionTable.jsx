import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAppStore } from "../../store/appStore.js";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

function SubscriptionTable({ subscriptions = [] }) {
  const deleteSubscription = useAppStore((state) => state.deleteSubscription);
  const selectSubscription = useAppStore((state) => state.selectSubscription);

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-slate-200/80 px-6 py-5 dark:border-white/10">
        <p className="text-lg font-semibold">Managed subscriptions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Service</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Billing</th>
              <th className="px-6 py-4 font-medium">Next renewal</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription._id} className="border-t border-slate-200/70 dark:border-white/10">
                <td className="px-6 py-4 font-medium">{subscription.name}</td>
                <td className="px-6 py-4">{subscription.category}</td>
                <td className="px-6 py-4">{formatCurrency(subscription.price)}</td>
                <td className="px-6 py-4">{formatDate(subscription.nextBillingDate)}</td>
                <td className="px-6 py-4 capitalize">{subscription.status}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button type="button" className="btn-secondary px-3 py-2" onClick={() => selectSubscription(subscription)}>
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button type="button" className="btn-secondary px-3 py-2" onClick={() => deleteSubscription(subscription._id)}>
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!subscriptions.length ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-300">
                  No subscriptions added yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubscriptionTable;

