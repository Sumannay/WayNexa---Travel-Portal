import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useWayNexa } from "../context/WayNexaContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { authLoading, user } = useWayNexa();
  const location = useLocation();
  if (authLoading) {
    return <main className="grid min-h-[50vh] place-items-center text-sm font-semibold text-slate-500">Checking account…</main>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
