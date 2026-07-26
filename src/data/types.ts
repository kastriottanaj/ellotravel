import type { Locale } from "@/i18n/config";

/** A piece of content that exists in every language the site serves. */
export type LocalizedText = Record<Locale, string>;

/**
 * Visual theme for a card. The site ships without photography, so each card
 * renders a generated gradient scene instead of a broken <img>. Replace a
 * card's `image` with a real photo path when the agency supplies one.
 */
export type SceneTheme =
  | "coast"
  | "sunset"
  | "city"
  | "alpine"
  | "nordic"
  | "metropolis"
  | "riviera";
