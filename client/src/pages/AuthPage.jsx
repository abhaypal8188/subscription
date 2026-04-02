import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard.jsx";
import { useAuthStore } from "../store/authStore.js";
import { authApi } from "../services/authApi.js";

function AuthPage() {
  const { user, login, register, loading } = useAuthStore();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [emailSent, setEmailSent] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === "login") {
      await login({ email: formData.email, password: formData.password });
      return;
    }

    await register(formData);
  };

  const handleForgotPassword = async () => {
    await authApi.forgotPassword({ email: formData.email });
    setEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-hero-grid">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">Premium SaaS</p>
            <h1 className="mt-6 max-w-2xl text-6xl font-extrabold leading-tight">
              Track every subscription, uncover waste, and automate your reminders.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300">
              A polished MERN dashboard for recurring payments, analytics, AI-style savings recommendations, admin monitoring, and deploy-ready workflows.
            </p>
          </div>

          <AuthCard
            title={mode === "login" ? "Welcome back" : "Create your workspace"}
            description="Sign in to manage renewals, monitor monthly spend, and catch unwanted subscriptions before they renew."
            footer={
              <button type="button" onClick={() => setMode((value) => (value === "login" ? "register" : "login"))}>
                {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
              </button>
            }
          >
            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "register" ? (
                <input className="input-field" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required />
              ) : null}
              <input className="input-field" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              <input className="input-field" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
              </button>
            </form>

            <div className="mt-4">
              <button type="button" className="text-sm text-coral" onClick={handleForgotPassword}>
                Send password reset email
              </button>
              {emailSent ? <p className="mt-2 text-sm text-mint">Reset instructions sent if that account exists.</p> : null}
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

