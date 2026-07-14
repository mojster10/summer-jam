"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import HydrantList from "@/components/HydrantList.jsx";

// Leaflet ne sme na strežnik (uporablja window) → dinamični uvoz brez SSR
const HydrantMap = dynamic(() => import("@/components/HydrantMap.jsx"), {
  ssr: false,
  loading: () => <div className="placeholder">Nalagam zemljevid …</div>,
});

export default function Home() {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fireLocation, setFireLocation] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Pokliči ocenjevalnik za dano lokacijo
  const findHydrants = useCallback(async (loc, label) => {
    setLoading(true);
    setError("");
    setSuggestions([]);
    setStatus(label ? `Iščem hidrante blizu: ${label}` : "Iščem hidrante …");
    try {
      const res = await fetch("/api/nearest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...loc, limit: 5 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Napaka strežnika.");
      setFireLocation(loc);
      setResults(data.results);
      setStatus(
        data.results.length
          ? `Najdenih ${data.results.length} hidrantov`
          : "V bližini ni najdenih hidrantov."
      );
    } catch (e) {
      setError(e.message);
      setStatus("");
    } finally {
      setLoading(false);
    }
  }, []);

  // 1) Uporabi mojo trenutno lokacijo (GPS)
  const useMyLocation = useCallback(() => {
    setError("");
    if (!("geolocation" in navigator)) {
      setError("Naprava ne podpira geolokacije.");
      return;
    }
    setStatus("Pridobivam lokacijo …");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        findHydrants(loc, "moja lokacija");
      },
      (err) => {
        setError(
          "Ni bilo mogoče pridobiti lokacije: " +
            (err.message || "dovoljenje zavrnjeno.")
        );
        setStatus("");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [findHydrants]);

  // 2) Poišči po naslovu (geokodiranje)
  const searchAddress = useCallback(
    async (e) => {
      e?.preventDefault();
      const q = address.trim();
      if (!q) {
        setError("Vnesi naslov požara.");
        return;
      }
      setLoading(true);
      setError("");
      setStatus("Iščem naslov …");
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Geokodiranje ni uspelo.");
        if (!data.results.length) {
          setError("Naslova ni bilo mogoče najti v Ljubljani.");
          setStatus("");
          setLoading(false);
          return;
        }
        if (data.results.length === 1) {
          const r = data.results[0];
          findHydrants({ lat: r.lat, lng: r.lng }, r.label);
        } else {
          setSuggestions(data.results);
          setStatus("Izberi točen naslov:");
          setLoading(false);
        }
      } catch (e2) {
        setError(e2.message);
        setStatus("");
        setLoading(false);
      }
    },
    [address, findHydrants]
  );

  const pickSuggestion = (r) => {
    setAddress(r.label);
    findHydrants({ lat: r.lat, lng: r.lng }, r.label);
  };

  return (
    <>
      <header className="header">
        <span className="logo">🚒</span>
        <div>
          <h1>Hidrant LJ</h1>
          <p>Najbližji hidranti za gasilce · Ljubljana</p>
        </div>
      </header>

      <div className="container">
        <div className="layout">
          {/* LEVA STRAN: iskanje + rezultati */}
          <div>
            <div className="panel">
              <h2>Lokacija požara</h2>

              <form onSubmit={searchAddress} className="field">
                <label htmlFor="addr">Naslov objekta v požaru</label>
                <input
                  id="addr"
                  type="text"
                  placeholder="npr. Slovenska cesta 34, Ljubljana"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="off"
                />
                <div className="row" style={{ marginTop: 10 }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    🔎 Poišči hidrante
                  </button>
                </div>
              </form>

              {suggestions.length > 0 && (
                <ul className="suggestions">
                  {suggestions.map((r, i) => (
                    <li key={i} onClick={() => pickSuggestion(r)}>
                      {r.label}
                    </li>
                  ))}
                </ul>
              )}

              <div className="divider">ali</div>

              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: "100%" }}
                onClick={useMyLocation}
                disabled={loading}
              >
                📍 Uporabi mojo trenutno lokacijo
              </button>

              {status && <p className="hint">{status}</p>}
              {error && <div className="error">{error}</div>}

              <div className="hint">
                Razvrstitev upošteva <b>razdaljo</b>, <b>pretok vode</b> (kako
                zmogljiv je hidrant) in <b>možnost parkiranja</b> gasilskega
                vozila ob hidrantu.
              </div>
            </div>

            {results.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h2
                  style={{
                    fontSize: 15,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "var(--muted)",
                    margin: "0 0 12px 4px",
                  }}
                >
                  Priporočeni hidranti
                </h2>
                <HydrantList results={results} />
              </div>
            )}
          </div>

          {/* DESNA STRAN: zemljevid */}
          <div className="panel" style={{ padding: 12 }}>
            <div className="map-wrap">
              {fireLocation ? (
                <HydrantMap fireLocation={fireLocation} results={results} />
              ) : (
                <HydrantMap />
              )}
            </div>
            <div className="legend">
              <span>
                <i className="dot" style={{ background: "#16a34a" }} />{" "}
                Priporočeni hidrant
              </span>
              <span>
                <i className="dot" style={{ background: "#3b82f6" }} /> Drugi
                hidranti
              </span>
              <span>🔥 Lokacija požara</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        Hidrant LJ · demonstracijska aplikacija za hitro lociranje hidrantov.
        <br />
        Podatki o hidrantih so vzorčni. Zemljevid: © OpenStreetMap. Pred uporabo
        na terenu preveri uradne vire.
      </footer>
    </>
  );
}
