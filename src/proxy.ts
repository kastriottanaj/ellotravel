import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";
import {
  acceptedLocale,
  countryFromHeaders,
  countryHeaders,
  localeFromCountry,
  parseAcceptLanguage,
  preferredLocale,
  regionFromRanges,
} from "@/i18n/detect";

const LOCALE_COOKIE = "ello_locale";

/**
 * Picks the language for a request that arrived without one in the path.
 *
 * The order is deliberate, and it is not location-first. Much of this audience
 * is Albanian diaspora in Zurich or Stuttgart: a phone set to Albanian states a
 * preference more clearly than a Swiss IP address does, so the browser's own
 * first choice wins whenever we publish that language.
 *
 * Location decides the case the header cannot — a visitor whose top language we
 * do not speak. A Turkish phone in Prishtina lists English somewhere down its
 * Accept-Language and would settle for it; the country says Albanian instead.
 * Outside Kosovo, Albania and the German-speaking countries that lands on
 * English, which is the same answer arrived at honestly.
 */
function detectLocale(request: NextRequest) {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const chosen = cookie && locales.find((locale) => locale === cookie);
  if (chosen) return chosen;

  const ranges = parseAcceptLanguage(request.headers.get("accept-language"));
  const country =
    countryFromHeaders(request.headers) ?? regionFromRanges(ranges);

  return (
    preferredLocale(ranges) ??
    localeFromCountry(country) ??
    acceptedLocale(ranges) ??
    defaultLocale
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  // Which language this redirect picks depends on every header and cookie read
  // above. A 307 is not cacheable by default, but a CDN told to cache redirects
  // would otherwise pin one visitor's language for everyone.
  response.headers.set(
    "Vary",
    ["Accept-Language", "Cookie", ...countryHeaders].join(", "),
  );
  return response;
}

export const config = {
  // Everything except Next internals, the API, and files with an extension
  // (favicon.ico, og images, /images/*.svg …).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
