import { destinations } from "@/data/destinations";
import { sitemapResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

export function GET() {
  return sitemapResponse(
    destinations.map((destination) => ({
      path: `/flights/${destination.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  );
}
