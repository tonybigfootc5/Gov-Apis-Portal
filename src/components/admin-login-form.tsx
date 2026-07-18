"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  configMessage: string | null;
  step: "password" | "verify";
  errorCode?: string;
};

type LoginMode = "verify" | "password";

const errorCopy: Record<string, string> = {
  setup: "Admin access is not fully configured yet.",
  "invalid-password": "Incorrect password.",
  "invalid-code": "Invalid authenticator or backup code.",
  "session-expired": "Session expired.",
  "rate-limit": "Too many attempts. Try again soon.",
};

export function AdminLoginForm({ configMessage, step, errorCode }: Props) {
  const [mode, setMode] = useState<LoginMode>(step === "password" ? "password" : "verify");
  const errorMessage = errorCode ? errorCopy[errorCode] ?? "Sign-in failed." : null;
  const isMfaMode = mode === "verify";

  return (
    <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border-[7px] border-[#0b0d0f] bg-[#f8f8f6] shadow-[0_28px_80px_rgba(4,7,8,0.24)] lg:min-h-[640px] lg:grid-cols-[0.92fr_1.08fr]">
      <div className="relative hidden overflow-hidden bg-[#1d2838] lg:block">
        <Image
          src="/contact-center-visual.jpg"
          alt=""
          fill
          priority
          sizes="44vw"
          className="object-cover grayscale contrast-125 brightness-[0.66]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(43,70,111,0.42),rgba(6,10,14,0.42))]" aria-hidden="true" />
        <div className="absolute left-8 top-7 rounded-md border border-white/36 bg-white/8 px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
          API Culture
        </div>
        <div className="absolute bottom-9 left-8 max-w-xs">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f6cf74]">Admin desk</p>
          <p className="font-display mt-3 text-4xl font-semibold leading-none text-white">Secure center access</p>
        </div>
      </div>

      <div className="relative flex min-h-[620px] flex-col rounded-none bg-[#fbfbfa] px-6 py-7 sm:px-10 lg:rounded-l-[3.4rem] lg:px-16 lg:py-9">
        <div className="flex items-center justify-end gap-3 text-sm font-semibold text-[#4f5551]">
          <span>Choose access mode</span>
          <div className="flex rounded-lg border border-[#c9ccc8] bg-white p-1 shadow-[0_8px_20px_rgba(20,24,24,0.06)]">
            <button
              type="button"
              onClick={() => setMode("verify")}
              aria-pressed={isMfaMode}
              className={`rounded-md px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
                isMfaMode ? "bg-[#1d2735] text-white" : "text-[#626b64] hover:text-[#1d2735]"
              }`}
            >
              MFA
            </button>
            <button
              type="button"
              onClick={() => setMode("password")}
              aria-pressed={!isMfaMode}
              className={`rounded-md px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
                !isMfaMode ? "bg-[#1d2735] text-white" : "text-[#626b64] hover:text-[#1d2735]"
              }`}
            >
              Password
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center">
          <div className="w-full max-w-[31rem]">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b77815]">Admin access</p>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-[#6d706b] sm:text-5xl">
              Secure Sign In
            </h1>

            {errorMessage ? (
              <div className="mt-7 rounded-xl border border-[#e3b5a8] bg-[#fff1ec] px-4 py-3 text-sm font-semibold text-[#8a3824]">
                {errorMessage}
              </div>
            ) : null}

            {configMessage ? (
              <div className="mt-4 rounded-xl border border-[#ecd09b] bg-[#fff8e5] px-4 py-3 text-sm font-semibold text-[#8a5a11]">
                {configMessage}
              </div>
            ) : null}

            <div className="mt-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#e4e4e0]" />
                <p className="text-xs font-bold text-[#8b8f88]">
                  {isMfaMode ? "Authenticator or backup code" : "Shared admin password"}
                </p>
                <span className="h-px flex-1 bg-[#e4e4e0]" />
              </div>

              {isMfaMode ? (
                <form action="/api/admin/login/verify" method="post" className="grid gap-0 overflow-hidden rounded-xl border border-[#e7e7e3] bg-white shadow-[0_18px_42px_rgba(20,24,24,0.06)]">
                  <input type="hidden" name="step" value="verify" />
                  <label className="sr-only" htmlFor="admin-code">
                    Authenticator or backup code
                  </label>
                  <input
                    id="admin-code"
                    type="text"
                    name="code"
                    required
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    className="border-0 bg-white px-6 py-5 text-sm font-semibold text-[#1f2a2a] outline-none ring-[#1d2735] placeholder:text-[#9da19a] focus:ring-2"
                    placeholder="Authenticator or backup code"
                  />

                  <div className="bg-[#fbfbfa] px-6 py-6">
                    <button
                      className="inline-flex min-w-40 items-center justify-center rounded-lg bg-[#1d2735] px-8 py-4 text-sm font-black text-white shadow-[0_18px_34px_rgba(29,39,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#111923]"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form action="/api/admin/login" method="post" className="grid gap-0 overflow-hidden rounded-xl border border-[#e7e7e3] bg-white shadow-[0_18px_42px_rgba(20,24,24,0.06)]">
                  <input type="hidden" name="step" value="password" />
                  <label className="sr-only" htmlFor="admin-password">
                    Admin password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    className="border-0 bg-white px-6 py-5 text-sm font-semibold text-[#1f2a2a] outline-none ring-[#1d2735] placeholder:text-[#9da19a] focus:ring-2"
                    placeholder="Admin password"
                  />

                  <div className="bg-[#fbfbfa] px-6 py-6">
                    <button
                      className="inline-flex min-w-40 items-center justify-center rounded-lg bg-[#1d2735] px-8 py-4 text-sm font-black text-white shadow-[0_18px_34px_rgba(29,39,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#111923]"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
