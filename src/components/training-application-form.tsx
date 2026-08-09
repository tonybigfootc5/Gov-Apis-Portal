"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Camera,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  MapPinned,
  Mars,
  ShieldCheck,
  UserRound,
  Venus,
  WandSparkles,
} from "lucide-react";
import { optimizeImageForInlineStorage } from "@/lib/client-media";
import { getApplicationErrorGuideItem, type ApplicationErrorCode } from "@/lib/application-error-codes";
import type { SiteLanguage } from "@/lib/i18n";

type FormState = {
  serviceName: string;
  applicationDate: string;
  candidateName: string;
  guardianName: string;
  aadhaarNo: string;
  email: string;
  gender: "male" | "female" | "";
  dateOfBirth: string;
  houseNo: string;
  street: string;
  village: string;
  addressLine: string;
  mandal: string;
  district: string;
  state: string;
  pinCode: string;
  phone: string;
  residencePhone: string;
  educationQualification: string;
  occupation: string;
  sponsoringOrganization: string;
  photoName: string;
  photoType: string;
  photoUrl: string;
  photoObjectKey: string;
  photoDataUrl: string;
};

type SubmitState = "idle" | "compressing" | "submitting" | "success" | "error";
type PhotoUploadState = "idle" | "uploading" | "uploaded" | "error";
type ServiceOption = {
  title: string;
  duration: string;
  level: string;
  imageSrc?: string;
  imageAlt?: string;
};

type Props = {
  language: SiteLanguage;
  serviceOptions: ServiceOption[];
  selectedServiceTitle?: string;
};

const DEFAULT_SERVICE_NAME = "Scientific Beekeeping";

const INITIAL_FORM: FormState = {
  serviceName: DEFAULT_SERVICE_NAME,
  applicationDate: new Date().toISOString().slice(0, 10),
  candidateName: "",
  guardianName: "",
  aadhaarNo: "",
  email: "",
  gender: "",
  dateOfBirth: "",
  houseNo: "",
  street: "",
  village: "",
  addressLine: "",
  mandal: "",
  district: "",
  state: "",
  pinCode: "",
  phone: "",
  residencePhone: "",
  educationQualification: "",
  occupation: "",
  sponsoringOrganization: "",
  photoName: "",
  photoType: "",
  photoUrl: "",
  photoObjectKey: "",
  photoDataUrl: "",
};

const STEPS = [
  { id: "person", title: "Identity", subtitle: "Applicant basics", icon: UserRound },
  { id: "contact", title: "Reach", subtitle: "Contact and address", icon: MapPinned },
  { id: "background", title: "Profile", subtitle: "Education and work", icon: BriefcaseBusiness },
  { id: "photo", title: "Finish", subtitle: "Photo and final check", icon: Camera },
] as const;

const physicalFormCopy = {
  aadhaarNo: "Aadhaar number",
  aadhaarPlaceholder: "12-digit Aadhaar number",
  houseNo: "H. No.",
  street: "Street",
  village: "Village",
  additionalAddress: "Additional address details",
};

const requiredFields = new Set([
  "Applicant name",
  "Date of birth",
  "Aadhaar number",
  "Gender",
  "Mobile number",
  "H. No.",
  "Street",
  "Village",
  "District",
  "State",
  "Pin code",
  "Education qualification",
  "Applicant photo",
]);

function formatDateOfBirthInput(value: string) {
  return value.trim();
}

function formatDateOfBirthForSubmission(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const digits = value.replace(/\D/g, "");
  if (digits.length !== 8) return value.trim();

  return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
}

function formatDateOfBirthForDisplay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatApplicationErrorMessage(code: ApplicationErrorCode, summary?: string) {
  const guide = getApplicationErrorGuideItem(code);
  return `${summary ?? guide.summary} Error code: ${code}.`;
}

function formatAadhaarInput(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 12)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function getAadhaarDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 12);
}

function createTestApplicantPhotoDataUrl(name: string) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
      <rect width="640" height="800" fill="#f6efe4"/>
      <circle cx="320" cy="255" r="122" fill="#173f33"/>
      <path d="M128 690c26-151 128-238 192-238s166 87 192 238" fill="#f2b544"/>
      <text x="320" y="292" text-anchor="middle" font-family="Arial, sans-serif" font-size="92" font-weight="800" fill="#fffdf8">${initials || "TA"}</text>
      <text x="320" y="746" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#173f33">TEST PHOTO</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildTestFormData(current: FormState): FormState {
  const firstNames = ["Rahul", "Gowtham", "Anjali", "Kiran", "Madhavi", "Suresh"];
  const lastNames = ["Reddy", "Kumar", "Naik", "Goud", "Varma", "Sharma"];
  const candidateName = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
  const photoDataUrl = createTestApplicantPhotoDataUrl(candidateName);
  const aadhaarNo = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
  const phone = `9${Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join("")}`;
  const houseNo = `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}`;

  return {
    ...current,
    applicationDate: new Date().toISOString().slice(0, 10),
    candidateName,
    guardianName: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
    aadhaarNo: formatAadhaarInput(aadhaarNo),
    email: `${candidateName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    gender: Math.random() > 0.5 ? "male" : "female",
    dateOfBirth: `${Math.floor(Math.random() * 20) + 1985}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 18) + 10).padStart(2, "0")}`,
    houseNo,
    street: "Training Center Road",
    village: "Rajendranagar",
    addressLine: "Near Agriculture University",
    mandal: "Rajendranagar",
    district: "Hyderabad",
    state: "Telangana",
    pinCode: "500030",
    phone,
    residencePhone: "",
    educationQualification: getRandomItem(["10th pass", "Intermediate", "Degree", "Post graduation"]),
    occupation: getRandomItem(["Farmer", "Student", "Self employed", "Beekeeper"]),
    sponsoringOrganization: "Testing only",
    photoName: "test-applicant-photo.svg",
    photoType: "image/svg+xml",
    photoUrl: photoDataUrl,
    photoObjectKey: "",
    photoDataUrl,
  };
}

const educationOptions = [
  "No formal education",
  "Primary school",
  "Secondary school",
  "Intermediate / 12th",
  "ITI / Diploma",
  "Farmer",
  "Graduate",
  "Postgraduate",
  "Agriculture / Horticulture graduate",
  "Other",
];

function buildAddressLine(data: Pick<FormState, "houseNo" | "street" | "village" | "addressLine">) {
  return [
    data.houseNo ? `H. No. ${data.houseNo}` : "",
    data.street ? `Street: ${data.street}` : "",
    data.village ? `Village: ${data.village}` : "",
    data.addressLine,
  ]
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
}

function requiredStepFields(stepIndex: number, data: FormState) {
  if (stepIndex === 0) {
    return Boolean(
        data.candidateName &&
        data.gender &&
        /^\d{12}$/.test(getAadhaarDigits(data.aadhaarNo)) &&
        data.dateOfBirth,
    );
  }

  if (stepIndex === 1) {
    return Boolean(
        data.houseNo &&
        data.street &&
        data.village &&
        data.mandal &&
        data.district &&
        data.state &&
        /^\d{6}$/.test(data.pinCode) &&
        /^\d{10}$/.test(data.phone),
    );
  }

  if (stepIndex === 2) {
    return Boolean(data.educationQualification);
  }

  return Boolean(data.photoUrl && data.photoName);
}

export function TrainingApplicationForm({ language, serviceOptions, selectedServiceTitle }: Props) {
  const copy = {
    en: {
      steps: [
        { title: "Identity", subtitle: "Applicant basics" },
        { title: "Reach", subtitle: "Contact and address" },
        { title: "Profile", subtitle: "Education and work" },
        { title: "Finish", subtitle: "Photo and final check" },
      ],
      enrollmentFlow: "Enrollment flow",
      applyLead: "Application",
      sidebarNote: "",
      selectedTraining: "Selected training",
      selectTraining: "Select training",
      applicationDate: "Application date",
      dateOfBirth: "Date of birth",
      applicantName: "Applicant name",
      applicantNamePlaceholder: "Full name as per records",
      guardianName: "Guardian name",
      guardianPlaceholder: "Parent / spouse / guardian",
      gender: "Gender",
      male: "Male",
      female: "Female",
      mobileNumber: "Mobile number",
      mobilePlaceholder: "10-digit number",
      emailAddress: "Email address",
      optional: "Optional",
      residencePhone: "Residence phone",
      aadhaarNo: "Aadhaar number",
      aadhaarPlaceholder: "12-digit Aadhaar number",
      address: "Address",
      addressPlaceholder: "Additional address details",
      houseNo: "H. No.",
      street: "Street",
      village: "Village",
      mandal: "Mandal",
      district: "District",
      state: "State",
      pinCode: "Pin code",
      pinPlaceholder: "6 digits",
      education: "Education qualification",
      occupation: "Occupation",
      sponsor: "Sponsoring organization",
      keepExactTitle: "",
      keepExactBody: "",
      photo: "Applicant photo",
      photoHelp: "",
      photoUploaded: "Uploaded and ready",
      applicant: "Applicant",
      phone: "Phone",
      program: "Program",
      pending: "Pending",
      previous: "Previous",
      next: "Next",
      submitting: "Submitting",
      submitApplication: "Submit application",
      waitUpload: "Photo upload is in progress.",
      uploadBeforeSubmit: "Applicant photo is required.",
      openingPayment: "Submitting application and opening secure payment gateway...",
      redirecting: "Application saved. Redirecting to secure payment...",
      saved: "Application saved successfully.",
  uploadReady: "Photo prepared and ready.",
      uploadFail: "Photo upload failed.",
    },
    te: {
      steps: [
        { title: "గుర్తింపు", subtitle: "దరఖాస్తుదారు వివరాలు" },
        { title: "సంప్రదింపు", subtitle: "చిరునామా మరియు కనెక్ట్" },
        { title: "ప్రొఫైల్", subtitle: "విద్య మరియు పని" },
        { title: "ముగింపు", subtitle: "ఫోటో మరియు చివరి తనిఖీ" },
      ],
      enrollmentFlow: "నమోదు ప్రవాహం",
      applyLead: "దరఖాస్తు",
      sidebarNote: "",
      selectedTraining: "ఎంచుకున్న శిక్షణ",
      selectTraining: "శిక్షణను ఎంచుకోండి",
      applicationDate: "దరఖాస్తు తేదీ",
      dateOfBirth: "జన్మ తేదీ",
      applicantName: "దరఖాస్తుదారు పేరు",
      applicantNamePlaceholder: "రికార్డుల ప్రకారం పూర్తి పేరు",
      guardianName: "గార్డియన్ పేరు",
      guardianPlaceholder: "తల్లిదండ్రులు / జీవిత భాగస్వామి / గార్డియన్",
      gender: "లింగం",
      male: "పురుషుడు",
      female: "స్త్రీ",
      mobileNumber: "మొబైల్ నంబర్",
      mobilePlaceholder: "10 అంకెల నంబర్",
      emailAddress: "ఇమెయిల్ చిరునామా",
      optional: "ఐచ్చికం",
      residencePhone: "నివాస ఫోన్",
      address: "చిరునామా",
      addressPlaceholder: "ఇల్లు, వీధి, గ్రామం లేదా ప్రాంతం",
      mandal: "మండలం / బ్లాక్",
      district: "జిల్లా",
      state: "రాష్ట్రం",
      pinCode: "పిన్ కోడ్",
      pinPlaceholder: "6 అంకెలు",
      education: "విద్యార్హత",
      occupation: "వృత్తి",
      sponsor: "ప్రాయోజక సంస్థ",
      keepExactTitle: "",
      keepExactBody: "",
      photo: "దరఖాస్తుదారు ఫోటో",
      photoHelp: "",
      photoUploaded: "అప్లోడ్ అయి సిద్ధంగా ఉంది",
      applicant: "దరఖాస్తుదారు",
      phone: "ఫోన్",
      program: "కార్యక్రమం",
      pending: "పూర్తి కాలేదు",
      previous: "మునుపటి",
      next: "తదుపరి",
      submitting: "సమర్పిస్తోంది",
      submitApplication: "దరఖాస్తు సమర్పించండి",
      waitUpload: "ఫోటో అప్లోడ్ జరుగుతోంది.",
      uploadBeforeSubmit: "దరఖాస్తుదారు ఫోటో అవసరం.",
      openingPayment: "Submitting application and opening secure payment gateway...",
      redirecting: "దరఖాస్తు సేవ్ అయింది. సురక్షిత చెల్లింపు గేట్‌వేకు తీసుకెళ్తున్నాం...",
      saved: "దరఖాస్తు విజయవంతంగా సేవ్ అయింది.",
      uploadReady: "ఫోటో అప్లోడ్ అయి సిద్ధంగా ఉంది.",
      uploadFail: "ఫోటో అప్లోడ్ విఫలమైంది.",
    },
    hi: {
      steps: [
        { title: "पहचान", subtitle: "आवेदक की बुनियादी जानकारी" },
        { title: "संपर्क", subtitle: "पता और संपर्क" },
        { title: "प्रोफाइल", subtitle: "शिक्षा और कार्य" },
        { title: "समाप्ति", subtitle: "फोटो और अंतिम जांच" },
      ],
      enrollmentFlow: "नामांकन प्रवाह",
      applyLead: "आवेदन",
      sidebarNote: "",
      selectedTraining: "चयनित प्रशिक्षण",
      selectTraining: "प्रशिक्षण चुनें",
      applicationDate: "आवेदन तिथि",
      dateOfBirth: "जन्म तिथि",
      applicantName: "आवेदक का नाम",
      applicantNamePlaceholder: "रिकॉर्ड के अनुसार पूरा नाम",
      guardianName: "अभिभावक का नाम",
      guardianPlaceholder: "माता-पिता / जीवनसाथी / अभिभावक",
      gender: "लिंग",
      male: "पुरुष",
      female: "महिला",
      mobileNumber: "मोबाइल नंबर",
      mobilePlaceholder: "10 अंकों का नंबर",
      emailAddress: "ईमेल पता",
      optional: "वैकल्पिक",
      residencePhone: "निवास फोन",
      address: "पता",
      addressPlaceholder: "घर, गली, गांव या क्षेत्र",
      mandal: "मंडल / ब्लॉक",
      district: "जिला",
      state: "राज्य",
      pinCode: "पिन कोड",
      pinPlaceholder: "6 अंक",
      education: "शैक्षिक योग्यता",
      occupation: "व्यवसाय",
      sponsor: "प्रायोजक संस्था",
      keepExactTitle: "",
      keepExactBody: "",
      photo: "आवेदक का फोटो",
      photoHelp: "",
      photoUploaded: "अपलोड हो गया और तैयार है",
      applicant: "आवेदक",
      phone: "फोन",
      program: "कार्यक्रम",
      pending: "शेष",
      previous: "पिछला",
      next: "अगला",
      submitting: "भेजा जा रहा है",
      submitApplication: "आवेदन जमा करें",
      waitUpload: "फोटो अपलोड जारी है।",
      uploadBeforeSubmit: "आवेदक का फोटो आवश्यक है।",
      openingPayment: "Submitting application and opening secure payment gateway...",
      redirecting: "आवेदन सहेजा गया। सुरक्षित भुगतान गेटवे पर ले जाया जा रहा है...",
      saved: "आवेदन सफलतापूर्वक सहेजा गया।",
      uploadReady: "फोटो अपलोड होकर तैयार है।",
      uploadFail: "फोटो अपलोड विफल हुआ।",
    },
  }[language];
  const normalizedServiceOptions = serviceOptions.length
    ? serviceOptions
    : [{ title: DEFAULT_SERVICE_NAME, duration: "As scheduled", level: "FOUNDATION", imageSrc: "/beekeeping-training-program.png", imageAlt: "Scientific beekeeping training program" }];
  const lockedService =
    normalizedServiceOptions.find((service) => service.title === selectedServiceTitle) ?? null;
  const initialServiceName = lockedService?.title ?? normalizedServiceOptions[0].title;
  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    serviceName: initialServiceName,
  });
  const [step, setStep] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [photoUploadState, setPhotoUploadState] = useState<PhotoUploadState>("idle");
  const [message, setMessage] = useState("");
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [photoStatus, setPhotoStatus] = useState(copy.photoHelp);
  const [showPreview, setShowPreview] = useState(false);
  const [testAutofillOpen, setTestAutofillOpen] = useState(false);
  const [testAutofillCode, setTestAutofillCode] = useState("");
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const hasUploadedPhoto = Boolean(form.photoUrl && form.photoName);
  const showTestAutofill = process.env.NEXT_PUBLIC_ENABLE_TEST_AUTOFILL === "true";

  const progress = ((step + 1) / STEPS.length) * 100;
  const canAdvance = requiredStepFields(step, form);
  const completedSteps = STEPS.filter((_, index) => requiredStepFields(index, form)).length;
  const selectedService =
    normalizedServiceOptions.find((service) => service.title === form.serviceName) ?? normalizedServiceOptions[0];

  useEffect(() => {
    if (!showPreview) return;
    window.setTimeout(() => {
      const scrollContainer = document.querySelector("[data-application-scroll]");
      if (scrollContainer instanceof HTMLElement) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      document.getElementById("application-review")?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 60);
  }, [showPreview]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleTestAutofill() {
    if (!testAutofillOpen) {
      setTestAutofillOpen(true);
      setMessage("Enter test code 54321 to auto fill random testing details.");
      return;
    }

    if (testAutofillCode.trim() !== "54321") {
      setSubmitState("error");
      setMessage("Invalid test code. Auto fill was not applied.");
      return;
    }

    const testForm = buildTestFormData(form);
    setForm(testForm);
    setPhotoPreviewUrl(testForm.photoDataUrl);
    setPhotoStatus("Test photo added. Random test details filled.");
    setPhotoUploadState("uploaded");
    setSubmitState("idle");
    setMessage("Random test details filled. Review before submitting.");
    setTestAutofillCode("");
    setTestAutofillOpen(false);
    setShowPreview(false);
    setStep(0);
  }

  async function onPhotoChange(file: File | null) {
    if (!file) {
      setPhotoUploadState("idle");
      updateField("photoUrl", "");
      updateField("photoObjectKey", "");
      updateField("photoDataUrl", "");
      updateField("photoName", "");
      updateField("photoType", "");
      setPhotoPreviewUrl("");
      setPhotoStatus(copy.photoHelp);
      return;
    }

    setSubmitState("compressing");
    setPhotoUploadState("uploading");
    setMessage("");
    setPhotoStatus(`Preparing ${file.name}...`);

    try {
      const optimized = await optimizeImageForInlineStorage(file, { maxSide: 1200 });
      setPhotoStatus(`Preparing ${optimized.fileName}...`);

      setForm((current) => ({
        ...current,
        photoName: optimized.fileName,
        photoType: optimized.mimeType,
        photoUrl: optimized.dataUrl,
        photoObjectKey: "",
        photoDataUrl: optimized.dataUrl,
      }));
      setPhotoPreviewUrl(optimized.dataUrl);
      setPhotoStatus(copy.uploadReady);
      setPhotoUploadState("uploaded");
      setSubmitState("idle");
    } catch (error) {
      setPhotoUploadState("error");
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Photo upload failed.");
      setPhotoStatus(copy.uploadFail);
    }
  }

  async function handleSubmit() {
    if (photoUploadState === "uploading" || submitState === "compressing") {
      setMessage(formatApplicationErrorMessage("APP-PHOTO-001", "Applicant photo is still being prepared."));
      setSubmitState("error");
      return;
    }

    if (!requiredStepFields(3, form)) {
      setMessage(formatApplicationErrorMessage("APP-PHOTO-001", "Applicant photo is missing."));
      setSubmitState("error");
      return;
    }

    setSubmitState("submitting");
    setMessage(copy.openingPayment);

    try {
      const response = await fetch("/api/training-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          aadhaarNo: getAadhaarDigits(form.aadhaarNo),
          dateOfBirth: formatDateOfBirthForSubmission(form.dateOfBirth),
          addressLine: buildAddressLine(form),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? formatApplicationErrorMessage("APP-UNKNOWN-001", "Application submission failed unexpectedly."));
      }

      const body = await response.json();
      setSubmitState("success");
      if (body.redirectUrl) {
        setMessage(body.message ?? copy.redirecting);
        window.location.assign(body.redirectUrl);
        return;
      }

      setSubmitState("error");
      setMessage(body.message ?? formatApplicationErrorMessage("APP-PAY-002", "Application saved, but payment checkout did not return a link."));
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : formatApplicationErrorMessage("APP-NET-001", "Browser could not complete the application submit request."));
    }
  }

  function openPreview() {
    if (photoUploadState === "uploading" || submitState === "compressing") {
      setMessage(copy.waitUpload);
      setSubmitState("error");
      return;
    }

    if (!requiredStepFields(3, form)) {
      setMessage(copy.uploadBeforeSubmit);
      setSubmitState("error");
      return;
    }

    setMessage("");
    setSubmitState("idle");
    setShowPreview(true);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="overflow-hidden rounded-[1.1rem] border border-[#e3ded2] bg-white shadow-[0_24px_70px_rgba(34,45,38,0.08)]">
        <div className="relative z-10 grid min-w-0">
          <aside className="min-w-0 border-b border-[#e8dfd1] bg-[#faf7f0] px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b36b00]">{copy.enrollmentFlow}</p>
                  <span className="hidden h-1.5 w-1.5 rounded-full bg-[#d5c7b3] sm:block" aria-hidden="true" />
                  <h2 className="text-base font-black leading-tight text-[#173f33] sm:text-lg">{showPreview ? "Review and pay" : copy.applyLead}</h2>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                {showTestAutofill ? (
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {testAutofillOpen ? (
                      <input
                        value={testAutofillCode}
                        onChange={(event) => setTestAutofillCode(event.target.value.replace(/\D/g, "").slice(0, 5))}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleTestAutofill();
                          }
                        }}
                        placeholder="Code"
                        inputMode="numeric"
                        className="h-9 w-24 rounded-full border border-[#f2b544]/50 bg-white px-3 text-xs font-black text-[#173f33] outline-none ring-[#f2b544] placeholder:text-[#9a8b72] focus:ring-2"
                        aria-label="Test autofill code"
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={handleTestAutofill}
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-[#f2b544]/45 bg-white px-3 py-2 uppercase tracking-[0.12em] text-[#173f33] shadow-[0_8px_18px_rgba(34,45,38,0.06)]"
                    >
                      <WandSparkles className="h-3.5 w-3.5 text-[#b36b00]" aria-hidden="true" />
                      {testAutofillOpen ? "Fill" : "Auto fill test"}
                    </button>
                  </div>
                ) : null}
                <div className="rounded-full bg-[#173f33] px-3 py-2 uppercase tracking-[0.12em] text-white">
                  {showPreview ? `${completedSteps}/${STEPS.length} ready` : `Step ${step + 1}/${STEPS.length}`}
                </div>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-[#b36b00] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 grid min-w-0 grid-cols-4 gap-1.5">
              {STEPS.map((item, index) => {
                const Icon = item.icon;
                const active = index === step;
                const passed = index < step;
                const complete = requiredStepFields(index, form);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStep(index)}
                    className={`min-w-0 rounded-lg px-2 py-2 text-left transition sm:px-3 ${
                      active
                        ? "bg-white shadow-[0_10px_24px_rgba(34,45,38,0.08)]"
                        : passed
                          ? "bg-white/70"
                          : "bg-transparent"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${active ? "bg-[#173f33] text-white" : "bg-white text-[#b36b00]"}`}>
                        {complete ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-[#173f33] sm:text-sm">{copy.steps[index].title}</p>
                        <p className="hidden truncate text-[11px] font-semibold text-[#66776f] lg:block">{copy.steps[index].subtitle}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {copy.sidebarNote ? (
            <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              {copy.sidebarNote ? (
                <div className="rounded-[1.15rem] border border-[#e3ded2] bg-white p-4 text-sm leading-7 text-[#5c6d63]">
                  {copy.sidebarNote}
                </div>
              ) : <span aria-hidden="true" />}
            </div>
            ) : null}
          </aside>

          {showPreview ? (
            <ApplicationPreview
              form={form}
              photoPreviewUrl={photoPreviewUrl}
              submitting={submitState === "submitting"}
              submitState={submitState}
              message={message}
              onEdit={() => setShowPreview(false)}
              onConfirm={() => void handleSubmit()}
            />
          ) : (
          <div className="grid min-w-0 gap-6 bg-white px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="min-w-0">
            <div className="border-b border-[#e8dfd1] pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b36b00]">
                    {copy.steps[step].title} / {step + 1} of {STEPS.length}
                  </p>
                  <h3 className="mt-1 text-2xl font-black leading-tight text-[#173f33] sm:text-3xl">{copy.steps[step].subtitle}</h3>
                </div>
              </div>
              <p className="mt-3 rounded-lg bg-[#fff7e8] px-3 py-2 text-sm font-semibold leading-6 text-[#7a4b00]">
                Please fill all personal details exactly as per Aadhaar card.
              </p>
            </div>

            <div className="mt-5 grid gap-5">
              {step === 0 ? (
                <div className="grid gap-5">
                  {lockedService ? null : (
                    <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                      {copy.selectTraining}
                      <select
                        value={form.serviceName}
                        onChange={(event) => updateField("serviceName", event.target.value)}
                        className="min-w-0 rounded-[1.2rem] border border-[rgba(41,56,49,0.12)] bg-[#fffdf8] px-4 py-3 text-base text-[#1b3b2b] outline-none ring-[#f2b544] focus:ring-2"
                      >
                        {normalizedServiceOptions.map((service) => (
                          <option key={service.title} value={service.title}>
                            {service.title} - {service.duration} - {service.level}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label={copy.applicantName} required>
                      <input
                        value={form.candidateName}
                        onChange={(event) => updateField("candidateName", event.target.value)}
                        placeholder={copy.applicantNamePlaceholder}
                        className={inputClassName}
                      />
                    </Field>

                    <Field label={copy.guardianName}>
                      <input
                        value={form.guardianName}
                        onChange={(event) => updateField("guardianName", event.target.value)}
                        placeholder={copy.guardianPlaceholder}
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label={copy.dateOfBirth} required>
                      <div className="relative">
                        <input
                          type="date"
                          value={form.dateOfBirth}
                          onChange={(event) => updateField("dateOfBirth", formatDateOfBirthInput(event.target.value))}
                          min="1900-01-01"
                          max={new Date().toISOString().slice(0, 10)}
                          className={dateInputClassName}
                        />
                        <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9c6a18]" aria-hidden="true" />
                      </div>
                    </Field>

                    <Field label={physicalFormCopy.aadhaarNo} required>
                      <input
                        value={form.aadhaarNo}
                        onChange={(event) => updateField("aadhaarNo", formatAadhaarInput(event.target.value))}
                        placeholder={physicalFormCopy.aadhaarPlaceholder}
                        inputMode="numeric"
                        maxLength={14}
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-2 text-sm font-semibold text-[#516253]">
                    <span>{copy.gender}<RequiredStar /></span>
                    <div className="inline-grid w-fit grid-cols-2 gap-1 rounded-[0.95rem] border border-[rgba(41,56,49,0.12)] bg-[#fffdf8] p-1">
                      {[
                        { value: "male", label: copy.male, icon: Mars },
                        { value: "female", label: copy.female, icon: Venus },
                      ].map((option) => (
                        <GenderButton
                          key={option.value}
                          icon={option.icon}
                          label={option.label}
                          selected={form.gender === option.value}
                          onClick={() => updateField("gender", option.value as "male" | "female")}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={copy.mobileNumber} required>
                      <input
                        value={form.phone}
                        onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder={copy.mobilePlaceholder}
                        inputMode="numeric"
                        className={inputClassName}
                      />
                    </Field>
                    <Field label={copy.emailAddress}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        placeholder={copy.optional}
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={physicalFormCopy.houseNo} required>
                      <input
                        value={form.houseNo}
                        onChange={(event) => updateField("houseNo", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label={physicalFormCopy.street} required>
                      <input
                        value={form.street}
                        onChange={(event) => updateField("street", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <Field label={physicalFormCopy.village} required>
                    <input
                      value={form.village}
                      onChange={(event) => updateField("village", event.target.value)}
                      className={inputClassName}
                    />
                  </Field>

                  <Field label={physicalFormCopy.additionalAddress}>
                    <textarea
                      value={form.addressLine}
                      onChange={(event) => updateField("addressLine", event.target.value)}
                      rows={3}
                      placeholder={copy.addressPlaceholder}
                      className={textareaClassName}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={copy.mandal} required>
                      <input
                        value={form.mandal}
                        onChange={(event) => updateField("mandal", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label={copy.district} required>
                      <input
                        value={form.district}
                        onChange={(event) => updateField("district", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={copy.state} required>
                      <input
                        value={form.state}
                        onChange={(event) => updateField("state", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label={copy.pinCode} required>
                      <input
                        value={form.pinCode}
                        onChange={(event) => updateField("pinCode", event.target.value.replace(/\D/g, "").slice(0, 6))}
                        inputMode="numeric"
                        placeholder={copy.pinPlaceholder}
                        className={inputClassName}
                      />
                    </Field>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={copy.education} required>
                      <select
                        value={form.educationQualification}
                        onChange={(event) => updateField("educationQualification", event.target.value)}
                        className={inputClassName}
                      >
                        <option value="">Select education</option>
                        {educationOptions.map((education) => (
                          <option key={education} value={education}>{education}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label={copy.occupation}>
                      <input
                        value={form.occupation}
                        onChange={(event) => updateField("occupation", event.target.value)}
                        placeholder={copy.optional}
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <Field label={copy.sponsor}>
                    <input
                      value={form.sponsoringOrganization}
                      onChange={(event) => updateField("sponsoringOrganization", event.target.value)}
                      placeholder={copy.optional}
                      className={inputClassName}
                    />
                  </Field>

                  {copy.keepExactTitle || copy.keepExactBody ? (
                    <div className="section-frame rounded-[1.4rem] p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8ec5ff]/12 text-[#8ec5ff]">
                          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="text-sm leading-7 text-dim">
                          {copy.keepExactTitle ? <p className="font-semibold text-bright">{copy.keepExactTitle}</p> : null}
                          {copy.keepExactBody ? <p>{copy.keepExactBody}</p> : null}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid gap-5">
                  <Field label={copy.photo} required>
                    <div className="rounded-[1.5rem] border border-dashed border-[rgba(41,56,49,0.16)] bg-[#fffdf8] p-5">
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(event) => void onPhotoChange(event.target.files?.[0] ?? null)}
                        className="sr-only"
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(event) => void onPhotoChange(event.target.files?.[0] ?? null)}
                        className="sr-only"
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f2b544] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#0a0d12]"
                        >
                          <Camera className="h-4 w-4" aria-hidden="true" />
                          Choose photo
                        </button>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#173f33]/14 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#173f33]"
                        >
                          <Camera className="h-4 w-4" aria-hidden="true" />
                          Open camera
                        </button>
                      </div>
                      {photoStatus ? <p className="mt-3 text-sm text-dim">{photoStatus}</p> : null}
                      {hasUploadedPhoto ? (
                        <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#2a8d5f]">
                          {copy.photoUploaded}
                        </p>
                      ) : null}
                      {photoPreviewUrl ? (
                        <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-[rgba(41,56,49,0.1)] bg-[#f6efe4] p-3">
                          <div className="relative h-56 w-full overflow-hidden rounded-[1rem]">
                            <Image src={photoPreviewUrl} alt="Applicant preview" fill unoptimized className="object-cover" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Field>
                </div>
              ) : null}

              <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-3 border-t border-[rgba(41,56,49,0.1)] bg-white/95 px-4 py-4 shadow-[0_-18px_38px_rgba(34,45,38,0.06)] backdrop-blur sm:-mx-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.76)] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#1f352b] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  {copy.previous}
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      disabled={!canAdvance}
                      onClick={() => setStep((current) => Math.min(STEPS.length - 1, current + 1))}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f2b544] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#0a0d12] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {copy.next}
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={
                        submitState === "submitting" ||
                        submitState === "compressing" ||
                        photoUploadState === "uploading" ||
                        !hasUploadedPhoto
                      }
                      onClick={openPreview}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#0a0d12] shadow-[0_16px_40px_rgba(242,181,68,0.22)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      Review application
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {message ? (
                <p className={submitState === "success" ? "text-sm font-semibold text-[#2a8d5f]" : "text-sm font-semibold text-[#8e3d2f]"}>
                  {message}
                </p>
              ) : null}
            </div>
          </section>
          <ApplicationSummary
            form={form}
          selectedService={selectedService}
        />
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ApplicationSummary({
  form,
  selectedService,
}: {
  form: FormState;
  selectedService: ServiceOption;
}) {
  const courseSummary = getEnrollmentCourseSummary(form.serviceName);

  return (
    <aside className="min-w-0 rounded-[1.05rem] border border-[#e8dfd1] bg-white p-5 shadow-[0_18px_40px_rgba(34,45,38,0.06)] lg:sticky lg:top-4 lg:self-start">
      <h3 className="text-lg font-black text-[#171b18]">Enrollment Summary</h3>

      <div className="mt-6 flex gap-4 border-b border-[#eee6d8] pb-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#fff3e8]">
          {selectedService.imageSrc ? (
            <Image
              src={selectedService.imageSrc}
              alt={selectedService.imageAlt ?? selectedService.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-black text-[#171b18]">{form.serviceName}</p>
          <p className="mt-1 text-sm font-semibold text-[#6e7770]">{selectedService.duration}</p>
          <p className="mt-1 text-sm font-semibold text-[#6e7770]">{selectedService.level}</p>
        </div>
      </div>

      <div className="mt-5 border-b border-[#eee6d8] pb-5">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#ff5a1f]">Course summary</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#4d5852]">{courseSummary}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-black text-[#171b18]">
          <div className="rounded-lg bg-[#fff7ec] px-3 py-2">
            <span className="block text-[10px] uppercase tracking-[0.14em] text-[#8b7d6b]">Duration</span>
            {selectedService.duration}
          </div>
          <div className="rounded-lg bg-[#fff7ec] px-3 py-2">
            <span className="block text-[10px] uppercase tracking-[0.14em] text-[#8b7d6b]">Level</span>
            {selectedService.level}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-center text-xs font-black text-[#5d665f]">
        <div className="grid min-h-16 place-items-center rounded-xl bg-[#f7f3ff] px-3 py-3">
          <Image
            src="/phonepe-payment-gateway.png"
            alt="PhonePe Payment Gateway"
            width={220}
            height={60}
            className="h-auto max-h-10 w-full max-w-[13rem] object-contain"
          />
        </div>
      </div>
    </aside>
  );
}

function getEnrollmentCourseSummary(serviceName: string) {
  const normalized = serviceName.toLowerCase();

  if (normalized.includes("honey processing")) {
    return "Hands-on training for hygienic honey handling, processing discipline, bottling, quality awareness, and value-addition workflow.";
  }

  if (normalized.includes("queen") || normalized.includes("colony")) {
    return "Advanced program focused on queen rearing, colony multiplication, nucleus management, and planned apiary expansion.";
  }

  if (normalized.includes("royal jelly")) {
    return "Specialized training for royal jelly collection, handling, hygiene, and high-value hive-product production practices.";
  }

  return "Foundation beekeeping program covering bee biology, hive handling, apiary management, safety, and livelihood-ready scientific practice.";
}

function RequiredStar() {
  return <span className="ml-1 text-[#ff5a1f]" aria-label="required">*</span>;
}

function Field({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#516253]">
      <span>{label}{required || requiredFields.has(label) ? <RequiredStar /> : null}</span>
      {children}
    </label>
  );
}

function GenderButton({
  icon: Icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex h-10 min-w-24 items-center justify-center gap-2 rounded-[0.75rem] px-3 text-sm font-black transition ${
        selected
          ? "bg-[#173f33] text-[#fff9ec] shadow-[0_8px_18px_rgba(23,63,51,0.16)]"
          : "text-[#607366] hover:bg-[#eef3ef] hover:text-[#173f33]"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden={true} />
      {label}
    </button>
  );
}

function ApplicationPreview({
  form,
  photoPreviewUrl,
  submitting,
  submitState,
  message,
  onEdit,
  onConfirm,
}: {
  form: FormState;
  photoPreviewUrl: string;
  submitting: boolean;
  submitState: SubmitState;
  message: string;
  onEdit: () => void;
  onConfirm: () => void;
}) {
  const address = buildAddressLine(form);
  const rows = [
    ["Training", form.serviceName],
    ["Applicant name", form.candidateName],
    ["Guardian name", form.guardianName],
    ["Aadhaar number", form.aadhaarNo],
    ["Gender", form.gender ? form.gender[0].toUpperCase() + form.gender.slice(1) : ""],
    ["Date of birth", formatDateOfBirthForDisplay(form.dateOfBirth)],
    ["Mobile number", form.phone],
    ["Email", form.email],
    ["Address", address],
    ["Mandal", form.mandal],
    ["District", form.district],
    ["State", form.state],
    ["Pin code", form.pinCode],
    ["Education", form.educationQualification],
    ["Occupation", form.occupation],
    ["Sponsoring organization", form.sponsoringOrganization],
  ] as const;

  return (
    <section id="application-review" className="mx-auto w-full max-w-5xl min-w-0 scroll-mt-36 bg-white sm:scroll-mt-8">
      <div className="grid gap-4 border-b border-[#eee6d8] bg-[#173f33] px-4 py-4 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f2b544]">Cross-check before payment</p>
          <h3 className="mt-1 text-2xl font-black leading-tight">Application complete</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-white/75">Review once, then continue to secure PhonePe checkout.</p>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="grid min-w-0 gap-x-6 gap-y-1 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <ReviewRow key={label} label={label} value={value} wide={label === "Address"} />
          ))}
        </div>

        <aside className="min-w-0 border-l-0 border-[#eee6d8] lg:border-l lg:pl-5">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b36b00]">Applicant photo</p>
          {photoPreviewUrl ? (
            <div className="relative mt-3 aspect-[4/5] overflow-hidden rounded-[1rem] bg-[#f7f3ea]">
              <Image src={photoPreviewUrl} alt="Applicant photo preview" fill unoptimized className="object-cover" />
            </div>
          ) : (
            <div className="mt-3 grid aspect-[4/5] place-items-center rounded-[1rem] bg-[#f7f3ea] text-center text-sm font-semibold text-[#66776f]">
              Photo not uploaded
            </div>
          )}
        </aside>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 border-t border-[#eee6d8] bg-white/95 px-4 py-4 shadow-[0_-18px_38px_rgba(34,45,38,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-end sm:px-6">
        {message ? (
          <p
            className={`rounded-[1rem] border px-4 py-3 text-sm font-semibold sm:mr-auto ${
              submitState === "success"
                ? "border-[#2a8d5f]/20 bg-[#eefaf3] text-[#1f7a50]"
                : "border-[#c85b42]/20 bg-[#fff3ee] text-[#8e3d2f]"
            }`}
          >
            {message}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onEdit}
          disabled={submitting}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[rgba(41,56,49,0.16)] bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#173f33] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Edit details
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          aria-busy={submitting}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#173f33,#0d261f)] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_44px_rgba(23,63,51,0.24)] disabled:cursor-wait disabled:opacity-80 sm:w-auto"
        >
          {submitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              Opening payment gateway...
            </>
          ) : (
            <>
              Confirm and continue to payment
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

function ReviewRow({ label, value, wide = false }: { label: string; value?: string; wide?: boolean }) {
  return (
    <div className={`border-b border-[#eee6d8] py-2.5 ${wide ? "sm:col-span-2" : ""}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8b7d6b]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold leading-6 text-[#173f33]">{value?.trim() || "Not provided"}</p>
    </div>
  );
}

const inputClassName =
  "min-h-12 min-w-0 rounded-[1.2rem] border border-[rgba(41,56,49,0.12)] bg-[#fffdf8] px-4 py-3 text-base text-[#1b3b2b] outline-none ring-[#f2b544] placeholder:text-[#7d8b83] focus:ring-2";

const dateInputClassName =
  `${inputClassName} w-full pr-12 tracking-normal [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`;

const textareaClassName =
  "min-h-28 min-w-0 rounded-[1.2rem] border border-[rgba(41,56,49,0.12)] bg-[#fffdf8] px-4 py-3 text-base text-[#1b3b2b] outline-none ring-[#f2b544] placeholder:text-[#7d8b83] focus:ring-2";
