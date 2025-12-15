
import { useEffect, useState } from "react";
import { api } from "@/api/client";

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api("/dining").then(setRows); }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dining services</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{rows.map((d) => <div key={d.id} className="rounded-2xl border border-slate-800 p-6 text-center"><p className="text-lg font-medium">{d.name}</p><p className="text-4xl font-semibold text-accent mt-2">{d.wait}</p><p className="text-xs text-slate-500">in line · cap {d.capacity}</p></div>)}</div>
    </div>
  );
}
