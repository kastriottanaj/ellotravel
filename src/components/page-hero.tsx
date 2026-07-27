import Image from "next/image";
import type { ReactNode } from "react";
import { Scene } from "@/components/scene";
import type { SceneTheme } from "@/data/types";

/**
 * Hero band for every page below the home page, in the same language as the
 * home page hero: pill kicker, bold sans headline, navy scrim raked from the
 * left so the copy stays legible whether the backdrop is a photograph or the
 * generated artwork.
 */
export function PageHero({
  kicker,
  title,
  description,
  theme = "coast",
  image,
  imageAlt,
  breadcrumb,
  actions,
  children,
}: {
  kicker?: string;
  title: string;
  description?: string;
  theme?: SceneTheme;
  /** Photograph under /public. Falls back to the generated scene. */
  image?: string;
  imageAlt?: string;
  /** Sits above the headline — used by the flight route pages. */
  breadcrumb?: ReactNode;
  /** Call-to-action row under the copy. */
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ocean-950">
      <div className="absolute inset-0 -z-10">
        <Scene theme={theme} rounded={false} />
        {image && (
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            preload
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-950 via-ocean-950/85 to-ocean-950/40 lg:to-ocean-950/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-transparent to-ocean-950/40" />
      </div>

      <div className="container-page py-14 lg:py-20">
        {breadcrumb}
        <div className="max-w-2xl animate-fade-up">
          {kicker && (
            <p className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white ring-1 ring-white/20 backdrop-blur-sm">
              {kicker}
            </p>
          )}
          <h1 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-white text-balance sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-base leading-relaxed text-ocean-100 text-pretty sm:text-lg">
              {description}
            </p>
          )}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
