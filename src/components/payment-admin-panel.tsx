"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Eye,
  IndianRupee,
  RefreshCw,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import type { PaymentAdminRecord } from "@/lib/training-application-store";

type Props = {
  databaseConfigured: boolean;
  initialPayments: PaymentAdminRecord[];
  onPaymentsChange?: (payments: PaymentAdminRecord[]) => void;
};

type PaymentTab = "confirmations" | "refunds" | "history";
type DetailTab = "transaction" | "applicant";

export function PaymentAdminPanel({ databaseConfigured, initialPayments, onPaymentsChange }: Props) {
  const [payments, setPayments] = useState(initialPayments);
  const [tab, setTab] = useState<PaymentTab>("confirmations");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentAdminRecord | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("transaction");

  function setPaymentRecords(nextPayments: PaymentAdminRecord[]) {
    setPayments(nextPayments);
    onPaymentsChange?.(nextPayments);
  }

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
      return null;
    }

    const response = await fetch("/api/admin/payments");
    if (!response.ok) {
      setNotice("Unable to refresh payments right now.");
      return null;
    }

    const nextPayments = (await response.json()) as PaymentAdminRecord[];
    setPaymentRecords(nextPayments);
    setSelectedPayment((current) => {
      if (!current) return current;
      return nextPayments.find((payment) => payment.id === current.id) ?? current;
    });
    return nextPayments;
  }

  async function refreshPayment(orderId: string) {
    if (!databaseConfigured) {
      setNotice("Payments stay read-only locally until DATABASE_URL is configured.");
      return null;
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
        return null;
      }

      return await reload();
    } finally {
      setLoadingId(null);
    }
  }

  async function openPaymentDetails(payment: PaymentAdminRecord) {
    setSelectedPayment(payment);
    setDetailTab("transaction");

    if (!databaseConfigured) return;

    setLoadingId(`view:${payment.id}`);
    try {
      const refreshedPayments = await refreshPayment(payment.id);
      const refreshedPayment = refreshedPayments?.find((item) => item.id === payment.id);
      if (refreshedPayment) setSelectedPayment(refreshedPayment);
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
                  <div className="grid grid-cols-[1.35fr_1.15fr_0.9fr_0.85fr_0.9fr_1fr_1fr] gap-3 border-b border-[#edf2ee] px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#718477]">
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
                      onView={() => void openPaymentDetails(payment)}
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

      {selectedPayment ? (
        <PaymentDetailModal
          payment={selectedPayment}
          detailTab={detailTab}
          loading={loadingId === `view:${selectedPayment.id}` || loadingId === selectedPayment.id}
          onTabChange={setDetailTab}
          onClose={() => setSelectedPayment(null)}
        />
      ) : null}
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
  onView,
}: {
  payment: PaymentAdminRecord;
  loading: boolean;
  tab: PaymentTab;
  onRefresh: () => void;
  onRefund: () => void;
  onView: () => void;
}) {
  const latestRefund = payment.refunds[0];
  const canRefund = tab === "refunds" && payment.refundEligible;

  return (
    <div className="grid grid-cols-[1.35fr_1.15fr_0.9fr_0.85fr_0.9fr_1fr_1fr] items-center gap-3 border-b border-[#edf2ee] px-4 py-3 text-sm last:border-b-0 hover:bg-[#fbf7ee]">
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
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onView}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#173f33]/12 bg-white px-3 text-[11px] font-black uppercase tracking-[0.08em] text-[#173f33] hover:bg-[#eef8f1]"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          View
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={canRefund ? onRefund : onRefresh}
          className="h-9 rounded-full bg-[#173f33] px-3 text-[11px] font-black uppercase tracking-[0.08em] text-[#fff9ec] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Working" : canRefund ? "Refund" : "Sync"}
        </button>
      </div>
    </div>
  );
}

function PaymentDetailModal({
  payment,
  detailTab,
  loading,
  onTabChange,
  onClose,
}: {
  payment: PaymentAdminRecord;
  detailTab: DetailTab;
  loading: boolean;
  onTabChange: (tab: DetailTab) => void;
  onClose: () => void;
}) {
  const latestEvent = payment.events[0] ?? null;
  const latestDetails = latestEvent?.details ?? null;
  const latestAttempt = latestDetails?.paymentDetails[0] ?? null;
  const transactionRows: Array<[string, string]> = [
    ["Merchant order", payment.merchantOrderId],
    ["PhonePe order", latestDetails?.orderId ?? "Not received"],
    ["Payment reference", payment.paymentReference ?? latestAttempt?.transactionId ?? "Reference pending"],
    ["Environment", payment.environment],
    ["Amount", formatMoney(payment.amountPaise)],
    ["Status", payment.status.replaceAll("_", " ")],
    ["Payment mode", latestAttempt?.paymentMode ?? "Not available"],
    ["Gateway state", latestDetails?.state ?? latestEvent?.state ?? "Not synced"],
    ["Error code", payment.latestErrorCode ?? latestDetails?.errorCode ?? "None"],
    ["Gateway detail", payment.latestErrorMessage ?? latestDetails?.detailedErrorCode ?? "None"],
    ["Paid at", formatDate(payment.paidAt)],
    ["Expires at", formatGatewayTime(latestDetails?.expireAt) ?? formatDate(payment.expiresAt)],
    ["Checkout link", payment.checkoutUrl ? "Available" : "Not stored"],
    ["Latest event", payment.latestEventName ?? "None"],
  ];
  const applicantRows: Array<[string, string]> = [
    ["Application code", payment.application.applicationCode ?? "Not assigned"],
    ["Student code", payment.application.studentCode ?? "Not assigned"],
    ["Batch", payment.application.batchCode ?? "Not assigned"],
    ["Batch sequence", payment.application.batchSequenceNumber ? String(payment.application.batchSequenceNumber) : "Not assigned"],
    ["Training", payment.application.serviceName],
    ["Application date", payment.application.applicationDate],
    ["Applicant name", payment.application.candidateName],
    ["Guardian name", payment.application.guardianName],
    ["Gender", payment.application.gender],
    ["Date of birth", payment.application.dateOfBirth],
    ["Mobile", payment.application.phone],
    ["Residence phone", payment.application.residencePhone || "Not provided"],
    ["Email", payment.application.email],
    ["Address", payment.application.addressLine],
    ["Mandal", payment.application.mandal],
    ["District", payment.application.district],
    ["State", payment.application.state],
    ["Pin code", payment.application.pinCode],
    ["Education", payment.application.educationQualification || "Not provided"],
    ["Occupation", payment.application.occupation || "Not provided"],
    ["Sponsoring organization", payment.application.sponsoringOrganization || "Not provided"],
    ["Photo file", payment.application.photoName || "Not provided"],
    ["Photo type", payment.application.photoType || "Not provided"],
    ["Attempt status", payment.application.attemptStatus.replaceAll("_", " ")],
    ["Approval status", payment.application.approvalStatus],
    ["Cross-check status", payment.application.crossCheckStatus],
    ["Approved at", formatDate(payment.application.approvedAt)],
    ["Approved by", payment.application.approvedBy ?? "Not approved"],
    ["Submitted at", formatDate(payment.application.createdAt)],
    ["Admin notes", payment.application.adminNotes || "No notes"],
  ];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#102119]/55 px-3 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Payment transaction details">
      <section className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[1.4rem] bg-[#fffdf8] shadow-[0_30px_90px_rgba(4,18,13,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e7eee8] bg-[#173f33] px-5 py-5 text-[#fff9ec]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[0.75rem] bg-[#f5c65e] text-[#173f33]">
                <ReceiptText className="h-4 w-4" aria-hidden="true" />
              </span>
              <StatusBadge label={payment.status} tone={payment.status === "PAID" ? "good" : payment.status === "FAILED" || payment.status === "EXPIRED" ? "bad" : "warn"} />
              {loading ? <span className="text-xs font-black uppercase tracking-[0.12em] text-[#f5c65e]">Refreshing gateway</span> : null}
            </div>
            <h3 className="mt-4 truncate text-2xl font-black">{payment.application.candidateName}</h3>
            <p className="mt-1 break-all text-xs font-semibold text-[#cbd8ce]">{payment.merchantOrderId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/18"
            aria-label="Close transaction details"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-7rem)] overflow-y-auto px-5 py-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onTabChange("transaction")}
              className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-black uppercase tracking-[0.1em] ${
                detailTab === "transaction" ? "bg-[#173f33] text-[#fff9ec]" : "bg-[#eef3ef] text-[#607366]"
              }`}
            >
              <ReceiptText className="h-4 w-4" aria-hidden="true" />
              Transaction
            </button>
            <button
              type="button"
              onClick={() => onTabChange("applicant")}
              className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-black uppercase tracking-[0.1em] ${
                detailTab === "applicant" ? "bg-[#173f33] text-[#fff9ec]" : "bg-[#eef3ef] text-[#607366]"
              }`}
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Applicant details
            </button>
          </div>

          {detailTab === "transaction" ? (
            <div className="mt-5 grid gap-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <ReadOnlyStat label="Amount" value={formatMoney(payment.amountPaise)} />
                <ReadOnlyStat label="Reference" value={payment.paymentReference ?? "Pending"} />
                <ReadOnlyStat label="Gateway event" value={payment.latestEventName ?? payment.environment} />
              </div>
              <DetailGrid rows={transactionRows} />
              <section className="rounded-[1.1rem] border border-[#e7eee8] bg-white">
                <div className="border-b border-[#e7eee8] px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Gateway event timeline</p>
                </div>
                {payment.events.length ? (
                  <div className="divide-y divide-[#eef3ef]">
                    {payment.events.map((event) => (
                      <div key={event.id} className="grid gap-3 px-4 py-4 lg:grid-cols-[12rem_minmax(0,1fr)]">
                        <div>
                          <p className="text-xs font-black text-[#173f33]">{event.eventName}</p>
                          <p className="mt-1 text-xs font-semibold text-[#607366]">{event.source} / {formatDate(event.receivedAt)}</p>
                        </div>
                        <div className="grid gap-2 text-xs font-semibold text-[#607366] sm:grid-cols-3">
                          <span>State: <strong className="text-[#173f33]">{event.details.state ?? event.state ?? "Unknown"}</strong></span>
                          <span>Mode: <strong className="text-[#173f33]">{event.details.paymentDetails[0]?.paymentMode ?? "None"}</strong></span>
                          <span>Error: <strong className="text-[#173f33]">{event.details.errorCode ?? "None"}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-4 py-8 text-center text-sm font-semibold text-[#607366]">No PhonePe status events have been stored for this order yet.</p>
                )}
              </section>
            </div>
          ) : (
            <div className="mt-5 grid gap-5">
              {payment.application.photoUrl ? (
                <a
                  href={payment.application.photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit rounded-full border border-[#173f33]/12 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#173f33]"
                >
                  Open applicant photo
                </a>
              ) : null}
              <DetailGrid rows={applicantRows} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ReadOnlyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(23,63,51,0.06)]">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8b7d6b]">{label}</p>
      <p className="mt-2 break-words text-base font-black text-[#173f33]">{value}</p>
    </div>
  );
}

function DetailGrid({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="grid overflow-hidden rounded-[1.1rem] border border-[#e7eee8] bg-white sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="min-w-0 border-b border-[#eef3ef] px-4 py-3 odd:sm:border-r">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8b7d6b]">{label}</p>
          <p className="mt-1 break-words text-sm font-semibold leading-6 text-[#173f33]">{value}</p>
        </div>
      ))}
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

function formatGatewayTime(value?: number | null) {
  if (!value) return null;
  const milliseconds = value > 10_000_000_000 ? value : value * 1000;
  return new Date(milliseconds).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
