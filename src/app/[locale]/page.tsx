import type { Metadata } from "next";
import Link from "next/link";
import { DestinationCard, HotelCard, OfferCard } from "@/components/cards";
import { Scene } from "@/components/scene";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { destinations, popularDestinations } from "@/data/destinations";
import { featuredHotels } from "@/data/hotels";
import { offers } from "@/data/offers";
import { hubAirport, site } from "@/data/site";
import { getDictionary, resolveLocale } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { alternatesFor } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return {
    // The layout template appends "| Ello Travel"; an absolute title avoids
    // repeating the brand name twice on the home page.
    title: { absolute: `${site.name} — ${dict.meta.homeTitle}` },
    description: dict.meta.homeDescription,
    alternates: alternatesFor(locale),
  };
}

function TrustStrip({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = [
    { value: `${destinations.length}+`, label: dict.home.trustFlights },
    { value: "7", label: dict.home.trustHotels },
    { value: "1:1", label: dict.home.trustSupport },
  ];

  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-ocean-950/50 px-5 py-4 backdrop-blur-sm">
          <dt className="font-display text-2xl font-semibold text-white">
            {item.value}
          </dt>
          <dd className="mt-0.5 text-sm leading-snug text-ocean-100">
            {item.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default async function HomePage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const hotels = featuredHotels(4);
  const popular = popularDestinations(8);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Scene theme="riviera" rounded={false} />
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-950/85 via-ocean-900/65 to-ocean-800/45" />
        </div>

        <div className="container-page py-20 lg:py-28">
          <div className="max-w-2xl animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sunset-200 ring-1 ring-white/15">
              {dict.home.heroKicker}
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ocean-100 text-pretty">
              {dict.home.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/contact`} size="lg">
                {dict.home.heroCtaPrimary}
              </ButtonLink>
              <ButtonLink href={`/${locale}/offers`} variant="onDark" size="lg">
                {dict.home.heroCtaSecondary}
              </ButtonLink>
            </div>
          </div>

          <div className="mt-14 max-w-3xl">
            <TrustStrip locale={locale} />
          </div>
        </div>
      </section>

      {/* Popular routes — the highest-intent entry point, so it sits first. */}
      <section className="container-page -mt-8 pb-4">
        <div className="rounded-2xl bg-white p-5 shadow-lift ring-1 ring-ocean-100 sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-ocean-950">
              {dict.flights.popularRoutes}
            </h2>
            <Link
              href={`/${locale}/flights`}
              className="text-sm font-semibold text-sunset-600 hover:underline"
            >
              {dict.flights.allRoutes} →
            </Link>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((destination) => (
              <DestinationCard
                key={destination.slug}
                destination={destination}
                locale={locale}
                dict={dict}
                compact
              />
            ))}
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ocean-600">
            <span className="font-semibold text-ocean-800">
              {dict.flights.baggageTitle}:
            </span>
            <span>✓ {dict.flights.checkIn}</span>
            <span>✓ {dict.flights.baggage}</span>
            <span>✓ {dict.flights.handLuggage}</span>
          </p>
        </div>
      </section>

      {/* Offers */}
      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          kicker={dict.nav.offers}
          title={dict.home.offersTitle}
          description={dict.home.offersSubtitle}
          action={
            <ButtonLink href={`/${locale}/offers`} variant="outline">
              {dict.common.viewAll}
            </ButtonLink>
          }
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard key={offer.slug} offer={offer} locale={locale} dict={dict} />
          ))}
        </div>
      </section>

      {/* Hotels */}
      <section className="bg-sand-50 py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            kicker={dict.nav.hotels}
            title={dict.home.hotelsTitle}
            description={dict.home.hotelsSubtitle}
            action={
              <ButtonLink href={`/${locale}/hotels`} variant="outline">
                {dict.common.viewAll}
              </ButtonLink>
            }
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.slug} hotel={hotel} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      {/* Flights */}
      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          kicker={hubAirport.city[locale]}
          title={dict.home.flightsTitle}
          description={dict.home.flightsSubtitle}
          action={
            <ButtonLink href={`/${locale}/flights`} variant="outline">
              {dict.flights.allRoutes}
            </ButtonLink>
          }
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

      {/* Why us */}
      <section className="bg-sand-50 py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading title={dict.home.whyTitle} align="center" />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                title: dict.home.whyLocalTitle,
                body: dict.home.whyLocalBody,
                icon: "M12 21s-7-5.3-7-10a7 7 0 1 1 14 0c0 4.7-7 10-7 10Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
              },
              {
                title: dict.home.whyPriceTitle,
                body: dict.home.whyPriceBody,
                icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-1.2c-1.5-.3-2.6-1.2-2.7-2.8h1.9c.1.8.7 1.3 1.8 1.3 1 0 1.6-.4 1.6-1.1 0-.6-.4-.9-1.7-1.2-2-.5-3.3-1.1-3.3-2.8 0-1.4 1-2.3 2.4-2.6V5h2v1.6c1.4.3 2.3 1.2 2.4 2.6h-1.9c-.1-.7-.6-1.2-1.5-1.2-1 0-1.5.4-1.5 1 0 .6.5.8 1.8 1.2 2 .5 3.2 1.1 3.2 2.9 0 1.4-1 2.4-2.5 2.7V17Z",
              },
              {
                title: dict.home.whyFamilyTitle,
                body: dict.home.whyFamilyBody,
                icon: "M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-2.7 0-8 1.3-8 4v2h9v-2c0-1 .4-2.2 1.3-3.1A14 14 0 0 0 8 13Zm8 0c-.6 0-1.3.1-2 .2 1.3.9 2 2 2 3.3V19h8v-2c0-2.7-5.3-4-8-4Z",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ocean-100/70"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sunset-50 text-sunset-600">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
                    <path d={item.icon} />
                  </svg>
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ocean-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ocean-700">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-page py-16 lg:py-20">
        <div className="relative isolate overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 -z-10">
            <Scene theme="sunset" rounded={false} />
            <div className="absolute inset-0 bg-ocean-950/70" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-white text-balance sm:text-4xl">
            {dict.home.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ocean-100 text-pretty">
            {dict.home.ctaBody}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={`/${locale}/contact`} size="lg">
              {dict.common.bookNow}
            </ButtonLink>
            <ButtonLink
              href={`tel:${site.phones[0].e164}`}
              variant="onDark"
              size="lg"
            >
              {site.phones[0].display}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
