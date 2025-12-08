import { Link } from "react-router-dom";

const links = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/students", label: "Students" },
  { href: "/parents", label: "Parents" },
  { href: "/campus-life", label: "Campus life" },
  { href: "/contact", label: "Contact" },
];

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="font-semibold text-accent">CampusOS</Link>
          <nav className="flex flex-wrap gap-3 text-sm text-slate-400">
            {links.map((l) => (
              <Link key={l.href} to={l.href} className="hover:text-white">{l.label}</Link>
            ))}
            <Link to="/console" className="rounded-full bg-accent/20 px-3 py-1 text-accent">Staff console</Link>
            <Link to="/portal/events" className="rounded-full border border-slate-700 px-3 py-1">Events portal</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
    </div>
  );
}
