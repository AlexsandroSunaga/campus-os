import { MarketingLayout } from "@/components/MarketingLayout";

const items = [
  "Command center with cross-department KPIs",
  "Course catalog & section enrollment (registrar)",
  "Residence hall occupancy and assignments",
  "Dining hall wait-time boards",
  "Live queue / ops radio view",
  "Incident tracking for campus safety",
  "Student events portal with registration",
];

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      <h1 className="text-3xl font-semibold">Platform features</h1>
      <ul className="mt-8 space-y-3 text-slate-300">
        {items.map((i) => <li key={i} className="flex gap-2"><span className="text-accent">?</span>{i}</li>)}
      </ul>
    </MarketingLayout>
  );
}
