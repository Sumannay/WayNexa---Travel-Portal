import type {
  Booking,
  Favorite,
  TripDraft,
  User,
  UserPreferences,
  UserReview,
} from "../types/domain";

export type AccountData = {
  favorites?: Favorite[];
  bookings?: Booking[];
  tripDraft?: TripDraft | null;
  preferences?: UserPreferences;
  reviews?: UserReview[];
};

export type SessionResponse = {
  user: User | null;
  data: AccountData | null;
};

export type ActivityEvent =
  | "page_view"
  | "search_performed"
  | "favorite_added"
  | "favorite_removed"
  | "trip_saved"
  | "demo_booking_saved"
  | "review_submitted"
  | "account_registered"
  | "account_signed_in"
  | "account_signed_out"
  | "account_data_updated";

export type AdminOverview = {
  userCount: number;
  eventCount: number;
  recentActivity: Array<{
    id: string;
    name: string;
    email: string;
    eventType: string;
    details: Record<string, string | number>;
    createdAt: string;
  }>;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      credentials: "include",
      headers: {
        "content-type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("WayNexa could not reach the account service. Check that the API server is running.");
  }

  const responseText = await response.text();
  let payload: unknown;
  if (responseText.trim()) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error("The account service returned an invalid response. Please try again later.");
      }
    }
  }

  if (!response.ok) {
    const errorMessage =
      typeof payload === "object" &&
      payload !== null &&
      !Array.isArray(payload) &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "Account features are temporarily unavailable. Please try again later.";
    throw new Error(errorMessage);
  }

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new Error("The account service returned an empty or invalid response. Please try again later.");
  }

  return payload as T;
}

export const accountApi = {
  getSession: () => request<SessionResponse>("/api/auth/session"),
  register: (name: string, email: string, password: string) =>
    request<SessionResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  signIn: (email: string, password: string) =>
    request<SessionResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signOut: () =>
    request<{ signedOut: boolean }>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  updateData: (data: AccountData) =>
    request<{ data: AccountData }>("/api/me/data", {
      method: "PATCH",
      body: JSON.stringify({ data }),
    }),
  trackActivity: (eventType: ActivityEvent, details: Record<string, string | number> = {}) =>
    request<{ recorded: boolean }>("/api/activity", {
      method: "POST",
      body: JSON.stringify({ eventType, details }),
    }),
  getAdminOverview: () => request<AdminOverview>("/api/admin/overview"),
};
