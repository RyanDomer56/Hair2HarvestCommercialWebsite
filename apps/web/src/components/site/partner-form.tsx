"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Field = {
  name: string;
  label: string;
  type?: "text" | "tel" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  hint?: string;
  span?: 1 | 2;
};

/* Keep it short: only what we truly need to arrange the first visit. */
const fields: Field[] = [
  {
    name: "name",
    label: "Shop name",
    placeholder: "e.g. Barako Brothers Grooming",
    required: true,
    span: 2,
  },
  {
    name: "contact",
    label: "Contact person",
    placeholder: "Who should we ask for?",
    required: true,
  },
  {
    name: "mobile",
    label: "Mobile number",
    type: "tel",
    placeholder: "0917 402 1188",
    required: true,
    hint: "Numbers only, up to 11 digits.",
  },
  {
    name: "barangay",
    label: "Barangay",
    type: "select",
    options: ["Novaliches Proper", "Nearby barangay", "Other"],
    required: true,
  },
  {
    name: "visit",
    label: "Best time to visit",
    type: "select",
    options: ["Any time is fine", "Morning · 9–11 AM", "Afternoon · 2–4 PM", "After closing · 8–9 PM"],
  },
];

/** Keeps the phone field digits-only and capped at 11 characters. */
function sanitizeTel(e: React.ChangeEvent<HTMLInputElement>) {
  const clean = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (clean !== e.target.value) e.target.value = clean;
}

export function PartnerForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setMessage("");

    try {
      const res = await fetch("/api/v1/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          consent: data.consent === "on",
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setState("done");
    } catch {
      setState("error");
      setMessage(
        "We could not send your request. Please call or message 0917 000 0000 and we will help you join on the visit.",
      );
    }
  }

  if (state === "done") {
    return (
      <div className="card-print flex flex-col items-start gap-4 p-8">
        <span className="flex size-10 items-center justify-center rounded-full bg-moss text-paper-raised">
          <Check size={18} />
        </span>
        <div>
          <h3 className="text-[1.125rem] font-medium text-ink">Thank you!</h3>
          <p className="mt-2 max-w-[46ch] text-[0.875rem] leading-[1.7] text-ink-soft">
            We will message you to agree on a visit. A collection team member brings the labelled sack and
            fills in the short form for you. It takes almost none of your time.
          </p>
        </div>
        <p className="mono-tag text-ink-mute">
          NO ACCOUNT NEEDED · WE WILL MESSAGE YOU
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-print p-6 sm:p-8">
      <p className="text-[0.9375rem] leading-[1.7] text-ink-soft">
        Fill in these few details and we will get in touch. A collection team member does the rest when we
        visit.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <label
            key={f.name}
            className={cn("flex flex-col gap-1.5", f.span === 2 && "sm:col-span-2")}
          >
            <span className="mono-tag uppercase text-ink-mute">
              {f.label}
              {f.required ? (
                <span className="ml-1 text-clay">*</span>
              ) : (
                <span className="ml-1 text-ink-mute">(Optional)</span>
              )}
            </span>
            {f.type === "select" ? (
              <select
                name={f.name}
                required={f.required}
                defaultValue={f.options?.[0]}
                className="h-11 rounded-[3px] border border-[var(--line)] bg-paper-raised px-3 text-[0.875rem] text-ink outline-none transition-colors focus:border-moss"
              >
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={f.name}
                type={f.type ?? "text"}
                required={f.required}
                placeholder={f.placeholder}
                inputMode={f.type === "tel" ? "numeric" : undefined}
                maxLength={f.type === "tel" ? 11 : undefined}
                pattern={f.type === "tel" ? "[0-9]{0,11}" : undefined}
                onChange={f.type === "tel" ? sanitizeTel : undefined}
                className="h-11 rounded-[3px] border border-[var(--line)] bg-paper-raised px-3 text-[0.875rem] text-ink outline-none transition-colors placeholder:text-ink-mute/60 focus:border-moss"
              />
            )}
            {f.hint && <span className="text-[0.6875rem] text-ink-mute">{f.hint}</span>}
          </label>
        ))}
      </div>

      <div className="mt-6 border-t border-[var(--line)] pt-5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 size-4 accent-[var(--moss)]"
          />
          <span className="text-[0.8125rem] leading-[1.6] text-ink-soft">
            I agree that Hair2Harvest can collect hair clippings from my shop. A collection team member will
            explain the programme during the visit.
          </span>
        </label>
      </div>

      {state === "error" && (
        <p className="mt-5 rounded-[3px] border border-rust/30 bg-rust/8 p-3 text-[0.8125rem] leading-relaxed text-rust">
          {message}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono-tag max-w-[32ch] leading-relaxed text-ink-mute">
          FREE TO JOIN · NO PASSWORD · NO APP
        </p>
        <button type="submit" disabled={state === "sending"} className="btn btn-sm sm:w-auto">
          {state === "sending" ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Sending
            </>
          ) : (
            "Ask for a visit"
          )}
        </button>
      </div>
    </form>
  );
}
