import { locales, type Locale } from "./config";

/**
 * Country → language. The Albanian-speaking region reads Albanian, the
 * German-speaking diaspora reads German, and every other country falls through
 * to English — so this map only ever lists the exceptions.
 *
 * North Macedonia and Montenegro are here for their Albanian minorities, which
 * is a bet on who actually visits: this rule is only consulted for a visitor
 * whose own language we do not publish, and someone booking a flight out of
 * Prishtina from Tetovo or Ulcinj is far more likely to read Albanian than the
 * population share suggests. Cheap to be wrong about — the language switcher
 * is one tap away, and the cookie remembers it.
 */
const countryLocales: Record<string, Locale> = {
  AL: "sq",
  XK: "sq", // Kosovo — the user-assigned code, which is what GeoLite2 reports
  MK: "sq",
  ME: "sq",
  AT: "de",
  CH: "de",
  DE: "de",
};

/**
 * Request headers that may carry an ISO 3166-1 country, in the order we trust
 * them. `X-Country-Code` is the one nginx sets in front of production (see the
 * README); the other two are here so this keeps working unchanged behind
 * Cloudflare or on Vercel, where the name is not ours to choose.
 *
 * Only ever read these when the edge in front of the app *sets* them. They are
 * ordinary request headers, so a visitor can send any value they like — which
 * is harmless for picking a language, and would not be for anything else.
 */
export const countryHeaders = [
  "X-Country-Code",
  "CF-IPCountry",
  "X-Vercel-IP-Country",
] as const;

function normaliseCountry(value: string | null): string | null {
  if (!value) return null;

  const code = value.trim().toUpperCase();
  // nginx leaves the variable empty for addresses the database cannot place —
  // LANs, some VPN exits, a few mobile carriers. MaxMind answers "XX" for the
  // same case, and Cloudflare sends "T1" for Tor. None of those is a place.
  if (!/^[A-Z]{2}$/.test(code) || code === "XX" || code === "T1") return null;
  return code;
}

/** First usable country among the headers above, or null if none says one. */
export function countryFromHeaders(headers: Headers): string | null {
  for (const name of countryHeaders) {
    const country = normaliseCountry(headers.get(name));
    if (country) return country;
  }
  return null;
}

/**
 * The language for a visitor known to be in `country`. A country we recognise
 * always resolves — anywhere outside the five listed above reads English.
 */
export function localeFromCountry(country: string | null): Locale | null {
  if (!country) return null;
  return countryLocales[country] ?? "en";
}

export type LanguageRange = {
  language: string;
  region: string | null;
  quality: number;
};

/** Accept-Language, split into tags and sorted by the visitor's preference. */
export function parseAcceptLanguage(header: string | null): LanguageRange[] {
  if (!header) return [];

  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const [language, ...subtags] = tag.trim().toLowerCase().split("-");
      return {
        language,
        // The region is the two-letter subtag, which is not always the second
        // one: "zh-Hans-CN" puts a script in the way, and "es-419" carries a
        // numeric UN region that is not a country at all.
        region:
          subtags.find((s) => /^[a-z]{2}$/.test(s))?.toUpperCase() ?? null,
        quality: q ? Number.parseFloat(q.split("=")[1]) || 0 : 1,
      };
    })
    // Drops the "*" wildcard and anything explicitly refused with q=0.
    .filter((range) => /^[a-z]{2,3}$/.test(range.language) && range.quality > 0)
    .sort((a, b) => b.quality - a.quality);
}

function toLocale(language: string): Locale | null {
  return locales.find((locale) => locale === language) ?? null;
}

/**
 * The language the visitor actually asked for: one we publish, among the
 * highest-quality tags in the header. Ties happen — "tr,sq" ranks both at
 * q=1 — so this reads the whole top band rather than only the first tag.
 */
export function preferredLocale(ranges: LanguageRange[]): Locale | null {
  const best = ranges[0]?.quality;
  if (best === undefined) return null;

  for (const range of ranges) {
    if (range.quality < best) break;
    const locale = toLocale(range.language);
    if (locale) return locale;
  }
  return null;
}

/** Any locale we publish, at any rank — "de" out of "tr,en;q=0.8,de;q=0.5". */
export function acceptedLocale(ranges: LanguageRange[]): Locale | null {
  for (const range of ranges) {
    const locale = toLocale(range.language);
    if (locale) return locale;
  }
  return null;
}

/**
 * Country implied by the locale tags themselves ("de-CH" → CH). A weak stand-in
 * for a real lookup — it reports where the phone was set up, not where it is —
 * used only when nothing in front of the app sent a country header, so that
 * local development and any deploy without GeoIP still behave sensibly.
 */
export function regionFromRanges(ranges: LanguageRange[]): string | null {
  for (const range of ranges) {
    const country = normaliseCountry(range.region);
    if (country) return country;
  }
  return null;
}
