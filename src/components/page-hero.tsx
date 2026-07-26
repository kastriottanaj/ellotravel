import type { ReactNode } from "react";
import { Scene } from "@/components/scene";
import type { SceneTheme } from "@/data/types";

export function PageHero({
  kicker,
  title,
  description,
  theme = "coast",
  children,
}: {
  kicker?: string;
  title: string;
  description?: string;
  theme?: SceneTheme;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Scene theme={theme} rounded={false} />
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-950/85 via-ocean-900/70 to-ocean-800/55" />
      </div>
      <div className="container-page py-14 lg:py-20">
        <div className="max-w-2xl">
          {kicker && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-200">
              {kicker}
            </p>
          )}
          <h1 className="mt-2.5 font-display text-3xl font-semibold tracking-tight text-white text-balance sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-ocean-100 text-pretty sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>
    </section>
  );
}
