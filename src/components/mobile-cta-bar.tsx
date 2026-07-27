import { IconArrowRight, IconPhone } from "@/components/icons";
import { ButtonLink, buttonClass } from "@/components/ui";
import { site, telHref } from "@/data/site";
import type { Locale } from "@/i18n/config";

/**
 * Sticky call / book bar for phones and tablets. The header CTA scrolls away
 * within the hero, and most of this agency's enquiries start with a phone
 * call, so both routes stay one thumb-tap away for the whole page.
 */
export function MobileCtaBar({
  locale,
  bookLabel,
  callLabel,
}: {
  locale: Locale;
  bookLabel: string;
  callLabel: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ocean-100 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden print:hidden">
      <div className="flex items-center gap-2.5">
        <a
          href={telHref()}
          aria-label={`${callLabel} ${site.phones[0].display}`}
          className={buttonClass("secondary", "md", "flex-1 whitespace-nowrap")}
        >
          <IconPhone className="h-4 w-4" />
          {site.phones[0].display}
        </a>
        <ButtonLink href={`/${locale}/contact`} className="flex-1 whitespace-nowrap">
          {bookLabel}
          <IconArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
