"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Copy, Mail, MailOpen, RefreshCw, Search } from "lucide-react";
import { applicationErrorGuide } from "@/lib/application-error-codes";
import type { ContactInboxRecord } from "@/lib/contact-inbox";

type Props = {
  messages: ContactInboxRecord[];
  loading: boolean;
  onRefresh?: () => void;
  readMessageIds: string[];
  onReadMessageIdsChange: (messageIds: string[]) => void;
};

const helpCenterSections = [
  {
    title: "Payment Search SOP",
    items: [
      "Search Payments by invoice number, PhonePe transaction ID, merchant order ID, PhonePe order ID, enrollment ID, applicant name, mobile number, Aadhaar number, program, or payment status.",
      "Every payment attempt has an invoice number, whether the gateway status is paid, failed, expired, pending, refunded, or refund failed.",
      "Open View in Payments to see Transaction first, then Logs, then Applicant details.",
    ],
  },
  {
    title: "Application Search SOP",
    items: [
      "Applications shows only successfully paid enrolled students.",
      "Enrollment IDs follow Program-Batch-MonthYear-StudentCode, for example BK-01-Aug26-0001.",
      "Search Applications by enrollment ID, application number, invoice number, transaction ID, Aadhaar number, applicant name, guardian name, phone, program, batch, or submission date.",
      "Failed, expired, rejected, and incomplete payment records stay in Payments instead of Applications.",
    ],
  },
  {
    title: "Enrollment Rule",
    items: [
      "No manual review, approval, rejection, or verification is needed.",
      "Successful payment automatically enrolls the student into the selected program.",
      "Honey Processing and Queen Bee/Royal Jelly programs stay closed until admin opens enrollment and sets a future batch date.",
    ],
  },
  {
    title: "QR Receipt Reader",
    items: [
      "Use Payments > Scan QR to upload a downloaded successful payment card image.",
      "The QR reader checks student name, Aadhaar, invoice, transaction number, amount, program, enrollment ID, and gateway references.",
      "If no admin record matches, search by the invoice or transaction number shown after scanning.",
    ],
  },
  {
    title: "Admin Access",
    items: [
      "Use the admin login page for dashboard access.",
      "If a password or login issue occurs, use the configured admin reset flow and keep backup codes offline.",
      "For security, do not share OTP, backup codes, gateway credentials, or admin session access with applicants.",
    ],
  },
];

const INBOX_PAGE_SIZE = 8;

export function ContactInboxPanel({ messages, loading, onRefresh, readMessageIds, onReadMessageIdsChange }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");
  const [page, setPage] = useState(1);
  const [openMessageId, setOpenMessageId] = useState<string>(messages[0]?.id ?? "");
  const [copiedLabel, setCopiedLabel] = useState("");
  const [now] = useState(() => Date.now());
  const readIds = useMemo(() => new Set(readMessageIds), [readMessageIds]);

  const filteredMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return messages.filter((message) => {
      const isRead = readIds.has(message.id);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "read" && isRead) ||
        (statusFilter === "unread" && !isRead);
      const matchesQuery =
        !normalizedQuery ||
        [
          message.name,
          message.email,
          message.phone ?? "",
          message.subject,
          message.message,
          formatDateTime(message.createdAt),
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesStatus && matchesQuery;
    });
  }, [messages, query, readIds, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredMessages.length / INBOX_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pagedMessages = filteredMessages.slice((currentPage - 1) * INBOX_PAGE_SIZE, currentPage * INBOX_PAGE_SIZE);
  const activeOpenMessageId =
    openMessageId && pagedMessages.some((message) => message.id === openMessageId)
      ? openMessageId
      : pagedMessages[0]?.id ?? "";

  const totalThisWeek = useMemo(() => {
    return messages.filter((message) => now - new Date(message.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000).length;
  }, [messages, now]);

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return messages.filter((message) => message.createdAt.slice(0, 10) === today).length;
  }, [messages]);

  const phoneSharedCount = filteredMessages.filter((message) => Boolean(message.phone)).length;
  const unreadCount = messages.filter((message) => !readIds.has(message.id)).length;

  function markMessage(messageId: string, read: boolean) {
    const next = new Set(readMessageIds);
    if (read) {
      next.add(messageId);
    } else {
      next.delete(messageId);
    }
    onReadMessageIdsChange(Array.from(next));
  }

  function markAllVisibleRead() {
    const next = new Set(readMessageIds);
    filteredMessages.forEach((message) => next.add(message.id));
    onReadMessageIdsChange(Array.from(next));
  }

  async function copyText(label: string, value: string) {
    if (!value.trim()) return;
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1400);
  }

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-[1.35rem] border border-[#e7eee8] bg-white shadow-[0_18px_42px_rgba(23,63,51,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef3ef] px-4 py-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">Contact desk</p>
            <h2 className="mt-1 text-2xl font-black text-[#173f33]">Incoming inquiries</h2>
            <p className="mt-1 text-xs font-semibold text-[#607366]">
              {filteredMessages.length} visible, {unreadCount} unread, {todayCount} today
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={markAllVisibleRead}
              className="inline-flex h-10 items-center gap-2 rounded-[0.7rem] bg-[#173f33] px-4 text-xs font-black uppercase tracking-[0.1em] text-[#fff9ec]"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Mark all as read
            </button>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[0.7rem] border border-[#e5ebe6] bg-[#fbfdfb] px-4 text-xs font-black uppercase tracking-[0.1em] text-[#173f33] disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={onRefresh}
              disabled={loading || !onRefresh}
            >
              <RefreshCw className={`h-4 w-4${loading ? " animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-[#eef3ef] bg-[#fbfdfb] px-4 py-3">
          <label className="flex min-w-[18rem] flex-1 items-center rounded-[0.75rem] bg-white px-4 shadow-[inset_0_0_0_1px_#e5ebe6] lg:max-w-xl">
            <Search className="h-4 w-4 text-[#718477]" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search name, email, phone, subject, message"
              className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#173f33] outline-none placeholder:text-[#90a094]"
            />
          </label>
          <div className="flex rounded-[0.8rem] bg-[#eef3ef] p-1">
            {([
              ["all", "All"],
              ["unread", "Unread"],
              ["read", "Read"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setStatusFilter(value);
                  setPage(1);
                }}
                className={`rounded-[0.65rem] px-3 py-2 text-[11px] font-black uppercase tracking-[0.1em] ${
                  statusFilter === value ? "bg-[#173f33] text-[#fff9ec]" : "text-[#607366] hover:bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <StatusChip label="30-day inbox" />
            <StatusChip label={`${phoneSharedCount} callable`} />
            <StatusChip label={`${totalThisWeek} this week`} />
          </div>
        </div>

        {filteredMessages.length ? (
          <div className="overflow-x-auto">
            <div className="min-w-[76rem]">
              <div className="grid grid-cols-[3rem_1.4fr_1.2fr_1.65fr_1.4fr_1.05fr_0.95fr_1.25fr] gap-4 border-b border-[#eef3ef] bg-white px-5 py-4 text-[11px] font-black text-[#2f3b45]">
                <span />
                <span>Name</span>
                <span>Phone</span>
                <span>Email</span>
                <span>Subject</span>
                <span>Received</span>
                <span>Status</span>
                <span className="text-right">Edit</span>
              </div>
              {pagedMessages.map((message, index) => {
                const absoluteIndex = (currentPage - 1) * INBOX_PAGE_SIZE + index;
                const isOpen = activeOpenMessageId === message.id;
                const isRead = readIds.has(message.id);

                return (
                  <article key={message.id} className={`${isOpen ? "ring-1 ring-[#2a86d8]" : ""}`}>
                    <div
                      className={`grid grid-cols-[3rem_1.4fr_1.2fr_1.65fr_1.4fr_1.05fr_0.95fr_1.25fr] items-center gap-4 border-b border-[#eef3ef] px-5 py-3 text-sm transition ${
                        isOpen ? "bg-[#eef6ff]" : isRead ? "bg-white hover:bg-[#fbfdfb]" : "bg-[#fffaf0] hover:bg-[#fff6df]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => markMessage(message.id, !isRead)}
                          aria-label={isRead ? "Mark unread" : "Mark read"}
                          className={`inline-flex h-5 w-5 items-center justify-center rounded border ${
                            isRead ? "border-[#1f6b4b] bg-[#1f6b4b] text-white" : "border-[#cfd8d2] bg-white text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenMessageId((current) => (current === message.id ? "" : message.id))}
                          aria-label={isOpen ? "Collapse enquiry" : "Expand enquiry"}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#607366] hover:bg-white"
                        >
                          {isOpen ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      </div>
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                          isRead ? "bg-[#eef3ef] text-[#607366]" : "bg-[#173f33] text-[#fff9ec]"
                        }`}>
                          {initials(message.name, absoluteIndex)}
                        </span>
                        <div className="min-w-0">
                          <p className={`truncate font-black ${isRead ? "text-[#607366]" : "text-[#173f33]"}`}>{message.name}</p>
                          <p className="mt-1 truncate text-xs font-semibold text-[#90a094]">Inquiry #{String(absoluteIndex + 1).padStart(2, "0")}</p>
                        </div>
                      </div>
                      <span className="truncate font-semibold text-[#607366]">{message.phone || "Not shared"}</span>
                      <span className="truncate font-semibold text-[#607366]">{message.email}</span>
                      <span className="truncate font-semibold text-[#607366]">{message.subject}</span>
                      <span className="text-xs font-semibold text-[#607366]">{formatDateTime(message.createdAt)}</span>
                      <span className={`w-fit rounded-md px-3 py-1.5 text-xs font-black ${
                        isRead ? "bg-[#e9f7ef] text-[#1f8f5f]" : "bg-[#fff3d6] text-[#9c6a18]"
                      }`}>
                        {isRead ? "Read" : "Unread"}
                      </span>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => markMessage(message.id, true)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-[0.65rem] bg-[#f7f9fb] text-[#607366] hover:bg-[#e9f7ef] hover:text-[#1f6b4b]"
                          aria-label="Mark as read"
                        >
                          <MailOpen className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => markMessage(message.id, false)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-[0.65rem] bg-[#f7f9fb] text-[#607366] hover:bg-[#fff3d6] hover:text-[#9c6a18]"
                          aria-label="Mark unread"
                        >
                          <Mail className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {isOpen ? (
                      <div className="grid gap-5 border-b border-[#2a86d8] bg-white px-5 py-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                        <ExpandedInfo label="Message" value={message.message} />
                        <div className="rounded-[1rem] border border-[#e5ebe6] bg-[#fbfdfb] p-4">
                          <p className="text-xs font-black text-[#2f3b45]">Copy details</p>
                          <div className="mt-3 grid gap-2">
                            <CopyTextButton label="Copy name" copied={copiedLabel === "name"} onClick={() => void copyText("name", message.name)} />
                            <CopyTextButton label="Copy phone" copied={copiedLabel === "phone"} disabled={!message.phone} onClick={() => void copyText("phone", message.phone ?? "")} />
                            <CopyTextButton label="Copy email" copied={copiedLabel === "email"} onClick={() => void copyText("email", message.email)} />
                          </div>
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
            {loading ? "Loading inbox..." : "No contact messages match this view."}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eef3ef] px-4 py-3">
          <p className="text-xs font-semibold text-[#607366]">
            Page {currentPage} of {pageCount} / showing {pagedMessages.length} of {filteredMessages.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage <= 1}
              className="inline-flex h-9 items-center gap-2 rounded-[0.65rem] border border-[#e5ebe6] bg-white px-3 text-xs font-black text-[#173f33] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 7).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-9 min-w-9 rounded-[0.65rem] px-3 text-xs font-black ${
                    currentPage === pageNumber ? "bg-[#173f33] text-[#fff9ec]" : "bg-[#f7f9fb] text-[#607366]"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              disabled={currentPage >= pageCount}
              className="inline-flex h-9 items-center gap-2 rounded-[0.65rem] border border-[#e5ebe6] bg-white px-3 text-xs font-black text-[#173f33] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-[1.35rem] bg-white p-4 shadow-[0_18px_42px_rgba(23,63,51,0.08)]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[0.85rem] bg-[#173f33] text-[#fff9ec]">
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Help Center</p>
            <h3 className="text-xl font-black text-[#173f33]">Admin SOP and search guide</h3>
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {helpCenterSections.map((section) => (
            <article key={section.title} className="rounded-[1rem] border border-[#e7eee8] bg-[#fbfdfb] p-3">
              <p className="text-sm font-black text-[#173f33]">{section.title}</p>
              <div className="mt-3 grid gap-2">
                {section.items.map((item) => (
                  <p key={item} className="text-xs font-semibold leading-5 text-[#607366]">{item}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 border-t border-[#edf2ee] pt-5">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Application error codes</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {applicationErrorGuide.map((item) => (
            <article key={item.code} className="rounded-[1rem] border border-[#e7eee8] bg-[#fbfdfb] p-3">
              <p className="text-xs font-black text-[#173f33]">{item.code}</p>
              <p className="mt-2 text-sm font-black text-[#173f33]">{item.summary}</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#607366]">{item.adminMeaning}</p>
            </article>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusChip({ label }: { label: string }) {
  return (
    <span className="inline-flex h-10 items-center rounded-full bg-white px-3 text-xs font-black text-[#607366] shadow-[inset_0_0_0_1px_#edf2ee]">
      {label}
    </span>
  );
}

function CopyTextButton({ label, copied, disabled = false, onClick }: { label: string; copied: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-10 items-center justify-between gap-3 rounded-[0.7rem] bg-white px-3 text-xs font-black text-[#173f33] shadow-[inset_0_0_0_1px_#e5ebe6] disabled:cursor-not-allowed disabled:opacity-45"
    >
      <span>{copied ? "Copied" : label}</span>
      <Copy className="h-4 w-4 text-[#9c6a18]" aria-hidden="true" />
    </button>
  );
}

function ExpandedInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black text-[#2f3b45]">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-7 text-[#607366]">{value}</p>
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
