import { MarketingLayout } from "@/components/MarketingLayout";

export default function ContactPage() {
  return (
    <MarketingLayout>
      <h1 className="text-3xl font-semibold">Contact admissions IT</h1>
      <p className="mt-4 text-slate-400">Request a sandbox tenant for your university operations team.</p>
      <form className="mt-8 max-w-md space-y-3">
        <input placeholder="Institution" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" />
        <input placeholder="Email" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" />
        <button type="button" className="rounded-full bg-accent px-5 py-2 text-sm text-slate-950">Send</button>
      </form>
    </MarketingLayout>
  );
}
