import type { Metadata } from "next";
import { HotelCard } from "@/components/cards";
import { IconArrowRight } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { TrustBar } from "@/components/trust-bar";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { cities, hotels, hotelsByCity, type CitySlug } from "@/data/hotels";
import { whatsappHref } from "@/data/site";
import { getDictionary, resolveLocale } from "@/i18n";
import { locales } from "@/i18n/config";
import { alternatesFor } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return {
    title: dict.meta.hotelsTitle,
    description: dict.meta.hotelsDescription,
    alternates: alternatesFor(locale, "/hotels"),
  };
}

export default async function HotelsPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const citySlugs = Object.keys(cities) as CitySlug[];

  return (
    <>
      <PageHero
        kicker={`${dict.nav.hotels} — ${hotels.length}`}
        title={dict.hotels.title}
        description={dict.hotels.subtitle}
        theme="riviera"
        actions={
          <>
            <ButtonLink href={`/${locale}/contact?subject=hotel`} size="lg">
              {dict.common.bookNow}
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href={whatsappHref(dict.form.title)}
              variant="onDark"
              size="lg"
              target="_blank"
              rel="noreferrer noopener"
            >
              {dict.common.whatsapp}
            </ButtonLink>
          </>
        }
      />

      <TrustBar locale={locale} dict={dict} overlap />

      <div className="container-page space-y-16 py-16">
        {citySlugs.map((slug) => {
          const city = cities[slug];
          const list = hotelsByCity(slug);

          return (
            <section key={slug} aria-labelledby={`city-${slug}`}>
              <SectionHeading
                id={`city-${slug}`}
                title={city.name[locale]}
                description={city.blurb[locale]}
              />

              {list.length === 0 ? (
                <p className="mt-6 text-sm text-ocean-600">{dict.hotels.empty}</p>
              ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((hotel) => (
                    <HotelCard
                      key={hotel.slug}
                      hotel={hotel}
                      locale={locale}
                      dict={dict}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
