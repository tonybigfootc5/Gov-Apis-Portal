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
  UserRound,
} from "lucide-react";
import { getApplicationPhotoUploadUrlAction } from "@/app/actions/storage";

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
  { id: "person", title: "Person details", subtitle: "Basic identity and family details", icon: UserRound },
  { id: "contact", title: "Contact and address", subtitle: "Where we can reach the applicant", icon: MapPinned },
  { id: "background", title: "Education and work", subtitle: "Simple background details", icon: BriefcaseBusiness },
  { id: "photo", title: "Photo and finish", subtitle: "Upload photo and submit", icon: Camera },
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
    photoName: file.name.replace(/\.[^.]+$/, "") + ".jpg",
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

export function TrainingApplicationForm({ serviceOptions, selectedServiceTitle }: Props) {
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
  const [photoStatus, setPhotoStatus] = useState("Add a clear face photo. We shrink it automatically to make upload easier.");
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
      setPhotoStatus("Add a clear face photo. We shrink it automatically to make upload easier.");
      return;
    }

    setSubmitState("compressing");
    setPhotoUploadState("uploading");
    setMessage("");
    setPhotoStatus(`Preparing ${file.name} for upload...`);
    try {
      const optimized = await optimizePhoto(file);
      setPhotoStatus(`Uploading ${optimized.photoName}...`);
      const { uploadUrl, publicUrl, objectKey } = await getApplicationPhotoUploadUrlAction(
        optimized.photoName,
        optimized.photoType,
      );

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
      setPhotoStatus(`Photo uploaded successfully: ${optimized.photoName}`);
      setPhotoUploadState("uploaded");
      setSubmitState("idle");
    } catch (error) {
      setPhotoUploadState("error");
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Photo upload failed.");
      setPhotoStatus("Photo upload failed. Please choose the image again.");
    }
  }

  async function handleSubmit() {
    if (photoUploadState === "uploading" || submitState === "compressing") {
      setMessage("Please wait for the applicant photo to finish uploading before submitting.");
      setSubmitState("error");
      return;
    }

    if (!requiredStepFields(3, form)) {
      setMessage("Please upload the applicant photo completely before submitting.");
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
      setMessage("Application saved. Redirecting you to PhonePe checkout...");
      window.location.assign(body.redirectUrl);
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Application submission failed.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-[1.75rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] shadow-[0_20px_50px_rgba(64,44,8,0.08)]">
        <div className="border-b border-[rgba(27,59,43,0.08)] bg-[linear-gradient(135deg,#fff4d1_0%,#f3d487_45%,#c98618_100%)] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#7a4a00]">Application for training services</p>
              <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-[#1b3b2b] sm:text-4xl">
                Easy step-by-step form for every applicant
              </h2>
            </div>
            <div className="min-w-[13rem] rounded-[1.25rem] bg-[rgba(255,253,248,0.72)] px-4 py-3 text-sm font-semibold text-[#1b3b2b] shadow-[0_16px_40px_rgba(122,74,0,0.12)] backdrop-blur-sm">
              <p>Application steps</p>
              <p className="mt-1 text-[#7a4a00]">{STEPS.length} guided sections</p>
            </div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-[rgba(27,59,43,0.12)]">
            <div className="h-full rounded-full bg-[#1b3b2b] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              const active = index === step;
              const passed = index < step;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-left text-xs font-black uppercase tracking-[0.14em] transition ${
                    active
                      ? "bg-[#1b3b2b] text-[#faf8f2]"
                      : passed
                        ? "bg-[rgba(27,59,43,0.12)] text-[#1b3b2b]"
                        : "bg-[rgba(255,253,248,0.66)] text-[#516253]"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 px-5 py-6 sm:px-7 sm:py-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b36b00]">{STEPS[step].title}</p>
            <h3 className="font-display mt-2 text-2xl font-semibold text-[#1b3b2b]">{STEPS[step].subtitle}</h3>
          </div>

          {step === 0 ? (
            <div className="grid gap-4">
              {lockedService ? null : (
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  Select service
                  <select value={form.serviceName} onChange={(event) => updateField("serviceName", event.target.value)} className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2">
                    {normalizedServiceOptions.map((service) => (
                      <option key={service.title} value={service.title}>
                        {service.title} - {service.duration} - {service.level}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  Date of application
                  <span className="text-xs font-normal text-[#7a867b]">ఈ రోజు తేది</span>
                  <input type="date" value={form.applicationDate} onChange={(event) => updateField("applicationDate", event.target.value)} className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  Date of birth
                  <span className="text-xs font-normal text-[#7a867b]">పుట్టిన తేది</span>
                  <input type="date" value={form.dateOfBirth} onChange={(event) => updateField("dateOfBirth", event.target.value)} className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                Name of the candidate
                <span className="text-xs font-normal text-[#7a867b]">అభ్యర్థి పేరు</span>
                <input value={form.candidateName} onChange={(event) => updateField("candidateName", event.target.value)} placeholder="Example: Lakshmi Devi" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                Father / Husband / Guardian name
                <span className="text-xs font-normal text-[#7a867b]">తండ్రి / భర్త / సంరక్షకుని పేరు</span>
                <input value={form.guardianName} onChange={(event) => updateField("guardianName", event.target.value)} placeholder="Example: Ramesh" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
              </label>
              <div className="grid gap-2 text-sm font-semibold text-[#516253]">
                Gender
                <span className="text-xs font-normal text-[#7a867b]">లింగం</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { value: "male", label: "Male / పురుషుడు" },
                    { value: "female", label: "Female / మహిళ" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("gender", option.value as "male" | "female")}
                      className={`rounded-[1.4rem] border px-4 py-4 text-left text-base font-bold transition ${
                        form.gender === option.value
                          ? "border-[#b36b00] bg-[#fff0c8] text-[#1b3b2b]"
                          : "border-[rgba(27,59,43,0.14)] bg-[#fffdf8] text-[#516253]"
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
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                Mobile number
                <input value={form.phone} onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9395507766" inputMode="numeric" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  Email
                  <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="name@example.com" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  Residence phone
                  <span className="text-xs font-normal text-[#7a867b]">Optional / ఇంటి ఫోన్</span>
                  <input value={form.residencePhone} onChange={(event) => updateField("residencePhone", event.target.value)} placeholder="If available" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                Address
                <textarea value={form.addressLine} onChange={(event) => updateField("addressLine", event.target.value)} rows={4} placeholder="H. No, street, village" className="min-w-0 rounded-[1.5rem] border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-base text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  Mandal / Block
                  <input value={form.mandal} onChange={(event) => updateField("mandal", event.target.value)} placeholder="Example: Rajendranagar" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  District
                  <input value={form.district} onChange={(event) => updateField("district", event.target.value)} placeholder="Example: Hyderabad" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  State
                  <input value={form.state} onChange={(event) => updateField("state", event.target.value)} className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  Pin code
                  <input value={form.pinCode} onChange={(event) => updateField("pinCode", event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="500030" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
                </label>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  Education qualification
                  <input value={form.educationQualification} onChange={(event) => updateField("educationQualification", event.target.value)} placeholder="Example: 10th class / Degree" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                  Occupation
                  <input value={form.occupation} onChange={(event) => updateField("occupation", event.target.value)} placeholder="Example: Farmer" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-[#516253]">
                Sponsoring organization
                <input value={form.sponsoringOrganization} onChange={(event) => updateField("sponsoringOrganization", event.target.value)} placeholder="Example: Self Help Group / NGO / Department" className="min-w-0 rounded-2xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-3 text-lg text-[#1b3b2b] outline-none ring-[#ebb428] focus:ring-2" />
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-5">
              <label className="grid gap-3 text-sm font-semibold text-[#516253]">
                Upload applicant photo
                <div className="rounded-[1.75rem] border border-dashed border-[rgba(27,59,43,0.18)] bg-[#fffaf0] p-5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => void onPhotoChange(event.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-[#516253] file:mr-4 file:rounded-full file:border-0 file:bg-[#1b3b2b] file:px-4 file:py-2 file:text-sm file:font-black file:uppercase file:tracking-[0.12em] file:text-[#faf8f2]"
                  />
                  <p className="mt-3 text-sm text-[#516253]">{photoStatus}</p>
                  {hasUploadedPhoto ? (
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1b3b2b]">
                      Uploaded and ready to submit
                    </p>
                  ) : null}
                  {photoPreviewUrl ? (
                    <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[rgba(27,59,43,0.12)] bg-white p-3">
                      <div className="relative h-48 w-full overflow-hidden rounded-[1rem]">
                        <Image src={photoPreviewUrl} alt="Applicant preview" fill unoptimized className="object-cover" />
                      </div>
                    </div>
                  ) : null}
                </div>
              </label>

              <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#f6efe4] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b36b00]">Final review</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#fffdf8] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7a867b]">Applicant</p>
                    <p className="mt-2 text-base font-semibold text-[#1b3b2b]">{form.candidateName || "Not filled yet"}</p>
                  </div>
                  <div className="rounded-2xl bg-[#fffdf8] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7a867b]">Phone</p>
                    <p className="mt-2 text-base font-semibold text-[#1b3b2b]">{form.phone || "Not filled yet"}</p>
                  </div>
                  <div className="rounded-2xl bg-[#fffdf8] p-4 sm:col-span-2">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7a867b]">Address</p>
                    <p className="mt-2 text-base font-semibold text-[#1b3b2b]">{form.addressLine || "Not filled yet"}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-[rgba(27,59,43,0.08)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(27,59,43,0.16)] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#1b3b2b] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>
            <div className="flex flex-col gap-3 sm:flex-row">
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  disabled={!canAdvance}
                  onClick={() => setStep((current) => Math.min(STEPS.length - 1, current + 1))}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b3b2b] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#faf8f2] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
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
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ebb428] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#1b3b2b] shadow-[0_18px_40px_rgba(179,107,0,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitState === "submitting" ? "Submitting" : "Submit application"}
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {message ? (
            <p className={submitState === "success" ? "text-sm font-semibold text-[#b36b00]" : "text-sm font-semibold text-[#9d3d21]"}>
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
