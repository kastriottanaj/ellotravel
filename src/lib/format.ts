import { localeMeta, type Locale } from "@/i18n/config";

/** Fills {placeholders} in dictionary strings: fill(d.meta.routeTitle, { city }) */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export function formatPrice(value: number, locale: Locale): string {
  const { intl, currency } = localeMeta[locale];
  return new Intl.NumberFormat(intl, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** One-decimal score in the reader's locale: 4.9 renders as "4,9" in sq and de. */
export function formatRating(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMeta[locale].intl, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/** Joins class names, dropping falsy values. */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
