// ─────────────────────────────────────────────────────────────
// OCENJEVANJE HIDRANTOV
// ─────────────────────────────────────────────────────────────
// Odločitev, kateri hidrant je najboljši, temelji na treh dejavnikih:
//   1. RAZDALJA         – bližje je bolje
//   2. ZMOGLJIVOST/PRETOK ("kako poln") – več vode je bolje
//   3. PARKIRANJE za gasilsko vozilo ob hidrantu – lažji dostop je bolje
//
// Vsak dejavnik normaliziramo na 0..1, nato uteženo seštejemo.
// Hidranti v okvari so izločeni; v vzdrževanju dobijo pribitek.
// ─────────────────────────────────────────────────────────────

import { haversineMeters, estimateDriveMinutes } from "./geo.js";

// Uteži (skupaj 1.0). Razdalja je najpomembnejša.
export const WEIGHTS = {
  distance: 0.55,
  flow: 0.3,
  parking: 0.15,
};

// Pretvorba kategorije parkiranja v oceno 0..1
const PARKING_SCORE = {
  odlicno: 1.0,
  dobro: 0.75,
  omejeno: 0.45,
  slabo: 0.2,
};

const PARKING_LABEL = {
  odlicno: "Odlično",
  dobro: "Dobro",
  omejeno: "Omejeno",
  slabo: "Slabo",
};

// Referenčna razdalja, pri kateri ocena razdalje pade na ~0 (v metrih).
// Hidranti dlje od tega so praktično neuporabni kot "najbližji".
const MAX_USEFUL_DISTANCE = 2500;

// Referenčni najvišji pretok za normalizacijo
const MAX_FLOW = 2200;

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

// Izračun sestavljene ocene za en hidrant glede na lokacijo požara.
export function scoreHydrant(hydrant, fireLocation) {
  const distanceMeters = haversineMeters(fireLocation, hydrant);

  // Bližje = višja ocena (linearno do MAX_USEFUL_DISTANCE)
  const distanceScore = clamp01(1 - distanceMeters / MAX_USEFUL_DISTANCE);

  // Več vode = višja ocena
  const flowScore = clamp01((hydrant.flowLpm || 0) / MAX_FLOW);

  // Parkiranje
  const parkingScore = PARKING_SCORE[hydrant.truckParking] ?? 0.4;

  let total =
    WEIGHTS.distance * distanceScore +
    WEIGHTS.flow * flowScore +
    WEIGHTS.parking * parkingScore;

  // Kazen za hidrante v vzdrževanju (delujejo, a z zadržkom)
  if (hydrant.status === "vzdrzevanje") total *= 0.85;

  return {
    ...hydrant,
    distanceMeters,
    driveMinutes: estimateDriveMinutes(distanceMeters),
    parkingLabel: PARKING_LABEL[hydrant.truckParking] ?? hydrant.truckParking,
    scores: {
      distance: distanceScore,
      flow: flowScore,
      parking: parkingScore,
    },
    score: total,
  };
}

// Razvrsti vse hidrante po sestavljeni oceni.
// Izloči tiste v okvari. Vrne največ `limit` rezultatov.
export function rankHydrants(hydrants, fireLocation, { limit = 5 } = {}) {
  return hydrants
    .filter((h) => h.status !== "okvara")
    .map((h) => scoreHydrant(h, fireLocation))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
