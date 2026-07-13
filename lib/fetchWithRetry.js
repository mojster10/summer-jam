// fetch z retry-jem in eksponentnim backoffom + preprost rate limiting.

// Minimalni razmik med klici na isti gostitelj (host), da ne presežemo kvot.
const MIN_INTERVAL_MS = 250;
const lastCallByHost = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function throttle(url) {
  let host;
  try {
    host = new URL(url).host;
  } catch {
    host = "unknown";
  }
  const last = lastCallByHost.get(host) || 0;
  const wait = MIN_INTERVAL_MS - (Date.now() - last);
  if (wait > 0) await sleep(wait);
  lastCallByHost.set(host, Date.now());
}

/**
 * @param {string} url
 * @param {RequestInit} options
 * @param {{ retries?: number, baseDelayMs?: number, timeoutMs?: number }} cfg
 */
export async function fetchWithRetry(url, options = {}, cfg = {}) {
  const { retries = 3, baseDelayMs = 500, timeoutMs = 8000 } = cfg;

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    await throttle(url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);

      // 429 / 5xx so poskusa vredni; ostale napake vrnemo takoj.
      if (res.status === 429 || res.status >= 500) {
        lastError = new Error(`HTTP ${res.status}`);
      } else {
        return res;
      }
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;
    }

    if (attempt < retries) {
      // Eksponentni backoff: 500ms, 1s, 2s, ... z majhnim jitterjem.
      const delay = baseDelayMs * 2 ** attempt + Math.floor(Math.random() * 200);
      await sleep(delay);
    }
  }
  throw lastError || new Error("fetchWithRetry: neznana napaka");
}
