"use client";

import { formatDistance } from "@/lib/geo.js";

export default function HydrantList({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="results">
      {results.map((h, i) => {
        const best = i === 0;
        return (
          <div key={h.id} className={`card ${best ? "best" : ""}`}>
            <div className="card-head">
              <div style={{ display: "flex", gap: 10 }}>
                <span className={`rank ${best ? "best" : ""}`}>{i + 1}</span>
                <div>
                  <h3>{h.address || "Hidrant (brez naslova v OSM)"}</h3>
                  <div className="sub">
                    {h.id} · {h.type}
                    {h.position ? ` · ${h.position}` : ""}
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
                <div className="k">~ Prihod</div>
                <div className="v">{h.driveMinutes} min</div>
              </div>
              <div className="metric">
                <div className="k">Pretok</div>
                <div className="v">
                  {h.hasFlow ? (
                    `${h.flowLpm} l/min`
                  ) : (
                    <span style={{ color: "var(--muted)", fontWeight: 500 }}>
                      neznano
                    </span>
                  )}
                </div>
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
              {h.diameterMm && (
                <span className="badge badge-blue">⌀ {h.diameterMm} mm</span>
              )}
              {Number.isFinite(h.pressureBar) && (
                <span className="badge badge-blue">💧 {h.pressureBar} bar</span>
              )}
              {Number.isFinite(h.couplings) && (
                <span className="badge badge-blue">
                  🔌 {h.couplings} priključkov
                </span>
              )}
              {h.colour && (
                <span className="badge badge-blue">🎨 {h.colour}</span>
              )}
              <span className="badge badge-amber">Vir: {h.source}</span>
            </div>

            <div className="scorebar" title={`Ocena: ${(h.score * 100).toFixed(0)}%`}>
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
              <span>
                Ocena: {(h.score * 100).toFixed(0)}%{" "}
                {h.hasFlow ? "(razdalja + pretok)" : "(po razdalji)"}
              </span>
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
