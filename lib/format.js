// Formatiranje zneskov v EUR (npr. €1.234) po slovenskih konvencijah.
export function formatEUR(amount) {
  const value = Math.round(Number(amount) || 0);
  return "€" + value.toLocaleString("sl-SI");
}

// Ura v obliki HH:MM (24-urni format).
export function formatTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString("sl-SI", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
