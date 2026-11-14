import { ArrowLeft, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useWayNexa } from "../context/WayNexaContext";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { authLoading, user } = useWayNexa();
  const location = useLocation();

  if (authLoading) {
    return <main className="grid min-h-[50vh] place-items-center text-sm font-semibold text-slate-500">Checking account…</main>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (user.role !== "ADMIN") {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#fbfaf7] px-5 py-12">
        <section className="max-w-lg rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-amber-50 text-amber-700">
            <ShieldAlert size={22} />
          </span>
          <h1 className="mt-4 text-2xl font-black">Owner access only</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This workspace is restricted to an account listed in the server’s ADMIN_EMAILS setting.
          </p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#183927] px-5 py-3 text-sm font-bold text-white">
            <ArrowLeft size={16} /> Return to WayNexa
          </Link>
        </section>
      </main>
    );
  }
  return <>{children}</>;
}
