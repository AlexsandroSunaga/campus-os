
import { useEffect, useState } from "react";
import { api } from "@/api/client";

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api("/housing").then(setRows); }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Housing & residence life</h1>
      <table className="mt-6 w-full text-sm"><thead><tr><th className="p-3 text-left">Building</th><th>Room</th><th>Assignee</th><th>Status</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.id} className="border-t border-slate-800"><td className="p-3">{r.building}</td><td>{r.room}</td><td>{r.student_email || "—"}</td><td>{r.status}</td></tr>)}</tbody></table>
    </div>
  );
}
