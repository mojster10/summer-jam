# 🌴 Sanjski vikend planer (Dream Weekend Planner)

Načrtovalnik sanjskega vikenda v **Ljubljani**: izberi lete, hotel, hrano in
zabavo ter ostani znotraj proračuna **€500**. Cene se vlečejo **v realnem času**
prek varnega backend proxyja (API ključi ostanejo na strežniku).

Zgrajeno z **Next.js (App Router)** + React. Stanje izbire se hrani v
`localStorage` in se obnovi ob osvežitvi strani.

---

## ✨ Funkcije

- **Štiri kategorije** z ~5 možnostmi iz Ljubljane: ✈️ Leti, 🏨 Hotel, 🍽️ Hrana, 🎉 Zabava.
- **Žive cene** prek backend proxyja (`/api/prices/*`) — API ključi nikoli ne pridejo v frontend.
- **Izbirljiv vikend** (date picker); privzeto naslednji vikend. Ob spremembi datuma se cene osvežijo (skeleton loader v vrsticah).
- **Proračun €500**: temno moder banner pod pragom (🌴), rdeč z opozorilom nad njim (⚠️). Podvsote na kategorijo, takojšnje posodobitve.
- **Cache** (~12 min), **rate limiting** in **retry z eksponentnim backoffom** na strežniku.
- **Graceful fallback**: če API pade ali ni ključa, prikaže zadnje znane / privzete cene + opozorilo _"cene morda niso aktualne"_.
- **Časovni žig** "Cene osvežene ob HH:MM".
- **Dostopnost**: fokus stanja (2px moder outline), `aria-label`-i, tipkovnica, tap tarče ≥44px, responsive.
- **Abelium design system**: modra monokromatska paleta, HK Grotesk (fallback system-ui).

---

## 🚀 Zagon

```bash
npm install
cp .env.example .env.local   # izpolni ključe (neobvezno — brez njih tečejo mock cene)
npm run dev                  # http://localhost:3000
```

Produkcija:

```bash
npm run build
npm start
```

> Brez API ključev aplikacija deluje takoj z realističnimi privzetimi (mock)
> cenami iz Ljubljane in prikaže diskretno opozorilo, da cene morda niso aktualne.

---

## 🔌 Realnočasni viri (backend proxy)

Vsaka kategorija ima svoj route handler v `app/api/prices/<kategorija>/route.js`,
ki kliče zunanji vir prek `lib/providers/*` in vrne
`{ options: [{ id, name, price, sourceUrl }], stale, source, updatedAt, message }`.

| Kategorija | Vir | Ključ v `.env.local` |
| --- | --- | --- |
| ✈️ Leti | [Amadeus Flight Offers Search](https://developers.amadeus.com/) (origin `LJU`) | `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET` |
| 🏨 Hotel | [Amadeus Hotel Search](https://developers.amadeus.com/) (`cityCode=LJU`, 2 noči) | `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET` |
| 🍽️ Hrana | [Google Places Text Search](https://console.cloud.google.com/) (`restaurant Ljubljana`, ocena iz `price_level`) | `GOOGLE_PLACES_API_KEY` |
| 🎉 Zabava | [Ticketmaster Discovery](https://developer.ticketmaster.com/) (`city=Ljubljana`) | `TICKETMASTER_API_KEY` |

### Kako pridobiti ključe

- **Amadeus**: registracija na developers.amadeus.com → Self-Service aplikacija → dobiš API Key + Secret (test okolje je brezplačno). Za produkcijske cene nastavi `AMADEUS_BASE_URL=https://api.amadeus.com`.
- **Google Places**: Google Cloud Console → omogoči *Places API* → ustvari API ključ.
- **Ticketmaster**: developer.ticketmaster.com → registracija → *Consumer Key*.

---

## 📁 Struktura

```
app/
  layout.jsx            # root layout, metapodatki
  page.jsx              # glavni zaslon (client): stanje, fetch, localStorage
  globals.css           # Abelium design system
  api/prices/
    flights/route.js    # ✈️  proxy → Amadeus
    hotel/route.js       # 🏨  proxy → Amadeus
    food/route.js        # 🍽️  proxy → Google Places
    entertainment/route.js # 🎉  proxy → Ticketmaster
components/
  BudgetBanner.jsx      # banner s skupno ceno + proračun
  CategoryCard.jsx      # kartica kategorije + skeleton
  OptionRow.jsx         # klikabilna vrstica s checkboxom
lib/
  priceHandler.js       # skupna route logika: cache → live → fallback
  providers/            # integracije z zunanjimi API-ji + fallback
  cache.js              # in-memory cache (TTL ~12 min)
  fetchWithRetry.js     # retry + backoff + rate limiting
  mockData.js           # privzete cene + metapodatki kategorij
  weekend.js            # izračun vikenda
  format.js             # EUR / čas formatiranje
```

---

## 🧭 Opombe

- In-memory cache velja znotraj posamezne instance; za več instanc (npr. serverless) uporabi skupni cache (Redis).
- Cene za hrano so **ocena na osebo** glede na `price_level`; za lete/hotel gre za dejansko ceno povratnega leta oz. 2 noči.
- Izbrane postavke se lahko po osvežitvi živih cen razlikujejo (ID-ji ponudb se spremenijo); to je pričakovano.
