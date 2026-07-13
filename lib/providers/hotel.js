// Hotel: Amadeus Hotel Search API.
// cityCode=LJU, checkIn = izbran vikend (sobota), checkOut = +2 noči,
// 1 soba, 1 odrasel; vrne do 5 hotelov s ceno za 2 noči.
import { fetchWithRetry } from "@/lib/fetchWithRetry";
import { getAmadeusToken, hasAmadeusKeys, amadeusBaseUrl } from "@/lib/providers/amadeus";

export function isHotelLive() {
  return hasAmadeusKeys();
}

function checkoutDate(dateISO, nights = 2) {
  const d = new Date(dateISO + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + nights);
  return d.toISOString().slice(0, 10);
}

export async function fetchHotels(dateISO) {
  const token = await getAmadeusToken();

  // 1) Poišči hotele po mestu (Ljubljana).
  const listRes = await fetchWithRetry(
    `${amadeusBaseUrl()}/v1/reference-data/locations/hotels/by-city?cityCode=LJU`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!listRes.ok) throw new Error(`hotels by-city: ${listRes.status}`);
  const list = await listRes.json();
  const hotelIds = (list?.data || []).slice(0, 15).map((h) => h.hotelId);
  if (hotelIds.length === 0) throw new Error("Ni hotelov za LJU");

  // 2) Pridobi ponudbe s cenami za izbran vikend (2 noči).
  const params = new URLSearchParams({
    hotelIds: hotelIds.join(","),
    checkInDate: dateISO,
    checkOutDate: checkoutDate(dateISO, 2),
    adults: "1",
    roomQuantity: "1",
    currency: "EUR",
    bestRateOnly: "true",
  });
  const offersRes = await fetchWithRetry(
    `${amadeusBaseUrl()}/v3/shopping/hotel-offers?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!offersRes.ok) throw new Error(`hotel-offers: ${offersRes.status}`);
  const offersData = await offersRes.json();

  const items = (offersData?.data || [])
    .filter((entry) => entry.available && entry.offers?.[0])
    .slice(0, 5)
    .map((entry) => ({
      id: `ht-${entry.hotel.hotelId}`,
      name: `${entry.hotel.name} (2 noči)`,
      price: Math.round(Number(entry.offers[0].price.total)),
      sourceUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
        entry.hotel.name + " Ljubljana"
      )}`,
    }));

  if (items.length === 0) throw new Error("Amadeus ni vrnil hotelskih ponudb");
  return items;
}
