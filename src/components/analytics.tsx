import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Google Analytics 4, via the official `@next/third-parties` integration.
 *
 * The measurement ID is read from the environment rather than hardcoded so a
 * staging or preview deploy can point at its own property — or, by leaving the
 * variable unset, report nothing at all and keep test traffic out of the
 * agency's numbers. Local development is unconfigured by default for the same
 * reason.
 *
 * Route changes need no extra wiring: App Router navigation goes through
 * history.pushState, which GA4's enhanced measurement already counts as a page
 * view.
 *
 * To measure a specific interaction — an enquiry submitted, a WhatsApp tap —
 * call `sendGAEvent` from `@next/third-parties/google` inside a Client
 * Component.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
