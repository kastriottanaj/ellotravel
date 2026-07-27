import type { LocalizedText, SceneTheme } from "./types";

/**
 * ⚠️ Seasonal packages — copy is a starting point, prices are deliberately
 * unset. Add `priceFrom` (EUR) once the agency confirms, and the cards will
 * show "from €X" instead of "ask for a price" automatically.
 */

export type Offer = {
  slug: string;
  scene: SceneTheme;
  /** Photo path under /public. Falls back to the generated scene artwork. */
  image?: string;
  title: LocalizedText;
  summary: LocalizedText;
  /** Nights included, when the package is a fixed-length stay. */
  nights?: number;
  priceFrom: number | null;
  includes: LocalizedText[];
  /** Surfaced in the "most requested" strip on the home page. */
  featured?: boolean;
};

export const offers: Offer[] = [
  {
    slug: "shengjin-veror",
    scene: "coast",
    nights: 7,
    priceFrom: null,
    title: {
      sq: "Java e verës në Shëngjin",
      de: "Sommerwoche in Shëngjin",
      en: "Summer week in Shëngjin",
    },
    summary: {
      sq: "Shtatë netë në një nga hotelet tona partnere në Shëngjin, me transport të organizuar nga Kosova.",
      de: "Sieben Nächte in einem unserer Partnerhotels in Shëngjin, mit organisiertem Transfer ab Kosovo.",
      en: "Seven nights in one of our partner hotels in Shëngjin, with transport arranged from Kosovo.",
    },
    includes: [
      { sq: "Akomodim 7 netë", de: "7 Nächte Unterkunft", en: "7 nights' accommodation" },
      { sq: "Mëngjes i përfshirë", de: "Frühstück inklusive", en: "Breakfast included" },
      { sq: "Transport nga Kosova", de: "Transfer ab Kosovo", en: "Transport from Kosovo" },
      { sq: "Asistencë gjatë qëndrimit", de: "Betreuung vor Ort", en: "Support during your stay" },
    ],
  },
  {
    slug: "durres-familjar",
    scene: "riviera",
    nights: 5,
    priceFrom: null,
    title: {
      sq: "Paketë familjare në Durrës",
      de: "Familienpaket in Durrës",
      en: "Family package in Durrës",
    },
    summary: {
      sq: "Pesë netë për dy të rritur dhe dy fëmijë, në hotele me pishinë dhe dhoma familjare.",
      de: "Fünf Nächte für zwei Erwachsene und zwei Kinder, in Hotels mit Pool und Familienzimmern.",
      en: "Five nights for two adults and two children, in hotels with a pool and family rooms.",
    },
    includes: [
      { sq: "Dhomë familjare", de: "Familienzimmer", en: "Family room" },
      { sq: "Qasje në pishinë", de: "Poolzugang", en: "Pool access" },
      { sq: "Fëmijët nën 6 vjeç falas", de: "Kinder unter 6 Jahren gratis", en: "Children under 6 free" },
      { sq: "Parking falas", de: "Kostenloser Parkplatz", en: "Free parking" },
    ],
  },
  {
    slug: "antalya-all-inclusive",
    scene: "sunset",
    nights: 7,
    priceFrom: null,
    featured: true,
    title: {
      sq: "Antalya — all inclusive",
      de: "Antalya — All inclusive",
      en: "Antalya — all inclusive",
    },
    summary: {
      sq: "Fluturim direkt nga Prishtina dhe shtatë netë all inclusive në bregdetin turk.",
      de: "Direktflug ab Pristina und sieben Nächte All inclusive an der türkischen Riviera.",
      en: "Direct flight from Pristina and seven nights all inclusive on the Turkish coast.",
    },
    includes: [
      { sq: "Fluturim vajtje-ardhje", de: "Hin- und Rückflug", en: "Return flight" },
      { sq: "Transfer nga aeroporti", de: "Flughafentransfer", en: "Airport transfer" },
      { sq: "All inclusive", de: "All inclusive", en: "All inclusive" },
      { sq: "Sigurim udhëtimi", de: "Reiseversicherung", en: "Travel insurance" },
    ],
  },
  /**
   * ⚠️ The three packages below come from the home page mockup, so only the
   * destination and the number of nights are confirmed. Check the wording and
   * what each package actually includes with the agency before launch.
   */
  {
    slug: "sharm-el-sheikh",
    scene: "riviera",
    nights: 7,
    priceFrom: null,
    featured: true,
    title: {
      sq: "Sharm El Sheikh",
      de: "Sharm El Sheikh",
      en: "Sharm El Sheikh",
    },
    summary: {
      sq: "Shtatë netë në Detin e Kuq, me fluturim dhe hotel të organizuar nga ne.",
      de: "Sieben Nächte am Roten Meer, mit von uns organisiertem Flug und Hotel.",
      en: "Seven nights on the Red Sea, with the flight and hotel arranged by us.",
    },
    includes: [
      { sq: "Fluturim vajtje-ardhje", de: "Hin- und Rückflug", en: "Return flight" },
      { sq: "Akomodim 7 netë", de: "7 Nächte Unterkunft", en: "7 nights' accommodation" },
      { sq: "Transfer nga aeroporti", de: "Flughafentransfer", en: "Airport transfer" },
    ],
  },
  {
    slug: "dubrovnik",
    scene: "coast",
    nights: 7,
    priceFrom: null,
    featured: true,
    title: { sq: "Dubrovnik", de: "Dubrovnik", en: "Dubrovnik" },
    summary: {
      sq: "Një javë në bregdetin kroat, me hotel afër qytetit të vjetër.",
      de: "Eine Woche an der kroatischen Küste, mit Hotel nahe der Altstadt.",
      en: "A week on the Croatian coast, with a hotel close to the old town.",
    },
    includes: [
      { sq: "Akomodim 7 netë", de: "7 Nächte Unterkunft", en: "7 nights' accommodation" },
      { sq: "Mëngjes i përfshirë", de: "Frühstück inklusive", en: "Breakfast included" },
      { sq: "Transport nga Kosova", de: "Transfer ab Kosovo", en: "Transport from Kosovo" },
    ],
  },
  {
    slug: "barcelona",
    scene: "city",
    nights: 4,
    priceFrom: null,
    featured: true,
    title: { sq: "Barcelona", de: "Barcelona", en: "Barcelona" },
    summary: {
      sq: "Katër netë në Barcelonë — fluturim, hotel në qendër dhe kohë e lirë për të eksploruar.",
      de: "Vier Nächte in Barcelona — Flug, zentrales Hotel und Zeit zum Erkunden.",
      en: "Four nights in Barcelona — flight, a central hotel and time to explore.",
    },
    includes: [
      { sq: "Fluturim vajtje-ardhje", de: "Hin- und Rückflug", en: "Return flight" },
      { sq: "Akomodim 4 netë", de: "4 Nächte Unterkunft", en: "4 nights' accommodation" },
      { sq: "Hotel në qendër", de: "Hotel im Zentrum", en: "Hotel in the centre" },
    ],
  },
];

export function getOffer(slug: string) {
  return offers.find((offer) => offer.slug === slug);
}

/** The packages the home page leads with, in the order they are listed above. */
export function featuredOffers(limit = 4) {
  const picked = offers.filter((offer) => offer.featured);
  return (picked.length ? picked : offers).slice(0, limit);
}
