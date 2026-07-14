// GET /api/hydrants — vrne vse hidrante iz baze
import { NextResponse } from "next/server";
import { getAllHydrants } from "@/lib/db.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const hydrants = await getAllHydrants();
  return NextResponse.json({ count: hydrants.length, hydrants });
}
