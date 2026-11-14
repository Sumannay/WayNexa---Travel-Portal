import {
  ArrowRight,
  CalendarDays,
  Check,
  LoaderCircle,
  MapPin,
  Minus,
  Mountain,
  Plus,
  Sparkles,
  Utensils,
  Waves,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import TravelAssistantChat from "../components/TravelAssistantChat";
import { sendTravelAssistantMessage, type TravelAssistantContext } from "../lib/assistantApi";

type Interest = "Mountains" | "Beaches" | "Adventure" | "Culture" | "Food";

const interests: {
  name: Interest;
  icon: typeof Mountain;
}[] = [
  { name: "Mountains", icon: Mountain },
  { name: "Beaches", icon: Waves },
  { name: "Adventure", icon: Mountain },
  { name: "Culture", icon: Sparkles },
  { name: "Food", icon: Utensils },
];

const destinations = ["Manali", "Puri", "Konark", "Bhubaneswar", "Bali", "Jaipur", "Kyoto"];

export default function AITravelAssistant() {
  const [destination, setDestination] = useState("Manali");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(25000);
  const [travellers, setTravellers] = useState(2);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([
    "Mountains",
    "Adventure",
  ]);
  const [generated, setGenerated] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
    setGenerated("");
  };

  const tripContext: TravelAssistantContext = {
    destination,
    startDate,
    endDate,
    budget,
    travellers,
    interests: selectedInterests,
  };

  const generateTrip = async () => {
    if (Boolean(startDate) !== Boolean(endDate) || (startDate && endDate <= startDate)) {
      setGenerationError("Choose both travel dates, with the return date after the start date, or leave both dates blank.");
      return;
    }

    const prompt = [
      `Create a practical day-by-day travel itinerary for ${destination}.`,
      `Travel dates: ${startDate && endDate ? `${startDate} to ${endDate}` : "flexible dates"}.`,
      `Total budget: ₹${budget.toLocaleString("en-IN")} for ${travellers} traveler${travellers === 1 ? "" : "s"}.`,
      `Interests: ${selectedInterests.length ? selectedInterests.join(", ") : "no specific preferences"}.`,
      "Use a friendly tone, organize the plan by day, include realistic pacing, local food ideas, and rough cost guidance.",
      "Do not claim live availability, current prices, or that any bookings have been made.",
    ].join("\n");

    setIsGenerating(true);
    setGenerationError("");
    setGenerated("");
    try {
      const answer = await sendTravelAssistantMessage([{ role: "user", content: prompt }], tripContext);
      setGenerated(answer);
      window.setTimeout(() => {
        document.getElementById("ai-itinerary")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "The AI assistant could not create your trip plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link to="/" className="text-2xl font-black tracking-tight">
            WayNexa
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/explore"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Explore
            </Link>

            <Link
              to="/explore"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Explore
            </Link>

            <Link
              to="/hotels"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Hotels
            </Link>

            <Link
              to="/trips"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Trips
            </Link>
          </div>

          <Link
            to="/profile"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold transition hover:bg-slate-100"
          >
            Profile
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <Sparkles size={16} />
              AI-powered trip planning
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              Your journey,
              <br />
              planned by AI.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Tell WayNexa where you want to go, your budget and what you love.
              We'll create a personalized travel itinerary for you.
            </p>
          </div>
        </div>
      </section>

      {/* Planner */}
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <TravelAssistantChat context={tripContext} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Trip Planner
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Tell us about your trip
              </h2>

              <p className="mt-2 text-slate-500">
                We'll use your preferences to create a personalized plan.
              </p>
            </div>

            {/* Destination */}
            <div>
              <label className="mb-3 block text-sm font-semibold">
                Where do you want to go?
              </label>

              <div className="relative">
                <MapPin
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    setGenerated("");
                    setGenerationError("");
                  }}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-12 py-4 font-medium outline-none transition focus:border-slate-500"
                >
                  {destinations.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="mt-7">
              <label className="mb-3 block text-sm font-semibold">
                Travel dates
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => {
                      setStartDate(event.target.value);
                      setGenerated("");
                      setGenerationError("");
                    }}
                    className="w-full rounded-2xl border border-slate-200 px-12 py-4 outline-none focus:border-slate-500"
                  />
                </div>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => {
                      setEndDate(event.target.value);
                      setGenerated("");
                      setGenerationError("");
                    }}
                    className="w-full rounded-2xl border border-slate-200 px-12 py-4 outline-none focus:border-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-semibold">Your budget</label>

                <span className="text-lg font-bold">
                  ₹{budget.toLocaleString("en-IN")}
                </span>
              </div>

              <input
                type="range"
                min="5000"
                max="150000"
                step="5000"
                value={budget}
                onChange={(event) => {
                  setBudget(Number(event.target.value));
                  setGenerated("");
                  setGenerationError("");
                }}
                className="w-full"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>₹5,000</span>
                <span>₹1,50,000+</span>
              </div>
            </div>

            {/* Travellers */}
            <div className="mt-7">
              <label className="mb-3 block text-sm font-semibold">
                Number of travellers
              </label>

              <div className="flex w-fit items-center gap-5 rounded-2xl border border-slate-200 px-5 py-3">
                <button
                  type="button"
                  onClick={() => {
                    setTravellers(Math.max(1, travellers - 1));
                    setGenerated("");
                    setGenerationError("");
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100"
                >
                  <Minus size={16} />
                </button>

                <span className="min-w-20 text-center font-semibold">
                  {travellers} {travellers === 1 ? "traveller" : "travellers"}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setTravellers(travellers + 1);
                    setGenerated("");
                    setGenerationError("");
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Interests */}
            <div className="mt-7">
              <label className="mb-3 block text-sm font-semibold">
                What are you interested in?
              </label>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {interests.map(({ name, icon: Icon }) => {
                  const selected = selectedInterests.includes(name);

                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleInterest(name)}
                      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white hover:border-slate-400"
                      }`}
                    >
                      <Icon size={19} />
                      <span className="font-medium">{name}</span>

                      {selected && <Check size={17} className="ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate */}
            <button
              type="button"
              onClick={generateTrip}
              disabled={isGenerating}
              className="mt-9 flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 font-semibold text-white transition hover:bg-slate-800"
            >
              {isGenerating ? <LoaderCircle size={19} className="animate-spin" /> : <Sparkles size={19} />}
              {isGenerating ? "Groq is planning…" : "Generate My AI Trip"}
              {!isGenerating && <ArrowRight size={18} />}
            </button>
            {generationError && <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">{generationError}</p>}
          </section>

          {/* Summary */}
          <aside className="h-fit rounded-3xl bg-slate-950 p-7 text-white lg:sticky lg:top-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Your preferences
            </p>

            <h3 className="mt-3 text-2xl font-bold">{destination}</h3>

            <div className="mt-7 space-y-5">
              <div>
                <p className="text-sm text-slate-400">Budget</p>
                <p className="mt-1 font-semibold">
                  ₹{budget.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Travellers</p>
                <p className="mt-1 font-semibold">
                  {travellers} {travellers === 1 ? "traveller" : "travellers"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Interests</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedInterests.length > 0 ? (
                    selectedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full bg-white/10 px-3 py-1 text-sm"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      No interests selected
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm leading-6 text-slate-400">
                WayNexa will create a personalized itinerary based on your
                destination, budget, dates and interests.
              </p>
            </div>
          </aside>
        </div>

        {/* AI Itinerary */}
        {generated && (
          <section
            id="ai-itinerary"
            className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold">
                  <Sparkles size={16} />
                  Groq AI trip plan
                </div>

                <h2 className="mt-4 text-3xl font-bold">{destination} trip plan</h2>
              </div>

              <div className="shrink-0 rounded-2xl bg-slate-950 px-6 py-4 text-white">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Estimated budget
                </p>

                <p className="mt-1 text-2xl font-bold">
                  ₹{budget.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 sm:p-7">
              <p className="whitespace-pre-wrap">{generated}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/trip-builder?destination=${destination.toLowerCase()}`}
                className="flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Customize This Trip
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/hotels"
                className="flex items-center justify-center rounded-full border border-slate-300 px-7 py-3 font-semibold transition hover:bg-slate-100"
              >
                Explore Stays
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
