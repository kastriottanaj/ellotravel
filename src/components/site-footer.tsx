import Link from "next/link";
import { Logo } from "@/components/logo";
import { site, telHref } from "@/data/site";
import { popularDestinations } from "@/data/destinations";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { buildNav } from "@/lib/nav";

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const nav = buildNav(locale, dict);
  const routes = popularDestinations(6);

  return (
    <footer className="mt-24 border-t border-ocean-100 bg-sand-50">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo className="w-28" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ocean-700">
            {dict.footer.tagline}
          </p>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ocean-800 hover:text-sunset-600"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
              <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.8.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.2.8-.4.3-.6.7-.8 1.2-.2.4-.3 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 12s0 2.1.07 3.4c.05 1.1.24 1.7.4 2.1.2.5.44.9.8 1.2.3.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.3.07 1.7.07 4.8.07s3.5 0 4.8-.07c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.2-.8.4-.3.6-.7.8-1.2.2-.4.3-1 .4-2.1.07-1.3.07-1.7.07-3.4s0-2.1-.07-3.4c-.05-1.1-.24-1.7-.4-2.1-.2-.5-.44-.9-.8-1.2-.3-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4C15.5 4 15.1 4 12 4Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 1.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Zm5.1-.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z" />
            </svg>
            {site.instagramHandle}
          </a>
        </div>

        <nav aria-label={dict.footer.quickLinks}>
          <h2 className="text-sm font-semibold text-ocean-950">
            {dict.footer.quickLinks}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ocean-700 hover:text-sunset-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.flights.popularRoutes}>
          <h2 className="text-sm font-semibold text-ocean-950">
            {dict.flights.popularRoutes}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {routes.map((destination) => (
              <li key={destination.slug}>
                <Link
                  href={`/${locale}/flights/${destination.slug}`}
                  className="text-ocean-700 hover:text-sunset-600"
                >
                  {dict.flights.routeTitle} – {destination.city[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-ocean-950">
            {dict.footer.contactUs}
          </h2>
          <address className="mt-4 space-y-2.5 text-sm not-italic text-ocean-700">
            <p>
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region}
            </p>
            {site.phones.map((phone, index) => (
              <p key={phone.e164}>
                <a href={telHref(index)} className="font-semibold text-ocean-900 hover:text-sunset-600">
                  {phone.display}
                </a>
              </p>
            ))}
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-sunset-600">
                {site.email}
              </a>
            </p>
            <p className="pt-1 text-ocean-600">{dict.contact.hoursValue}</p>
          </address>
        </div>
      </div>

      <div className="border-t border-ocean-100">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ocean-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
          </p>
          <p>{dict.footer.builtIn}</p>
        </div>
      </div>
    </footer>
  );
}
