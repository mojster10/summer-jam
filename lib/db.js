// ─────────────────────────────────────────────────────────────
// DOSTOP DO BAZE HIDRANTOV
// ─────────────────────────────────────────────────────────────
// Trenutno uporablja vgrajeni nabor podatkov (lib/data/hydrants.js).
//
// Za pravo bazo (npr. Postgres / Supabase / Neon) zamenjaj spodnje
// funkcije s poizvedbami. Primer s Postgres (npr. paket "pg"):
//
//   import { Pool } from "pg";
//   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
//   export async function getAllHydrants() {
//     const { rows } = await pool.query("SELECT * FROM hydrants");
//     return rows;
//   }
//
// Vmesnik (getAllHydrants / getHydrantById) ostane enak, zato
// aplikaciji ni treba spreminjati ničesar drugega.
// ─────────────────────────────────────────────────────────────

import { HYDRANTS } from "./data/hydrants.js";

export async function getAllHydrants() {
  return HYDRANTS;
}

export async function getHydrantById(id) {
  return HYDRANTS.find((h) => h.id === id) || null;
}

export async function countHydrants() {
  return HYDRANTS.length;
}
