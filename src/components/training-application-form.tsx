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
  const [photoStatus, setPhotoStatus] = useState("Upload one clear face photo. We compress it automatically before sending.");
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
      setPhotoStatus("Upload one clear face photo. We compress it automatically before sending.");
      return;
    }

    setSubmitState("compressing");
    setPhotoUploadState("uploading");
    setMessage("");
    setPhotoStatus(`Preparing ${file.name}...`);

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
      setPhotoStatus("Photo uploaded and ready.");
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
      setMessage("Wait for the photo upload to finish before submitting.");
      setSubmitState("error");
      return;
    }

    if (!requiredStepFields(3, form)) {
      setMessage("Upload the applicant photo before submitting.");
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
      setMessage("Application saved. Redirecting to secure payment...");
      window.location.assign(body.redirectUrl);
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Application submission failed.");
    }
  }

  const currentStep = STEPS[step];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="neo-shell rounded-[2rem] p-5 sm:p-7 lg:p-8">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,16rem)_1fr]">
          <aside className="section-frame rounded-[1.7rem] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8ec5ff]">Enrollment flow</p>
            <h2 className="font-display mt-4 text-3xl text-bright">Apply in four clean steps.</h2>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/8">
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
                          ? "border-white/10 bg-white/6"
                          : "border-white/8 bg-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-[#f2b544] text-[#0a0d12]" : "bg-white/8 text-[#f4efe4]"}`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-bright">{item.title}</p>
                        <p className="text-xs text-dim">{item.subtitle}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 rounded-[1.3rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-dim">
              Review the program, fill the details, upload the photo, and finish payment in one flow.
            </div>
          </aside>

          <section className="section-frame rounded-[1.7rem] p-5 sm:p-6">
            <div className="border-b border-white/10 pb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">{currentStep.title}</p>
                  <h3 className="font-display mt-3 text-3xl text-bright sm:text-4xl">{currentStep.subtitle}</h3>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-dim">
                  <p className="font-semibold text-bright">{form.serviceName}</p>
                  <p className="mt-1">Selected training</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              {step === 0 ? (
                <div className="grid gap-5">
                  {lockedService ? null : (
                    <label className="grid gap-2 text-sm font-semibold text-[#d9dfeb]">
                      Select training
                      <select
                        value={form.serviceName}
                        onChange={(event) => updateField("serviceName", event.target.value)}
                        className="min-w-0 rounded-[1.2rem] border border-white/10 bg-[#0f141d] px-4 py-3 text-base text-bright outline-none ring-[#f2b544] focus:ring-2"
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
                    <Field label="Application date">
                      <input
                        type="date"
                        value={form.applicationDate}
                        onChange={(event) => updateField("applicationDate", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Date of birth">
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(event) => updateField("dateOfBirth", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <Field label="Applicant name">
                    <input
                      value={form.candidateName}
                      onChange={(event) => updateField("candidateName", event.target.value)}
                      placeholder="Full name as per records"
                      className={inputClassName}
                    />
                  </Field>

                  <Field label="Guardian name">
                    <input
                      value={form.guardianName}
                      onChange={(event) => updateField("guardianName", event.target.value)}
                      placeholder="Parent / spouse / guardian"
                      className={inputClassName}
                    />
                  </Field>

                  <div className="grid gap-2 text-sm font-semibold text-[#d9dfeb]">
                    Gender
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateField("gender", option.value as "male" | "female")}
                          className={`rounded-[1.2rem] border px-4 py-4 text-left text-base font-semibold transition ${
                            form.gender === option.value
                              ? "border-[#f2b544]/40 bg-[#f2b544]/12 text-bright"
                              : "border-white/10 bg-[#0f141d] text-dim"
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
                    <Field label="Mobile number">
                      <input
                        value={form.phone}
                        onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit number"
                        inputMode="numeric"
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Email address">
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        placeholder="Optional"
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <Field label="Residence phone">
                    <input
                      value={form.residencePhone}
                      onChange={(event) => updateField("residencePhone", event.target.value)}
                      placeholder="Optional"
                      className={inputClassName}
                    />
                  </Field>

                  <Field label="Address">
                    <textarea
                      value={form.addressLine}
                      onChange={(event) => updateField("addressLine", event.target.value)}
                      rows={4}
                      placeholder="House, street, village or locality"
                      className={textareaClassName}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Mandal / block">
                      <input
                        value={form.mandal}
                        onChange={(event) => updateField("mandal", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="District">
                      <input
                        value={form.district}
                        onChange={(event) => updateField("district", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="State">
                      <input
                        value={form.state}
                        onChange={(event) => updateField("state", event.target.value)}
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Pin code">
                      <input
                        value={form.pinCode}
                        onChange={(event) => updateField("pinCode", event.target.value.replace(/\D/g, "").slice(0, 6))}
                        inputMode="numeric"
                        placeholder="6 digits"
                        className={inputClassName}
                      />
                    </Field>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Education qualification">
                      <input
                        value={form.educationQualification}
                        onChange={(event) => updateField("educationQualification", event.target.value)}
                        placeholder="Optional"
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Occupation">
                      <input
                        value={form.occupation}
                        onChange={(event) => updateField("occupation", event.target.value)}
                        placeholder="Optional"
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <Field label="Sponsoring organization">
                    <input
                      value={form.sponsoringOrganization}
                      onChange={(event) => updateField("sponsoringOrganization", event.target.value)}
                      placeholder="Optional"
                      className={inputClassName}
                    />
                  </Field>

                  <div className="section-frame rounded-[1.4rem] p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8ec5ff]/12 text-[#8ec5ff]">
                        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="text-sm leading-7 text-dim">
                        <p className="font-semibold text-bright">Keep it exact.</p>
                        <p>These details are used to identify the applicant during payment review and admission follow-up.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid gap-5">
                  <Field label="Applicant photo">
                    <div className="rounded-[1.5rem] border border-dashed border-white/16 bg-[#0f141d] p-5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => void onPhotoChange(event.target.files?.[0] ?? null)}
                        className="block w-full text-sm text-dim file:mr-4 file:rounded-full file:border-0 file:bg-[#f2b544] file:px-4 file:py-2 file:text-sm file:font-black file:uppercase file:tracking-[0.12em] file:text-[#0a0d12]"
                      />
                      <p className="mt-3 text-sm text-dim">{photoStatus}</p>
                      {hasUploadedPhoto ? (
                        <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#b5f8cf]">
                          Uploaded and ready
                        </p>
                      ) : null}
                      {photoPreviewUrl ? (
                        <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/20 p-3">
                          <div className="relative h-56 w-full overflow-hidden rounded-[1rem]">
                            <Image src={photoPreviewUrl} alt="Applicant preview" fill unoptimized className="object-cover" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SummaryCard label="Applicant" value={form.candidateName || "Pending"} />
                    <SummaryCard label="Phone" value={form.phone || "Pending"} />
                    <SummaryCard label="Program" value={form.serviceName || "Pending"} />
                    <SummaryCard label="District" value={form.district || "Pending"} />
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/4 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-bright disabled:cursor-not-allowed disabled:opacity-40"
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
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f2b544] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#0a0d12] disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#0a0d12] shadow-[0_16px_40px_rgba(242,181,68,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitState === "submitting" ? "Submitting" : "Submit application"}
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {message ? (
                <p className={submitState === "success" ? "text-sm font-semibold text-[#b5f8cf]" : "text-sm font-semibold text-[#ffc3b8]"}>
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
    <label className="grid gap-2 text-sm font-semibold text-[#d9dfeb]">
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
  "min-w-0 rounded-[1.2rem] border border-white/10 bg-[#0f141d] px-4 py-3 text-base text-bright outline-none ring-[#f2b544] placeholder:text-[#62708a] focus:ring-2";

const textareaClassName =
  "min-w-0 rounded-[1.2rem] border border-white/10 bg-[#0f141d] px-4 py-3 text-base text-bright outline-none ring-[#f2b544] placeholder:text-[#62708a] focus:ring-2";
