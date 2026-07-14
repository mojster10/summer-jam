"use client";

import { formatDistance } from "@/lib/geo.js";

function parkingBadgeClass(key) {
  if (key === "odlicno" || key === "dobro") return "badge-green";
  if (key === "omejeno") return "badge-amber";
  return "badge-red";
}

function statusBadge(status) {
  if (status === "vzdrzevanje")
    return { cls: "badge-amber", label: "V vzdrževanju" };
  return { cls: "badge-green", label: "Aktiven" };
}

export default function HydrantList({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="results">
      {results.map((h, i) => {
        const best = i === 0;
        const st = statusBadge(h.status);
        return (
          <div key={h.id} className={`card ${best ? "best" : ""}`}>
            <div className="card-head">
              <div style={{ display: "flex", gap: 10 }}>
                <span className={`rank ${best ? "best" : ""}`}>{i + 1}</span>
                <div>
                  <h3>{h.address}</h3>
                  <div className="sub">
                    {h.id} · {h.district} · {h.type}
                  </div>
                </div>
              </div>
              {best && <span className="badge badge-green">Priporočeno</span>}
            </div>

            <div className="metrics">
              <div className="metric">
                <div className="k">Razdalja</div>
                <div className="v">{formatDistance(h.distanceMeters)}</div>
              </div>
              <div className="metric">
                <div className="k">Pretok vode</div>
                <div className="v">{h.flowLpm} l/min</div>
              </div>
              <div className="metric">
                <div className="k">~ Prihod</div>
                <div className="v">{h.driveMinutes} min</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              <span className={`badge ${parkingBadgeClass(h.truckParking)}`}>
                🚒 Parkiranje: {h.parkingLabel}
              </span>
              <span className="badge badge-blue">
                💧 {h.pressureBar} bar · ⌀{h.diameterMm} mm
              </span>
              <span className={`badge ${st.cls}`}>{st.label}</span>
            </div>

            <div className="parking-note">{h.parkingNote}</div>

            <div className="scorebar" title={`Skupna ocena: ${(h.score * 100).toFixed(0)}%`}>
              <span style={{ width: `${Math.round(h.score * 100)}%` }} />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
                fontSize: 11,
                color: "var(--muted)",
              }}
            >
              <span>Skupna ocena: {(h.score * 100).toFixed(0)}%</span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Navigacija ↗
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
