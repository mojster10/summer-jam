// Pomočniki za izbiro vikenda (na klientu).

// Vrne ISO datum (YYYY-MM-DD) naslednje sobote glede na današnji dan.
export function nextSaturdayISO(today = new Date()) {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const day = d.getDay(); // 0 = nedelja, 6 = sobota
  let add = (6 - day + 7) % 7;
  if (add === 0) add = 7; // če je danes sobota, vzemi naslednjo
  d.setDate(d.getDate() + add);
  return toISO(d);
}

export function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Lep zapis vikenda: "sob 19. jul – ned 20. jul".
export function weekendLabel(saturdayISO) {
  if (!saturdayISO) return "";
  const sat = new Date(saturdayISO + "T00:00:00");
  const sun = new Date(sat);
  sun.setDate(sun.getDate() + 1);
  const fmt = (d) =>
    d.toLocaleDateString("sl-SI", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  return `${fmt(sat)} – ${fmt(sun)}`;
}
