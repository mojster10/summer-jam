import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Hidrant LJ — najbližji hidranti za gasilce",
  description:
    "Poišči najbližje in najprimernejše hidrante v Ljubljani glede na razdaljo, pretok vode in možnost parkiranja gasilskega vozila.",
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
