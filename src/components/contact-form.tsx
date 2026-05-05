"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setState("loading");
    setMessage("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (response.ok) {
      setState("success");
      setMessage("Your message has been recorded. The center team will respond through the provided contact details.");
      return;
    }

    const body = await response.json().catch(() => null);
    setState("error");
    setMessage(body?.error ?? "Unable to submit the form right now. Please try again.");
  }

  return (
    <form action={submit} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Full name
          <input name="name" required className="rounded-md border border-stone-300 px-3 py-2 outline-none ring-amber-400 focus:ring-2" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Email
          <input type="email" name="email" required className="rounded-md border border-stone-300 px-3 py-2 outline-none ring-amber-400 focus:ring-2" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Phone
          <input name="phone" className="rounded-md border border-stone-300 px-3 py-2 outline-none ring-amber-400 focus:ring-2" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Subject
          <input name="subject" required className="rounded-md border border-stone-300 px-3 py-2 outline-none ring-amber-400 focus:ring-2" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-stone-700">
        Message
        <textarea name="message" required rows={6} className="rounded-md border border-stone-300 px-3 py-2 outline-none ring-amber-400 focus:ring-2" />
      </label>
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex w-fit items-center gap-2 rounded-md bg-emerald-950 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {state === "loading" ? "Submitting" : "Send message"}
      </button>
      {message ? (
        <p className={state === "success" ? "text-sm font-semibold text-emerald-700" : "text-sm font-semibold text-red-700"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
