import Link from "next/link";
import { buttonClass } from "@/components/ui";
import { getDictionary } from "@/i18n";
import { defaultLocale } from "@/i18n/config";

/**
 * not-found.tsx cannot read route params, so this renders in the default
 * language. Every in-app 404 the visitor can reach still keeps the header and
 * footer of the locale they were browsing.
 */
export default function LocaleNotFound() {
  const dict = getDictionary(defaultLocale);

  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-bold text-ocean-200">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ocean-950">
        {dict.notFound.title}
      </h1>
      <span
        aria-hidden="true"
        className="mt-4 block h-1 w-14 rounded-full bg-sunset-500"
      />
      <p className="mt-3 max-w-md text-base text-ocean-700 text-pretty">
        {dict.notFound.body}
      </p>
      <Link href={`/${defaultLocale}`} className={buttonClass("primary", "lg", "mt-8")}>
        {dict.notFound.cta}
      </Link>
    </div>
  );
}
