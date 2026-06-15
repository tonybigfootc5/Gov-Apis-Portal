"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CalendarDays, ChevronDown, ChevronUp, Mail, Phone, Search, UserRound } from "lucide-react";
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

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
        <div className="rounded-[1.8rem] border border-[rgba(27,59,43,0.08)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(248,241,229,0.98))] p-5 shadow-[0_20px_46px_rgba(64,44,8,0.07)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9c6a18]">Contact inbox</p>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <p className="font-display text-5xl font-semibold leading-none text-[#173f33]">{messages.length}</p>
                <p className="pb-1 text-sm font-semibold text-[#607366]">messages in the 30-day window</p>
              </div>
            </div>
            <div className="grid min-w-[14rem] gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1.25rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">Today</p>
                <p className="mt-2 text-2xl font-black text-[#173f33]">{todayCount}</p>
              </div>
              <div className="rounded-[1.25rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">This week</p>
                <p className="mt-2 text-2xl font-black text-[#173f33]">{totalThisWeek}</p>
              </div>
            </div>
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8e84]" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, subject, phone, message"
              className="w-full rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] py-3 pl-11 pr-4 text-sm font-semibold text-[#173f33] outline-none ring-[#ebb428] focus:ring-2"
            />
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-[rgba(27,59,43,0.08)] bg-[#173f33] p-5 text-[#fff9ec] shadow-[0_20px_46px_rgba(23,63,51,0.16)]">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f5c65e]">Sorted</p>
          <p className="mt-3 font-display text-3xl font-semibold">Newest first</p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.08)] px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f5c65e]">Order</p>
              <p className="mt-2 text-sm font-semibold text-[#edf4ef]">Date and time descending</p>
            </div>
            <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.08)] px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f5c65e]">View</p>
              <p className="mt-2 text-sm font-semibold text-[#edf4ef]">Expanded student inquiry cards</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.8rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.58)] p-4 shadow-[0_16px_40px_rgba(64,44,8,0.06)]">
        <div className="max-h-[46rem] overflow-y-auto pr-1">
          <div className="grid gap-3">
            {filteredMessages.length ? (
              filteredMessages.map((message) => {
                const isOpen = activeOpenMessageId === message.id;

                return (
                  <article
                    key={message.id}
                    className={`overflow-hidden rounded-[1.5rem] border transition ${
                      isOpen
                        ? "border-[rgba(23,63,51,0.16)] bg-[#fffdf8] shadow-[0_18px_38px_rgba(64,44,8,0.08)]"
                        : "border-[rgba(27,59,43,0.08)] bg-[#faf7ef]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenMessageId((current) => (current === message.id ? "" : message.id))}
                      className="w-full px-5 py-4 text-left"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#f1e6c9] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">
                              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                              {formatDateTime(message.createdAt)}
                            </span>
                          </div>
                          <h3 className="mt-3 text-xl font-black text-[#173f33]">{message.name}</h3>
                          <p className="mt-1 text-sm font-semibold text-[#607366]">{message.subject}</p>
                        </div>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#173f33] text-[#fff9ec]">
                          {isOpen ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                        </span>
                      </div>
                    </button>

                    {isOpen ? (
                      <div className="border-t border-[rgba(27,59,43,0.08)] px-5 py-5">
                        <div className="grid gap-3 lg:grid-cols-3">
                          <InfoTile icon={<UserRound className="h-4 w-4" aria-hidden="true" />} label="Student" value={message.name} />
                          <InfoTile icon={<Mail className="h-4 w-4" aria-hidden="true" />} label="Email" value={message.email} />
                          <InfoTile icon={<Phone className="h-4 w-4" aria-hidden="true" />} label="Phone" value={message.phone || "Not shared"} />
                        </div>
                        <div className="mt-4 rounded-[1.35rem] border border-[rgba(27,59,43,0.08)] bg-[#f8f4ea] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">Message</p>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#173f33]">{message.message}</p>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[rgba(27,59,43,0.14)] bg-[#faf7ef] px-5 py-10 text-center text-sm font-semibold text-[#607366]">
                {loading ? "Loading inbox..." : "No contact messages in the current 30-day window."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
    <div className="rounded-[1.25rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-4">
      <div className="flex items-center gap-2 text-[#9c6a18]">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.18em]">{label}</p>
      </div>
      <p className="mt-3 break-words text-sm font-semibold text-[#173f33]">{value}</p>
    </div>
  );
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
