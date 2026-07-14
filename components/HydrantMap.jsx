"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { formatDistance } from "@/lib/geo.js";

const LJ_CENTER = [46.0569, 14.5058];

// Ikona za lokacijo požara (rdeč marker z emojijem)
const fireIcon = L.divIcon({
  className: "",
  html: `<div style="font-size:26px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))">🔥</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 24],
});

// Ob spremembi lokacije premakni pogled
function Recenter({ center, results }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    const points = [center, ...results.map((r) => [r.lat, r.lng])];
    if (points.length > 1) {
      map.fitBounds(points, { padding: [50, 50], maxZoom: 16 });
    } else {
      map.setView(center, 15);
    }
  }, [center, results, map]);
  return null;
}

// Ob kliku na zemljevid nastavi lokacijo požara
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      if (onPick) onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function HydrantMap({ fireLocation, results = [], onPick }) {
  const center = fireLocation
    ? [fireLocation.lat, fireLocation.lng]
    : LJ_CENTER;

  return (
    <MapContainer center={LJ_CENTER} zoom={13} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {fireLocation && (
        <Marker position={[fireLocation.lat, fireLocation.lng]} icon={fireIcon}>
          <Popup>
            <b>Lokacija požara</b>
          </Popup>
        </Marker>
      )}

      {results.map((h, i) => {
        const best = i === 0;
        const color = best ? "#16a34a" : "#3b82f6";
        return (
          <CircleMarker
            key={h.id}
            center={[h.lat, h.lng]}
            radius={best ? 11 : 8}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: color,
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <b>
                {best ? "⭐ " : `#${i + 1} `}
                {h.address}
              </b>
              <br />
              {h.id} · {h.type}
              <br />
              Razdalja: {formatDistance(h.distanceMeters)}
              <br />
              Pretok: {h.flowLpm} l/min
              <br />
              Parkiranje: {h.parkingLabel}
            </Popup>
          </CircleMarker>
        );
      })}

      {onPick && <ClickHandler onPick={onPick} />}
      {fireLocation && <Recenter center={center} results={results} />}
    </MapContainer>
  );
}
