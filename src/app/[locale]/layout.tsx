import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { ContactFab } from "@/components/contact-fab";
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

const displayFont = Fraunces({
  variable: "--font-display",
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
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <AgencyJsonLd locale={locale} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ocean-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          {dict.nav.home}
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
        <ContactFab
          callLabel={dict.common.callUs}
          whatsappLabel={dict.common.whatsapp}
          message={dict.form.title}
        />
      </body>
    </html>
  );
}
