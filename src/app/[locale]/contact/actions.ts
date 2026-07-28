"use server";

import { headers } from "next/headers";
import { defaultLocale, isLocale } from "@/i18n/config";
import {
  deliverInquiry,
  emptyInquiryValues,
  validateInquiry,
  FIELD_LIMITS,
  INQUIRY_SUBJECTS,
  type Inquiry,
  type InquiryField,
  type InquiryState,
  type InquirySubject,
  type InquiryValues,
} from "@/lib/inquiry";
import { clientAddress, consumeRateLimit } from "@/lib/rate-limit";

/**
 * A server action is a public POST endpoint — the form in front of it is a
 * convenience, not a gate. Everything below assumes the payload was written by
 * a script that never rendered the page.
 */

/** Anything that would split a mail header, plus the rest of C0 and DEL. */
const CONTROL = /[\u0000-\u001f\u007f]/g;
/**
 * Same, but sparing U+000A — the paragraph breaks a message is meant to carry.
 * The range below swallows the carriage return along with everything else, so
 * a CRLF message arrives as the plain newlines `toHtml` knows how to render.
 */
const CONTROL_KEEPING_BREAKS = /[\u0000-\u0009\u000b-\u001f\u007f]/g;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DIGITS = /^\d{1,3}$/;

/**
 * One line of visitor text: no control characters, and never longer than the
 * field's limit. `name` reaches the mail *subject*, so a stray CR here would
 * be a header injection at the transport rather than a cosmetic problem.
 */
function line(formData: FormData, key: string, max: number) {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value.replace(CONTROL, " ").trim().slice(0, max);
}

/** The message box: paragraph breaks survive, everything else does not. */
function block(formData: FormData, key: string, max: number) {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_KEEPING_BREAKS, "").trim().slice(0, max);
}

/**
 * `<input type="date">` only ever posts `YYYY-MM-DD` or nothing; a value in
 * any other shape came from something that is not a browser, so it is dropped
 * rather than passed through to the enquiry email.
 */
function date(formData: FormData, key: string) {
  const value = line(formData, key, FIELD_LIMITS.date);
  return ISO_DATE.test(value) ? value : "";
}

function count(
  formData: FormData,
  key: string,
  { min, max, fallback }: { min: number; max: number; fallback: number },
) {
  const raw = line(formData, key, 3);
  // Strict, so "3 adults" is a cleared box rather than silently three.
  if (!DIGITS.test(raw)) return fallback;

  const parsed = Number(raw);
  return parsed >= min && parsed <= max ? parsed : fallback;
}

/**
 * Mirrors the submission back to the form. Matters most without JavaScript,
 * where a rejected submit would otherwise hand back an empty form and ask the
 * visitor to retype everything — usually just to tick the consent box.
 */
function echoValues(
  formData: FormData,
  inquiry: Inquiry,
  consent: boolean,
): InquiryValues {
  return {
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email,
    subject: inquiry.subject,
    destination: inquiry.destination,
    departDate: inquiry.departDate,
    returnDate: inquiry.returnDate,
    // Raw rather than the parsed fallback: a box the visitor cleared should
    // come back cleared, not silently repopulated with a number they removed.
    adults: line(formData, "adults", 3),
    children: line(formData, "children", 3),
    message: inquiry.message,
    reference: inquiry.reference,
    consent,
  };
}

/**
 * Five enquiries a quarter of an hour is far past what a family planning one
 * trip needs, and far below what makes flooding the agency's inbox — or their
 * Resend quota — worth a script's time.
 */
const RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

/**
 * Where nothing in front of the app identifies the caller, everyone shares one
 * bucket. That is the right way round: local development never approaches the
 * limit, and a deploy exposed without a proxy gets a site-wide cap rather than
 * an open relay.
 */
async function rateLimitKey() {
  const address = clientAddress(await headers());
  return `inquiry:${address ?? "unattributed"}`;
}

export async function submitInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: hidden from users, irresistible to bots. Pretend it worked.
  if (line(formData, "ello_note", 64)) {
    return { status: "success", errors: [], values: emptyInquiryValues };
  }

  const rawSubject = line(
    formData,
    "subject",
    FIELD_LIMITS.subject,
  ) as InquirySubject;
  const rawLocale = line(formData, "locale", FIELD_LIMITS.locale);

  const inquiry: Inquiry = {
    name: line(formData, "name", FIELD_LIMITS.name),
    phone: line(formData, "phone", FIELD_LIMITS.phone),
    email: line(formData, "email", FIELD_LIMITS.email),
    subject: INQUIRY_SUBJECTS.includes(rawSubject) ? rawSubject : "other",
    destination: line(formData, "destination", FIELD_LIMITS.destination),
    departDate: date(formData, "departDate"),
    returnDate: date(formData, "returnDate"),
    adults: count(formData, "adults", { min: 1, max: 20, fallback: 2 }),
    children: count(formData, "children", { min: 0, max: 20, fallback: 0 }),
    message: block(formData, "message", FIELD_LIMITS.message),
    reference: line(formData, "reference", FIELD_LIMITS.reference),
    locale: isLocale(rawLocale) ? rawLocale : defaultLocale,
  };

  const consent = formData.get("consent") === "on";
  const errors = validateInquiry(inquiry, consent);
  const fields = Object.keys(errors) as InquiryField[];
  if (fields.length > 0) {
    return {
      status: "error",
      errors: fields,
      values: echoValues(formData, inquiry, consent),
    };
  }

  // Counted here rather than at the top of the action: a visitor correcting a
  // rejected form should never be throttled for it, and a submission that
  // fails validation costs nothing worth protecting.
  const { allowed } = consumeRateLimit(await rateLimitKey(), RATE_LIMIT);
  if (!allowed) {
    return {
      status: "throttled",
      errors: [],
      values: echoValues(formData, inquiry, consent),
    };
  }

  try {
    await deliverInquiry(inquiry);
    return { status: "success", errors: [], values: emptyInquiryValues };
  } catch (error) {
    console.error("[inquiry] delivery failed", error);
    return {
      status: "error",
      errors: [],
      values: echoValues(formData, inquiry, consent),
    };
  }
}
