import { sitemapResponse, type SitemapPath } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

const pages: SitemapPath[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/flights", changeFrequency: "weekly", priority: 0.9 },
  { path: "/hotels", changeFrequency: "weekly", priority: 0.9 },
  { path: "/offers", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
];

export function GET() {
  return sitemapResponse(pages);
}
