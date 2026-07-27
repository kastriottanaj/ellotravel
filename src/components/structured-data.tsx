import { destinations } from "@/data/destinations";
import { site } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

/**
 * TravelAgency + LocalBusiness markup. This is what makes the agency eligible
 * for a Google business panel on searches like "agjenci udhëtimesh Klinë",
 * so the address, phone and opening hours must stay in sync with reality.
 */
export function AgencyJsonLd({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: `${site.url}/${locale}`,
    email: site.email,
    telephone: site.phones.map((phone) => phone.e164),
    description: dict.meta.homeDescription,
    // The OG image route lives under the locale segment; the bare path only
    // resolves via a proxy redirect, and lands on the crawler's language.
    image: `${site.url}/${locale}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    sameAs: [site.instagram],
    areaServed: destinations.map((destination) => ({
      "@type": "City",
      name: destination.city.en,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
