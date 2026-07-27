import Link from "next/link";
import { SceneCover } from "@/components/scene";
import { Badge, Stars } from "@/components/ui";
import { amenityCatalog, cities, type Hotel } from "@/data/hotels";
import { countries, type Destination } from "@/data/destinations";
import type { Offer } from "@/data/offers";
import { hubAirport } from "@/data/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cx, formatPrice } from "@/lib/format";

const CARD =
  "group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ocean-100/80 transition duration-300 hover:-translate-y-1 hover:shadow-lift";

function PriceLine({
  value,
  locale,
  suffix,
  fallback,
  from,
}: {
  value: number | null;
  locale: Locale;
  suffix: string;
  fallback: string;
  from: string;
}) {
  if (value === null) {
    return (
      <span className="text-sm font-semibold text-ocean-700">{fallback}</span>
    );
  }
  return (
    <span className="text-sm text-ocean-600">
      {from}{" "}
      <span className="text-lg font-semibold text-ocean-950">
        {formatPrice(value, locale)}
      </span>{" "}
      {suffix}
    </span>
  );
}

export function HotelCard({
  hotel,
  locale,
  dict,
}: {
  hotel: Hotel;
  locale: Locale;
  dict: Dictionary;
}) {
  const city = cities[hotel.city];

  return (
    <article className={CARD}>
      <Link href={`/${locale}/hotels/${hotel.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] w-full">
          <SceneCover
            theme={hotel.scene}
            image={hotel.image}
            alt={hotel.name}
            className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <Stars
              count={hotel.stars}
              label={`${hotel.stars} ${dict.common.stars}`}
              className="mb-1.5"
            />
            <h3 className="text-xl font-bold text-white drop-shadow-sm">
              {hotel.name}
            </h3>
            <p className="text-sm text-white/85">{city.name[locale]}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-sm leading-relaxed text-ocean-700 line-clamp-3">
            {hotel.summary[locale]}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 3).map((key) => (
              <li key={key}>
                <Badge tone="muted">{amenityCatalog[key][locale]}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between border-t border-ocean-50 pt-3.5">
            <PriceLine
              value={hotel.priceFrom}
              locale={locale}
              from={dict.common.from}
              suffix={dict.common.perNight}
              fallback={dict.flights.askPrice}
            />
            <span className="text-sm font-semibold text-sunset-600 group-hover:underline">
              {dict.common.viewDetails}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function DestinationCard({
  destination,
  locale,
  dict,
  compact = false,
}: {
  destination: Destination;
  locale: Locale;
  dict: Dictionary;
  compact?: boolean;
}) {
  const city = destination.city[locale];
  const country = countries[destination.country][locale];

  if (compact) {
    return (
      <Link
        href={`/${locale}/flights/${destination.slug}`}
        className="group flex items-center justify-between gap-3 rounded-xl border border-ocean-100 bg-white px-4 py-3 transition hover:border-ocean-200 hover:bg-ocean-50/60"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-ocean-900">
            {city}
          </span>
          <span className="block truncate text-xs text-ocean-600">{country}</span>
        </span>
        <span className="shrink-0 rounded-md bg-ocean-50 px-2 py-1 font-mono text-[0.7rem] font-semibold text-ocean-700 group-hover:bg-white">
          {destination.iata}
        </span>
      </Link>
    );
  }

  return (
    <article className={CARD}>
      <Link href={`/${locale}/flights/${destination.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[3/2] w-full">
          <SceneCover
            theme={destination.scene}
            alt={city}
            className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/80">
                {hubAirport.city[locale]} →
              </p>
              <h3 className="text-xl font-bold text-white drop-shadow-sm">
                {city}
              </h3>
            </div>
            <span className="rounded-md bg-white/90 px-2 py-1 font-mono text-[0.7rem] font-semibold text-ocean-800">
              {destination.iata}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 p-4">
          <span className="text-sm text-ocean-700">{country}</span>
          <span className="text-sm font-semibold text-sunset-600 group-hover:underline">
            {dict.flights.askPrice}
          </span>
        </div>
      </Link>
    </article>
  );
}

/**
 * Poster-style tile for the "most requested" strip: the whole card is one link
 * into the enquiry form, prefilled with the package the visitor tapped.
 */
export function OfferTile({
  offer,
  locale,
  dict,
}: {
  offer: Offer;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Link
      href={`/${locale}/contact?subject=package&ref=${offer.slug}`}
      className="group relative isolate block aspect-[4/5] overflow-hidden rounded-2xl shadow-card ring-1 ring-ocean-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-600"
    >
      <SceneCover
        theme={offer.scene}
        image={offer.image}
        alt={offer.title[locale]}
        scrim="top"
        className="h-full w-full transition duration-500 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-x-0 top-0 p-4 sm:p-5">
        <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm">
          {offer.title[locale]}
        </h3>
        {offer.nights && (
          <p className="mt-1 text-sm text-white/85">
            {offer.nights} {dict.common.nights}
          </p>
        )}
      </div>
    </Link>
  );
}

export function OfferCard({
  offer,
  locale,
  dict,
}: {
  offer: Offer;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <article className={cx(CARD, "hover:translate-y-0")}>
      <div className="relative aspect-[16/9] w-full">
        <SceneCover theme={offer.scene} alt={offer.title[locale]} className="h-full w-full" />
        {offer.nights && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ocean-800">
            {offer.nights} {dict.common.nights}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-bold text-ocean-950">
          {offer.title[locale]}
        </h3>
        <p className="text-sm leading-relaxed text-ocean-700">
          {offer.summary[locale]}
        </p>
        <ul className="mt-1 space-y-1.5">
          {offer.includes.map((item) => (
            <li
              key={item.en}
              className="flex items-start gap-2 text-sm text-ocean-700"
            >
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 fill-sunset-500"
              >
                <path d="M8.2 13.4 4.9 10l-1.2 1.2 4.5 4.5 9-9-1.2-1.2z" />
              </svg>
              {item[locale]}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between border-t border-ocean-50 pt-3.5">
          <PriceLine
            value={offer.priceFrom}
            locale={locale}
            from={dict.common.from}
            suffix={dict.common.perPerson}
            fallback={dict.flights.askPrice}
          />
          <Link
            href={`/${locale}/contact?subject=package&ref=${offer.slug}`}
            className="text-sm font-semibold text-sunset-600 hover:underline"
          >
            {dict.common.bookNow}
          </Link>
        </div>
      </div>
    </article>
  );
}
