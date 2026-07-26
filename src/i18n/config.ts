export const locales = ["sq", "de", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sq";

/**
 * Display names, Open Graph locale tags and the tag used for Intl number and
 * date formatting. hreflang is *not* here — see lib/seo.ts, which emits bare
 * language codes on purpose.
 */
export const localeMeta: Record<
  Locale,
  { label: string; ogLocale: string; intl: string; currency: string }
> = {
  sq: { label: "Shqip", ogLocale: "sq_AL", intl: "sq-AL", currency: "EUR" },
  de: { label: "Deutsch", ogLocale: "de_DE", intl: "de-DE", currency: "EUR" },
  en: { label: "English", ogLocale: "en_GB", intl: "en-GB", currency: "EUR" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
