"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPinned,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { getApplicationPhotoUploadUrlAction } from "@/app/actions/storage";
import type { SiteLanguage } from "@/lib/i18n";

type FormState = {
  serviceName: string;
  applicationDate: string;
  candidateName: string;
  guardianName: string;
  email: string;
  gender: "male" | "female" | "";
  dateOfBirth: string;
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
};

type SubmitState = "idle" | "compressing" | "submitting" | "success" | "error";
type PhotoUploadState = "idle" | "uploading" | "uploaded" | "error";
type ServiceOption = {
  title: string;
  duration: string;
  level: string;
};

type Props = {
  language: SiteLanguage;
  serviceOptions: ServiceOption[];
  selectedServiceTitle?: string;
};

const DEFAULT_SERVICE_NAME = "Beekeeping";

const INITIAL_FORM: FormState = {
  serviceName: DEFAULT_SERVICE_NAME,
  applicationDate: new Date().toISOString().slice(0, 10),
  candidateName: "",
  guardianName: "",
  email: "",
  gender: "",
  dateOfBirth: "",
  addressLine: "",
  mandal: "",
  district: "",
  state: "Telangana",
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
};

const STEPS = [
  { id: "person", title: "Identity", subtitle: "Applicant basics", icon: UserRound },
  { id: "contact", title: "Reach", subtitle: "Contact and address", icon: MapPinned },
  { id: "background", title: "Profile", subtitle: "Education and work", icon: BriefcaseBusiness },
  { id: "photo", title: "Finish", subtitle: "Photo and final check", icon: Camera },
] as const;

function dataUrlFromBlob(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read image."));
    reader.readAsDataURL(blob);
  });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to open image."));
    };
    image.src = objectUrl;
  });
}

async function optimizePhoto(file: File) {
  const image = await loadImage(file);
  const longestSide = 1200;
  const scale = Math.min(1, longestSide / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to process the image.");
  }

  context.drawImage(image, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.82);
  });

  if (!blob) {
    throw new Error("Unable to optimize the photo.");
  }

  const dataUrl = await dataUrlFromBlob(blob);
  return {
    previewUrl: dataUrl,
    blob,
    photoType: "image/jpeg",
    photoName: `${file.name.replace(/\.[^.]+$/, "")}.jpg`,
  };
}

function requiredStepFields(stepIndex: number, data: FormState) {
  if (stepIndex === 0) {
    return Boolean(
      data.applicationDate &&
        data.candidateName &&
        data.guardianName &&
        data.gender &&
        data.dateOfBirth,
    );
  }

  if (stepIndex === 1) {
    return Boolean(
      data.addressLine &&
        data.mandal &&
        data.district &&
        data.state &&
        /^\d{6}$/.test(data.pinCode) &&
        /^\d{10}$/.test(data.phone),
    );
  }

  if (stepIndex === 2) {
    return true;
  }

  return Boolean(data.photoUrl && data.photoObjectKey && data.photoName);
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
      applyLead: "Apply in four clean steps.",
      sidebarNote: "Review the program, fill the details, upload the photo, and finish payment in one flow.",
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
      address: "Address",
      addressPlaceholder: "House, street, village or locality",
      mandal: "Mandal / block",
      district: "District",
      state: "State",
      pinCode: "Pin code",
      pinPlaceholder: "6 digits",
      education: "Education qualification",
      occupation: "Occupation",
      sponsor: "Sponsoring organization",
      keepExactTitle: "Keep it exact.",
      keepExactBody: "These details are used to identify the applicant during payment review and admission follow-up.",
      photo: "Applicant photo",
      photoHelp: "Upload one clear face photo. We compress it automatically before sending.",
      photoUploaded: "Uploaded and ready",
      applicant: "Applicant",
      phone: "Phone",
      program: "Program",
      pending: "Pending",
      previous: "Previous",
      next: "Next",
      submitting: "Submitting",
      submitApplication: "Submit application",
      waitUpload: "Wait for the photo upload to finish before submitting.",
      uploadBeforeSubmit: "Upload the applicant photo before submitting.",
      redirecting: "Application saved. Redirecting to secure payment...",
      saved: "Application saved successfully.",
      uploadReady: "Photo uploaded and ready.",
      uploadFail: "Photo upload failed. Please choose the image again.",
    },
    te: {
      steps: [
        { title: "గుర్తింపు", subtitle: "దరఖాస్తుదారు వివరాలు" },
        { title: "సంప్రదింపు", subtitle: "చిరునామా మరియు కనెక్ట్" },
        { title: "ప్రొఫైల్", subtitle: "విద్య మరియు పని" },
        { title: "ముగింపు", subtitle: "ఫోటో మరియు చివరి తనిఖీ" },
      ],
      enrollmentFlow: "నమోదు ప్రవాహం",
      applyLead: "నాలుగు స్పష్టమైన దశల్లో దరఖాస్తు పూర్తి చేయండి.",
      sidebarNote: "కార్యక్రమాన్ని పరిశీలించండి, వివరాలు నమోదు చేయండి, ఫోటో అప్లోడ్ చేయండి, తరువాత ఒకే ప్రవాహంలో చెల్లింపు పూర్తి చేయండి.",
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
      keepExactTitle: "సరిగ్గా నమోదు చేయండి.",
      keepExactBody: "చెల్లింపు నిర్ధారణ మరియు అడ్మిషన్ ఫాలో-అప్ సమయంలో దరఖాస్తుదారుని గుర్తించడానికి ఈ వివరాలు ఉపయోగిస్తారు.",
      photo: "దరఖాస్తుదారు ఫోటో",
      photoHelp: "ఒక స్పష్టమైన ముఖ ఫోటో అప్లోడ్ చేయండి. పంపించే ముందు దాన్ని ఆటోమేటిక్‌గా కుదిస్తాము.",
      photoUploaded: "అప్లోడ్ అయి సిద్ధంగా ఉంది",
      applicant: "దరఖాస్తుదారు",
      phone: "ఫోన్",
      program: "కార్యక్రమం",
      pending: "పూర్తి కాలేదు",
      previous: "మునుపటి",
      next: "తదుపరి",
      submitting: "సమర్పిస్తోంది",
      submitApplication: "దరఖాస్తు సమర్పించండి",
      waitUpload: "సమర్పించే ముందు ఫోటో అప్లోడ్ పూర్తయ్యే వరకు వేచి ఉండండి.",
      uploadBeforeSubmit: "సమర్పించే ముందు దరఖాస్తుదారు ఫోటోను అప్లోడ్ చేయండి.",
      redirecting: "దరఖాస్తు సేవ్ అయింది. సురక్షిత చెల్లింపు గేట్‌వేకు తీసుకెళ్తున్నాం...",
      saved: "దరఖాస్తు విజయవంతంగా సేవ్ అయింది.",
      uploadReady: "ఫోటో అప్లోడ్ అయి సిద్ధంగా ఉంది.",
      uploadFail: "ఫోటో అప్లోడ్ విఫలమైంది. దయచేసి మళ్లీ చిత్రం ఎంచుకోండి.",
    },
    hi: {
      steps: [
        { title: "पहचान", subtitle: "आवेदक की बुनियादी जानकारी" },
        { title: "संपर्क", subtitle: "पता और संपर्क" },
        { title: "प्रोफाइल", subtitle: "शिक्षा और कार्य" },
        { title: "समाप्ति", subtitle: "फोटो और अंतिम जांच" },
      ],
      enrollmentFlow: "नामांकन प्रवाह",
      applyLead: "चार साफ चरणों में आवेदन पूरा करें।",
      sidebarNote: "कार्यक्रम देखें, विवरण भरें, फोटो अपलोड करें और एक ही प्रवाह में भुगतान पूरा करें।",
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
      keepExactTitle: "सही जानकारी दें।",
      keepExactBody: "भुगतान समीक्षा और प्रवेश फॉलो-अप के दौरान आवेदक की पहचान के लिए इन विवरणों का उपयोग किया जाता है।",
      photo: "आवेदक का फोटो",
      photoHelp: "एक स्पष्ट चेहरा फोटो अपलोड करें। भेजने से पहले हम इसे अपने आप कंप्रेस करते हैं।",
      photoUploaded: "अपलोड हो गया और तैयार है",
      applicant: "आवेदक",
      phone: "फोन",
      program: "कार्यक्रम",
      pending: "शेष",
      previous: "पिछला",
      next: "अगला",
      submitting: "भेजा जा रहा है",
      submitApplication: "आवेदन जमा करें",
      waitUpload: "सबमिट करने से पहले फोटो अपलोड पूरा होने तक प्रतीक्षा करें।",
      uploadBeforeSubmit: "सबमिट करने से पहले आवेदक का फोटो अपलोड करें।",
      redirecting: "आवेदन सहेजा गया। सुरक्षित भुगतान गेटवे पर ले जाया जा रहा है...",
      saved: "आवेदन सफलतापूर्वक सहेजा गया।",
      uploadReady: "फोटो अपलोड होकर तैयार है।",
      uploadFail: "फोटो अपलोड विफल हुआ। कृपया फिर से छवि चुनें।",
    },
  }[language];
  const normalizedServiceOptions = serviceOptions.length
    ? serviceOptions
    : [{ title: DEFAULT_SERVICE_NAME, duration: "As scheduled", level: "FOUNDATION" }];
  const lockedService =
    normalizedServiceOptions.find((service) => service.title === selectedServiceTitle) ?? null;
  const initialServiceName = lockedService?.title ?? normalizedServiceOptions[0].title;
  const [form, setForm] = useState<FormState>({ ...INITIAL_FORM, serviceName: initialServiceName });
  const [step, setStep] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [photoUploadState, setPhotoUploadState] = useState<PhotoUploadState>("idle");
  const [message, setMessage] = useState("");
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [photoStatus, setPhotoStatus] = useState(copy.photoHelp);
  const hasUploadedPhoto = Boolean(form.photoUrl && form.photoObjectKey && form.photoName);

  const progress = ((step + 1) / STEPS.length) * 100;
  const canAdvance = requiredStepFields(step, form);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onPhotoChange(file: File | null) {
    if (!file) {
      setPhotoUploadState("idle");
      updateField("photoUrl", "");
      updateField("photoObjectKey", "");
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
      const optimized = await optimizePhoto(file);
      setPhotoStatus(`Uploading ${optimized.photoName}...`);
      const upload = await getApplicationPhotoUploadUrlAction(
        optimized.photoName,
        optimized.photoType,
      );
      if (!upload.ok) {
        throw new Error(upload.error);
      }

      const { uploadUrl, publicUrl, objectKey } = upload;

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": optimized.photoType,
        },
        body: optimized.blob,
      });

      if (!uploadResponse.ok) {
        throw new Error("Photo upload failed.");
      }

      setForm((current) => ({
        ...current,
        photoName: optimized.photoName,
        photoType: optimized.photoType,
        photoUrl: publicUrl,
        photoObjectKey: objectKey,
      }));
      setPhotoPreviewUrl(optimized.previewUrl);
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
      setMessage(copy.waitUpload);
      setSubmitState("error");
      return;
    }

    if (!requiredStepFields(3, form)) {
      setMessage(copy.uploadBeforeSubmit);
      setSubmitState("error");
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/training-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Application submission failed.");
      }

      const body = await response.json();
      setSubmitState("success");
      if (body.redirectUrl) {
        setMessage(body.message ?? copy.redirecting);
        window.location.assign(body.redirectUrl);
        return;
      }

      setMessage(body.message ?? copy.saved);
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Application submission failed.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="neo-shell rounded-[2rem] p-5 sm:p-7 lg:p-8">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,16rem)_1fr]">
          <aside className="section-frame rounded-[1.7rem] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8ec5ff]">{copy.enrollmentFlow}</p>
            <h2 className="font-display mt-4 text-3xl text-bright">{copy.applyLead}</h2>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[rgba(41,56,49,0.08)]">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#f2b544,#8ec5ff)] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 grid gap-3">
              {STEPS.map((item, index) => {
                const Icon = item.icon;
                const active = index === step;
                const passed = index < step;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStep(index)}
                    className={`rounded-[1.2rem] border px-4 py-4 text-left transition ${
                      active
                        ? "border-[#f2b544]/40 bg-[#f2b544]/10"
                        : passed
                          ? "border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.76)]"
                          : "border-[rgba(41,56,49,0.08)] bg-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-[#f2b544] text-[#0a0d12]" : "bg-[rgba(41,56,49,0.08)] text-[#1f352b]"}`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-bright">{copy.steps[index].title}</p>
                        <p className="text-xs text-dim">{copy.steps[index].subtitle}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 rounded-[1.3rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] p-4 text-sm leading-7 text-dim">
              {copy.sidebarNote}
            </div>
          </aside>

          <section className="section-frame rounded-[1.7rem] p-5 sm:p-6">
            <div className="border-b border-[rgba(41,56,49,0.1)] pb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">{copy.steps[step].title}</p>
                  <h3 className="font-display mt-3 text-3xl text-bright sm:text-4xl">{copy.steps[step].subtitle}</h3>
                </div>
                <div className="rounded-[1.2rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] px-4 py-3 text-sm text-dim">
                  <p className="font-semibold text-bright">{form.serviceName}</p>
                  <p className="mt-1">{copy.selectedTraining}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
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

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={copy.applicationDate}>
                      <input
                        type="date"
                        value={form.applicationDate}
                        onChange={(event) => updateField("applicationDate", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label={copy.dateOfBirth}>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(event) => updateField("dateOfBirth", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <Field label={copy.applicantName}>
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

                  <div className="grid gap-2 text-sm font-semibold text-[#516253]">
                    {copy.gender}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { value: "male", label: copy.male },
                        { value: "female", label: copy.female },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateField("gender", option.value as "male" | "female")}
                          className={`rounded-[1.2rem] border px-4 py-4 text-left text-base font-semibold transition ${
                            form.gender === option.value
                              ? "border-[#f2b544]/40 bg-[#f2b544]/12 text-bright"
                              : "border-[rgba(41,56,49,0.1)] bg-[#fffdf8] text-dim"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={copy.mobileNumber}>
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

                  <Field label={copy.residencePhone}>
                    <input
                      value={form.residencePhone}
                      onChange={(event) => updateField("residencePhone", event.target.value)}
                      placeholder={copy.optional}
                      className={inputClassName}
                    />
                  </Field>

                  <Field label={copy.address}>
                    <textarea
                      value={form.addressLine}
                      onChange={(event) => updateField("addressLine", event.target.value)}
                      rows={4}
                      placeholder={copy.addressPlaceholder}
                      className={textareaClassName}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={copy.mandal}>
                      <input
                        value={form.mandal}
                        onChange={(event) => updateField("mandal", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label={copy.district}>
                      <input
                        value={form.district}
                        onChange={(event) => updateField("district", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={copy.state}>
                      <input
                        value={form.state}
                        onChange={(event) => updateField("state", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label={copy.pinCode}>
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
                    <Field label={copy.education}>
                      <input
                        value={form.educationQualification}
                        onChange={(event) => updateField("educationQualification", event.target.value)}
                        placeholder={copy.optional}
                        className={inputClassName}
                      />
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

                  <div className="section-frame rounded-[1.4rem] p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8ec5ff]/12 text-[#8ec5ff]">
                        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="text-sm leading-7 text-dim">
                        <p className="font-semibold text-bright">{copy.keepExactTitle}</p>
                        <p>{copy.keepExactBody}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid gap-5">
                  <Field label={copy.photo}>
                    <div className="rounded-[1.5rem] border border-dashed border-[rgba(41,56,49,0.16)] bg-[#fffdf8] p-5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => void onPhotoChange(event.target.files?.[0] ?? null)}
                        className="block w-full text-sm text-dim file:mr-4 file:rounded-full file:border-0 file:bg-[#f2b544] file:px-4 file:py-2 file:text-sm file:font-black file:uppercase file:tracking-[0.12em] file:text-[#0a0d12]"
                      />
                      <p className="mt-3 text-sm text-dim">{photoStatus}</p>
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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SummaryCard label={copy.applicant} value={form.candidateName || copy.pending} />
                    <SummaryCard label={copy.phone} value={form.phone || copy.pending} />
                    <SummaryCard label={copy.program} value={form.serviceName || copy.pending} />
                    <SummaryCard label={copy.district} value={form.district || copy.pending} />
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-[rgba(41,56,49,0.1)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.76)] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#1f352b] disabled:cursor-not-allowed disabled:opacity-40"
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
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f2b544] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#0a0d12] disabled:cursor-not-allowed disabled:opacity-50"
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
                      onClick={() => void handleSubmit()}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#0a0d12] shadow-[0_16px_40px_rgba(242,181,68,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitState === "submitting" ? copy.submitting : copy.submitApplication}
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
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#516253]">
      {label}
      {children}
    </label>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="section-frame rounded-[1.4rem] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{label}</p>
      <p className="mt-3 text-base font-semibold text-bright">{value}</p>
    </div>
  );
}

const inputClassName =
  "min-w-0 rounded-[1.2rem] border border-[rgba(41,56,49,0.12)] bg-[#fffdf8] px-4 py-3 text-base text-[#1b3b2b] outline-none ring-[#f2b544] placeholder:text-[#7d8b83] focus:ring-2";

const textareaClassName =
  "min-w-0 rounded-[1.2rem] border border-[rgba(41,56,49,0.12)] bg-[#fffdf8] px-4 py-3 text-base text-[#1b3b2b] outline-none ring-[#f2b544] placeholder:text-[#7d8b83] focus:ring-2";
