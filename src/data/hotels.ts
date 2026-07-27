import type { LocalizedText, SceneTheme } from "./types";

/**
 * ⚠️ CONTENT TO VERIFY BEFORE LAUNCH
 *
 * Hotel names, star ratings and cities are taken from the @ellotravel.ks
 * Instagram posts. The descriptions and amenity lists are placeholder copy
 * written from the destination, not from the agency's own material — confirm
 * each one (and add real `priceFrom` values) before this goes live.
 *
 * `priceFrom: null` is intentional and safe: the UI falls back to
 * "ask for a price" rather than showing a number nobody has confirmed.
 */

export const amenityCatalog = {
  pool: { sq: "Pishinë", de: "Pool", en: "Swimming pool" },
  beach: { sq: "Dalje në plazh", de: "Strandzugang", en: "Beach access" },
  restaurant: { sq: "Restorant", de: "Restaurant", en: "Restaurant" },
  spa: { sq: "Spa & wellness", de: "Spa & Wellness", en: "Spa & wellness" },
  wifi: { sq: "Wi-Fi falas", de: "Kostenloses WLAN", en: "Free Wi-Fi" },
  parking: { sq: "Parking", de: "Parkplatz", en: "Parking" },
  ac: { sq: "Kondicioner", de: "Klimaanlage", en: "Air conditioning" },
  breakfast: { sq: "Mëngjes i përfshirë", de: "Frühstück inklusive", en: "Breakfast included" },
  familyRooms: { sq: "Dhoma familjare", de: "Familienzimmer", en: "Family rooms" },
  seaView: { sq: "Pamje nga deti", de: "Meerblick", en: "Sea view" },
  bar: { sq: "Bar", de: "Bar", en: "Bar" },
  gym: { sq: "Palestër", de: "Fitnessraum", en: "Gym" },
} satisfies Record<string, LocalizedText>;

export type AmenityKey = keyof typeof amenityCatalog;

/**
 * Every hotel we book sits on the Albanian coast, so the country name is one
 * shared value — but it still has to be localised, or German and English
 * visitors read the Albanian spelling on the hotel pages.
 */
const albania: LocalizedText = { sq: "Shqipëri", de: "Albanien", en: "Albania" };

export const cities = {
  durres: {
    slug: "durres",
    name: { sq: "Durrës", de: "Durrës", en: "Durrës" } satisfies LocalizedText,
    country: albania,
    blurb: {
      sq: "Bregdeti më i afërt me Kosovën — plazhe të gjata me rërë dhe jetë e gjallë deri vonë.",
      de: "Die Adriaküste, die dem Kosovo am nächsten liegt — lange Sandstrände und lebhaftes Nachtleben.",
      en: "The stretch of coast closest to Kosovo — long sandy beaches and a lively evening scene.",
    } satisfies LocalizedText,
  },
  shengjin: {
    slug: "shengjin",
    name: { sq: "Shëngjin", de: "Shëngjin", en: "Shëngjin" } satisfies LocalizedText,
    country: albania,
    blurb: {
      sq: "Gjiri i qetë në veri të Shqipërisë, i preferuar nga familjet për ujin e cekët dhe promenadën.",
      de: "Die ruhige Bucht im Norden Albaniens, bei Familien beliebt für flaches Wasser und die Promenade.",
      en: "The calm bay in northern Albania, popular with families for its shallow water and promenade.",
    } satisfies LocalizedText,
  },
} as const;

export type CitySlug = keyof typeof cities;

export type Hotel = {
  slug: string;
  name: string;
  stars: 3 | 4 | 5;
  city: CitySlug;
  scene: SceneTheme;
  /** Real photo in /public/images once available; falls back to a gradient scene. */
  image?: string;
  priceFrom: number | null;
  summary: LocalizedText;
  description: LocalizedText;
  amenities: AmenityKey[];
  featured?: boolean;
};

export const hotels: Hotel[] = [
  {
    slug: "royal-g",
    name: "Royal G",
    stars: 5,
    city: "durres",
    scene: "riviera",
    priceFrom: null,
    featured: true,
    summary: {
      sq: "Hotel pesë yjesh në Durrës me pishinë dhe restorant, i përshtatshëm për çifte dhe familje.",
      de: "Fünf-Sterne-Hotel in Durrës mit Pool und Restaurant, ideal für Paare und Familien.",
      en: "Five-star hotel in Durrës with a pool and restaurant, suited to couples and families.",
    },
    description: {
      sq: "Royal G është një nga hotelet më të kërkuara në Durrës për sezonin veror. Ndodhet afër plazhit dhe ofron pishinë, restorant dhe dhoma me kondicioner. Rezervimin e bëni përmes nesh me çmim të konfirmuar para nisjes.",
      de: "Das Royal G gehört zu den gefragtesten Hotels in Durrës während der Sommersaison. Es liegt in Strandnähe und bietet Pool, Restaurant und klimatisierte Zimmer. Die Buchung läuft über uns, mit vor der Abreise bestätigtem Preis.",
      en: "Royal G is one of the most requested hotels in Durrës over the summer season. It sits close to the beach and offers a pool, a restaurant and air-conditioned rooms. You book through us with the price confirmed before departure.",
    },
    amenities: ["pool", "restaurant", "wifi", "ac", "parking", "bar", "familyRooms"],
  },
  {
    slug: "klajdi-resort-spa",
    name: "Klajdi Resort & Spa",
    stars: 5,
    city: "durres",
    scene: "sunset",
    priceFrom: null,
    featured: true,
    summary: {
      sq: "Resort me spa buzë detit në Durrës — zgjedhja jonë për pushime më të qeta.",
      de: "Resort mit Spa direkt am Meer in Durrës — unsere Wahl für einen ruhigeren Urlaub.",
      en: "Seafront resort with a spa in Durrës — our pick for a quieter holiday.",
    },
    description: {
      sq: "Klajdi Resort & Spa kombinon plazhin me shërbimet e një resorti të plotë: spa, pishinë dhe restorant me pamje nga deti. Ideal për çifte dhe për ata që duan pak më shumë rehati.",
      de: "Klajdi Resort & Spa verbindet den Strand mit den Leistungen eines vollwertigen Resorts: Spa, Pool und Restaurant mit Meerblick. Ideal für Paare und alle, die etwas mehr Komfort suchen.",
      en: "Klajdi Resort & Spa pairs the beach with full resort facilities: a spa, a pool and a restaurant with sea views. Ideal for couples and anyone wanting a little more comfort.",
    },
    amenities: ["spa", "pool", "beach", "restaurant", "seaView", "wifi", "ac", "parking"],
  },
  {
    slug: "fafa-premium",
    name: "Fafa Premium",
    stars: 4,
    city: "durres",
    scene: "coast",
    priceFrom: null,
    featured: true,
    summary: {
      sq: "Kompleks katër yjesh me pishinë dhe palma, popullor te familjet me fëmijë.",
      de: "Vier-Sterne-Anlage mit Pool und Palmen, beliebt bei Familien mit Kindern.",
      en: "Four-star complex with a pool and palm gardens, popular with families with children.",
    },
    description: {
      sq: "Fafa Premium ofron akomodim komod me qasje të lehtë në plazh dhe pishinë të madhe në oborr. Një nga opsionet me raportin më të mirë çmim-cilësi që rezervojmë çdo verë.",
      de: "Fafa Premium bietet komfortable Unterkünfte mit einfachem Strandzugang und einem großen Pool im Garten. Eine der Optionen mit dem besten Preis-Leistungs-Verhältnis, die wir jeden Sommer buchen.",
      en: "Fafa Premium offers comfortable rooms with easy beach access and a large pool in the grounds. One of the best value options we book every summer.",
    },
    amenities: ["pool", "beach", "restaurant", "wifi", "ac", "parking", "familyRooms"],
  },
  {
    slug: "rafaelo-executive",
    name: "Rafaelo Executive",
    stars: 5,
    city: "shengjin",
    scene: "riviera",
    priceFrom: null,
    featured: true,
    summary: {
      sq: "Pesë yje në Shëngjin me pishinë të mbyllur — funksionon edhe jashtë sezonit.",
      de: "Fünf Sterne in Shëngjin mit Hallenbad — auch außerhalb der Saison eine gute Wahl.",
      en: "Five stars in Shëngjin with an indoor pool — works outside the summer season too.",
    },
    description: {
      sq: "Rafaelo Executive është pjesë e kompleksit më modern të Shëngjinit. Pishina e mbyllur dhe shërbimet e brendshme e bëjnë të përshtatshëm edhe për pushime pranverore apo vjeshtore.",
      de: "Rafaelo Executive gehört zur modernsten Anlage in Shëngjin. Hallenbad und Innenbereiche machen es auch für Frühjahrs- und Herbsturlaub geeignet.",
      en: "Rafaelo Executive is part of the most modern complex in Shëngjin. The indoor pool and interior facilities make it a good choice for spring and autumn breaks as well.",
    },
    amenities: ["pool", "spa", "restaurant", "wifi", "ac", "parking", "gym", "bar"],
  },
  {
    slug: "twin-towers",
    name: "Twin Towers",
    stars: 5,
    city: "shengjin",
    scene: "metropolis",
    priceFrom: null,
    summary: {
      sq: "Hotel pesë yjesh në qendër të Shëngjinit, afër promenadës.",
      de: "Fünf-Sterne-Hotel im Zentrum von Shëngjin, nahe der Promenade.",
      en: "Five-star hotel in the centre of Shëngjin, close to the promenade.",
    },
    description: {
      sq: "Twin Towers ndodhet në qendër të Shëngjinit, në distancë ecjeje nga plazhi dhe restorantet. Zgjedhje e mirë nëse doni të jeni në mes të gjithçkaje.",
      de: "Twin Towers liegt im Zentrum von Shëngjin, zu Fuß erreichbar von Strand und Restaurants. Eine gute Wahl, wenn Sie mittendrin sein möchten.",
      en: "Twin Towers sits in the centre of Shëngjin, walking distance from the beach and the restaurants. A good choice if you want to be in the middle of everything.",
    },
    amenities: ["restaurant", "wifi", "ac", "parking", "bar", "familyRooms"],
  },
  {
    slug: "tanushaj",
    name: "Tanushaj",
    stars: 5,
    city: "shengjin",
    scene: "coast",
    priceFrom: null,
    summary: {
      sq: "Hotel familjar me pishinë dhe bufe të pasur mëngjesi.",
      de: "Familiengeführtes Hotel mit Pool und reichhaltigem Frühstücksbuffet.",
      en: "Family-run hotel with a pool and a generous breakfast buffet.",
    },
    description: {
      sq: "Tanushaj është hotel i menaxhuar nga familja, i njohur për mikpritjen dhe ushqimin. Pishina dhe dhomat familjare e bëjnë të përshtatshëm për grupe më të mëdha.",
      de: "Tanushaj ist ein familiengeführtes Hotel, bekannt für Gastfreundschaft und Küche. Pool und Familienzimmer machen es auch für größere Gruppen geeignet.",
      en: "Tanushaj is a family-run hotel known for its hospitality and its food. The pool and family rooms make it a good fit for larger groups.",
    },
    amenities: ["pool", "restaurant", "breakfast", "wifi", "ac", "parking", "familyRooms"],
  },
  {
    slug: "miramar-hotel",
    name: "Miramar Hotel",
    stars: 3,
    city: "shengjin",
    scene: "sunset",
    priceFrom: null,
    summary: {
      sq: "Opsion i përballueshëm në Shëngjin, i njohur për kuzhinën me peshk të freskët.",
      de: "Günstige Option in Shëngjin, bekannt für die Küche mit frischem Fisch.",
      en: "Affordable option in Shëngjin, known for its fresh fish kitchen.",
    },
    description: {
      sq: "Miramar është zgjedhja për ata që duan pushim të thjeshtë dhe të përballueshëm pranë detit. Restoranti i hotelit njihet për peshkun e freskët.",
      de: "Miramar ist die Wahl für alle, die einen einfachen, bezahlbaren Urlaub am Meer suchen. Das Hotelrestaurant ist für seinen frischen Fisch bekannt.",
      en: "Miramar is the choice for a simple, affordable stay by the sea. The hotel restaurant is known for its fresh fish.",
    },
    amenities: ["restaurant", "beach", "wifi", "ac", "parking"],
  },
];

export function getHotel(slug: string) {
  return hotels.find((hotel) => hotel.slug === slug);
}

export function featuredHotels(limit = 4) {
  const picked = hotels.filter((hotel) => hotel.featured);
  return (picked.length ? picked : hotels).slice(0, limit);
}

export function hotelsByCity(city: CitySlug) {
  return hotels.filter((hotel) => hotel.city === city);
}
