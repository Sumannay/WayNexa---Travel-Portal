import { Heart, Menu, Plane, Search, Sparkles, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CURRENCY_RATES, useWayNexa } from "../context/WayNexaContext";
import type { CurrencyCode } from "../types/domain";

const navItems = [
  { label: "Explore", to: "/explore" },
  { label: "Stays", to: "/hotels" },
  { label: "Flights", to: "/flights" },
  { label: "Transport", to: "/transport" },
  { label: "Plan a trip", to: "/trips/create" },
  { label: "Reviews", to: "/reviews" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, favorites, currency, setCurrency } = useWayNexa();

  return (
    <header className="absolute inset-x-0 top-0 z-50 text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link to="/" aria-label="WayNexa home" className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap">
          <span className="grid size-10 place-items-center rounded-2xl bg-white text-slate-950 shadow-lg shadow-black/10 transition group-hover:-rotate-6">
            <Plane size={19} fill="currentColor" />
          </span>
          <span className="text-xl font-black tracking-[0.16em]">WayNexa</span>
        </Link>

        <nav className="hidden items-center gap-3 whitespace-nowrap xl:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm font-semibold transition ${isActive ? "text-[#d8fbcc]" : "text-white/80 hover:text-white"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 sm:flex">
          {/* Quick Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white outline-none backdrop-blur cursor-pointer hover:bg-white/20"
          >
            {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => (
              <option key={code} value={code} className="text-slate-900 font-semibold">
                {code} ({CURRENCY_RATES[code].symbol})
              </option>
            ))}
          </select>

          <Link
            to="/ai-assistant"
            className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            <span className="flex items-center gap-1.5"><Sparkles size={15} /> Ask AI</span>
          </Link>
          <Link
            to="/search"
            aria-label="Search WayNexa"
            className="grid size-10 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20"
          >
            <Search size={18} />
          </Link>
          <Link
            to="/favorites"
            aria-label="Saved items"
            className="relative grid size-10 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20"
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
            className="grid size-10 place-items-center rounded-full bg-white text-slate-950 transition hover:bg-slate-100"
            aria-label={user ? "Profile" : "Sign in"}
          >
            <UserRound size={18} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle menu"
          className="grid size-10 place-items-center rounded-full bg-white/10 backdrop-blur xl:hidden"
        >
          {isOpen ? <X size={21} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="bg-[#183927] border-b border-white/10 px-5 py-4 xl:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/ai-assistant"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#d8fbcc] hover:bg-white/10"
            >
              Ask AI Travel Planner
            </Link>
            <Link
              to={user ? "/profile" : "/login"}
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              {user ? "My Profile & Saved Plans" : "Sign In"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
