"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { IconPhone, IconPin } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { site, telHref } from "@/data/site";
import { cx } from "@/lib/format";
import type { NavItem } from "@/lib/nav";

const LOCALE_COOKIE = "ello_locale";

/** Back/forward moves the query without a re-render of its own. */
function subscribeToHistory(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function swapLocale(pathname: string, next: Locale, search: string) {
  const segments = pathname.split("/");
  // segments[0] is "" because pathname always starts with "/"
  segments[1] = next;
  return `${segments.join("/") || `/${next}`}${search}`;
}

function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  /**
   * Carry ?subject=…&ref=… through a language switch, so someone who picked a
   * hotel and then changed language still lands on a prefilled enquiry form.
   *
   * Read from `window` rather than `useSearchParams`, which would pull this
   * component — and with it every page, since the header sits in the layout —
   * out of the prerendered HTML. The server snapshot is empty, so prerendered
   * links carry no query and hydration stays quiet; the real value arrives
   * once mounted. `usePathname` above re-renders us on route changes, which
   * is when the snapshot is re-read.
   */
  const search = useSyncExternalStore(
    subscribeToHistory,
    () => window.location.search,
    () => "",
  );

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-ocean-50 p-0.5">
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={swapLocale(pathname, code, search)}
            hrefLang={code}
            aria-current={active ? "true" : undefined}
            // Remember the choice so the middleware stops guessing from headers.
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${code};path=/;max-age=31536000;samesite=lax`;
            }}
            className={cx(
              "rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition",
              active
                ? "bg-white text-ocean-900 shadow-sm"
                : "text-ocean-600 hover:text-ocean-900",
            )}
          >
            <span className="sr-only">{localeMeta[code].label}</span>
            <span aria-hidden="true">{code}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function SiteHeader({
  locale,
  nav,
  bookLabel,
  menuLabel,
  closeLabel,
}: {
  locale: Locale;
  nav: NavItem[];
  bookLabel: string;
  menuLabel: string;
  closeLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navigatedFrom, setNavigatedFrom] = useState(pathname);

  // Close the mobile panel on navigation, otherwise it covers the new page.
  // Adjusted during render rather than in an effect — React re-runs this
  // component before committing, so the panel never paints over the new route.
  if (pathname !== navigatedFrom) {
    setNavigatedFrom(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ocean-100 bg-white/85 backdrop-blur-md">
      <div className="hidden bg-ocean-900 text-white lg:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p className="flex items-center gap-1.5 text-ocean-100">
            <IconPin className="h-3.5 w-3.5 shrink-0" />
            {site.address.street}, {site.address.city}
          </p>
          <div className="flex items-center gap-5">
            <a className="hover:text-sunset-300" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            {site.phones.map((phone, index) => (
              <a
                key={phone.e164}
                className="flex items-center gap-1.5 font-semibold hover:text-sunset-300"
                href={telHref(index)}
              >
                <IconPhone className="h-3.5 w-3.5 shrink-0" />
                {phone.display}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href={`/${locale}`} className="shrink-0" aria-label="Ello Travel">
          <Logo preload className="w-[4.25rem] lg:w-[5.25rem]" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition",
                  active
                    ? "bg-ocean-50 text-ocean-900"
                    : "text-ocean-700 hover:bg-ocean-50 hover:text-ocean-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} />
          </div>
          <ButtonLink
            href={`/${locale}/contact`}
            size="sm"
            // `max-sm:hidden` rather than `hidden sm:inline-flex`: the button
            // base class already sets `inline-flex`, and between two plain
            // utilities the later one in Tailwind's sheet wins — which left the
            // button showing on phones. A variant always sorts after it.
            className="max-sm:hidden"
          >
            {bookLabel}
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? closeLabel : menuLabel}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ocean-800 hover:bg-ocean-50 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-ocean-100 bg-white lg:hidden"
        >
          <nav aria-label="Mobile" className="container-page flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-ocean-50 py-3 text-base font-medium text-ocean-800 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center justify-between gap-3">
              <LanguageSwitcher locale={locale} />
              <ButtonLink href={`/${locale}/contact`} size="sm">
                {bookLabel}
              </ButtonLink>
            </div>
            <div className="mt-4 flex flex-col gap-1 pb-2 text-sm">
              {site.phones.map((phone, index) => (
                <a
                  key={phone.e164}
                  href={telHref(index)}
                  className="font-semibold text-ocean-800"
                >
                  {phone.display}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
