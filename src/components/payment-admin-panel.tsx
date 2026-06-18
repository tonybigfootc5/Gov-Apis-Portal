"use client";

import { useMemo, useState } from "react";
import { CreditCard, History, RefreshCw, RotateCcw, Search } from "lucide-react";
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
    setNotice("Payment dashboard refreshed.");
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
    <section>
      {notice ? (
        <p className="rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-[#173f33] shadow-[0_12px_28px_rgba(64,44,8,0.05)]">
          {notice}
        </p>
      ) : null}

      <div className={`${notice ? "mt-4" : ""} rounded-[1.8rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(135deg,rgba(236,244,255,0.96),rgba(233,243,236,0.92))] p-4 shadow-[0_16px_34px_rgba(64,44,8,0.08)]`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {([
              ["confirmations", "Confirmations"],
              ["refunds", "Refunds"],
              ["history", "History"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.14em] ${
                  tab === value
                    ? "bg-[#173f33] text-[#fff9ec]"
                    : "bg-[#fffdf8] text-[#173f33]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              <Search className="h-4 w-4 text-[#718477]" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search applicant, order, reference"
                className="w-64 bg-transparent px-3 py-3 text-sm text-[#173f33] outline-none placeholder:text-[#90a094]"
              />
            </label>

            <button
              type="button"
              disabled={!databaseConfigured}
              onClick={() => void reload()}
              className="inline-flex items-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        {tab === "confirmations" ? (
          <div className="mt-5 grid gap-4">
            {pendingConfirmations.length ? (
              pendingConfirmations.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  loading={loadingId === payment.id}
                  actionLabel="Refresh status"
                  actionIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                  onAction={() => void refreshPayment(payment.id)}
                />
              ))
            ) : (
              <EmptyState message="No pending or failed gateway confirmations need attention." />
            )}
          </div>
        ) : null}

        {tab === "refunds" ? (
          <div className="mt-5 grid gap-4">
            {refundCandidates.length ? (
              refundCandidates.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  loading={loadingId === payment.id}
                  actionLabel={payment.refundEligible ? "Issue full refund" : "Refresh status"}
                  actionIcon={
                    payment.refundEligible ? (
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    )
                  }
                  onAction={() =>
                    void (payment.refundEligible ? initiateRefund(payment.id) : refreshPayment(payment.id))
                  }
                />
              ))
            ) : (
              <EmptyState message="No paid orders are currently eligible for refunds." />
            )}
          </div>
        ) : null}

        {tab === "history" ? (
          <div className="mt-5 grid gap-4">
            {filteredPayments.length ? (
              filteredPayments.map((payment) => (
                <article
                  key={payment.id}
                  className="rounded-[1.6rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(64,44,8,0.05)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">
                        {payment.application.candidateName}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-[#173f33]">
                        {payment.application.serviceName}
                      </h3>
                      <p className="mt-2 text-sm text-[#607366]">
                        {payment.merchantOrderId} | {payment.status}
                      </p>
                    </div>
                    <div className="rounded-full bg-[#eef8f1] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#21533f]">
                      Rs. {(payment.amountPaise / 100).toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <InfoPanel icon={<CreditCard className="h-4 w-4" aria-hidden="true" />} title="Order events">
                      {payment.events.length ? (
                        payment.events.map((event) => (
                          <p key={event.id}>
                            {event.eventName} | {event.state ?? "No state"} | {formatDate(event.receivedAt)}
                          </p>
                        ))
                      ) : (
                        <p>No events stored yet.</p>
                      )}
                    </InfoPanel>
                    <InfoPanel icon={<History className="h-4 w-4" aria-hidden="true" />} title="Refund history">
                      {payment.refunds.length ? (
                        payment.refunds.map((refund) => (
                          <p key={refund.id}>
                            {refund.merchantRefundId} | {refund.status} | {formatDate(refund.createdAt)}
                          </p>
                        ))
                      ) : (
                        <p>No refunds recorded.</p>
                      )}
                    </InfoPanel>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState message="No payment history matches the current search." />
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PaymentCard({
  payment,
  loading,
  actionLabel,
  actionIcon,
  onAction,
}: {
  payment: PaymentAdminRecord;
  loading: boolean;
  actionLabel: string;
  actionIcon: React.ReactNode;
  onAction: () => void;
}) {
  const latestRefund = payment.refunds[0];

  return (
    <article className="rounded-[1.6rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(64,44,8,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">
            {payment.application.candidateName}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[#173f33]">
            {payment.application.serviceName}
          </h3>
          <p className="mt-2 text-sm text-[#607366]">
            {payment.merchantOrderId} | {payment.environment} | {payment.status}
          </p>
          <p className="mt-1 text-sm text-[#607366]">
            Reference: {payment.paymentReference || "Not captured yet"}
          </p>
          {latestRefund ? (
            <p className="mt-1 text-sm text-[#607366]">
              Latest refund: {latestRefund.status} on {formatDate(latestRefund.createdAt)}
            </p>
          ) : null}
        </div>

        <div className="text-right">
          <p className="rounded-full bg-[#eef8f1] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#21533f]">
            Rs. {(payment.amountPaise / 100).toFixed(2)}
          </p>
          <p className="mt-2 text-xs font-semibold text-[#607366]">
            Created {formatDate(payment.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <InfoPanel icon={<CreditCard className="h-4 w-4" aria-hidden="true" />} title="Payment status">
          <p>Paid at: {formatDate(payment.paidAt)}</p>
          <p>Expires at: {formatDate(payment.expiresAt)}</p>
          <p>Latest event: {payment.latestEventName || "Not recorded yet"}</p>
        </InfoPanel>
        <InfoPanel icon={<History className="h-4 w-4" aria-hidden="true" />} title="Gateway detail">
          <p>Error code: {payment.latestErrorCode || "None"}</p>
          <p>Error detail: {payment.latestErrorMessage || "None"}</p>
          <p>Events stored: {payment.events.length}</p>
        </InfoPanel>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {actionIcon}
          {loading ? "Working..." : actionLabel}
        </button>
      </div>
    </article>
  );
}

function InfoPanel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.2rem] border border-[rgba(27,59,43,0.08)] bg-[#f8f4ea] p-4 text-sm leading-7 text-[#173f33]">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">
        {icon}
        {title}
      </div>
      <div className="mt-3 grid gap-1">{children}</div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[1.4rem] border border-dashed border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-10 text-center text-sm font-semibold text-[#607366]">
      {message}
    </div>
  );
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
