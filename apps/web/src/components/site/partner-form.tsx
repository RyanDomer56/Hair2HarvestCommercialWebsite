"use client";

import { useState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

const frequencyOptions = ["form.frequencyOpt1", "form.frequencyOpt2", "form.frequencyOpt3"];

/** Keeps the phone field digits-only and capped at 11 characters. */
function sanitizeTel(e: React.ChangeEvent<HTMLInputElement>) {
  const clean = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (clean !== e.target.value) e.target.value = clean;
}

export function PartnerForm() {
  const { t } = useLanguage();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [mobileError, setMobileError] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // A mobile number is required; block submit and show a red flag (QA #27).
    if (!String(data.mobile ?? "").trim()) {
      setMobileError(true);
      form.querySelector<HTMLInputElement>("input[name='mobile']")?.focus();
      return;
    }
    setMobileError(false);
    setState("sending");
    setMessage("");

    try {
      const res = await fetch("/api/v1/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          countryCode: "+63",
          consent: data.consent === "on",
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setState("done");
    } catch {
      setState("error");
      setMessage(t("form.errorMsg"));
    }
  }

  if (state === "done") {
    return (
      <div className="card-print flex flex-col items-start gap-4 p-8">
        <span className="flex size-10 items-center justify-center rounded-full bg-moss text-paper-raised">
          <Check size={18} />
        </span>
        <div>
          <h3 className="text-[1.125rem] font-medium text-ink">{t("form.thanks")}</h3>
          <p className="mt-2 max-w-[46ch] text-[0.875rem] leading-[1.7] text-ink-soft">
            {t("form.thanksBody")}
          </p>
        </div>
        <p className="mono-tag text-ink-mute">{t("form.thanksNote")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-print p-6 sm:p-8" noValidate>
      <p className="text-[0.9375rem] leading-[1.7] text-ink-soft">{t("form.intro")}</p>

      <p className="mt-4 rounded-[3px] border border-[var(--line)] bg-[var(--paper-sunk)] px-3 py-2 text-[0.75rem] leading-[1.5] text-ink-soft">
        {t("form.requestOnly")}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {/* Shop name */}
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="mono-tag uppercase text-ink-mute">
            {t("form.shopName")}
            <span className="ml-1 text-clay">*</span>
          </span>
          <input
            name="name"
            type="text"
            required
            placeholder={t("form.shopNamePh")}
            className="h-11 rounded-[3px] border border-[var(--line)] bg-paper-raised px-3 text-[0.875rem] text-ink outline-none transition-colors placeholder:text-ink-mute/60 focus:border-moss"
          />
        </label>

        {/* Contact person -> Owner */}
        <label className="flex flex-col gap-1.5">
          <span className="mono-tag uppercase text-ink-mute">
            {t("form.contactPerson")}
            <span className="ml-1 text-clay">*</span>
          </span>
          <input
            name="contact"
            type="text"
            required
            placeholder={t("form.contactPersonPh")}
            className="h-11 rounded-[3px] border border-[var(--line)] bg-paper-raised px-3 text-[0.875rem] text-ink outline-none transition-colors placeholder:text-ink-mute/60 focus:border-moss"
          />
        </label>

        {/* Mobile — fixed +63 prefix, local digits (QA #27) */}
        <label className="flex flex-col gap-1.5">
          <span className="mono-tag uppercase text-ink-mute">
            {t("form.mobile")}
            <span className="ml-1 text-clay">*</span>
          </span>
          <div className="flex gap-2">
            <span className="flex h-11 w-[4.25rem] shrink-0 items-center justify-center rounded-[3px] border border-[var(--line)] bg-[var(--paper-sunk)] text-[0.875rem] font-medium text-ink">
              +63
            </span>
            {/* Fixed country code for the form payload. */}
            <input type="hidden" name="countryCode" value="+63" />
            <input
              name="mobile"
              type="tel"
              required
              inputMode="numeric"
              maxLength={11}
              placeholder={t("form.mobilePh")}
              onChange={sanitizeTel}
              aria-invalid={mobileError}
              aria-describedby={mobileError ? "mobile-error" : undefined}
              className={cn(
                "h-11 flex-1 rounded-[3px] border bg-paper-raised px-3 text-[0.875rem] text-ink outline-none transition-colors placeholder:text-ink-mute/60 focus:border-moss",
                mobileError ? "border-rust" : "border-[var(--line)]",
              )}
            />
          </div>
          {mobileError ? (
            <span
              id="mobile-error"
              className="flex items-center gap-1 text-[0.6875rem] font-medium text-rust"
            >
              <AlertCircle size={12} aria-hidden />
              {t("form.mobileInvalid")}
            </span>
          ) : (
            <span className="text-[0.6875rem] text-ink-mute">{t("form.mobileHint")}</span>
          )}
        </label>

        {/* Barangay — fixed to Nova Proper */}
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="mono-tag uppercase text-ink-mute">{t("form.barangay")}</span>
          <div className="flex h-11 items-center rounded-[3px] border border-[var(--line)] bg-[var(--paper-sunk)] px-3 text-[0.875rem] text-ink">
            {t("form.barangayOpt1")}
          </div>
          {/* Fixed barangay value for the form payload. */}
          <input type="hidden" name="barangay" value="Nova Proper" />
        </label>

        {/* Street */}
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="mono-tag uppercase text-ink-mute">
            {t("form.street")}
            <span className="ml-1 text-clay">*</span>
          </span>
          <input
            name="street"
            type="text"
            required
            placeholder={t("form.streetPh")}
            className="h-11 rounded-[3px] border border-[var(--line)] bg-paper-raised px-3 text-[0.875rem] text-ink outline-none transition-colors placeholder:text-ink-mute/60 focus:border-moss"
          />
        </label>

        {/* Unit (optional) */}
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="mono-tag uppercase text-ink-mute">
            {t("form.unit")}
            <span className="ml-1 text-ink-mute">{t("form.optional")}</span>
          </span>
          <input
            name="unit"
            type="text"
            placeholder={t("form.unitPh")}
            className="h-11 rounded-[3px] border border-[var(--line)] bg-paper-raised px-3 text-[0.875rem] text-ink outline-none transition-colors placeholder:text-ink-mute/60 focus:border-moss"
          />
        </label>

        {/* Pickup rules */}
        <div className="sm:col-span-2">
          <p className="mono-tag uppercase text-ink-mute">{t("form.pickupRules")}</p>
          <div className="mt-3 grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-[0.8125rem] text-ink-soft">
                {t("form.frequency")}
                <span className="ml-1 text-clay">*</span>
              </span>
              <select
                name="frequency"
                required
                defaultValue={frequencyOptions[0]}
                className="h-11 rounded-[3px] border border-[var(--line)] bg-paper-raised px-3 text-[0.875rem] text-ink outline-none transition-colors focus:border-moss"
              >
                {frequencyOptions.map((o) => (
                  <option key={o} value={t(o)}>
                    {t(o)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] text-ink-soft">
                {t("form.startTime")}
                <span className="ml-1 text-clay">*</span>
              </span>
              <input
                name="startTime"
                type="time"
                required
                className="h-11 rounded-[3px] border border-[var(--line)] bg-paper-raised px-3 text-[0.875rem] text-ink outline-none transition-colors focus:border-moss"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.8125rem] text-ink-soft">
                {t("form.endTime")}
                <span className="ml-1 text-clay">*</span>
              </span>
              <input
                name="endTime"
                type="time"
                required
                className="h-11 rounded-[3px] border border-[var(--line)] bg-paper-raised px-3 text-[0.875rem] text-ink outline-none transition-colors focus:border-moss"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[var(--line)] pt-5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 size-4 accent-[var(--moss)]"
          />
          <span className="text-[0.8125rem] leading-[1.6] text-ink-soft">{t("form.consent")}</span>
        </label>
      </div>

      <p className="mt-5 rounded-[3px] border border-[var(--line)] bg-[var(--paper-sunk)] px-3 py-2.5 text-[0.75rem] leading-[1.6] text-ink-soft">
        {t("form.privacy")}
      </p>

      {state === "error" && (
        <p className="mt-5 rounded-[3px] border border-rust/30 bg-rust/8 p-3 text-[0.8125rem] leading-relaxed text-rust">
          {message}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono-tag max-w-[32ch] leading-relaxed text-ink-mute">{t("form.requestNote")}</p>
        <button type="submit" disabled={state === "sending"} className="btn btn-sm sm:w-auto">
          {state === "sending" ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {t("form.sending")}
            </>
          ) : (
            t("form.submit")
          )}
        </button>
      </div>
    </form>
  );
}
