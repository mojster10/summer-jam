// ─────────────────────────────────────────────────────────────
// VIR HIDRANTOV: OpenStreetMap (Overpass API)
// ─────────────────────────────────────────────────────────────
// To je edini javno dostopen, brezplačen in vseslovenski register
// hidrantov. Vsebuje VSE hidrante, ki so v OSM vrisani
// (emergency=fire_hydrant), z realnimi koordinatami in realnimi
// oznakami (tip, premer, ponekod tlak/pretok).
//
// POMEMBNO glede podatkov:
//  - PRETOK ("kako poln") in TLAK sta v OSM zabeležena le redko
//    (fire_hydrant:flow_capacity, fire_hydrant:pressure). Kjer ju ni,
//    vrednosti NE izmišljujemo — polje ostane null (v vmesniku
//    prikazano kot "neznano").
//  - MOŽNOST PARKIRANJA ob hidrantu ni del nobene javne baze, zato je
//    ni med podatki.
//
// Poizvedba teče iz BRSKALNIKA (uporabnikov IP), da se izognemo
// blokadi (403), ki jo storitve pogosto vračajo oblačnim strežnikom.
// Overpass podpira CORS.
// ─────────────────────────────────────────────────────────────

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

// Preslikava OSM tipa hidranta v slovenski izraz
const TYPE_MAP = {
  pillar: "nadzemni (stebrni)",
  underground: "podzemni",
  wall: "stenski",
  pond: "vodni vir / bazen",
  pipe: "cevni",
};

// Poskusi razčleniti premer (mm). OSM vrednosti so lahko "80", "80 mm",
// '2"' ipd. Cole (") pretvorimo v mm.
function parseDiameter(v) {
  if (!v) return null;
  const s = String(v).trim();
  const inch = s.match(/([\d.]+)\s*(?:"|''|in\b|inch)/i);
  if (inch) return Math.round(parseFloat(inch[1]) * 25.4);
  const mm = s.match(/([\d.]+)/);
  if (!mm) return null;
  const n = parseFloat(mm[1]);
  // vrednosti < 20 verjetno cole (npr. "4")
  return n < 20 ? Math.round(n * 25.4) : Math.round(n);
}

function parseNumber(v) {
  if (v == null) return null;
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function buildAddress(tags) {
  const street = tags["addr:street"];
  const num = tags["addr:housenumber"];
  const city = tags["addr:city"] || tags["addr:place"];
  const line = [street, num].filter(Boolean).join(" ");
  const label = [line, city].filter(Boolean).join(", ");
  return label || null;
}

// Pretvori OSM node v naš objekt hidranta.
function normalize(node) {
  const t = node.tags || {};
  const flow =
    parseNumber(t["fire_hydrant:flow_capacity"]) ??
    parseNumber(t["flow_rate"]);
  return {
    id: `OSM-${node.id}`,
    osmId: node.id,
    lat: node.lat,
    lng: node.lon,
    address: buildAddress(t),
    type: TYPE_MAP[t["fire_hydrant:type"]] || t["fire_hydrant:type"] || "hidrant",
    diameterMm: parseDiameter(t["fire_hydrant:diameter"] || t["diameter"]),
    flowLpm: flow, // null, če ni realnega podatka
    pressureBar: parseNumber(t["fire_hydrant:pressure"]),
    couplings: parseNumber(t["couplings"]),
    colour: t["colour"] || null,
    position: t["fire_hydrant:position"] || null,
    source: "OpenStreetMap",
  };
}

// Sestavi Overpass poizvedbo za hidrante v polmeru okoli točke.
// "out body 500" omeji odgovor na največ 500 hidrantov.
function query(lat, lng, radiusM) {
  return `[out:json][timeout:25];
(
  node["emergency"="fire_hydrant"](around:${radiusM},${lat},${lng});
  node["fire_hydrant:type"](around:${radiusM},${lat},${lng});
);
out body 500;`;
}

async function runOverpass(endpoint, data) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(data),
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const json = await res.json();
  return json.elements || [];
}

// Glavna funkcija: vrne realne hidrante iz OSM okoli dane lokacije.
// Postopoma povečuje polmer, dokler ne najde vsaj nekaj hidrantov.
export async function fetchNearbyHydrants(loc, { radiiM = [2000, 5000, 10000] } = {}) {
  let lastErr = null;

  for (const radius of radiiM) {
    const data = query(loc.lat, loc.lng, radius);
    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const elements = await runOverpass(endpoint, data);
        const hydrants = elements
          .filter((e) => e.type === "node" && Number.isFinite(e.lat))
          .map(normalize);
        // odstrani morebitne podvojene (isti node prek dveh selektorjev)
        const seen = new Set();
        const unique = hydrants.filter((h) => {
          if (seen.has(h.osmId)) return false;
          seen.add(h.osmId);
          return true;
        });
        if (unique.length > 0) {
          return { hydrants: unique, radiusM: radius };
        }
        // 0 zadetkov → poskusi večji polmer
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
        // poskusi naslednji endpoint
      }
    }
  }

  if (lastErr) {
    throw new Error(
      "Baze hidrantov (OpenStreetMap) trenutno ni mogoče doseči. Poskusi znova čez trenutek."
    );
  }
  return { hydrants: [], radiusM: radiiM[radiiM.length - 1] };
}
