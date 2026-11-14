import {
  ArrowRight,
  Bot,
  Clock,
  Heart,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import TravelAssistantChat from "../components/TravelAssistantChat";
import StayAvailabilitySearch from "../components/StayAvailabilitySearch";
import { useWayNexa } from "../context/WayNexaContext";
import { categories, destinations, stays } from "../data/catalog";

const featuredFlights = [
  { from: "DEL", fromCity: "New Delhi", to: "SIN", toCity: "Singapore", price: 18500, time: "5h 50m", airline: "Air India" },
  { from: "BOM", fromCity: "Mumbai", to: "DXB", toCity: "Dubai", price: 21900, time: "3h 45m", airline: "Emirates" },
  { from: "BLR", fromCity: "Bengaluru", to: "DPS", toCity: "Bali", price: 24200, time: "6h 15m", airline: "Singapore Airlines" },
  { from: "DEL", fromCity: "New Delhi", to: "GOI", toCity: "Goa", price: 5490, time: "2h 35m", airline: "IndiGo" },
];

export default function Home() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, formatPrice, trackActivity } = useWayNexa();
  const [query, setQuery] = useState("");
  const isSaved = (id: string) => favorites.some((item) => item.id === id && item.kind === "destination");

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) void trackActivity("search_performed", { query: query.trim() });
    navigate(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  return (
    <main className="overflow-hidden bg-[#fbfaf7] text-slate-950">
      {/* Hero Section */}
      <section className="relative isolate min-h-[740px] overflow-hidden bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=90"
          alt="Mountain valley at sunrise"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,15,28,.86),rgba(8,15,28,.38),rgba(8,15,28,.2))]" />
        <Navbar />

        <div className="mx-auto flex min-h-[740px] max-w-7xl items-center px-5 pb-16 pt-28 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
              <Sparkles size={16} className="text-amber-300" /> Thoughtfully planned. Wonderfully yours.
            </p>
            <h1 className="mt-7 text-5xl font-black leading-[.98] tracking-[-.055em] text-white sm:text-6xl lg:text-8xl">
              Where will you<br />
              <span className="text-[#d8fbcc]">go next?</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Discover places that stay with you. WayNexa brings curated destinations, flights, exceptional stays and intelligent trip planning into one calm journey.
            </p>

            <form
              onSubmit={submitSearch}
              className="mt-9 max-w-3xl rounded-[1.35rem] bg-white p-2.5 shadow-2xl shadow-black/25 sm:flex sm:items-center"
            >
              <div className="flex flex-1 items-center gap-3 px-3 py-2.5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef8ea] text-[#387a43]">
                  <MapPin size={20} />
                </span>
                <label className="min-w-0 flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-[.15em] text-slate-400">
                    Explore anywhere
                  </span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search cities, destinations, stays, flights…"
                    className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#183927] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#245239] sm:mt-0 sm:w-auto"
              >
                <Search size={18} /> Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-white/65">
              <span>Popular:</span>
              {["Manali", "Bali", "Jaipur", "Kyoto", "Singapore"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => navigate(`/search?q=${term}`)}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white/90 transition hover:bg-white/20"
                >
                  {term}
                </button>
              ))}
              <Link to="/transport" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-bold text-[#183927] transition hover:bg-[#d8fbcc]">
                Compare travel options <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 hidden w-full max-w-7xl -translate-x-1/2 px-10 lg:flex">
          <div className="flex items-center gap-7 text-sm text-white/75">
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-[#d8fbcc]" /> Curated stays & flights
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-[#d8fbcc]" /> Curated sample travel ideas
            </span>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-8 max-w-7xl px-5 sm:px-8 lg:px-10">
        <StayAvailabilitySearch />
      </section>

      {/* Destinations Section */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#4a8558]">Start somewhere beautiful</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-.045em] sm:text-5xl">
              Places people are<br className="hidden sm:block" /> talking about.
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 font-bold text-[#245239] hover:text-[#183927]"
          >
            Explore all destinations <ArrowRight size={18} />
          </Link>
        </div>

        <div className="-mx-5 mt-11 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {destinations.slice(0, 8).map((destination) => {
            const saved = isSaved(destination.id);
            return (
              <article
                key={destination.id}
                className="group w-[min(84vw,22rem)] shrink-0 snap-start overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:w-auto sm:shrink"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <button
                    type="button"
                    aria-label={`Save ${destination.name}`}
                    onClick={() =>
                      toggleFavorite({
                        id: destination.id,
                        kind: "destination",
                        title: destination.name,
                        subtitle: `${destination.region}, ${destination.country}`,
                        image: destination.image,
                        href: `/destinations/${destination.id}`,
                      })
                    }
                    className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/90 text-slate-800 backdrop-blur hover:bg-white"
                  >
                    <Heart size={18} className={saved ? "fill-rose-500 text-rose-500" : ""} />
                  </button>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/75">{destination.category}</p>
                    <h3 className="mt-0.5 text-2xl font-black">{destination.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Star size={15} className="fill-amber-400 text-amber-400" />{" "}
                      <b className="text-slate-800">{destination.rating}</b> · {destination.places} places
                    </span>
                    <span className="font-bold text-slate-900">from {formatPrice(destination.fromPrice)}</span>
                  </div>
                  <Link
                    to={`/destinations/${destination.id}`}
                    className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-bold text-[#245239]"
                  >
                    Discover this place <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* NEW: Global Flights Spotlight */}
      <section className="bg-white border-y border-slate-200 py-20 px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#eef4e9] px-3.5 py-1 text-xs font-bold text-[#245239]">
                <Plane size={14} /> Curated Airline Fares
              </span>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Featured Flight Routes</h2>
              <p className="mt-1 text-slate-500 text-sm">Non-stop connections with baggage allowance included</p>
            </div>
            <Link
              to="/flights"
              className="inline-flex items-center gap-2 font-bold text-[#245239] hover:underline"
            >
              Search all flights <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredFlights.map((f) => (
              <div
                key={f.from + f.to}
                className="rounded-3xl border border-slate-200 p-5 bg-[#fbfaf7] hover:border-[#387a43] transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">{f.airline}</span>
                  <span className="rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 px-2 py-0.5">
                    Direct
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div>
                    <p className="text-xl font-black text-slate-900">{f.from}</p>
                    <p className="text-xs text-slate-500">{f.fromCity}</p>
                  </div>
                  <Plane size={16} className="text-[#387a43] rotate-90 mx-auto" />
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900">{f.to}</p>
                    <p className="text-xs text-slate-500">{f.toCity}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {f.time}
                  </span>
                  <span className="font-black text-base text-[#183927]">{formatPrice(f.price)}</span>
                </div>
                <Link
                  to="/flights"
                  className="mt-3 block w-full rounded-xl bg-white border border-slate-200 py-2 text-center text-xs font-bold text-slate-800 transition group-hover:bg-[#183927] group-hover:text-white"
                >
                  View Flights
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Travel Assistant Promo */}
      <section className="border-b border-[#e8ece3] bg-[#f1f6ed]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/explore?category=${encodeURIComponent(category)}`}
                className="rounded-full border border-[#cadac8] bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#4a8558] hover:bg-[#e4f2df]"
              >
                {category}
              </Link>
            ))}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#4a8558]">One question, a whole journey</p>
              <h2 className="mt-3 max-w-lg text-4xl font-black tracking-[-.045em] sm:text-5xl">
                Meet the travel assistant that actually listens.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-slate-600">
                Tell it your days, budget and the kind of memories you want to make. It turns your ideas into a grounded, editable trip plan.
              </p>
              <Link
                to="/ai-assistant"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#183927] px-5 py-3 font-bold text-white transition hover:bg-[#245239]"
              >
                <Bot size={18} /> Plan with WayNexa AI <ArrowRight size={17} />
              </Link>
            </div>
            <TravelAssistantChat compact />
          </div>
        </div>
      </section>

      {/* Stays Section */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#4a8558]">Stay well</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-.045em] sm:text-5xl">A better kind of stay.</h2>
          </div>
          <Link to="/hotels" className="hidden items-center gap-2 font-bold text-[#245239] sm:inline-flex">
            See all stays <ArrowRight size={18} />
          </Link>
        </div>
        <div className="-mx-5 mt-11 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {stays.map((stay) => (
            <article
              key={stay.id}
              className="group w-[min(84vw,24rem)] shrink-0 snap-start overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-slate-200/80 md:w-auto md:shrink"
            >
              <img
                src={stay.image}
                alt={stay.name}
                loading="lazy"
                className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#4a8558]">{stay.type}</p>
                    <h3 className="mt-1 text-xl font-black">{stay.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{stay.destination}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-800">
                    <Star size={14} className="fill-amber-400 text-amber-400" /> {stay.rating}
                  </span>
                </div>
                <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                  <p>
                    <span className="text-lg font-black">{formatPrice(stay.price)}</span>
                    <span className="text-xs text-slate-500"> / night</span>
                  </p>
                  <Link to={`/booking/${stay.id}`} className="text-sm font-bold text-[#245239]">
                    View stay
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Product highlights */}
      <section className="bg-[#183927] px-5 py-20 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#d8fbcc]">Made for your next chapter</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.045em] sm:text-5xl">
            From a saved place to a trip that feels like yours.
          </h2>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              ["Discover thoughtfully", "Browse destination guides, local places and stays in one searchable catalogue."],
              ["Plan with context", "Build an itinerary around your dates, travel style and budget."],
              ["Keep it together", "Your saved ideas and sample plans stay with your account across devices."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{description}</p>
              </article>
            ))}
          </div>
          <Link
            to="/trips/create"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#d8fbcc] px-5 py-3 text-sm font-black text-[#183927] transition hover:bg-white"
          >
            Start a trip plan <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
