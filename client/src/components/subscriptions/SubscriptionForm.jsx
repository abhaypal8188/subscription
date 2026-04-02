import { useEffect, useState } from "react";
import { uploadApi } from "../../services/uploadApi.js";
import { useAppStore } from "../../store/appStore.js";
import { useAuthStore } from "../../store/authStore.js";

const initialState = {
  name: "",
  price: 0,
  billingCycle: "monthly",
  nextBillingDate: "",
  category: "Entertainment",
  paymentMethod: "Card",
  logoUrl: "",
  remindersEnabled: true,
  usageScore: 60,
  autoPay: true,
  notes: "",
  status: "active",
};

function SubscriptionForm() {
  const token = useAuthStore((state) => state.accessToken);
  const selectedSubscription = useAppStore((state) => state.selectedSubscription);
  const saveSubscription = useAppStore((state) => state.saveSubscription);
  const selectSubscription = useAppStore((state) => state.selectSubscription);
  const [formData, setFormData] = useState(initialState);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedSubscription) {
      setFormData({
        ...selectedSubscription,
        nextBillingDate: selectedSubscription.nextBillingDate?.slice(0, 10),
      });
    } else {
      setFormData(initialState);
    }
  }, [selectedSubscription]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !token) {
      return;
    }

    setUploading(true);
    try {
      const response = await uploadApi.uploadLogo(file, token);
      setFormData((current) => ({ ...current, logoUrl: response.url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveSubscription({
      ...formData,
      price: Number(formData.price),
      usageScore: Number(formData.usageScore),
    });
    setFormData(initialState);
  };

  return (
    <form className="glass-panel p-6" onSubmit={handleSubmit}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">{selectedSubscription ? "Edit subscription" : "Add subscription"}</p>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Capture renewals, payment methods, usage, and reminders.
          </p>
        </div>
        {selectedSubscription ? (
          <button type="button" className="btn-secondary" onClick={() => selectSubscription(null)}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input className="input-field" name="name" placeholder="Netflix" value={formData.name} onChange={handleChange} required />
        <input className="input-field" name="price" type="number" min="0" placeholder="499" value={formData.price} onChange={handleChange} required />
        <select className="input-field" name="billingCycle" value={formData.billingCycle} onChange={handleChange}>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input className="input-field" name="nextBillingDate" type="date" value={formData.nextBillingDate} onChange={handleChange} required />
        <select className="input-field" name="category" value={formData.category} onChange={handleChange}>
          <option>Entertainment</option>
          <option>Health</option>
          <option>Education</option>
          <option>Productivity</option>
          <option>Lifestyle</option>
          <option>Utilities</option>
          <option>Other</option>
        </select>
        <input className="input-field" name="paymentMethod" placeholder="UPI / Visa / Wallet" value={formData.paymentMethod} onChange={handleChange} />
        <select className="input-field" name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input className="input-field" name="usageScore" type="number" min="0" max="100" placeholder="Usage score" value={formData.usageScore} onChange={handleChange} />
        <textarea className="input-field md:col-span-2" name="notes" rows="4" placeholder="Notes, savings idea, calendar sync info..." value={formData.notes} onChange={handleChange} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-white/10">
          <input type="checkbox" name="remindersEnabled" checked={formData.remindersEnabled} onChange={handleChange} />
          Billing reminders
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-white/10">
          <input type="checkbox" name="autoPay" checked={formData.autoPay} onChange={handleChange} />
          Auto-pay enabled
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
        <input type="file" accept="image/*" onChange={handleUpload} />
        <span className="text-sm text-slate-500 dark:text-slate-300">{uploading ? "Uploading..." : formData.logoUrl ? "Logo ready" : "Optional logo upload"}</span>
      </div>

      <button type="submit" className="btn-primary mt-6">
        {selectedSubscription ? "Save changes" : "Add subscription"}
      </button>
    </form>
  );
}

export default SubscriptionForm;
