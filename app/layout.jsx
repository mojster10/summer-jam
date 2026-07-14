import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Hidrant SI — najbližji hidranti za gasilce (vsa Slovenija)",
  description:
    "Poišči najbližje hidrante kjerkoli v Sloveniji. Realne lokacije iz OpenStreetMap, razvrstitev po razdalji (in pretoku, kjer je znan).",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b91c1c",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sl">
      <body>{children}</body>
    </html>
  );
}
