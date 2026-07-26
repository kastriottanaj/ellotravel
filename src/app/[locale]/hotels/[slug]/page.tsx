import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HotelCard } from "@/components/cards";
import { SceneCover } from "@/components/scene";
import { ButtonLink, Stars } from "@/components/ui";
import {
  amenityCatalog,
  cities,
  getHotel,
  hotels,
} from "@/data/hotels";
import { site, whatsappHref } from "@/data/site";
import { getDictionary, resolveLocale } from "@/i18n";
import { locales } from "@/i18n/config";
import { fill, formatPrice } from "@/lib/format";
import { alternatesFor } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    hotels.map((hotel) => ({ locale, slug: hotel.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const hotel = getHotel(slug);
  if (!hotel) return {};

  const dict = getDictionary(locale);
  const city = cities[hotel.city].name[locale];

  return {
    title: `${hotel.name} — ${city}`,
    description: fill(dict.meta.hotelDescription, { name: hotel.name, city }),
    alternates: alternatesFor(locale, `/hotels/${hotel.slug}`),
    openGraph: {
      title: `${hotel.name} — ${city}`,
      description: hotel.summary[locale],
      url: `/${locale}/hotels/${hotel.slug}`,
    },
  };
}

export default async function HotelPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const hotel = getHotel(slug);
  if (!hotel) notFound();

  const dict = getDictionary(locale);
  const city = cities[hotel.city];
  const others = hotels.filter((item) => item.slug !== hotel.slug).slice(0, 3);
  const enquiry = `${dict.form.title}: ${hotel.name}, ${city.name[locale]}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    starRating: { "@type": "Rating", ratingValue: hotel.stars },
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name.en,
      addressCountry: "AL",
    },
    description: hotel.description[locale],
    amenityFeature: hotel.amenities.map((key) => ({
      "@type": "LocationFeatureSpecification",
      name: amenityCatalog[key][locale],
      value: true,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative isolate">
        <div className="h-[38vh] min-h-[260px] w-full sm:h-[46vh]">
          <SceneCover
            theme={hotel.scene}
            image={hotel.image}
            alt={hotel.name}
            className="h-full w-full"
          />
        </div>
        <div className="container-page relative -mt-24 pb-2">
          <div className="rounded-2xl bg-white p-6 shadow-lift ring-1 ring-ocean-100 sm:p-8">
            <nav aria-label="Breadcrumb" className="text-sm text-ocean-600">
              <Link href={`/${locale}/hotels`} className="hover:text-sunset-600">
                {dict.hotels.title}
              </Link>
              <span className="mx-2 text-ocean-300">/</span>
              <span className="text-ocean-800">{city.name[locale]}</span>
            </nav>

            <div className="mt-3 flex flex-wrap items-start justify-between gap-5">
              <div>
                <Stars
                  count={hotel.stars}
                  label={`${hotel.stars} ${dict.common.stars}`}
                />
                <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-ocean-950 sm:text-4xl">
                  {hotel.name}
                </h1>
                <p className="mt-1.5 flex items-center gap-1.5 text-ocean-700">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-sunset-500">
                    <path d="M12 21s-7-5.3-7-10a7 7 0 1 1 14 0c0 4.7-7 10-7 10Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </svg>
                  {city.name[locale]}, Shqipëri
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                {hotel.priceFrom !== null ? (
                  <p className="text-ocean-600">
                    {dict.common.from}{" "}
                    <span className="font-display text-2xl font-semibold text-ocean-950">
                      {formatPrice(hotel.priceFrom, locale)}
                    </span>{" "}
                    <span className="text-sm">{dict.common.perNight}</span>
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-ocean-700">
                    {dict.flights.askPrice}
                  </p>
                )}
                <div className="flex flex-wrap gap-2.5">
                  <ButtonLink
                    href={`/${locale}/contact?subject=hotel&ref=${hotel.slug}`}
                  >
                    {dict.common.bookNow}
                  </ButtonLink>
                  <ButtonLink
                    href={whatsappHref(enquiry)}
                    variant="outline"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    WhatsApp
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-14 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold text-ocean-950">
            {dict.hotels.aboutHotel}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ocean-700">
            {hotel.description[locale]}
          </p>

          <h3 className="mt-10 font-display text-xl font-semibold text-ocean-950">
            {dict.hotels.amenities}
          </h3>
          <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {hotel.amenities.map((key) => (
              <li
                key={key}
                className="flex items-center gap-2.5 text-sm text-ocean-700"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 fill-sunset-500">
                  <path d="M8.2 13.4 4.9 10l-1.2 1.2 4.5 4.5 9-9-1.2-1.2z" />
                </svg>
                {amenityCatalog[key][locale]}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl bg-sand-50 p-6 ring-1 ring-sand-200">
            <h2 className="font-display text-lg font-semibold text-ocean-950">
              {dict.hotels.location}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ocean-700">
              {city.blurb[locale]}
            </p>
            <hr className="my-5 border-sand-200" />
            <h3 className="text-sm font-semibold text-ocean-950">
              {dict.form.orCall}
            </h3>
            <ul className="mt-2.5 space-y-1.5 text-sm">
              {site.phones.map((phone) => (
                <li key={phone.e164}>
                  <a
                    href={`tel:${phone.e164}`}
                    className="font-semibold text-ocean-900 hover:text-sunset-600"
                  >
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section className="bg-sand-50 py-16">
        <div className="container-page">
          <h2 className="font-display text-2xl font-semibold text-ocean-950">
            {dict.hotels.otherHotels}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <HotelCard key={item.slug} hotel={item} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
