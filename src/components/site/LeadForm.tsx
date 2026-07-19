"use client";

import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { company } from "@/config/company";
import { CheckIcon, PhoneIcon } from "./Icons";

type Errors = Record<string, string>;

/**
 * The whole demo hinges on this form. Two rules:
 *   1. It must feel instant. The API responds before sending any email, so the
 *      success state appears immediately.
 *   2. It must never lose a lead. If the request fails, we say so plainly and
 *      show the phone number rather than swallowing the error.
 */
export function LeadForm({ variant = "section" }: { variant?: "hero" | "section" }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [failed, setFailed] = useState<string | null>(null);

  const onHero = variant === "hero";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFailed(null);

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 400) {
        const data = await res.json();
        setErrors(data.errors ?? {});
        return;
      }

      // The rate limiter's message is the useful one ("call us instead") —
      // don't bury it under a generic "our fault" error.
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setFailed(data.error ?? "Too many requests. Please call us instead.");
        return;
      }

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      form.reset();
      setDone(true);
    } catch (err) {
      console.error("[lead-form]", err);
      setFailed("Something went wrong on our end.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        className={`rounded-2xl p-8 text-center ${
          onHero ? "bg-white shadow-2xl" : "border border-slate-200 bg-white shadow-sm"
        }`}
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckIcon className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          {company.form.success.heading}
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-slate-600">
          {company.form.success.body}
        </p>
        <a
          href={`tel:${company.phone.href}`}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-white transition hover:bg-accent-dark"
        >
          <PhoneIcon className="h-4 w-4" />
          Or call {company.phone.display}
        </a>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-4 block w-full text-sm font-medium text-slate-400 underline-offset-4 hover:text-slate-600 hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";
  const label = "mb-1.5 block text-sm font-medium text-slate-700";
  const errorText = "mt-1 text-xs font-medium text-red-600";

  return (
    <div
      className={`rounded-2xl ${
        onHero
          ? "bg-white p-6 shadow-2xl ring-1 ring-black/5 sm:p-7"
          : "border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      }`}
    >
      <div className="mb-5">
        <h3
          className={`font-bold tracking-tight text-slate-900 ${
            onHero ? "text-xl" : "text-2xl"
          }`}
        >
          {company.form.heading}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
          {company.form.subheading}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor={`name-${variant}`} className={label}>
            Name
          </label>
          <input
            id={`name-${variant}`}
            name="name"
            required
            autoComplete="name"
            placeholder={company.form.namePlaceholder}
            className={field}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className={errorText}>{errors.name}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`phone-${variant}`} className={label}>
              Phone
            </label>
            <input
              id={`phone-${variant}`}
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder={company.phone.display}
              className={field}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && <p className={errorText}>{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor={`email-${variant}`} className={label}>
              Email <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id={`email-${variant}`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className={field}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className={errorText}>{errors.email}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`service-${variant}`} className={label}>
              What do you need?
            </label>
            <select
              id={`service-${variant}`}
              name="service"
              defaultValue={company.services[0].id}
              className={field}
            >
              {company.services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`urgency-${variant}`} className={label}>
              When do you need us?
            </label>
            <select
              id={`urgency-${variant}`}
              name="urgency"
              defaultValue={company.urgencyOptions[0].id}
              className={field}
            >
              {company.urgencyOptions.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={`message-${variant}`} className={label}>
            Tell us what&apos;s going on{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id={`message-${variant}`}
            name="message"
            rows={onHero ? 2 : 3}
            placeholder={company.form.messagePlaceholder}
            className={`${field} resize-none`}
          />
          {errors.message && <p className={errorText}>{errors.message}</p>}
        </div>

        {failed && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">{failed}</p>
            <p className="mt-0.5 text-sm text-red-700">
              Please call us at{" "}
              <a href={`tel:${company.phone.href}`} className="font-semibold underline">
                {company.phone.display}
              </a>{" "}
              — we don&apos;t want you waiting.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : (
            company.form.submitLabel
          )}
        </button>

        <p className="text-center text-xs leading-relaxed text-slate-400">
          No obligation. We&apos;ll text you to confirm before anyone comes out.
        </p>
      </form>
    </div>
  );
}

