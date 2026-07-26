import sq from "./dictionaries/sq";

/**
 * Widens the literal, readonly shape of the Albanian source dictionary into a
 * plain string shape. Translations are checked against this, so a missing or
 * misspelled key in de.ts / en.ts is a compile error rather than a blank string
 * on the live site.
 */
type Widen<T> = {
  -readonly [K in keyof T]: T[K] extends string ? string : Widen<T[K]>;
};

export type Dictionary = Widen<typeof sq>;
