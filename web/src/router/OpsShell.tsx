import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "@/components/Shell";

const Command = lazy(() => import("@/views/console/command"));
const Registrar = lazy(() => import("@/views/console/registrar"));
const Housing = lazy(() => import("@/views/console/housing"));
const Dining = lazy(() => import("@/views/console/dining"));
const Ops = lazy(() => import("@/views/console/ops"));
const Safety = lazy(() => import("@/views/console/safety"));

export default function OpsShell() {
  return (
    <Shell>
      <Routes>
        <Route path="/console" element={<Command />} />
        <Route path="/console/registrar" element={<Registrar />} />
        <Route path="/console/housing" element={<Housing />} />
        <Route path="/console/dining" element={<Dining />} />
        <Route path="/console/ops" element={<Ops />} />
        <Route path="/console/safety" element={<Safety />} />
        <Route path="*" element={<Navigate to="/console" replace />} />
      </Routes>
    </Shell>
  );
}
