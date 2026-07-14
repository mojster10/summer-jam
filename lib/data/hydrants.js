// ─────────────────────────────────────────────────────────────
// BAZA HIDRANTOV — Ljubljana
// ─────────────────────────────────────────────────────────────
// To je vgrajena baza (seed) hidrantov. V produkciji jo lahko
// zamenjaš s pravo bazo (Postgres / Supabase) — glej lib/db.js.
//
// Polja:
//   id            – enolični identifikator
//   lat, lng      – GPS lokacija hidranta
//   address       – naslov / opis lokacije
//   district      – mestna četrt
//   type          – "nadzemni" (stebrni) ali "podzemni"
//   diameterMm    – premer priključka
//   flowLpm       – zmogljivost / pretok v litrih na minuto (kako "poln")
//   pressureBar   – statični tlak v omrežju (bar)
//   truckParking  – ali lahko gasilsko vozilo parkira ob hidrantu:
//                   "odlicno" | "dobro" | "omejeno" | "slabo"
//   parkingNote   – kratek opis parkirnih razmer
//   status        – "aktiven" | "okvara" | "vzdrzevanje"
//   lastCheck     – datum zadnjega pregleda (ISO)
// ─────────────────────────────────────────────────────────────

export const HYDRANTS = [
  // ── CENTER ──
  { id: "LJ-0001", lat: 46.05199, lng: 14.50573, address: "Prešernov trg 1", district: "Center", type: "podzemni", diameterMm: 80, flowLpm: 1200, pressureBar: 6.2, truckParking: "omejeno", parkingNote: "Peš cona, dostop le z dovolilnico", status: "aktiven", lastCheck: "2026-05-12" },
  { id: "LJ-0002", lat: 46.05012, lng: 14.50698, address: "Mestni trg 15", district: "Center", type: "podzemni", diameterMm: 80, flowLpm: 1100, pressureBar: 5.9, truckParking: "omejeno", parkingNote: "Ozka ulica, enosmerni promet", status: "aktiven", lastCheck: "2026-04-28" },
  { id: "LJ-0003", lat: 46.04888, lng: 14.50421, address: "Slovenska cesta 34", district: "Center", type: "nadzemni", diameterMm: 100, flowLpm: 1800, pressureBar: 6.8, truckParking: "dobro", parkingNote: "Široko vozišče, rumeni pas ob robu", status: "aktiven", lastCheck: "2026-06-01" },
  { id: "LJ-0004", lat: 46.05601, lng: 14.50588, address: "Trg republike 3", district: "Center", type: "nadzemni", diameterMm: 100, flowLpm: 2000, pressureBar: 7.0, truckParking: "odlicno", parkingNote: "Velik plato pred stavbo", status: "aktiven", lastCheck: "2026-06-18" },
  { id: "LJ-0005", lat: 46.05445, lng: 14.51122, address: "Resljeva cesta 12", district: "Center", type: "podzemni", diameterMm: 80, flowLpm: 950, pressureBar: 5.5, truckParking: "dobro", parkingNote: "Ob pločniku, možno zaustaviti", status: "aktiven", lastCheck: "2026-03-30" },
  { id: "LJ-0006", lat: 46.05310, lng: 14.49876, address: "Cankarjeva cesta 5", district: "Center", type: "nadzemni", diameterMm: 100, flowLpm: 1700, pressureBar: 6.5, truckParking: "dobro", parkingNote: "Parkirni žep na voljo", status: "aktiven", lastCheck: "2026-05-22" },
  { id: "LJ-0007", lat: 46.04710, lng: 14.50310, address: "Zoisova cesta 20", district: "Center", type: "podzemni", diameterMm: 80, flowLpm: 1000, pressureBar: 5.8, truckParking: "omejeno", parkingNote: "Gost promet, obvoz po Zoisovi", status: "vzdrzevanje", lastCheck: "2026-06-25" },

  // ── BEŽIGRAD ──
  { id: "LJ-0101", lat: 46.06412, lng: 14.51033, address: "Dunajska cesta 101", district: "Bežigrad", type: "nadzemni", diameterMm: 100, flowLpm: 1900, pressureBar: 6.9, truckParking: "odlicno", parkingNote: "Servisni pas ob glavni cesti", status: "aktiven", lastCheck: "2026-06-10" },
  { id: "LJ-0102", lat: 46.07011, lng: 14.51201, address: "Dunajska cesta 160", district: "Bežigrad", type: "nadzemni", diameterMm: 100, flowLpm: 2100, pressureBar: 7.1, truckParking: "odlicno", parkingNote: "Široko parkirišče BTC smer", status: "aktiven", lastCheck: "2026-06-14" },
  { id: "LJ-0103", lat: 46.06755, lng: 14.50488, address: "Vojkova cesta 58", district: "Bežigrad", type: "podzemni", diameterMm: 80, flowLpm: 1150, pressureBar: 6.0, truckParking: "dobro", parkingNote: "Ob blokovskem naselju, dovozna pot", status: "aktiven", lastCheck: "2026-05-05" },
  { id: "LJ-0104", lat: 46.06120, lng: 14.51890, address: "Šmartinska cesta 28", district: "Bežigrad", type: "nadzemni", diameterMm: 100, flowLpm: 1750, pressureBar: 6.6, truckParking: "dobro", parkingNote: "Industrijska cona, dovolj prostora", status: "aktiven", lastCheck: "2026-04-19" },
  { id: "LJ-0105", lat: 46.06588, lng: 14.51677, address: "Topniška ulica 12", district: "Bežigrad", type: "podzemni", diameterMm: 80, flowLpm: 900, pressureBar: 5.4, truckParking: "omejeno", parkingNote: "Stanovanjska ulica, parkirani avti", status: "okvara", lastCheck: "2026-06-28" },
  { id: "LJ-0106", lat: 46.07234, lng: 14.50912, address: "Ruska ulica 4", district: "Bežigrad", type: "nadzemni", diameterMm: 100, flowLpm: 1600, pressureBar: 6.4, truckParking: "dobro", parkingNote: "Ob parku, dovoz z Dunajske", status: "aktiven", lastCheck: "2026-05-30" },

  // ── ŠIŠKA ──
  { id: "LJ-0201", lat: 46.06987, lng: 14.48633, address: "Celovška cesta 150", district: "Šiška", type: "nadzemni", diameterMm: 100, flowLpm: 2000, pressureBar: 7.0, truckParking: "odlicno", parkingNote: "Ob Merkatorju, veliko parkirišče", status: "aktiven", lastCheck: "2026-06-20" },
  { id: "LJ-0202", lat: 46.07655, lng: 14.47901, address: "Celovška cesta 264", district: "Šiška", type: "nadzemni", diameterMm: 100, flowLpm: 1850, pressureBar: 6.7, truckParking: "dobro", parkingNote: "Servisni pas, dostop iz obeh smeri", status: "aktiven", lastCheck: "2026-05-18" },
  { id: "LJ-0203", lat: 46.08122, lng: 14.48210, address: "Ulica bratov Učakar 60", district: "Šiška", type: "podzemni", diameterMm: 80, flowLpm: 1100, pressureBar: 6.1, truckParking: "dobro", parkingNote: "Soseska, širok dovoz", status: "aktiven", lastCheck: "2026-04-11" },
  { id: "LJ-0204", lat: 46.07330, lng: 14.49155, address: "Verovškova ulica 55", district: "Šiška", type: "nadzemni", diameterMm: 100, flowLpm: 1950, pressureBar: 6.9, truckParking: "odlicno", parkingNote: "Poslovna cona, prazna parkirišča", status: "aktiven", lastCheck: "2026-06-05" },
  { id: "LJ-0205", lat: 46.08801, lng: 14.48044, address: "Trata 30, Šentvid", district: "Šiška", type: "podzemni", diameterMm: 80, flowLpm: 850, pressureBar: 5.2, truckParking: "omejeno", parkingNote: "Ozka soseska, malo prostora", status: "aktiven", lastCheck: "2026-03-22" },
  { id: "LJ-0206", lat: 46.07012, lng: 14.49577, address: "Litostrojska cesta 44", district: "Šiška", type: "nadzemni", diameterMm: 100, flowLpm: 1800, pressureBar: 6.6, truckParking: "dobro", parkingNote: "Ob poslovni stavbi", status: "vzdrzevanje", lastCheck: "2026-06-27" },

  // ── VIČ ──
  { id: "LJ-0301", lat: 46.03744, lng: 14.48122, address: "Tržaška cesta 118", district: "Vič", type: "nadzemni", diameterMm: 100, flowLpm: 1900, pressureBar: 6.8, truckParking: "odlicno", parkingNote: "Široka Tržaška, servisni pas", status: "aktiven", lastCheck: "2026-06-12" },
  { id: "LJ-0302", lat: 46.04001, lng: 14.47355, address: "Cesta v Mestni log 55", district: "Vič", type: "podzemni", diameterMm: 80, flowLpm: 1050, pressureBar: 5.9, truckParking: "dobro", parkingNote: "Stanovanjska cona, dovoz z glavne", status: "aktiven", lastCheck: "2026-05-08" },
  { id: "LJ-0303", lat: 46.03488, lng: 14.49001, address: "Jamova cesta 39", district: "Vič", type: "nadzemni", diameterMm: 100, flowLpm: 1700, pressureBar: 6.5, truckParking: "dobro", parkingNote: "Ob fakultetah, dovolj prostora", status: "aktiven", lastCheck: "2026-04-25" },
  { id: "LJ-0304", lat: 46.02912, lng: 14.47788, address: "Vrhovci, Cesta XV 8", district: "Vič", type: "podzemni", diameterMm: 80, flowLpm: 800, pressureBar: 5.0, truckParking: "slabo", parkingNote: "Strma dovozna pot, malo prostora", status: "aktiven", lastCheck: "2026-03-15" },
  { id: "LJ-0305", lat: 46.04233, lng: 14.48899, address: "Riharjeva ulica 22", district: "Vič", type: "nadzemni", diameterMm: 100, flowLpm: 1650, pressureBar: 6.3, truckParking: "dobro", parkingNote: "Ob pločniku, možna zaustavitev", status: "aktiven", lastCheck: "2026-05-27" },

  // ── TRNOVO ──
  { id: "LJ-0401", lat: 46.04211, lng: 14.50388, address: "Barjanska cesta 3", district: "Trnovo", type: "nadzemni", diameterMm: 100, flowLpm: 1750, pressureBar: 6.6, truckParking: "dobro", parkingNote: "Ob mostu, širok dovoz", status: "aktiven", lastCheck: "2026-06-03" },
  { id: "LJ-0402", lat: 46.03899, lng: 14.51012, address: "Eipprova ulica 14", district: "Trnovo", type: "podzemni", diameterMm: 80, flowLpm: 950, pressureBar: 5.6, truckParking: "omejeno", parkingNote: "Gostinska ulica, ob vikendih polna", status: "aktiven", lastCheck: "2026-04-30" },
  { id: "LJ-0403", lat: 46.03555, lng: 14.50655, address: "Finžgarjeva ulica 6", district: "Trnovo", type: "podzemni", diameterMm: 80, flowLpm: 1000, pressureBar: 5.8, truckParking: "dobro", parkingNote: "Mirna soseska", status: "aktiven", lastCheck: "2026-05-14" },

  // ── MOSTE ──
  { id: "LJ-0501", lat: 46.05688, lng: 14.53122, address: "Zaloška cesta 40", district: "Moste", type: "nadzemni", diameterMm: 100, flowLpm: 1900, pressureBar: 6.9, truckParking: "odlicno", parkingNote: "Ob UKC, širok dovoz za reševalce", status: "aktiven", lastCheck: "2026-06-22" },
  { id: "LJ-0502", lat: 46.05433, lng: 14.54001, address: "Zaloška cesta 148", district: "Moste", type: "nadzemni", diameterMm: 100, flowLpm: 1800, pressureBar: 6.7, truckParking: "dobro", parkingNote: "Servisni pas ob glavni", status: "aktiven", lastCheck: "2026-05-11" },
  { id: "LJ-0503", lat: 46.05122, lng: 14.53455, address: "Kajuhova ulica 32", district: "Moste", type: "podzemni", diameterMm: 80, flowLpm: 1100, pressureBar: 6.0, truckParking: "dobro", parkingNote: "Industrijska cona", status: "aktiven", lastCheck: "2026-04-08" },
  { id: "LJ-0504", lat: 46.06001, lng: 14.53788, address: "Pokopališka ulica 10", district: "Moste", type: "podzemni", diameterMm: 80, flowLpm: 900, pressureBar: 5.5, truckParking: "omejeno", parkingNote: "Ozka ulica ob pokopališču", status: "okvara", lastCheck: "2026-06-26" },

  // ── FUŽINE ──
  { id: "LJ-0601", lat: 46.05499, lng: 14.55322, address: "Preglov trg 8", district: "Fužine", type: "nadzemni", diameterMm: 100, flowLpm: 2000, pressureBar: 7.0, truckParking: "odlicno", parkingNote: "Veliko odprto parkirišče med bloki", status: "aktiven", lastCheck: "2026-06-16" },
  { id: "LJ-0602", lat: 46.05233, lng: 14.55901, address: "Rusjanov trg 4", district: "Fužine", type: "podzemni", diameterMm: 80, flowLpm: 1200, pressureBar: 6.2, truckParking: "dobro", parkingNote: "Med bloki, dovozna pot", status: "aktiven", lastCheck: "2026-05-24" },
  { id: "LJ-0603", lat: 46.05011, lng: 14.55488, address: "Chengdujska cesta 20", district: "Fužine", type: "nadzemni", diameterMm: 100, flowLpm: 1850, pressureBar: 6.8, truckParking: "dobro", parkingNote: "Širok dovoz iz obvoznice", status: "aktiven", lastCheck: "2026-04-16" },

  // ── ŠENTVID / DRAVLJE / KOSEZE ──
  { id: "LJ-0701", lat: 46.08344, lng: 14.46211, address: "Prušnikova ulica 74, Šentvid", district: "Šentvid", type: "nadzemni", diameterMm: 100, flowLpm: 1700, pressureBar: 6.5, truckParking: "dobro", parkingNote: "Ob glavni cesti proti Kranju", status: "aktiven", lastCheck: "2026-05-19" },
  { id: "LJ-0702", lat: 46.07588, lng: 14.47122, address: "Draveljska ulica 15, Dravlje", district: "Dravlje", type: "podzemni", diameterMm: 80, flowLpm: 1000, pressureBar: 5.8, truckParking: "dobro", parkingNote: "Soseska, dovoz z Vodnikove", status: "aktiven", lastCheck: "2026-04-03" },
  { id: "LJ-0703", lat: 46.07011, lng: 14.47655, address: "Ulica Milana Majcna 3, Koseze", district: "Koseze", type: "nadzemni", diameterMm: 100, flowLpm: 1800, pressureBar: 6.6, truckParking: "odlicno", parkingNote: "Ob Koseškem bajerju, veliko prostora", status: "aktiven", lastCheck: "2026-06-08" },

  // ── RUDNIK / RAKOVA JELŠA ──
  { id: "LJ-0801", lat: 46.02388, lng: 14.51877, address: "Dolenjska cesta 242, Rudnik", district: "Rudnik", type: "nadzemni", diameterMm: 100, flowLpm: 1900, pressureBar: 6.9, truckParking: "odlicno", parkingNote: "Ob nakupovalnem centru", status: "aktiven", lastCheck: "2026-06-11" },
  { id: "LJ-0802", lat: 46.01899, lng: 14.50988, address: "Ižanska cesta 100, Rakova Jelša", district: "Rudnik", type: "podzemni", diameterMm: 80, flowLpm: 750, pressureBar: 4.8, truckParking: "slabo", parkingNote: "Makadamska pot, ozek dostop", status: "aktiven", lastCheck: "2026-03-10" },
  { id: "LJ-0803", lat: 46.03011, lng: 14.52344, address: "Peruzzijeva ulica 66, Rudnik", district: "Rudnik", type: "podzemni", diameterMm: 80, flowLpm: 950, pressureBar: 5.6, truckParking: "dobro", parkingNote: "Soseska vrstnih hiš", status: "aktiven", lastCheck: "2026-05-02" },

  // ── POLJANE / TABOR ──
  { id: "LJ-0901", lat: 46.05011, lng: 14.51655, address: "Poljanska cesta 28", district: "Center", type: "nadzemni", diameterMm: 100, flowLpm: 1650, pressureBar: 6.4, truckParking: "dobro", parkingNote: "Ob pločniku, možna zaustavitev", status: "aktiven", lastCheck: "2026-05-16" },
  { id: "LJ-0902", lat: 46.05344, lng: 14.51988, address: "Kapiteljska ulica 5, Tabor", district: "Center", type: "podzemni", diameterMm: 80, flowLpm: 1050, pressureBar: 5.9, truckParking: "omejeno", parkingNote: "Ob stadionu, ob dogodkih zasedeno", status: "aktiven", lastCheck: "2026-04-22" },

  // ── ROŽNA DOLINA / BRDO ──
  { id: "LJ-1001", lat: 46.04455, lng: 14.47011, address: "Cesta na Vrhovce 12, Rožna dolina", district: "Vič", type: "nadzemni", diameterMm: 100, flowLpm: 1700, pressureBar: 6.5, truckParking: "dobro", parkingNote: "Vilska soseska, širše ulice", status: "aktiven", lastCheck: "2026-05-29" },
  { id: "LJ-1002", lat: 46.03788, lng: 14.46388, address: "Brdnikova ulica 44, Brdo", district: "Vič", type: "podzemni", diameterMm: 80, flowLpm: 900, pressureBar: 5.5, truckParking: "omejeno", parkingNote: "Novo naselje, ozke dovozne poti", status: "aktiven", lastCheck: "2026-04-14" },
];

export default HYDRANTS;
