"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, RefreshCw, XCircle } from "lucide-react";
import type { SiteLanguage } from "@/lib/i18n";

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
  language: SiteLanguage;
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

export function PaymentReturnStatus({ initialPayment, language }: Props) {
  const copy = {
    en: {
      program: "Program",
      orderReference: "Order reference",
      checking: "Checking PhonePe for the latest confirmation...",
      next: "Next",
      nextLine1: "Your application stays recorded even while the gateway confirms the charge.",
      nextLine2: "If the status remains pending for too long, use your application details when contacting the center.",
      back: "Back to programs",
      contact: "Contact center",
      confirmed: "Confirmed",
      needsAction: "Needs action",
      processing: "Processing",
      received: "Payment received",
      notCompleted: "Payment not completed",
      progress: "Confirmation in progress",
      receivedMessage: (name: string) => `Your payment for ${name} has been captured successfully. The training application is now in the confirmed payment state.`,
      notCompletedMessage: "The gateway did not confirm this transaction.",
      progressMessage: "Your application is saved. Payment confirmation is in progress.",
    },
    te: {
      program: "కార్యక్రమం",
      orderReference: "ఆర్డర్ సూచన",
      checking: "తాజా నిర్ధారణ కోసం PhonePe స్థితిని చెక్ చేస్తున్నాం...",
      next: "తదుపరి",
      nextLine1: "గేట్‌వే చార్జ్‌ను నిర్ధారిస్తున్నప్పటికీ మీ దరఖాస్తు రికార్డులో ఉంటుంది.",
      nextLine2: "స్థితి ఎక్కువసేపు పెండింగ్‌లో ఉంటే, కేంద్రాన్ని సంప్రదించే సమయంలో మీ దరఖాస్తు వివరాలను ఉపయోగించండి.",
      back: "కార్యక్రమాల వద్దకు వెళ్లండి",
      contact: "కేంద్రాన్ని సంప్రదించండి",
      confirmed: "నిర్ధారించబడింది",
      needsAction: "చర్య అవసరం",
      processing: "ప్రాసెస్‌లో ఉంది",
      received: "చెల్లింపు అందింది",
      notCompleted: "చెల్లింపు పూర్తికాలేదు",
      progress: "నిర్ధారణ కొనసాగుతోంది",
      receivedMessage: (name: string) => `${name} కోసం మీ చెల్లింపు విజయవంతంగా నమోదు అయింది. శిక్షణ దరఖాస్తు ఇప్పుడు నిర్ధారిత చెల్లింపు స్థితిలో ఉంది.`,
      notCompletedMessage: "ఈ లావాదేవీని గేట్‌వే నిర్ధారించలేదు. దయచేసి దరఖాస్తు ప్రవాహం నుంచి మళ్లీ ప్రయత్నించండి లేదా మొత్తం డెబిట్ అయితే కేంద్రాన్ని సంప్రదించండి.",
      progressMessage: "మీ దరఖాస్తు సేవ్ అయింది. చెల్లింపు గేట్‌వే లావాదేవీని పూర్తి చేయడానికి మేము వేచి ఉన్నాము మరియు ఈ పేజీ ఆటోమేటిక్‌గా చెక్ చేస్తూనే ఉంటుంది.",
    },
    hi: {
      program: "कार्यक्रम",
      orderReference: "ऑर्डर संदर्भ",
      checking: "नवीनतम पुष्टि के लिए PhonePe स्थिति जांची जा रही है...",
      next: "अगला",
      nextLine1: "गेटवे शुल्क की पुष्टि कर रहा हो तब भी आपका आवेदन सुरक्षित रूप से रिकॉर्ड रहता है।",
      nextLine2: "यदि स्थिति लंबे समय तक लंबित रहे, तो केंद्र से संपर्क करते समय अपने आवेदन विवरण का उपयोग करें।",
      back: "कार्यक्रमों पर लौटें",
      contact: "केंद्र से संपर्क करें",
      confirmed: "पुष्टि हुई",
      needsAction: "कार्रवाई आवश्यक",
      processing: "प्रक्रिया में",
      received: "भुगतान प्राप्त हुआ",
      notCompleted: "भुगतान पूरा नहीं हुआ",
      progress: "पुष्टि जारी है",
      receivedMessage: (name: string) => `${name} के लिए आपका भुगतान सफलतापूर्वक प्राप्त हो गया है। प्रशिक्षण आवेदन अब पुष्टि किए गए भुगतान की स्थिति में है।`,
      notCompletedMessage: "गेटवे ने इस लेनदेन की पुष्टि नहीं की। कृपया आवेदन प्रवाह से पुनः प्रयास करें या राशि डेबिट होने पर केंद्र से संपर्क करें।",
      progressMessage: "आपका आवेदन सुरक्षित है। हम भुगतान गेटवे द्वारा लेनदेन अंतिम करने की प्रतीक्षा कर रहे हैं और यह पेज स्वतः जांच करता रहेगा।",
    },
  }[language];
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

  const content = getContent(payment, copy);

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
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{copy.program}</p>
                <p className="mt-3 text-lg font-semibold text-bright">{payment.serviceName}</p>
              </div>
              <div className="section-frame rounded-[1.4rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{copy.orderReference}</p>
                <p className="mt-3 break-all text-sm font-semibold text-bright">{payment.merchantOrderId}</p>
              </div>
            </div>

            {polling ? (
              <div className="mt-6 flex items-center gap-3 rounded-[1.4rem] border border-[#f2b544]/20 bg-[#fff4d8] px-4 py-4 text-sm font-semibold text-[#8b5d05]">
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                {copy.checking}
              </div>
            ) : null}

            {pollError ? (
              <div className="mt-4 rounded-[1.4rem] border border-[#c85d4a]/20 bg-[#fff1ed] px-4 py-4 text-sm font-semibold text-[#8e3d2f]">
                {pollError}
              </div>
            ) : null}
          </div>

          <aside className="section-frame rounded-[1.6rem] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">{copy.next}</p>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-dim">
              <p>{copy.nextLine1}</p>
              <p>{copy.nextLine2}</p>
            </div>
            <div className="mt-6 grid gap-3">
              <Link
                href="/programs"
                className="inline-flex items-center justify-center rounded-full bg-[#f2b544] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#0a0d12]"
              >
                {copy.back}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.76)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#1f352b]"
              >
                {copy.contact}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function getContent(
  payment: PaymentSnapshot,
  copy: {
    confirmed: string;
    needsAction: string;
    processing: string;
    received: string;
    notCompleted: string;
    progress: string;
    receivedMessage: (name: string) => string;
    notCompletedMessage: string;
    progressMessage: string;
  },
) {
  if (payment.status === "PAID") {
    return {
      icon: <CheckCircle2 className="h-8 w-8 text-[#2a8d5f]" aria-hidden="true" />,
      badge: "bg-[rgba(42,141,95,0.12)] text-[#215b42]",
      label: copy.confirmed,
      title: copy.received,
      message: copy.receivedMessage(payment.serviceName),
    };
  }

  if (payment.status === "FAILED" || payment.status === "EXPIRED") {
    return {
      icon: <XCircle className="h-8 w-8 text-[#c85d4a]" aria-hidden="true" />,
      badge: "bg-[rgba(200,93,74,0.12)] text-[#8e3d2f]",
      label: copy.needsAction,
      title: copy.notCompleted,
      message: copy.notCompletedMessage,
    };
  }

  return {
    icon: <Clock3 className="h-8 w-8 text-[#f2b544]" aria-hidden="true" />,
    badge: "bg-[rgba(242,181,68,0.14)] text-[#8b5d05]",
    label: copy.processing,
    title: copy.progress,
    message: copy.progressMessage,
  };
}
