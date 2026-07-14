// GET /api/geocode?q=<naslov> — pretvori naslov v koordinate (geokodiranje)
// Uporablja brezplačni OpenStreetMap Nominatim. Iskanje omejimo na Ljubljano.
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Groba omejitvena škatla za Ljubljano (viewbox: levo,zgoraj,desno,spodaj)
const LJ_VIEWBOX = "14.42,46.12,14.62,45.98";
const EMAIL = process.env.NOMINATIM_EMAIL || "hidrant-lj@example.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({ error: "Manjka parameter 'q'." }, { status: 400 });
  }

  // Če uporabnik ni omenil mesta, dodamo Ljubljano.
  const query = /ljubljana/i.test(q) ? q : `${q}, Ljubljana, Slovenija`;

  const url =
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      q: query,
      format: "jsonv2",
      addressdetails: "1",
      limit: "5",
      countrycodes: "si",
      viewbox: LJ_VIEWBOX,
      bounded: "1",
      email: EMAIL,
    });

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": `Hidrant-LJ/1.0 (${EMAIL})`,
        "Accept-Language": "sl",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Geokodiranje ni uspelo (${res.status}).` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const results = (Array.isArray(data) ? data : []).map((r) => ({
      label: r.display_name,
      lat: Number(r.lat),
      lng: Number(r.lon),
      type: r.type,
    }));

    return NextResponse.json({ query, count: results.length, results });
  } catch (err) {
    return NextResponse.json(
      { error: "Napaka pri povezavi z geokodirno storitvijo." },
      { status: 502 }
    );
  }
}
