import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/format";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-600 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS = {
  primary:
    "bg-sunset-500 text-white shadow-sm hover:bg-sunset-600 active:bg-sunset-700",
  secondary:
    "bg-ocean-800 text-white shadow-sm hover:bg-ocean-900 active:bg-ocean-950",
  outline:
    "border border-ocean-200 bg-white text-ocean-800 hover:border-ocean-300 hover:bg-ocean-50",
  ghost: "text-ocean-700 hover:bg-ocean-50",
  onDark:
    "bg-white/95 text-ocean-900 backdrop-blur hover:bg-white",
} as const;

const SIZES = {
  sm: "px-4 py-2 text-[0.8rem]",
  md: "px-5 py-2.5",
  lg: "px-7 py-3.5 text-base",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cx(BUTTON_BASE, VARIANTS[variant], SIZES[size], className);
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  action,
}: {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center",
      )}
    >
      <div className={cx("max-w-2xl", align === "center" && "text-center")}>
        {kicker && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sunset-600">
            {kicker}
          </p>
        )}
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ocean-950 text-balance sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-base leading-relaxed text-ocean-700 text-pretty">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const STAR_SIZES = { sm: "h-3.5 w-3.5", md: "h-[1.05rem] w-[1.05rem]" } as const;

export function Stars({
  count,
  label,
  className,
  size = "sm",
}: {
  count: number;
  label: string;
  className?: string;
  size?: keyof typeof STAR_SIZES;
}) {
  return (
    <span className={cx("inline-flex items-center gap-0.5", className)} title={label}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={cx("fill-sunset-400", STAR_SIZES[size])}
        >
          <path d="M10 1.6l2.47 5.2 5.53.78-4 4.03.95 5.79L10 14.66 5.05 17.4l.95-5.79-4-4.03 5.53-.78L10 1.6Z" />
        </svg>
      ))}
    </span>
  );
}

export function Badge({
  children,
  tone = "ocean",
}: {
  children: ReactNode;
  tone?: "ocean" | "sunset" | "muted";
}) {
  const tones = {
    ocean: "bg-ocean-50 text-ocean-700 ring-ocean-100",
    sunset: "bg-sunset-50 text-sunset-700 ring-sunset-100",
    muted: "bg-sand-100 text-ocean-700 ring-sand-200",
  } as const;

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
