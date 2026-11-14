import { ArrowLeftRight, Bike, BusFront, CalendarDays, Clock3, MapPin, Plane, Search, TrainFront, Users } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

type TravelMode = "flight" | "train" | "bus" | "taxi" | "bike";
type ModeFilter = "all" | TravelMode;

type CityHub = {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  mainland: boolean;
};

const cityHubs: CityHub[] = [
  { city: "Visakhapatnam", region: "Andhra Pradesh", latitude: 17.6868, longitude: 83.2185, mainland: true },
  { city: "Itanagar", region: "Arunachal Pradesh", latitude: 27.0844, longitude: 93.6053, mainland: true },
  { city: "Guwahati", region: "Assam", latitude: 26.1445, longitude: 91.7362, mainland: true },
  { city: "Patna", region: "Bihar", latitude: 25.5941, longitude: 85.1376, mainland: true },
  { city: "Raipur", region: "Chhattisgarh", latitude: 21.2514, longitude: 81.6296, mainland: true },
  { city: "Panaji", region: "Goa", latitude: 15.4909, longitude: 73.8278, mainland: true },
  { city: "Ahmedabad", region: "Gujarat", latitude: 23.0225, longitude: 72.5714, mainland: true },
  { city: "Gurugram", region: "Haryana", latitude: 28.4595, longitude: 77.0266, mainland: true },
  { city: "Shimla", region: "Himachal Pradesh", latitude: 31.1048, longitude: 77.1734, mainland: true },
  { city: "Ranchi", region: "Jharkhand", latitude: 23.3441, longitude: 85.3096, mainland: true },
  { city: "Bengaluru", region: "Karnataka", latitude: 12.9716, longitude: 77.5946, mainland: true },
  { city: "Kochi", region: "Kerala", latitude: 9.9312, longitude: 76.2673, mainland: true },
  { city: "Bhopal", region: "Madhya Pradesh", latitude: 23.2599, longitude: 77.4126, mainland: true },
  { city: "Mumbai", region: "Maharashtra", latitude: 19.076, longitude: 72.8777, mainland: true },
  { city: "Imphal", region: "Manipur", latitude: 24.817, longitude: 93.9368, mainland: true },
  { city: "Shillong", region: "Meghalaya", latitude: 25.5788, longitude: 91.8933, mainland: true },
  { city: "Aizawl", region: "Mizoram", latitude: 23.7271, longitude: 92.7176, mainland: true },
  { city: "Kohima", region: "Nagaland", latitude: 25.6751, longitude: 94.1086, mainland: true },
  { city: "Bhubaneswar", region: "Odisha", latitude: 20.2961, longitude: 85.8245, mainland: true },
  { city: "Amritsar", region: "Punjab", latitude: 31.634, longitude: 74.8723, mainland: true },
  { city: "Jaipur", region: "Rajasthan", latitude: 26.9124, longitude: 75.7873, mainland: true },
  { city: "Gangtok", region: "Sikkim", latitude: 27.3314, longitude: 88.6138, mainland: true },
  { city: "Chennai", region: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707, mainland: true },
  { city: "Hyderabad", region: "Telangana", latitude: 17.385, longitude: 78.4867, mainland: true },
  { city: "Agartala", region: "Tripura", latitude: 23.8315, longitude: 91.2868, mainland: true },
  { city: "Lucknow", region: "Uttar Pradesh", latitude: 26.8467, longitude: 80.9462, mainland: true },
  { city: "Dehradun", region: "Uttarakhand", latitude: 30.3165, longitude: 78.0322, mainland: true },
  { city: "Kolkata", region: "West Bengal", latitude: 22.5726, longitude: 88.3639, mainland: true },
  { city: "Sri Vijaya Puram", region: "Andaman & Nicobar Islands", latitude: 11.6234, longitude: 92.7265, mainland: false },
  { city: "Chandigarh", region: "Chandigarh", latitude: 30.7333, longitude: 76.7794, mainland: true },
  { city: "Silvassa", region: "Dadra and Nagar Haveli and Daman and Diu", latitude: 20.2766, longitude: 73.0083, mainland: true },
  { city: "New Delhi", region: "Delhi", latitude: 28.6139, longitude: 77.209, mainland: true },
  { city: "Srinagar", region: "Jammu & Kashmir", latitude: 34.0837, longitude: 74.7973, mainland: true },
  { city: "Leh", region: "Ladakh", latitude: 34.1526, longitude: 77.5771, mainland: true },
  { city: "Agatti", region: "Lakshadweep", latitude: 10.8505, longitude: 72.1933, mainland: false },
  { city: "Puducherry", region: "Puducherry", latitude: 11.9416, longitude: 79.8083, mainland: true },
];

const modes: { id: TravelMode; label: string; icon: typeof Plane }[] = [
  { id: "flight", label: "Flights", icon: Plane },
  { id: "train", label: "Trains", icon: TrainFront },
  { id: "bus", label: "Buses", icon: BusFront },
  { id: "taxi", label: "Taxis", icon: MapPin },
  { id: "bike", label: "Bike / scooter", icon: Bike },
];

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

function distanceBetween(from: CityHub, to: CityHub) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDifference = radians(to.latitude - from.latitude);
  const longitudeDifference = radians(to.longitude - from.longitude);
  const earthRadiusKm = 6371;
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) *
    Math.sin(longitudeDifference / 2) ** 2;
  return Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)));
}

function estimateDuration(distanceKm: number, averageSpeedKmh: number, extraMinutes = 0) {
  const totalMinutes = Math.max(30, Math.round(distanceKm / averageSpeedKmh * 60) + extraMinutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getEstimate(mode: TravelMode, distanceKm: number, mainlandRoute: boolean, passengers: number) {
  if (mode === "flight") {
    if (distanceKm < 300) return null;
    return { price: Math.round(Math.max(2800, distanceKm * 5.2)) * passengers, duration: estimateDuration(distanceKm, 650, 120), label: "Illustrative one-way airfare" };
  }
  if (mode === "train") {
    if (!mainlandRoute || distanceKm < 30) return null;
    return { price: Math.round(Math.max(120, distanceKm * 1.15)) * passengers, duration: estimateDuration(distanceKm, 58), label: "Illustrative rail fare" };
  }
  if (mode === "bus") {
    if (!mainlandRoute || distanceKm < 15) return null;
    return { price: Math.round(Math.max(100, distanceKm * 1.35)) * passengers, duration: estimateDuration(distanceKm, 48), label: "Illustrative bus fare" };
  }
  if (mode === "taxi") {
    if (!mainlandRoute || distanceKm > 1200) return null;
    return { price: Math.round(250 + distanceKm * 15), duration: estimateDuration(distanceKm, 42), label: "Illustrative private cab fare" };
  }
  return { price: 700, duration: "Per day", label: "Illustrative local hire per bike" };
}

export default function Transport() {
  const [origin, setOrigin] = useState("Mumbai");
  const [destination, setDestination] = useState("Panaji");
  const [departureDate, setDepartureDate] = useState(today);
  const [passengers, setPassengers] = useState(1);
  const [activeMode, setActiveMode] = useState<ModeFilter>("all");
  const [searched, setSearched] = useState({ origin: "Mumbai", destination: "Panaji", departureDate: today(), passengers: 1 });
  const [formError, setFormError] = useState("");

  const fromHub = cityHubs.find((hub) => hub.city === searched.origin);
  const toHub = cityHubs.find((hub) => hub.city === searched.destination);
  const routeDistance = fromHub && toHub ? distanceBetween(fromHub, toHub) : 0;
  const mainlandRoute = Boolean(fromHub?.mainland && toHub?.mainland);
  const options = useMemo(() => modes.flatMap((mode) => {
    const estimate = getEstimate(mode.id, routeDistance, mainlandRoute, searched.passengers);
    return estimate ? [{ ...mode, ...estimate }] : [];
  }), [mainlandRoute, routeDistance, searched.passengers]);
  const visibleOptions = activeMode === "all" ? options : options.filter((option) => option.id === activeMode);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (origin === destination) {
      setFormError("Choose two different cities to compare travel options.");
      return;
    }
    if (departureDate < today()) {
      setFormError("Choose today or a future departure date.");
      return;
    }
    setFormError("");
    setSearched({ origin, destination, departureDate, passengers });
  };

  return (
    <main className="min-h-screen bg-[#fbfaf7] pb-20 text-slate-900">
      <section className="bg-[#183927] px-5 py-14 text-white sm:px-8 sm:py-18 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#d8fbcc]">
            <MapPin size={15} /> India travel planner
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl">Compare ways to get there.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
            Explore sample flight, train, bus, cab and local bike-hire estimates for routes between curated Indian travel hubs.
          </p>

          <form onSubmit={handleSearch} className="mt-9 rounded-3xl bg-white p-5 text-slate-900 shadow-xl sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] lg:items-end">
              <label className="min-w-0 text-xs font-bold uppercase tracking-wider text-slate-500">
                From
                <select required value={origin} onChange={(event) => setOrigin(event.target.value)} className="mt-2 block min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal text-slate-900">
                  {cityHubs.map((hub) => <option key={hub.city} value={hub.city}>{hub.city} · {hub.region}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => { setOrigin(destination); setDestination(origin); }} aria-label="Swap departure and destination" className="hidden size-11 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 lg:grid"><ArrowLeftRight size={18} /></button>
              <label className="min-w-0 text-xs font-bold uppercase tracking-wider text-slate-500">
                To
                <select required value={destination} onChange={(event) => setDestination(event.target.value)} className="mt-2 block min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal text-slate-900">
                  {cityHubs.map((hub) => <option key={hub.city} value={hub.city}>{hub.city} · {hub.region}</option>)}
                </select>
              </label>
              <label className="min-w-0 text-xs font-bold uppercase tracking-wider text-slate-500">
                Travel date
                <input type="date" min={today()} required value={departureDate} onChange={(event) => setDepartureDate(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-900" />
              </label>
              <label className="min-w-0 text-xs font-bold uppercase tracking-wider text-slate-500">
                Travellers
                <span className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                  <Users size={16} /><span className="text-sm font-bold normal-case tracking-normal">{passengers}</span>
                  <span className="flex gap-2">
                    <button type="button" aria-label="Remove traveller" onClick={() => setPassengers((current) => Math.max(1, current - 1))} className="grid size-7 place-items-center rounded-lg bg-slate-100 text-base">−</button>
                    <button type="button" aria-label="Add traveller" onClick={() => setPassengers((current) => Math.min(9, current + 1))} className="grid size-7 place-items-center rounded-lg bg-slate-100 text-base">+</button>
                  </span>
                </span>
              </label>
              <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#183927] px-5 text-sm font-black text-white hover:bg-[#245239]">
                <Search size={17} /> Search
              </button>
            </div>
            {formError && <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">{formError}</p>}
            <p className="mt-4 text-xs leading-5 text-slate-500">Sample routes are based on approximate city-to-city distance. No transport operator, live timetable, availability, or booking service is connected.</p>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-wrap gap-2">
          {([{ id: "all", label: "All options", icon: MapPin }, ...modes] as { id: ModeFilter; label: string; icon: typeof Plane }[]).map((mode) => {
            const Icon = mode.icon;
            return (
              <button key={mode.id} type="button" onClick={() => setActiveMode(mode.id)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${activeMode === mode.id ? "bg-[#183927] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}>
                <Icon size={16} /> {mode.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#4a8558]">Illustrative sample results</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{searched.origin} to {searched.destination}</h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> About {routeDistance.toLocaleString("en-IN")} km</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {new Date(`${searched.departureDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">{searched.passengers} traveller{searched.passengers > 1 ? "s" : ""} · Sample only</span>
        </div>

        {visibleOptions.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <article key={option.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[#eef4e9] text-[#245239]"><Icon size={21} /></span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">Estimate</span>
                  </div>
                  <h3 className="mt-5 text-xl font-black">{option.label}</h3>
                  <p className="mt-1 text-sm text-slate-500">{option.id === "bike" ? `Local pickup in ${searched.destination}` : `${searched.origin} → ${searched.destination}`}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div><p className="text-xs font-semibold text-slate-500">{option.label}</p><p className="mt-1 text-2xl font-black text-[#183927]">{formatPrice(option.price)}{option.id === "bike" ? "/day" : ""}</p></div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600"><Clock3 size={15} />{option.duration}</span>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-slate-500">Illustrative planning estimate only. Confirm actual fares, routes, schedules, safety and availability directly with a licensed operator.</p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-slate-200">
            <MapPin size={28} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-xl font-black">No sample option for this route and mode.</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">Some islands do not have direct mainland road or rail links, and local bike hire is shown at the destination rather than as an intercity trip. Check official operators for current connections.</p>
          </div>
        )}
      </section>
    </main>
  );
}
