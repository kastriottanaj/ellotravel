import type { LocalizedText } from "./types";

/**
 * Single source of truth for business details. Everything here was taken from
 * the @ellotravel.ks Instagram profile — verify against the agency before launch.
 */

const rawPhones = [
  { display: "048 444 404", e164: "+38348444404" },
  { display: "043 804 805", e164: "+38343804805" },
] as const;

export const site = {
  name: "Ello Travel",
  domain: "ellotravel.net",
  url: "https://www.ellotravel.net",
  email: "ellotravel@hotmail.com",
  phones: rawPhones,
  /** WhatsApp deep links need the number without punctuation or a leading +. */
  whatsapp: rawPhones[0].e164.replace("+", ""),
  instagram: "https://www.instagram.com/ellotravel.ks/",
  instagramHandle: "@ellotravel.ks",
  address: {
    street: "Rr. Skender Rexhepi",
    city: "Klinë",
    region: "Kosovë",
    country: "XK",
  },
  /** Approximate town-centre coordinates for Klinë, used in LocalBusiness JSON-LD. */
  geo: { latitude: 42.6217, longitude: 20.5772 },
  founded: 2018,
} as const;

/**
 * ⚠️ Google Business rating shown on the home page trust bar. These are public
 * claims about the agency — keep them in step with the live Google profile.
 */
export const googleReviews = { rating: 4.9, count: 250 } as const;

/**
 * Hero photograph. Save the file in /public and point at it here; the hero
 * keeps its generated artwork underneath, so a missing file degrades to the
 * illustrated sky rather than to a broken image.
 */
export const heroImage: string | null = "/hero-flight.webp";

/**
 * Whole years of trading, for the hero stat strip. The home page is static, so
 * this is fixed at build time — it moves on with the next deploy of the year.
 */
export function yearsTrading(): number {
  return new Date().getFullYear() - site.founded;
}

/**
 * The departure hub every flight page is built around. Localised because the
 * city reads as "Prishtinë" to an Albanian speaker but "Pristina" in German
 * and English — and these strings appear in page titles and breadcrumbs.
 */
export const hubAirport: { city: LocalizedText; iata: string } = {
  city: { sq: "Prishtinë", de: "Pristina", en: "Pristina" },
  iata: "PRN",
};

export function telHref(index = 0) {
  return `tel:${site.phones[index]?.e164 ?? site.phones[0].e164}`;
}

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
