import { ImageResponse } from "next/og";
import { googleReviews, site } from "@/data/site";
import { getDictionary, resolveLocale } from "@/i18n";
import { locales } from "@/i18n/config";
import { fill, formatRating } from "@/lib/format";

export const alt = "Ello Travel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Without this the card is rendered on demand instead of baked at build time. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Branded share card, generated at build time for each locale — this is the
 * agency's shopfront in WhatsApp and Instagram DMs, so it carries the same
 * kicker pill, orange rule and rating as the page it links to.
 *
 * Rendered by Satori, which supports a subset of CSS: flexbox only, and every
 * element with more than one child needs an explicit `display: flex`.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(120deg, #091f30 0%, #0f3049 45%, #154a73 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Warm glow in the corner, standing in for the hero photograph. */}
        <div
          style={{
            position: "absolute",
            top: -170,
            right: -120,
            width: 640,
            height: 640,
            borderRadius: 320,
            background:
              "radial-gradient(circle, rgba(238,124,27,0.55) 0%, rgba(238,124,27,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: "#ee7c1b",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 30,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#fdba75",
              display: "flex",
            }}
          >
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              borderRadius: 999,
              border: "2px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.10)",
              padding: "10px 24px",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            {dict.home.heroKicker}
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.04,
              maxWidth: 940,
              display: "flex",
            }}
          >
            {dict.home.heroTitle}
          </div>

          <div
            style={{
              marginTop: 26,
              width: 104,
              height: 9,
              borderRadius: 5,
              background: "#ee7c1b",
            }}
          />

          <div
            style={{
              marginTop: 26,
              fontSize: 31,
              color: "#d8e9f5",
              maxWidth: 900,
              lineHeight: 1.35,
              display: "flex",
            }}
          >
            {dict.meta.homeTitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 27,
            color: "#b0d2ea",
            borderTop: "2px solid rgba(255,255,255,0.18)",
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <div style={{ display: "flex", color: "white" }}>{site.domain}</div>
            <div style={{ display: "flex" }}>{site.phones[0].display}</div>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ display: "flex", color: "#fdba75", fontWeight: 700 }}>
              {formatRating(googleReviews.rating, locale)}/5
            </div>
            <div style={{ display: "flex" }}>
              {fill(dict.home.reviewsLabel, { count: googleReviews.count })}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
