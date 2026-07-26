import { site } from "@/data/site";

export const dynamic = "force-static";

const sitemaps = [
  "sitemap-pages.xml",
  "sitemap-destinations.xml",
  "sitemap-hotels.xml",
] as const;

export function GET() {
  const entries = sitemaps
    .map((name) => `  <sitemap><loc>${site.url}/${name}</loc></sitemap>`)
    .join("\n");
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</sitemapindex>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
