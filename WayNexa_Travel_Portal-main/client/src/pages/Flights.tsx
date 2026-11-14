import {
  ArrowRight,
  ArrowRightLeft,
  Calendar,
  Check,
  Clock,
  Filter,
  Luggage,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWayNexa } from "../context/WayNexaContext";
import type { Flight } from "../types/domain";

const AIRPORTS = [
  { code: "DEL", city: "New Delhi", country: "India", airport: "Indira Gandhi Int'l (DEL)" },
  { code: "BOM", city: "Mumbai", country: "India", airport: "Chhatrapati Shivaji Maharaj (BOM)" },
  { code: "BLR", city: "Bengaluru", country: "India", airport: "Kempegowda Int'l (BLR)" },
  { code: "GOI", city: "Goa", country: "India", airport: "Dabolim / Mopa (GOI)" },
  { code: "DXB", city: "Dubai", country: "UAE", airport: "Dubai Int'l (DXB)" },
  { code: "SIN", city: "Singapore", country: "Singapore", airport: "Changi Airport (SIN)" },
  { code: "LHR", city: "London", country: "UK", airport: "Heathrow Airport (LHR)" },
  { code: "JFK", city: "New York", country: "USA", airport: "John F. Kennedy (JFK)" },
  { code: "HND", city: "Tokyo", country: "Japan", airport: "Tokyo Haneda (HND)" },
  { code: "DPS", city: "Bali", country: "Indonesia", airport: "Ngurah Rai Int'l (DPS)" },
  { code: "CDG", city: "Paris", country: "France", airport: "Charles de Gaulle (CDG)" },
];

const INITIAL_FLIGHTS: Flight[] = [
  {
    id: "fl-101",
    airline: "Air India",
    airlineCode: "AI",
    flightNumber: "AI-308",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Singapore",
    toCode: "SIN",
    departureTime: "08:30 AM",
    arrivalTime: "04:50 PM",
    duration: "5h 50m",
    stops: 0,
    price: 18500,
    cabinClass: "Economy",
    baggage: "25 kg check-in · 7 kg cabin",
    amenities: ["Complimentary Meal", "USB Power", "Entertainment Screen"],
    availableSeats: 9,
  },
  {
    id: "fl-102",
    airline: "Singapore Airlines",
    airlineCode: "SQ",
    flightNumber: "SQ-403",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Singapore",
    toCode: "SIN",
    departureTime: "09:45 AM",
    arrivalTime: "06:10 PM",
    duration: "5h 55m",
    stops: 0,
    price: 24900,
    cabinClass: "Economy",
    baggage: "30 kg check-in · 7 kg cabin",
    amenities: ["High-speed Wi-Fi", "Gourmet Dining", "KrisWorld Entertainment", "Seat Power"],
    availableSeats: 5,
  },
  {
    id: "fl-103",
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK-511",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Dubai",
    toCode: "DXB",
    departureTime: "11:15 AM",
    arrivalTime: "01:45 PM",
    duration: "4h 00m",
    stops: 0,
    price: 22800,
    cabinClass: "Economy",
    baggage: "30 kg check-in · 7 kg cabin",
    amenities: ["ice Entertainment 6500+ channels", "Multi-course meal", "Wi-Fi onboard"],
    availableSeats: 14,
  },
  {
    id: "fl-104",
    airline: "IndiGo",
    airlineCode: "6E",
    flightNumber: "6E-1401",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Goa",
    toCode: "GOI",
    departureTime: "06:10 AM",
    arrivalTime: "08:45 AM",
    duration: "2h 35m",
    stops: 0,
    price: 5490,
    cabinClass: "Economy",
    baggage: "15 kg check-in · 7 kg cabin",
    amenities: ["Snack on order", "Standard seating", "On-time guarantee"],
    availableSeats: 22,
  },
  {
    id: "fl-105",
    airline: "Vistara / Air India Express",
    airlineCode: "UK",
    flightNumber: "UK-823",
    fromCity: "Mumbai",
    fromCode: "BOM",
    toCity: "New Delhi",
    toCode: "DEL",
    departureTime: "02:15 PM",
    arrivalTime: "04:30 PM",
    duration: "2h 15m",
    stops: 0,
    price: 4900,
    cabinClass: "Economy",
    baggage: "15 kg check-in · 7 kg cabin",
    amenities: ["Hot meal included", "Vistara World Streaming", "Extra legroom options"],
    availableSeats: 11,
  },
  {
    id: "fl-106",
    airline: "Qatar Airways",
    airlineCode: "QR",
    flightNumber: "QR-571",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "London",
    toCode: "LHR",
    departureTime: "03:50 AM",
    arrivalTime: "01:25 PM",
    duration: "9h 35m",
    stops: 1,
    price: 48900,
    cabinClass: "Economy",
    baggage: "2 x 23 kg check-in · 7 kg cabin",
    amenities: ["Oryx One entertainment", "Doha Hamad transfer", "Chef-crafted dining"],
    availableSeats: 7,
  },
  {
    id: "fl-107",
    airline: "Japan Airlines",
    airlineCode: "JL",
    flightNumber: "JL-750",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Tokyo",
    toCode: "HND",
    departureTime: "07:20 PM",
    arrivalTime: "06:40 AM (+1)",
    duration: "7h 50m",
    stops: 0,
    price: 54200,
    cabinClass: "Economy",
    baggage: "2 x 23 kg check-in · 10 kg cabin",
    amenities: ["Japanese Omotenashi hospitality", "Spacious JAL SKY WIDER seats", "Wi-Fi"],
    availableSeats: 4,
  },
  {
    id: "fl-108",
    airline: "Garuda Indonesia",
    airlineCode: "GA",
    flightNumber: "GA-882",
    fromCity: "Singapore",
    fromCode: "SIN",
    toCity: "Bali",
    toCode: "DPS",
    departureTime: "11:50 AM",
    arrivalTime: "02:35 PM",
    duration: "2h 45m",
    stops: 0,
    price: 13200,
    cabinClass: "Economy",
    baggage: "20 kg check-in · 7 kg cabin",
    amenities: ["Traditional Indonesian meal", "Audio-video on demand", "Priority boarding"],
    availableSeats: 16,
  },
];

export default function Flights() {
  const navigate = useNavigate();
  const { formatPrice, confirmBooking, user } = useWayNexa();

  // Search states
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("roundtrip");
  const [origin, setOrigin] = useState("DEL");
  const [destination, setDestination] = useState("SIN");
  const [departureDate, setDepartureDate] = useState("2026-11-15");
  const [returnDate, setReturnDate] = useState("2026-11-22");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<"Economy" | "Premium Economy" | "Business">("Economy");

  // Filter states
  const [selectedStops, setSelectedStops] = useState<number | "all">("all");
  const [selectedAirline, setSelectedAirline] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"cheapest" | "fastest">("cheapest");

  // Booking Modal
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const swapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const filteredFlights = useMemo(() => {
    let list = [...INITIAL_FLIGHTS];

    // Filter by stops
    if (selectedStops !== "all") {
      list = list.filter((f) => f.stops === selectedStops);
    }

    // Filter by airline
    if (selectedAirline !== "all") {
      list = list.filter((f) => f.airline === selectedAirline);
    }

    // Sort
    if (sortBy === "cheapest") {
      list.sort((a, b) => a.price - b.price);
    } else {
      list.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
    }

    return list;
  }, [selectedAirline, selectedStops, sortBy]);

  const originAirport = AIRPORTS.find((a) => a.code === origin);
  const destAirport = AIRPORTS.find((a) => a.code === destination);

  const handleBook = (flight: Flight) => {
    setSelectedFlight(flight);
  };

  const handleConfirmFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlight) return;
    if (!user) {
      navigate("/login", { state: { from: "/flights" } });
      return;
    }
    setIsSubmitting(true);
    setBookingError("");
    const bookingTotal = selectedFlight.price * passengers;
    try {
      const booking = await confirmBooking({
        destination: `${selectedFlight.toCity} (${selectedFlight.toCode})`,
        stay: `${selectedFlight.airline} - ${selectedFlight.flightNumber}`,
        checkIn: departureDate,
        checkOut: tripType === "roundtrip" ? returnDate : departureDate,
        total: bookingTotal,
        kind: "flight",
        details: {
          flightNumber: selectedFlight.flightNumber,
          airline: selectedFlight.airline,
          from: `${selectedFlight.fromCity} (${selectedFlight.fromCode})`,
          to: `${selectedFlight.toCity} (${selectedFlight.toCode})`,
          passengers,
          cabinClass,
        },
      });
      setSelectedFlight(null);
      navigate(`/confirmation/${booking.id}`, {
        state: {
          destination: `${selectedFlight.toCity} (${selectedFlight.toCode})`,
          stay: `${selectedFlight.airline} - ${selectedFlight.flightNumber}`,
          checkIn: departureDate,
          checkOut: tripType === "roundtrip" ? returnDate : departureDate,
          estimatedCost: bookingTotal,
          adults: passengers,
          children: 0,
          rooms: 0,
          bookingId: booking.id,
          kind: "flight",
        },
      });
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "The sample flight plan could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfaf7] pb-24 text-slate-900">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#183927] px-5 pb-16 pt-12 text-white sm:px-8 lg:px-10">
        <div className="absolute right-0 top-0 h-96 w-96 translate-x-20 -translate-y-20 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#d8fbcc]">
                <Plane size={14} /> Global Flight Discovery
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Compare sample flight ideas.
              </h1>
              <p className="mt-2 text-white/70">
                Explore illustrative routes and estimates. Live schedules, fares and ticketing are not connected.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#d8fbcc]">
                <ShieldCheck size={16} /> Sample route catalogue
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-white/75">
                <Clock size={16} /> No ticketing
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200/50 text-slate-900">
            {/* Trip Type Selector */}
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
              <button
                type="button"
                onClick={() => setTripType("roundtrip")}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  tripType === "roundtrip"
                    ? "bg-[#183927] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Round Trip
              </button>
              <button
                type="button"
                onClick={() => setTripType("oneway")}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  tripType === "oneway"
                    ? "bg-[#183927] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                One Way
              </button>

              <div className="ml-auto flex items-center gap-3">
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as typeof cabinClass)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                </select>

                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
                  <Users size={14} className="text-slate-400" />
                  <span>{passengers} Traveler{passengers > 1 ? "s" : ""}</span>
                  <div className="ml-1 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="size-5 rounded bg-slate-100 text-center font-bold hover:bg-slate-200"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.min(9, passengers + 1))}
                      className="size-5 rounded bg-slate-100 text-center font-bold hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Origin */}
              <div className="relative rounded-2xl border border-slate-200 p-3.5 transition focus-within:border-[#245239] focus-within:ring-2 focus-within:ring-[#245239]/10">
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <PlaneTakeoff size={13} /> From
                </span>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="mt-1 w-full bg-transparent text-base font-black text-slate-900 outline-none cursor-pointer"
                >
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.city} ({a.code})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 truncate">{originAirport?.airport}</p>
              </div>

              {/* Destination */}
              <div className="relative rounded-2xl border border-slate-200 p-3.5 transition focus-within:border-[#245239] focus-within:ring-2 focus-within:ring-[#245239]/10">
                <button
                  type="button"
                  onClick={swapAirports}
                  title="Swap airports"
                  className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-10 hidden lg:grid size-7 place-items-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-600"
                >
                  <ArrowRightLeft size={12} />
                </button>
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <PlaneLanding size={13} /> To
                </span>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="mt-1 w-full bg-transparent text-base font-black text-slate-900 outline-none cursor-pointer"
                >
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code} disabled={a.code === origin}>
                      {a.city} ({a.code})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 truncate">{destAirport?.airport}</p>
              </div>

              {/* Dates */}
              <div className="rounded-2xl border border-slate-200 p-3.5">
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <Calendar size={13} /> Departure
                </span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-black text-slate-900 outline-none"
                />
              </div>

              {tripType === "roundtrip" ? (
                <div className="rounded-2xl border border-slate-200 p-3.5">
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <Calendar size={13} /> Return
                  </span>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-black text-slate-900 outline-none"
                  />
                </div>
              ) : (
                <div className="grid place-items-center rounded-2xl bg-slate-50 p-3.5 text-center text-xs text-slate-500 font-semibold">
                  One-way journey selected
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto mt-10 max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <Filter size={16} className="text-[#387a43]" /> Filter Flights
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStops("all");
                    setSelectedAirline("all");
                  }}
                  className="text-xs font-semibold text-[#387a43] hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Stops Filter */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Stops</h4>
                <div className="mt-2.5 space-y-2">
                  {[
                    { label: "All Flights", value: "all" },
                    { label: "Non-stop only", value: 0 },
                    { label: "1 Stop", value: 1 },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="stops"
                        checked={selectedStops === item.value}
                        onChange={() => setSelectedStops(item.value as number | "all")}
                        className="accent-[#183927]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Airline Filter */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Airlines</h4>
                <div className="mt-2.5 space-y-2">
                  <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="airline"
                      checked={selectedAirline === "all"}
                      onChange={() => setSelectedAirline("all")}
                      className="accent-[#183927]"
                    />
                    <span>All Airlines</span>
                  </label>
                  {Array.from(new Set(INITIAL_FLIGHTS.map((f) => f.airline))).map((airline) => (
                    <label key={airline} className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="airline"
                        checked={selectedAirline === airline}
                        onChange={() => setSelectedAirline(airline)}
                        className="accent-[#183927]"
                      />
                      <span>{airline}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Travel Notice Card */}
            <div className="rounded-2xl bg-[#eef4e9] p-5 text-xs text-[#245239]">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sparkles size={16} /> WayNexa Fare Guarantee
              </div>
              <p className="mt-2 leading-5 text-slate-700">
                Zero hidden booking fees. Free standard seat selection and checked baggage allowances included with all listed fares.
              </p>
            </div>
          </aside>

          {/* Results List */}
          <div>
            {/* Sort & Count Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-bold text-slate-700">
                Showing <span className="text-[#183927]">{filteredFlights.length} flights</span> for{" "}
                <span className="font-black text-slate-900">{origin} → {destination}</span>
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Sort by:</span>
                <button
                  type="button"
                  onClick={() => setSortBy("cheapest")}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    sortBy === "cheapest" ? "bg-[#183927] text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Cheapest
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("fastest")}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    sortBy === "fastest" ? "bg-[#183927] text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Fastest
                </button>
              </div>
            </div>

            {/* Flight Cards */}
            <div className="mt-5 space-y-4">
              {filteredFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/90 transition hover:shadow-xl hover:ring-[#387a43]"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    {/* Airline & Times */}
                    <div className="flex flex-1 items-center gap-5">
                      <div className="grid size-12 place-items-center rounded-2xl bg-[#eef4e9] font-black text-[#183927]">
                        {flight.airlineCode}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900">{flight.airline}</h4>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {flight.flightNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{flight.cabinClass}</p>
                      </div>
                    </div>

                    {/* Flight Timeline */}
                    <div className="flex flex-[2] items-center justify-between gap-4 text-center">
                      <div className="text-left">
                        <span className="text-xl font-black text-slate-900">{flight.departureTime}</span>
                        <p className="text-xs font-bold text-slate-500">{flight.fromCode}</p>
                      </div>

                      <div className="flex-1 px-4">
                        <p className="text-[11px] font-bold text-slate-400">{flight.duration}</p>
                        <div className="relative my-1.5 flex items-center justify-center">
                          <div className="h-0.5 w-full bg-slate-200" />
                          <Plane size={14} className="absolute text-[#387a43] rotate-90" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">
                          {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-black text-slate-900">{flight.arrivalTime}</span>
                        <p className="text-xs font-bold text-slate-500">{flight.toCode}</p>
                      </div>
                    </div>

                    {/* Pricing & Booking */}
                    <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 md:border-0 md:pt-0 md:text-right">
                      <div>
                        <p className="text-2xl font-black text-[#183927]">
                          {formatPrice(flight.price)}
                        </p>
                        <p className="text-[11px] text-slate-400">per traveler</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBook(flight)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#183927] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#245239]"
                      >
                        Book <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Amenities Bar */}
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Luggage size={14} className="text-slate-400" /> {flight.baggage}
                    </span>
                    {flight.amenities.map((am) => (
                      <span key={am} className="flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px]">
                        <Check size={12} className="text-[#387a43]" /> {am}
                      </span>
                    ))}
                    <span className="ml-auto text-[11px] font-bold text-amber-700">
                      Sample inventory: {flight.availableSeats} seats
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Checkout Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedFlight(null)}
              className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#eef4e9] text-[#183927]">
                <Plane size={20} />
              </span>
              <div>
                <h3 className="text-xl font-black text-slate-900">Save a sample flight plan</h3>
                <p className="text-xs text-slate-500">
                  {selectedFlight.airline} {selectedFlight.flightNumber} · {selectedFlight.fromCity} to {selectedFlight.toCity}
                </p>
              </div>
            </div>

            {/* Flight Summary Card */}
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>{selectedFlight.fromCode} {selectedFlight.departureTime}</span>
                <span className="text-slate-400">→</span>
                <span>{selectedFlight.toCode} {selectedFlight.arrivalTime}</span>
                <span className="rounded-full bg-[#d8fbcc] px-2.5 py-0.5 text-xs text-[#183927]">
                  {selectedFlight.duration}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">Date: {departureDate} · Cabin: {cabinClass}</p>
            </div>

            <form onSubmit={handleConfirmFlight} className="mt-6 space-y-4">
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                This stores an example itinerary only. No airline inventory is held, no ticket is issued and no payment is collected.
              </p>
              {/* Price Calculation */}
              <div className="mt-6 rounded-2xl bg-[#fbfaf7] p-4 text-sm space-y-2 border border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Base fare ({passengers} traveler{passengers > 1 ? "s" : ""})</span>
                  <span>{formatPrice(selectedFlight.price * passengers)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes and fees</span>
                  <span className="font-bold text-slate-500">Not verified</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-black text-slate-900">
                  <span>Total Amount</span>
                  <span>{formatPrice(selectedFlight.price * passengers)}</span>
                </div>
              </div>

              {bookingError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">{bookingError}</p>}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedFlight(null)}
                  className="rounded-xl px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#183927] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#245239] disabled:opacity-50"
                >
                  {isSubmitting ? "Saving sample…" : "Save sample flight plan"} <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
