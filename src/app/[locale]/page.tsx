import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DestinationCard, HotelCard, OfferTile } from "@/components/cards";
import {
  IconArrowRight,
  IconBriefcase,
  IconHeadset,
  IconPlane,
  IconTag,
  IconUser,
} from "@/components/icons";
import { Scene } from "@/components/scene";
import { TrustBar } from "@/components/trust-bar";
import { ButtonLink, SectionHeading, Stars } from "@/components/ui";
import { destinations, popularDestinations } from "@/data/destinations";
import { featuredHotels } from "@/data/hotels";
import { featuredOffers } from "@/data/offers";
import { heroImage, site, yearsTrading } from "@/data/site";
import { initials, testimonials } from "@/data/testimonials";
import { getDictionary, resolveLocale } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { alternatesFor } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

/** Every section below takes the same two things, so they share one shape. */
type SectionProps = { locale: Locale; dict: Dictionary };

/**
 * The hero photograph is optional: the page is prerendered, so this checks
 * once at build time whether the file named in `site.ts` was actually dropped
 * into /public. Without it the hero falls back to the illustrated sky instead
 * of rendering a broken image.
 */
const heroPhoto =
  heroImage && existsSync(join(process.cwd(), "public", heroImage))
    ? heroImage
    : null;

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

function Hero({ locale, dict }: SectionProps) {
  const stats = [
    {
      icon: IconUser,
      value: `${destinations.length}+`,
      label: dict.home.trustFlights,
    },
    {
      icon: IconBriefcase,
      value: `${yearsTrading()}`,
      label: dict.home.trustExperience,
    },
    { icon: IconHeadset, value: "1:1", label: dict.home.trustSupport },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-ocean-950">
      <div className="absolute inset-0 -z-10">
        {/* The illustrated sky sits underneath, so the hero still reads as
            designed on the day the photograph is swapped out or missing. */}
        <Scene theme="sunset" rounded={false} />
        {heroPhoto && (
          <Image
            src={heroPhoto}
            alt={dict.home.heroImageAlt}
            fill
            preload
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-950 via-ocean-950/85 to-ocean-950/35 lg:to-ocean-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-transparent to-ocean-950/40" />
      </div>

      <div className="container-page py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl animate-fade-up">
          <p className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white ring-1 ring-white/20 backdrop-blur-sm">
            {dict.home.heroKicker}
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
            {dict.home.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ocean-100 text-pretty">
            {dict.home.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`/${locale}/contact`} size="lg">
              {dict.home.heroCtaPrimary}
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href={`/${locale}/offers`} variant="onDark" size="lg">
              {dict.home.heroCtaSecondary}
            </ButtonLink>
          </div>
        </div>

        <ul className="mt-12 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/15 sm:grid-cols-3">
          {stats.map(({ icon: Icon, value, label }) => (
            <li
              key={label}
              className="flex items-center gap-3.5 bg-ocean-950/55 px-5 py-4 backdrop-blur-sm"
            >
              <Icon className="h-6 w-6 shrink-0 text-sunset-300" />
              <div className="min-w-0">
                <p className="text-2xl font-bold leading-none text-white">
                  {value}
                </p>
                <p className="mt-1.5 text-sm leading-snug text-ocean-100">
                  {label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Features({ dict }: SectionProps) {
  const features = [
    {
      icon: IconPlane,
      title: dict.home.featureDestinationsTitle,
      body: dict.home.featureDestinationsBody,
    },
    {
      icon: IconTag,
      title: dict.home.featurePricesTitle,
      body: dict.home.featurePricesBody,
    },
    {
      icon: IconHeadset,
      title: dict.home.featureSupportTitle,
      body: dict.home.featureSupportBody,
    },
  ];

  return (
    <section className="container-page py-12 lg:py-14">
      <ul className="grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-ocean-100">
        {features.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="flex items-start gap-4 sm:px-7 sm:first:pl-0 sm:last:pr-0"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ocean-50 text-ocean-600">
              <Icon />
            </span>
            <div>
              {/* h2 rather than h3: these are the first headings after the
                  page title, so the outline must not skip a level. */}
              <h2 className="text-base font-bold text-ocean-950">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ocean-700 text-pretty">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Testimonials({ locale, dict }: SectionProps) {
  return (
    <section
      aria-labelledby="home-testimonials"
      className="container-page pb-14 lg:pb-16"
    >
      <h2 id="home-testimonials" className="sr-only">
        {dict.home.testimonialsTitle}
      </h2>
      <div className="grid gap-6 rounded-2xl bg-ocean-50/70 p-6 ring-1 ring-ocean-100 sm:p-8 md:grid-cols-2 md:gap-0 md:divide-x md:divide-ocean-200/70">
        {testimonials.map((person) => (
          <figure
            key={person.id}
            className="flex gap-4 md:px-8 md:first:pl-0 md:last:pr-0"
          >
            {person.avatar ? (
              <Image
                src={person.avatar}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ocean-100 text-base font-bold text-ocean-700"
              >
                {initials(person.name)}
              </span>
            )}
            <div>
              <Stars
                count={person.rating}
                label={`${person.rating} ${dict.common.stars}`}
                size="md"
              />
              <blockquote className="mt-2 text-sm leading-relaxed text-ocean-800 text-pretty">
                {`“${person.quote[locale]}”`}
              </blockquote>
              <figcaption className="mt-3 text-sm">
                <span className="font-bold text-ocean-950">{person.name}</span>
                <span className="block text-ocean-600">
                  {person.city[locale]}
                </span>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Offers({ locale, dict }: SectionProps) {
  return (
    <section
      aria-labelledby="home-offers"
      className="container-page pb-16 lg:pb-20"
    >
      <SectionHeading
        id="home-offers"
        title={dict.home.offersTitle}
        action={
          <ButtonLink href={`/${locale}/offers`} variant="outline">
            {dict.home.offersCta}
          </ButtonLink>
        }
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featuredOffers(4).map((offer) => (
          <OfferTile key={offer.slug} offer={offer} locale={locale} dict={dict} />
        ))}
      </div>
    </section>
  );
}

/** Route shortcuts — the highest-intent links on the page. */
function PopularRoutes({ locale, dict }: SectionProps) {
  return (
    <section className="bg-sand-50 py-14 lg:py-16">
      <div className="container-page">
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ocean-100 sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-ocean-950">
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
            {popularDestinations(8).map((destination) => (
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
      </div>
    </section>
  );
}

function Hotels({ locale, dict }: SectionProps) {
  return (
    <section aria-labelledby="home-hotels" className="container-page py-16 lg:py-20">
      <SectionHeading
        id="home-hotels"
        title={dict.home.hotelsTitle}
        description={dict.home.hotelsSubtitle}
        action={
          <ButtonLink href={`/${locale}/hotels`} variant="outline">
            {dict.common.viewAll}
          </ButtonLink>
        }
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredHotels(4).map((hotel) => (
          <HotelCard key={hotel.slug} hotel={hotel} locale={locale} dict={dict} />
        ))}
      </div>
    </section>
  );
}

function Flights({ locale, dict }: SectionProps) {
  return (
    <section aria-labelledby="home-flights" className="bg-sand-50 py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading
          id="home-flights"
          title={dict.home.flightsTitle}
          description={dict.home.flightsSubtitle}
          action={
            <ButtonLink href={`/${locale}/flights`} variant="outline">
              {dict.flights.allRoutes}
            </ButtonLink>
          }
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularDestinations(4).map((destination) => (
            <DestinationCard
              key={destination.slug}
              destination={destination}
              locale={locale}
              dict={dict}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs({ dict }: SectionProps) {
  const reasons = [
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
  ];

  return (
    <section aria-labelledby="home-why" className="container-page py-16 lg:py-20">
      <SectionHeading id="home-why" title={dict.home.whyTitle} />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reasons.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ocean-100/70"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sunset-50 text-sunset-600">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
                <path d={item.icon} />
              </svg>
            </span>
            <h3 className="mt-4 text-lg font-bold text-ocean-950">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ocean-700">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClosingCta({ locale, dict }: SectionProps) {
  return (
    <section className="container-page pb-16 lg:pb-20">
      <div className="relative isolate overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
        <div className="absolute inset-0 -z-10">
          <Scene theme="sunset" rounded={false} />
          <div className="absolute inset-0 bg-ocean-950/75" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
          {dict.home.ctaTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ocean-100 text-pretty">
          {dict.home.ctaBody}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={`/${locale}/contact`} size="lg">
            {dict.common.bookNow}
            <IconArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href={`tel:${site.phones[0].e164}`} variant="onDark" size="lg">
            {site.phones[0].display}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const props = { locale, dict };

  return (
    <>
      <Hero {...props} />
      <TrustBar {...props} overlap />
      <Features {...props} />
      <Testimonials {...props} />
      <Offers {...props} />
      <PopularRoutes {...props} />
      <Hotels {...props} />
      <Flights {...props} />
      <WhyUs {...props} />
      <ClosingCta {...props} />
    </>
  );
}
