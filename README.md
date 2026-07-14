# 🚒 Hidrant SI

Spletna aplikacija, ki gasilcem pomaga **hitro poiskati najbližje hidrante
kjerkoli v Sloveniji**. Vneseš naslov objekta v požaru, uporabiš trenutno GPS
lokacijo ali klikneš na zemljevid — aplikacija vrne razvrščen seznam hidrantov
skupaj z zemljevidom.

## Vir podatkov (pomembno)

Hidranti prihajajo iz **OpenStreetMap** (`emergency=fire_hydrant`), ki je edini
javno dostopen, brezplačen in vseslovenski register hidrantov. Vsebuje **vse
hidrante, ki so v OSM vrisani**, z realnimi koordinatami.

- ✅ **Lokacije so realne** (iz OSM).
- ⚠️ **Pokritost ni nujno popolna** — odvisna je od tega, koliko hidrantov je v
  posameznem kraju vrisanih v OSM.
- ⚠️ **Pretok in tlak** sta v OSM zabeležena le redko
  (`fire_hydrant:flow_capacity`, `fire_hydrant:pressure`). Kjer podatka ni, je
  prikazano **"neznano"** — vrednosti se **ne izmišljujejo**.
- ℹ️ **Možnosti parkiranja** gasilskega vozila ob hidrantu ni v nobeni javni
  bazi, zato ni prikazana. (Popoln register s pretoki in parkirišči vodijo
  komunalna podjetja / gasilske službe in ni javno dostopen.)

Če razpolagaš z uradnim registrom (npr. lokalno komunalno podjetje), ga je
mogoče priključiti kot dodaten/nadomestni vir v `lib/hydrantsClient.js`.

## Kako deluje razvrščanje

Vsak hidrant dobi oceno (glej `lib/scoring.js`):

- **Razdalja** — zračna razdalja od požara (haversine); vedno na voljo.
- **Pretok** — upošteva se **samo, kadar OSM vsebuje realen podatek**; sicer se
  celotna teža prenese na razdaljo (renormalizacija, brez izmišljevanja).

Najboljši rezultat je označen kot **priporočeni**.

## Funkcije

- 🔎 **Iskanje po naslovu** — geokodiranje **v brskalniku** (Photon → Nominatim
  kot rezerva), za vso Slovenijo. Zahtevek gre iz uporabnikovega IP-ja, zato se
  izognemo blokadi (403), ki jo storitve pogosto vračajo oblačnim strežnikom
  (Vercel, AWS).
- 📍 **Trenutna lokacija** — GPS naprave (deluje prek HTTPS).
- 🖱️ **Klik na zemljevid** — lokacijo požara lahko določiš tudi s klikom;
  deluje tudi, če geokodiranje ali GPS nista na voljo.
- 🗺️ **Interaktivni zemljevid** (Leaflet + OpenStreetMap).
- 📊 **Podrobnosti hidranta** — razdalja, ocenjeni čas prihoda, tip, premer,
  (pretok/tlak, kjer obstaja) in navigacija.

## Arhitektura

Popolnoma **client-side** (statična Next.js stran, brez zalednih API poti):

- `lib/hydrantsClient.js` — pridobivanje hidrantov iz Overpass (OSM).
- `lib/geocodeClient.js` — geokodiranje naslovov (Photon/Nominatim).
- `lib/scoring.js` — razvrščanje po razdalji (+ pretok, kjer je znan).
- `lib/geo.js` — razdalje in ocene.
- `components/HydrantMap.jsx`, `components/HydrantList.jsx`, `app/page.jsx`.

## Zagon lokalno

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Okoljske spremenljivke

**Nobenih ni potrebnih.** Aplikacija deluje brez ključev.

## Namestitev na Vercel

1. Potisni repozitorij na GitHub.
2. Na [vercel.com](https://vercel.com) uvozi projekt (samodejno zazna Next.js).
3. Deploy. 🚀 (Po prvem uvozu se vsak `git push` samodejno redeploya.)

## Tehnologije

Next.js 14 (App Router) · React 18 · Leaflet / react-leaflet · OpenStreetMap
Overpass API · Photon / Nominatim · brez zaledne baze in brez ključev.
