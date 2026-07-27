import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { AnalyticsConsent } from "@/components/analytics";
import { ContactFab } from "@/components/contact-fab";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AgencyJsonLd } from "@/components/structured-data";
import { site } from "@/data/site";
import { getDictionary, resolveLocale } from "@/i18n";
import { localeMeta, locales } from "@/i18n/config";
import { buildNav } from "@/lib/nav";
import { alternatesFor } from "@/lib/seo";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/** Only the three known locales are valid route segments. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${dict.meta.homeTitle}`,
      template: `%s | ${site.name}`,
    },
    description: dict.meta.homeDescription,
    applicationName: site.name,
    alternates: alternatesFor(locale),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: localeMeta[locale].ogLocale,
      url: `/${locale}`,
      title: `${site.name} — ${dict.meta.homeTitle}`,
      description: dict.meta.homeDescription,
    },
    twitter: { card: "summary_large_image" },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const nav = buildNav(locale, dict);

  return (
    <html
      lang={locale}
      className={`${bodyFont.variable} h-full antialiased`}
    >
      {/* The bottom padding is the height of the sticky mobile CTA bar, so it
          never covers the last line of the footer. */}
      <body className="flex min-h-full flex-col pb-[4.75rem] font-sans lg:pb-0">
        <AgencyJsonLd locale={locale} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ocean-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          {dict.nav.skipToContent}
        </a>
        <SiteHeader
          locale={locale}
          nav={nav}
          bookLabel={dict.common.bookNow}
          menuLabel={dict.nav.menu}
          closeLabel={dict.nav.close}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} />
        <MobileCtaBar
          locale={locale}
          bookLabel={dict.common.bookNow}
          callLabel={dict.common.callUs}
        />
        <ContactFab
          whatsappLabel={dict.common.whatsapp}
          message={dict.form.title}
        />
        <AnalyticsConsent
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          copy={dict.cookies}
        />
      </body>
    </html>
  );
}
