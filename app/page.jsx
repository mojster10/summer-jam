"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import HydrantList from "@/components/HydrantList.jsx";
import { geocodeAddress } from "@/lib/geocodeClient.js";
import { fetchNearbyHydrants } from "@/lib/hydrantsClient.js";
import { rankHydrants } from "@/lib/scoring.js";
import { formatDistance } from "@/lib/geo.js";

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

  // Poišči hidrante za dano lokacijo:
  // 1) iz OpenStreetMap (Overpass) potegni realne hidrante v okolici,
  // 2) jih razvrsti (razdalja + pretok, kjer je znan) — vse v brskalniku.
  const findHydrants = useCallback(async (loc, label) => {
    setLoading(true);
    setError("");
    setSuggestions([]);
    setFireLocation(loc);
    setResults([]);
    setStatus(
      label ? `Iščem hidrante blizu: ${label} …` : "Iščem hidrante …"
    );
    try {
      const { hydrants, radiusM } = await fetchNearbyHydrants(loc);
      if (!hydrants.length) {
        setStatus("");
        setError(
          `V polmeru ${formatDistance(
            radiusM
          )} ni vrisanih hidrantov v OpenStreetMap.`
        );
        return;
      }
      const ranked = rankHydrants(hydrants, loc, { limit: 8 });
      setResults(ranked);
      setStatus(
        `Najdenih ${hydrants.length} hidrantov (prikazanih najboljših ${ranked.length}).`
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
        const secure =
          typeof window !== "undefined" &&
          (window.isSecureContext ||
            location.hostname === "localhost" ||
            location.hostname === "127.0.0.1");
        let msg;
        if (err.code === 1) {
          msg = secure
            ? "Dostop do lokacije je zavrnjen. V nastavitvah brskalnika dovoli dostop do lokacije za to stran."
            : "Geolokacija deluje samo prek HTTPS. Odpri aplikacijo prek https:// (npr. na Vercelu) ali klikni lokacijo na zemljevidu.";
        } else if (err.code === 2) {
          msg = "Lokacija ni na voljo. Klikni lokacijo požara na zemljevidu.";
        } else if (err.code === 3) {
          msg = "Pridobivanje lokacije je poteklo. Poskusi znova ali klikni na zemljevid.";
        } else {
          msg = "Lokacije ni bilo mogoče pridobiti. Klikni lokacijo na zemljevidu.";
        }
        setError(msg);
        setStatus("");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
        // Geokodiranje poteka v brskalniku (uporabnikov IP), da se
        // izognemo blokadi (403) storitev do oblačnih strežnikov.
        const results = await geocodeAddress(q);
        if (!results.length) {
          setError("Naslova ni bilo mogoče najti v Sloveniji.");
          setStatus("");
          setLoading(false);
          return;
        }
        if (results.length === 1) {
          const r = results[0];
          findHydrants({ lat: r.lat, lng: r.lng }, r.label);
        } else {
          setSuggestions(results);
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

  // Klik na zemljevid nastavi lokacijo požara (deluje brez GPS in interneta)
  const pickOnMap = useCallback(
    (loc) => {
      findHydrants(
        loc,
        `izbrana točka (${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)})`
      );
    },
    [findHydrants]
  );

  return (
    <>
      <header className="header">
        <span className="logo">🚒</span>
        <div>
          <h1>Hidrant SI</h1>
          <p>Najbližji hidranti za gasilce · vsa Slovenija</p>
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
                  placeholder="npr. Slovenska cesta 34, Maribor"
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
                Hidranti se sproti pridobijo iz <b>OpenStreetMap</b> (realne
                lokacije, vsa Slovenija). Razvrstitev temelji na{" "}
                <b>razdalji</b>, kjer pa OSM vsebuje realen podatek o{" "}
                <b>pretoku</b>, se upošteva tudi ta. Izmišljenih vrednosti ni.
                <br />
                Namig: če iskanje po naslovu ali GPS ne deluje, lahko{" "}
                <b>klikneš lokacijo požara neposredno na zemljevidu</b>.
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
              <HydrantMap
                fireLocation={fireLocation}
                results={results}
                onPick={pickOnMap}
              />
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
              <span>🖱️ Klikni na zemljevid za lokacijo požara</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        Hidrant SI · lociranje hidrantov za vso Slovenijo.
        <br />
        Podatki o hidrantih in zemljevid: © OpenStreetMap (sodelavci). Pokritost
        je odvisna od vrisanosti v OSM in ni nujno popolna. Podatki o pretoku
        so na voljo le, kjer jih vsebuje OSM. Pred uporabo na terenu preveri
        uradne vire.
      </footer>
    </>
  );
}
