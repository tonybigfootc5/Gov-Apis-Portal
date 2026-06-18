"use client";

type Props = {
  configMessage: string | null;
  teamDomain: string | null;
};

export function AdminLoginForm({ configMessage, teamDomain }: Props) {
  return (
    <div className="glass-panel w-full rounded-[1.6rem] p-6 shadow-[0_26px_60px_rgba(64,44,8,0.12)]">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">Restricted</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-[#ffd485]">Cloudflare Trust</h1>
      <p className="mt-4 text-sm leading-7 text-[#eadfcf]">
        Admin access for both sandbox and production is handled by Cloudflare Access. Sign in through the Access gate and
        complete MFA there before entering the admin area.
      </p>

      <div className="mt-5 rounded-[1.2rem] border border-[rgba(255,212,133,0.2)] bg-[rgba(255,248,230,0.92)] px-4 py-4 text-sm leading-7 text-[#735f40]">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c07b14]">Access route</p>
        <p className="mt-3">Open `/admin` to enter through Cloudflare Trust on whichever environment you are using.</p>
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
