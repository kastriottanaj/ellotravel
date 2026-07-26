"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui";
import { site, telHref } from "@/data/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cx } from "@/lib/format";
import { INQUIRY_SUBJECTS, type InquiryField } from "@/lib/inquiry";
import {
  initialInquiryState,
  submitInquiry,
  type InquiryState,
} from "@/app/[locale]/contact/actions";

const FIELD =
  "w-full rounded-xl border border-ocean-200 bg-white px-4 py-2.5 text-sm text-ocean-950 placeholder:text-ocean-400 focus:border-ocean-500 focus:outline-2 focus:outline-offset-0 focus:outline-ocean-500/30";

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-ocean-900"
      >
        {label}
        {required && <span className="ml-0.5 text-sunset-600">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function InquiryForm({
  locale,
  dict,
  presetSubject = "",
  reference = "",
}: {
  locale: Locale;
  dict: Dictionary;
  /**
   * Cards across the site link here with ?subject=hotel&ref=royal-g so the
   * visitor doesn't have to re-explain what they were looking at. These are
   * read on the server and passed down — reading them here with
   * useSearchParams would push the whole form out of the server-rendered
   * HTML, and with it the no-JavaScript fallback.
   */
  presetSubject?: string;
  reference?: string;
}) {
  const [state, formAction] = useActionState<InquiryState, FormData>(
    submitInquiry,
    initialInquiryState,
  );

  const defaultSubject = INQUIRY_SUBJECTS.includes(
    presetSubject as (typeof INQUIRY_SUBJECTS)[number],
  )
    ? presetSubject
    : "flight";

  const messages: Record<InquiryField, string> = {
    name: dict.form.errName,
    phone: dict.form.errPhone,
    email: dict.form.errEmail,
    consent: dict.form.errConsent,
  };
  const errorFor = (field: InquiryField) =>
    state.errors.includes(field) ? messages[field] : undefined;

  const subjectLabels: Record<string, string> = {
    flight: dict.form.subjectFlight,
    hotel: dict.form.subjectHotel,
    package: dict.form.subjectPackage,
    other: dict.form.subjectOther,
  };

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-ocean-100 bg-white p-8 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sunset-50">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-sunset-600">
            <path d="M9.6 16.2 5.4 12l-1.4 1.4 5.6 5.6L20.8 7.8l-1.4-1.4z" />
          </svg>
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ocean-950">
          {dict.form.successTitle}
        </h2>
        <p className="mx-auto mt-2.5 max-w-sm text-sm leading-relaxed text-ocean-700">
          {dict.form.successBody}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {site.phones.map((phone, index) => (
            <a
              key={phone.e164}
              href={telHref(index)}
              className="text-sm font-semibold text-ocean-900 hover:text-sunset-600"
            >
              {phone.display}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-2xl border border-ocean-100 bg-white p-6 shadow-card sm:p-8"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="reference" value={reference} />
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <h2 className="font-display text-xl font-semibold text-ocean-950">
        {dict.form.title}
      </h2>
      <p className="mt-1.5 text-sm text-ocean-700">{dict.form.subtitle}</p>

      {state.status === "error" && state.errors.length === 0 && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p className="font-semibold">{dict.form.errorTitle}</p>
          <p className="mt-1">{dict.form.errorBody}</p>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label={dict.form.name} htmlFor="name" required error={errorFor("name")}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={dict.form.namePlaceholder}
            aria-invalid={state.errors.includes("name")}
            aria-describedby={state.errors.includes("name") ? "name-error" : undefined}
            className={cx(FIELD, state.errors.includes("name") && "border-red-400")}
          />
        </Field>

        <Field label={dict.form.phone} htmlFor="phone" required error={errorFor("phone")}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder={dict.form.phonePlaceholder}
            aria-invalid={state.errors.includes("phone")}
            aria-describedby={state.errors.includes("phone") ? "phone-error" : undefined}
            className={cx(FIELD, state.errors.includes("phone") && "border-red-400")}
          />
        </Field>

        <Field label={dict.form.email} htmlFor="email" error={errorFor("email")}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={dict.form.emailPlaceholder}
            aria-invalid={state.errors.includes("email")}
            aria-describedby={state.errors.includes("email") ? "email-error" : undefined}
            className={cx(FIELD, state.errors.includes("email") && "border-red-400")}
          />
        </Field>

        <Field label={dict.form.subject} htmlFor="subject">
          <select
            id="subject"
            name="subject"
            defaultValue={defaultSubject}
            className={FIELD}
          >
            {INQUIRY_SUBJECTS.map((value) => (
              <option key={value} value={value}>
                {subjectLabels[value]}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label={dict.form.destination} htmlFor="destination">
            <input
              id="destination"
              name="destination"
              type="text"
              defaultValue={reference ? reference.replace(/-/g, " ") : ""}
              placeholder={dict.form.destinationPlaceholder}
              className={FIELD}
            />
          </Field>
        </div>

        <Field label={dict.form.departDate} htmlFor="departDate">
          <input id="departDate" name="departDate" type="date" className={FIELD} />
        </Field>

        <Field label={dict.form.returnDate} htmlFor="returnDate">
          <input id="returnDate" name="returnDate" type="date" className={FIELD} />
        </Field>

        <Field label={dict.form.adults} htmlFor="adults">
          <input
            id="adults"
            name="adults"
            type="number"
            min={1}
            max={20}
            defaultValue={2}
            className={FIELD}
          />
        </Field>

        <Field label={dict.form.children} htmlFor="children">
          <input
            id="children"
            name="children"
            type="number"
            min={0}
            max={20}
            defaultValue={0}
            className={FIELD}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label={dict.form.message} htmlFor="message">
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder={dict.form.messagePlaceholder}
              className={cx(FIELD, "resize-y")}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex items-start gap-3 text-sm text-ocean-700">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 h-4 w-4 rounded border-ocean-300 text-sunset-600 focus:ring-sunset-500"
          />
          <span>{dict.form.consent}</span>
        </label>
        {errorFor("consent") && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            {errorFor("consent")}
          </p>
        )}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <SubmitButton label={dict.form.submit} pendingLabel={dict.form.submitting} />
        <span className="text-sm text-ocean-600">
          {dict.form.orCall}{" "}
          <a href={telHref()} className="font-semibold text-ocean-900 hover:text-sunset-600">
            {site.phones[0].display}
          </a>
        </span>
      </div>
    </form>
  );
}
