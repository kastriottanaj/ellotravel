import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Every page canonicalises to the www host (see `alternatesFor` in
   * src/lib/seo.ts), but the apex served the same pages at 200 — so crawlers
   * met the whole site twice and had to take the canonical tag's word for
   * which copy counts. This 308 removes the duplicate host outright.
   *
   * The `host` value is matched anchored (`^…$`), so it hits `ellotravel.net`
   * only and cannot fire on `www.ellotravel.net` and loop — provided nginx
   * forwards the original Host header (`proxy_set_header Host $host`).
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ellotravel\\.net" }],
        destination: "https://www.ellotravel.net/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
