import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

/**
 * Builds canonical + hreflang for one page in every language.
 *
 * Page-level `alternates` replace the layout's wholesale, so every page must
 * emit the full set — including x-default, which tells Google what to serve a
 * visitor whose language it can't match. Bare language codes ("de", not
 * "de-DE") are deliberate: the German pages target diaspora in Germany,
 * Switzerland and Austria alike, and a region-tagged hreflang would narrow that.
 */
export function alternatesFor(
  locale: Locale,
  path: string = "",
): Metadata["alternates"] {
  const clean = path === "/" ? "" : path;

  return {
    canonical: `/${locale}${clean}`,
    languages: {
      ...Object.fromEntries(locales.map((code) => [code, `/${code}${clean}`])),
      "x-default": `/${defaultLocale}${clean}`,
    },
  };
}
