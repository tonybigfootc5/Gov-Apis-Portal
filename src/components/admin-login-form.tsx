"use client";

type Props = {
  configMessage: string | null;
  step: "password" | "verify";
  errorCode?: string;
};

const errorCopy: Record<string, string> = {
  setup: "Admin access is not fully configured yet. Please update the required environment variables.",
  "invalid-password": "The admin password was incorrect.",
  "invalid-code": "That authenticator or backup code was not accepted.",
  "session-expired": "Your login step expired. Enter the password again to continue.",
  "rate-limit": "Too many attempts were made. Please wait a few minutes and try again.",
};

export function AdminLoginForm({ configMessage, step, errorCode }: Props) {
  const errorMessage = errorCode ? errorCopy[errorCode] ?? "Admin sign-in failed. Please try again." : null;

  return (
    <div className="glass-panel w-full rounded-[1.6rem] p-6 shadow-[0_26px_60px_rgba(64,44,8,0.12)]">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">Restricted</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-[#ffd485]">
        {step === "verify" ? "Admin MFA check" : "Admin sign in"}
      </h1>
      <p className="mt-4 text-sm leading-7 text-[#eadfcf]">
        {step === "verify"
          ? "Enter your authenticator code to finish accessing the admin area. Backup codes are also accepted."
          : "Only the admin area is protected. Public pages remain open, but `/admin` requires the shared password and MFA."}
      </p>

      {errorMessage ? (
        <p className="mt-4 rounded-lg border border-[rgba(255,180,171,0.28)] bg-[rgba(157,61,33,0.18)] px-3 py-2 text-sm font-semibold text-[#ffd1c7]">
          {errorMessage}
        </p>
      ) : null}

      {configMessage ? (
        <div className="mt-5 rounded-[1.2rem] border border-[rgba(255,212,133,0.2)] bg-[rgba(255,248,230,0.92)] px-4 py-4 text-sm leading-7 text-[#735f40]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c07b14]">Configuration needed</p>
          <p className="mt-3 text-[#9d3d21]">{configMessage}</p>
        </div>
      ) : null}

      {step === "verify" ? (
        <div className="mt-5 grid gap-4">
          <form action="/api/admin/login/verify" method="post" className="grid gap-3">
            <label className="grid gap-2 text-sm font-bold text-[#d4c4ac]">
              Authenticator or backup code
              <input
                type="text"
                name="code"
                required
                autoComplete="one-time-code"
                inputMode="numeric"
                className="w-full rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2"
                placeholder="123456 or ABCDE-FGHIJ"
              />
            </label>
            <button
              className="hex-soft inline-flex w-full items-center justify-center rounded-full bg-[#f4b315] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#271900]"
              type="submit"
            >
              Verify admin access
            </button>
          </form>

          <form action="/api/admin/login/reset" method="post">
            <button
              className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(255,212,133,0.2)] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#d4c4ac]"
              type="submit"
            >
              Start over
            </button>
          </form>
        </div>
      ) : (
        <form action="/api/admin/login" method="post" className="mt-5 grid gap-3">
          <label className="grid gap-2 text-sm font-bold text-[#d4c4ac]">
            Admin password
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2"
            />
          </label>
          <button
            className="hex-soft inline-flex w-full items-center justify-center rounded-full bg-[#f4b315] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#271900]"
            type="submit"
          >
            Continue to MFA
          </button>
        </form>
      )}
    </div>
  );
}
