// Geografski pripomočki

const R = 6371000; // polmer Zemlje v metrih

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Haversine razdalja med dvema točkama (v metrih)
export function haversineMeters(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

// Lepo oblikovana razdalja
export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

// Ocena časa vožnje (zelo groba) pri povprečni hitrosti gasilskega vozila v mestu
export function estimateDriveMinutes(meters, kmh = 35) {
  const minutes = (meters / 1000 / kmh) * 60;
  return Math.max(1, Math.round(minutes));
}
