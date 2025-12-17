import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/MarketingLayout";
import { FaqSection, StatsRow, ProcessSteps } from "@/components/MarketingSections";

export default function Home() {
  return (
    <MarketingLayout>
      <h1 className="text-4xl font-semibold">Run the campus, not spreadsheets.</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-400">
        CampusOS unifies registrar workflows, housing occupancy, dining wait times, live event queues, and safety
        incidents — with a student-facing events portal and six staff modules.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/console" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-slate-950">University console</Link>
        <Link to="/portal/events" className="rounded-full border border-slate-700 px-5 py-2.5 text-sm">Browse events</Link>
        <Link to="/features" className="rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-300">Features</Link>
      </div>
      <StatsRow
        items={[
          { label: "Students (demo)", value: "12.4k" },
          { label: "Events this term", value: "86" },
          { label: "Housing occupancy", value: "94%" },
          { label: "Open incidents", value: "3" },
        ]}
      />
      <ProcessSteps
        steps={[
          { title: "Plan", body: "Registrar builds sections; housing assigns beds; dining forecasts capacity." },
          { title: "Operate", body: "Command center watches queues, incidents, and cross-department KPIs." },
          { title: "Engage", body: "Students discover events in the portal with live wait positions." },
        ]}
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Registrar", "Housing", "Dining", "Safety"].map((m) => (
          <div key={m} className="rounded-xl border border-slate-800 p-4 text-sm text-slate-400">
            <span className="font-medium text-white">{m}</span> — staff console module
          </div>
        ))}
      </div>
      <FaqSection
        items={[
          { q: "Is there a student app?", a: "The events portal covers registration and wait times; mobile web is responsive." },
          { q: "What API powers this?", a: "CampusOS uses the Express api-node service with seeded academic and ops data." },
        ]}
      />
    </MarketingLayout>
  );
}
