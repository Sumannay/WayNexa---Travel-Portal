import {
  Bell,
  Check,
  Download,
  Globe,
  Save,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { CURRENCY_RATES, useWayNexa } from "../context/WayNexaContext";
import type { CurrencyCode } from "../types/domain";

export default function SettingsPage() {
  const { user, currency, setCurrency, preferences, updatePreferences } = useWayNexa();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [dietary, setDietary] = useState<string[]>(preferences.dietary || ["Vegetarian"]);
  const [travelStyle, setTravelStyle] = useState(preferences.travelStyle || "Experiential & Nature");
  const [seatPref, setSeatPref] = useState<"Window" | "Aisle" | "Middle" | "No preference">(
    preferences.seatPreference || "Window"
  );
  const [emailNotif, setEmailNotif] = useState(preferences.emailNotifications ?? true);
  const [smsNotif, setSmsNotif] = useState(preferences.smsNotifications ?? false);
  const [priceDrop, setPriceDrop] = useState(preferences.priceDropAlerts ?? true);

  const toggleDietary = (item: string) => {
    setDietary((current) =>
      current.includes(item) ? current.filter((d) => d !== item) : [...current, item]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      dietary,
      travelStyle,
      seatPreference: seatPref,
      emailNotifications: emailNotif,
      smsNotifications: smsNotif,
      priceDropAlerts: priceDrop,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      user,
      preferences,
      currency,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WayNexa-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#fbfaf7] pb-24 text-slate-900">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#387a43]">
            <Sliders size={14} /> Personalization & Controls
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl text-slate-900">
            Account & Travel Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Customize currency conversions, travel comfort preferences, notifications, and security.
          </p>
        </div>
      </section>

      {/* Settings Form */}
      <section className="mx-auto mt-8 max-w-4xl px-5 sm:px-8">
        <form onSubmit={handleSave} className="space-y-8">
          {/* CURRENCY & REGIONAL */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#eef4e9] text-[#183927]">
                <Globe size={18} />
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900">Currency & Regional Format</h3>
                <p className="text-xs text-slate-400">All prices across stays, flights and trips adjust instantly</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => {
                const item = CURRENCY_RATES[code];
                const isSelected = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#183927] bg-[#eef4e9]/40 ring-2 ring-[#183927]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-black text-slate-900">{code}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                    </div>
                    <span className="text-lg font-black text-[#183927]">{item.symbol}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TRAVEL & FLIGHT PREFERENCES */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#eef4e9] text-[#183927]">
                <Sparkles size={18} />
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900">Travel & Flight Preferences</h3>
                <p className="text-xs text-slate-400">Pre-populates booking forms and personalized AI recommendations</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {/* Dietary */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Dietary Requirements (Flights & Hotel Dining)
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Vegetarian", "Vegan", "Halal", "Jain Food", "Gluten-Free", "Kosher", "Nut-Free"].map((item) => {
                    const active = dietary.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleDietary(item)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                          active
                            ? "bg-[#183927] text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {item} {active && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Travel Style */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Preferred Travel Style
                  </label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none"
                  >
                    <option value="Experiential & Nature">Experiential & Nature</option>
                    <option value="Luxury & Wellness">Luxury & Wellness</option>
                    <option value="Adventure & High Altitude">Adventure & High Altitude</option>
                    <option value="Heritage & Temples">Heritage & Temples</option>
                    <option value="Culinary & Street Food">Culinary & Street Food</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Default Airline Seat Preference
                  </label>
                  <select
                    value={seatPref}
                    onChange={(e) => setSeatPref(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none"
                  >
                    <option value="Window">Window Seat</option>
                    <option value="Aisle">Aisle Seat</option>
                    <option value="Middle">Middle Seat</option>
                    <option value="No preference">No preference</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#eef4e9] text-[#183927]">
                <Bell size={18} />
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900">Alerts & Notifications</h3>
                <p className="text-xs text-slate-400">Manage how you receive flight alerts and booking passes</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                {
                  id: "email",
                  title: "Email Booking Receipts & Boarding Passes",
                  desc: "Receive immediate PDF ticket confirmations and hotel check-in instructions",
                  state: emailNotif,
                  set: setEmailNotif,
                },
                {
                  id: "sms",
                  title: "SMS & WhatsApp Flight Gate Updates",
                  desc: "Live text alerts for flight departure gate changes, delays, and baggage belt numbers",
                  state: smsNotif,
                  set: setSmsNotif,
                },
                {
                  id: "price",
                  title: "Price Drop Tracker for Saved Trips",
                  desc: "Get notified when destinations or saved hotel nights decrease in price",
                  state: priceDrop,
                  set: setPriceDrop,
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 p-4 cursor-pointer hover:bg-slate-100/70 transition"
                >
                  <div>
                    <p className="text-xs font-black text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.set(e.target.checked)}
                    className="mt-1 size-4 accent-[#183927]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* DATA & PRIVACY */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Privacy & Data Portability</h3>
                <p className="text-xs text-slate-400">Download a copy of your personal travel history and settings</p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Download size={14} /> Export JSON
              </button>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                <Check size={14} /> Preferences updated successfully!
              </p>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-[#183927] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#245239]"
            >
              <Save size={16} /> Save Preferences
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
