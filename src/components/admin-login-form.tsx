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
  const mfaActive = step === "verify";

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(180deg,rgba(255,253,248,0.96),rgba(246,239,228,0.98))] shadow-[0_34px_80px_rgba(64,44,8,0.12)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,180,40,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(27,59,43,0.08),transparent_24%)]" />
      <div className="relative grid gap-0 lg:grid-cols-[1.45fr_0.95fr]">
        <section className="border-b border-[rgba(27,59,43,0.08)] px-6 py-7 lg:border-b-0 lg:border-r lg:px-8 lg:py-9">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[rgba(27,59,43,0.08)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#1b3b2b]">
              Priority 1
            </span>
            <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${
              mfaActive
                ? "bg-[rgba(33,113,72,0.14)] text-[#1d5d3f]"
                : "bg-[rgba(179,107,0,0.12)] text-[#8a5700]"
            }`}>
              {mfaActive ? "MFA ready" : "Awaiting password unlock"}
            </span>
          </div>

          <h1 className="font-display mt-5 max-w-xl text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.95] text-[#173929]">
            MFA comes first.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#4e5d52] lg:text-lg">
            The admin workspace is opened by an authenticator check first in the visual flow, with the password handled as
            the secondary gate beside it. Backup codes still work here whenever your authenticator is unavailable.
          </p>

          {errorMessage ? (
            <div className="mt-6 rounded-[1.25rem] border border-[rgba(157,61,33,0.18)] bg-[linear-gradient(180deg,rgba(255,238,230,0.98),rgba(255,245,238,0.94))] px-4 py-3 text-sm font-semibold text-[#8a3824] shadow-[0_14px_30px_rgba(157,61,33,0.08)]">
              {errorMessage}
            </div>
          ) : null}

          {configMessage ? (
            <div className="mt-6 rounded-[1.4rem] border border-[rgba(201,134,24,0.18)] bg-[linear-gradient(180deg,rgba(255,248,230,0.98),rgba(255,253,248,0.94))] px-4 py-4 text-sm leading-7 text-[#735f40]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#a76600]">Configuration needed</p>
              <p className="mt-2 text-[#9d3d21]">{configMessage}</p>
            </div>
          ) : null}

          <div className="mt-7 rounded-[1.7rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(145deg,rgba(28,54,42,0.98),rgba(20,40,31,0.98))] p-5 text-[#f8f2e7] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_40px_rgba(27,59,43,0.18)] lg:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f1c45b]">Authenticator checkpoint</p>
                <p className="mt-2 text-sm leading-7 text-[#d8d6cf]">
                  Enter the 6-digit authenticator code or a backup code.
                </p>
              </div>
              <div className="hidden rounded-[1.2rem] border border-[rgba(241,196,91,0.24)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-right lg:block">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f1c45b]">Status</p>
                <p className="mt-1 text-sm font-semibold text-[#fff3d0]">{mfaActive ? "Live step" : "Locked"}</p>
              </div>
            </div>

            {mfaActive ? (
              <div className="mt-5 grid gap-4">
                <form action="/api/admin/login/verify" method="post" className="grid gap-4">
                  <label className="grid gap-2 text-sm font-bold text-[#f3e4c8]">
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
                    className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#f4c44f,#dda126)] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#2f1c00] shadow-[0_16px_32px_rgba(221,161,38,0.24)] transition hover:brightness-105"
                    type="submit"
                  >
                    Verify MFA
                  </button>
                </form>

                <form action="/api/admin/login/reset" method="post">
                  <button
                    className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(241,196,91,0.18)] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#efe2c3]"
                    type="submit"
                  >
                    Reset login flow
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-5 rounded-[1.2rem] border border-dashed border-[rgba(241,196,91,0.2)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <p className="text-sm font-semibold text-[#fff3d0]">MFA panel unlocked after password confirmation.</p>
                <p className="mt-2 text-sm leading-7 text-[#cabda2]">
                  Use the secondary panel to confirm the admin password, then this primary MFA panel becomes active
                  immediately.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="px-6 py-7 lg:px-7 lg:py-9">
          <div className="rounded-[1.7rem] border border-[rgba(27,59,43,0.1)] bg-[rgba(255,255,255,0.52)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[rgba(27,59,43,0.08)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#1b3b2b]">
                Priority 2
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7a6b55]">Password gate</span>
            </div>

            <h2 className="font-display mt-4 text-3xl font-semibold text-[#274534]">Unlock the MFA stage</h2>
            <p className="mt-3 text-sm leading-7 text-[#5f6e63]">
              This secondary step proves password possession first. Once accepted, the MFA panel on the left becomes the
              active checkpoint.
            </p>

            {mfaActive ? (
              <div className="mt-6 rounded-[1.25rem] border border-[rgba(33,113,72,0.16)] bg-[linear-gradient(180deg,rgba(232,244,236,0.98),rgba(246,252,248,0.94))] px-4 py-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1d5d3f]">Password accepted</p>
                <p className="mt-2 text-sm leading-7 text-[#466452]">
                  Continue with the primary MFA panel to finish opening the admin workspace.
                </p>
              </div>
            ) : (
              <form action="/api/admin/login" method="post" className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-bold text-[#32473b]">
                  Admin password
                  <input
                    type="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    className="rounded-[1rem] border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-[#173929] outline-none ring-[#c98618] placeholder:text-[#9aa698] focus:ring-2"
                    placeholder="Enter shared admin password"
                  />
                </label>
                <button
                  className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#214939,#173929)] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#faf6ea] shadow-[0_14px_28px_rgba(23,57,41,0.18)] transition hover:brightness-105"
                  type="submit"
                >
                  Continue
                </button>
              </form>
            )}

            <div className="mt-6 rounded-[1.2rem] bg-[rgba(243,236,223,0.8)] px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8a5700]">Security note</p>
              <p className="mt-2 text-sm leading-7 text-[#6f6044]">
                Public pages remain open. Only the admin console is protected, and every new admin session still requires
                both password and MFA before access is granted.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
