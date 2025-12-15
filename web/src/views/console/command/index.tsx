
import { useEffect, useState } from "react";
import { api } from "@/api/client";
import { Link } from "react-router-dom";

export default function Command() {
  const [d, setD] = useState<any>(null);
  useEffect(() => { api("/command/overview").then(setD).catch(() => undefined); }, []);
  const cards = d ? [["Events", d.events, "/portal/events"], ["Courses", d.courses, "/console/registrar"], ["Housing filled", d.housing_occupied, "/console/housing"], ["Dining wait", d.dining_wait_total, "/console/dining"], ["Open incidents", d.open_incidents, "/console/safety"]] : [];
  return (
    <div>
      <h1 className="text-2xl font-semibold">University command center</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([l, v, href]) => <Link key={l} to={href as string} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"><p className="text-xs text-slate-500">{l}</p><p className="text-3xl font-semibold text-accent">{v}</p></Link>)}
      </div>
    </div>
  );
}
