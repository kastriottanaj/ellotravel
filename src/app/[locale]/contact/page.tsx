import type { Metadata } from "next";
import { IconClock, IconMail, IconPhone, IconPin } from "@/components/icons";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/page-hero";
import { TrustBar } from "@/components/trust-bar";
import { ButtonLink } from "@/components/ui";
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
      icon: IconPin,
      label: dict.contact.address,
      value: `${site.address.street}, ${site.address.city}, ${site.address.region}`,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${site.address.street}, ${site.address.city}, Kosovo`,
      )}`,
      external: true,
    },
    {
      icon: IconPhone,
      label: dict.contact.phone,
      value: site.phones.map((phone) => phone.display).join(" · "),
      href: telHref(),
      external: false,
    },
    {
      icon: IconMail,
      label: dict.contact.email,
      value: site.email,
      href: `mailto:${site.email}`,
      external: false,
    },
    {
      icon: IconClock,
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
        actions={
          <>
            <ButtonLink href={telHref()} size="lg">
              <IconPhone className="h-4 w-4" />
              {site.phones[0].display}
            </ButtonLink>
            <ButtonLink
              href={whatsappHref(dict.form.title)}
              variant="onDark"
              size="lg"
              target="_blank"
              rel="noreferrer noopener"
            >
              {dict.common.whatsapp}
            </ButtonLink>
          </>
        }
      />

      <TrustBar locale={locale} dict={dict} overlap />

      <div className="container-page grid gap-10 py-14 lg:grid-cols-5 lg:py-16">
        <div className="lg:col-span-3">
          <InquiryForm locale={locale} dict={dict} />
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl bg-sand-50 p-6 ring-1 ring-sand-200 sm:p-8">
            <h2 className="text-xl font-bold text-ocean-950">{site.name}</h2>
            <span
              aria-hidden="true"
              className="mt-3 block h-1 w-14 rounded-full bg-sunset-500"
            />
            <dl className="mt-6 space-y-5">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ocean-600">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ocean-600 ring-1 ring-ocean-100">
                      <detail.icon className="h-4 w-4" />
                    </span>
                    {detail.label}
                  </dt>
                  {/* Indented past the icon so label and value line up. */}
                  <dd className="mt-1.5 pl-[2.625rem] text-sm text-ocean-900">
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
