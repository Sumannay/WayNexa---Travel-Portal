export type GeoCoordinate = {
  lat: number;
  lng: number;
  name?: string;
};

export const REFERENCE_LOCATIONS: Record<string, GeoCoordinate> = {
  DELHI: { lat: 28.6139, lng: 77.209, name: "New Delhi (City Center)" },
  MUMBAI: { lat: 19.076, lng: 72.8777, name: "Mumbai (Nariman Point)" },
  BENGALURU: { lat: 12.9716, lng: 77.5946, name: "Bengaluru (MG Road)" },
  BHUBANESWAR: { lat: 20.2961, lng: 85.8245, name: "Bhubaneswar (Master Canteen)" },
  KOLKATA: { lat: 22.5726, lng: 88.3639, name: "Kolkata (Park Street)" },
  LONDON: { lat: 51.5074, lng: -0.1278, name: "London, UK" },
  TOKYO: { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" },
};

/**
 * Haversine formula to calculate great-circle distance between two GPS coordinates in kilometers.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Formats distance in km or miles.
 */
export function formatDistance(km: number, unit: "km" | "mi" = "km"): string {
  if (unit === "mi") {
    const mi = Math.round(km * 0.621371 * 10) / 10;
    return `${mi.toLocaleString()} mi`;
  }
  return `${km.toLocaleString()} km`;
}

/**
 * Provides an intelligent, realistic estimate of travel time based on distance.
 */
export function estimateTravelTime(km: number): {
  mode: "walk" | "drive" | "train" | "flight";
  text: string;
  badge: string;
} {
  if (km <= 1.5) {
    const mins = Math.max(3, Math.round((km / 4.5) * 60));
    return { mode: "walk", text: `${mins} min walk`, badge: "Walking distance" };
  }
  if (km <= 80) {
    const mins = Math.round((km / 42) * 60);
    if (mins < 60) {
      return { mode: "drive", text: `${mins} min drive / cab`, badge: "Short cab ride" };
    }
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return {
      mode: "drive",
      text: `${hrs}h ${remMins > 0 ? `${remMins}m` : ""} road journey`,
      badge: "Driving route",
    };
  }
  if (km <= 400) {
    const hrs = Math.round((km / 65) * 10) / 10;
    return {
      mode: "train",
      text: `Approx. ${hrs}h express train / highway drive`,
      badge: "Regional route",
    };
  }
  // Long distance / Inter-city
  const flightHours = Math.round((km / 650 + 1.2) * 10) / 10;
  return {
    mode: "flight",
    text: `Approx. ${flightHours}h flight + local transfer`,
    badge: "Direct flight route",
  };
}

export type MapboxRouteResult = {
  distanceKm: number;
  durationMins: number;
  coordinates: [number, number][]; // [lat, lng] pairs for Leaflet
  summaryText: string;
};

/**
 * Queries Mapbox Directions API for live turn-by-turn road driving directions and distance.
 */
export async function fetchMapboxDrivingRoute(
  origin: GeoCoordinate,
  dest: GeoCoordinate,
  token: string
): Promise<MapboxRouteResult | null> {
  if (!token || !origin || !dest) return null;
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?geometries=geojson&overview=full&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes || !data.routes.length) return null;

    const route = data.routes[0];
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const durationMins = Math.round(route.duration / 60);

    // Mapbox returns GeoJSON [lng, lat], Leaflet polyline expects [lat, lng]
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      (pt: [number, number]) => [pt[1], pt[0]]
    );

    let summaryText = "";
    if (durationMins < 60) {
      summaryText = `${durationMins} mins via live highway`;
    } else {
      const h = Math.floor(durationMins / 60);
      const m = durationMins % 60;
      summaryText = `${h}h ${m > 0 ? `${m}m` : ""} live road drive`;
    }

    return {
      distanceKm,
      durationMins,
      coordinates,
      summaryText,
    };
  } catch {
    return null;
  }
}
