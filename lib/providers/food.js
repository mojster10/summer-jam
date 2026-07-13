// Hrana: Google Places API (Text Search: "restaurant Ljubljana").
// Ceno ocenimo iz price_level (0–4 → poraba na osebo za vikend).
import { fetchWithRetry } from "@/lib/fetchWithRetry";

export function isFoodLive() {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY);
}

// price_level → ocenjena poraba na osebo za vikend (€ / €€ / €€€ / €€€€).
const PRICE_BY_LEVEL = { 0: 15, 1: 30, 2: 45, 3: 85, 4: 120 };

export async function fetchFood() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const params = new URLSearchParams({
    query: "restaurant Ljubljana",
    key,
    language: "sl",
  });
  const res = await fetchWithRetry(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`
  );
  if (!res.ok) throw new Error(`Google Places: ${res.status}`);
  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Places status: ${data.status}`);
  }
  const items = (data.results || [])
    .filter((r) => r.name)
    .slice(0, 5)
    .map((r) => {
      const level = typeof r.price_level === "number" ? r.price_level : 2;
      const badge = "€".repeat(Math.max(1, level));
      return {
        id: `fo-${r.place_id}`,
        name: `${r.name} (${badge})`,
        price: PRICE_BY_LEVEL[level] ?? 45,
        sourceUrl: `https://www.google.com/maps/place/?q=place_id:${r.place_id}`,
      };
    });
  if (items.length === 0) throw new Error("Google Places ni vrnil restavracij");
  return items;
}
