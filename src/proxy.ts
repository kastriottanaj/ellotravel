import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

const LOCALE_COOKIE = "ello_locale";

/**
 * Picks a locale from the browser's Accept-Language header. Deliberately
 * coarse: we only care about the primary subtag, so "de-AT" and "de-CH" both
 * land on German — which matters here, since a large share of visitors are
 * diaspora browsing with Swiss or Austrian locales.
 */
function localeFromHeader(header: string | null) {
  if (!header) return null;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        tag: tag.trim().toLowerCase(),
        quality: q ? Number.parseFloat(q.split("=")[1]) || 0 : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    const match = locales.find((l) => l === primary);
    if (match) return match;
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    (cookieLocale && locales.find((l) => l === cookieLocale)) ||
    localeFromHeader(request.headers.get("accept-language")) ||
    defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  // Which language this redirect picks depends on the header and the cookie
  // read above. A 307 is not cacheable by default, but a CDN told to cache
  // redirects would otherwise pin one visitor's language for everyone.
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  // Everything except Next internals, the API, and files with an extension
  // (favicon.ico, og images, /images/*.svg …).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
