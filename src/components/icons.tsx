import type { SVGProps } from "react";
import { cx } from "@/lib/format";

/**
 * Inline icon set. Everything is one 24×24 outline system drawn with
 * `currentColor`, so an icon takes the text colour of whatever chip it sits in
 * — no icon package, no extra request, no runtime cost.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cx("h-6 w-6", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21c4-4.4 6-7.7 6-10a6 6 0 1 0-12 0c0 2.3 2 5.6 6 10Z" />
      <circle cx="12" cy="11" r="2.3" />
    </Icon>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.7 4H4.6A1.6 1.6 0 0 0 3 5.7C3 13.6 9.4 20 17.3 20a1.6 1.6 0 0 0 1.7-1.6v-3.1a.9.9 0 0 0-.7-.9l-3.1-.7a.9.9 0 0 0-.9.3l-1.2 1.4a12.6 12.6 0 0 1-5.5-5.5l1.4-1.2a.9.9 0 0 0 .3-.9l-.7-3.1a.9.9 0 0 0-.9-.7Z" />
    </Icon>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5.2" width="18" height="13.6" rx="2.4" />
      <path d="m4.2 7.4 6.9 5a1.5 1.5 0 0 0 1.8 0l6.9-5" />
    </Icon>
  );
}

export function IconUser(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
    </Icon>
  );
}

export function IconBriefcase(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="7.4" width="18" height="12.2" rx="2.4" />
      <path d="M9 7.4V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.4" />
      <path d="M3 12.4h18" />
    </Icon>
  );
}

export function IconHeadset(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.4 13.2v-1.4a7.6 7.6 0 0 1 15.2 0v1.4" />
      <rect x="2.6" y="12.6" width="4.4" height="6" rx="2.2" />
      <rect x="17" y="12.6" width="4.4" height="6" rx="2.2" />
      <path d="M19.8 18.6v.5a2.4 2.4 0 0 1-2.4 2.4H13" />
    </Icon>
  );
}

export function IconMedal(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="9" r="5.4" />
      <path d="m8.6 13.6-1.4 7.2 4.8-2.5 4.8 2.5-1.4-7.2" />
    </Icon>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9.2" cy="8.4" r="3.4" />
      <path d="M2.8 19.4a6.4 6.4 0 0 1 12.8 0" />
      <path d="M16.4 5.4a3.4 3.4 0 0 1 0 6.6" />
      <path d="M17.6 13.6a6.4 6.4 0 0 1 3.6 5.8" />
    </Icon>
  );
}

export function IconShieldCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21c4.6-1.8 6.9-5.4 6.9-10.6V6.2L12 3.1 5.1 6.2v4.2C5.1 15.6 7.4 19.2 12 21Z" />
      <path d="m9.1 11.6 2.2 2.2 4-4.2" />
    </Icon>
  );
}

export function IconPlane(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.6 14.4 14 12.2V7.5a2 2 0 0 0-4 0v4.7l-6.6 2.2v2l6.6-1.8v3l-2 1.4v1.5l4-1.1 4 1.1V19l-2-1.4v-3l6.6 1.8Z" />
    </Icon>
  );
}

export function IconTag(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11.7 3.4H5.6a2.2 2.2 0 0 0-2.2 2.2v6.1c0 .6.2 1.1.6 1.6l7.3 7.3a2.2 2.2 0 0 0 3.1 0l6.1-6.1a2.2 2.2 0 0 0 0-3.1l-7.3-7.3a2.2 2.2 0 0 0-1.5-.7Z" />
      <circle cx="8.4" cy="8.4" r="1.5" />
    </Icon>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.8 12h14.4m-5.7-5.7L19.2 12l-5.7 5.7" />
    </Icon>
  );
}

/**
 * Google's four-colour mark, used to attribute the review score on the trust
 * bar. Drawn at Google's own 48-unit grid, so it keeps the official
 * proportions — this is the only icon here that ignores `currentColor`.
 */
export function GoogleMark({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={cx("h-6 w-6", className)}
      {...props}
    >
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19Z"
      />
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.55 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
    </svg>
  );
}
