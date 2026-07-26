import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { getDictionary, resolveLocale } from "@/i18n";
import { locales } from "@/i18n/config";

export const alt = "Ello Travel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Without this the card is rendered on demand instead of baked at build time. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Branded share card, generated at build time for each locale. */
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
          padding: 80,
          background: "linear-gradient(135deg, #0f3049 0%, #154a73 55%, #2775aa 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
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

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.05, display: "flex" }}>
            {dict.home.heroTitle}
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#d8e9f5",
              maxWidth: 880,
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
            fontSize: 28,
            color: "#b0d2ea",
            borderTop: "2px solid rgba(255,255,255,0.18)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>{site.domain}</div>
          <div style={{ display: "flex" }}>{site.phones[0].display}</div>
        </div>
      </div>
    ),
    size,
  );
}
