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
  databaseConfigured: boolean;
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

export function ApplicationAdminPanel({ databaseConfigured, initialApplications }: Props) {
  const [applications, setApplications] = useState(initialApplications);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [approvalFilter, setApprovalFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [crossCheckFilter, setCrossCheckFilter] = useState("ALL");

  function applyPreset(preset: "ALL" | "READY" | "APPROVED" | "REJECTED" | "PAYMENT_ISSUE") {
    setQuery("");
    setServiceFilter("ALL");

    if (preset === "ALL") {
      setApprovalFilter("ALL");
      setPaymentFilter("ALL");
      setCrossCheckFilter("ALL");
      return;
    }

    if (preset === "READY") {
      setApprovalFilter("PENDING");
      setPaymentFilter("PAID");
      setCrossCheckFilter("VERIFIED");
      return;
    }

    if (preset === "APPROVED") {
      setApprovalFilter("APPROVED");
      setPaymentFilter("ALL");
      setCrossCheckFilter("ALL");
      return;
    }

    if (preset === "REJECTED") {
      setApprovalFilter("REJECTED");
      setPaymentFilter("ALL");
      setCrossCheckFilter("ALL");
      return;
    }

    setApprovalFilter("ALL");
    setPaymentFilter("FAILED");
    setCrossCheckFilter("ALL");
  }

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
    if (!databaseConfigured) {
      setNotice("Application admin is in read-only mode locally because DATABASE_URL is not configured.");
      return;
    }
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
    if (!databaseConfigured) {
      setNotice("Database is not configured locally, so application status changes cannot be saved from this machine yet.");
      return;
    }
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
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#9c6a18]">Admissions control</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[#173f33]">Training service applications</h2>
        </div>
        <button
          disabled={loading || !databaseConfigured}
          onClick={load}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.12)] bg-[#173f33] px-4 py-2.5 text-sm font-bold text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4${loading ? " animate-spin" : ""}`} aria-hidden="true" />
          Refresh applications
        </button>
      </div>

      {notice ? <p className="mt-4 rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-[#173f33] shadow-[0_12px_28px_rgba(64,44,8,0.05)]">{notice}</p> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Total applications" value={summary.total} tone="amber" />
        <SummaryCard label="Pending cross-check" value={summary.pendingCrossCheck} tone="rose" />
        <SummaryCard label="Payment pending" value={summary.paymentPending} tone="slate" />
        <SummaryCard label="Ready to approve" value={summary.readyToApprove} tone="emerald" />
        <SummaryCard label="Approved" value={summary.approved} tone="gold" />
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_48px_rgba(64,44,8,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">Approval sections</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <PresetButton label="All applications" helper="Full admissions list" onClick={() => applyPreset("ALL")} />
          <PresetButton label="Ready for approval" helper="Verified and paid" onClick={() => applyPreset("READY")} />
          <PresetButton label="Approved students" helper="Allowed to join" onClick={() => applyPreset("APPROVED")} />
          <PresetButton label="Rejected cases" helper="Needs closure" onClick={() => applyPreset("REJECTED")} />
          <PresetButton label="Payment issues" helper="Failed transactions" onClick={() => applyPreset("PAYMENT_ISSUE")} />
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(246,239,228,0.98))] p-4 shadow-[0_18px_48px_rgba(64,44,8,0.08)]">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))]">
          <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#718477]">
            Search applicant
            <div className="flex items-center rounded-2xl border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] px-3">
              <Search className="h-4 w-4 text-[#718477]" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, guardian, phone, or service"
                className="w-full bg-transparent px-3 py-2 text-sm text-[#173f33] outline-none"
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
          <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-6 text-sm font-semibold text-[#516253] shadow-[0_18px_48px_rgba(64,44,8,0.08)]">
            No training service applications match the current filters.
          </div>
        ) : (
          filteredApplications.map((application) => (
            <ApplicationCard
              key={`${application.id}-${application.payload.attemptStatus}-${application.payload.paymentStatus}-${application.payload.approvalStatus}-${application.payload.crossCheckStatus}-${application.payload.paymentReference}-${application.payload.adminNotes}`}
              application={application}
              disabled={loading || !databaseConfigured}
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

  function saveDecision(nextApprovalStatus: ApplicationApprovalStatus) {
    onSave(application.id, {
      attemptStatus,
      paymentStatus,
      approvalStatus: nextApprovalStatus,
      crossCheckStatus,
      adminNotes,
      paymentReference,
    });
  }

  return (
    <article className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(246,239,228,0.98))] p-5 shadow-[0_18px_48px_rgba(64,44,8,0.08)]">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">{application.payload.serviceName}</p>
              <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">{application.payload.candidateName}</h3>
              <p className="mt-2 text-sm text-[#607366]">
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
            <div className="rounded-2xl border border-[rgba(27,59,43,0.1)] bg-[#f3ecdf] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9c6a18]">Applicant photo</p>
              <div className="mt-3 relative h-56 w-full overflow-hidden rounded-xl border border-[rgba(27,59,43,0.1)] bg-[#fffdf8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={application.payload.photoDataUrl} alt={`${application.payload.candidateName} photo`} className="h-full w-full object-cover" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#173f33] p-5 text-[#fff9ec] shadow-[0_18px_44px_rgba(23,63,51,0.16)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f5c65e]">Admin controls</p>
          <div className="mt-4 grid gap-4">
            <ActionGroup
              eyebrow="Verification and payment"
              title="Cross-check applicant details"
              description="Use this block for attempt, payment, cross-check, and transaction reference updates."
            >
              <div className="grid gap-3">
                <SelectField label="Submission attempt" value={attemptStatus} onChange={(value) => setAttemptStatus(value as ApplicationAttemptStatus)} options={attemptOptions} />
                <SelectField label="Payment status" value={paymentStatus} onChange={(value) => setPaymentStatus(value as ApplicationPaymentStatus)} options={paymentOptions} />
                <SelectField label="Cross check status" value={crossCheckStatus} onChange={(value) => setCrossCheckStatus(value as ApplicationCrossCheckStatus)} options={crossCheckOptions} />
                <TextField label="Payment reference" value={paymentReference} onChange={setPaymentReference} placeholder="Transaction ID / receipt no." />
              </div>
            </ActionGroup>

            <ActionGroup
              eyebrow="Decision desk"
              title="Approve or decline application"
              description="This section is only for final admission decisions and internal notes."
            >
              <div className="grid gap-3">
                <SelectField label="Approval status" value={approvalStatus} onChange={(value) => setApprovalStatus(value as ApplicationApprovalStatus)} options={approvalOptions} />
                <TextAreaField label="Admin notes" value={adminNotes} onChange={setAdminNotes} placeholder="Internal note, follow-up detail, payment issue, approval comment..." />
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    disabled={disabled || !readyToApprove}
                    onClick={() => saveDecision("APPROVED")}
                    className="inline-flex items-center justify-center rounded-full bg-[#f5c65e] px-4 py-3 text-sm font-black text-[#173f33] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Approve student
                  </button>
                  <button
                    disabled={disabled}
                    onClick={() => saveDecision("REJECTED")}
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(255,249,236,0.24)] bg-transparent px-4 py-3 text-sm font-black text-[#fff9ec] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Decline application
                  </button>
                </div>
              </div>
            </ActionGroup>
          </div>

          <div className="mt-5 rounded-2xl border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.08)] p-4 text-sm leading-7 text-[#eef2ed]">
            <p>Cross-check the application first, then approve only after payment is confirmed and the details are acceptable.</p>
            <p className="mt-2">Once approved, the student can be treated as cleared to join the selected service batch.</p>
          </div>

          <button
            disabled={disabled}
            onClick={() => onSave(application.id, { attemptStatus, paymentStatus, approvalStatus, crossCheckStatus, adminNotes, paymentReference })}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f5c65e] px-4 py-3 text-sm font-black text-[#173f33] shadow-[0_10px_24px_rgba(0,0,0,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save application status
          </button>
        </div>
      </div>
    </article>
  );
}

function PresetButton({ label, helper, onClick }: { label: string; helper: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-[1.25rem] border border-[rgba(27,59,43,0.1)] bg-[#f7f2e8] px-4 py-4 text-left transition hover:bg-[#efe7d8]"
    >
      <span className="block text-sm font-black uppercase tracking-[0.16em] text-[#173f33]">{label}</span>
      <span className="mt-1 block text-sm text-[#607366]">{helper}</span>
    </button>
  );
}

function ActionGroup({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.06)] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f5c65e]">{eyebrow}</p>
      <h4 className="mt-2 text-lg font-semibold text-[#fff9ec]">{title}</h4>
      <p className="mt-1 text-sm leading-6 text-[#d4e1d8]">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
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
    amber: "bg-[#fff5e2] text-[#8a5612] border-[rgba(138,86,18,0.14)]",
    rose: "bg-[#fff0ea] text-[#99462d] border-[rgba(153,70,45,0.14)]",
    slate: "bg-[#f3ecdf] text-[#4d6154] border-[rgba(27,59,43,0.1)]",
    emerald: "bg-[#eef8f1] text-[#21533f] border-[rgba(33,83,63,0.12)]",
    gold: "bg-[#fff8df] text-[#7a5a00] border-[rgba(122,90,0,0.12)]",
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
    <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.1)] bg-[#f3ecdf] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#173f33]">
      {icon}
      {label.replaceAll("_", " ")}
    </span>
  );
}

function InfoCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-4 text-sm leading-7 text-[#173f33] shadow-[0_10px_24px_rgba(64,44,8,0.05)]">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#9c6a18]">
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
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#d4e1d8]">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-2xl border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.08)] px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#fff9ec] outline-none ring-[#f5c65e] focus:ring-2">
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
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#d4e1d8]">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="rounded-2xl border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.08)] px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#fff9ec] outline-none ring-[#f5c65e] placeholder:text-[#c6d1ca] focus:ring-2" />
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
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#d4e1d8]">
      {label}
      <textarea rows={5} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="rounded-[1.5rem] border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.08)] px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#fff9ec] outline-none ring-[#f5c65e] placeholder:text-[#c6d1ca] focus:ring-2" />
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
