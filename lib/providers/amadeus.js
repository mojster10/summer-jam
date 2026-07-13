// Skupni pomočnik za Amadeus API (uporabljen za lete in hotele).
// Amadeus uporablja OAuth2 client_credentials tok, ki ga cachiramo do izteka.
import { fetchWithRetry } from "@/lib/fetchWithRetry";

// Privzeto test okolje; za produkcijo nastavi AMADEUS_BASE_URL na
// https://api.amadeus.com
const BASE_URL = process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com";

let tokenCache = { value: null, expiresAt: 0 };

export function hasAmadeusKeys() {
  return Boolean(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET);
}

export async function getAmadeusToken() {
  if (tokenCache.value && Date.now() < tokenCache.expiresAt) {
    return tokenCache.value;
  }
  const res = await fetchWithRetry(`${BASE_URL}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }).toString(),
  });
  if (!res.ok) throw new Error(`Amadeus auth failed: ${res.status}`);
  const data = await res.json();
  // expires_in je v sekundah; obdržimo 30s varnostne rezerve.
  tokenCache = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 30) * 1000,
  };
  return tokenCache.value;
}

export function amadeusBaseUrl() {
  return BASE_URL;
}
