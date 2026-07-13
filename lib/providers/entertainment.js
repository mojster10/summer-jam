// Zabava: Ticketmaster Discovery API (city=Ljubljana) za dogodke + ceno vstopnic.
import { fetchWithRetry } from "@/lib/fetchWithRetry";

export function isEntertainmentLive() {
  return Boolean(process.env.TICKETMASTER_API_KEY);
}

export async function fetchEntertainment(dateISO) {
  const key = process.env.TICKETMASTER_API_KEY;
  const params = new URLSearchParams({
    apikey: key,
    city: "Ljubljana",
    size: "20",
    sort: "date,asc",
  });
  // Če imamo datum vikenda, omejimo iskanje na ta dan in naslednjega.
  if (dateISO) {
    const start = `${dateISO}T00:00:00Z`;
    const end = new Date(dateISO + "T00:00:00Z");
    end.setUTCDate(end.getUTCDate() + 2);
    params.set("startDateTime", start);
    params.set("endDateTime", end.toISOString().slice(0, 19) + "Z");
  }
  const res = await fetchWithRetry(
    `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`
  );
  if (!res.ok) throw new Error(`Ticketmaster: ${res.status}`);
  const data = await res.json();
  const events = data?._embedded?.events || [];

  const items = events
    .map((ev) => {
      const range = ev.priceRanges?.[0];
      // Če cena ni znana, ocenimo skromno vstopnino.
      const price = range ? Math.round(range.min || range.max || 25) : 25;
      return {
        id: `en-${ev.id}`,
        name: ev.name,
        price,
        sourceUrl: ev.url || "https://www.ticketmaster.com/discover/concerts/ljubljana",
      };
    })
    .slice(0, 5);

  if (items.length === 0) throw new Error("Ticketmaster ni vrnil dogodkov");
  return items;
}
