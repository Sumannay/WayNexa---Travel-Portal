import {
  CheckCircle2,
  Info,
  PenTool,
  Star,
  ThumbsUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWayNexa } from "../context/WayNexaContext";
import { destinations, stays } from "../data/catalog";

export default function ReviewsPage() {
  const { reviews, addReview, upvoteReview, user } = useWayNexa();
  const navigate = useNavigate();

  const [filterKind, setFilterKind] = useState<"ALL" | "stay" | "destination">("ALL");
  const [filterTripType, setFilterTripType] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);

  // New Review Form States
  const [targetItem, setTargetItem] = useState("Manali Mountain Valley Retreat");
  const [targetKind, setTargetKind] = useState<"stay" | "destination">("stay");
  const [rating, setRating] = useState(5);
  const [tripType, setTripType] = useState<"Solo" | "Couple" | "Family" | "Friends">("Couple");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchKind = filterKind === "ALL" || r.targetKind === filterKind;
      const matchTrip = filterTripType === "ALL" || r.tripType === filterTripType;
      return matchKind && matchTrip;
    });
  }, [filterKind, filterTripType, reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: "/reviews" } });
      return;
    }
    if (!title || !comment) return;

    addReview({
      userName: user?.name || "WayNexa Traveler",
      userAvatar:
        user?.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      destinationOrStay: targetItem,
      targetKind,
      rating,
      title,
      comment,
      tripType,
    });

    setShowModal(false);
    setTitle("");
    setComment("");
  };

  return (
    <main className="min-h-screen bg-[#fbfaf7] pb-24 text-slate-900">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#183927] px-5 py-14 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#d8fbcc]">
                <Info size={14} /> Review preview
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                A home for useful travel notes.
              </h1>
              <p className="mt-2 max-w-xl text-white/70">
                The entries below are illustrative and are not verified reviews. New notes are saved to your own account in this preview.
              </p>
            </div>
            <button
              type="button"
              onClick={() => user ? setShowModal(true) : navigate("/login", { state: { from: "/reviews" } })}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#d8fbcc] px-6 py-3.5 text-sm font-black text-[#183927] shadow-lg transition hover:bg-white"
            >
              <PenTool size={16} /> {user ? "Write a note" : "Sign in to write"}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto mt-10 max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Rating Summary Card */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-base font-black text-slate-900">Review preview</h3>
              <div className="mt-4 rounded-2xl bg-[#eef4e9] p-4 text-sm leading-6 text-slate-600">
                WayNexa is not connected to live bookings yet, so it cannot verify travel experiences or calculate a genuine overall rating.
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">
                Sample stories are shown as design examples. Notes you submit are private to your account until a publishing and verification workflow is added.
              </p>
            </div>

            {/* Filter Pill Box */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Filter by Category</h4>
              <div className="space-y-2">
                {[
                  { label: "All Reviews", value: "ALL" },
                  { label: "Stays & Hotels", value: "stay" },
                  { label: "Destinations & Sights", value: "destination" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setFilterKind(item.value as "ALL" | "stay" | "destination")}
                    className={`block w-full text-left rounded-xl px-3 py-2 text-xs font-bold transition ${
                      filterKind === item.value
                        ? "bg-[#183927] text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-6 mb-3">Traveler Type</h4>
              <div className="flex flex-wrap gap-1.5">
                {["ALL", "Solo", "Couple", "Family", "Friends"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilterTripType(type)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      filterTripType === type
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Reviews Stream */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">
                Showing <span className="text-[#183927]">{filteredReviews.length} stories</span>
              </p>
            </div>

            <div className="space-y-5">
              {filteredReviews.map((rev) => (
                <article
                  key={rev.id}
                  className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/90 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                        alt={rev.userName}
                        className="size-11 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900">{rev.userName}</h4>
                          {rev.verified && (
                            <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <CheckCircle2 size={12} /> Verified Traveler
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          Reviewed <span className="font-bold text-slate-700">{rev.destinationOrStay}</span> · {rev.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                      {rev.tripType} Trip
                    </span>
                    <h3 className="mt-2 text-base font-black text-slate-900">{rev.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{rev.comment}</p>
                  </div>

                  {/* Actions / Helpful */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => upvoteReview(rev.id)}
                      className="flex items-center gap-1.5 font-bold hover:text-[#183927]"
                    >
                      <ThumbsUp size={14} /> Helpful ({rev.helpfulCount})
                    </button>
                    <span className="text-[11px] text-slate-400">WayNexa Verified Experience</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Write a Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-black text-slate-900">Share Your Experience</h3>
            <p className="text-xs text-slate-500 mt-1">Help fellow travellers choose the right stays and places.</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Select Place or Stay</label>
                <select
                  value={targetItem}
                  onChange={(e) => {
                    setTargetItem(e.target.value);
                    const isStay = stays.some((s) => s.name === e.target.value);
                    setTargetKind(isStay ? "stay" : "destination");
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none"
                >
                  <optgroup label="Stays">
                    {stays.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.destination})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Destinations">
                    {destinations.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.country})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`grid size-9 place-items-center rounded-xl transition ${
                          rating >= star ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Star size={18} className={rating >= star ? "fill-white" : ""} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Trip Style</label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value as "Solo" | "Couple" | "Family" | "Friends")}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none"
                  >
                    <option value="Couple">Couple</option>
                    <option value="Solo">Solo Traveler</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unforgettable views and tranquil atmosphere"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none ring-[#387a43] focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Detailed Story</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you liked most, local food recommendations, or travel tips for other visitors…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium outline-none ring-[#387a43] focus:ring-2"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#183927] px-5 py-2 text-xs font-bold text-white hover:bg-[#245239]"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
