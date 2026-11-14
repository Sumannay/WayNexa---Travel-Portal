import { Heart, Menu, Plane, Search, Shield, Sparkles, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CURRENCY_RATES, useWayNexa } from "../context/WayNexaContext";
import type { CurrencyCode } from "../types/domain";

const links = [
  ["Explore", "/explore"],
  ["Stays", "/hotels"],
  ["Flights", "/flights"],
  ["Transport", "/transport"],
  ["Plan Trip", "/trips/create"],
  ["Reviews", "/reviews"],
] as const;

export default function PageTopbar() {
  const [open, setOpen] = useState(false);
  const { favorites, user, currency, setCurrency } = useWayNexa();

  return (
    <header className="z-40 border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur sticky top-0">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap" aria-label="WayNexa home">
          <span className="grid size-9 place-items-center rounded-xl bg-[#183927] text-white">
            <Plane size={17} fill="currentColor" />
          </span>
          <span className="text-lg font-black tracking-[.14em]">WayNexa</span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-3 whitespace-nowrap xl:flex">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm font-bold transition ${
                  isActive ? "text-[#245239]" : "text-slate-500 hover:text-slate-950"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 sm:flex">
          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:bg-slate-100"
          >
            {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => (
              <option key={code} value={code}>
                {code} ({CURRENCY_RATES[code].symbol})
              </option>
            ))}
          </select>

          <Link
            to="/ai-assistant"
            className="flex items-center gap-1.5 rounded-full bg-[#eef4e9] px-3 py-1.5 text-xs font-bold text-[#245239] hover:bg-[#dfeeda]"
          >
            <Sparkles size={14} /> Ask AI
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              title="Private owner activity"
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <Shield size={13} className="text-[#387a43]" /> Owner
            </Link>
          )}

          <Link
            to="/search"
            aria-label="Search"
            className="grid size-9 place-items-center rounded-full hover:bg-slate-100"
          >
            <Search size={18} />
          </Link>

          <Link
            to="/favorites"
            aria-label="Saved items"
            className="relative grid size-9 place-items-center rounded-full hover:bg-slate-100"
          >
            <Heart size={18} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            to={user ? "/profile" : "/login"}
            aria-label={user ? "Profile" : "Sign in"}
            className="grid size-9 place-items-center rounded-full bg-[#183927] text-white hover:bg-[#245239]"
          >
            <UserRound size={17} />
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center xl:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-100 px-5 py-3 xl:hidden bg-white">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-100"
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/ai-assistant"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-4 py-2.5 font-bold text-[#245239] hover:bg-slate-100"
          >
            AI Travel Assistant
          </NavLink>
          {user?.role === "ADMIN" && (
            <NavLink
              to="/admin"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-100"
            >
              Owner Activity
            </NavLink>
          )}
          <NavLink
            to={user ? "/profile" : "/login"}
            onClick={() => setOpen(false)}
            className="block rounded-xl px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-100"
          >
            {user ? "Profile" : "Sign In"}
          </NavLink>
        </nav>
      )}
    </header>
  );
}
