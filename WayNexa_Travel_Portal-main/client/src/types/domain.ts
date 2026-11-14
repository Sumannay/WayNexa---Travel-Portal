export type UserRole = "TRAVELER" | "ADMIN" | "HOTEL_OWNER" | "CONTENT_MANAGER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
};

export type FavoriteKind = "destination" | "stay" | "place" | "trip" | "flight";

export type Favorite = {
  id: string;
  kind: FavoriteKind;
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

export type TripDraft = {
  destination: string;
  startDate: string;
  endDate: string;
  travellers: number;
  budget: number;
  interests: string[];
};

export type Booking = {
  id: string;
  destination: string;
  stay: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: "SAMPLE" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  kind?: "stay" | "flight" | "trip";
  details?: Record<string, unknown>;
};

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "JPY";

export type Flight = {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number; // in INR baseline
  cabinClass: "Economy" | "Premium Economy" | "Business" | "First";
  baggage: string;
  amenities: string[];
  availableSeats: number;
};

export type UserReview = {
  id: string;
  userName: string;
  userAvatar?: string;
  destinationOrStay: string;
  targetKind: "destination" | "stay";
  rating: number;
  date: string;
  title: string;
  comment: string;
  tripType: "Solo" | "Couple" | "Family" | "Friends";
  helpfulCount: number;
  verified: boolean;
};

export type UserPreferences = {
  currency: CurrencyCode;
  language: string;
  dietary: string[];
  travelStyle: string;
  seatPreference: "Window" | "Aisle" | "Middle" | "No preference";
  emailNotifications: boolean;
  smsNotifications: boolean;
  priceDropAlerts: boolean;
};
