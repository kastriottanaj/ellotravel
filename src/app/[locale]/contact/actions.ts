"use server";

import {
  deliverInquiry,
  emptyInquiryValues,
  validateInquiry,
  INQUIRY_SUBJECTS,
  type Inquiry,
  type InquiryField,
  type InquiryState,
  type InquirySubject,
  type InquiryValues,
} from "@/lib/inquiry";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function count(formData: FormData, key: string, fallback: number) {
  const parsed = Number.parseInt(text(formData, key), 10);
  return Number.isFinite(parsed) && parsed >= 0 && parsed < 100 ? parsed : fallback;
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
    adults: text(formData, "adults"),
    children: text(formData, "children"),
    message: inquiry.message,
    reference: inquiry.reference,
    consent,
  };
}

export async function submitInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: hidden from users, irresistible to bots. Pretend it worked.
  if (text(formData, "company")) {
    return { status: "success", errors: [], values: emptyInquiryValues };
  }

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
