import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SubscriptionsPage from "./pages/SubscriptionsPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import { useAuthStore } from "./store/authStore.js";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const theme = useAuthStore((state) => state.theme);
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

