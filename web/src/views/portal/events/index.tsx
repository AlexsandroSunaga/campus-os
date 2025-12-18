
import { useEffect, useState } from "react";
import { api, qrUrl } from "@/api/client";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [token, setToken] = useState("");
  useEffect(() => { api("/events").then(setEvents); }, []);
  async function register(eventId: number) {
    const data = await api<{ token: string }>("/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event_id: eventId, email: "student@campus.demo" }) });
    setToken(data.token);
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Student events</h1>
      <div className="grid gap-4 md:grid-cols-2">{events.map((e) => <article key={e.id} className="rounded-2xl border border-slate-800 p-5"><h2>{e.title}</h2><p className="text-sm text-slate-500">{e.location}</p><button onClick={() => register(e.id)} className="mt-4 rounded-lg bg-accent/30 px-4 py-2 text-sm">Get pass</button></article>)}</div>
      {token && <img src={qrUrl(token)} alt="QR" width={140} className="rounded bg-white p-2" />}
    </div>
  );
}
