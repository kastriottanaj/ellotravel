import type { Dictionary } from "@/i18n/types";

/** Path segments stay language-neutral; only the labels are translated. */
export const navItems = [
  { path: "/hotels", key: "hotels" },
  { path: "/flights", key: "flights" },
  { path: "/offers", key: "offers" },
  { path: "/about", key: "about" },
  { path: "/contact", key: "contact" },
] as const;

export type NavItem = { href: string; label: string };

export function buildNav(locale: string, dict: Dictionary): NavItem[] {
  return navItems.map((item) => ({
    href: `/${locale}${item.path}`,
    label: dict.nav[item.key],
  }));
}
