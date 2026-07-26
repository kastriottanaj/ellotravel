import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui";
import { destinations } from "@/data/destinations";
import { hotels } from "@/data/hotels";
import { site } from "@/data/site";
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
    title: dict.meta.aboutTitle,
    description: dict.meta.aboutDescription,
    alternates: alternatesFor(locale, "/about"),
  };
}

export default async function AboutPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  const stats = [
    { value: `${destinations.length}+`, label: dict.about.statsRoutes },
    { value: String(hotels.length), label: dict.about.statsHotels },
    { value: site.address.city, label: dict.about.statsBase },
  ];

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${site.address.street}, ${site.address.city}, Kosovo`,
  )}`;

  return (
    <>
      <PageHero
        kicker={dict.nav.about}
        title={dict.about.title}
        description={dict.about.lead}
        theme="alpine"
      />

      <div className="container-page grid gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-lg leading-relaxed text-ocean-800 text-pretty">
            {dict.about.body1}
          </p>
          <p className="mt-5 text-base leading-relaxed text-ocean-700 text-pretty">
            {dict.about.body2}
          </p>

          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-sand-50 p-5 ring-1 ring-sand-200"
              >
                <dt className="font-display text-3xl font-semibold text-ocean-950">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-sm text-ocean-700">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside>
          <div className="rounded-2xl bg-ocean-900 p-6 text-white sm:p-8">
            <h2 className="font-display text-xl font-semibold">
              {dict.about.visitTitle}
            </h2>
            <address className="mt-4 text-sm not-italic leading-relaxed text-ocean-100">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region}
            </address>
            <p className="mt-4 text-sm text-ocean-200">{dict.contact.hoursValue}</p>
            <div className="mt-6 flex flex-col gap-2.5">
              <ButtonLink
                href={mapsUrl}
                variant="onDark"
                target="_blank"
                rel="noreferrer noopener"
              >
                {dict.contact.address}
              </ButtonLink>
              <ButtonLink href={`/${locale}/contact`}>
                {dict.common.bookNow}
              </ButtonLink>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
