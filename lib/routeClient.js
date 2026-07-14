// ─────────────────────────────────────────────────────────────
// USMERJANJE (navigacija po cestah)
// ─────────────────────────────────────────────────────────────
// Uporablja brezplačni javni OSRM strežnik (brez ključa, podpira CORS).
// Teče iz brskalnika. Vrne geometrijo poti, dolžino, čas in navodila
// po korakih. Če usmerjanje ni dosegljivo, ponudi ravno linijo kot
// rezervo, da zemljevid vseeno prikaže smer.
// ─────────────────────────────────────────────────────────────

const OSRM = "https://router.project-osrm.org/route/v1/driving";

// Slovenska navodila iz OSRM manevrov.
function toInstruction(step) {
  const m = step.maneuver || {};
  const road = step.name ? ` na ${step.name}` : "";
  const mod = m.modifier;

  const dir = (base) => {
    const map = {
      left: "levo",
      right: "desno",
      "slight left": "rahlo levo",
      "slight right": "rahlo desno",
      "sharp left": "ostro levo",
      "sharp right": "ostro desno",
      straight: "naravnost",
      uturn: "obrni se nazaj",
    };
    return `${base} ${map[mod] || ""}`.trim();
  };

  switch (m.type) {
    case "depart":
      return `Začni vožnjo${road}`;
    case "arrive":
      return "Prispel/-a si do hidranta 🚒";
    case "turn":
      return `Zavij ${dir("")}${road}`.replace("Zavij  ", "Zavij ");
    case "new name":
    case "continue":
      return `Nadaljuj${road}`;
    case "merge":
      return `Priključi se${road}`;
    case "on ramp":
      return `Zapelji na uvoz${road}`;
    case "off ramp":
      return `Zapelji na izvoz${road}`;
    case "fork":
      return `Na razcepu drži ${dir("")}`.trim();
    case "end of road":
      return `Na koncu ceste zavij ${dir("")}`.trim();
    case "roundabout":
    case "rotary":
      return `V krožišču zapelji${
        m.exit ? ` na ${m.exit}. izvoz` : ""
      }${road}`;
    default:
      return `Nadaljuj ${dir("")}${road}`.trim();
  }
}

export async function fetchRoute(from, to) {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url =
    `${OSRM}/${coords}?` +
    new URLSearchParams({
      overview: "full",
      geometries: "geojson",
      steps: "true",
    });

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) throw new Error("Brez poti");

    // GeoJSON je [lng,lat] → pretvori v [lat,lng] za Leaflet
    const line = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

    const steps = (route.legs?.[0]?.steps || [])
      .map((s) => ({
        text: toInstruction(s),
        distanceM: s.distance,
      }))
      .filter((s) => s.text);

    return {
      line,
      distanceM: route.distance,
      durationS: route.duration,
      steps,
      fallback: false,
    };
  } catch (e) {
    // Rezerva: ravna linija med točkama
    return {
      line: [
        [from.lat, from.lng],
        [to.lat, to.lng],
      ],
      distanceM: null,
      durationS: null,
      steps: [],
      fallback: true,
    };
  }
}
