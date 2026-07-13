import "./globals.css";

export const metadata = {
  title: "Sanjski vikend planer — vikend v Ljubljani",
  description:
    "Načrtuj svoj sanjski vikend v Ljubljani: izberi lete, hotel, hrano in zabavo znotraj proračuna €500.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#003040",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sl">
      <body>{children}</body>
    </html>
  );
}
