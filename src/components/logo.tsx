import { cx } from "@/lib/format";

/**
 * Interim wordmark built from the brand's elements — an orange heart with a
 * blue aircraft. Replace with the agency's own artwork by dropping an SVG at
 * /public/logo.svg and swapping the mark below for an <img>.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Ello Travel"
      className={cx("h-full w-full", className)}
    >
      <path
        d="M24 42C24 42 6 31.5 6 19.8 6 13.3 10.9 9 16.4 9c3.3 0 6.1 1.7 7.6 4.2C25.5 10.7 28.3 9 31.6 9 37.1 9 42 13.3 42 19.8 42 31.5 24 42 24 42Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
        className="text-sunset-500"
      />
      <path
        d="M36.8 19.3 12.4 26.9c-.7.2-1.4-.2-1.6-.9-.1-.5.1-1 .5-1.3l3.6-2.3 4.6 1 4.1-2.6-8.6-5.4c-.5-.3-.7-.9-.5-1.4.2-.4.6-.7 1.1-.7l3.4-.1 10.2 4 5.4-2c1.3-.5 2.7-.1 3.2 1 .5 1.1-.2 2.4-1 2.7Z"
        className="fill-ocean-700"
      />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cx("flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9 shrink-0" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl font-semibold tracking-tight text-ocean-900">
            Ello Travel
          </span>
          <span className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-sunset-600">
            Klinë · Kosovë
          </span>
        </span>
      )}
    </span>
  );
}
