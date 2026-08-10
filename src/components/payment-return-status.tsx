"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { Check, CheckCircle2, Clock3, Copy, Download, FileCheck2, MapPin, QrCode, RefreshCw, X, XCircle } from "lucide-react";
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
  invoiceNumber: string;
  merchantOrderId: string;
  phonePeOrderId: string | null;
  paymentReference: string | null;
  amountPaise: number;
  currency: string;
  serviceName: string;
  candidateName: string;
  aadhaarNo: string;
  enrollmentId: string | null;
  status: PaymentStatus;
  paidAt: string | null;
};

type ReceiptPayload = {
  type: "API_CULTURE_PAYMENT_SUCCESS";
  status: "PAID";
  fullName: string;
  aadhaarNumber: string;
  transactionNumber: string;
  merchantOrderId: string;
  invoiceNumber: string;
  gatewayReference: string | null;
  amountPaid: string;
  amountPaise: number;
  currency: string;
  program: string;
  enrollmentId: string;
  trainingAddress: string;
  trainingMapsUrl: string;
  trainingTimings: string;
  paidAt: string | null;
  issuedAt: string;
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

const TRAINING_LOCATION_LABEL = "State Office";
const TRAINING_LOCATION_ADDRESS =
  "\"Bee House\", Khadi Gramodyog Maha Vidyalaya (KGMV), Rajendranagar, Hyderabad - 500 030, Telangana, India";
const TRAINING_LOCATION_MAPS_URL = "https://maps.app.goo.gl/MouDG368iNNpZjYE9";
const TRAINING_CLASS_TIMINGS = "10:00 AM to 5:00 PM";

export function PaymentReturnStatus({ initialPayment, language }: Props) {
  const copy = {
    en: {
      program: "Program",
      orderReference: "Order reference",
      fullName: "Full name",
      aadhaarNo: "Aadhaar number",
      transactionNumber: "Transaction number",
      referenceNumber: "Gateway reference",
      amountPaid: "Amount paid",
      enrollmentId: "Enrollment ID",
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
      paymentSuccessful: "Payment Successful",
      paymentDetails: "Payment Details",
      studentDetails: "Student Details",
      welcomeTitle: "Welcome to the program",
      enrollmentDetails: "Enrollment Details",
      orderTime: "Order Time",
      paymentMethod: "Payment Method",
      paymentStatus: "Payment Status",
      downloadReceipt: "Download Successful Card",
      qrTitle: "Verification QR",
      qrHint: "Admin can scan this QR to verify the successful enrollment receipt.",
      waitingTransactionId: "Waiting for PhonePe transaction ID...",
      notCompleted: "Payment not completed",
      progress: "Confirmation in progress",
      receivedMessage: (name: string) => `${name} is enrolled successfully. The payment has been captured by the gateway.`,
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
  const detailCopy = {
    fullName: "Full name",
    aadhaarNo: "Aadhaar number",
    transactionNumber: "Transaction number",
    referenceNumber: "Gateway reference",
    amountPaid: "Amount paid",
    enrollmentId: "Enrollment ID",
  };
  const receiptCopy = {
    paymentSuccessful: "Payment Successful",
    paymentDetails: "Payment Details",
    studentDetails: "Student Details",
    welcomeTitle: "Welcome to the program",
    enrollmentDetails: "Enrollment Details",
    orderTime: "Order Time",
    paymentMethod: "Payment Method",
    paymentStatus: "Payment Status",
    downloadReceipt: "Download Successful Card",
    qrTitle: "Verification QR",
    qrHint: "Admin can scan this QR to verify the successful enrollment receipt.",
    waitingTransactionId: "Waiting for PhonePe transaction ID...",
  };
  const [payment, setPayment] = useState(initialPayment);
  const [pollError, setPollError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [locationCopied, setLocationCopied] = useState(false);
  const waitingForGatewayTransactionId = payment.status === "PAID" && !payment.paymentReference;
  const polling = POLLABLE_STATUSES.has(payment.status) || waitingForGatewayTransactionId;
  const paidAtLabel = formatDate(payment.paidAt);
  const transactionNumber = payment.paymentReference ?? receiptCopy.waitingTransactionId;
  const enrollmentId = payment.enrollmentId ?? "Not assigned yet";
  const amountLabel = formatMoney(payment.amountPaise, payment.currency);
  const receiptPayload = useMemo<ReceiptPayload | null>(() => {
    if (payment.status !== "PAID" || !payment.paymentReference) return null;

    return {
      type: "API_CULTURE_PAYMENT_SUCCESS",
      status: "PAID",
      fullName: payment.candidateName,
      aadhaarNumber: payment.aadhaarNo || "Not available",
      transactionNumber: payment.paymentReference,
      merchantOrderId: payment.merchantOrderId,
      invoiceNumber: payment.invoiceNumber,
      gatewayReference: payment.phonePeOrderId,
      amountPaid: amountLabel,
      amountPaise: payment.amountPaise,
      currency: payment.currency,
      program: payment.serviceName,
      enrollmentId,
      trainingAddress: TRAINING_LOCATION_ADDRESS,
      trainingMapsUrl: TRAINING_LOCATION_MAPS_URL,
      trainingTimings: TRAINING_CLASS_TIMINGS,
      paidAt: payment.paidAt,
      issuedAt: new Date().toISOString(),
    };
  }, [amountLabel, enrollmentId, payment]);

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
            | {
                status?: PaymentStatus;
                invoiceNumber?: string;
                merchantOrderId?: string;
                phonePeOrderId?: string | null;
                paymentReference?: string | null;
                amountPaise?: number;
                currency?: string;
                paidAt?: string | null;
                application?: {
                  serviceName?: string;
                  candidateName?: string;
                  aadhaarNo?: string;
                  studentCode?: string | null;
                };
              }
            | { error?: string }
            | null;

          if (!response.ok) {
            throw new Error(body && "error" in body ? body.error : "Unable to refresh payment status.");
          }

          if (body && "status" in body && body.status) {
            const nextStatus = body.status;
            setPayment((current) => ({
              invoiceNumber: body.invoiceNumber ?? current.invoiceNumber,
              merchantOrderId: current.merchantOrderId,
              phonePeOrderId: body.phonePeOrderId ?? current.phonePeOrderId,
              paymentReference: body.paymentReference ?? current.paymentReference,
              amountPaise: body.amountPaise ?? current.amountPaise,
              currency: body.currency ?? current.currency,
              serviceName: body.application?.serviceName ?? current.serviceName,
              candidateName: body.application?.candidateName ?? current.candidateName,
              aadhaarNo: body.application?.aadhaarNo ?? current.aadhaarNo,
              enrollmentId: body.application?.studentCode ?? current.enrollmentId,
              status: nextStatus,
              paidAt: body.paidAt ?? current.paidAt,
            }));
            setPollError("");

            if (FINAL_STATUSES.has(nextStatus) && !(nextStatus === "PAID" && !(body.paymentReference ?? payment.paymentReference))) {
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
  }, [payment.merchantOrderId, payment.paymentReference, polling]);

  const content = getContent(payment, copy);
  const enrollmentRows: Array<[string, string | React.ReactNode]> = [
    [copy.program, payment.serviceName],
    [detailCopy.enrollmentId, enrollmentId],
    [detailCopy.amountPaid, amountLabel],
    [detailCopy.transactionNumber, transactionNumber],
  ];
  const paymentRows: Array<[string, string | React.ReactNode]> = [
    ["Invoice Number", payment.invoiceNumber],
    [receiptCopy.orderTime, paidAtLabel],
    [receiptCopy.paymentMethod, "PhonePe"],
    [receiptCopy.paymentStatus, <span key="status" className="rounded bg-[#16a34a] px-2.5 py-1 text-[10px] font-bold text-white">Successful</span>],
    [detailCopy.referenceNumber, payment.phonePeOrderId ?? "Not received from gateway"],
  ];
  const studentRows: Array<[string, string]> = [
    [detailCopy.fullName, payment.candidateName],
    [detailCopy.aadhaarNo, payment.aadhaarNo || "Not available"],
    ["Invoice Number", payment.invoiceNumber],
  ];

  async function copyTrainingLocation() {
    const value = `${TRAINING_LOCATION_LABEL}\n${TRAINING_LOCATION_ADDRESS}\nGoogle Map: ${TRAINING_LOCATION_MAPS_URL}\nClass Timings: ${TRAINING_CLASS_TIMINGS}`;

    try {
      await navigator.clipboard.writeText(value);
      setLocationCopied(true);
      window.setTimeout(() => setLocationCopied(false), 1800);
    } catch {
      setDownloadError("Unable to copy the location on this device. Please use the Google Map link.");
    }
  }

  const trainingRows: Array<[string, string | React.ReactNode]> = [
    ["Training Location", TRAINING_LOCATION_LABEL],
    [
      "Address",
      <a
        key="training-address"
        href={TRAINING_LOCATION_MAPS_URL}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-[#16a34a]/35 underline-offset-4 transition hover:text-[#0f7a42]"
      >
        {TRAINING_LOCATION_ADDRESS}
      </a>,
    ],
    ["Google Map", <LocationCopyLink key="training-map-link" copied={locationCopied} onCopy={() => void copyTrainingLocation()} />],
    ["Class Timings", TRAINING_CLASS_TIMINGS],
  ];

  useEffect(() => {
    let cancelled = false;

    async function buildQr() {
      if (!receiptPayload) {
        setQrDataUrl("");
        return;
      }

      const nextQrDataUrl = await QRCode.toDataURL(JSON.stringify(receiptPayload), {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 208,
        color: {
          dark: "#173f33",
          light: "#ffffff",
        },
      });
      if (!cancelled) setQrDataUrl(nextQrDataUrl);
    }

    void buildQr();

    return () => {
      cancelled = true;
    };
  }, [receiptPayload]);

  async function downloadReceipt() {
    if (!receiptPayload || !qrDataUrl) return;

    setDownloadError("");
    try {
      const dataUrl = await buildReceiptImage({
        qrDataUrl,
        enrollmentRows: enrollmentRows.map(([label, value]) => [label, typeof value === "string" ? value : "Successful"]),
        paymentRows: paymentRows.map(([label, value]) => [label, typeof value === "string" ? value : "Successful"]),
        studentRows,
        trainingRows: trainingRows.map(([label, value]) => [label, typeof value === "string" ? value : TRAINING_LOCATION_MAPS_URL]),
        candidateName: payment.candidateName,
        programName: payment.serviceName,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `api-culture-success-${receiptPayload.enrollmentId || receiptPayload.merchantOrderId}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setDownloadError("Unable to prepare the offline receipt on this device. Please keep this page open and try again.");
    }
  }

  if (payment.status === "PAID") {
    return (
      <main className="min-h-screen bg-[#f4f4f4] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[28rem]">
          <section className="relative overflow-hidden rounded-t-[1.35rem] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <Link
              href="/programs"
              className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#111827] hover:bg-[#f3f4f6]"
              aria-label={copy.back}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Link>

            <div className="grid justify-items-center px-4 pb-7 pt-7">
              <span className="inline-flex h-16 w-16 items-center justify-center text-[#163c8c]">
                <FileCheck2 className="h-14 w-14" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <h1 className="mt-5 text-center text-2xl font-black tracking-normal text-[#111827]">{receiptCopy.paymentSuccessful}</h1>
              <p className="mt-2 text-center text-sm font-semibold leading-6 text-[#4b5563]">
                Welcome {payment.candidateName} to {payment.serviceName}.
              </p>
            </div>

            <div className="relative border-t border-dashed border-[#e5e7eb] px-4 py-5 before:absolute before:-left-3 before:-top-3 before:h-6 before:w-6 before:rounded-full before:bg-[#f4f4f4] after:absolute after:-right-3 after:-top-3 after:h-6 after:w-6 after:rounded-full after:bg-[#f4f4f4]">
              <section className="mb-4 rounded-[1rem] border border-[#dceee3] bg-[#f4fbf6] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#1f6b4b]">{receiptCopy.welcomeTitle}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#173f33]">
                  Your seat is confirmed. Please keep this card offline for admission verification and future reference.
                </p>
              </section>
              <ReceiptSection title={receiptCopy.enrollmentDetails} rows={enrollmentRows} />
              <div className="my-4 border-t border-dashed border-[#e5e7eb]" />
              <ReceiptSection title={receiptCopy.paymentDetails} rows={paymentRows} />
              <div className="my-4 border-t border-dashed border-[#e5e7eb]" />
              <ReceiptSection title={receiptCopy.studentDetails} rows={studentRows} />
              <div className="my-4 border-t border-dashed border-[#e5e7eb]" />
              <ReceiptSection title="Training Location & Timings" rows={trainingRows} />
              <div className="my-4 border-t border-dashed border-[#e5e7eb]" />

              {waitingForGatewayTransactionId ? (
                <div className="mb-4 flex items-center gap-3 rounded-[0.9rem] border border-[#f2b544]/25 bg-[#fff8df] px-4 py-3 text-xs font-bold leading-5 text-[#8b5d05]">
                  <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Payment is successful. Pulling the real PhonePe transaction ID from the gateway.
                </div>
              ) : null}

              <div className="grid gap-4 rounded-[0.9rem] border border-[#e5e7eb] bg-[#fbfdfb] p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
                <div className="grid h-36 w-36 place-items-center rounded-[0.7rem] bg-white p-2 shadow-[inset_0_0_0_1px_rgba(23,63,51,0.08)]">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrDataUrl} alt="Successful payment verification QR" className="h-full w-full" />
                  ) : (
                    <QrCode className="h-12 w-12 animate-pulse text-[#9ca3af]" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-[#111827]">{receiptCopy.qrTitle}</p>
                  <p className="mt-2 text-xs font-semibold leading-6 text-[#6b7280]">{receiptCopy.qrHint}</p>
                </div>
              </div>

              <button
                type="button"
                disabled={!receiptPayload || !qrDataUrl}
                onClick={() => void downloadReceipt()}
                className="mt-4 inline-flex h-14 w-full items-center justify-center gap-3 rounded-[0.8rem] border border-[#d1d5db] bg-gradient-to-b from-white to-[#f3f4f6] px-4 text-base font-black text-[#111827] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-5 w-5" aria-hidden="true" />
                {receiptCopy.downloadReceipt}
              </button>
              {downloadError ? <p className="mt-3 text-center text-xs font-semibold text-[#b42318]">{downloadError}</p> : null}
            </div>
          </section>
          <div className="h-5 bg-[radial-gradient(circle_at_10px_-2px,#f4f4f4_11px,#ffffff_12px)] [background-size:20px_20px] shadow-[0_24px_70px_rgba(15,23,42,0.12)]" />
        </div>
      </main>
    );
  }

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
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{detailCopy.fullName}</p>
                <p className="mt-3 text-lg font-semibold text-bright">{payment.candidateName}</p>
              </div>
              <div className="section-frame rounded-[1.4rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{detailCopy.aadhaarNo}</p>
                <p className="mt-3 text-lg font-semibold text-bright">{payment.aadhaarNo || "Not available"}</p>
              </div>
              <div className="section-frame rounded-[1.4rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{copy.program}</p>
                <p className="mt-3 text-lg font-semibold text-bright">{payment.serviceName}</p>
              </div>
              <div className="section-frame rounded-[1.4rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{detailCopy.enrollmentId}</p>
                <p className="mt-3 break-all text-sm font-semibold text-bright">{payment.enrollmentId ?? "Not assigned yet"}</p>
              </div>
              <div className="section-frame rounded-[1.4rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{detailCopy.amountPaid}</p>
                <p className="mt-3 text-lg font-semibold text-bright">{formatMoney(payment.amountPaise, payment.currency)}</p>
              </div>
              <div className="section-frame rounded-[1.4rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{detailCopy.transactionNumber}</p>
                <p className="mt-3 break-all text-sm font-semibold text-bright">{payment.paymentReference ?? "Waiting for PhonePe transaction ID"}</p>
              </div>
              <div className="section-frame rounded-[1.4rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{copy.orderReference}</p>
                <p className="mt-3 break-all text-sm font-semibold text-bright">{payment.merchantOrderId}</p>
              </div>
              <div className="section-frame rounded-[1.4rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{detailCopy.referenceNumber}</p>
                <p className="mt-3 break-all text-sm font-semibold text-bright">{payment.phonePeOrderId ?? "Not received from gateway"}</p>
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

function ReceiptSection({ title, rows }: { title: string; rows: Array<[string, string | React.ReactNode]> }) {
  return (
    <section>
      <h2 className="text-sm font-black text-[#111827]">{title}</h2>
      <div className="mt-3 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[minmax(0,1fr)_0.75rem_minmax(0,1fr)] items-start gap-3 text-sm">
            <span className="min-w-0 text-[#6b7280]">{label}</span>
            <span className="text-center font-semibold text-[#111827]">:</span>
            <span className="min-w-0 break-words font-semibold text-[#111827]">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function LocationCopyLink({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <span className="grid gap-2">
      <a
        href={TRAINING_LOCATION_MAPS_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 font-black text-[#0f7a42] underline decoration-[#16a34a]/35 underline-offset-4"
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        Open Google Map
      </a>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#d1fae5] bg-[#ecfdf5] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#0f7a42] transition hover:bg-[#d1fae5]"
      >
        {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
        {copied ? "Copied" : "Copy location"}
      </button>
    </span>
  );
}

async function buildReceiptImage({
  qrDataUrl,
  enrollmentRows,
  paymentRows,
  studentRows,
  trainingRows,
  candidateName,
  programName,
}: {
  qrDataUrl: string;
  enrollmentRows: Array<[string, string]>;
  paymentRows: Array<[string, string]>;
  studentRows: Array<[string, string]>;
  trainingRows: Array<[string, string]>;
  candidateName: string;
  programName: string;
}) {
  const canvas = document.createElement("canvas");
  const width = 900;
  const height = 1940;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas not available.");

  context.fillStyle = "#f4f4f4";
  context.fillRect(0, 0, width, height);
  roundRect(context, 72, 36, width - 144, height - 72, 34, "#ffffff");

  context.strokeStyle = "#e5e7eb";
  context.setLineDash([10, 12]);
  context.beginPath();
  context.moveTo(96, 310);
  context.lineTo(width - 96, 310);
  context.stroke();
  context.setLineDash([]);

  context.fillStyle = "#163c8c";
  context.font = "700 58px Arial";
  context.textAlign = "center";
  context.fillText("✓", width / 2, 130);
  context.fillStyle = "#111827";
  context.font = "700 34px Arial";
  context.fillText("Payment Successful", width / 2, 224);
  context.fillStyle = "#4b5563";
  context.font = "700 21px Arial";
  wrapCenteredCanvasText(context, `Welcome ${candidateName} to ${programName}`, width / 2, 268, 620, 28);

  let y = 360;
  y = drawReceiptRows(context, "Enrollment Details", enrollmentRows, y);
  drawDashedLine(context, 96, y + 22, width - 96, y + 22);
  y += 70;
  y = drawReceiptRows(context, "Payment Details", paymentRows, y);
  drawDashedLine(context, 96, y + 22, width - 96, y + 22);
  y += 70;
  y = drawReceiptRows(context, "Student Details", studentRows, y);
  drawDashedLine(context, 96, y + 22, width - 96, y + 22);
  y += 70;
  y = drawReceiptRows(context, "Training Location & Timings", trainingRows, y);
  drawDashedLine(context, 96, y + 22, width - 96, y + 22);

  const qrImage = await loadImage(qrDataUrl);
  const qrSize = 230;
  const qrX = (width - qrSize) / 2;
  context.drawImage(qrImage, qrX, y + 58, qrSize, qrSize);
  context.fillStyle = "#111827";
  context.font = "700 24px Arial";
  context.fillText("Scan in Admin to verify", width / 2, y + 330);

  return canvas.toDataURL("image/png");
}

function drawReceiptRows(
  context: CanvasRenderingContext2D,
  title: string,
  rows: Array<[string, string]>,
  startY: number,
) {
  context.textAlign = "left";
  context.fillStyle = "#111827";
  context.font = "700 23px Arial";
  context.fillText(title, 96, startY);

  let y = startY + 52;
  rows.forEach(([label, value]) => {
    context.fillStyle = "#6b7280";
    context.font = "400 22px Arial";
    context.fillText(label, 96, y);
    context.fillStyle = "#111827";
    context.font = "700 22px Arial";
    context.fillText(":", 430, y);
    wrapCanvasText(context, value, 472, y, 320, 28);
    y += value.length > 28 ? 60 : 42;
  });

  return y;
}

function wrapCanvasText(context: CanvasRenderingContext2D, value: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = value
    .split(" ")
    .flatMap((word) => (context.measureText(word).width > maxWidth ? word.match(/.{1,24}/g) ?? [word] : [word]));
  let line = "";
  let lineY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, lineY);
      line = word;
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, lineY);
}

function wrapCenteredCanvasText(context: CanvasRenderingContext2D, value: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = value.split(" ");
  let line = "";
  let lineY = y;
  context.textAlign = "center";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, lineY);
      line = word;
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, lineY);
}

function drawDashedLine(context: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) {
  context.strokeStyle = "#e5e7eb";
  context.setLineDash([10, 12]);
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
  context.setLineDash([]);
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string,
) {
  context.fillStyle = fillStyle;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  context.fill();
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
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
      message: copy.receivedMessage(payment.candidateName),
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

function formatMoney(amountPaise: number, currency: string) {
  const amount = amountPaise / 100;
  if (currency === "INR") {
    return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `${currency} ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
