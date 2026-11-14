import { Activity, ArrowLeft, Users, Waypoints } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { accountApi, type AdminOverview } from "../lib/accountApi";

const formatEventName = (eventType: string) =>
  eventType.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    accountApi.getAdminOverview()
      .then((result) => {
        if (active) setOverview(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "The owner dashboard could not be loaded.");
        }
      });
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-[70vh] bg-[#fbfaf7] px-5 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900">
          <ArrowLeft size={16} /> Back to WayNexa
        </Link>
        <header className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#4a8558]">Private workspace</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Owner activity</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Account totals and recent actions recorded by the WayNexa API. Passwords and private chat contents are never shown here.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#dbe8d8] bg-[#eef4e9] px-3 py-2 text-xs font-bold text-[#245239] sm:self-auto">
            <Activity size={15} /> MySQL-backed
          </span>
        </header>

        {error ? (
          <div role="alert" className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-800">
            {error}
          </div>
        ) : !overview ? (
          <p className="mt-10 rounded-2xl bg-white p-8 text-sm font-semibold text-slate-500 ring-1 ring-slate-200">
            Loading private activity…
          </p>
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2">
              <Metric icon={Users} label="Registered accounts" value={overview.userCount} />
              <Metric icon={Waypoints} label="Recorded activity events" value={overview.eventCount} />
            </section>

            <section className="mt-9 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
                <div>
                  <h2 className="text-lg font-black">Recent activity</h2>
                  <p className="mt-1 text-xs text-slate-500">The latest 100 events across all accounts.</p>
                </div>
                <Activity size={20} className="text-[#4a8558]" />
              </div>
              {overview.recentActivity.length === 0 ? (
                <p className="px-6 py-12 text-center text-sm text-slate-500">No account activity has been recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3 font-bold sm:px-7">When</th>
                        <th className="px-5 py-3 font-bold">Account</th>
                        <th className="px-5 py-3 font-bold">Action</th>
                        <th className="px-5 py-3 font-bold sm:pr-7">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {overview.recentActivity.map((event) => (
                        <tr key={event.id} className="align-top">
                          <td className="whitespace-nowrap px-5 py-4 text-slate-500 sm:px-7">
                            {new Intl.DateTimeFormat("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(event.createdAt))}
                          </td>
                          <td className="px-5 py-4">
                            <span className="block font-bold text-slate-900">{event.name}</span>
                            <span className="mt-1 block text-xs text-slate-500">{event.email}</span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#245239]">
                            {formatEventName(event.eventType)}
                          </td>
                          <td className="px-5 py-4 text-slate-600 sm:pr-7">
                            {Object.entries(event.details).map(([key, value]) => `${formatEventName(key)}: ${value}`).join(" · ") || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <article className="flex items-center gap-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
      <span className="grid size-12 place-items-center rounded-2xl bg-[#eef4e9] text-[#387a43]">
        <Icon size={22} />
      </span>
      <div>
        <p className="text-2xl font-black">{value.toLocaleString("en-IN")}</p>
        <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
      </div>
    </article>
  );
}
