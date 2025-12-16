import { useEffect, useState } from "react";

type Analytics = {
  live_queues: { food: number; gate: number };
  avg_wait_minutes: number;
  checkin_rate: number;
  passes_issued: number;
  sms_enabled: boolean;
};

export default function OpsPage() {
  const [queue, setQueue] = useState({ food: 0, gate: 0 });
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const base = import.meta.env.VITE_API_BASE || "http://localhost:8014";

  useEffect(() => {
    const es = new EventSource(`${base}/api/v1/queue/stream`);
    es.onmessage = (e) => setQueue(JSON.parse(e.data));
    return () => es.close();
  }, [base]);

  useEffect(() => {
    fetch(`${base}/api/v1/queue/analytics`)
      .then((r) => r.json())
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
  }, [base]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Live operations queues</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 p-8 text-center"><p>Dining</p><p className="text-5xl text-accent">{queue.food}</p></div>
        <div className="rounded-2xl border border-slate-800 p-8 text-center"><p>Registration</p><p className="text-5xl text-accent">{queue.gate}</p></div>
      </div>
      {analytics && (
        <div className="grid gap-4 md:grid-cols-4 text-sm text-slate-400">
          <div className="rounded-xl border border-slate-800 p-4">Avg wait: {analytics.avg_wait_minutes.toFixed(1)} min</div>
          <div className="rounded-xl border border-slate-800 p-4">Check-in rate: {analytics.checkin_rate}%</div>
          <div className="rounded-xl border border-slate-800 p-4">Passes: {analytics.passes_issued}</div>
          <div className="rounded-xl border border-slate-800 p-4">SMS: {analytics.sms_enabled ? "on" : "demo"}</div>
        </div>
      )}
    </div>
  );
}
