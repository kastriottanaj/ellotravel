import { defaultLocale, isLocale, type Locale } from "./config";
import type { Dictionary } from "./types";
import sq from "./dictionaries/sq";
import de from "./dictionaries/de";
import en from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { sq, de, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/**
 * Route params arrive as strings. Narrow to a Locale or fall back, so a bad
 * URL segment renders the default language instead of crashing.
 */
export function resolveLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

/** Builds a locale-prefixed href: localePath("de", "/hotels") -> "/de/hotels" */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

export { defaultLocale, isLocale };
export type { Locale, Dictionary };
