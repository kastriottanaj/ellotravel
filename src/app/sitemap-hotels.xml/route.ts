import { hotels } from "@/data/hotels";
import { sitemapResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

export function GET() {
  return sitemapResponse(
    hotels.map((hotel) => ({
      path: `/hotels/${hotel.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  );
}
