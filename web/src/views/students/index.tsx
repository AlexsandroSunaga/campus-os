import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/MarketingLayout";

export default function StudentsPage() {
  return (
    <MarketingLayout>
      <h1 className="text-3xl font-semibold">For students</h1>
      <p className="mt-4 text-slate-400">Discover campus events, register, and get QR passes — no admin login required.</p>
      <Link to="/portal/events" className="mt-6 inline-block rounded-full bg-accent px-5 py-2 text-sm font-medium text-slate-950">
        Open events portal
      </Link>
    </MarketingLayout>
  );
}
