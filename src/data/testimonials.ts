import type { LocalizedText } from "./types";

/**
 * ⚠️ Wording taken from the home page mockup — confirm each quote against the
 * real Google review before launch, and only publish a name the customer has
 * agreed to. `avatar` is optional: without a photo the card shows initials.
 */

export type Testimonial = {
  id: string;
  /** Shown as written, so keep the "First L." form the reviews use. */
  name: string;
  city: LocalizedText;
  rating: number;
  avatar?: string;
  quote: LocalizedText;
};

export const testimonials: Testimonial[] = [
  {
    id: "arlinda-h",
    name: "Arlinda H.",
    city: { sq: "Prishtinë", de: "Pristina", en: "Pristina" },
    rating: 5,
    quote: {
      sq: "Ello Travel na organizoi pushimet perfekte në Turqi. Çmimet shumë të mira dhe shërbim i shkëlqyer!",
      de: "Ello Travel hat unseren perfekten Urlaub in der Türkei organisiert. Sehr gute Preise und ein ausgezeichneter Service!",
      en: "Ello Travel organised the perfect holiday in Türkiye for us. Great prices and excellent service!",
    },
  },
  {
    id: "besnik-k",
    name: "Besnik K.",
    city: { sq: "Pejë", de: "Peja", en: "Peja" },
    rating: 5,
    quote: {
      sq: "Bileta të sigurta, informata të sakta dhe ndihmë në çdo hap të udhëtimit. Faleminderit!",
      de: "Sichere Tickets, verlässliche Auskünfte und Hilfe bei jedem Schritt der Reise. Vielen Dank!",
      en: "Secure tickets, accurate information and help at every step of the trip. Thank you!",
    },
  },
];

/** "Arlinda H." → "AH", for the avatar fallback. */
export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
