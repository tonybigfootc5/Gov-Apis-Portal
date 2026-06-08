"use client";

import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const invalid = searchParams.get("error") === "invalid";

  return (
    <form action="/api/admin/login" method="post" className="glass-panel w-full rounded-xl p-6">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">Restricted</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-[#ffd485]">Admin login</h1>
      <p className="mt-3 text-sm leading-7 text-[#d4c4ac]">
        Use the admin password to manage applications, payment status, and approvals.
      </p>
      {invalid ? (
        <p className="mt-4 rounded-lg border border-[rgba(255,180,171,0.28)] bg-[rgba(157,61,33,0.18)] px-3 py-2 text-sm font-semibold text-[#ffd1c7]">
          Invalid password. Please try again.
        </p>
      ) : null}
      <label className="mt-6 grid gap-2 text-sm font-bold text-[#d4c4ac]">
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
      <div className="mt-4 rounded-lg border border-[rgba(255,212,133,0.18)] bg-[rgba(255,212,133,0.06)] px-3 py-3 text-sm text-[#ecdfe8]">
        <p className="inline-flex items-center gap-2 font-semibold text-[#ffd485]">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          Temporary password enabled
        </p>
        <p className="mt-2">Current admin password: <span className="font-black text-[#fff0c8]">123456</span></p>
      </div>
      <button className="hex-soft mt-5 w-full bg-[#f4b315] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#271900]" type="submit">
        Continue
      </button>
    </form>
  );
}
