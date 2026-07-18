"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { SiteLanguage } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type State = "idle" | "loading" | "success" | "error";
type ContactFormVariant = "default" | "contactPage";

export function ContactForm({ language, variant = "default" }: { language: SiteLanguage; variant?: ContactFormVariant }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const isContactPage = variant === "contactPage";
  const fieldClass = isContactPage
    ? "min-w-0 rounded-[1.05rem] border border-transparent bg-[#ecebe6] px-4 py-3.5 text-[#181b18] outline-none ring-[#1a1a1a]/15 transition placeholder:text-[#77786f] focus:bg-white focus:ring-2"
    : "min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2";
  const labelClass = isContactPage
    ? "grid gap-2 text-sm font-medium text-[#30332f]"
    : "grid gap-2 text-sm font-semibold text-[#516253]";

  async function submit(formData: FormData) {
    setState("loading");
    setMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (response.ok) {
        setState("success");
        setMessage(t(language, "contact.form.success"));
        return;
      }

      const body = await response.json().catch(() => null);
      setState("error");
      setMessage(body?.error ?? t(language, "contact.form.error"));
    } catch {
      setState("error");
      setMessage(t(language, "contact.form.error"));
    }
  }

  return (
    <form
      action={submit}
      className={
        isContactPage
          ? "grid gap-4 rounded-[1.45rem] bg-[#f7f6f2] p-5 shadow-[0_22px_50px_rgba(22,23,20,0.08)]"
          : "paper-panel grid gap-4 rounded-[2rem] p-5 sm:p-6"
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {t(language, "contact.form.name")}
          <input name="name" required placeholder="Your name" className={fieldClass} />
        </label>
        <label className={labelClass}>
          {t(language, "contact.form.email")}
          <input type="email" name="email" required placeholder="you@example.com" className={fieldClass} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {t(language, "contact.form.phone")}
          <input name="phone" placeholder="Your phone number" className={fieldClass} />
        </label>
        <label className={labelClass}>
          {t(language, "contact.form.subject")}
          <input name="subject" required placeholder="Training inquiry" className={fieldClass} />
        </label>
      </div>
      <label className={labelClass}>
        {t(language, "contact.form.message")}
        <textarea
          name="message"
          required
          rows={isContactPage ? 5 : 6}
          placeholder="Message"
          className={
            isContactPage
              ? "min-w-0 resize-none rounded-[1.15rem] border border-transparent bg-[#ecebe6] px-4 py-3.5 text-[#181b18] outline-none ring-[#1a1a1a]/15 transition placeholder:text-[#77786f] focus:bg-white focus:ring-2"
              : "min-w-0 rounded-[1.5rem] border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2"
          }
        />
      </label>
      <button
        type="submit"
        disabled={state === "loading"}
        className={
          isContactPage
            ? "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2f332f] disabled:cursor-not-allowed disabled:opacity-60"
            : "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1b3b2b] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#faf8f2] transition hover:bg-[#2d312e] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
        }
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {state === "loading" ? t(language, "contact.form.submitting") : t(language, "contact.form.submit")}
      </button>
      {message ? (
        <p className={state === "success" ? "text-sm font-semibold text-[#b36b00]" : "text-sm font-semibold text-[#9d3d21]"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
