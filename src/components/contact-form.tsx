"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { SiteLanguage } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type State = "idle" | "loading" | "success" | "error";

export function ContactForm({ language }: { language: SiteLanguage }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

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
    <form action={submit} className="glass-panel grid gap-4 rounded-xl p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#d4c4ac]">
          {t(language, "contact.form.name")}
          <input name="name" required className="min-w-0 rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#d4c4ac]">
          {t(language, "contact.form.email")}
          <input type="email" name="email" required className="min-w-0 rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#d4c4ac]">
          {t(language, "contact.form.phone")}
          <input name="phone" className="min-w-0 rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#d4c4ac]">
          {t(language, "contact.form.subject")}
          <input name="subject" required className="min-w-0 rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-[#d4c4ac]">
        {t(language, "contact.form.message")}
        <textarea name="message" required rows={6} className="min-w-0 rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2" />
      </label>
      <button
        type="submit"
        disabled={state === "loading"}
        className="hex-soft inline-flex w-full items-center justify-center gap-2 bg-[#f4b315] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#271900] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {state === "loading" ? t(language, "contact.form.submitting") : t(language, "contact.form.submit")}
      </button>
      {message ? (
        <p className={state === "success" ? "text-sm font-semibold text-[#ffd485]" : "text-sm font-semibold text-[#ffb4ab]"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
