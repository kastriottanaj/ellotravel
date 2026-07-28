import Image from "next/image";
import { cx } from "@/lib/format";

export function Logo({
  className,
  preload = false,
}: {
  className?: string;
  /** Next 16 deprecated `priority` in favour of this. */
  preload?: boolean;
}) {
  return (
    <Image
      src="/ello-travel-logo.png"
      alt="Ello Travel"
      width={351}
      height={288}
      preload={preload}
      className={cx("h-auto w-20", className)}
    />
  );
}
