// Leti: Amadeus Flight Offers Search API.
// Poizvedba: origin=LJU (Letališče Jožeta Pučnika), več destinacij;
// vrne najcenejši povratni let (sobota → nedelja) za vsako destinacijo.
import { fetchWithRetry } from "@/lib/fetchWithRetry";
import { getAmadeusToken, hasAmadeusKeys, amadeusBaseUrl } from "@/lib/providers/amadeus";

const DESTINATIONS = [
  { code: "VIE", label: "Dunaj" },
  { code: "BER", label: "Berlin" },
  { code: "BCN", label: "Barcelona" },
  { code: "LHR", label: "London" },
  { code: "LIS", label: "Lizbona" },
];

export function isFlightsLive() {
  return hasAmadeusKeys();
}

// dateISO = sobota (odhod). Vrnitev = naslednji dan (nedelja).
function returnDate(dateISO) {
  const d = new Date(dateISO + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

async function fetchOne(token, dest, departureDate) {
  const params = new URLSearchParams({
    originLocationCode: "LJU",
    destinationLocationCode: dest.code,
    departureDate,
    returnDate: returnDate(departureDate),
    adults: "1",
    currencyCode: "EUR",
    max: "1",
  });
  const res = await fetchWithRetry(
    `${amadeusBaseUrl()}/v2/shopping/flight-offers?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`flight-offers ${dest.code}: ${res.status}`);
  const data = await res.json();
  const offer = data?.data?.[0];
  if (!offer) return null;
  return {
    id: `fl-${dest.code.toLowerCase()}`,
    name: `Ljubljana → ${dest.label}`,
    price: Math.round(Number(offer.price.grandTotal || offer.price.total)),
    sourceUrl: `https://www.skyscanner.net/transport/flights/lju/${dest.code.toLowerCase()}/`,
  };
}

export async function fetchFlights(dateISO) {
  const token = await getAmadeusToken();
  const results = await Promise.allSettled(
    DESTINATIONS.map((dest) => fetchOne(token, dest, dateISO))
  );
  const items = results
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);
  if (items.length === 0) throw new Error("Amadeus ni vrnil letov");
  return items;
}
