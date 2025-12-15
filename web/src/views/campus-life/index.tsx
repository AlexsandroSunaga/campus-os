import { MarketingLayout } from "@/components/MarketingLayout";

export default function CampusLifePage() {
  return (
    <MarketingLayout>
      <h1 className="text-3xl font-semibold">Campus life</h1>
      <p className="mt-4 text-slate-400">Sample programming calendar — ties into the events API in the student portal.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {["Orientation week", "Homecoming", "Career fair", "Finals support"].map((e) => (
          <div key={e} className="rounded-xl border border-slate-800 p-4">
            <p className="font-medium">{e}</p>
            <p className="mt-1 text-xs text-slate-500">Register via /portal/events</p>
          </div>
        ))}
      </div>
    </MarketingLayout>
  );
}
