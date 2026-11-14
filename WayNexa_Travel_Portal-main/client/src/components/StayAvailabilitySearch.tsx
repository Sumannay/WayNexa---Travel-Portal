import { CalendarDays, MapPin, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { stays } from "../data/catalog";
import { getOccupancy } from "../lib/roomOccupancy";

function toLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultDates() {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 1);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 2);
  return { checkIn: toLocalDate(checkIn), checkOut: toLocalDate(checkOut) };
}

export default function StayAvailabilitySearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultDates = getDefaultDates();
  const [destination, setDestination] = useState(searchParams.get("destination") ?? "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? defaultDates.checkOut);
  const [adults, setAdults] = useState(() => Number(searchParams.get("adults")) || 2);
  const [children, setChildren] = useState(() => Number(searchParams.get("children")) || 0);
  const [rooms, setRooms] = useState(() => Number(searchParams.get("rooms")) || 1);
  const [error, setError] = useState("");

  const occupancy = getOccupancy(adults, children, rooms);
  const dateRangeIsValid = Boolean(checkIn && checkOut && checkOut > checkIn);
  const today = toLocalDate(new Date());
  const destinations = [...new Set(stays.map((stay) => stay.destination))];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!destination.trim()) {
      setError("Enter a destination to search for stays.");
      return;
    }
    if (!checkIn || checkIn < today || !checkOut || checkOut <= checkIn) {
      setError("Choose a valid check-in date and a later check-out date.");
      return;
    }
    if (!occupancy.isValid) {
      setError(occupancy.message);
      return;
    }

    const params = new URLSearchParams({
      destination: destination.trim(),
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
      rooms: String(rooms),
    });
    setError("");
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 sm:p-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#4a8558]">Find your stay</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Check room availability</h2>
        </div>
        <p className="text-xs font-semibold text-slate-500">Sample inventory · not live hotel availability</p>
      </div>

      <form onSubmit={submit}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_.8fr_.8fr_.8fr]">
          <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 px-3.5 py-3">
            <MapPin size={18} className="shrink-0 text-[#4a8558]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">Destination</span>
              <input
                list="stay-destinations"
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  setError("");
                }}
                placeholder="Where do you want to go?"
                aria-label="Destination"
                className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
              />
              <datalist id="stay-destinations">
                {destinations.map((item) => <option key={item} value={item} />)}
              </datalist>
            </span>
          </label>

          <label className="rounded-2xl border border-slate-200 px-3.5 py-3">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <CalendarDays size={15} /> Check-in
            </span>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value);
                setError("");
              }}
              required
              aria-label="Check-in date"
              className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
            />
          </label>

          <label className="rounded-2xl border border-slate-200 px-3.5 py-3">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <CalendarDays size={15} /> Check-out
            </span>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(event) => {
                setCheckOut(event.target.value);
                setError("");
              }}
              required
              aria-label="Check-out date"
              className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
            />
          </label>

          <label className="rounded-2xl border border-slate-200 px-3.5 py-3">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">Adults</span>
            <input
              type="number"
              min={1}
              max={12}
              value={adults}
              onChange={(event) => setAdults(Math.min(12, Math.max(1, Number(event.target.value) || 1)))}
              aria-label="Number of adults"
              className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
            />
          </label>

          <label className="rounded-2xl border border-slate-200 px-3.5 py-3">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">Children</span>
            <input
              type="number"
              min={0}
              max={8}
              value={children}
              onChange={(event) => setChildren(Math.min(8, Math.max(0, Number(event.target.value) || 0)))}
              aria-label="Number of children"
              className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
            />
          </label>

          <label className="rounded-2xl border border-slate-200 px-3.5 py-3">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">Rooms</span>
            <input
              type="number"
              min={1}
              max={8}
              value={rooms}
              onChange={(event) => setRooms(Math.min(8, Math.max(1, Number(event.target.value) || 1)))}
              aria-label="Number of rooms"
              className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {!occupancy.isValid && <p className="text-xs font-semibold text-amber-800">{occupancy.message}</p>}
            {error && <p role="alert" className="mt-1 text-xs font-semibold text-rose-700">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={!dateRangeIsValid || !occupancy.isValid}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183927] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#245239] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search size={17} /> Search available stays
          </button>
        </div>
      </form>
    </section>
  );
}
