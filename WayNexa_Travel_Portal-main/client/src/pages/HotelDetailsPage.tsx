import {
  AlertTriangle,
  ArrowLeft,
  Car,
  Check,
  Compass,
  Crosshair,
  Footprints,
  Heart,
  Hotel,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Star,
  Users,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import LiveHotelMap from "../components/LiveHotelMap";
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
import { getNights, getOccupancy } from "../lib/roomOccupancy";

function Counter({
  label,
  note,
  value,
  min,
  onChange,
}: {
  label: string;
  note: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3.5">
      <div>
        <p className="font-bold">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{note}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={"Decrease " + label}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid size-8 place-items-center rounded-full bg-white text-slate-700 shadow-sm"
        >
          <Minus size={15} />
        </button>
        <span className="w-5 text-center text-sm font-black">{value}</span>
        <button
          type="button"
          aria-label={"Increase " + label}
          onClick={() => onChange(value + 1)}
          className="grid size-8 place-items-center rounded-full bg-[#183927] text-white"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

export default function HotelDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const stay = stays.find((item) => item.id === id);
  const { favorites, toggleFavorite, formatPrice } = useWayNexa();

  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const roomsParam = searchParams.get("rooms");
  const adultsParam = searchParams.get("adults");
  const childrenParam = searchParams.get("children");
  const [rooms, setRooms] = useState(() => parsePositiveInteger(roomsParam, 1));
  const [adults, setAdults] = useState(() => parsePositiveInteger(adultsParam, 2));
  const [children, setChildren] = useState(() => parseNonNegativeInteger(childrenParam, 0));

  // User Location State
  const [userLocation, setUserLocation] = useState<GeoCoordinate>(
    REFERENCE_LOCATIONS.BHUBANESWAR
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locStatus, setLocStatus] = useState("Reference (Bhubaneswar)");

  if (!stay) {
    return (
      <main className="grid min-h-[65vh] place-items-center bg-[#fbfaf7] px-5 text-center">
        <div>
          <h1 className="text-3xl font-black">Stay not found</h1>
          <p className="mt-2 text-slate-500">It may no longer be included in this catalogue.</p>
          <Link
            to="/hotels"
            className="mt-6 inline-flex rounded-full bg-[#183927] px-5 py-3 text-sm font-bold text-white"
          >
            Browse stays
          </Link>
        </div>
      </main>
    );
  }

  const handleDetectGPS = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: "Your Live Location (GPS)",
        });
        setLocStatus("Live GPS Position");
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  const saved = favorites.some((item) => item.id === stay.id && item.kind === "stay");
  const occupancy = getOccupancy(adults, children, rooms, stay.childExtraBedFee);
  const hasDateRange = Boolean(checkIn || checkOut);
  const dateRangeIsValid = !hasDateRange || Boolean(checkIn && checkOut && checkOut > checkIn);
  const nights = hasDateRange && dateRangeIsValid ? getNights(checkIn, checkOut) : 1;
  const availability = getDemoAvailability(stay.id, rooms, adults, children);
  const canContinue = occupancy.isValid && availability.isAvailable && dateRangeIsValid;
  const estimatedCost = (stay.price * rooms + occupancy.childAccommodationCost) * nights;

  // Calculate Distance from User to this Hotel
  const distanceKm = calculateHaversineDistanceKm(
    userLocation.lat,
    userLocation.lng,
    stay.lat,
    stay.lng
  );
  const travelEst = estimateTravelTime(distanceKm);

  return (
    <main className="bg-[#fbfaf7] px-5 py-8 sm:px-8 lg:px-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/hotels"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft size={17} /> All stays
        </Link>

        {/* Hero Card */}
        <section className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
          <div className="grid lg:grid-cols-[1.1fr_.9fr]">
            <img src={stay.image} alt={stay.name} className="h-[340px] w-full object-cover lg:h-full" />
            <div className="p-7 sm:p-9 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[.17em] text-[#4a8558]">
                      {stay.type}
                    </span>
                    <h1 className="mt-2 text-4xl font-black tracking-[-.05em] text-slate-900">
                      {stay.name}
                    </h1>
                    <p className="mt-2 text-slate-500 flex items-center gap-1.5 text-sm">
                      <MapPin size={15} className="text-[#387a43]" /> {stay.address || `${stay.destination}, ${stay.state}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={"Save " + stay.name}
                    onClick={() =>
                      toggleFavorite({
                        id: stay.id,
                        kind: "stay",
                        title: stay.name,
                        subtitle: stay.destination,
                        image: stay.image,
                        href: "/hotels/" + stay.id,
                      })
                    }
                    className="grid size-11 place-items-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 shrink-0"
                  >
                    <Heart size={19} className={saved ? "fill-current" : ""} />
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-3 border-y border-slate-100 py-4">
                  <span className="flex items-center gap-1 text-lg font-black text-slate-900">
                    <Star size={18} className="fill-amber-400 text-amber-400" /> {stay.rating}
                  </span>
                  <span className="text-sm text-slate-500">
                    Excellent · {stay.reviews} traveller reviews
                  </span>
                </div>

                <p className="mt-5 leading-7 text-slate-600 text-sm">
                  Thoughtful spaces, personalized local service, and prime geographic positioning for exploring {stay.destination}.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {stay.amenities.map((amenity) => (
                    <p key={amenity} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="grid size-6 place-items-center rounded-full bg-[#eef4e9] text-[#387a43]">
                        <Check size={14} />
                      </span>
                      {amenity}
                    </p>
                  ))}
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="grid size-6 place-items-center rounded-full bg-[#eef4e9] text-[#387a43]">
                      <Wifi size={14} />
                    </span>
                    High-speed Wi-Fi
                  </p>
                </div>
              </div>

              {/* Live Distance Quick Callout */}
              <div className="mt-6 rounded-2xl bg-[#f1f6ed] p-4 text-xs font-semibold text-[#183927] border border-[#cadac8]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Navigation size={14} /> {formatDistance(distanceKm)} from you
                  </span>
                  <span className="text-slate-600 font-normal">({locStatus})</span>
                </div>
                <p className="mt-1 text-slate-600">{travelEst.text}</p>
              </div>
            </div>
          </div>

          {/* Room Selection & Occupancy Section */}
          <div className="border-t border-slate-200 p-6 sm:px-9">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p>
                <span className="text-3xl font-black text-slate-900">{formatPrice(stay.price)}</span>
                <span className="ml-1 text-sm text-slate-500">per room / night</span>
              </p>
              {stay.childExtraBedFee && (
                <p className="text-xs text-slate-500">
                  Child extra bed: {formatPrice(stay.childExtraBedFee)} / night
                </p>
              )}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Counter label="Rooms" note="Up to 4 guests each" value={rooms} min={1} onChange={setRooms} />
              <Counter label="Adults" note="Age 13+" value={adults} min={1} onChange={setAdults} />
              <Counter label="Children" note="Age 2–12" value={children} min={0} onChange={setChildren} />
            </div>

            <div
              className={
                "mt-4 rounded-2xl border p-4 " +
                (availability.isAvailable && dateRangeIsValid
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-amber-200 bg-amber-50 text-amber-900")
              }
            >
              <p className="text-sm font-bold">
                {dateRangeIsValid
                  ? `${availability.availableRooms} sample room${availability.availableRooms === 1 ? "" : "s"} available${hasDateRange ? ` for ${checkIn} to ${checkOut}` : ""}.`
                  : "Choose a check-in date and a later check-out date."}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                This is prototype inventory only; availability is not live or date-specific.
              </p>
              {dateRangeIsValid && !availability.isAvailable && (
                <p className="mt-1 text-xs font-semibold text-rose-700">
                  This sample listing does not have enough rooms for your request.
                </p>
              )}
            </div>

            <div
              className={
                "mt-4 rounded-2xl border p-4 " +
                (occupancy.isValid ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900")
              }
            >
              <div className="flex gap-3">
                <span className="mt-0.5">
                  {occupancy.isValid ? <Check size={18} /> : <AlertTriangle size={18} />}
                </span>
                <div>
                  <p className="text-sm font-bold">{occupancy.message}</p>
                  {!occupancy.isValid && (
                    <button
                      type="button"
                      onClick={() => setRooms(occupancy.requiredRooms)}
                      className="mt-3 rounded-full bg-amber-900 px-4 py-2 text-xs font-bold text-white"
                    >
                      Use {occupancy.requiredRooms} rooms
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-600">
                <Hotel size={16} className="mr-1 inline" /> {rooms} room{rooms === 1 ? "" : "s"} ·{" "}
                <Users size={16} className="mr-1 inline" /> {occupancy.totalGuests} guests
              </p>
              <p className="text-xl font-black text-slate-900">
                Estimated Total: {formatPrice(estimatedCost)}{" "}
                <span className="text-xs font-normal text-slate-500">
                  for {nights} night{nights === 1 ? "" : "s"}
                </span>
              </p>
            </div>

            <Link
              to={"/booking/" + stay.id}
              state={{
                stay: stay.name,
                destination: stay.destination,
                checkIn,
                checkOut,
                rooms,
                adults,
                children,
                estimatedCost,
                childExtraBedFee: occupancy.childExtraBedFee,
              }}
              aria-disabled={!canContinue}
              onClick={(event) => {
                if (!canContinue) event.preventDefault();
              }}
              className={
                "mt-5 flex items-center justify-center rounded-2xl px-6 py-4 text-sm font-black text-white transition " +
                (canContinue
                  ? "bg-[#183927] hover:bg-[#245239] shadow-lg shadow-[#183927]/20"
                  : "cursor-not-allowed bg-slate-300")
              }
            >
              {!occupancy.isValid
                ? "Add required rooms to continue"
                : !dateRangeIsValid
                  ? "Choose valid stay dates to continue"
                  : !availability.isAvailable
                    ? "No sample rooms available for this request"
                    : "Continue to Booking & Checkout"}
            </Link>
          </div>
        </section>

        {/* LIVE LOCATION & INTERACTIVE MAP STAND */}
        <section className="mt-10 rounded-[2rem] bg-white p-7 sm:p-9 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-100 pb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#387a43]">
                <Compass size={14} /> Live Hotel Stand & Travel Distances
              </span>
              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Where {stay.name} Stands
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Exact geographic coordinates: {stay.lat.toFixed(4)}°N, {stay.lng.toFixed(4)}°E
              </p>
            </div>

            {/* Live Location Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLocating}
                className="flex items-center gap-1.5 rounded-xl bg-[#183927] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#245239]"
              >
                <Crosshair size={14} />
                {isLocating ? "Locating…" : "Detect My Live GPS"}
              </button>

              <select
                onChange={(e) => {
                  const loc = REFERENCE_LOCATIONS[e.target.value];
                  if (loc) {
                    setUserLocation(loc);
                    setLocStatus(loc.name || e.target.value);
                  }
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none"
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

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            {/* Embedded Live Leaflet Map */}
            <div className="h-[420px] w-full rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-inner">
              <LiveHotelMap
                stays={[stay]}
                selectedStayId={stay.id}
                userCoords={userLocation}
                height="420px"
              />
            </div>

            {/* Distance Breakdown & Nearby Landmarks */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Distance from Your Location</h3>
                <div className="mt-3 rounded-2xl bg-[#eef4e9] p-4 text-slate-900 border border-[#cadac8]">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-[#183927]">
                      {formatDistance(distanceKm)}
                    </span>
                    <span className="text-xs font-bold text-[#387a43] bg-white px-2.5 py-1 rounded-full shadow-sm">
                      {travelEst.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-700 font-medium">
                    {travelEst.text}
                  </p>
                </div>

                {/* Landmarks Distance Table */}
                <h4 className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Nearby Landmarks & Travel Time
                </h4>
                <div className="mt-3 space-y-2.5">
                  {stay.landmarks && stay.landmarks.length > 0 ? (
                    stay.landmarks.map((landmark) => (
                      <div
                        key={landmark.name}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <span className="grid size-6 place-items-center rounded-lg bg-white shadow-sm text-slate-600">
                            {landmark.mode === "walk" ? (
                              <Footprints size={14} className="text-[#387a43]" />
                            ) : (
                              <Car size={14} className="text-blue-600" />
                            )}
                          </span>
                          <span className="font-bold text-slate-800">{landmark.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-slate-900">{landmark.distanceKm} km</span>
                          <span className="text-slate-400 text-[11px] block">
                            {landmark.timeMinutes} mins {landmark.mode}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Central location close to primary transit.</p>
                  )}
                </div>
              </div>

              {/* External Directions Link */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${stay.lat},${stay.lng}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
              >
                Open Google Maps Navigation ↗
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
