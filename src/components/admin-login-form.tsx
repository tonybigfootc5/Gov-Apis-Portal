"use client";

import { Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";

type AdminLoginStage = "password" | "verify";

type Props = {
  authReady: boolean;
  configMessage: string | null;
  errorCode?: string;
  initialStage: AdminLoginStage;
};

const errorCopy: Record<string, string> = {
  "invalid-password": "Invalid admin password. Please try again.",
  "invalid-code": "Invalid authenticator code or backup code. Please try again.",
  expired: "Your password step expired. Please enter the admin password again.",
  setup: "Admin MFA is not ready yet. Complete the required configuration first.",
  "rate-limit-password": "Too many password attempts. Please wait a few minutes and try again.",
  "rate-limit-mfa": "Too many MFA attempts. Please wait a few minutes and try again.",
};

export function AdminLoginForm({
  authReady,
  configMessage,
  errorCode,
  initialStage,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const errorMessage = errorCode ? errorCopy[errorCode] ?? "Admin login failed. Please try again." : null;

  return (
    <div className="glass-panel w-full rounded-[1.6rem] p-6 shadow-[0_26px_60px_rgba(64,44,8,0.12)]">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">Restricted</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-[#ffd485]">Admin login</h1>

      <div className="mt-5 flex items-center gap-3 rounded-full bg-[rgba(255,212,133,0.08)] p-1 text-xs font-black uppercase tracking-[0.14em] text-[#8b7352]">
        <div className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 ${initialStage === "password" ? "bg-[#f4b315] text-[#271900]" : ""}`}>
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          Password
        </div>
        <div className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 ${initialStage === "verify" ? "bg-[#f4b315] text-[#271900]" : ""}`}>
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          MFA
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-lg border border-[rgba(255,180,171,0.28)] bg-[rgba(157,61,33,0.18)] px-3 py-2 text-sm font-semibold text-[#ffd1c7]">
          {errorMessage}
        </p>
      ) : null}

      {!authReady ? (
        <div className="mt-5 rounded-[1.2rem] border border-[rgba(255,212,133,0.2)] bg-[rgba(255,248,230,0.92)] px-4 py-4 text-sm leading-7 text-[#735f40]">
          <p className="inline-flex items-center gap-2 font-black uppercase tracking-[0.14em] text-[#c07b14]">
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            Admin MFA setup required
          </p>
          <p className="mt-3">{configMessage ?? "Admin MFA is not configured yet."}</p>
        </div>
      ) : initialStage === "password" ? (
        <form action="/api/admin/login" method="post" className="mt-5">
          <label className="grid gap-2 text-sm font-bold text-[#d4c4ac]">
            24-character admin password
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                autoComplete="current-password"
                className="w-full rounded border border-[#504533] bg-[#120c12] px-3 py-2 pr-12 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[#d4c4ac]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </label>
          <button className="hex-soft mt-5 w-full bg-[#f4b315] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#271900]" type="submit">
            Continue to MFA
          </button>
        </form>
      ) : (
        <div className="mt-5">
          <div className="rounded-[1.2rem] border border-[rgba(255,212,133,0.2)] bg-[rgba(255,248,230,0.92)] px-4 py-4 text-sm leading-7 text-[#735f40]">
            <p className="inline-flex items-center gap-2 font-black uppercase tracking-[0.14em] text-[#c07b14]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Password verified
            </p>
            <p className="mt-3">Enter the current Google Authenticator code, or switch to a one-time backup code.</p>
          </div>

          <div className="mt-5 flex rounded-full bg-[rgba(255,212,133,0.08)] p-1 text-xs font-black uppercase tracking-[0.12em] text-[#8b7352]">
            <button
              type="button"
              onClick={() => setUseBackupCode(false)}
              className={`flex-1 rounded-full px-3 py-2 ${!useBackupCode ? "bg-[#f4b315] text-[#271900]" : ""}`}
            >
              Authenticator code
            </button>
            <button
              type="button"
              onClick={() => setUseBackupCode(true)}
              className={`flex-1 rounded-full px-3 py-2 ${useBackupCode ? "bg-[#f4b315] text-[#271900]" : ""}`}
            >
              Backup code
            </button>
          </div>

          <form action="/api/admin/login/verify" method="post" className="mt-5">
            <input type="hidden" name="mode" value={useBackupCode ? "backup" : "totp"} />
            <label className="grid gap-2 text-sm font-bold text-[#d4c4ac]">
              {useBackupCode ? "One-time backup code" : "6-digit authenticator code"}
              <input
                type="text"
                name="code"
                required
                inputMode={useBackupCode ? "text" : "numeric"}
                autoComplete="one-time-code"
                placeholder={useBackupCode ? "ABCDE-12345" : "123456"}
                className="w-full rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2"
              />
            </label>
            <button className="hex-soft mt-5 w-full bg-[#f4b315] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#271900]" type="submit">
              Verify and enter admin
            </button>
          </form>

          <form action="/api/admin/login/reset" method="post" className="mt-3">
            <button
              type="submit"
              className="w-full rounded-full border border-[rgba(255,212,133,0.2)] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#d4c4ac]"
            >
              Start over
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
