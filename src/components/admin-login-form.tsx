"use client";

type Props = {
  configMessage: string | null;
  step: "password" | "verify";
  errorCode?: string;
};

const errorCopy: Record<string, string> = {
  setup: "Admin access is not fully configured yet.",
  "invalid-password": "Incorrect password.",
  "invalid-code": "Invalid authenticator or backup code.",
  "session-expired": "Session expired.",
  "rate-limit": "Too many attempts. Try again soon.",
};

export function AdminLoginForm({ configMessage, errorCode }: Props) {
  const errorMessage = errorCode ? errorCopy[errorCode] ?? "Sign-in failed." : null;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(180deg,rgba(255,253,248,0.97),rgba(246,239,228,0.98))] shadow-[0_34px_80px_rgba(64,44,8,0.12)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,180,40,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(27,59,43,0.08),transparent_24%)]" />

      <div className="relative grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="px-6 py-7 lg:border-r lg:border-[rgba(27,59,43,0.08)] lg:px-8 lg:py-9">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-full bg-[rgba(27,59,43,0.08)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#1b3b2b]">
              MFA
            </span>
          </div>

          {errorMessage ? (
            <div className="mb-4 rounded-[1.05rem] border border-[rgba(157,61,33,0.18)] bg-[linear-gradient(180deg,rgba(255,238,230,0.98),rgba(255,245,238,0.94))] px-4 py-3 text-sm font-semibold text-[#8a3824] shadow-[0_10px_24px_rgba(157,61,33,0.08)]">
              {errorMessage}
            </div>
          ) : null}

          {configMessage ? (
            <div className="mb-4 rounded-[1.05rem] border border-[rgba(201,134,24,0.18)] bg-[linear-gradient(180deg,rgba(255,248,230,0.98),rgba(255,253,248,0.94))] px-4 py-3 text-sm font-semibold text-[#9d3d21]">
              {configMessage}
            </div>
          ) : null}

          <form action="/api/admin/login/verify" method="post" className="rounded-[1.7rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(145deg,rgba(28,54,42,0.98),rgba(20,40,31,0.98))] p-5 text-[#f8f2e7] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_40px_rgba(27,59,43,0.18)] lg:p-6">
            <label className="grid gap-3 text-sm font-bold text-[#f3e4c8]">
              Authenticator or backup code
              <input
                type="text"
                name="code"
                required
                autoComplete="one-time-code"
                inputMode="numeric"
                className="rounded-[1rem] border border-[rgba(241,196,91,0.22)] bg-[rgba(250,248,242,0.08)] px-4 py-3 text-[#fff8ea] outline-none ring-[#f1c45b] placeholder:text-[#bcae94] focus:ring-2"
                placeholder="123456 or ABCDE-FGHIJ"
              />
            </label>
            <button
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#f4c44f,#dda126)] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#2f1c00] shadow-[0_16px_32px_rgba(221,161,38,0.24)] transition hover:brightness-105"
              type="submit"
            >
              Sign in with MFA
            </button>
          </form>
        </section>

        <aside className="px-6 py-7 lg:px-7 lg:py-9">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-full bg-[rgba(27,59,43,0.08)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#1b3b2b]">
              Password
            </span>
          </div>

          <form action="/api/admin/login" method="post" className="rounded-[1.7rem] border border-[rgba(27,59,43,0.1)] bg-[rgba(255,255,255,0.52)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]">
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
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#214939,#173929)] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#faf6ea] shadow-[0_14px_28px_rgba(23,57,41,0.18)] transition hover:brightness-105"
              type="submit"
            >
              Sign in with password
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
