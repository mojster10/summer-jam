// ─────────────────────────────────────────────────────────────
// OCENJEVANJE / RAZVRŠČANJE HIDRANTOV
// ─────────────────────────────────────────────────────────────
// Podatki prihajajo iz OpenStreetMap (glej lib/hydrantsClient.js).
// Realno na voljo je predvsem LOKACIJA; pretok/tlak/premer so v OSM
// zabeleženi le občasno. Zato:
//
//   - RAZDALJA je vedno na voljo → glavni dejavnik.
//   - PRETOK ("kako poln") upoštevamo SAMO, kadar obstaja realen
//     podatek. Kadar ga ni, ga NE izmišljujemo — utež se sorazmerno
//     porazdeli na razdaljo (renormalizacija).
//
// Tako razvrstitev nikoli ne temelji na izmišljenih vrednostih.
// ─────────────────────────────────────────────────────────────

import { haversineMeters, estimateDriveMinutes } from "./geo.js";

// Osnovni uteži, kadar sta znana oba dejavnika.
export const WEIGHTS = {
  distance: 0.7,
  flow: 0.3,
};

// Razdalja, pri kateri ocena pade na ~0 (m).
const MAX_USEFUL_DISTANCE = 5000;
// Referenčni pretok za normalizacijo (l/min).
const MAX_FLOW = 2200;

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

export function scoreHydrant(hydrant, fireLocation) {
  const distanceMeters = haversineMeters(fireLocation, hydrant);
  const distanceScore = clamp01(1 - distanceMeters / MAX_USEFUL_DISTANCE);

  const hasFlow = Number.isFinite(hydrant.flowLpm) && hydrant.flowLpm > 0;
  const flowScore = hasFlow ? clamp01(hydrant.flowLpm / MAX_FLOW) : null;

  // Renormalizacija uteži glede na razpoložljive dejavnike.
  let total;
  if (hasFlow) {
    total = WEIGHTS.distance * distanceScore + WEIGHTS.flow * flowScore;
  } else {
    // pretok ni znan → celotna teža na razdaljo (brez izmišljanja)
    total = distanceScore;
  }

  return {
    ...hydrant,
    distanceMeters,
    driveMinutes: estimateDriveMinutes(distanceMeters),
    hasFlow,
    scores: { distance: distanceScore, flow: flowScore },
    score: total,
  };
}

// Razvrsti hidrante po oceni; vrne največ `limit` rezultatov.
export function rankHydrants(hydrants, fireLocation, { limit = 8 } = {}) {
  return hydrants
    .map((h) => scoreHydrant(h, fireLocation))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
