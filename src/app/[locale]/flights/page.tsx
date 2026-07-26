import type { Metadata } from "next";
import { DestinationCard } from "@/components/cards";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/ui";
import {
  countries,
  destinations,
  popularDestinations,
  type CountryCode,
} from "@/data/destinations";
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
    title: dict.meta.flightsTitle,
    description: dict.meta.flightsDescription,
    alternates: alternatesFor(locale, "/flights"),
  };
}

export default async function FlightsPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const popular = popularDestinations(8);

  // Group by country so the long list scans as a handful of blocks.
  const grouped = destinations.reduce<Record<string, typeof destinations>>(
    (accumulator, destination) => {
      (accumulator[destination.country] ??= []).push(destination);
      return accumulator;
    },
    {},
  );
  const countryCodes = Object.keys(grouped) as CountryCode[];

  const included = [
    dict.flights.checkIn,
    dict.flights.baggage,
    dict.flights.handLuggage,
  ];

  return (
    <>
      <PageHero
        kicker={dict.nav.flights}
        title={dict.flights.title}
        description={dict.flights.subtitle}
        theme="metropolis"
      >
        <ul className="flex flex-wrap gap-2.5">
          {included.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white ring-1 ring-white/15"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-sunset-300">
                <path d="M8.2 13.4 4.9 10l-1.2 1.2 4.5 4.5 9-9-1.2-1.2z" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="container-page py-16">
        <SectionHeading
          title={dict.flights.popularRoutes}
          description={dict.flights.priceNote}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.slice(0, 4).map((destination) => (
            <DestinationCard
              key={destination.slug}
              destination={destination}
              locale={locale}
              dict={dict}
            />
          ))}
        </div>
      </section>

      <section className="bg-sand-50 py-16">
        <div className="container-page">
          <SectionHeading title={dict.flights.allRoutes} />
          <div className="mt-10 space-y-10">
            {countryCodes.map((code) => (
              <div key={code}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-sunset-600">
                  {countries[code][locale]}
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  {grouped[code].map((destination) => (
                    <DestinationCard
                      key={destination.slug}
                      destination={destination}
                      locale={locale}
                      dict={dict}
                      compact
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
