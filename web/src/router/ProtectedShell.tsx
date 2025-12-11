import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { AdminLayout } from "@/layouts/AdminLayout";
import Dashboard from "@/views/dashboard";

const nav = [{ key: "home", label: "Overview", path: "/console" }];

export default function ProtectedShell() {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout title={import.meta.env.VITE_APP_TITLE} nav={nav} />}>
        <Route path="/console" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/console" replace />} />
      </Route>
    </Routes>
  );
}
