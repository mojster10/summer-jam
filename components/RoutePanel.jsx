"use client";

import { formatDistance } from "@/lib/geo.js";

export default function RoutePanel({ route, target, routing, onClose }) {
  if (routing) {
    return (
      <div className="panel nav">
        <h2>🧭 Navigacija</h2>
        <p className="hint">Računam pot …</p>
      </div>
    );
  }
  if (!route || !target) return null;

  const mins = route.durationS != null ? Math.round(route.durationS / 60) : null;

  return (
    <div className="panel nav">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>🧭 Navigacija do hidranta</h2>
        {onClose && (
          <button className="btn btn-ghost" style={{ padding: "4px 10px" }} onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="sub" style={{ margin: "6px 0 12px" }}>
        Cilj: <b>{target.address || target.type}</b> ({target.id})
      </div>

      {route.fallback ? (
        <div className="error" style={{ marginTop: 0 }}>
          Usmerjanje po cestah trenutno ni dosegljivo — na zemljevidu je
          prikazana zračna smer. Uporabi gumb spodaj za zunanjo navigacijo.
        </div>
      ) : (
        <div className="metrics" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="metric">
            <div className="k">Po cesti</div>
            <div className="v">{formatDistance(route.distanceM)}</div>
          </div>
          <div className="metric">
            <div className="k">Čas vožnje</div>
            <div className="v">{mins} min</div>
          </div>
        </div>
      )}

      {route.steps && route.steps.length > 0 && (
        <ol className="steps">
          {route.steps.map((s, i) => (
            <li key={i}>
              <span>{s.text}</span>
              {s.distanceM > 0 && (
                <em>{formatDistance(s.distanceM)}</em>
              )}
            </li>
          ))}
        </ol>
      )}

      <a
        className="btn btn-primary"
        style={{ display: "block", textAlign: "center", marginTop: 12, textDecoration: "none" }}
        href={`https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}&travelmode=driving`}
        target="_blank"
        rel="noreferrer"
      >
        Odpri v Google Zemljevidih ↗
      </a>
    </div>
  );
}
