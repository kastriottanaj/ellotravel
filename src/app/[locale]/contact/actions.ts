"use server";

import {
  deliverInquiry,
  validateInquiry,
  INQUIRY_SUBJECTS,
  type Inquiry,
  type InquiryField,
  type InquirySubject,
} from "@/lib/inquiry";

export type InquiryState = {
  status: "idle" | "success" | "error";
  /** Field names only — the client renders the translated message. */
  errors: InquiryField[];
};

export const initialInquiryState: InquiryState = { status: "idle", errors: [] };

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function count(formData: FormData, key: string, fallback: number) {
  const parsed = Number.parseInt(text(formData, key), 10);
  return Number.isFinite(parsed) && parsed >= 0 && parsed < 100 ? parsed : fallback;
}

export async function submitInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: hidden from users, irresistible to bots. Pretend it worked.
  if (text(formData, "company")) return { status: "success", errors: [] };

  const rawSubject = text(formData, "subject") as InquirySubject;
  const inquiry: Inquiry = {
    name: text(formData, "name"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    subject: INQUIRY_SUBJECTS.includes(rawSubject) ? rawSubject : "other",
    destination: text(formData, "destination"),
    departDate: text(formData, "departDate"),
    returnDate: text(formData, "returnDate"),
    adults: count(formData, "adults", 1),
    children: count(formData, "children", 0),
    message: text(formData, "message").slice(0, 4000),
    reference: text(formData, "reference"),
    locale: text(formData, "locale") || "sq",
  };

  const errors = validateInquiry(inquiry, formData.get("consent") === "on");
  const fields = Object.keys(errors) as InquiryField[];
  if (fields.length > 0) return { status: "error", errors: fields };

  try {
    await deliverInquiry(inquiry);
    return { status: "success", errors: [] };
  } catch (error) {
    console.error("[inquiry] delivery failed", error);
    return { status: "error", errors: [] };
  }
}
