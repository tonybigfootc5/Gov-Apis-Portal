import Link from "next/link";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { PaymentReturnStatus } from "@/components/payment-return-status";
import { getRequestLanguage } from "@/lib/request-language";
import type { SiteLanguage } from "@/lib/i18n";
import { getPhonePeOrderStatus } from "@/lib/phonepe";
import { hasDatabaseUrl } from "@/lib/prisma";
import {
  getPaymentOrderByMerchantOrderId,
  syncPaymentOrderFromStatus,
} from "@/lib/training-application-store";

type Props = {
  searchParams: Promise<{
    merchantOrderId?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PaymentReturnPage({ searchParams }: Props) {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      missingTitle: "Missing payment reference",
      missingMessage: "This return link does not include a valid order reference.",
      notFoundTitle: "Payment not found",
      notFoundMessage: "We could not match this transaction to an application record. If you completed payment, contact the center with your phone number and application details.",
    },
    te: {
      missingTitle: "చెల్లింపు సూచన లేదు",
      missingMessage: "ఈ రిటర్న్ లింక్‌లో సరైన ఆర్డర్ రిఫరెన్స్ లేదు. దయచేసి మీరు ఎంచుకున్న శిక్షణ కార్యక్రమం నుంచే మళ్లీ ప్రారంభించండి.",
      notFoundTitle: "చెల్లింపు కనబడలేదు",
      notFoundMessage: "ఈ లావాదేవీని దరఖాస్తు రికార్డుతో సరిపోల్చలేకపోయాము. మీరు చెల్లింపు పూర్తి చేసి ఉంటే, మీ ఫోన్ నంబర్ మరియు దరఖాస్తు వివరాలతో కేంద్రాన్ని సంప్రదించండి.",
    },
    hi: {
      missingTitle: "भुगतान संदर्भ अनुपस्थित है",
      missingMessage: "इस रिटर्न लिंक में मान्य ऑर्डर संदर्भ नहीं है। कृपया अपने चुने हुए प्रशिक्षण कार्यक्रम से फिर शुरू करें।",
      notFoundTitle: "भुगतान नहीं मिला",
      notFoundMessage: "हम इस लेनदेन को किसी आवेदन रिकॉर्ड से नहीं मिला सके। यदि आपने भुगतान पूरा किया है, तो अपना फोन नंबर और आवेदन विवरण लेकर केंद्र से संपर्क करें।",
    },
  } satisfies Record<SiteLanguage, Record<string, string>>;
  const pageCopy = copy[language];
  const { merchantOrderId } = await searchParams;

  if (!merchantOrderId) {
    return (
      <StaticReturnShell
        title={pageCopy.missingTitle}
        message={pageCopy.missingMessage}
        language={language}
        tone="failed"
      />
    );
  }

  let paymentOrder = hasDatabaseUrl
    ? await getPaymentOrderByMerchantOrderId(merchantOrderId)
    : null;

  if (
    paymentOrder &&
    hasDatabaseUrl &&
    ["PENDING", "CREATED", "FAILED", "EXPIRED"].includes(paymentOrder.status)
  ) {
    try {
      const status = await getPhonePeOrderStatus(paymentOrder.merchantOrderId);
      await syncPaymentOrderFromStatus(paymentOrder, status, "return.status");
      paymentOrder = await getPaymentOrderByMerchantOrderId(merchantOrderId);
    } catch {
      // Keep the current state if reconciliation is temporarily unavailable.
    }
  }

  if (!paymentOrder) {
    return (
      <StaticReturnShell
        title={pageCopy.notFoundTitle}
        message={pageCopy.notFoundMessage}
        language={language}
        tone="failed"
      />
    );
  }

  return (
    <PaymentReturnStatus
      language={language}
      initialPayment={{
        merchantOrderId: paymentOrder.merchantOrderId,
        serviceName: paymentOrder.trainingApplication.serviceName,
        status: paymentOrder.status,
      }}
    />
  );
}

function StaticReturnShell({
  title,
  message,
  language,
  tone,
}: {
  title: string;
  message: string;
  language: SiteLanguage;
  tone: "success" | "pending" | "failed";
}) {
  const shellCopy = {
    en: { success: "Confirmed", pending: "Pending", failed: "Needs action", back: "Back to programs", contact: "Contact center" },
    te: { success: "నిర్ధారించబడింది", pending: "పెండింగ్", failed: "చర్య అవసరం", back: "కార్యక్రమాల వద్దకు వెళ్లండి", contact: "కేంద్రాన్ని సంప్రదించండి" },
    hi: { success: "पुष्टि हुई", pending: "लंबित", failed: "कार्रवाई आवश्यक", back: "कार्यक्रमों पर लौटें", contact: "केंद्र से संपर्क करें" },
  }[language];
  const palette = {
    success: {
      icon: <CheckCircle2 className="h-8 w-8 text-[#2a8d5f]" aria-hidden="true" />,
      badge: "bg-[rgba(42,141,95,0.12)] text-[#215b42]",
      label: shellCopy.success,
    },
    pending: {
      icon: <Clock3 className="h-8 w-8 text-[#f2b544]" aria-hidden="true" />,
      badge: "bg-[rgba(242,181,68,0.14)] text-[#8b5d05]",
      label: shellCopy.pending,
    },
    failed: {
      icon: <XCircle className="h-8 w-8 text-[#c85d4a]" aria-hidden="true" />,
      badge: "bg-[rgba(200,93,74,0.12)] text-[#8e3d2f]",
      label: shellCopy.failed,
    },
  }[tone];

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl neo-shell rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="relative z-10">
          <div className="flex flex-wrap items-start gap-4">
            <div className="rounded-[1.4rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.76)] p-4">{palette.icon}</div>
            <div>
              <p className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${palette.badge}`}>
                {palette.label}
              </p>
              <h1 className="font-display mt-4 text-4xl text-bright sm:text-5xl">{title}</h1>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-base leading-8 text-dim">{message}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/programs"
              className="inline-flex items-center justify-center rounded-full bg-[#f2b544] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#0a0d12]"
            >
              {shellCopy.back}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.76)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#1f352b]"
            >
              {shellCopy.contact}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
