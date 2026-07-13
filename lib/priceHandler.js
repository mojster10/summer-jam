// Skupna logika za vse cenovne route: cache → živi vir → graceful fallback.
import { NextResponse } from "next/server";
import { cacheGet, cacheSet, cacheGetStale } from "@/lib/cache";
import { MOCK } from "@/lib/mockData";

/**
 * @param {object} cfg
 * @param {string} cfg.category  ključ kategorije (flights/hotel/food/entertainment)
 * @param {() => boolean} cfg.isLive  ali je API ključ nastavljen
 * @param {(dateISO: string) => Promise<Array>} cfg.fetcher  živi vir
 */
export function makePriceRoute({ category, isLive, fetcher }) {
  return async function GET(request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || "";
    const cacheKey = `${category}:${date}`;

    // 1) Svež cache → takoj vrni.
    const cached = cacheGet(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // 2) Ni ključa → privzete cene z opozorilom.
    if (!isLive()) {
      const payload = {
        options: MOCK[category],
        stale: true,
        source: "fallback",
        message: "cene morda niso aktualne (API ključ ni nastavljen)",
        updatedAt: new Date().toISOString(),
      };
      // Krajši TTL za fallback, da hitro preklopimo, ko dodamo ključ.
      cacheSet(cacheKey, payload, 60 * 1000);
      return NextResponse.json(payload);
    }

    // 3) Poskusi živi vir.
    try {
      const options = await fetcher(date);
      const payload = {
        options,
        stale: false,
        source: "live",
        updatedAt: new Date().toISOString(),
      };
      cacheSet(cacheKey, payload);
      return NextResponse.json(payload);
    } catch (err) {
      // 4) Graceful fallback: zadnje znane vrednosti ali privzete cene.
      const stale = cacheGetStale(cacheKey);
      if (stale) {
        return NextResponse.json({
          ...stale,
          stale: true,
          message: "cene morda niso aktualne (uporabljene zadnje znane)",
        });
      }
      return NextResponse.json({
        options: MOCK[category],
        stale: true,
        source: "fallback",
        message: "cene morda niso aktualne (vir trenutno ni dosegljiv)",
        updatedAt: new Date().toISOString(),
      });
    }
  };
}
