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
