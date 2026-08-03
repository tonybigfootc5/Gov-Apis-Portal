"use client";

import { useState } from "react";
import { Building2, Send, UserRound } from "lucide-react";
import type { SiteLanguage } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type State = "idle" | "loading" | "success" | "error";
type ContactFormVariant = "default" | "contactPage";
type InquiryType = "individual" | "group";

const groupCopy = {
  en: {
    individual: "Individual enquiry",
    individualHelp: "Questions, training details, or general support.",
    group: "Group / organization visit",
    groupHelp: "Schools, institutions, departments, NGOs, and visiting teams.",
    organizationName: "Organization / institution",
    organizationPlaceholder: "School, college, NGO, department...",
    groupSize: "Expected group size",
    groupSizePlaceholder: "Example: 35 students",
    preferredDate: "Preferred visit date",
    visitPurpose: "Visit purpose",
    visitPurposePlaceholder: "Campus visit, demonstration, workshop, field exposure...",
  },
  te: {
    individual: "Individual enquiry",
    individualHelp: "Questions, training details, or general support.",
    group: "Group / organization visit",
    groupHelp: "Schools, institutions, departments, NGOs, and visiting teams.",
    organizationName: "Organization / institution",
    organizationPlaceholder: "School, college, NGO, department...",
    groupSize: "Expected group size",
    groupSizePlaceholder: "Example: 35 students",
    preferredDate: "Preferred visit date",
    visitPurpose: "Visit purpose",
    visitPurposePlaceholder: "Campus visit, demonstration, workshop, field exposure...",
  },
  hi: {
    individual: "Individual enquiry",
    individualHelp: "Questions, training details, or general support.",
    group: "Group / organization visit",
    groupHelp: "Schools, institutions, departments, NGOs, and visiting teams.",
    organizationName: "Organization / institution",
    organizationPlaceholder: "School, college, NGO, department...",
    groupSize: "Expected group size",
    groupSizePlaceholder: "Example: 35 students",
    preferredDate: "Preferred visit date",
    visitPurpose: "Visit purpose",
    visitPurposePlaceholder: "Campus visit, demonstration, workshop, field exposure...",
  },
} as const satisfies Record<SiteLanguage, Record<string, string>>;

export function ContactForm({ language, variant = "default" }: { language: SiteLanguage; variant?: ContactFormVariant }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryType>("individual");
  const isContactPage = variant === "contactPage";
  const copy = groupCopy[language] ?? groupCopy.en;
  const fieldClass = isContactPage
    ? "min-w-0 rounded-[1.05rem] border border-transparent bg-[#ecebe6] px-4 py-3.5 text-[#181b18] outline-none ring-[#1a1a1a]/15 transition placeholder:text-[#77786f] focus:bg-white focus:ring-2"
    : "min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2";
  const labelClass = isContactPage
    ? "grid gap-2 text-sm font-medium text-[#30332f]"
    : "grid gap-2 text-sm font-semibold text-[#516253]";

  async function submit(formData: FormData) {
    setState("loading");
    setMessage("");
    const rawSubject = String(formData.get("subject") ?? "").trim();
    const rawMessage = String(formData.get("message") ?? "").trim();
    const organizationName = String(formData.get("organizationName") ?? "").trim();
    const groupSize = String(formData.get("groupSize") ?? "").trim();
    const preferredDate = String(formData.get("preferredDate") ?? "").trim();
    const visitPurpose = String(formData.get("visitPurpose") ?? "").trim();
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      subject: inquiryType === "group" ? `[Group Visit] ${rawSubject || organizationName || "Organization visit request"}` : rawSubject,
      message:
        inquiryType === "group"
          ? [
              "Inquiry type: Group / organization visit",
              organizationName ? `Organization: ${organizationName}` : "",
              groupSize ? `Expected group size: ${groupSize}` : "",
              preferredDate ? `Preferred visit date: ${preferredDate}` : "",
              visitPurpose ? `Visit purpose: ${visitPurpose}` : "",
              "",
              rawMessage,
            ].filter(Boolean).join("\n")
          : rawMessage,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      <div className="grid gap-2 sm:grid-cols-2">
        {(["individual", "group"] as const).map((type) => {
          const selected = inquiryType === type;
          const Icon = type === "individual" ? UserRound : Building2;

          return (
            <button
              key={type}
              type="button"
              onClick={() => setInquiryType(type)}
              className={`flex min-h-20 items-start gap-3 rounded-[1.15rem] border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b36b00] ${
                selected
                  ? "border-[#173f33] bg-[#173f33] text-white shadow-[0_16px_34px_rgba(23,63,51,0.18)]"
                  : isContactPage
                    ? "border-[#e4e1d8] bg-white text-[#181b18] hover:border-[#c8bd9e]"
                    : "border-[rgba(27,59,43,0.14)] bg-[#fffdf8] text-[#1b3b2b] hover:border-[#ebb428]"
              }`}
              aria-pressed={selected}
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${selected ? "bg-[#f2b544] text-[#173f33]" : "bg-[#f6edd9] text-[#173f33]"}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black">{type === "individual" ? copy.individual : copy.group}</span>
                <span className={`mt-1 block text-xs font-semibold leading-5 ${selected ? "text-white/76" : "text-[#68736d]"}`}>
                  {type === "individual" ? copy.individualHelp : copy.groupHelp}
                </span>
              </span>
            </button>
          );
        })}
      </div>

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
      {inquiryType === "group" ? (
        <div className="rounded-[1.25rem] border border-[#e4dccd] bg-[#fffdf8] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              {copy.organizationName}
              <input name="organizationName" required placeholder={copy.organizationPlaceholder} className={fieldClass} />
            </label>
            <label className={labelClass}>
              {copy.groupSize}
              <input name="groupSize" required placeholder={copy.groupSizePlaceholder} className={fieldClass} />
            </label>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              {copy.preferredDate}
              <input type="date" name="preferredDate" className={fieldClass} />
            </label>
            <label className={labelClass}>
              {copy.visitPurpose}
              <input name="visitPurpose" required placeholder={copy.visitPurposePlaceholder} className={fieldClass} />
            </label>
          </div>
        </div>
      ) : null}
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
