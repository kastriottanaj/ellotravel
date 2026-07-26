import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";
import { hotels } from "@/data/hotels";
import { site } from "@/data/site";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const paths: Array<{ path: string; priority: number }> = [
    { path: "", priority: 1 },
    { path: "/flights", priority: 0.9 },
    { path: "/hotels", priority: 0.9 },
    { path: "/offers", priority: 0.8 },
    { path: "/contact", priority: 0.7 },
    { path: "/about", priority: 0.5 },
    // Route and hotel pages are the ones that win long-tail searches.
    ...destinations.map((destination) => ({
      path: `/flights/${destination.slug}`,
      priority: 0.8,
    })),
    ...hotels.map((hotel) => ({ path: `/hotels/${hotel.slug}`, priority: 0.7 })),
  ];

  return locales.flatMap((locale) =>
    paths.map(({ path, priority }) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((code) => [code, `${site.url}/${code}${path}`]),
        ),
      },
    })),
  );
}
