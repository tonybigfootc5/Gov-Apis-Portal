"use client";

import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const invalid = searchParams.get("error") === "invalid";
  const showDevelopmentHint = process.env.NODE_ENV !== "production";

  return (
    <form action="/api/admin/login" method="post" className="glass-panel w-full rounded-xl p-6">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">Restricted</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-[#ffd485]">Admin login</h1>
      {invalid ? (
        <p className="mt-3 rounded-lg border border-[rgba(255,180,171,0.28)] bg-[rgba(157,61,33,0.18)] px-3 py-2 text-sm font-semibold text-[#ffd1c7]">
          Invalid password. Please try again.
        </p>
      ) : null}
      <label className="mt-5 grid gap-2 text-sm font-bold text-[#d4c4ac]">
        Password
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
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
      {showDevelopmentHint ? (
        <div className="mt-4 rounded-lg border border-[rgba(255,212,133,0.22)] bg-[rgba(255,212,133,0.09)] px-3 py-3 text-sm text-[#8b7352]">
          <p className="inline-flex items-center gap-2 font-semibold text-[#ffd485]">
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            Development access hint
          </p>
          <p className="mt-2">
            If no `ADMIN_PASSWORD` is configured locally, use{" "}
            <span className="font-black text-[#c07b14]">admin-development-pass</span>.
          </p>
        </div>
      ) : null}
      <button className="hex-soft mt-5 w-full bg-[#f4b315] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#271900]" type="submit">
        Continue
      </button>
    </form>
  );
}
