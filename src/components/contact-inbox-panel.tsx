"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Mail, Phone, Search, SlidersHorizontal, UserRound } from "lucide-react";
import type { ContactInboxRecord } from "@/lib/contact-inbox";

type Props = {
  messages: ContactInboxRecord[];
  loading: boolean;
};

export function ContactInboxPanel({ messages, loading }: Props) {
  const [query, setQuery] = useState("");
  const [openMessageId, setOpenMessageId] = useState<string>(messages[0]?.id ?? "");
  const [now] = useState(() => Date.now());
  const activeOpenMessageId =
    openMessageId && messages.some((message) => message.id === openMessageId)
      ? openMessageId
      : messages[0]?.id ?? "";

  const filteredMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return messages;

    return messages.filter((message) =>
      [
        message.name,
        message.email,
        message.phone ?? "",
        message.subject,
        message.message,
        formatDateTime(message.createdAt),
      ].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [messages, query]);

  const totalThisWeek = useMemo(() => {
    return messages.filter((message) => now - new Date(message.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000).length;
  }, [messages, now]);

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return messages.filter((message) => message.createdAt.slice(0, 10) === today).length;
  }, [messages]);

  const phoneSharedCount = filteredMessages.filter((message) => Boolean(message.phone)).length;
  const phoneSharePercent = filteredMessages.length ? Math.round((phoneSharedCount / filteredMessages.length) * 100) : 0;

  return (
    <div className="rounded-[1.8rem] bg-[radial-gradient(circle_at_85%_12%,rgba(245,198,94,0.34),transparent_30%),linear-gradient(135deg,#fbfdfb_0%,#fff8df_100%)] p-4 shadow-[0_24px_55px_rgba(23,63,51,0.10)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">Contact desk</p>
          <h2 className="mt-2 text-3xl font-black text-[#173f33]">Incoming inquiries</h2>
        </div>
        <div className="flex rounded-full bg-white/75 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
          <span className="rounded-full bg-[#173f33] px-4 py-2 text-xs font-black text-[#fff9ec]">Inbox</span>
          <span className="px-4 py-2 text-xs font-black text-[#607366]">Manual follow-up</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,0.36fr)_minmax(13rem,0.36fr)]">
        <MetricStrip label="Messages" primary={`${filteredMessages.length}`} secondary={`${todayCount} today`} fill="100%" />
        <MetricStrip label="Phone shared" primary={`${phoneSharedCount}`} secondary={`${phoneSharePercent}% reachable`} fill={`${phoneSharePercent}%`} />
        <MetricStrip label="This week" primary={`${totalThisWeek}`} secondary="30-day inbox" fill={`${Math.min(100, totalThisWeek * 12)}%`} />
      </div>

      <div className="mt-5 rounded-[1.35rem] bg-white/82 p-3 shadow-[0_14px_34px_rgba(23,63,51,0.06)]">
        <div className="flex flex-wrap items-center gap-2">
          <ToolbarPill label="Columns" />
          <ToolbarPill label="Source" />
          <ToolbarPill label="Status" />
          <ToolbarPill label="Follow-up" />
          <label className="ml-auto flex min-w-[16rem] flex-1 items-center rounded-full bg-white px-4 shadow-[inset_0_0_0_1px_#edf2ee] lg:max-w-md">
            <Search className="h-4 w-4 text-[#718477]" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#173f33] outline-none placeholder:text-[#90a094]"
            />
          </label>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5c65e] text-[#173f33]" type="button" aria-label="Inbox filter options">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-[1.35rem] bg-white shadow-[0_18px_42px_rgba(23,63,51,0.10)]">
        {filteredMessages.length ? (
          <div className="overflow-x-auto">
            <div className="min-w-[70rem]">
              <div className="grid grid-cols-[0.35fr_1.15fr_1.1fr_1.35fr_1.3fr_0.95fr_0.78fr_0.28fr] gap-3 border-b border-[#edf2ee] px-4 py-4 text-[10px] font-black uppercase tracking-[0.13em] text-[#718477]">
                <span />
                <span>Name</span>
                <span>Phone</span>
                <span>Email</span>
                <span>Subject</span>
                <span>Received</span>
                <span>Status</span>
                <span />
              </div>
              {filteredMessages.map((message, index) => {
                const isOpen = activeOpenMessageId === message.id;

                return (
                  <article key={message.id} className="border-b border-[#edf2ee] last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenMessageId((current) => (current === message.id ? "" : message.id))}
                      className={`grid w-full grid-cols-[0.35fr_1.15fr_1.1fr_1.35fr_1.3fr_0.95fr_0.78fr_0.28fr] items-center gap-3 px-4 py-3 text-left transition ${
                        isOpen ? "bg-[#f5c65e] text-[#173f33]" : "bg-white text-[#173f33] hover:bg-[#fffaf0]"
                      }`}
                    >
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-[0.35rem] border ${
                        isOpen ? "border-[#173f33] bg-[#173f33]" : "border-[#dfe7e2]"
                      }`}>
                        {isOpen ? <span className="h-2 w-2 rounded-sm bg-[#f5c65e]" /> : null}
                      </span>
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173f33] text-xs font-black text-[#fff9ec]">
                          {initials(message.name, index)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">{message.name}</p>
                          <p className="mt-1 truncate text-xs font-semibold opacity-70">Inquiry #{String(index + 1).padStart(2, "0")}</p>
                        </div>
                      </div>
                      <span className="truncate text-sm font-semibold">{message.phone || "Not shared"}</span>
                      <span className="truncate text-xs font-semibold opacity-75">{message.email}</span>
                      <span className="truncate text-sm font-semibold">{message.subject}</span>
                      <span className="text-xs font-semibold opacity-75">{formatDateTime(message.createdAt)}</span>
                      <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${
                        message.phone ? "bg-[#eef8f1] text-[#1f6b4b]" : "bg-[#fff0ec] text-[#a74224]"
                      }`}>
                        {message.phone ? "Callable" : "Email only"}
                      </span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 justify-self-end text-[#173f33]">
                        {isOpen ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="grid gap-4 bg-[#fffdf8] px-4 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)]">
                        <div className="rounded-[1.1rem] border border-[#e5ebe6] bg-white p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Message</p>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#173f33]">{message.message}</p>
                        </div>
                        <div className="grid gap-3">
                          <InfoTile icon={<Phone className="h-4 w-4" aria-hidden="true" />} label="Phone" value={message.phone || "Phone not shared"} />
                          <InfoTile icon={<Mail className="h-4 w-4" aria-hidden="true" />} label="Email" value={message.email} />
                          <InfoTile icon={<UserRound className="h-4 w-4" aria-hidden="true" />} label="Future field" value="Owner, status, and notes can plug in here later." />
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="px-4 py-12 text-center text-sm font-semibold text-[#607366]">
            {loading ? "Loading inbox..." : "No contact messages in the current 30-day window."}
          </div>
        )}
      </section>
    </div>
  );
}

function MetricStrip({
  label,
  primary,
  secondary,
  fill,
}: {
  label: string;
  primary: string;
  secondary: string;
  fill: string;
}) {
  return (
    <div className="rounded-[1.1rem] bg-white/72 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#607366]">{label}</p>
          <p className="mt-1 text-lg font-black text-[#173f33]">{primary}</p>
        </div>
        <p className="text-xs font-black text-[#607366]">{secondary}</p>
      </div>
      <div className="mt-3 h-6 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-[#f5c65e]" style={{ width: fill }} />
      </div>
    </div>
  );
}

function ToolbarPill({ label }: { label: string }) {
  return (
    <button type="button" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-3 text-xs font-black text-[#607366] shadow-[inset_0_0_0_1px_#edf2ee]">
      {label}
      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.05rem] border border-[#e5ebe6] bg-white p-3">
      <div className="flex items-center gap-2 text-[#9c6a18]">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.14em]">{label}</p>
      </div>
      <p className="mt-2 break-words text-sm font-semibold text-[#173f33]">{value}</p>
    </div>
  );
}

function initials(name: string, index: number) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const value = parts.length > 1 ? `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}` : parts[0]?.slice(0, 2) ?? "";
  return (value || String(index + 1).padStart(2, "0")).toUpperCase();
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
