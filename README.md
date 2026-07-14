# 🚒 Hidrant LJ

Spletna aplikacija, ki gasilcem pomaga **hitro poiskati najbližje in
najprimernejše hidrante v Ljubljani**. Vneseš naslov objekta v požaru (ali
uporabiš trenutno GPS lokacijo), aplikacija pa vrne razvrščen seznam hidrantov
skupaj z zemljevidom.

## Kako deluje izbira hidranta

Aplikacija ne izbere zgolj najbližjega hidranta, ampak **najbolj uporabnega**.
Vsak hidrant dobi sestavljeno oceno na podlagi treh dejavnikov (glej
`lib/scoring.js`):

| Dejavnik | Utež | Razlaga |
|----------|------|---------|
| **Razdalja** | 55 % | Zračna razdalja od lokacije požara (haversine). Bližje = bolje. |
| **Pretok vode** | 30 % | Zmogljivost hidranta v l/min — "kako poln" oz. kako močan je. Več = bolje. |
| **Parkiranje** | 15 % | Ali lahko gasilsko vozilo parkira ob hidrantu (odlično / dobro / omejeno / slabo). |

Hidranti v **okvari** so izločeni; hidranti **v vzdrževanju** dobijo kazen na
oceni. Rezultat je razvrščen seznam, kjer je najboljši označen kot
**priporočeni**.

## Funkcije

- 🔎 **Iskanje po naslovu** — geokodiranje **v brskalniku** (Photon → Nominatim
  kot rezerva), omejeno na Ljubljano. Zahtevek gre iz uporabnikovega IP-ja, zato
  se izognemo blokadi (403), ki jo te storitve pogosto vrnejo oblačnim
  strežnikom (Vercel, AWS).
- 📍 **Trenutna lokacija** — uporabi GPS naprave (deluje prek HTTPS).
- 🖱️ **Klik na zemljevid** — lokacijo požara lahko določiš tudi s klikom na
  zemljevid; deluje tudi, če geokodiranje ali GPS nista na voljo.
- 🗺️ **Interaktivni zemljevid** (Leaflet + OpenStreetMap) z lokacijo požara in
  hidranti.
- 📊 **Podrobnosti hidranta** — razdalja, ocenjeni čas prihoda, pretok, tlak,
  premer, možnost parkiranja in navigacija do hidranta.
- 🗄️ **Baza hidrantov** — dostopna prek API-ja.

## API

| Pot | Metoda | Opis |
|-----|--------|------|
| `/api/hydrants` | GET | Vsi hidranti iz baze. |
| `/api/nearest` | POST | Telo `{ lat, lng, limit? }` → razvrščeni hidranti. |
| `/api/geocode?q=<naslov>` | GET | Naslov → koordinate (neobvezno; UI geokodira v brskalniku). |

## Baza podatkov

Privzeto se uporablja vgrajeni nabor podatkov v `lib/data/hydrants.js` (vzorčni
hidranti po ljubljanskih četrtih). Dostop do baze je izoliran v `lib/db.js`, zato
ga zlahka zamenjaš s pravo bazo (Postgres / Supabase / Neon) — samo prepiši
funkciji `getAllHydrants()` in `getHydrantById()`, vmesnik ostane enak. Primer je
zapisan v komentarju datoteke.

> Podatki o hidrantih so **vzorčni** in namenjeni predstavitvi. Za uporabo na
> terenu jih zamenjaj z uradnimi podatki (npr. VOKA Snaga / JP Vodovod).

## Zagon lokalno

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Okoljske spremenljivke

Kopiraj `.env.example` v `.env.local`. Aplikacija deluje tudi brez ključev.

- `NOMINATIM_EMAIL` — (priporočljivo) kontaktni e-naslov za Nominatim.

## Namestitev na Vercel

1. Potisni repozitorij na GitHub.
2. Na [vercel.com](https://vercel.com) uvozi projekt (samodejno zazna Next.js).
3. (Neobvezno) dodaj `NOMINATIM_EMAIL` med Environment Variables.
4. Deploy. 🚀

## Tehnologije

Next.js 14 (App Router) · React 18 · Leaflet / react-leaflet · OpenStreetMap
Nominatim · brez zunanje baze (privzeto).
