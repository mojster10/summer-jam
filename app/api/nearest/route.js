// POST /api/nearest — vrne razvrščene najbližje/najboljše hidrante
// Telo: { lat: number, lng: number, limit?: number }
import { NextResponse } from "next/server";
import { getAllHydrants } from "@/lib/db.js";
import { rankHydrants, WEIGHTS } from "@/lib/scoring.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neveljaven JSON." }, { status: 400 });
  }

  const lat = Number(body?.lat);
  const lng = Number(body?.lng);
  const limit = Math.min(Math.max(Number(body?.limit) || 5, 1), 20);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: "Potrebna sta veljavna 'lat' in 'lng'." },
      { status: 400 }
    );
  }

  const fireLocation = { lat, lng };
  const hydrants = await getAllHydrants();
  const ranked = rankHydrants(hydrants, fireLocation, { limit });

  return NextResponse.json({
    fireLocation,
    weights: WEIGHTS,
    count: ranked.length,
    results: ranked,
  });
}
