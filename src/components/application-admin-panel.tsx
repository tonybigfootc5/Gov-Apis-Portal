"use client";

import { useState } from "react";
import { BadgeCheck, CreditCard, FileClock, Phone, RefreshCw, UserRound } from "lucide-react";
import type {
  ApplicationApprovalStatus,
  ApplicationAttemptStatus,
  ApplicationCrossCheckStatus,
  ApplicationPaymentStatus,
  TrainingApplicationRecord,
} from "@/lib/training-application";

type Props = {
  initialApplications: TrainingApplicationRecord[];
};

const attemptOptions: ApplicationAttemptStatus[] = [
  "ATTEMPTED",
  "SUBMITTED",
  "PAYMENT_INITIATED",
  "PAYMENT_FAILED",
  "PAYMENT_COMPLETED",
];

const paymentOptions: ApplicationPaymentStatus[] = ["NOT_STARTED", "PENDING", "PAID", "FAILED"];
const approvalOptions: ApplicationApprovalStatus[] = ["PENDING", "APPROVED", "REJECTED"];
const crossCheckOptions: ApplicationCrossCheckStatus[] = ["PENDING", "VERIFIED"];

export function ApplicationAdminPanel({ initialApplications }: Props) {
  const [applications, setApplications] = useState(initialApplications);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/applications");
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!response.ok) {
        setNotice("Unable to refresh applications right now.");
        return;
      }
      setApplications(await response.json());
    } catch {
      setNotice("Unable to refresh applications right now.");
    } finally {
      setLoading(false);
    }
  }

  async function updateApplication(
    id: string,
    body: {
      attemptStatus: ApplicationAttemptStatus;
      paymentStatus: ApplicationPaymentStatus;
      approvalStatus: ApplicationApprovalStatus;
      crossCheckStatus: ApplicationCrossCheckStatus;
      adminNotes: string;
      paymentReference: string;
    },
  ) {
    setLoading(true);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setNotice(data?.error ?? "Unable to save application changes.");
        return;
      }
      setNotice("Application updated successfully.");
      await load();
    } catch {
      setNotice("Unable to save application changes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#feb96d]">Admissions control</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[#ffd485]">Training service applications</h2>
        </div>
        <button
          disabled={loading}
          onClick={load}
          className="inline-flex items-center gap-2 rounded border border-[#504533] bg-[#241e24] px-4 py-2 text-sm font-bold text-[#ecdfe8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4${loading ? " animate-spin" : ""}`} aria-hidden="true" />
          Refresh applications
        </button>
      </div>

      {notice ? <p className="mt-4 rounded bg-[#f4b315] px-4 py-3 text-sm font-semibold text-[#271900]">{notice}</p> : null}

      <div className="mt-6 grid gap-5">
        {applications.length === 0 ? (
          <div className="glass-panel rounded-xl p-6 text-sm font-semibold text-[#ecdfe8]">
            No training applications have been submitted yet.
          </div>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={`${application.id}-${application.payload.attemptStatus}-${application.payload.paymentStatus}-${application.payload.approvalStatus}-${application.payload.crossCheckStatus}-${application.payload.paymentReference}-${application.payload.adminNotes}`}
              application={application}
              disabled={loading}
              onSave={updateApplication}
            />
          ))
        )}
      </div>
    </section>
  );
}

function ApplicationCard({
  application,
  onSave,
  disabled,
}: {
  application: TrainingApplicationRecord;
  disabled: boolean;
  onSave: (
    id: string,
    body: {
      attemptStatus: ApplicationAttemptStatus;
      paymentStatus: ApplicationPaymentStatus;
      approvalStatus: ApplicationApprovalStatus;
      crossCheckStatus: ApplicationCrossCheckStatus;
      adminNotes: string;
      paymentReference: string;
    },
  ) => void;
}) {
  const [attemptStatus, setAttemptStatus] = useState<ApplicationAttemptStatus>(application.payload.attemptStatus);
  const [paymentStatus, setPaymentStatus] = useState<ApplicationPaymentStatus>(application.payload.paymentStatus);
  const [approvalStatus, setApprovalStatus] = useState<ApplicationApprovalStatus>(application.payload.approvalStatus);
  const [crossCheckStatus, setCrossCheckStatus] = useState<ApplicationCrossCheckStatus>(application.payload.crossCheckStatus);
  const [adminNotes, setAdminNotes] = useState(application.payload.adminNotes);
  const [paymentReference, setPaymentReference] = useState(application.payload.paymentReference);

  return (
    <article className="rounded-2xl border border-[#504533] bg-[#201a20] p-5 shadow-xl">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#feb96d]">{application.payload.serviceName}</p>
              <h3 className="font-display mt-2 text-2xl font-semibold text-[#ffd485]">{application.payload.candidateName}</h3>
              <p className="mt-2 text-sm text-[#d4c4ac]">
                Submitted on {formatDateLabel(application.payload.submittedAt)} by {application.payload.guardianName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill icon={<FileClock className="h-4 w-4" aria-hidden="true" />} label={attemptStatus} />
              <StatusPill icon={<CreditCard className="h-4 w-4" aria-hidden="true" />} label={paymentStatus} />
              <StatusPill icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />} label={crossCheckStatus} />
              <StatusPill icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />} label={approvalStatus} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <InfoCard icon={<UserRound className="h-4 w-4" aria-hidden="true" />} label="Applicant details">
              <p>Name: {application.payload.candidateName}</p>
              <p>Gender: {application.payload.gender}</p>
              <p>DOB: {application.payload.dateOfBirth}</p>
              <p>Education: {application.payload.educationQualification || "Not provided"}</p>
            </InfoCard>
            <InfoCard icon={<Phone className="h-4 w-4" aria-hidden="true" />} label="Contact">
              <p>Mobile: {application.payload.phone}</p>
              <p>Residence: {application.payload.residencePhone || "Not provided"}</p>
              <p>Email: {application.payload.email || "Not provided"}</p>
              <p>Pin code: {application.payload.pinCode}</p>
            </InfoCard>
            <InfoCard icon={<FileClock className="h-4 w-4" aria-hidden="true" />} label="Address">
              <p>{application.payload.addressLine}</p>
              <p>{application.payload.mandal}, {application.payload.district}</p>
              <p>{application.payload.state}</p>
            </InfoCard>
            <InfoCard icon={<CreditCard className="h-4 w-4" aria-hidden="true" />} label="Enrollment readiness">
              <p>Occupation: {application.payload.occupation || "Not provided"}</p>
              <p>Sponsoring organization: {application.payload.sponsoringOrganization || "Not provided"}</p>
              <p>Payment reference: {paymentReference || "Not provided"}</p>
              <p>Approved at: {application.payload.approvedAt ? formatDateLabel(application.payload.approvedAt) : "Pending"}</p>
            </InfoCard>
          </div>

          {application.payload.photoDataUrl ? (
            <div className="rounded-2xl border border-[#504533] bg-[#171217] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">Applicant photo</p>
              <div className="mt-3 relative h-56 w-full overflow-hidden rounded-xl border border-[#504533] bg-[#120c12]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={application.payload.photoDataUrl} alt={`${application.payload.candidateName} photo`} className="h-full w-full object-cover" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#feb96d]">Admin controls</p>
          <div className="mt-4 grid gap-3">
            <SelectField label="Submission attempt" value={attemptStatus} onChange={(value) => setAttemptStatus(value as ApplicationAttemptStatus)} options={attemptOptions} />
            <SelectField label="Payment status" value={paymentStatus} onChange={(value) => setPaymentStatus(value as ApplicationPaymentStatus)} options={paymentOptions} />
            <SelectField label="Cross check status" value={crossCheckStatus} onChange={(value) => setCrossCheckStatus(value as ApplicationCrossCheckStatus)} options={crossCheckOptions} />
            <SelectField label="Approval status" value={approvalStatus} onChange={(value) => setApprovalStatus(value as ApplicationApprovalStatus)} options={approvalOptions} />
            <TextField label="Payment reference" value={paymentReference} onChange={setPaymentReference} placeholder="Transaction ID / receipt no." />
            <TextAreaField label="Admin notes" value={adminNotes} onChange={setAdminNotes} placeholder="Internal note, follow-up detail, payment issue, approval comment..." />
          </div>

          <div className="mt-5 rounded-xl border border-[rgba(255,212,133,0.18)] bg-[rgba(255,212,133,0.06)] p-4 text-sm leading-7 text-[#ecdfe8]">
            <p>Cross-check the application first, then approve only after payment is confirmed and the details are acceptable.</p>
            <p className="mt-2">Once approved, the student can be treated as cleared to join the selected service batch.</p>
          </div>

          <button
            disabled={disabled}
            onClick={() => onSave(application.id, { attemptStatus, paymentStatus, approvalStatus, crossCheckStatus, adminNotes, paymentReference })}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-[#f4b315] px-4 py-3 text-sm font-black text-[#271900] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save application status
          </button>
        </div>
      </div>
    </article>
  );
}

function StatusPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,212,133,0.18)] bg-[rgba(255,212,133,0.08)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#ffe3ac]">
      {icon}
      {label.replaceAll("_", " ")}
    </span>
  );
}

function InfoCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#504533] bg-[#171217] p-4 text-sm leading-7 text-[#ecdfe8]">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">
        {icon}
        {label}
      </div>
      <div className="mt-3 grid gap-1">{children}</div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#d4c4ac]">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2">
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#d4c4ac]">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2" />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#d4c4ac]">
      {label}
      <textarea rows={5} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2" />
    </label>
  );
}

function formatDateLabel(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
