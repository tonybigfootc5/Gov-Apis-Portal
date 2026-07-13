"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  IndianRupee,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import type { PaymentAdminRecord } from "@/lib/training-application-store";

type Props = {
  databaseConfigured: boolean;
  initialPayments: PaymentAdminRecord[];
};

type PaymentTab = "confirmations" | "refunds" | "history";

export function PaymentAdminPanel({ databaseConfigured, initialPayments }: Props) {
  const [payments, setPayments] = useState(initialPayments);
  const [tab, setTab] = useState<PaymentTab>("confirmations");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredPayments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return payments;

    return payments.filter((payment) =>
      [
        payment.application.candidateName,
        payment.application.serviceName,
        payment.application.phone,
        payment.application.email,
        payment.merchantOrderId,
        payment.paymentReference ?? "",
        payment.status,
      ].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [payments, query]);

  const pendingConfirmations = filteredPayments.filter((payment) =>
    ["CREATED", "PENDING", "FAILED", "EXPIRED"].includes(payment.status),
  );
  const refundCandidates = filteredPayments.filter(
    (payment) => payment.refundEligible || payment.refunds.length > 0,
  );
  const paidPayments = filteredPayments.filter((payment) => payment.status === "PAID");
  const failedPayments = filteredPayments.filter((payment) => ["FAILED", "EXPIRED"].includes(payment.status));
  const totalAmountPaise = filteredPayments.reduce((total, payment) => total + payment.amountPaise, 0);
  const paidAmountPaise = paidPayments.reduce((total, payment) => total + payment.amountPaise, 0);
  const refundAmountPaise = filteredPayments.reduce(
    (total, payment) => total + payment.refunds.reduce((sum, refund) => sum + refund.amountPaise, 0),
    0,
  );
  const successRate = filteredPayments.length ? Math.round((paidPayments.length / filteredPayments.length) * 100) : 0;
  const activePayments = tab === "confirmations" ? pendingConfirmations : tab === "refunds" ? refundCandidates : filteredPayments;
  const recentPaymentBars = buildPaymentBars(filteredPayments);
  const maxBarAmount = Math.max(...recentPaymentBars.map((bar) => bar.amountPaise), 1);
  const latestPayment = filteredPayments[0] ?? null;
  const eventCount = filteredPayments.reduce((total, payment) => total + payment.events.length, 0);

  async function reload() {
    if (!databaseConfigured) {
      setNotice("Payments stay read-only locally until DATABASE_URL is configured.");
      return;
    }

    const response = await fetch("/api/admin/payments");
    if (!response.ok) {
      setNotice("Unable to refresh payments right now.");
      return;
    }

    setPayments(await response.json());
  }

  async function refreshPayment(orderId: string) {
    if (!databaseConfigured) {
      setNotice("Payments stay read-only locally until DATABASE_URL is configured.");
      return;
    }

    setLoadingId(orderId);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/payments/${orderId}/refresh`, {
        method: "POST",
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setNotice(body?.error ?? "Unable to refresh payment status.");
        return;
      }

      await reload();
    } finally {
      setLoadingId(null);
    }
  }

  async function initiateRefund(orderId: string) {
    const reason = window.prompt("Enter a short refund note for this payment.");
    if (!reason?.trim()) return;

    setLoadingId(orderId);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/refunds/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setNotice(body?.error ?? "Unable to start the refund.");
        return;
      }

      await reload();
      setNotice("Refund request sent to PhonePe.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="grid gap-4">
      {notice ? (
        <p className="rounded-[1.2rem] bg-white px-4 py-3 text-sm font-semibold text-[#173f33] shadow-[0_12px_28px_rgba(23,63,51,0.06)]">
          {notice}
        </p>
      ) : null}

      <div className="rounded-[1.55rem] bg-white p-3 shadow-[0_12px_30px_rgba(23,63,51,0.06)]">
        <div className="grid gap-3 xl:grid-cols-[minmax(18rem,1fr)_auto] xl:items-center">
          <label className="flex min-w-[18rem] items-center rounded-[0.9rem] border border-[#e5ebe6] bg-[#fbfdfb] px-4">
            <Search className="h-4 w-4 text-[#718477]" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search applicant, order, reference"
              className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#173f33] outline-none placeholder:text-[#90a094]"
            />
          </label>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex rounded-[0.95rem] bg-[#eef3ef] p-1">
              {([
                ["confirmations", "Confirmations"],
                ["refunds", "Refunds"],
                ["history", "History"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={`rounded-[0.75rem] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] ${
                    tab === value
                      ? "bg-[#173f33] text-[#fff9ec]"
                      : "text-[#607366] hover:bg-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!databaseConfigured}
              onClick={() => void reload()}
              className="inline-flex h-11 items-center gap-2 rounded-[0.9rem] bg-[#f5c65e] px-4 text-sm font-black text-[#173f33] shadow-[0_10px_22px_rgba(217,147,31,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <PaymentMetricCard icon={<WalletCards className="h-4 w-4" aria-hidden="true" />} label="Orders" value={filteredPayments.length.toLocaleString("en-IN")} hint={`${pendingConfirmations.length} pending`} />
            <PaymentMetricCard icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />} label="Paid" value={paidPayments.length.toLocaleString("en-IN")} hint={`${successRate}% success`} />
            <PaymentMetricCard icon={<IndianRupee className="h-4 w-4" aria-hidden="true" />} label="Collected" value={formatMoney(paidAmountPaise)} hint="Confirmed" />
            <PaymentMetricCard icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />} label="Failed" value={failedPayments.length.toLocaleString("en-IN")} hint="Needs sync" />
            <PaymentMetricCard icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />} label="Refunds" value={formatMoney(refundAmountPaise)} hint={`${refundCandidates.length} tracked`} />
          </div>

          <section className="rounded-[1.55rem] bg-white p-4 shadow-[0_14px_34px_rgba(23,63,51,0.07)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9c6a18]">Payment movement</p>
                <h3 className="mt-1 text-xl font-black text-[#173f33]">{formatMoney(totalAmountPaise)} total order value</h3>
              </div>
              <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-[11px] font-black text-[#607366]">Last 7 days</span>
            </div>
            <div className="mt-5 h-52 rounded-[1.15rem] bg-[#f7faf7] p-4">
              <div className="flex h-full items-end gap-3">
                {recentPaymentBars.map((bar) => (
                  <div key={bar.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                    <div className="flex flex-1 items-end rounded-full bg-white px-1.5 py-1.5">
                      <div
                        className="w-full rounded-full bg-[#173f33] shadow-[0_10px_20px_rgba(23,63,51,0.16)]"
                        style={{ height: `${Math.max(8, (bar.amountPaise / maxBarAmount) * 100)}%` }}
                      />
                    </div>
                    <span className="whitespace-pre-line text-center text-[10px] font-black text-[#718477]">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[1.55rem] bg-white shadow-[0_14px_34px_rgba(23,63,51,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2ee] px-4 py-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9c6a18]">{tab}</p>
                <h3 className="mt-1 text-xl font-black text-[#173f33]">{activePayments.length} payment records</h3>
              </div>
              <StatusBadge label={databaseConfigured ? "Gateway connected" : "Local read-only"} tone={databaseConfigured ? "good" : "warn"} />
            </div>

            {activePayments.length ? (
              <div className="overflow-x-auto">
                <div className="min-w-[66rem]">
                  <div className="grid grid-cols-[1.35fr_1.15fr_0.9fr_0.85fr_0.9fr_1fr_0.75fr] gap-3 border-b border-[#edf2ee] px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#718477]">
                    <span>Student</span>
                    <span>Order</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span>Gateway</span>
                    <span>Updated</span>
                    <span className="text-right">Action</span>
                  </div>
                  {activePayments.map((payment) => (
                    <PaymentRow
                      key={payment.id}
                      payment={payment}
                      loading={loadingId === payment.id}
                      tab={tab}
                      onRefresh={() => void refreshPayment(payment.id)}
                      onRefund={() => void initiateRefund(payment.id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState message={tab === "confirmations" ? "No pending or failed gateway confirmations need attention." : tab === "refunds" ? "No paid orders are currently eligible for refunds." : "No payment history matches the current search."} />
            )}
          </section>
        </div>

        <aside className="grid gap-4">
          <section className="rounded-[1.55rem] bg-[#173f33] p-4 text-[#fff9ec] shadow-[0_14px_34px_rgba(23,63,51,0.14)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[0.9rem] bg-[#f5c65e] text-[#173f33]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-black">Gateway desk</p>
                <p className="text-xs font-semibold text-[#cbd8ce]">{databaseConfigured ? "Live database mode" : "Local preview mode"}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <SideStat label="Latest order" value={latestPayment ? latestPayment.status : "None"} />
              <SideStat label="Gateway events" value={eventCount.toLocaleString("en-IN")} />
              <SideStat label="Refund candidates" value={refundCandidates.length.toLocaleString("en-IN")} />
            </div>
          </section>

          <section className="rounded-[1.55rem] bg-white p-4 shadow-[0_14px_34px_rgba(23,63,51,0.07)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#173f33]">Audit readiness</h3>
              <BarChart3 className="h-4 w-4 text-[#9c6a18]" aria-hidden="true" />
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-[1rem] border-[#173f33] bg-[#fff8df]">
                <span className="text-2xl font-black text-[#173f33]">{successRate}%</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs font-semibold text-[#607366]">Paid orders as a share of visible payment records.</p>
          </section>
        </aside>
      </div>
    </section>
  );
}

function PaymentMetricCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[1.1rem] bg-white p-4 shadow-[0_12px_30px_rgba(23,63,51,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-[0.8rem] bg-[#fff8df] text-[#9c6a18]">{icon}</span>
        <span className="rounded-full bg-[#eef3ef] px-2 py-1 text-[10px] font-black text-[#607366]">{hint}</span>
      </div>
      <p className="mt-4 text-2xl font-black leading-none text-[#173f33]">{value}</p>
      <p className="mt-2 text-xs font-semibold text-[#607366]">{label}</p>
    </div>
  );
}

function PaymentRow({
  payment,
  loading,
  tab,
  onRefresh,
  onRefund,
}: {
  payment: PaymentAdminRecord;
  loading: boolean;
  tab: PaymentTab;
  onRefresh: () => void;
  onRefund: () => void;
}) {
  const latestRefund = payment.refunds[0];
  const canRefund = tab === "refunds" && payment.refundEligible;

  return (
    <div className="grid grid-cols-[1.35fr_1.15fr_0.9fr_0.85fr_0.9fr_1fr_0.75fr] items-center gap-3 border-b border-[#edf2ee] px-4 py-3 text-sm last:border-b-0 hover:bg-[#fbf7ee]">
      <div className="min-w-0">
        <p className="truncate font-black text-[#173f33]">{payment.application.candidateName}</p>
        <p className="mt-1 truncate text-xs font-semibold text-[#718477]">{payment.application.serviceName}</p>
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-black text-[#173f33]">{payment.merchantOrderId}</p>
        <p className="mt-1 truncate text-xs font-semibold text-[#718477]">{payment.paymentReference || "Reference pending"}</p>
      </div>
      <span className="font-black text-[#173f33]">{formatMoney(payment.amountPaise)}</span>
      <StatusBadge label={payment.status} tone={payment.status === "PAID" ? "good" : payment.status === "FAILED" || payment.status === "EXPIRED" ? "bad" : "warn"} />
      <span className="text-xs font-semibold text-[#607366]">{payment.latestEventName || payment.environment}</span>
      <span className="text-xs font-semibold text-[#607366]">{formatDate(payment.updatedAt)}{latestRefund ? ` / refund ${latestRefund.status}` : ""}</span>
      <button
        type="button"
        disabled={loading}
        onClick={canRefund ? onRefund : onRefresh}
        className="justify-self-end rounded-full bg-[#173f33] px-3 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#fff9ec] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Working" : canRefund ? "Refund" : "Sync"}
      </button>
    </div>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: "good" | "warn" | "bad" }) {
  return (
    <span
      className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${
        tone === "good"
          ? "bg-[#eef8f1] text-[#1f6b4b]"
          : tone === "bad"
            ? "bg-[#fff0ec] text-[#a74224]"
            : "bg-[#fff5e7] text-[#9c6a18]"
      }`}
    >
      {label.replaceAll("_", " ")}
    </span>
  );
}

function SideStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] bg-[rgba(255,255,255,0.08)] px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#f5c65e]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#fff9ec]">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-12 text-center text-sm font-semibold text-[#607366]">
      {message}
    </div>
  );
}

function buildPaymentBars(payments: PaymentAdminRecord[]) {
  const formatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" });
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return { key, label: formatter.format(date).replace(" ", "\n"), amountPaise: 0 };
  });

  for (const payment of payments) {
    const key = payment.createdAt.slice(0, 10);
    const match = days.find((day) => day.key === key);
    if (match) match.amountPaise += payment.amountPaise;
  }

  return days;
}

function formatMoney(amountPaise: number) {
  return `Rs. ${(amountPaise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null) {
  if (!value) return "Pending";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
