import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/page-hero";
import { site, telHref, whatsappHref } from "@/data/site";
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
    title: dict.meta.contactTitle,
    description: dict.meta.contactDescription,
    alternates: alternatesFor(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

  const details = [
    {
      label: dict.contact.address,
      value: `${site.address.street}, ${site.address.city}, ${site.address.region}`,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${site.address.street}, ${site.address.city}, Kosovo`,
      )}`,
      external: true,
    },
    {
      label: dict.contact.phone,
      value: site.phones.map((phone) => phone.display).join(" · "),
      href: telHref(),
      external: false,
    },
    {
      label: dict.contact.email,
      value: site.email,
      href: `mailto:${site.email}`,
      external: false,
    },
    {
      label: dict.contact.hours,
      value: dict.contact.hoursValue,
      href: null,
      external: false,
    },
  ];

  return (
    <>
      <PageHero
        kicker={dict.nav.contact}
        title={dict.contact.title}
        description={dict.contact.subtitle}
        theme="coast"
      />

      <div className="container-page grid gap-10 py-14 lg:grid-cols-5 lg:py-16">
        <div className="lg:col-span-3">
          <InquiryForm locale={locale} dict={dict} />
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl bg-sand-50 p-6 ring-1 ring-sand-200 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ocean-950">
              {site.name}
            </h2>
            <dl className="mt-6 space-y-5">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ocean-600">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-sm text-ocean-900">
                    {detail.href ? (
                      <a
                        href={detail.href}
                        {...(detail.external
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : {})}
                        className="font-medium hover:text-sunset-600"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <hr className="my-6 border-sand-200" />

            <div className="flex flex-col gap-2.5">
              <a
                href={whatsappHref(dict.form.title)}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
              >
                {dict.common.whatsapp}
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ocean-200 bg-white px-5 py-2.5 text-sm font-semibold text-ocean-800 transition hover:border-ocean-300 hover:bg-ocean-50"
              >
                {dict.contact.followUs} · {site.instagramHandle}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
