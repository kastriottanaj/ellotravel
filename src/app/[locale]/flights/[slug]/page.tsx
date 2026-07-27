import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DestinationCard } from "@/components/cards";
import { IconArrowRight } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { TrustBar } from "@/components/trust-bar";
import { ButtonLink, SectionHeading } from "@/components/ui";
import {
  countries,
  destinations,
  getDestination,
} from "@/data/destinations";
import { hubAirport, site, whatsappHref } from "@/data/site";
import { getDictionary, resolveLocale } from "@/i18n";
import { locales } from "@/i18n/config";
import { fill } from "@/lib/format";
import { alternatesFor } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    destinations.map((destination) => ({ locale, slug: destination.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const destination = getDestination(slug);
  if (!destination) return {};

  const dict = getDictionary(locale);
  const city = destination.city[locale];
  const title = fill(dict.meta.routeTitle, { city });

  return {
    title,
    description: fill(dict.meta.routeDescription, {
      city,
      iata: destination.iata,
    }),
    alternates: alternatesFor(locale, `/flights/${destination.slug}`),
    openGraph: {
      title,
      description: fill(dict.flights.routeIntro, {
        city,
        country: countries[destination.country][locale],
      }),
      url: `/${locale}/flights/${destination.slug}`,
    },
  };
}

export default async function FlightRoutePage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const destination = getDestination(slug);
  if (!destination) notFound();

  const dict = getDictionary(locale);
  const city = destination.city[locale];
  const country = countries[destination.country][locale];
  const others = destinations
    .filter((item) => item.slug !== destination.slug)
    .slice(0, 4);
  const enquiry = `${dict.form.title}: ${hubAirport.city[locale]} – ${city}`;

  const facts = [
    { label: dict.flights.routeDeparture, value: `${hubAirport.city[locale]} (${hubAirport.iata})` },
    { label: dict.flights.routeAirport, value: `${city} (${destination.iata})` },
    { label: dict.flights.routeCountry, value: country },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.flights.title,
        item: `${site.url}/${locale}/flights`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${hubAirport.city[locale]} – ${city}`,
        item: `${site.url}/${locale}/flights/${destination.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        kicker={`${hubAirport.city[locale]} (${hubAirport.iata}) → ${city} (${destination.iata})`}
        title={fill(dict.meta.routeTitle, { city })}
        description={fill(dict.flights.routeIntro, { city, country })}
        theme={destination.scene}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ocean-200">
            <Link href={`/${locale}/flights`} className="hover:text-white">
              {dict.flights.title}
            </Link>
            <span className="mx-2 text-ocean-400">/</span>
            <span className="text-white">{city}</span>
          </nav>
        }
        actions={
          <>
            <ButtonLink
              href={`/${locale}/contact?subject=flight&ref=${destination.slug}`}
              size="lg"
            >
              {dict.flights.askPrice}
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href={whatsappHref(enquiry)}
              variant="onDark"
              size="lg"
              target="_blank"
              rel="noreferrer noopener"
            >
              WhatsApp
            </ButtonLink>
          </>
        }
      />

      <TrustBar locale={locale} dict={dict} overlap />

      <div className="container-page grid gap-10 py-14 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <dl className="grid gap-4 sm:grid-cols-3">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl bg-white p-4 shadow-card ring-1 ring-ocean-100"
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ocean-600">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-lg font-bold text-ocean-950">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-base leading-relaxed text-ocean-700">
            {dict.flights.routeBody}
          </p>
          <p className="mt-4 text-sm text-ocean-600">{dict.flights.priceNote}</p>
        </div>

        <aside>
          <div className="rounded-2xl bg-ocean-900 p-6 text-white">
            <h2 className="text-lg font-bold">
              {dict.flights.baggageTitle}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ocean-100">
              {[dict.flights.checkIn, dict.flights.baggage, dict.flights.handLuggage].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 fill-sunset-400">
                      <path d="M8.2 13.4 4.9 10l-1.2 1.2 4.5 4.5 9-9-1.2-1.2z" />
                    </svg>
                    {item}
                  </li>
                ),
              )}
            </ul>
            <hr className="my-5 border-white/15" />
            <p className="text-sm text-ocean-200">{dict.form.orCall}</p>
            <ul className="mt-2 space-y-1">
              {site.phones.map((phone) => (
                <li key={phone.e164}>
                  <a
                    href={`tel:${phone.e164}`}
                    className="text-lg font-bold hover:text-sunset-300"
                  >
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section aria-labelledby="other-routes" className="bg-sand-50 py-16">
        <div className="container-page">
          <SectionHeading id="other-routes" title={dict.flights.popularRoutes} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item) => (
              <DestinationCard
                key={item.slug}
                destination={item}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
