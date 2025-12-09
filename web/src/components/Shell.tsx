import { Link } from "react-router-dom";
import { BookOpen, Building, CalendarDays, Home, LayoutDashboard, Radio, Shield } from "lucide-react";

const nav = [
  { href: "/console", label: "Command", icon: LayoutDashboard },
  { href: "/portal/events", label: "Student events", icon: CalendarDays },
  { href: "/console/registrar", label: "Registrar", icon: BookOpen },
  { href: "/console/housing", label: "Housing", icon: Home },
  { href: "/console/dining", label: "Dining ops", icon: Building },
  { href: "/console/ops", label: "Live queues", icon: Radio },
  { href: "/console/safety", label: "Campus safety", icon: Shield },
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <span className="font-semibold text-accent">CampusOS</span>
          <nav className="flex flex-wrap gap-3 text-sm text-slate-400">
            {nav.map((n) => (
              <Link key={n.href} to={n.href} className="flex items-center gap-1 hover:text-white"><n.icon className="h-4 w-4" />{n.label}</Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
