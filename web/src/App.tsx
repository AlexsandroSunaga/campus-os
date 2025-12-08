import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("@/pages/LandingPage/LandingPage"));
const Features = lazy(() => import("@/views/features"));
const Students = lazy(() => import("@/views/students"));
const Parents = lazy(() => import("@/views/parents"));
const CampusLife = lazy(() => import("@/views/campus-life"));
const Contact = lazy(() => import("@/views/contact"));
const PortalEvents = lazy(() => import("@/views/portal/events"));
const OpsShell = lazy(() => import("@/router/OpsShell"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-8 text-slate-400">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/students" element={<Students />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/campus-life" element={<CampusLife />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portal/events" element={<PortalEvents />} />
          <Route path="/*" element={<OpsShell />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
