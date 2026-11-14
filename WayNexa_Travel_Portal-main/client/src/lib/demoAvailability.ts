import { getOccupancy } from "./roomOccupancy";

// Static prototype counts; they do not represent date-specific or live inventory.
const demoRoomsByStay: Record<string, number> = {
  "puri-sea-resort": 3,
  "puri-heritage-stay": 2,
  "konark-dune-resort": 2,
  "konark-courtyard": 1,
  "bhubaneswar-court": 4,
  "temple-city-residency": 2,
  "mountain-view-resort": 3,
  "haveli-amber": 2,
  "fort-kochi-house": 2,
  "goa-coast-resort": 1,
  "hampi-boulder-stay": 2,
  "hampi-river-resort": 3,
  "munnar-tea-stay": 2,
  "munnar-garden-homestay": 1,
  "udaipur-lake-stay": 2,
  "udaipur-courtyard": 3,
  "chilika-lagoon-stay": 2,
  "satapada-coast-stay": 1,
  "ubud-calm-villas": 2,
  "kyoto-garden-stay": 2,
};

export function getDemoAvailability(
  stayId: string,
  rooms: number,
  adults: number,
  children: number,
) {
  const availableRooms = demoRoomsByStay[stayId] ?? 0;
  const occupancy = getOccupancy(adults, children, rooms);

  return {
    availableRooms,
    isAvailable: occupancy.isValid && rooms <= availableRooms,
  };
}

export function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseNonNegativeInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}
