import { site } from "@/data/site";
import { locales, type Locale } from "@/i18n/config";

export type SitemapPath = {
  path: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function localizedUrl(locale: Locale, path: string) {
  return `${site.url}/${locale}${path}`;
}

export function sitemapResponse(paths: SitemapPath[]) {
  const entries = locales.flatMap((locale) =>
    paths.map(({ path, changeFrequency, priority }) => {
      const alternates = locales
        .map(
          (alternateLocale) =>
            `    <xhtml:link rel="alternate" hreflang="${alternateLocale}" href="${escapeXml(localizedUrl(alternateLocale, path))}" />`,
        )
        .join("\n");

      return [
        "  <url>",
        `    <loc>${escapeXml(localizedUrl(locale, path))}</loc>`,
        alternates,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(localizedUrl("sq", path))}" />`,
        `    <changefreq>${changeFrequency}</changefreq>`,
        `    <priority>${priority.toFixed(1)}</priority>`,
        "  </url>",
      ].join("\n");
    }),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
