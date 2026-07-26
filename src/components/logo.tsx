import Image from "next/image";
import { cx } from "@/lib/format";

export function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/ello-travel-logo.png"
      alt="Ello Travel"
      width={351}
      height={288}
      priority={priority}
      className={cx("h-auto w-20", className)}
    />
  );
}
