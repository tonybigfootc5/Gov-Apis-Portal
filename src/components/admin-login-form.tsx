"use client";

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
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2.2rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(246,239,228,0.98))] shadow-[0_34px_80px_rgba(64,44,8,0.12)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,180,40,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(27,59,43,0.08),transparent_30%)]" />

      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#9c6a18]">Admin access</p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#173f33] sm:text-5xl">
              Secure sign in
            </h1>
          </div>

          <div className="rounded-full border border-[rgba(27,59,43,0.1)] bg-[rgba(255,253,248,0.8)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setMode("verify")}
                aria-pressed={isMfaMode}
                className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition ${
                  isMfaMode
                    ? "bg-[#173f33] text-[#fff8ea] shadow-[0_10px_24px_rgba(23,57,41,0.2)]"
                    : "text-[#5a6c60] hover:text-[#173f33]"
                }`}
              >
                MFA
              </button>
              <button
                type="button"
                onClick={() => setMode("password")}
                aria-pressed={!isMfaMode}
                className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition ${
                  !isMfaMode
                    ? "bg-[#173f33] text-[#fff8ea] shadow-[0_10px_24px_rgba(23,57,41,0.2)]"
                    : "text-[#5a6c60] hover:text-[#173f33]"
                }`}
              >
                Password
              </button>
            </div>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-[1.15rem] border border-[rgba(157,61,33,0.18)] bg-[linear-gradient(180deg,rgba(255,238,230,0.98),rgba(255,245,238,0.94))] px-4 py-3 text-sm font-semibold text-[#8a3824] shadow-[0_10px_24px_rgba(157,61,33,0.08)]">
            {errorMessage}
          </div>
        ) : null}

        {configMessage ? (
          <div className="mt-4 rounded-[1.15rem] border border-[rgba(201,134,24,0.18)] bg-[linear-gradient(180deg,rgba(255,248,230,0.98),rgba(255,253,248,0.94))] px-4 py-3 text-sm font-semibold text-[#9d3d21]">
            {configMessage}
          </div>
        ) : null}

        <div className="mt-6 rounded-[1.9rem] border border-[rgba(27,59,43,0.1)] bg-[rgba(255,255,255,0.55)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="rounded-full bg-[rgba(27,59,43,0.08)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#173f33]">
              {isMfaMode ? "MFA" : "Password"}
            </span>
            <p className="text-sm font-semibold text-[#607366]">
              {isMfaMode ? "Authenticator or backup code" : "Shared admin password"}
            </p>
          </div>

          {isMfaMode ? (
            <form action="/api/admin/login/verify" method="post" className="grid gap-4">
              <input type="hidden" name="step" value="verify" />
              <label className="grid gap-3 text-sm font-bold text-[#32473b]">
                Authenticator or backup code
                <input
                  type="text"
                  name="code"
                  required
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  className="rounded-[1rem] border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-[#173929] outline-none ring-[#c98618] placeholder:text-[#9aa698] focus:ring-2"
                  placeholder="123456 or ABCDE-FGHIJ"
                />
              </label>

              <button
                className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#f4c44f,#dda126)] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#2f1c00] shadow-[0_16px_32px_rgba(221,161,38,0.24)] transition hover:brightness-105"
                type="submit"
              >
                Sign in with MFA
              </button>
            </form>
          ) : (
            <form action="/api/admin/login" method="post" className="grid gap-4">
              <input type="hidden" name="step" value="password" />
              <label className="grid gap-3 text-sm font-bold text-[#32473b]">
                Admin password
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  className="rounded-[1rem] border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-[#173929] outline-none ring-[#c98618] placeholder:text-[#9aa698] focus:ring-2"
                  placeholder="Enter password"
                />
              </label>

              <button
                className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#214939,#173929)] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#faf6ea] shadow-[0_14px_28px_rgba(23,57,41,0.18)] transition hover:brightness-105"
                type="submit"
              >
                Sign in with password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
