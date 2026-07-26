import type { LocalizedText, SceneTheme } from "./types";

/**
 * Flight destinations served from Prishtina, taken from the @ellotravel.ks
 * route poster. Airport codes are included so the route pages can carry
 * accurate structured data — verify any that the agency serves seasonally.
 *
 * Note: Münster and Osnabrück share one airport (FMO). They are listed
 * separately because travellers search for both names.
 */

export const countries = {
  de: { sq: "Gjermani", de: "Deutschland", en: "Germany" },
  ch: { sq: "Zvicër", de: "Schweiz", en: "Switzerland" },
  fr: { sq: "Francë", de: "Frankreich", en: "France" },
  si: { sq: "Slloveni", de: "Slowenien", en: "Slovenia" },
  lu: { sq: "Luksemburg", de: "Luxemburg", en: "Luxembourg" },
  se: { sq: "Suedi", de: "Schweden", en: "Sweden" },
  tr: { sq: "Turqi", de: "Türkei", en: "Türkiye" },
} satisfies Record<string, LocalizedText>;

export type CountryCode = keyof typeof countries;

export type Destination = {
  slug: string;
  /** City name per locale — several differ in English (Munich, Cologne …). */
  city: LocalizedText;
  country: CountryCode;
  iata: string;
  scene: SceneTheme;
  popular?: boolean;
};

/** Shorthand for the common case where the city name is identical everywhere. */
const same = (name: string): LocalizedText => ({ sq: name, de: name, en: name });

export const destinations: Destination[] = [
  {
    slug: "prishtina-stuttgart",
    city: same("Stuttgart"),
    country: "de",
    iata: "STR",
    scene: "city",
    popular: true,
  },
  {
    slug: "prishtina-munchen",
    city: { sq: "München", de: "München", en: "Munich" },
    country: "de",
    iata: "MUC",
    scene: "alpine",
    popular: true,
  },
  {
    slug: "prishtina-zurich",
    city: same("Zürich"),
    country: "ch",
    iata: "ZRH",
    scene: "alpine",
    popular: true,
  },
  {
    slug: "prishtina-basel",
    city: same("Basel"),
    country: "ch",
    iata: "BSL",
    scene: "alpine",
    popular: true,
  },
  {
    slug: "prishtina-dusseldorf",
    city: same("Düsseldorf"),
    country: "de",
    iata: "DUS",
    scene: "metropolis",
    popular: true,
  },
  {
    slug: "prishtina-hamburg",
    city: same("Hamburg"),
    country: "de",
    iata: "HAM",
    scene: "nordic",
    popular: true,
  },
  {
    slug: "prishtina-berlin",
    city: same("Berlin"),
    country: "de",
    iata: "BER",
    scene: "metropolis",
    popular: true,
  },
  {
    slug: "prishtina-antalya",
    city: same("Antalya"),
    country: "tr",
    iata: "AYT",
    scene: "riviera",
    popular: true,
  },
  {
    slug: "prishtina-geneve",
    city: { sq: "Gjenevë", de: "Genf", en: "Geneva" },
    country: "ch",
    iata: "GVA",
    scene: "alpine",
  },
  {
    slug: "prishtina-paris",
    city: same("Paris"),
    country: "fr",
    iata: "CDG",
    scene: "metropolis",
  },
  {
    slug: "prishtina-ljubljana",
    city: same("Ljubljana"),
    country: "si",
    iata: "LJU",
    scene: "alpine",
  },
  {
    slug: "prishtina-luxemburg",
    city: { sq: "Luksemburg", de: "Luxemburg", en: "Luxembourg" },
    country: "lu",
    iata: "LUX",
    scene: "city",
  },
  {
    slug: "prishtina-goteborg",
    city: { sq: "Göteborg", de: "Göteborg", en: "Gothenburg" },
    country: "se",
    iata: "GOT",
    scene: "nordic",
  },
  {
    slug: "prishtina-malmo",
    city: same("Malmö"),
    country: "se",
    iata: "MMX",
    scene: "nordic",
  },
  {
    slug: "prishtina-stockholm",
    city: same("Stockholm"),
    country: "se",
    iata: "ARN",
    scene: "nordic",
  },
  {
    slug: "prishtina-hannover",
    city: same("Hannover"),
    country: "de",
    iata: "HAJ",
    scene: "city",
  },
  {
    slug: "prishtina-munster",
    city: same("Münster"),
    country: "de",
    iata: "FMO",
    scene: "city",
  },
  {
    slug: "prishtina-osnabruck",
    city: same("Osnabrück"),
    country: "de",
    iata: "FMO",
    scene: "city",
  },
  {
    slug: "prishtina-nurnberg",
    city: { sq: "Nürnberg", de: "Nürnberg", en: "Nuremberg" },
    country: "de",
    iata: "NUE",
    scene: "city",
  },
  {
    slug: "prishtina-memmingen",
    city: same("Memmingen"),
    country: "de",
    iata: "FMM",
    scene: "alpine",
  },
  {
    slug: "prishtina-koln",
    city: { sq: "Köln", de: "Köln", en: "Cologne" },
    country: "de",
    iata: "CGN",
    scene: "sunset",
  },
  {
    slug: "prishtina-dortmund",
    city: same("Dortmund"),
    country: "de",
    iata: "DTM",
    scene: "city",
  },
  {
    slug: "prishtina-bremen",
    city: same("Bremen"),
    country: "de",
    iata: "BRE",
    scene: "nordic",
  },
];

export function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export function popularDestinations(limit = 8) {
  return destinations.filter((destination) => destination.popular).slice(0, limit);
}
