import type { Metadata } from "next";
import { HotelCard } from "@/components/cards";
import { PageHero } from "@/components/page-hero";
import { cities, hotelsByCity, type CitySlug } from "@/data/hotels";
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
        kicker={dict.nav.hotels}
        title={dict.hotels.title}
        description={dict.hotels.subtitle}
        theme="riviera"
      />

      <div className="container-page space-y-16 py-16">
        {citySlugs.map((slug) => {
          const city = cities[slug];
          const list = hotelsByCity(slug);

          return (
            <section key={slug} aria-labelledby={`city-${slug}`}>
              <div className="max-w-2xl">
                <h2
                  id={`city-${slug}`}
                  className="font-display text-2xl font-semibold text-ocean-950 sm:text-3xl"
                >
                  {city.name[locale]}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-ocean-700">
                  {city.blurb[locale]}
                </p>
              </div>

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
