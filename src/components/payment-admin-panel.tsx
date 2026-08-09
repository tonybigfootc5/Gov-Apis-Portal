"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Eye,
  IndianRupee,
  QrCode,
  RefreshCw,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldCheck,
  Upload,
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
type DetailTab = "transaction" | "logs" | "applicant";
type ReceiptQrPayload = {
  type?: string;
  status?: string;
  invoiceNumber?: string;
  fullName?: string;
  aadhaarNumber?: string;
  transactionNumber?: string;
  merchantOrderId?: string;
  gatewayReference?: string | null;
  amountPaid?: string;
  amountPaise?: number;
  currency?: string;
  program?: string;
  enrollmentId?: string;
  paidAt?: string | null;
  issuedAt?: string;
};

export function PaymentAdminPanel({ databaseConfigured, initialPayments, onPaymentsChange }: Props) {
  const [payments, setPayments] = useState(initialPayments);
  const [tab, setTab] = useState<PaymentTab>("history");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentAdminRecord | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("transaction");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanResult, setScanResult] = useState<ReceiptQrPayload | null>(null);

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
        payment.application.aadhaarNo,
        payment.application.studentCode ?? "",
        payment.invoiceNumber,
        payment.merchantOrderId,
        payment.phonePeOrderId ?? "",
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

  function openPaymentDetails(payment: PaymentAdminRecord, initialTab: DetailTab = "transaction") {
    setSelectedPayment(payment);
    setDetailTab(initialTab);
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

  async function scanReceiptImage(file: File) {
    setScanLoading(true);
    setScanError("");
    setScanResult(null);

    try {
      const decodedText = await decodeQrFromImage(file);
      const parsed = JSON.parse(decodedText) as ReceiptQrPayload;

      if (parsed.type !== "API_CULTURE_PAYMENT_SUCCESS" || parsed.status !== "PAID") {
        setScanError("This QR is not a successful API Culture payment receipt.");
        return;
      }

      setScanResult(parsed);
    } catch (error) {
      setScanError(error instanceof Error ? error.message : "Unable to read the QR from this image.");
    } finally {
      setScanLoading(false);
    }
  }

  const scannedPayment = scanResult
    ? payments.find(
        (payment) =>
          payment.invoiceNumber === scanResult.invoiceNumber ||
          payment.merchantOrderId === scanResult.merchantOrderId ||
          payment.paymentReference === scanResult.transactionNumber ||
          payment.application.studentCode === scanResult.enrollmentId,
      ) ?? null
    : null;

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
              placeholder="Search invoice, transaction, enrollment, applicant"
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
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-[0.9rem] border border-[#173f33]/12 bg-white px-4 text-sm font-black text-[#173f33] shadow-[0_10px_22px_rgba(23,63,51,0.06)] hover:bg-[#eef8f1]"
            >
              <QrCode className="h-4 w-4" aria-hidden="true" />
              Scan QR
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
            <PaymentMetricCard icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />} label="Failed" value={failedPayments.length.toLocaleString("en-IN")} hint="Needs attention" />
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
                  <div className="grid grid-cols-[1.35fr_1.15fr_1.05fr_0.9fr_0.85fr_0.9fr_1fr_0.85fr] gap-3 border-b border-[#edf2ee] px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#718477]">
                    <span>Student</span>
                    <span>Invoice</span>
                    <span>Transaction</span>
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
                      onRefund={() => void initiateRefund(payment.id)}
                      onView={() => openPaymentDetails(payment)}
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
      {scannerOpen ? (
        <ReceiptScannerModal
          loading={scanLoading}
          error={scanError}
          result={scanResult}
          matchedPayment={scannedPayment}
          onScan={(file) => void scanReceiptImage(file)}
          onClose={() => {
            setScannerOpen(false);
            setScanError("");
            setScanResult(null);
          }}
        />
      ) : null}
    </section>
  );
}

function ReceiptScannerModal({
  loading,
  error,
  result,
  matchedPayment,
  onScan,
  onClose,
}: {
  loading: boolean;
  error: string;
  result: ReceiptQrPayload | null;
  matchedPayment: PaymentAdminRecord | null;
  onScan: (file: File) => void;
  onClose: () => void;
}) {
  const rows: Array<[string, string]> = result
    ? [
        ["Full name", result.fullName ?? "Not included"],
        ["Aadhaar number", result.aadhaarNumber ?? "Not included"],
        ["Invoice number", result.invoiceNumber ?? "Not included"],
        ["Transaction number", result.transactionNumber ?? "Not included"],
        ["Gateway reference", result.gatewayReference ?? "Not received"],
        ["Amount paid", result.amountPaid ?? "Not included"],
        ["Program", result.program ?? "Not included"],
        ["Enrollment ID", result.enrollmentId ?? "Not included"],
        ["Merchant order", result.merchantOrderId ?? "Not included"],
        ["Paid at", formatDate(result.paidAt)],
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#102119]/55 px-3 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Scan successful payment QR">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[1.4rem] bg-[#fffdf8] shadow-[0_30px_90px_rgba(4,18,13,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e7eee8] bg-[#173f33] px-5 py-5 text-[#fff9ec]">
          <div className="min-w-0">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[0.8rem] bg-[#f5c65e] text-[#173f33]">
              <QrCode className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-2xl font-black">Receipt QR scanner</h3>
            <p className="mt-1 text-xs font-semibold text-[#cbd8ce]">Upload the downloaded success card image to read its verification QR.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/18"
            aria-label="Close QR scanner"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-7rem)] overflow-y-auto px-5 py-5">
          <label className="grid cursor-pointer place-items-center rounded-[1.1rem] border border-dashed border-[#b9c8bd] bg-white px-5 py-8 text-center hover:bg-[#fbf7ee]">
            <Upload className="h-8 w-8 text-[#9c6a18]" aria-hidden="true" />
            <span className="mt-3 text-sm font-black text-[#173f33]">{loading ? "Reading QR..." : "Upload receipt image"}</span>
            <span className="mt-1 text-xs font-semibold text-[#607366]">PNG, JPG, or screenshot from any device</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/*"
              className="sr-only"
              disabled={loading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onScan(file);
                event.currentTarget.value = "";
              }}
            />
          </label>

          {error ? (
            <p className="mt-4 rounded-[1rem] border border-[#f3b4a3] bg-[#fff0ec] px-4 py-3 text-sm font-semibold text-[#a74224]">{error}</p>
          ) : null}

          {result ? (
            <div className="mt-5 grid gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label="Successful receipt" tone="good" />
                <StatusBadge label={matchedPayment?.status ?? "No local match"} tone={matchedPayment?.status === "PAID" ? "good" : "warn"} />
              </div>
              <DetailGrid rows={rows} />
              {matchedPayment ? (
                <div className="rounded-[1rem] bg-[#eef8f1] px-4 py-3 text-sm font-semibold leading-6 text-[#1f6b4b]">
                  Matched admin record for {matchedPayment.application.candidateName} in {matchedPayment.application.serviceName}.
                </div>
              ) : (
                <div className="rounded-[1rem] bg-[#fff8df] px-4 py-3 text-sm font-semibold leading-6 text-[#7c5310]">
                  QR decoded successfully, but no visible payment record matched the order, transaction, or enrollment ID.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </div>
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
  onRefund,
  onView,
}: {
  payment: PaymentAdminRecord;
  loading: boolean;
  tab: PaymentTab;
  onRefund: () => void;
  onView: () => void;
}) {
  const latestRefund = payment.refunds[0];
  const canRefund = tab === "refunds" && payment.refundEligible;

  return (
    <div className="grid grid-cols-[1.35fr_1.15fr_1.05fr_0.9fr_0.85fr_0.9fr_1fr_0.85fr] items-center gap-3 border-b border-[#edf2ee] px-4 py-3 text-sm last:border-b-0 hover:bg-[#fbf7ee]">
      <div className="min-w-0">
        <p className="truncate font-black text-[#173f33]">{payment.application.candidateName}</p>
        <p className="mt-1 truncate text-xs font-semibold text-[#718477]">{payment.application.serviceName}</p>
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-black text-[#173f33]">{payment.invoiceNumber}</p>
        <p className="mt-1 truncate text-xs font-semibold text-[#718477]">{payment.merchantOrderId}</p>
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-black text-[#173f33]">{payment.paymentReference || "Reference pending"}</p>
        <p className="mt-1 truncate text-xs font-semibold text-[#718477]">{payment.phonePeOrderId || "PhonePe order pending"}</p>
      </div>
      <span className="font-black text-[#173f33]">{formatMoney(payment.amountPaise)}</span>
      <StatusBadge label={payment.status} tone={payment.status === "PAID" ? "good" : payment.status === "FAILED" || payment.status === "EXPIRED" ? "bad" : "warn"} />
      <span className="text-xs font-semibold text-[#607366]">{payment.latestEventName || payment.environment}</span>
      <span className="text-xs font-semibold text-[#607366]">{formatDate(payment.updatedAt)}{latestRefund ? ` / refund ${latestRefund.status}` : ""}</span>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onView}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#173f33]/12 bg-white px-2.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#173f33] hover:bg-[#eef8f1]"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          View
        </button>
        {canRefund ? (
          <button
            type="button"
            disabled={loading}
            onClick={onRefund}
            className="h-9 rounded-full bg-[#173f33] px-3 text-[11px] font-black uppercase tracking-[0.08em] text-[#fff9ec] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Working" : "Refund"}
          </button>
        ) : null}
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
  const diagnosis = buildPaymentDiagnosis(payment);
  const orderParameterRows: Array<[string, string]> = [
    ["Invoice number", payment.invoiceNumber],
    ["Internal payment id", payment.id],
    ["Provider", payment.provider],
    ["Environment", payment.environment],
    ["Currency", payment.currency],
    ["Merchant order", payment.merchantOrderId],
    ["PhonePe order", payment.phonePeOrderId ?? latestDetails?.orderId ?? "Not received"],
    ["Payment reference", payment.paymentReference ?? latestAttempt?.transactionId ?? "Reference pending"],
    ["Redirect URL", payment.redirectUrl],
    ["Checkout URL", payment.checkoutUrl ? "Stored" : "Not stored"],
    ["Created at", formatDate(payment.createdAt)],
    ["Updated at", formatDate(payment.updatedAt)],
    ["Paid at", formatDate(payment.paidAt)],
    ["Failed at", formatDate(payment.failedAt)],
    ["Expires at", formatGatewayTime(latestDetails?.expireAt) ?? formatDate(payment.expiresAt)],
    ["Latest event", payment.latestEventName ?? "None"],
    ["Latest error code", payment.latestErrorCode ?? latestDetails?.errorCode ?? "None"],
    ["Latest error detail", payment.latestErrorMessage ?? latestDetails?.detailedErrorCode ?? "None"],
  ];
  const transactionRows: Array<[string, string]> = [
    ["Invoice number", payment.invoiceNumber],
    ["Merchant order", payment.merchantOrderId],
    ["PhonePe order", payment.phonePeOrderId ?? latestDetails?.orderId ?? "Not received"],
    ["Payment reference", payment.paymentReference ?? latestAttempt?.transactionId ?? "Reference pending"],
    ["Environment", payment.environment],
    ["Amount", formatMoney(payment.amountPaise)],
    ["Currency", payment.currency],
    ["Status", payment.status.replaceAll("_", " ")],
    ["Payment mode", latestAttempt?.paymentMode ?? "Not available"],
    ["Gateway state", latestDetails?.state ?? latestEvent?.state ?? "Not synced"],
    ["Error code", payment.latestErrorCode ?? latestDetails?.errorCode ?? "None"],
    ["Gateway detail", payment.latestErrorMessage ?? latestDetails?.detailedErrorCode ?? "None"],
    ["Paid at", formatDate(payment.paidAt)],
    ["Failed at", formatDate(payment.failedAt)],
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
    ["Aadhaar number", payment.application.aadhaarNo || "Not available"],
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
            <p className="mt-1 break-all text-xs font-semibold text-[#cbd8ce]">{payment.invoiceNumber} / {payment.merchantOrderId}</p>
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
              onClick={() => onTabChange("logs")}
              className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-black uppercase tracking-[0.1em] ${
                detailTab === "logs" ? "bg-[#173f33] text-[#fff9ec]" : "bg-[#eef3ef] text-[#607366]"
              }`}
            >
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              Logs
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
          ) : detailTab === "logs" ? (
            <div className="mt-5 grid gap-5">
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
                <ReadOnlyStat label="Failure reason" value={diagnosis.reason} />
                <ReadOnlyStat label="Gateway source" value={diagnosis.source} />
                <ReadOnlyStat label="Next check" value={diagnosis.nextCheck} />
              </div>
              <section className="rounded-[1.1rem] border border-[#e7eee8] bg-white">
                <div className="border-b border-[#e7eee8] px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Diagnostic parameters</p>
                </div>
                <DetailGrid rows={orderParameterRows} />
              </section>
              <section className="rounded-[1.1rem] border border-[#e7eee8] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e7eee8] px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Transaction logs</p>
                  <span className="rounded-full bg-[#eef3ef] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#607366]">{payment.events.length} stored events</span>
                </div>
                {payment.events.length ? (
                  <div className="divide-y divide-[#eef3ef]">
                    {payment.events.map((event, index) => (
                      <PaymentLogEntry key={event.id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3 px-4 py-8 text-center">
                    <p className="text-sm font-black text-[#173f33]">No gateway events stored yet.</p>
                    <p className="text-xs font-semibold leading-6 text-[#607366]">Open the public return page or refresh the payment list after gateway reconciliation to see the latest PhonePe status in the audit trail.</p>
                  </div>
                )}
              </section>
              {payment.refunds.length ? (
                <section className="rounded-[1.1rem] border border-[#e7eee8] bg-white">
                  <div className="border-b border-[#e7eee8] px-4 py-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Refund logs</p>
                  </div>
                  <div className="divide-y divide-[#eef3ef]">
                    {payment.refunds.map((refund) => (
                      <div key={refund.id} className="grid gap-3 px-4 py-4 sm:grid-cols-2">
                        <ReadOnlyLine label="Merchant refund" value={refund.merchantRefundId} />
                        <ReadOnlyLine label="PhonePe refund" value={refund.phonePeRefundId ?? "Not received"} />
                        <ReadOnlyLine label="Status" value={refund.status} />
                        <ReadOnlyLine label="Amount" value={formatMoney(refund.amountPaise)} />
                        <ReadOnlyLine label="Reason" value={refund.reason} />
                        <ReadOnlyLine label="Failure" value={refund.failureCode ?? refund.failureMessage ?? "None"} />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
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

function PaymentLogEntry({ event, index }: { event: PaymentAdminRecord["events"][number]; index: number }) {
  const firstAttempt = event.details.paymentDetails[0] ?? null;
  const rows: Array<[string, string]> = [
    ["Log number", `#${index + 1}`],
    ["Stored event", event.eventName],
    ["Sync source", event.source],
    ["Stored state", event.state ?? "Unknown"],
    ["PhonePe state", event.details.state ?? "Unknown"],
    ["PhonePe order", event.details.orderId ?? "Not received"],
    ["Merchant order", event.details.merchantOrderId ?? "Not included in payload"],
    ["Transaction id", firstAttempt?.transactionId ?? "Not received"],
    ["Payment mode", firstAttempt?.paymentMode ?? "Not available"],
    ["Attempt state", firstAttempt?.state ?? "Not available"],
    ["Attempt amount", firstAttempt?.amount ? formatMoney(firstAttempt.amount) : "Not available"],
    ["Attempt timestamp", formatGatewayTime(firstAttempt?.timestamp) ?? "Not available"],
    ["Expire at", formatGatewayTime(event.details.expireAt) ?? "Not available"],
    ["Error code", event.details.errorCode ?? firstAttempt?.errorCode ?? "None"],
    ["Detailed error", event.details.detailedErrorCode ?? firstAttempt?.detailedErrorCode ?? "None"],
    ["Callback type", event.details.callbackType ?? "Not a callback payload"],
    ["Refund id", event.details.refundId ?? "None"],
    ["Merchant refund", event.details.merchantRefundId ?? "None"],
    ["Recorded at", formatDate(event.receivedAt)],
  ];

  return (
    <article className="px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#173f33]">{event.eventName}</p>
          <p className="mt-1 text-xs font-semibold text-[#607366]">{event.source} / {formatDate(event.receivedAt)}</p>
        </div>
        <StatusBadge
          label={event.details.errorCode ?? event.details.state ?? event.state ?? "log"}
          tone={event.details.errorCode ? "bad" : event.details.state === "COMPLETED" ? "good" : "warn"}
        />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([label, value]) => (
          <ReadOnlyLine key={label} label={label} value={value} />
        ))}
      </div>
      {event.details.paymentDetails.length > 1 ? (
        <div className="mt-4 rounded-[1rem] bg-[#fbf7ee] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8b7d6b]">Additional attempts</p>
          <div className="mt-3 grid gap-2">
            {event.details.paymentDetails.slice(1).map((attempt, attemptIndex) => (
              <p key={`${attempt.transactionId ?? "attempt"}-${attemptIndex}`} className="text-xs font-semibold leading-6 text-[#607366]">
                Attempt {attemptIndex + 2}: {attempt.paymentMode ?? "mode unknown"} / {attempt.state ?? "state unknown"} / {attempt.errorCode ?? "no error"} / {attempt.transactionId ?? "no transaction id"}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function ReadOnlyLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[0.85rem] bg-[#fbfdfb] px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8b7d6b]">{label}</p>
      <p className="mt-1 break-words text-xs font-semibold leading-5 text-[#173f33]">{value}</p>
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

async function decodeQrFromImage(file: File) {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await loadHtmlImage(imageUrl);
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("This browser could not prepare the image for scanning.");

    context.drawImage(image, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    const { default: jsQR } = await import("jsqr");
    const decoded = jsQR(imageData.data, imageData.width, imageData.height);

    if (!decoded?.data) {
      throw new Error("No QR code was found in this image.");
    }

    return decoded.data;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function loadHtmlImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load this image for QR scanning."));
    image.src = src;
  });
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

function buildPaymentDiagnosis(payment: PaymentAdminRecord) {
  const latestEvent = payment.events[0] ?? null;
  const details = latestEvent?.details ?? null;
  const errorCode = payment.latestErrorCode ?? details?.errorCode ?? "";
  const errorDetail = payment.latestErrorMessage ?? details?.detailedErrorCode ?? "";
  const paymentMode = details?.paymentDetails[0]?.paymentMode ?? "mode not captured";
  const source = latestEvent ? `${latestEvent.eventName} from ${latestEvent.source}` : payment.latestEventName ?? "No event stored";

  if (payment.status === "PAID") {
    return {
      reason: "Payment captured successfully.",
      source,
      nextCheck: "No failure action needed.",
    };
  }

  if (payment.status === "PENDING" || payment.status === "CREATED") {
    return {
      reason: "Gateway has not returned a final result yet.",
      source,
      nextCheck: "Use Sync to pull latest PhonePe status, especially for old pending orders.",
    };
  }

  if (errorCode === "TXN_CANCELLED" && errorDetail === "ORDER_CANCELLED_BY_USER") {
    return {
      reason: "Customer cancelled the checkout before completing payment.",
      source,
      nextCheck: "Ask the applicant to retry payment from a fresh application/payment link.",
    };
  }

  if (errorCode === "TXN_CANCELLED" && errorDetail === "REQUEST_CANCEL_BY_REQUESTEE") {
    return {
      reason: `Customer or payer cancelled the ${paymentMode} request.`,
      source,
      nextCheck: "Applicant should retry and approve the request in their UPI app before it expires.",
    };
  }

  if (errorCode === "WITHDRAWAL_LIMIT_EXCEEDED") {
    return {
      reason: "Bank/card/UPI withdrawal limit was exceeded.",
      source,
      nextCheck: "Applicant should use another instrument or retry after bank limit reset.",
    };
  }

  if (errorCode === "TXN_NOT_COMPLETED" || errorDetail === "TXN_AUTO_FAILED") {
    return {
      reason: `Gateway or bank auto-failed the ${paymentMode} attempt before completion.`,
      source,
      nextCheck: "Applicant can retry; check PhonePe dashboard if repeated for the same instrument.",
    };
  }

  if (payment.status === "EXPIRED") {
    return {
      reason: "Checkout expired before payment completion.",
      source,
      nextCheck: "Generate a new payment attempt for the applicant.",
    };
  }

  return {
    reason: errorCode || errorDetail ? `${errorCode || "Gateway issue"} / ${errorDetail || "No detail"}` : "Gateway did not provide a specific failure reason.",
    source,
    nextCheck: "Use the event log and PhonePe order ID to reconcile in PhonePe dashboard.",
  };
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
