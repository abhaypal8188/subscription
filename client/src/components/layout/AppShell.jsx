import { NavLink, Outlet } from "react-router-dom";
import { Bars3Icon, MoonIcon, PowerIcon, SunIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useAuthStore } from "../../store/authStore.js";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/admin", label: "Admin" },
];

function AppShell() {
  const [open, setOpen] = useState(false);
  const { user, logout, toggleTheme, theme } = useAuthStore();

  const filteredItems = useMemo(
    () => navItems.filter((item) => item.to !== "/admin" || user?.role === "admin"),
    [user?.role],
  );

  return (
    <div className="min-h-screen bg-hero-grid">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside
          className={clsx(
            "glass-panel fixed inset-y-6 left-4 z-30 w-72 p-6 transition lg:static lg:block",
            open ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0",
          )}
        >
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">SaaS Control</p>
            <h1 className="mt-3 text-2xl font-bold">Smart Subscription Manager</h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
              Keep every recurring bill visible, optimized, and under control.
            </p>
          </div>

          <nav className="space-y-2">
            {filteredItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-coral text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 rounded-3xl bg-ink px-5 py-6 text-white dark:bg-white/5">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="mt-1 text-xs text-white/70">{user?.email}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-mint">{user?.role}</p>
          </div>
        </aside>

        <div className="flex-1 lg:pl-0">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              className="btn-secondary lg:hidden"
              onClick={() => setOpen((value) => !value)}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>

            <div className="ml-auto flex items-center gap-3">
              <button type="button" className="btn-secondary" onClick={toggleTheme}>
                {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              <button type="button" className="btn-secondary" onClick={() => logout()}>
                <PowerIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}

export default AppShell;

