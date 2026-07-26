import type { Metadata } from "next";
import { OfferCard } from "@/components/cards";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui";
import { offers } from "@/data/offers";
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
    title: dict.meta.offersTitle,
    description: dict.meta.offersDescription,
    alternates: alternatesFor(locale, "/offers"),
  };
}

export default async function OffersPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        kicker={dict.nav.offers}
        title={dict.offers.title}
        description={dict.offers.subtitle}
        theme="sunset"
      />

      <div className="container-page py-16">
        {offers.length === 0 ? (
          <p className="text-ocean-700">{dict.offers.empty}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} locale={locale} dict={dict} />
            ))}
          </div>
        )}

        <div className="mt-14 rounded-2xl bg-sand-50 p-8 text-center ring-1 ring-sand-200 sm:p-12">
          <h2 className="font-display text-2xl font-semibold text-ocean-950 text-balance sm:text-3xl">
            {dict.home.ctaTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ocean-700 text-pretty">
            {dict.home.ctaBody}
          </p>
          <div className="mt-7">
            <ButtonLink href={`/${locale}/contact?subject=package`} size="lg">
              {dict.common.bookNow}
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
