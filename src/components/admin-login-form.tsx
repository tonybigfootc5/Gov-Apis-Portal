"use client";

type Props = {
  configMessage: string | null;
  teamDomain: string | null;
  sandboxMode: boolean;
  errorCode?: string;
};

const errorCopy: Record<string, string> = {
  "invalid-secret": "Invalid sandbox admin secret. Please try again.",
};

export function AdminLoginForm({ configMessage, teamDomain, sandboxMode, errorCode }: Props) {
  const errorMessage = errorCode ? errorCopy[errorCode] ?? "Admin access failed. Please try again." : null;

  if (sandboxMode) {
    return (
      <div className="glass-panel w-full rounded-[1.6rem] p-6 shadow-[0_26px_60px_rgba(64,44,8,0.12)]">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">Sandbox Only</p>
        <h1 className="font-display mt-2 text-4xl font-semibold text-[#ffd485]">Sandbox admin access</h1>
        <p className="mt-4 text-sm leading-7 text-[#eadfcf]">
          This temporary admin login is enabled only for sandbox testing while the real Cloudflare-protected hostname is being prepared.
        </p>

        {errorMessage ? (
          <p className="mt-4 rounded-lg border border-[rgba(255,180,171,0.28)] bg-[rgba(157,61,33,0.18)] px-3 py-2 text-sm font-semibold text-[#ffd1c7]">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-5 rounded-[1.2rem] border border-[rgba(255,212,133,0.2)] bg-[rgba(255,248,230,0.92)] px-4 py-4 text-sm leading-7 text-[#735f40]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c07b14]">Temporary bypass</p>
          <p className="mt-3">Enter the sandbox admin secret to unlock `/admin` in this environment.</p>
          {configMessage ? <p className="mt-3 text-[#9d3d21]">{configMessage}</p> : null}
        </div>

        <form action="/api/admin/login" method="post" className="mt-5 grid gap-3">
          <label className="grid gap-2 text-sm font-bold text-[#d4c4ac]">
            Sandbox admin secret
            <input
              type="password"
              name="secret"
              required
              autoComplete="current-password"
              className="w-full rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2"
            />
          </label>
          <button
            className="hex-soft inline-flex w-full items-center justify-center rounded-full bg-[#f4b315] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#271900]"
            type="submit"
          >
            Enter sandbox admin
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="glass-panel w-full rounded-[1.6rem] p-6 shadow-[0_26px_60px_rgba(64,44,8,0.12)]">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">Restricted</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-[#ffd485]">Cloudflare Trust</h1>
      <p className="mt-4 text-sm leading-7 text-[#eadfcf]">
        Admin access is no longer handled by application passwords or MFA codes. Use the Cloudflare Access gate in front of
        the admin area.
      </p>

      <div className="mt-5 rounded-[1.2rem] border border-[rgba(255,212,133,0.2)] bg-[rgba(255,248,230,0.92)] px-4 py-4 text-sm leading-7 text-[#735f40]">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c07b14]">Access route</p>
        <p className="mt-3">Open `/admin` to enter through Cloudflare Trust.</p>
        {teamDomain ? <p className="mt-2">Team domain: {teamDomain}</p> : null}
        {configMessage ? <p className="mt-3 text-[#9d3d21]">{configMessage}</p> : null}
      </div>

      <div className="mt-5 grid gap-3">
        <a
          href="/admin"
          className="hex-soft inline-flex w-full items-center justify-center rounded-full bg-[#f4b315] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#271900]"
        >
          Open admin through Access
        </a>
        <a
          href="/cdn-cgi/access/logout"
          className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(255,212,133,0.2)] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#d4c4ac]"
        >
          Log out of Cloudflare Access
        </a>
      </div>
    </div>
  );
}
