import {
  ArrowRight,
  Crosshair,
  LayoutGrid,
  Map,
  MapPin,
  Navigation,
  Search,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LiveHotelMap from "../components/LiveHotelMap";
import StayAvailabilitySearch from "../components/StayAvailabilitySearch";
import { useWayNexa } from "../context/WayNexaContext";
import { stays } from "../data/catalog";
import { getDemoAvailability, parseNonNegativeInteger, parsePositiveInteger } from "../lib/demoAvailability";
import {
  calculateHaversineDistanceKm,
  estimateTravelTime,
  formatDistance,
  REFERENCE_LOCATIONS,
  type GeoCoordinate,
} from "../lib/geoUtils";
import { getNights } from "../lib/roomOccupancy";

export default function Hotels() {
  const { formatPrice } = useWayNexa();
  const [searchParams] = useSearchParams();
  const destinationFromUrl = searchParams.get("destination") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const adults = parsePositiveInteger(searchParams.get("adults"), 2);
  const children = parseNonNegativeInteger(searchParams.get("children"), 0);
  const rooms = parsePositiveInteger(searchParams.get("rooms"), 1);
  const hasDateSearch = Boolean(checkIn || checkOut);
  const dateRangeIsValid = Boolean(checkIn && checkOut && checkOut > checkIn);
  const nights = dateRangeIsValid ? getNights(checkIn, checkOut) : 1;

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [viewMode, setViewMode] = useState<"split" | "grid">("split");
  const [sortBy, setSortBy] = useState<"recommended" | "distance" | "price_asc" | "rating">("recommended");
  const [selectedStayId, setSelectedStayId] = useState<string | null>(null);

  // User Live Geolocation State
  const [userLocation, setUserLocation] = useState<GeoCoordinate | null>(() => {
    // Default reference is Bhubaneswar (or New Delhi)
    return { ...REFERENCE_LOCATIONS.BHUBANESWAR, name: "Reference Location (Bhubaneswar)" };
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("Reference mode (Bhubaneswar)");

  const types = ["All", ...new Set(stays.map((stay) => stay.type))];

  // Detect Live Device GPS
  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    setLocationStatus("Detecting your GPS position…");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const coords: GeoCoordinate = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: "Your Live Location (GPS)",
        };
        setUserLocation(coords);
        setLocationStatus("Live GPS location active!");
      },
      (error) => {
        setIsLocating(false);
        setLocationStatus(`Could not access GPS (${error.message}). Using selected reference city.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectReferenceCity = (cityKey: string) => {
    const loc = REFERENCE_LOCATIONS[cityKey];
    if (loc) {
      setUserLocation(loc);
      setLocationStatus(`Calculated from ${loc.name}`);
    }
  };

  // Filter and Sort Stays
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    const destinationTerm = destinationFromUrl.trim().toLowerCase();
    const list = stays.filter(
      (stay) =>
        (type === "All" || stay.type === type) &&
        (!destinationTerm ||
          [stay.name, stay.destination, stay.district, stay.state]
            .join(" ")
            .toLowerCase()
            .includes(destinationTerm)) &&
        (!term ||
          [stay.name, stay.destination, stay.district, stay.state, stay.type, stay.address]
            .join(" ")
            .toLowerCase()
            .includes(term))
    );

    // Apply sorting
    if (sortBy === "distance" && userLocation) {
      list.sort((a, b) => {
        const distA = calculateHaversineDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateHaversineDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    } else if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [destinationFromUrl, query, sortBy, type, userLocation]);

  const availableStayCount = visible.filter(
    (stay) => getDemoAvailability(stay.id, rooms, adults, children).isAvailable,
  ).length;
  const detailsParams = new URLSearchParams(searchParams);
  const detailsQuery = detailsParams.toString();
  const detailsSuffix = detailsQuery ? `?${detailsQuery}` : "";

  return (
    <main className="min-h-screen bg-[#fbfaf7] pb-16 text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#183927] px-5 py-14 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#d8fbcc]">
                <MapPin size={14} /> Live Hotel Stand & Distance Explorer
              </span>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Find Stays. Track Exact Distances.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Inspect where each hotel stands on the interactive map, calculate live travel distances from your location, and preview routes to top landmarks.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-1.5 backdrop-blur">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  viewMode === "split"
                    ? "bg-white text-slate-950 shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Map size={15} /> Split Map View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  viewMode === "grid"
                    ? "bg-white text-slate-950 shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <LayoutGrid size={15} /> Grid Only
              </button>
            </div>
          </div>

          {/* Search & Location Bar */}
          <div className="mt-8 grid gap-3 rounded-2xl bg-white p-3 shadow-xl text-slate-900 md:grid-cols-[1fr_auto]">
            {/* Search Input */}
            <label className="flex items-center gap-3 px-3">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search stays by name or location"
                placeholder="Search by hotel name, Puri, Konark, Manali, Bali…"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-slate-400"
              />
            </label>

            {/* Live GPS & Reference City Selector */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDetectLiveLocation}
                disabled={isLocating}
                className="flex items-center gap-1.5 rounded-xl bg-[#eef4e9] px-3.5 py-2.5 text-xs font-bold text-[#183927] transition hover:bg-[#dfeeda] disabled:opacity-60"
              >
                <Navigation size={14} className={isLocating ? "animate-spin" : ""} />
                {isLocating ? "Detecting…" : "Detect My GPS"}
              </button>

              <select
                onChange={(e) => handleSelectReferenceCity(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="BHUBANESWAR">From Bhubaneswar</option>
                <option value="DELHI">From New Delhi</option>
                <option value="MUMBAI">From Mumbai</option>
                <option value="BENGALURU">From Bengaluru</option>
                <option value="KOLKATA">From Kolkata</option>
                <option value="LONDON">From London</option>
                <option value="TOKYO">From Tokyo</option>
              </select>
            </div>
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs text-white/70">
            <Crosshair size={13} className="text-[#d8fbcc]" /> {locationStatus}
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-7 max-w-7xl px-5 sm:px-8 lg:px-10">
        <StayAvailabilitySearch key={searchParams.toString()} />
      </section>

      {/* Main Stays Explorer Section */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {hasDateSearch && (
          <div className="mb-5 rounded-2xl border border-[#cadac8] bg-[#eef4e9] p-4 text-sm text-[#183927]">
            {dateRangeIsValid ? (
              <>
                <p className="font-bold">
                  Sample availability for {checkIn} to {checkOut} · {nights} night{nights === 1 ? "" : "s"} ·{" "}
                  {adults + children} guest{adults + children === 1 ? "" : "s"} · {rooms} room{rooms === 1 ? "" : "s"}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {availableStayCount} of {visible.length} matching stays have enough sample rooms. Counts are not live or date-specific.
                </p>
              </>
            ) : (
              <p role="alert" className="font-bold">Choose a check-in date and a later check-out date to check availability.</p>
            )}
          </div>
        )}

        {/* Category & Sort Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {types.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setType(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                  type === item
                    ? "bg-[#183927] text-white shadow-sm"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(event) => {
                const value = event.currentTarget.value;
                if (value === "recommended" || value === "distance" || value === "price_asc" || value === "rating") {
                  setSortBy(value);
                }
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="distance">Closest to Me (Distance)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* View Layout Switcher */}
        {viewMode === "split" ? (
          /* SPLIT VIEW (List on Left, Interactive Live Map on Right) */
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1.3fr] items-start">
            {/* Scrollable Hotels List */}
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:block lg:max-h-[820px] lg:space-y-4 lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0 lg:pr-2">
              <p className="text-xs font-bold text-slate-500">
                Found <span className="text-[#183927] font-black">{visible.length} stays</span> · Click a stay to center map
              </p>

              {visible.length === 0 && (
                <p role="status" className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
                  No stays match this search. Try another destination or clear the stay type filter.
                </p>
              )}

              {visible.map((stay) => {
                const isSelected = stay.id === selectedStayId;
                const availability = getDemoAvailability(stay.id, rooms, adults, children);
                const distKm = userLocation
                  ? calculateHaversineDistanceKm(userLocation.lat, userLocation.lng, stay.lat, stay.lng)
                  : null;
                const travelEst = distKm !== null ? estimateTravelTime(distKm) : null;

                return (
                  <article
                    key={stay.id}
                    onClick={() => setSelectedStayId(stay.id)}
                    className={`w-[min(84vw,26rem)] shrink-0 snap-start cursor-pointer overflow-hidden rounded-3xl bg-white p-4 shadow-sm ring-1 transition duration-200 hover:shadow-lg lg:w-auto lg:shrink ${
                      isSelected
                        ? "ring-2 ring-[#183927] bg-[#fbfdfa]"
                        : "ring-slate-200"
                    }`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={stay.image}
                        alt={stay.name}
                        className="size-32 rounded-2xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#387a43]">
                                {stay.type}
                              </span>
                              <h3 className="text-base font-black text-slate-900 truncate">{stay.name}</h3>
                              <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                                <MapPin size={12} className="text-slate-400 shrink-0" />
                                {stay.destination}, {stay.state}
                              </p>
                            </div>
                            <span className="flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800">
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              {stay.rating}
                            </span>
                          </div>

                          {/* Live Distance Tracker Badge */}
                          {distKm !== null && travelEst && (
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#eef4e9] px-2.5 py-1 text-[11px] font-bold text-[#183927]">
                              <Navigation size={12} />
                              <span>{formatDistance(distKm)} from you</span>
                              <span className="text-slate-500 font-normal">({travelEst.text})</span>
                            </div>
                          )}
                          {dateRangeIsValid && (
                            <p className={`mt-2 text-xs font-bold ${availability.isAvailable ? "text-emerald-700" : "text-rose-700"}`}>
                              {availability.isAvailable
                                ? `${availability.availableRooms} sample room${availability.availableRooms === 1 ? "" : "s"} available`
                                : `Not enough sample rooms for ${rooms} requested`}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-2.5">
                          <p>
                            <span className="text-base font-black text-slate-900">
                              {formatPrice(dateRangeIsValid && availability.isAvailable
                                ? stay.price * rooms * nights
                                : stay.price)}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {dateRangeIsValid && availability.isAvailable
                                ? ` estimated for ${nights} night${nights === 1 ? "" : "s"}`
                                : " / night"}
                            </span>
                          </p>
                          <Link
                            to={`/hotels/${stay.id}${detailsSuffix}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#245239] hover:underline"
                          >
                            Details & Rooms <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Interactive Leaflet Live Map */}
            <div className="sticky top-24 h-[800px] w-full">
              <LiveHotelMap
                stays={visible}
                selectedStayId={selectedStayId}
                onSelectStay={(stay) => setSelectedStayId(stay.id)}
                userCoords={userLocation}
                height="800px"
              />
            </div>
          </div>
        ) : (
          /* STANDARD GRID VIEW */
          <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {visible.length === 0 && (
              <p role="status" className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200 sm:col-span-2 lg:col-span-3">
                No stays match this search. Try another destination or clear the stay type filter.
              </p>
            )}
            {visible.map((stay) => {
              const availability = getDemoAvailability(stay.id, rooms, adults, children);
              const distKm = userLocation
                ? calculateHaversineDistanceKm(userLocation.lat, userLocation.lng, stay.lat, stay.lng)
                : null;
              const travelEst = distKm !== null ? estimateTravelTime(distKm) : null;

              return (
                <article
                  key={stay.id}
                  className="w-[min(84vw,24rem)] shrink-0 snap-start overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-xl sm:w-auto sm:shrink"
                >
                  <div className="relative">
                    <img src={stay.image} alt={stay.name} className="h-56 w-full object-cover" />
                    <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-black text-slate-900 backdrop-blur">
                      <Star size={13} className="fill-amber-400 text-amber-400" /> {stay.rating}
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#387a43]">
                      {stay.type}
                    </span>
                    <h3 className="mt-1 text-lg font-black text-slate-900">{stay.name}</h3>
                    <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      {stay.destination}, {stay.state}
                    </p>
                    {dateRangeIsValid && (
                      <p className={`mt-2 text-xs font-bold ${availability.isAvailable ? "text-emerald-700" : "text-rose-700"}`}>
                        {availability.isAvailable
                          ? `${availability.availableRooms} sample room${availability.availableRooms === 1 ? "" : "s"} available`
                          : `Not enough sample rooms for ${rooms} requested`}
                      </p>
                    )}

                    {/* Live Distance Info */}
                    {distKm !== null && travelEst && (
                      <div className="mt-3 rounded-xl bg-[#eef4e9] p-2.5 text-xs text-[#245239]">
                        <p className="font-bold flex items-center gap-1">
                          <Navigation size={13} /> {formatDistance(distKm)} away
                        </p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{travelEst.text}</p>
                      </div>
                    )}

                    {/* Key Landmark */}
                    {stay.landmarks?.[0] && (
                      <p className="mt-2.5 text-xs text-slate-500">
                        📍 {stay.landmarks[0].distanceKm} km from {stay.landmarks[0].name}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <p>
                        <span className="text-xl font-black text-slate-900">
                          {formatPrice(dateRangeIsValid && availability.isAvailable
                            ? stay.price * rooms * nights
                            : stay.price)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {dateRangeIsValid && availability.isAvailable
                            ? ` estimated for ${nights} night${nights === 1 ? "" : "s"}`
                            : " / night"}
                        </span>
                      </p>
                      <Link
                        to={`/hotels/${stay.id}${detailsSuffix}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#183927] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#245239]"
                      >
                        View Stay <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
