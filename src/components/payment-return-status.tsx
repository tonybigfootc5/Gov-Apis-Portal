"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, RefreshCw, XCircle } from "lucide-react";

type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "EXPIRED"
  | "REFUND_PENDING"
  | "REFUNDED"
  | "REFUND_FAILED";

type PaymentSnapshot = {
  merchantOrderId: string;
  serviceName: string;
  status: PaymentStatus;
};

type Props = {
  initialPayment: PaymentSnapshot;
};

const POLLABLE_STATUSES = new Set<PaymentStatus>(["CREATED", "PENDING"]);
const FINAL_STATUSES = new Set<PaymentStatus>([
  "PAID",
  "FAILED",
  "EXPIRED",
  "REFUND_PENDING",
  "REFUNDED",
  "REFUND_FAILED",
]);

export function PaymentReturnStatus({ initialPayment }: Props) {
  const [payment, setPayment] = useState(initialPayment);
  const [pollError, setPollError] = useState("");
  const polling = POLLABLE_STATUSES.has(payment.status);

  useEffect(() => {
    if (!polling) return;

    let cancelled = false;
    let attempts = 0;

    async function poll() {
      while (!cancelled && attempts < 20) {
        attempts += 1;

        try {
          const response = await fetch(`/api/payments/order/${encodeURIComponent(payment.merchantOrderId)}/status`, {
            cache: "no-store",
          });
          const body = (await response.json().catch(() => null)) as
            | { status?: PaymentStatus; application?: { serviceName?: string } }
            | { error?: string }
            | null;

          if (!response.ok) {
            throw new Error(body && "error" in body ? body.error : "Unable to refresh payment status.");
          }

          if (body && "status" in body && body.status) {
            const nextPayment = {
              merchantOrderId: payment.merchantOrderId,
              serviceName: body.application?.serviceName ?? payment.serviceName,
              status: body.status,
            } satisfies PaymentSnapshot;

            setPayment(nextPayment);
            setPollError("");

            if (FINAL_STATUSES.has(nextPayment.status)) {
              return;
            }
          }
        } catch (error) {
          setPollError(error instanceof Error ? error.message : "Unable to refresh payment status.");
        }

        await new Promise((resolve) => window.setTimeout(resolve, 3000));
      }
    }

    void poll();

    return () => {
      cancelled = true;
    };
  }, [payment.merchantOrderId, payment.serviceName, polling]);

  const content = getContent(payment);

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl neo-shell rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <div className="flex flex-wrap items-start gap-4">
              <div className="rounded-[1.4rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.76)] p-4">{content.icon}</div>
              <div>
                <p className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${content.badge}`}>
                  {content.label}
                </p>
                <h1 className="font-display mt-4 text-4xl text-bright sm:text-5xl">{content.title}</h1>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-base leading-8 text-dim">{content.message}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="section-frame rounded-[1.4rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">Program</p>
                <p className="mt-3 text-lg font-semibold text-bright">{payment.serviceName}</p>
              </div>
              <div className="section-frame rounded-[1.4rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">Order reference</p>
                <p className="mt-3 break-all text-sm font-semibold text-bright">{payment.merchantOrderId}</p>
              </div>
            </div>

            {polling ? (
              <div className="mt-6 flex items-center gap-3 rounded-[1.4rem] border border-[#f2b544]/20 bg-[#fff4d8] px-4 py-4 text-sm font-semibold text-[#8b5d05]">
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                Checking PhonePe for the latest confirmation...
              </div>
            ) : null}

            {pollError ? (
              <div className="mt-4 rounded-[1.4rem] border border-[#c85d4a]/20 bg-[#fff1ed] px-4 py-4 text-sm font-semibold text-[#8e3d2f]">
                {pollError}
              </div>
            ) : null}
          </div>

          <aside className="section-frame rounded-[1.6rem] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">Next</p>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-dim">
              <p>Your application stays recorded even while the gateway confirms the charge.</p>
              <p>If the status remains pending for too long, use your application details when contacting the center.</p>
            </div>
            <div className="mt-6 grid gap-3">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center rounded-full bg-[#f2b544] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#0a0d12]"
              >
                Back to programs
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.76)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#1f352b]"
              >
                Contact center
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function getContent(payment: PaymentSnapshot) {
  if (payment.status === "PAID") {
    return {
      icon: <CheckCircle2 className="h-8 w-8 text-[#2a8d5f]" aria-hidden="true" />,
      badge: "bg-[rgba(42,141,95,0.12)] text-[#215b42]",
      label: "Confirmed",
      title: "Payment received",
      message: `Your payment for ${payment.serviceName} has been captured successfully. The training application is now in the confirmed payment state.`,
    };
  }

  if (payment.status === "FAILED" || payment.status === "EXPIRED") {
    return {
      icon: <XCircle className="h-8 w-8 text-[#c85d4a]" aria-hidden="true" />,
      badge: "bg-[rgba(200,93,74,0.12)] text-[#8e3d2f]",
      label: "Needs action",
      title: "Payment not completed",
      message: "The gateway did not confirm this transaction. Please retry from the application flow or contact the center if the amount was already debited.",
    };
  }

  return {
    icon: <Clock3 className="h-8 w-8 text-[#f2b544]" aria-hidden="true" />,
    badge: "bg-[rgba(242,181,68,0.14)] text-[#8b5d05]",
    label: "Processing",
    title: "Confirmation in progress",
    message: "Your application is saved. We are waiting for the payment gateway to finalize the transaction and this page will keep checking automatically.",
  };
}
