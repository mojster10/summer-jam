"use client";

import { formatDistance } from "@/lib/geo.js";

export default function HydrantList({ results, onNavigate, routeTargetId }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="results">
      {results.map((h, i) => {
        const active = routeTargetId ? h.id === routeTargetId : i === 0;
        const best = active;
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
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {i === 0 && (
                  <span className="badge badge-green">Priporočeno</span>
                )}
                {active && routeTargetId && (
                  <span className="badge badge-blue">🧭 navigacija</span>
                )}
              </div>
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
                alignItems: "center",
                marginTop: 10,
                gap: 10,
              }}
            >
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                Ocena: {(h.score * 100).toFixed(0)}%{" "}
                {h.hasFlow ? "(razdalja + pretok)" : "(po razdalji)"}
              </span>
              <button
                type="button"
                className={active ? "btn btn-primary" : "btn btn-ghost"}
                style={{ padding: "8px 14px", flex: "0 0 auto" }}
                onClick={() => onNavigate && onNavigate(h)}
              >
                🧭 Navigiraj
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
