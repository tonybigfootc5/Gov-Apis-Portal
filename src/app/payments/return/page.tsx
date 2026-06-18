import Link from "next/link";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { getPhonePeOrderStatus } from "@/lib/phonepe";
import {
  getPaymentOrderByMerchantOrderId,
  syncPaymentOrderFromStatus,
} from "@/lib/training-application-store";

type Props = {
  searchParams: Promise<{ merchantOrderId?: string }>;
};

export const dynamic = "force-dynamic";

export default async function PaymentReturnPage({ searchParams }: Props) {
  const { merchantOrderId } = await searchParams;

  if (!merchantOrderId) {
    return (
      <ReturnShell
        title="Payment reference missing"
        message="We could not match this return to a training payment. Please contact the center if you need help."
        tone="failed"
      />
    );
  }

  let paymentOrder = await getPaymentOrderByMerchantOrderId(merchantOrderId);

  if (paymentOrder && ["PENDING", "CREATED", "FAILED", "EXPIRED"].includes(paymentOrder.status)) {
    try {
      const status = await getPhonePeOrderStatus(paymentOrder.merchantOrderId);
      await syncPaymentOrderFromStatus(paymentOrder, status, "return.status");
      paymentOrder = await getPaymentOrderByMerchantOrderId(merchantOrderId);
    } catch {
      // Preserve current database state if reconciliation is temporarily unavailable.
    }
  }

  if (!paymentOrder) {
    return (
      <ReturnShell
        title="Payment not found"
        message="This payment order could not be located. Please contact the center with your application details."
        tone="failed"
      />
    );
  }

  if (paymentOrder.status === "PAID") {
    return (
      <ReturnShell
        title="Payment received"
        message={`Your application payment for ${paymentOrder.trainingApplication.serviceName} has been recorded. Keep order ${paymentOrder.merchantOrderId} for reference.`}
        tone="success"
      />
    );
  }

  if (paymentOrder.status === "FAILED" || paymentOrder.status === "EXPIRED") {
    return (
      <ReturnShell
        title="Payment not completed"
        message="The gateway did not confirm this payment. You can retry from the training application flow or contact the center for help."
        tone="failed"
      />
    );
  }

  return (
    <ReturnShell
      title="Payment still processing"
      message="We have your application and are waiting for the final gateway confirmation. Please check back in a moment if the status does not change."
      tone="pending"
    />
  );
}

function ReturnShell({
  title,
  message,
  tone,
}: {
  title: string;
  message: string;
  tone: "success" | "pending" | "failed";
}) {
  const palette = {
    success: {
      icon: <CheckCircle2 className="h-8 w-8 text-[#2f8f57]" aria-hidden="true" />,
      badge: "bg-[#eef8f1] text-[#21533f]",
      label: "Confirmed",
    },
    pending: {
      icon: <Clock3 className="h-8 w-8 text-[#9c6a18]" aria-hidden="true" />,
      badge: "bg-[#fff5ea] text-[#8c4d1e]",
      label: "Pending",
    },
    failed: {
      icon: <XCircle className="h-8 w-8 text-[#b64c3a]" aria-hidden="true" />,
      badge: "bg-[#fff0ea] text-[#9b3f2b]",
      label: "Attention needed",
    },
  }[tone];

  return (
    <main className="min-h-[70vh] bg-[#f6f1e8] px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-8 shadow-[0_22px_54px_rgba(64,44,8,0.08)]">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-[#f3ecdf] p-4">{palette.icon}</div>
          <div>
            <p className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${palette.badge}`}>
              {palette.label}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[#173f33]">{title}</h1>
          </div>
        </div>
        <p className="mt-6 text-base leading-8 text-[#516253]">{message}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/programs"
            className="inline-flex items-center justify-center rounded-full bg-[#173f33] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#fff9ec]"
          >
            Back to training programs
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(27,59,43,0.12)] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#173f33]"
          >
            Contact the center
          </Link>
        </div>
      </div>
    </main>
  );
}
