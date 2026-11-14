import { Compass, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useWayNexa } from "../context/WayNexaContext";

export default function SiteFooter() {
  const { user } = useWayNexa();
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div>
          <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-[.14em]">
            <span className="grid size-8 place-items-center rounded-lg bg-[#183927] text-white">
              <Compass size={16} />
            </span>
            WayNexa
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            A calmer way to discover destinations, compare travel ideas and build thoughtful itineraries.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">
          <Link to="/explore" className="hover:text-slate-950">Explore</Link>
          <Link to="/hotels" className="hover:text-slate-950">Stays</Link>
          <Link to="/flights" className="hover:text-slate-950">Flights</Link>
          <Link to="/transport" className="hover:text-slate-950">Transport</Link>
          <Link to="/reviews" className="hover:text-slate-950">Stories & Reviews</Link>
          <Link to="/ai-assistant" className="hover:text-slate-950">AI Assistant</Link>
          <Link to="/favorites" className="hover:text-slate-950">Saved</Link>
          <Link to="/settings" className="hover:text-slate-950">Preferences</Link>
          {user?.role === "ADMIN" && (
            <Link to="/admin" className="flex items-center gap-1 text-[#245239] hover:underline">
              <Shield size={14} /> Owner Activity
            </Link>
          )}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-slate-100 pt-6 text-xs text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} WayNexa Travel Portal. All rights reserved.</p>
        <p>Sample listings, prices and availability only · No live reservations or payments</p>
      </div>
    </footer>
  );
}
