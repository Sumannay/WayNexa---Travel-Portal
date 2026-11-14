import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { accountApi, type AccountData, type ActivityEvent } from "../lib/accountApi";
import type { Booking, CurrencyCode, Favorite, TripDraft, User, UserPreferences, UserReview } from "../types/domain";

// eslint-disable-next-line react-refresh/only-export-components -- Shared currency data is consumed by UI modules.
export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  INR: { symbol: "₹", rate: 1, label: "INR (₹) - Indian Rupee" },
  USD: { symbol: "$", rate: 0.012, label: "USD ($) - US Dollar" },
  EUR: { symbol: "€", rate: 0.011, label: "EUR (€) - Euro" },
  GBP: { symbol: "£", rate: 0.0095, label: "GBP (£) - British Pound" },
  AED: { symbol: "AED", rate: 0.044, label: "AED - UAE Dirham" },
  JPY: { symbol: "¥", rate: 1.85, label: "JPY (¥) - Japanese Yen" },
};

const defaultReviews: UserReview[] = [
  {
    id: "rev-1",
    userName: "Ananya Sharma",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    destinationOrStay: "Manali Mountain Valley Retreat",
    targetKind: "stay",
    rating: 5,
    date: "2 days ago",
    title: "Unmatched sunrise view and peaceful mornings",
    comment: "The cedar wood cottages had panoramic views of snow-capped peaks. The staff arranged local trout fishing and a guided trek to Jogini falls. Absolutely loved the apple orchard stroll!",
    tripType: "Couple",
    helpfulCount: 24,
    verified: false,
  },
  {
    id: "rev-2",
    userName: "David Miller",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    destinationOrStay: "Ubud Bamboo Sanctuary & Spa",
    targetKind: "stay",
    rating: 5,
    date: "1 week ago",
    title: "True eco-luxury in the heart of Bali",
    comment: "Sleeping to the sound of the Ayung river surrounded by lush jungle foliage was magical. Morning yoga and vegan farm-to-table breakfast were top notch.",
    tripType: "Solo",
    helpfulCount: 18,
    verified: false,
  },
  {
    id: "rev-3",
    userName: "Priya & Rohan Patel",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    destinationOrStay: "Jaipur Heritage Haveli",
    targetKind: "stay",
    rating: 5,
    date: "2 weeks ago",
    title: "Felt like royalty in the Pink City",
    comment: "The courtyards with peacocks, traditional Rajasthani thali, and live sitar music in the evening created an authentic heritage experience. Centrally located near City Palace.",
    tripType: "Family",
    helpfulCount: 31,
    verified: false,
  },
  {
    id: "rev-4",
    userName: "Elena Rostova",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    destinationOrStay: "Kyoto Traditional District",
    targetKind: "destination",
    rating: 5,
    date: "3 weeks ago",
    title: "Serene bamboo groves and historic shrines",
    comment: "WayNexa's itinerary suggestions made navigating Kyoto effortless. The early morning walk through Fushimi Inari was completely devoid of crowds.",
    tripType: "Couple",
    helpfulCount: 42,
    verified: false,
  },
];

const defaultPreferences: UserPreferences = {
  currency: "INR",
  language: "English (US)",
  dietary: ["Vegetarian"],
  travelStyle: "Experiential & Nature",
  seatPreference: "Window",
  emailNotifications: true,
  smsNotifications: false,
  priceDropAlerts: true,
};

type WayNexaContextValue = {
  user: User | null;
  favorites: Favorite[];
  bookings: Booking[];
  tripDraft: TripDraft | null;
  currency: CurrencyCode;
  preferences: UserPreferences;
  reviews: UserReview[];
  authLoading: boolean;
  accountError: string;
  formatPrice: (amountInINR: number) => string;
  setCurrency: (code: CurrencyCode) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  dismissAccountError: () => void;
  trackActivity: (eventType: ActivityEvent, details?: Record<string, string | number>) => Promise<void>;
  toggleFavorite: (favorite: Favorite) => void;
  saveTripDraft: (draft: TripDraft) => void;
  confirmBooking: (booking: Omit<Booking, "id" | "status">) => Promise<Booking>;
  updateBookingStatus: (id: string, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") => void;
  addReview: (review: Omit<UserReview, "id" | "date" | "helpfulCount" | "verified">) => void;
  upvoteReview: (id: string) => void;
};

// eslint-disable-next-line react-refresh/only-export-components -- The provider and hook share this context.
export const WayNexaContext = createContext<WayNexaContextValue | undefined>(undefined);

const emptyAccountData: AccountData = {
  favorites: [],
  bookings: [],
  tripDraft: null,
  preferences: defaultPreferences,
  reviews: [],
};

export function WayNexaProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tripDraft, setTripDraft] = useState<TripDraft | null>(null);
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [reviews, setReviews] = useState<UserReview[]>(defaultReviews);
  const [accountReviews, setAccountReviews] = useState<UserReview[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [accountError, setAccountError] = useState("");

  const applyAccountData = useCallback((data: AccountData | null) => {
    const stored = data ?? emptyAccountData;
    setFavorites(stored.favorites ?? []);
    setBookings(stored.bookings ?? []);
    setTripDraft(stored.tripDraft ?? null);
    const nextPreferences = { ...defaultPreferences, ...stored.preferences };
    setPreferences(nextPreferences);
    setCurrencyState(nextPreferences.currency);
    setAccountReviews(stored.reviews ?? []);
    setReviews([...(stored.reviews ?? []), ...defaultReviews]);
  }, []);

  useEffect(() => {
    let active = true;
    accountApi.getSession()
      .then(({ user: restoredUser, data }) => {
        if (!active) return;
        setUser(restoredUser);
        applyAccountData(restoredUser ? data : emptyAccountData);
      })
      .catch((error: unknown) => {
        if (active) {
          console.error("Could not restore the WayNexa account session:", error);
          applyAccountData(emptyAccountData);
        }
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });
    return () => { active = false; };
  }, [applyAccountData]);

  const persistAccountData = useCallback((data: AccountData) => {
    if (!user) return;
    void accountApi.updateData(data).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Your travel data could not be saved.";
      setAccountError(message);
      console.error("Could not save WayNexa account data:", error);
    });
  }, [user]);

  const trackActivity = useCallback(async (
    eventType: ActivityEvent,
    details: Record<string, string | number> = {},
  ) => {
    if (!user) return;
    try {
      await accountApi.trackActivity(eventType, details);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Account activity could not be saved.";
      setAccountError(message);
      console.error("Could not record WayNexa account activity:", error);
    }
  }, [user]);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    const next = { ...preferences, currency: code };
    setPreferences(next);
    persistAccountData({ preferences: next });
  }, [persistAccountData, preferences]);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    const next = { ...preferences, ...updates };
    setPreferences(next);
    if (updates.currency) {
      setCurrencyState(updates.currency);
    }
    persistAccountData({ preferences: next });
  }, [persistAccountData, preferences]);

  const formatPrice = useCallback((amountInINR: number): string => {
    const target = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
    const converted = amountInINR * target.rate;
    if (currency === "INR") {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(converted);
    }
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(converted);
    }
    if (currency === "EUR") {
      return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(converted);
    }
    if (currency === "GBP") {
      return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(converted);
    }
    if (currency === "JPY") {
      return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(converted);
    }
    return `${target.symbol} ${Math.round(converted).toLocaleString()}`;
  }, [currency]);

  const updateBookingStatus = useCallback((id: string, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
    const next = bookings.map((booking) => booking.id === id ? { ...booking, status } : booking);
    setBookings(next);
    persistAccountData({ bookings: next });
  }, [bookings, persistAccountData]);

  const addReview = useCallback((reviewData: Omit<UserReview, "id" | "date" | "helpfulCount" | "verified">) => {
    const newRev: UserReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: "Just now",
      helpfulCount: 0,
      verified: false,
    };
    const nextAccountReviews = [newRev, ...accountReviews];
    setAccountReviews(nextAccountReviews);
    setReviews([newRev, ...reviews]);
    persistAccountData({ reviews: nextAccountReviews });
    void trackActivity("review_submitted", { targetKind: reviewData.targetKind });
  }, [accountReviews, persistAccountData, reviews, trackActivity]);

  const upvoteReview = useCallback((id: string) => {
    const next = reviews.map((review) => review.id === id ? { ...review, helpfulCount: review.helpfulCount + 1 } : review);
    setReviews(next);
    const nextAccountReviews = accountReviews.map((review) =>
      review.id === id ? { ...review, helpfulCount: review.helpfulCount + 1 } : review,
    );
    if (nextAccountReviews.some((review) => review.id === id)) {
      setAccountReviews(nextAccountReviews);
      persistAccountData({ reviews: nextAccountReviews });
    }
  }, [accountReviews, persistAccountData, reviews]);

  const value = useMemo<WayNexaContextValue>(
    () => ({
      user,
      favorites,
      bookings,
      tripDraft,
      currency,
      preferences,
      reviews,
      authLoading,
      accountError,
      formatPrice,
      setCurrency,
      updatePreferences,
      async signIn(email, password) {
        const result = await accountApi.signIn(email, password);
        setUser(result.user);
        applyAccountData(result.data);
        setAccountError("");
      },
      async register(name, email, password) {
        const result = await accountApi.register(name, email, password);
        setUser(result.user);
        applyAccountData(result.data);
        setAccountError("");
      },
      async signOut() {
        try {
          await accountApi.signOut();
          setAccountError("");
        } catch (error) {
          const message = error instanceof Error ? error.message : "You could not be signed out.";
          setAccountError(message);
          console.error("Could not sign out of WayNexa:", error);
        } finally {
          setUser(null);
          applyAccountData(emptyAccountData);
        }
      },
      dismissAccountError() { setAccountError(""); },
      trackActivity,
      toggleFavorite(favorite) {
        const exists = favorites.some((item) => item.id === favorite.id && item.kind === favorite.kind);
        const next = exists
          ? favorites.filter((item) => !(item.id === favorite.id && item.kind === favorite.kind))
          : [favorite, ...favorites];
        setFavorites(next);
        persistAccountData({ favorites: next });
        void trackActivity(exists ? "favorite_removed" : "favorite_added", {
          kind: favorite.kind,
          title: favorite.title,
        });
      },
      saveTripDraft(draft) {
        setTripDraft(draft);
        persistAccountData({ tripDraft: draft });
        void trackActivity("trip_saved", {
          destination: draft.destination,
          travellers: draft.travellers,
        });
      },
      async confirmBooking(booking) {
        if (!user) throw new Error("Sign in before saving a trip.");
        const nextBooking: Booking = {
          ...booking,
          id: `WAY-SAMPLE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          status: "SAMPLE",
        };
        const next = [nextBooking, ...bookings];
        try {
          await accountApi.updateData({ bookings: next });
        } catch (error) {
          const message = error instanceof Error ? error.message : "The sample trip could not be saved.";
          setAccountError(message);
          throw error;
        }
        setBookings(next);
        await trackActivity("demo_booking_saved", {
          destination: nextBooking.destination,
          stay: nextBooking.stay,
        });
        return nextBooking;
      },
      updateBookingStatus,
      addReview,
      upvoteReview,
    }),
    [accountError, addReview, applyAccountData, authLoading, bookings, currency, favorites, formatPrice, persistAccountData, preferences, reviews, setCurrency, trackActivity, tripDraft, updateBookingStatus, updatePreferences, upvoteReview, user],
  );

  return <WayNexaContext.Provider value={value}>{children}</WayNexaContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWayNexa() {
  const context = useContext(WayNexaContext);
  if (!context) throw new Error("useWayNexa must be used inside WayNexaProvider");
  return context;
}
