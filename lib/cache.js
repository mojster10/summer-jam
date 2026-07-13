// Preprost in-memory cache za backend odgovore, da ne pregorimo API kvot.
// V serverless okolju živi znotraj posamezne instance; za produkcijo z več
// instancami bi uporabili Redis ali podoben skupni cache.

const store = new Map();

// Privzeti TTL: 12 minut (znotraj priporočenega razpona 10–15 min).
const DEFAULT_TTL_MS = 12 * 60 * 1000;

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

export function cacheSet(key, value, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

// Vrne zadnjo znano vrednost, tudi če je potekla (za graceful fallback,
// ko zunanji API ne odgovori).
export function cacheGetStale(key) {
  const entry = store.get(key);
  return entry ? entry.value : undefined;
}
