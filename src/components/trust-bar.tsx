import {
  GoogleMark,
  IconMedal,
  IconShieldCheck,
  IconUsers,
} from "@/components/icons";
import { Stars } from "@/components/ui";
import { googleReviews } from "@/data/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cx, fill, formatRating } from "@/lib/format";

/**
 * Rating and reassurance strip. It sits directly under the hero on the pages
 * where an enquiry is decided, which is the moment a visitor is weighing up
 * whether an agency they found through search is worth phoning.
 *
 * `overlap` pulls it up over the hero edge, as on the home page; without it the
 * bar flows as a normal band, which reads better mid-page.
 */
export function TrustBar({
  locale,
  dict,
  overlap = false,
}: {
  locale: Locale;
  dict: Dictionary;
  overlap?: boolean;
}) {
  const badges = [
    {
      icon: IconMedal,
      label: dict.home.badgeLicensed,
      tone: "bg-sunset-50 text-sunset-600",
    },
    {
      icon: IconUsers,
      label: dict.home.badgeClients,
      tone: "bg-ocean-50 text-ocean-600",
    },
    {
      icon: IconShieldCheck,
      label: dict.home.badgeTransparent,
      tone: "bg-ocean-50 text-ocean-800",
    },
  ];
  const rating = `${formatRating(googleReviews.rating, locale)}/5`;

  return (
    <section
      className={cx("container-page relative z-10", overlap && "-mt-9")}
      aria-label={fill(dict.home.reviewsLabel, { count: googleReviews.count })}
    >
      <div className="grid gap-5 rounded-2xl bg-white p-5 shadow-lift ring-1 ring-ocean-100 sm:grid-cols-2 sm:p-6 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-ocean-100">
        <div className="flex items-center gap-3 lg:pr-6">
          <GoogleMark className="h-8 w-8 shrink-0" />
          <div className="min-w-0">
            <p className="flex items-center gap-2">
              <Stars count={5} label={rating} size="md" />
              <span className="text-sm font-bold text-ocean-950">{rating}</span>
            </p>
            <p className="mt-0.5 text-xs text-ocean-600">
              {fill(dict.home.reviewsLabel, { count: googleReviews.count })}
            </p>
          </div>
        </div>

        {badges.map(({ icon: Icon, label, tone }) => (
          <div key={label} className="flex items-center gap-3 lg:px-6 lg:last:pr-0">
            <span
              className={cx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                tone,
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold leading-snug text-ocean-900 text-pretty">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
