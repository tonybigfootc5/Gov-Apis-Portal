"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, ChevronDown, ChevronUp, CreditCard, FileClock, Phone, RefreshCw, Search, ShieldCheck, SlidersHorizontal, UserRound, WalletCards, X } from "lucide-react";
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
  const [approvalFilter, setApprovalFilter] = useState("APPROVED");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [crossCheckFilter, setCrossCheckFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("BATCH");
  const [viewMode, setViewMode] = useState<"batch" | "date">("batch");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(initialApplications[0]?.id ?? "");
  const [profileOpen, setProfileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const serviceOptions = useMemo(
    () => Array.from(new Set(applications.map((application) => application.payload.serviceName))).sort(),
    [applications],
  );
  const latestSubmissionTime = useMemo(
    () => Math.max(...applications.map((application) => new Date(application.payload.submittedAt).getTime()), 0),
    [applications],
  );

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesQuery =
        !normalizedQuery ||
        application.payload.candidateName.toLowerCase().includes(normalizedQuery) ||
        application.payload.serviceName.toLowerCase().includes(normalizedQuery) ||
        application.payload.phone.toLowerCase().includes(normalizedQuery) ||
        application.payload.guardianName.toLowerCase().includes(normalizedQuery) ||
        application.payload.applicationDate.toLowerCase().includes(normalizedQuery) ||
        formatDateLabel(application.payload.submittedAt).toLowerCase().includes(normalizedQuery);

      const matchesService = serviceFilter === "ALL" || application.payload.serviceName === serviceFilter;
      const matchesApproval = approvalFilter === "ALL" || application.payload.approvalStatus === approvalFilter;
      const matchesPayment = paymentFilter === "ALL" || application.payload.paymentStatus === paymentFilter;
      const matchesCrossCheck = crossCheckFilter === "ALL" || application.payload.crossCheckStatus === crossCheckFilter;
      const submittedAtMs = new Date(application.payload.submittedAt).getTime();
      const matchesDate =
        dateFilter === "ALL" ||
        (dateFilter === "LAST_7_DAYS" && latestSubmissionTime - submittedAtMs <= 7 * 24 * 60 * 60 * 1000) ||
        (dateFilter === "LAST_30_DAYS" && latestSubmissionTime - submittedAtMs <= 30 * 24 * 60 * 60 * 1000);
      const submittedDate = application.payload.submittedAt.slice(0, 10);
      const matchesCustomRange =
        (!fromDate || submittedDate >= fromDate) &&
        (!toDate || submittedDate <= toDate);

      return matchesQuery && matchesService && matchesApproval && matchesPayment && matchesCrossCheck && matchesDate && matchesCustomRange;
    }).sort((left, right) => {
      if (sortBy === "OLDEST") {
        return new Date(left.payload.submittedAt).getTime() - new Date(right.payload.submittedAt).getTime();
      }

      if (sortBy === "SERVICE") {
        return left.payload.serviceName.localeCompare(right.payload.serviceName);
      }

      if (sortBy === "NAME") {
        return left.payload.candidateName.localeCompare(right.payload.candidateName);
      }

      if (sortBy === "BATCH") {
        return getPreviewApplicationMeta(left).batchNumber.localeCompare(getPreviewApplicationMeta(right).batchNumber);
      }

      return new Date(right.payload.submittedAt).getTime() - new Date(left.payload.submittedAt).getTime();
    });
  }, [applications, approvalFilter, crossCheckFilter, dateFilter, fromDate, latestSubmissionTime, paymentFilter, query, serviceFilter, sortBy, toDate]);

  const activeSelectedApplicationId =
    selectedApplicationId && applications.some((application) => application.id === selectedApplicationId)
      ? selectedApplicationId
      : applications[0]?.id ?? "";
  const selectedApplication =
    filteredApplications.find((application) => application.id === activeSelectedApplicationId) ?? filteredApplications[0] ?? null;
  const applicationsByBatch = useMemo(() => {
    const grouped = new Map<string, TrainingApplicationRecord[]>();

    for (const application of filteredApplications) {
      const batchNumber = getPreviewApplicationMeta(application).batchNumber;
      const current = grouped.get(batchNumber) ?? [];
      current.push(application);
      grouped.set(batchNumber, current);
    }

    return Array.from(grouped.entries()).sort(([left], [right]) => left.localeCompare(right));
  }, [filteredApplications]);
  const applicationsByDate = useMemo(() => {
    const grouped = new Map<string, TrainingApplicationRecord[]>();

    for (const application of filteredApplications) {
      const dateLabel = formatDateGroup(application.payload.submittedAt);
      const current = grouped.get(dateLabel) ?? [];
      current.push(application);
      grouped.set(dateLabel, current);
    }

    return Array.from(grouped.entries()).sort(
      ([left], [right]) => new Date(right).getTime() - new Date(left).getTime(),
    );
  }, [filteredApplications]);

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
        window.location.href = "/admin";
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

  function openStudentProfile(applicationId: string) {
    setSelectedApplicationId(applicationId);
    setProfileOpen(true);
  }

  function resetFilters() {
    setQuery("");
    setServiceFilter("ALL");
    setApprovalFilter("APPROVED");
    setPaymentFilter("ALL");
    setCrossCheckFilter("ALL");
    setDateFilter("ALL");
    setSortBy("BATCH");
    setViewMode("batch");
    setFromDate("");
    setToDate("");
  }

  function toggleGroup(groupLabel: string) {
    setCollapsedGroups((current) => ({ ...current, [groupLabel]: !current[groupLabel] }));
  }

  function expandAllGroups() {
    setCollapsedGroups({});
  }

  function collapseAllGroups() {
    const groups = viewMode === "batch" ? applicationsByBatch : applicationsByDate;
    setCollapsedGroups(
      groups.reduce<Record<string, boolean>>((acc, [label]) => {
        acc[label] = true;
        return acc;
      }, {}),
    );
  }

  return (
    <section>
      {notice ? <p className="rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-[#173f33] shadow-[0_12px_28px_rgba(64,44,8,0.05)]">{notice}</p> : null}

        <div className={`${notice ? "mt-4" : ""} flex flex-wrap items-center justify-between gap-3 rounded-[1.55rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(135deg,rgba(242,233,216,0.96),rgba(233,243,236,0.92))] px-4 py-3 shadow-[0_16px_34px_rgba(64,44,8,0.08)]`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-4 py-2.5 text-sm font-black text-[#173f33] shadow-[0_10px_24px_rgba(64,44,8,0.06)]"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
              <ChevronDown className={`h-4 w-4 transition ${filtersOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {filtersOpen ? (
              <div className="absolute left-0 top-[calc(100%+0.75rem)] z-20 w-[22rem] rounded-[1.45rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-3 shadow-[0_20px_45px_rgba(64,44,8,0.14)]">
                <div className="flex items-center justify-between gap-3 px-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">Admissions filters</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-full bg-[#f3ecdf] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#173f33]"
                  >
                    Reset
                  </button>
                </div>
                <div className="mt-3 grid gap-3">
                  <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-[#718477]">
                    Search applicant
                    <div className="flex items-center rounded-2xl border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                      <Search className="h-4 w-4 text-[#718477]" aria-hidden="true" />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Name, guardian, phone, or service"
                        className="w-full bg-transparent px-3 py-3 text-sm text-[#173f33] outline-none placeholder:text-[#90a094]"
                      />
                    </div>
                  </label>

                  <div className="grid gap-3">
                    <SelectField theme="light" label="Service filter" value={serviceFilter} onChange={setServiceFilter} options={["ALL", ...serviceOptions]} />
                    <SelectField theme="light" label="Date range" value={dateFilter} onChange={setDateFilter} options={["ALL", "LAST_7_DAYS", "LAST_30_DAYS"]} />
                    <SelectField theme="light" label="Sort list" value={sortBy} onChange={setSortBy} options={["BATCH", "LATEST", "OLDEST", "SERVICE", "NAME"]} />
                    <SelectField theme="light" label="Approval filter" value={approvalFilter} onChange={setApprovalFilter} options={["APPROVED", "ALL", ...approvalOptions.filter((option) => option !== "APPROVED")]} />
                    <SelectField theme="light" label="Payment filter" value={paymentFilter} onChange={setPaymentFilter} options={["ALL", ...paymentOptions]} />
                    <SelectField theme="light" label="Cross-check filter" value={crossCheckFilter} onChange={setCrossCheckFilter} options={["ALL", ...crossCheckOptions]} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <button
          disabled={loading || !databaseConfigured}
          onClick={load}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] shadow-[0_14px_28px_rgba(23,63,51,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4${loading ? " animate-spin" : ""}`} aria-hidden="true" />
          Refresh applications
        </button>
      </div>

      <div className="mt-6">
        <div className="rounded-[1.9rem] border border-[rgba(27,59,43,0.08)] bg-[linear-gradient(180deg,rgba(255,253,248,0.96),rgba(246,239,228,0.92))] p-5 shadow-[0_18px_48px_rgba(64,44,8,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#9c6a18]">Admissions roster</p>
              <div className="flex items-center gap-3 rounded-[1.2rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] px-3 py-2 shadow-[0_8px_18px_rgba(64,44,8,0.05)]">
                <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#607366]">View mode</span>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode((current) => {
                      const next = current === "batch" ? "date" : "batch";
                      setSortBy(next === "batch" ? "BATCH" : "LATEST");
                      return next;
                    });
                  }}
                  className="relative inline-flex h-9 w-[12.5rem] items-center rounded-full bg-[#e7ece6] p-1"
                  aria-label="Toggle roster view mode"
                >
                  <span
                    className={`absolute top-1 h-7 rounded-full bg-[#173f33] shadow-[0_10px_18px_rgba(23,63,51,0.18)] transition-all ${
                      viewMode === "batch" ? "left-1 w-[6rem]" : "left-[6.1rem] w-[5.4rem]"
                    }`}
                  />
                  <span className={`relative z-10 flex w-1/2 items-center justify-center text-[11px] font-black uppercase tracking-[0.16em] ${viewMode === "batch" ? "text-[#fff9ec]" : "text-[#607366]"}`}>
                    Batch Wise
                  </span>
                  <span className={`relative z-10 flex w-1/2 items-center justify-center gap-1 text-[11px] font-black uppercase tracking-[0.16em] ${viewMode === "date" ? "text-[#fff9ec]" : "text-[#607366]"}`}>
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    Date
                  </span>
                </button>
              </div>
              {viewMode === "date" ? (
                <div className="flex flex-wrap items-center gap-2 rounded-[1.2rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] px-3 py-2 shadow-[0_8px_18px_rgba(64,44,8,0.05)]">
                  <CalendarDays className="h-4 w-4 text-[#9c6a18]" aria-hidden="true" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    className="rounded-full border border-[rgba(27,59,43,0.1)] bg-[#faf7ef] px-3 py-2 text-sm font-semibold text-[#173f33] outline-none"
                  />
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-[#718477]">to</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    className="rounded-full border border-[rgba(27,59,43,0.1)] bg-[#faf7ef] px-3 py-2 text-sm font-semibold text-[#173f33] outline-none"
                  />
                </div>
              ) : null}
            </div>
            <div className="rounded-[1.4rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-right shadow-[0_10px_24px_rgba(64,44,8,0.05)]">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">Visible students</p>
              <p className="font-display mt-1 text-4xl font-semibold text-[#173f33]">{filteredApplications.length}</p>
              <p className="text-xs font-semibold text-[#718477]">{viewMode === "batch" ? "Grouped by batch" : "Grouped by date"}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={expandAllGroups}
              className="rounded-full border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#173f33] shadow-[0_8px_18px_rgba(64,44,8,0.05)]"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={collapseAllGroups}
              className="rounded-full border border-[rgba(27,59,43,0.1)] bg-[#f3ecdf] px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#173f33] shadow-[0_8px_18px_rgba(64,44,8,0.05)]"
            >
              Collapse all
            </button>
          </div>

          <div className="mt-6 grid gap-5">
            {applicationsByBatch.length === 0 ? (
              <div className="rounded-[1.4rem] border border-dashed border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-10 text-center text-sm font-semibold text-[#607366]">
                No applications match the current filters.
              </div>
            ) : (
              (viewMode === "batch" ? applicationsByBatch : applicationsByDate).map(([groupLabel, groupApplications]) => {
                const isCollapsed = collapsedGroups[groupLabel] ?? false;

                return (
                <section
                  key={groupLabel}
                  className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.66)] p-4 shadow-[0_12px_30px_rgba(64,44,8,0.05)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[#173f33] text-sm font-black uppercase tracking-[0.12em] text-[#f5c65e] shadow-[0_12px_24px_rgba(23,63,51,0.18)]">
                        {viewMode === "batch" ? groupLabel.split("-").slice(-1)[0] : new Date(groupLabel).getDate()}
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9c6a18]">{viewMode === "batch" ? "Batch dossier" : "Date dossier"}</p>
                        <h4 className="text-xl font-semibold text-[#173f33]">{viewMode === "batch" ? groupLabel : formatDateGroup(groupLabel)}</h4>
                      </div>
                    </div>
                    <div className="rounded-full bg-[#f6efe4] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#607366]">
                      {groupApplications.length} students
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleGroup(groupLabel)}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#173f33] shadow-[0_8px_18px_rgba(64,44,8,0.05)]"
                    >
                      {isCollapsed ? <ChevronDown className="h-4 w-4" aria-hidden="true" /> : <ChevronUp className="h-4 w-4" aria-hidden="true" />}
                      {isCollapsed ? "Expand" : "Collapse"}
                    </button>
                  </div>

                  {!isCollapsed ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                    {groupApplications.map((application) => {
                      const isActive = selectedApplication?.id === application.id;
                      return (
                        <div
                          key={application.id}
                          onClick={() => setSelectedApplicationId(application.id)}
                          className={`group relative overflow-hidden rounded-[1.45rem] border p-4 text-left transition duration-200 ${
                            isActive
                              ? "border-[rgba(23,63,51,0.18)] bg-[#173f33] text-[#fff9ec] shadow-[0_16px_32px_rgba(23,63,51,0.18)]"
                              : "border-[rgba(27,59,43,0.08)] bg-[#fffdf8] text-[#173f33] hover:-translate-y-0.5 hover:bg-[#f8f2e6] hover:shadow-[0_16px_32px_rgba(64,44,8,0.08)]"
                          }`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedApplicationId(application.id);
                            }
                          }}
                        >
                          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(245,198,94,0.85),transparent)] opacity-70" />
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${isActive ? "text-[#f5c65e]" : "text-[#9c6a18]"}`}>
                                {application.payload.serviceName}
                              </p>
                              <h5 className="mt-2 text-lg font-semibold">{application.payload.candidateName}</h5>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                              application.payload.approvalStatus === "APPROVED"
                                ? isActive
                                  ? "bg-[rgba(255,255,255,0.14)] text-[#e4f6ea]"
                                  : "bg-[#eef8f1] text-[#21533f]"
                                : isActive
                                  ? "bg-[rgba(255,255,255,0.14)] text-[#fff2d7]"
                                  : "bg-[#fff5ea] text-[#8c4d1e]"
                            }`}>
                              {application.payload.approvalStatus}
                            </span>
                          </div>
                          <div className={`mt-4 grid gap-2 text-sm ${isActive ? "text-[#dde4dc]" : "text-[#607366]"}`}>
                            <p>Phone: {application.payload.phone}</p>
                            <p>Submitted: {formatDateLabel(application.payload.submittedAt)}</p>
                            <p>Guardian: {application.payload.guardianName}</p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                openStudentProfile(application.id);
                              }}
                              className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                                isActive
                                  ? "bg-[rgba(255,255,255,0.14)] text-[#fff9ec] hover:bg-[rgba(255,255,255,0.2)]"
                                  : "bg-[#173f33] text-[#fff9ec] hover:bg-[#204d3f]"
                              }`}
                            >
                              View
                            </button>
                            <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${isActive ? "bg-[rgba(255,255,255,0.14)] text-[#fff9ec]" : "bg-[#f3ecdf] text-[#173f33]"}`}>
                              {getPreviewApplicationMeta(application).batchNumber}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  ) : null}
                </section>
              )})
            )}
          </div>
        </div>
      </div>

      {profileOpen && selectedApplication ? (
        <ApplicationProfileOverlay
          application={selectedApplication}
          disabled={loading || !databaseConfigured}
          onClose={() => setProfileOpen(false)}
          onSave={updateApplication}
        />
      ) : null}
    </section>
  );
}

function ApplicationProfileOverlay({
  application,
  disabled,
  onSave,
  onClose,
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
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[rgba(16,33,27,0.42)] p-3 sm:p-6" onClick={onClose}>
      <div
        className="mx-auto flex h-full w-full max-w-[110rem] flex-col overflow-hidden rounded-[2.2rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(180deg,rgba(255,253,248,0.985),rgba(245,238,226,0.985))] shadow-[0_32px_90px_rgba(16,33,27,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[rgba(27,59,43,0.08)] px-5 py-4 sm:px-7">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#9c6a18]">Student dossier</p>
            <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">{application.payload.candidateName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] text-[#173f33] shadow-[0_10px_24px_rgba(64,44,8,0.06)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
          <ApplicationCard application={application} disabled={disabled} onSave={onSave} />
        </div>
      </div>
    </div>
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
  const [paymentStatus] = useState<ApplicationPaymentStatus>(application.payload.paymentStatus);
  const [approvalStatus, setApprovalStatus] = useState<ApplicationApprovalStatus>(application.payload.approvalStatus);
  const [crossCheckStatus, setCrossCheckStatus] = useState<ApplicationCrossCheckStatus>(application.payload.crossCheckStatus);
  const [adminNotes, setAdminNotes] = useState(application.payload.adminNotes);
  const [paymentReference] = useState(application.payload.paymentReference);
  const readyToApprove = crossCheckStatus === "VERIFIED" && paymentStatus === "PAID" && approvalStatus === "PENDING";
  const joinReady = crossCheckStatus === "VERIFIED" && paymentStatus === "PAID" && approvalStatus === "APPROVED";
  const photoSrc = application.payload.photoUrl || application.payload.photoDataUrl;
  const previewMeta = getPreviewApplicationMeta(application);
  const studentDetailRows = [
    { label: "Student name", value: application.payload.candidateName },
    { label: "Batch number", value: previewMeta.batchNumber },
    { label: "Phone number", value: application.payload.phone || "Not provided" },
    { label: "Payment sent date", value: previewMeta.paymentSentDate },
    {
      label: "Payment approved date",
      value: previewMeta.paymentApprovedDate,
    },
    { label: "Passed out date", value: previewMeta.passedOutDate },
    {
      label: "Address",
      value: `${application.payload.addressLine}, ${application.payload.mandal}, ${application.payload.district}, ${application.payload.state}, ${application.payload.pinCode}`,
    },
    { label: "Photo", value: photoSrc ? "Uploaded" : "Not uploaded" },
    {
      label: "Files sent from student",
      value: previewMeta.studentFiles,
    },
  ];
  const blockers = [
    crossCheckStatus !== "VERIFIED" ? "Cross-check still pending" : null,
    paymentStatus !== "PAID" ? "Payment not confirmed" : null,
    approvalStatus === "REJECTED" ? "Application already rejected" : null,
  ].filter(Boolean) as string[];

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

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {studentDetailRows.map((detail) => (
            <InfoCard key={detail.label} icon={<UserRound className="h-4 w-4" aria-hidden="true" />} label={detail.label}>
              <p>{detail.value}</p>
            </InfoCard>
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <InfoCard icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />} label="Review status">
            <p>Attempt status: {attemptStatus.replaceAll("_", " ")}</p>
            <p>Payment status: {paymentStatus.replaceAll("_", " ")}</p>
            <p>Cross-check status: {crossCheckStatus.replaceAll("_", " ")}</p>
            <p>Approval status: {approvalStatus.replaceAll("_", " ")}</p>
            <p>Join readiness: {joinReady ? "Ready to join" : readyToApprove ? "Ready for approval" : "Not ready yet"}</p>
          </InfoCard>
          <InfoCard icon={<WalletCards className="h-4 w-4" aria-hidden="true" />} label="Stored billing data">
            <p>Payment reference: {paymentReference || "Not provided"}</p>
            <p>Approved at: {application.payload.approvedAt ? formatDateLabel(application.payload.approvedAt) : "Pending"}</p>
            <p>Incoming billing proof is handled from the main site submission flow.</p>
          </InfoCard>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <InfoCard icon={<UserRound className="h-4 w-4" aria-hidden="true" />} label="Applicant identity">
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
          <InfoCard icon={<CreditCard className="h-4 w-4" aria-hidden="true" />} label="Background details">
            <p>Occupation: {application.payload.occupation || "Not provided"}</p>
            <p>Sponsoring organization: {application.payload.sponsoringOrganization || "Not provided"}</p>
            <p>Application date: {application.payload.applicationDate}</p>
            <p>Submitted at: {formatDateLabel(application.payload.submittedAt)}</p>
          </InfoCard>
        </div>

        {photoSrc ? (
          <div className="rounded-2xl border border-[rgba(27,59,43,0.1)] bg-[#f3ecdf] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9c6a18]">Stored submission media</p>
              <span className="rounded-full bg-[#fff8ea] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#8a5612]">
                Applicant photo
              </span>
            </div>
            <div className="mt-3 relative h-56 w-full overflow-hidden rounded-xl border border-[rgba(27,59,43,0.1)] bg-[#fffdf8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoSrc}
                alt={`${application.payload.candidateName} photo`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-2">
          <InfoCard icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />} label="Current priority">
            <p>{joinReady ? "Learner cleared to join" : readyToApprove ? "Ready for final approval" : "Needs review before approval"}</p>
            {blockers.length ? (
              blockers.map((blocker) => <p key={blocker}>- {blocker}</p>)
            ) : (
              <p>This application has passed the required review gates.</p>
            )}
          </InfoCard>

          <InfoCard icon={<WalletCards className="h-4 w-4" aria-hidden="true" />} label="Cross-check guidance">
            <p>Cross-check the application first, then approve only after payment is confirmed and the details are acceptable.</p>
            <p>Once approved, the student can be treated as cleared to join the selected service batch.</p>
          </InfoCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-[rgba(27,59,43,0.1)] bg-[#173f33] p-4 text-[#fff9ec] shadow-[0_18px_44px_rgba(23,63,51,0.16)]">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f5c65e]">Verification and payment</p>
            <div className="mt-4 grid gap-3">
              <SelectField theme="dark" label="Submission attempt" value={attemptStatus} onChange={(value) => setAttemptStatus(value as ApplicationAttemptStatus)} options={attemptOptions} />
              <SelectField theme="dark" label="Cross check status" value={crossCheckStatus} onChange={(value) => setCrossCheckStatus(value as ApplicationCrossCheckStatus)} options={crossCheckOptions} />
              <div className="rounded-[1.5rem] border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.08)] px-4 py-3 text-sm leading-7 text-[#fff9ec]">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#d4e1d8]">Gateway payment</p>
                <p className="mt-2">Status: {paymentStatus.replaceAll("_", " ")}</p>
                <p>Reference: {paymentReference || "Waiting for PhonePe confirmation"}</p>
                <p className="text-[#d4e1d8]">Payment truth now comes from the PhonePe order history in the Payments section.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(27,59,43,0.1)] bg-[#173f33] p-4 text-[#fff9ec] shadow-[0_18px_44px_rgba(23,63,51,0.16)]">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f5c65e]">Approval controls</p>
            <div className="mt-4 grid gap-3">
              <SelectField theme="dark" label="Approval status" value={approvalStatus} onChange={(value) => setApprovalStatus(value as ApplicationApprovalStatus)} options={approvalOptions} />
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
              <button
                disabled={disabled}
                onClick={() => onSave(application.id, { attemptStatus, paymentStatus, approvalStatus, crossCheckStatus, adminNotes, paymentReference })}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f5c65e] px-4 py-3 text-sm font-black text-[#173f33] shadow-[0_10px_24px_rgba(0,0,0,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save application status
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
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
  theme = "dark",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  theme?: "dark" | "light";
}) {
  const palette =
    theme === "light"
      ? {
          label: "text-[#718477]",
          control:
            "border-[rgba(27,59,43,0.12)] bg-[#fffdf8] text-[#173f33]",
          option: "text-[#173f33]",
        }
      : {
          label: "text-[#d4e1d8]",
          control:
            "border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.08)] text-[#fff9ec]",
          option: "text-[#173f33]",
        };

  return (
    <label className={`grid gap-1 text-xs font-black uppercase tracking-[0.12em] ${palette.label}`}>
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`rounded-2xl border px-3 py-2.5 text-sm font-medium normal-case tracking-normal outline-none ring-[#f5c65e] focus:ring-2 ${palette.control}`}
      >
        {options.map((option) => (
          <option key={option} value={option} className={palette.option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
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

function formatDateGroup(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPreviewApplicationMeta(application: TrainingApplicationRecord) {
  const match = /app-preview-(\d+)/.exec(application.id);
  const index = match ? Number(match[1]) - 1 : -1;

  if (index >= 0) {
    const batchNumber = index < 10 ? "BK-26-07" : index < 20 ? "QR-26-08" : "BK-26-09";
    const paymentSentDate =
      application.payload.paymentStatus === "NOT_STARTED"
        ? "Not sent yet"
        : formatDateLabel(application.payload.submittedAt);
    const paymentApprovedDate =
      application.payload.paymentStatus === "PAID" && application.payload.approvedAt
        ? formatDateLabel(application.payload.approvedAt)
        : "Pending approval";
    const passedOutDate = application.payload.approvalStatus === "APPROVED" ? "Batch completed" : "Batch not completed yet";

    return {
      batchNumber,
      paymentSentDate,
      paymentApprovedDate,
      passedOutDate,
      studentFiles: application.payload.photoName
        ? `${application.payload.photoName}, billing-proof-${batchNumber.toLowerCase().replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}.jpg`
        : "No extra student files are stored yet",
    };
  }

  return {
    batchNumber: "Not assigned yet",
    paymentSentDate: "Not captured yet",
    paymentApprovedDate: application.payload.approvedAt ? formatDateLabel(application.payload.approvedAt) : "Not approved yet",
    passedOutDate: "Not captured yet",
    studentFiles: application.payload.photoName ? `${application.payload.photoName} (${application.payload.photoType || "file"})` : "No extra student files are stored yet",
  };
}
