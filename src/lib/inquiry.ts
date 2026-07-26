import { site } from "@/data/site";

export const INQUIRY_SUBJECTS = ["flight", "hotel", "package", "other"] as const;
export type InquirySubject = (typeof INQUIRY_SUBJECTS)[number];

export type InquiryField =
  | "name"
  | "phone"
  | "email"
  | "consent";

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
 * With no RESEND_API_KEY configured the enquiry is logged instead of dropped,
 * so local development and a not-yet-configured production deploy both behave
 * predictably. Returns whether it actually left the building.
 */
export async function deliverInquiry(inquiry: Inquiry): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL ?? site.email;
  const from = process.env.INQUIRY_FROM_EMAIL;

  if (!apiKey || !from) {
    console.info("[inquiry] no mail provider configured — logging instead", {
      ...inquiry,
      message: inquiry.message.slice(0, 200),
    });
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
      subject: `Kërkesë e re: ${inquiry.subject} — ${inquiry.name}`,
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
