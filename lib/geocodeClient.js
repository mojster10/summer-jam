// ─────────────────────────────────────────────────────────────
// GEOKODIRANJE V BRSKALNIKU (client-side)
// ─────────────────────────────────────────────────────────────
// POMEMBNO: geokodiranje izvajamo neposredno iz brskalnika, ne prek
// strežnika. Razlog: Nominatim/Photon pogosto BLOKIRAJO zahtevke iz
// oblačnih strežnikov (npr. Vercel, AWS) in vrnejo 403. Ko zahtevek
// pošlje uporabnikov brskalnik, uporabi uporabnikov IP in ni blokiran.
// Obe storitvi podpirata CORS.
//
// Uporabimo verigo: najprej Photon (bolj strpen do rabe), nato
// Nominatim kot rezerva.
// ─────────────────────────────────────────────────────────────

// Središče in okvir CELE Slovenije
const CENTER = { lat: 46.15, lon: 14.99 };
// bbox: minLon, minLat, maxLon, maxLat (Slovenija)
const BBOX = { minLon: 13.35, minLat: 45.4, maxLon: 16.65, maxLat: 46.9 };

function withCity(q) {
  return /slovenij|slovenia/i.test(q) ? q : `${q}, Slovenija`;
}

function inBbox(lat, lon) {
  return (
    lat >= BBOX.minLat &&
    lat <= BBOX.maxLat &&
    lon >= BBOX.minLon &&
    lon <= BBOX.maxLon
  );
}

// ── Photon (Komoot) ──
async function photon(query) {
  const url =
    "https://photon.komoot.io/api/?" +
    new URLSearchParams({
      q: query,
      limit: "6",
      lang: "default",
      lat: String(CENTER.lat),
      lon: String(CENTER.lon),
      bbox: `${BBOX.minLon},${BBOX.minLat},${BBOX.maxLon},${BBOX.maxLat}`,
    });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Photon ${res.status}`);
  const data = await res.json();

  return (data.features || [])
    .map((f) => {
      const [lon, lat] = f.geometry?.coordinates || [];
      const p = f.properties || {};
      const line1 = [p.street, p.housenumber].filter(Boolean).join(" ");
      const line2 = [p.postcode, p.city || p.district].filter(Boolean).join(" ");
      const label =
        [p.name, line1, line2].filter(Boolean).join(", ") ||
        `${lat?.toFixed(5)}, ${lon?.toFixed(5)}`;
      return { label, lat: Number(lat), lng: Number(lon) };
    })
    .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lng))
    .filter((r) => inBbox(r.lat, r.lng));
}

// ── Nominatim (OpenStreetMap) — rezerva ──
async function nominatim(query) {
  const url =
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      q: query,
      format: "jsonv2",
      addressdetails: "1",
      limit: "6",
      countrycodes: "si",
      viewbox: `${BBOX.minLon},${BBOX.maxLat},${BBOX.maxLon},${BBOX.minLat}`,
      bounded: "1",
    });

  const res = await fetch(url, {
    headers: { "Accept-Language": "sl" },
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const data = await res.json();

  return (Array.isArray(data) ? data : [])
    .map((r) => ({
      label: r.display_name,
      lat: Number(r.lat),
      lng: Number(r.lon),
    }))
    .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lng));
}

// Glavna funkcija: vrne polje { label, lat, lng }.
export async function geocodeAddress(q) {
  const query = withCity(q.trim());
  const errors = [];

  try {
    const r = await photon(query);
    if (r.length) return r;
  } catch (e) {
    errors.push(e.message);
  }

  try {
    const r = await nominatim(query);
    if (r.length) return r;
  } catch (e) {
    errors.push(e.message);
  }

  if (errors.length) {
    throw new Error(
      "Iskalna storitev trenutno ni dosegljiva. Poskusi znova ali klikni lokacijo na zemljevidu."
    );
  }
  return [];
}
