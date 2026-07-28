import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * `script-src` carries `'unsafe-inline'` and that is a deliberate trade, not
 * an oversight: React streams its payload through inline scripts, and the
 * alternative — a per-request nonce minted in `proxy.ts` — would make every
 * page dynamic and throw away the prerendering the whole site is built on.
 * What remains is still worth having. An injected `<script src>` has nowhere
 * to point, `object-src 'none'` closes the plugin route, `base-uri` stops a
 * rewritten `<base>` from redirecting every relative URL on the page, and
 * `form-action` keeps the enquiry form posting to us.
 *
 * The googletagmanager and google-analytics entries are what GA4 needs; drop
 * them the day analytics goes.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  // next/image writes positioning into a style attribute, and next/font emits
  // an inline <style> block, so both need this.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com",
  // next/font self-hosts, so no third-party font host belongs here.
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "manifest-src 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Superseded by frame-ancestors above, kept for browsers that predate it.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  /**
   * Two years, but *without* `includeSubDomains` or `preload`. Both are
   * one-way doors — a subdomain that is not on HTTPS becomes unreachable for
   * the length of the max-age, and preload is removed on Google's schedule
   * rather than ours. Add them once every host under ellotravel.net is known
   * to be served over TLS.
   */
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

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
