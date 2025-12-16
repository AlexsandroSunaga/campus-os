
import { useEffect, useState } from "react";
import { api } from "@/api/client";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";

export default function RegistrarPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [dept, setDept] = useState("all");

  useEffect(() => {
    api("/courses").then(setCourses);
    api("/sections").then(setSections);
  }, []);

  const filtered = dept === "all" ? courses : courses.filter((c) => c.department === dept);
  const departments = [...new Set(courses.map((c) => c.department))];
  const fullSections = sections.filter((s) => s.enrolled >= s.seats).length;

  return (
    <ModuleWorkbench
      title="Registrar & academics"
      subtitle="Catalog, section capacity, and enrollment pressure by department."
      kpis={[
        { label: "Courses", value: courses.length },
        { label: "Sections", value: sections.length },
        { label: "At capacity", value: fullSections, tone: fullSections ? "warn" : "ok" },
        { label: "Departments", value: departments.length },
      ]}
      filters={
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      }
      aside={
        <div className="rounded-2xl border border-slate-800 p-4 text-sm text-slate-400">
          <p className="font-medium text-white">Add/drop window</p>
          <p className="mt-2">Demo data resets on API restart. Production would sync to SIS nightly.</p>
        </div>
      }
    >
      <section>
        <h2 className="font-medium">Course catalog</h2>
        <ul className="mt-3 space-y-2">
          {filtered.map((c) => (
            <li key={c.id} className="rounded-lg border border-slate-800 p-3 text-sm">
              {c.code} — {c.title} <span className="text-slate-500">({c.department}, {c.credits} cr)</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-medium">Sections & capacity</h2>
        <table className="mt-3 w-full text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-2 text-left">Section</th>
              <th>Instructor</th>
              <th>Fill</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.id} className="border-t border-slate-800">
                <td className="py-2">Course #{s.course_id} · sec {s.section}</td>
                <td className="text-center">{s.instructor}</td>
                <td className="text-center">{s.enrolled}/{s.seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </ModuleWorkbench>
  );
}
