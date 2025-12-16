
import { useEffect, useState } from "react";
import { api } from "@/api/client";

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api("/incidents").then(setRows); }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Campus safety & facilities</h1>
      <div className="mt-6 space-y-3">{rows.map((i) => <div key={i.id} className="rounded-xl border border-slate-800 p-4"><p className="font-medium">{i.category}</p><p className="text-sm text-slate-500">{i.location}</p><p className="text-xs text-amber-400">{i.severity} · {i.status}</p></div>)}</div>
    </div>
  );
}
