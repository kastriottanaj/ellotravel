import { site } from "@/data/site";

export const INQUIRY_SUBJECTS = ["flight", "hotel", "package", "other"] as const;
export type InquirySubject = (typeof INQUIRY_SUBJECTS)[number];

/**
 * How much of each field is kept. The action truncates to these before the
 * value reaches validation, the enquiry email or the echoed form — a server
 * action accepts up to 1MB per request, and none of it should end up in a
 * mail header or an inbox on the strength of the form's own `maxlength`.
 *
 * Generous rather than tight: a long Albanian name and a Swiss address both
 * fit comfortably, and the point is to have a ceiling at all.
 */
export const FIELD_LIMITS = {
  name: 120,
  phone: 40,
  /** The longest address RFC 5321 permits. */
  email: 254,
  subject: 16,
  destination: 160,
  /** YYYY-MM-DD. */
  date: 10,
  reference: 64,
  message: 4000,
  locale: 8,
} as const;

export type InquiryField =
  | "name"
  | "phone"
  | "email"
  | "consent";

/**
 * Everything the visitor typed, echoed back by the action so a rejected
 * submit re-renders a filled form. Without JavaScript the browser posts and
 * replaces the whole page, so nothing survives in the DOM — this state is the
 * only route the answers have back. Strings and one boolean, to stay
 * serialisable across the action boundary.
 */
export type InquiryValues = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  destination: string;
  departDate: string;
  returnDate: string;
  adults: string;
  children: string;
  message: string;
  reference: string;
  consent: boolean;
};

/** Doubles as the form's field defaults, via the initial state below. */
export const emptyInquiryValues: InquiryValues = {
  name: "",
  phone: "",
  email: "",
  subject: "flight",
  destination: "",
  departDate: "",
  returnDate: "",
  adults: "2",
  children: "0",
  message: "",
  reference: "",
  consent: false,
};

export type InquiryState = {
  /**
   * `throttled` is separated from `error` on purpose: nothing is wrong with
   * what the visitor typed, and the form says so rather than implying they
   * should try again immediately.
   */
  status: "idle" | "success" | "error" | "throttled";
  /** Field names only — the client renders the translated message. */
  errors: InquiryField[];
  values: InquiryValues;
};

/**
 * Lives here rather than beside the server action: a "use server" module may
 * only export async functions, so exporting this object from there silently
 * yields `undefined` on the client and crashes the first render.
 */
export const initialInquiryState: InquiryState = {
  status: "idle",
  errors: [],
  values: emptyInquiryValues,
};

export type Inquiry = {
  name: string;
  phone: string;
  email: string;
  subject: InquirySubject;
  destination: string;
  departDate: string;
  returnDate: string;
  adults: number;
  children: number;
  message: string;
  reference: string;
  locale: string;
};

/**
 * Kosovar and diaspora numbers arrive in many shapes: 044 123 456,
 * +383 44 123 456, 0049 170…. Accept anything that is plausibly a phone
 * number and let a human sort out the rest — a strict regex here costs
 * real enquiries.
 */
const PHONE = /^[+()\d][\d\s()./-]{6,24}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateInquiry(inquiry: Inquiry, consent: boolean) {
  const errors: Partial<Record<InquiryField, true>> = {};

  if (inquiry.name.trim().length < 2) errors.name = true;
  if (!PHONE.test(inquiry.phone.trim())) errors.phone = true;
  if (inquiry.email.trim() && !EMAIL.test(inquiry.email.trim())) errors.email = true;
  if (!consent) errors.consent = true;

  return errors;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * The one string here that becomes a mail *header* rather than body text.
 *
 * The action already strips control characters and caps every field, so this
 * is belt and braces — but it is the last place the value is ours before a
 * transport turns it into `Subject:`, and a CR reaching that point is a header
 * injection rather than a stray character.
 */
function mailSubject(inquiry: Inquiry) {
  return `Kërkesë e re: ${inquiry.subject} — ${inquiry.name}`
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .slice(0, 200)
    .trim();
}

function toHtml(inquiry: Inquiry) {
  const rows: Array<[string, string]> = [
    ["Emri", inquiry.name],
    ["Telefoni", inquiry.phone],
    ["Email", inquiry.email || "—"],
    ["Lloji", inquiry.subject],
    ["Destinacioni", inquiry.destination || "—"],
    ["Nisja", inquiry.departDate || "—"],
    ["Kthimi", inquiry.returnDate || "—"],
    ["Udhëtarët", `${inquiry.adults} + ${inquiry.children}`],
    ["Referenca", inquiry.reference || "—"],
    ["Gjuha", inquiry.locale],
  ];

  return `
    <h2>Kërkesë e re nga ${escapeHtml(site.domain)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="background:#f7f1e8"><strong>${label}</strong></td><td>${escapeHtml(String(value))}</td></tr>`,
        )
        .join("")}
    </table>
    <h3>Mesazhi</h3>
    <p>${escapeHtml(inquiry.message || "—").replace(/\n/g, "<br>")}</p>
  `;
}

/**
 * Sends the enquiry to the agency's inbox through Resend's REST API — called
 * with fetch rather than the SDK so the project stays dependency-free.
 *
 * With no RESEND_API_KEY configured nothing is sent. In development the
 * enquiry is logged in full so the form can be worked on without a mail
 * provider; in production only its shape is, because the visitor's details do
 * not belong in container logs. Either way the visitor sees the success
 * screen — the return value says whether it actually left the building.
 */
export async function deliverInquiry(inquiry: Inquiry): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL ?? site.email;
  const from = process.env.INQUIRY_FROM_EMAIL;

  if (!apiKey || !from) {
    // An enquiry is somebody's name, phone number and travel plans, and
    // container logs are read, shipped and kept far more casually than an
    // inbox. Off a developer's machine, only the shape of it is recorded.
    if (process.env.NODE_ENV === "production") {
      console.warn("[inquiry] no mail provider configured — enquiry dropped", {
        subject: inquiry.subject,
        locale: inquiry.locale,
        reference: inquiry.reference || null,
      });
    } else {
      console.info("[inquiry] no mail provider configured — logging instead", {
        ...inquiry,
        message: inquiry.message.slice(0, 200),
      });
    }
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.email || undefined,
      subject: mailSubject(inquiry),
      html: toHtml(inquiry),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Resend rejected the enquiry (${response.status}): ${await response.text()}`,
    );
  }

  return true;
}
