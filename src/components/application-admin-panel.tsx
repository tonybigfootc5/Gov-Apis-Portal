"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CreditCard, FileClock, Phone, RefreshCw, Search, UserRound } from "lucide-react";
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
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [approvalFilter, setApprovalFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [crossCheckFilter, setCrossCheckFilter] = useState("ALL");

  const serviceOptions = useMemo(
    () => Array.from(new Set(applications.map((application) => application.payload.serviceName))).sort(),
    [applications],
  );

  const summary = useMemo(() => {
    const readyToApprove = applications.filter(
      (application) =>
        application.payload.crossCheckStatus === "VERIFIED" &&
        application.payload.paymentStatus === "PAID" &&
        application.payload.approvalStatus === "PENDING",
    ).length;

    return {
      total: applications.length,
      pendingCrossCheck: applications.filter((application) => application.payload.crossCheckStatus === "PENDING").length,
      paymentPending: applications.filter((application) => application.payload.paymentStatus === "PENDING" || application.payload.paymentStatus === "NOT_STARTED").length,
      readyToApprove,
      approved: applications.filter((application) => application.payload.approvalStatus === "APPROVED").length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesQuery =
        !normalizedQuery ||
        application.payload.candidateName.toLowerCase().includes(normalizedQuery) ||
        application.payload.serviceName.toLowerCase().includes(normalizedQuery) ||
        application.payload.phone.toLowerCase().includes(normalizedQuery) ||
        application.payload.guardianName.toLowerCase().includes(normalizedQuery);

      const matchesService = serviceFilter === "ALL" || application.payload.serviceName === serviceFilter;
      const matchesApproval = approvalFilter === "ALL" || application.payload.approvalStatus === approvalFilter;
      const matchesPayment = paymentFilter === "ALL" || application.payload.paymentStatus === paymentFilter;
      const matchesCrossCheck = crossCheckFilter === "ALL" || application.payload.crossCheckStatus === crossCheckFilter;

      return matchesQuery && matchesService && matchesApproval && matchesPayment && matchesCrossCheck;
    });
  }, [applications, approvalFilter, crossCheckFilter, paymentFilter, query, serviceFilter]);

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

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Total applications" value={summary.total} tone="amber" />
        <SummaryCard label="Pending cross-check" value={summary.pendingCrossCheck} tone="rose" />
        <SummaryCard label="Payment pending" value={summary.paymentPending} tone="slate" />
        <SummaryCard label="Ready to approve" value={summary.readyToApprove} tone="emerald" />
        <SummaryCard label="Approved" value={summary.approved} tone="gold" />
      </div>

      <div className="mt-6 rounded-2xl border border-[#504533] bg-[#201a20] p-4 shadow-xl">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))]">
          <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#d4c4ac]">
            Search applicant
            <div className="flex items-center rounded border border-[#504533] bg-[#120c12] px-3">
              <Search className="h-4 w-4 text-[#d4c4ac]" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, guardian, phone, or service"
                className="w-full bg-transparent px-3 py-2 text-sm text-[#ecdfe8] outline-none"
              />
            </div>
          </label>
          <SelectField label="Service filter" value={serviceFilter} onChange={setServiceFilter} options={["ALL", ...serviceOptions]} />
          <SelectField label="Approval filter" value={approvalFilter} onChange={setApprovalFilter} options={["ALL", ...approvalOptions]} />
          <SelectField label="Payment filter" value={paymentFilter} onChange={setPaymentFilter} options={["ALL", ...paymentOptions]} />
          <SelectField label="Cross-check filter" value={crossCheckFilter} onChange={setCrossCheckFilter} options={["ALL", ...crossCheckOptions]} />
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        {filteredApplications.length === 0 ? (
          <div className="glass-panel rounded-xl p-6 text-sm font-semibold text-[#ecdfe8]">
            No training service applications match the current filters.
          </div>
        ) : (
          filteredApplications.map((application) => (
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
  const readyToApprove = crossCheckStatus === "VERIFIED" && paymentStatus === "PAID" && approvalStatus === "PENDING";
  const joinReady = crossCheckStatus === "VERIFIED" && paymentStatus === "PAID" && approvalStatus === "APPROVED";

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
              <p>Join readiness: {joinReady ? "Ready to join" : readyToApprove ? "Ready for approval" : "Not ready yet"}</p>
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
          <button
            disabled={disabled || !readyToApprove}
            onClick={() =>
              onSave(application.id, {
                attemptStatus,
                paymentStatus,
                approvalStatus: "APPROVED",
                crossCheckStatus,
                adminNotes,
                paymentReference,
              })
            }
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded border border-[rgba(255,212,133,0.28)] px-4 py-3 text-sm font-black text-[#ffe3ac] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Quick approve if ready
          </button>
        </div>
      </div>
    </article>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "amber" | "rose" | "slate" | "emerald" | "gold";
}) {
  const toneClass = {
    amber: "bg-[rgba(244,179,21,0.08)] text-[#ffd485] border-[rgba(244,179,21,0.16)]",
    rose: "bg-[rgba(255,180,171,0.08)] text-[#ffd1c7] border-[rgba(255,180,171,0.16)]",
    slate: "bg-[rgba(212,196,172,0.08)] text-[#ecdfe8] border-[rgba(212,196,172,0.16)]",
    emerald: "bg-[rgba(116,245,180,0.08)] text-[#c9ffe1] border-[rgba(116,245,180,0.16)]",
    gold: "bg-[rgba(255,227,172,0.08)] text-[#fff0c8] border-[rgba(255,227,172,0.16)]",
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 shadow-xl ${toneClass}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.18em]">{label}</p>
      <p className="font-display mt-3 text-4xl font-semibold">{value}</p>
    </div>
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
