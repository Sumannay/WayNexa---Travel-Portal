import { ArrowRight, CalendarDays, CheckCircle2, Hotel, MapPin, Plane, Users } from "lucide-react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useWayNexa } from "../context/WayNexaContext";

type ConfirmationState = {
  destination?: string;
  places?: string[];
  stay?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  estimatedCost?: number;
  bookingId?: string;
  kind?: "stay" | "flight" | "trip";
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Confirmation() {
  const location = useLocation();
  const { id } = useParams();
  const { bookings } = useWayNexa();
  const state = (location.state as ConfirmationState | null) ?? {};
  const savedBooking = bookings.find((item) => item.id === (state.bookingId ?? id));
  const details = savedBooking?.details ?? {};
  const savedId = state.bookingId ?? savedBooking?.id;

  if (!savedId) return <Navigate to="/trips" replace />;

  const destination = state.destination ?? savedBooking?.destination ?? "Destination not set";
  const places = state.places ?? (Array.isArray(details.places) ? details.places.filter((place): place is string => typeof place === "string") : []);
  const stay = state.stay ?? savedBooking?.stay ?? "Stay not selected";
  const checkIn = state.checkIn ?? savedBooking?.checkIn ?? "Not selected";
  const checkOut = state.checkOut ?? savedBooking?.checkOut ?? "Not selected";
  const rooms = state.rooms ?? (typeof details.rooms === "number" ? details.rooms : 1);
  const adults = state.adults ?? (typeof details.adults === "number" ? details.adults : 2);
  const children = state.children ?? (typeof details.children === "number" ? details.children : 0);
  const estimatedCost = state.estimatedCost
    ?? (typeof details.estimatedCost === "number" ? details.estimatedCost : savedBooking?.total ?? 0);
  const isFlight = state.kind === "flight" || savedBooking?.kind === "flight";
  const passengerCount = typeof details.passengers === "number" ? details.passengers : adults;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-2xl font-black tracking-tight text-slate-900">WayNexa</Link>
          <Link to="/trips" className="font-semibold text-slate-600 transition hover:text-slate-900">My Trips</Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={46} className="text-emerald-600" strokeWidth={2} />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">Sample plan saved</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Your trip idea is saved.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            This sample itinerary is saved in your WayNexa account. No stay, flight or transport reservation was made and no payment was collected.
          </p>
          <div className="mx-auto mt-7 inline-flex rounded-full bg-slate-100 px-5 py-3">
            <span className="text-sm font-semibold text-slate-500">Saved plan ID:</span>
            <span className="ml-2 text-sm font-black text-slate-900">{savedId}</span>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Trip details</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <InfoCard icon={<MapPin size={20} />} label="Destination" value={destination} />
            <InfoCard icon={isFlight ? <Plane size={20} /> : <Hotel size={20} />} label={isFlight ? "Flight idea" : "Stay idea"} value={stay} />
            <InfoCard icon={<CalendarDays size={20} />} label="Travel dates" value={`${checkIn} → ${checkOut}`} />
            <InfoCard
              icon={<Users size={20} />}
              label={isFlight ? "Passengers" : "Guests"}
              value={isFlight
                ? `${passengerCount} traveller${passengerCount === 1 ? "" : "s"}`
                : `${adults} Adults · ${children} Children · ${rooms} Room${rooms === 1 ? "" : "s"}`}
            />
          </div>

          {places.length > 0 && (
            <div className="mt-7 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Places selected</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {places.map((place) => (
                  <span key={place} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    {place}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-5 text-white">
            <div>
              <p className="text-sm text-slate-400">Illustrative trip estimate</p>
              <p className="mt-1 text-2xl font-black">{formatCurrency(estimatedCost)}</p>
            </div>
            <CheckCircle2 size={30} className="text-emerald-400" />
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/trips" className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 font-semibold text-white transition hover:bg-slate-700">
            View saved trips <ArrowRight size={18} />
          </Link>
          <Link to="/" className="flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-100">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1 truncate font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
