// Privzete / rezervne (fallback) cene za vsako kategorijo.
// Uporabijo se, kadar API ključ ni nastavljen ali zunanji vir ne odgovori.
// Vsaka možnost: { id, name, price, sourceUrl }.
//
// Leti: najcenejši povratni let iz Ljubljane (LJU) za vikend (2 dni).
// Hotel: cena za 2 noči, 1 soba, Ljubljana.
// Hrana: ocena porabe na osebo za vikend glede na cenovni razred.
// Zabava: cena vstopnice / aktivnosti v Ljubljani.

export const MOCK = {
  flights: [
    { id: "fl-vie", name: "Ljubljana → Dunaj (Wizz/AUA)", price: 89, sourceUrl: "https://www.skyscanner.net/transport/flights/lju/vie/" },
    { id: "fl-txl", name: "Ljubljana → Berlin (easyJet)", price: 124, sourceUrl: "https://www.skyscanner.net/transport/flights/lju/berl/" },
    { id: "fl-bcn", name: "Ljubljana → Barcelona (Vueling)", price: 158, sourceUrl: "https://www.skyscanner.net/transport/flights/lju/bcna/" },
    { id: "fl-lhr", name: "Ljubljana → London (British Airways)", price: 176, sourceUrl: "https://www.skyscanner.net/transport/flights/lju/lond/" },
    { id: "fl-lis", name: "Ljubljana → Lizbona (TAP prek FRA)", price: 214, sourceUrl: "https://www.skyscanner.net/transport/flights/lju/lisb/" },
  ],
  hotel: [
    { id: "ht-city", name: "City Hotel Ljubljana (2 noči)", price: 178, sourceUrl: "https://www.booking.com/searchresults.html?ss=Ljubljana" },
    { id: "ht-slon", name: "Grand Hotel Union Eurostars (2 noči)", price: 246, sourceUrl: "https://www.booking.com/searchresults.html?ss=Ljubljana" },
    { id: "ht-cubo", name: "Hotel Cubo (2 noči)", price: 268, sourceUrl: "https://www.booking.com/searchresults.html?ss=Ljubljana" },
    { id: "ht-lev", name: "InterContinental Ljubljana (2 noči)", price: 342, sourceUrl: "https://www.booking.com/searchresults.html?ss=Ljubljana" },
    { id: "ht-hostel", name: "Hostel Celica (2 noči)", price: 96, sourceUrl: "https://www.booking.com/searchresults.html?ss=Ljubljana" },
  ],
  food: [
    { id: "fo-klobasa", name: "Klobasarna (tradicionalno, €)", price: 30, sourceUrl: "https://www.google.com/maps/search/restaurant+Ljubljana" },
    { id: "fo-druga", name: "Druga violina (domača kuhinja, €€)", price: 45, sourceUrl: "https://www.google.com/maps/search/restaurant+Ljubljana" },
    { id: "fo-gostilna", name: "Gostilna na Gradu (€€)", price: 60, sourceUrl: "https://www.google.com/maps/search/restaurant+Ljubljana" },
    { id: "fo-strelec", name: "Strelec (fine dining, €€€)", price: 95, sourceUrl: "https://www.google.com/maps/search/restaurant+Ljubljana" },
    { id: "fo-atelje", name: "Restavracija Atelje (€€€)", price: 110, sourceUrl: "https://www.google.com/maps/search/restaurant+Ljubljana" },
  ],
  entertainment: [
    { id: "en-grad", name: "Ljubljanski grad + vzpenjača", price: 16, sourceUrl: "https://www.ljubljanskigrad.si/" },
    { id: "en-kayak", name: "Kajak po Ljubljanici", price: 35, sourceUrl: "https://www.getyourguide.com/ljubljana-l1000772/" },
    { id: "en-cankarjev", name: "Koncert v Cankarjevem domu", price: 42, sourceUrl: "https://www.ticketmaster.com/discover/concerts/ljubljana" },
    { id: "en-tour", name: "Vodeni ogled + degustacija vin", price: 58, sourceUrl: "https://www.getyourguide.com/ljubljana-l1000772/" },
    { id: "en-opera", name: "Predstava v SNG Opera in balet", price: 68, sourceUrl: "https://www.ticketmaster.com/discover/concerts/ljubljana" },
  ],
};

// Metapodatki kategorij (vrstni red, emoji, naslovi).
export const CATEGORIES = [
  { key: "flights", emoji: "✈️", title: "Leti" },
  { key: "hotel", emoji: "🏨", title: "Hotel" },
  { key: "food", emoji: "🍽️", title: "Hrana" },
  { key: "entertainment", emoji: "🎉", title: "Zabava" },
];
