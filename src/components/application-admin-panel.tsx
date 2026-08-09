"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, ChevronDown, ChevronUp, FileClock, Printer, RefreshCw, Search, SlidersHorizontal, UserRound, X } from "lucide-react";
import type {
  ApplicationApprovalStatus,
  ApplicationAttemptStatus,
  ApplicationCrossCheckStatus,
  ApplicationPaymentStatus,
  TrainingApplicationRecord,
} from "@/lib/training-application";
import { formatStudentCode, isSuccessfulPaymentApplication } from "@/lib/training-application";
import { deprecatedTrainingProgramSlugs, trainingProgramCatalog } from "@/lib/training-programs";

type Props = {
  storageMode: "database" | "local";
  initialApplications: TrainingApplicationRecord[];
  onApplicationsChange?: (applications: TrainingApplicationRecord[]) => void;
};

const paymentOptions: ApplicationPaymentStatus[] = ["NOT_STARTED", "PENDING", "PAID", "FAILED"];

export function ApplicationProgramCapacityRail({ applications }: { applications: TrainingApplicationRecord[] }) {
  const enrolledApplications = useMemo(
    () => applications.filter((application) => isSuccessfulPaymentApplication(application)),
    [applications],
  );
  const programRosterCards = useMemo(() => buildProgramRosterCards(enrolledApplications), [enrolledApplications]);

  return (
    <section className="grid gap-4 rounded-[1.45rem] border border-[#e7eee8] bg-white px-5 py-5 shadow-[0_18px_45px_rgba(18,28,39,0.04)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9a6a20]">Program capacity</p>
          <h2 className="mt-1 text-xl font-black text-[#173f33]">Enrollment by program</h2>
        </div>
        <span className="hidden rounded-full bg-[#fbfdfb] px-3 py-1.5 text-xs font-black text-[#607366] sm:inline-flex">
          {programRosterCards.length} cards
        </span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 pr-2 [scrollbar-width:thin]">
        {programRosterCards.map((card) => (
          <ProgramRosterCard key={card.key} card={card} />
        ))}
      </div>
    </section>
  );
}

export function ApplicationAdminPanel({ storageMode, initialApplications, onApplicationsChange }: Props) {
  const [applications, setApplications] = useState(initialApplications);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("BATCH");
  const [viewMode, setViewMode] = useState<"student" | "batch" | "date">("student");
  const [selectedBatchCode, setSelectedBatchCode] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(initialApplications[0]?.id ?? "");
  const [profileOpen, setProfileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const canMutate = storageMode === "database" || storageMode === "local";
  const isLocalMode = storageMode === "local";

  function setApplicationRecords(nextApplications: TrainingApplicationRecord[]) {
    setApplications(nextApplications);
    onApplicationsChange?.(nextApplications);
  }

  const serviceOptions = useMemo(
    () => Array.from(new Set(applications.map((application) => application.payload.serviceName))).sort(),
    [applications],
  );
  const latestSubmissionTime = useMemo(
    () => Math.max(...applications.map((application) => new Date(application.payload.submittedAt).getTime()), 0),
    [applications],
  );
  const enrolledApplications = useMemo(
    () => applications.filter((application) => isSuccessfulPaymentApplication(application)),
    [applications],
  );

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return enrolledApplications.filter((application) => {
      const meta = getPreviewApplicationMeta(application);
      const matchesQuery =
        !normalizedQuery ||
        application.id.toLowerCase().includes(normalizedQuery) ||
        (meta.applicationCode?.toLowerCase().includes(normalizedQuery) ?? false) ||
        (meta.studentCode?.toLowerCase().includes(normalizedQuery) ?? false) ||
        meta.batchNumber.toLowerCase().includes(normalizedQuery) ||
        application.payload.candidateName.toLowerCase().includes(normalizedQuery) ||
        application.payload.serviceName.toLowerCase().includes(normalizedQuery) ||
        application.payload.phone.toLowerCase().includes(normalizedQuery) ||
        application.payload.guardianName.toLowerCase().includes(normalizedQuery) ||
        application.payload.aadhaarNo.toLowerCase().includes(normalizedQuery) ||
        (application.latestPayment?.invoiceNumber.toLowerCase().includes(normalizedQuery) ?? false) ||
        (application.latestPayment?.merchantOrderId.toLowerCase().includes(normalizedQuery) ?? false) ||
        (application.latestPayment?.paymentReference?.toLowerCase().includes(normalizedQuery) ?? false) ||
        application.payload.applicationDate.toLowerCase().includes(normalizedQuery) ||
        formatDateLabel(application.payload.submittedAt).toLowerCase().includes(normalizedQuery);

      const matchesService = serviceFilter === "ALL" || application.payload.serviceName === serviceFilter;
      const matchesPayment = paymentFilter === "ALL" || application.payload.paymentStatus === paymentFilter;
      const submittedAtMs = new Date(application.payload.submittedAt).getTime();
      const matchesDate =
        dateFilter === "ALL" ||
        (dateFilter === "LAST_7_DAYS" && latestSubmissionTime - submittedAtMs <= 7 * 24 * 60 * 60 * 1000) ||
        (dateFilter === "LAST_30_DAYS" && latestSubmissionTime - submittedAtMs <= 30 * 24 * 60 * 60 * 1000);
      const submittedDate = application.payload.submittedAt.slice(0, 10);
      const matchesCustomRange =
        (!fromDate || submittedDate >= fromDate) &&
        (!toDate || submittedDate <= toDate);

      return matchesQuery && matchesService && matchesPayment && matchesDate && matchesCustomRange;
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
        const leftMeta = getPreviewApplicationMeta(left);
        const rightMeta = getPreviewApplicationMeta(right);
        return (leftMeta.studentCode ?? leftMeta.batchNumber).localeCompare(rightMeta.studentCode ?? rightMeta.batchNumber);
      }

      return new Date(right.payload.submittedAt).getTime() - new Date(left.payload.submittedAt).getTime();
    });
  }, [dateFilter, enrolledApplications, fromDate, latestSubmissionTime, paymentFilter, query, serviceFilter, sortBy, toDate]);

  const activeSelectedApplicationId =
    selectedApplicationId && applications.some((application) => application.id === selectedApplicationId)
      ? selectedApplicationId
      : applications[0]?.id ?? "";
  const selectedApplication =
    filteredApplications.find((application) => application.id === activeSelectedApplicationId) ?? filteredApplications[0] ?? null;
  const studentApplications = useMemo(
    () => [...filteredApplications].sort((left, right) => getApplicationTimelineTime(right) - getApplicationTimelineTime(left)),
    [filteredApplications],
  );
  const applicationsByBatch = useMemo(() => {
    const grouped = new Map<string, TrainingApplicationRecord[]>();

    for (const application of filteredApplications) {
      const batchNumber = getPreviewApplicationMeta(application).batchNumber;
      const current = grouped.get(batchNumber) ?? [];
      current.push(application);
      grouped.set(batchNumber, current);
    }

    return Array.from(grouped.entries())
      .map(([batchCode, batchApplications]) => [
        batchCode,
        [...batchApplications].sort((left, right) => getApplicationTimelineTime(right) - getApplicationTimelineTime(left)),
      ] as [string, TrainingApplicationRecord[]])
      .sort(([left], [right]) => left.localeCompare(right));
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
  const batchSummaries = useMemo(() => applicationsByBatch.map(([batchCode, batchApplications]) => buildBatchSummary(batchCode, batchApplications)), [applicationsByBatch]);
  const effectiveSelectedBatchCode =
    selectedBatchCode && applicationsByBatch.some(([batchCode]) => batchCode === selectedBatchCode)
      ? selectedBatchCode
      : applicationsByBatch[0]?.[0] ?? "";
  const selectedBatchApplications = applicationsByBatch.find(([batchCode]) => batchCode === effectiveSelectedBatchCode)?.[1] ?? [];
  const selectedBatchSummary = batchSummaries.find((batch) => batch.batchCode === effectiveSelectedBatchCode) ?? null;
  const visibleApplicationGroups =
    viewMode === "student"
      ? ([["Recently joined", studentApplications]] as [string, TrainingApplicationRecord[]][])
      : viewMode === "batch" && effectiveSelectedBatchCode
        ? ([[effectiveSelectedBatchCode, selectedBatchApplications]] as [string, TrainingApplicationRecord[]][])
        : viewMode === "date"
          ? applicationsByDate
          : [];

  async function load() {
    setLoading(true);
    setNotice(isLocalMode ? "Refreshing locally stored training applications." : "");
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
      const nextApplications = (await response.json()) as TrainingApplicationRecord[];
      setApplicationRecords(nextApplications);
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
      const updatedApplication = data as TrainingApplicationRecord;
      setApplicationRecords(
        applications.map((application) => (application.id === updatedApplication.id ? updatedApplication : application)),
      );
      setNotice(isLocalMode ? "Local training application updated successfully." : "Application updated successfully.");
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
    setPaymentFilter("ALL");
    setDateFilter("ALL");
    setSortBy("LATEST");
    setViewMode("student");
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
    setCollapsedGroups(
      visibleApplicationGroups.reduce<Record<string, boolean>>((acc, [label]) => {
        acc[label] = true;
        return acc;
      }, {}),
    );
  }

  function openRosterPrint(title: string, rosterApplications: TrainingApplicationRecord[]) {
    const sortedRoster = [...rosterApplications].sort((left, right) => {
      const leftMeta = getPreviewApplicationMeta(left);
      const rightMeta = getPreviewApplicationMeta(right);
      return (leftMeta.studentCode ?? left.payload.candidateName).localeCompare(rightMeta.studentCode ?? right.payload.candidateName);
    });
    const batchCodes = Array.from(new Set(sortedRoster.map((application) => getPreviewApplicationMeta(application).batchNumber))).join(", ");
    const printWindow = window.open("", "_blank", "width=1120,height=800");
    if (!printWindow) {
      setNotice("Unable to open print preview. Please allow pop-ups for the admin portal.");
      return;
    }

    printWindow.document.write(buildRosterPrintHtml(title, batchCodes || "Not assigned", sortedRoster));
    printWindow.document.close();
    printWindow.focus();
  }

  return (
    <section className="grid gap-5 text-[#173f33]">
      {notice ? <p className="rounded-md border border-[#d8eadf] bg-[#f4fbf7] px-4 py-3 text-sm font-semibold text-[#173f33]">{notice}</p> : null}

      <div className="grid min-w-0 gap-4 rounded-[1.25rem] border border-[#e7eee8] bg-white px-4 py-4 shadow-[0_18px_45px_rgba(18,28,39,0.04)]">
        <div className="flex flex-wrap items-center gap-8 border-b border-[#eef1f4]">
          {(["student", "batch", "date"] as const).map((mode) => {
            const active = viewMode === mode;
            const label = mode === "student" ? "Student" : mode === "batch" ? "Batch Wise" : "Date";

            return (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setViewMode(mode);
                  setSortBy(mode === "batch" ? "BATCH" : "LATEST");
                }}
                aria-pressed={active}
                className={`relative inline-flex min-h-12 items-center gap-2 text-sm font-black transition ${
                  active ? "text-[#173f33]" : "text-[#90a094] hover:text-[#173f33]"
                }`}
              >
                {mode === "date" ? <CalendarDays className="h-4 w-4" aria-hidden="true" /> : null}
                {label}
                {active ? <span className="absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-[#173f33]" /> : null}
              </button>
            );
          })}
        </div>

        {viewMode === "batch" ? (
          <div className="grid gap-4 rounded-lg border border-[#e7eee8] bg-[#fbfcfd] p-3">
            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {batchSummaries.length ? (
                batchSummaries.map((batch) => {
                  const active = batch.batchCode === effectiveSelectedBatchCode;

                  return (
                    <button
                      key={batch.batchCode}
                      type="button"
                      onClick={() => setSelectedBatchCode(batch.batchCode)}
                      className={`grid w-[14.5rem] shrink-0 gap-2 rounded-lg border p-3 text-left transition ${
                        active
                          ? "border-[#173f33] bg-white shadow-[0_12px_26px_rgba(23,63,51,0.12)]"
                          : "border-[#e7eee8] bg-white hover:border-[#d8eadf]"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#90a094]">Batch</span>
                      <span className="truncate text-base font-black text-[#173f33]">{batch.batchCode}</span>
                      <span className="truncate text-xs font-semibold text-[#607366]">{batch.programName}</span>
                      <span className="w-fit rounded-full bg-[#eef8e9] px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#4c8f35]">
                        {batch.totalStudents} students
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="px-2 py-6 text-sm font-semibold text-[#607366]">No batches match the current filters.</p>
              )}
            </div>

            {selectedBatchSummary ? (
              <div className="grid gap-3 rounded-lg border border-[#e7eee8] bg-white p-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(8rem,0.7fr))_auto] lg:items-center">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#90a094]">Selected batch</p>
                  <h3 className="mt-1 truncate text-lg font-black text-[#173f33]">{selectedBatchSummary.batchCode}</h3>
                  <p className="mt-1 truncate text-sm font-semibold text-[#607366]">{selectedBatchSummary.programName}</p>
                </div>
                <BatchSummaryMetric label="Students" value={selectedBatchSummary.totalStudents.toLocaleString("en-IN")} />
                <BatchSummaryMetric label="Vacancies" value={selectedBatchSummary.vacancies === null ? "Not set" : selectedBatchSummary.vacancies.toLocaleString("en-IN")} />
                <BatchSummaryMetric label="Capacity" value={selectedBatchSummary.capacity === null ? "Not set" : `${selectedBatchSummary.capacity} seats`} />
                <BatchSummaryMetric label="Collected" value={formatRosterMoney(selectedBatchSummary.collectedPaise)} />
                <button
                  type="button"
                  onClick={() => openRosterPrint(selectedBatchSummary.batchCode, selectedBatchApplications)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#173f33] px-3 text-xs font-black uppercase tracking-[0.1em] text-white"
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Print batch
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-3 xl:grid-cols-[minmax(18rem,1fr)_auto] xl:items-center">
          <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[18rem] flex-1 items-center rounded-full border border-[#e7eee8] bg-[#fbfdfb] px-4">
            <Search className="h-4 w-4 shrink-0 text-[#90a094]" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, phone, Aadhaar, invoice, transaction, enrollment ID"
              className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#173f33] outline-none placeholder:text-[#90a094]"
              aria-label="Search applications"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#607366]"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-[#e7eee8] bg-white px-4 text-sm font-black text-[#607366] shadow-[0_6px_18px_rgba(18,28,39,0.04)]"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
              <ChevronDown className={`h-4 w-4 transition ${filtersOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {filtersOpen ? (
              <div className="absolute left-0 top-[calc(100%+0.75rem)] z-20 w-[22rem] rounded-lg border border-[#e7eee8] bg-white p-3 shadow-[0_20px_45px_rgba(18,28,39,0.12)]">
                <div className="flex items-center justify-between gap-3 px-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#718477]">Admissions filters</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-full bg-[#fff8df] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#173f33]"
                  >
                    Reset
                  </button>
                </div>
                <div className="mt-3 grid gap-3">
                  <div className="grid gap-3">
                    <SelectField theme="light" label="Service filter" value={serviceFilter} onChange={setServiceFilter} options={["ALL", ...serviceOptions]} />
                    <SelectField theme="light" label="Date range" value={dateFilter} onChange={setDateFilter} options={["ALL", "LAST_7_DAYS", "LAST_30_DAYS"]} />
                    <SelectField theme="light" label="Sort list" value={sortBy} onChange={setSortBy} options={["BATCH", "LATEST", "OLDEST", "SERVICE", "NAME"]} />
                    <SelectField theme="light" label="Payment filter" value={paymentFilter} onChange={setPaymentFilter} options={["ALL", ...paymentOptions]} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          {viewMode === "date" ? (
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-[#e7eee8] bg-white px-3 py-2 shadow-[0_6px_18px_rgba(18,28,39,0.04)]">
              <CalendarDays className="h-4 w-4 text-[#718477]" aria-hidden="true" />
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="bg-transparent text-sm font-semibold text-[#173f33] outline-none"
              />
              <span className="text-xs font-black uppercase tracking-[0.12em] text-[#90a094]">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="bg-transparent text-sm font-semibold text-[#173f33] outline-none"
              />
            </div>
          ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              disabled={loading}
              onClick={load}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#173f33] px-4 text-sm font-black text-white shadow-[0_10px_22px_rgba(23,63,51,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4${loading ? " animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-lg border border-[#e7eee8] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7eee8] px-4 py-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#718477]">
              Enrolled students
            </p>
            <h3 className="mt-1 text-xl font-black text-[#173f33]">
              {viewMode === "student"
                ? `${studentApplications.length} student${studentApplications.length === 1 ? "" : "s"} sorted by recently joined`
                : viewMode === "batch" && selectedBatchSummary
                  ? `${selectedBatchSummary.batchCode} - ${selectedBatchSummary.totalStudents} student${selectedBatchSummary.totalStudents === 1 ? "" : "s"}`
                : `${filteredApplications.length} visible enrolled student${filteredApplications.length === 1 ? "" : "s"}`}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={expandAllGroups} className="rounded-md border border-[#e7eee8] bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#607366]">
              Expand all
            </button>
            <button type="button" onClick={collapseAllGroups} className="rounded-md border border-[#e7eee8] bg-[#fbfdfb] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#607366]">
              Collapse all
            </button>
          </div>
        </div>

        <div className="grid gap-0">
          {visibleApplicationGroups.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm font-semibold text-[#607366]">
              No applications match the current filters.
            </div>
          ) : (
            visibleApplicationGroups.map(([groupLabel, groupApplications]) => {
              const isCollapsed = collapsedGroups[groupLabel] ?? false;

              return (
                <section
                  key={`${groupLabel}-${groupApplications[0]?.id ?? "group"}`}
                  className="min-w-0 border-b border-[#e7eee8] last:border-b-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#e7c46f] bg-[#fff2c7] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173f33] text-xs font-black text-[#fff9ec] shadow-[0_8px_16px_rgba(23,63,51,0.14)]">
                        {String(groupApplications.length).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8b5a00]">{viewMode === "student" ? "Students" : viewMode === "batch" ? "Batch" : "Date"}</p>
                        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                          <h4 className="truncate text-sm font-black text-[#173f33]">{viewMode === "date" ? formatDateGroup(groupLabel) : viewMode === "student" ? "All enrolled students" : groupLabel}</h4>
                          {viewMode === "batch" ? (
                            <button
                              type="button"
                              onClick={() => openRosterPrint(groupLabel, groupApplications)}
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#173f33] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#fff9ec]"
                            >
                              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                              Print batch
                            </button>
                          ) : null}
                        </div>
                        {viewMode === "student" ? (
                          <p className="mt-1 truncate text-xs font-semibold text-[#6f5520]">
                            Recently joined students appear first
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleGroup(groupLabel)}
                      className="inline-flex items-center gap-2 rounded-md border border-[#173f33] bg-[#173f33] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#fff9ec] shadow-[0_8px_18px_rgba(23,63,51,0.16)]"
                      >
                        {isCollapsed ? <ChevronDown className="h-4 w-4" aria-hidden="true" /> : <ChevronUp className="h-4 w-4" aria-hidden="true" />}
                        {isCollapsed ? "Expand" : "Collapse"}
                      </button>
                    </div>
                  </div>

                  {!isCollapsed ? (
                    <div className="max-w-full overflow-x-auto">
                      <div className="min-w-[74rem]">
                        <div className="grid grid-cols-[minmax(16rem,2fr)_minmax(11rem,1.05fr)_7.5rem_9.5rem_6.5rem_6.75rem_minmax(10.5rem,1fr)_6.5rem] gap-3 border-b border-[#e7c46f] bg-[#fff8df] px-4 py-3 text-[10px] font-black uppercase tracking-[0.08em] text-[#61440b]">
                          <span>Student</span>
                          <span>Course</span>
                          <span>Phone</span>
                          <span>Submitted</span>
                          <span>Payment</span>
                          <span>Status</span>
                          <span>Enrollment ID</span>
                          <span className="text-right">Action</span>
                        </div>
                    {groupApplications.map((application) => {
                      const isActive = selectedApplication?.id === application.id;
                      const meta = getPreviewApplicationMeta(application);
                      return (
                              <button
                          key={application.id}
                          onClick={() => setSelectedApplicationId(application.id)}
                              className={`grid grid-cols-[minmax(16rem,2fr)_minmax(11rem,1.05fr)_7.5rem_9.5rem_6.5rem_6.75rem_minmax(10.5rem,1fr)_6.5rem] items-center gap-3 border-b border-[#e7eee8] px-4 py-4 text-left transition last:border-b-0 ${
                            isActive
                                  ? "bg-[#fff8df] text-[#173f33]"
                                  : "bg-white text-[#173f33] hover:bg-[#fbfdfb]"
                          }`}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedApplicationId(application.id);
                            }
                          }}
                        >
                              <div className="min-w-0">
                                <p className="line-clamp-2 break-words text-sm font-black leading-5 text-[#173f33]">{application.payload.candidateName}</p>
                                <p className="mt-1 line-clamp-1 break-words text-xs font-semibold text-[#607366]">Guardian: {application.payload.guardianName}</p>
                            </div>
                              <div className="min-w-0">
                                <p className="line-clamp-2 break-words text-xs font-black uppercase leading-4 tracking-[0.08em]">{application.payload.serviceName}</p>
                                <p className="mt-1 truncate text-xs font-semibold text-[#607366]">{meta.batchNumber}</p>
                              </div>
                              <span className="truncate text-sm font-semibold">{application.payload.phone}</span>
                              <span className="text-xs font-semibold text-[#607366]">{formatDateLabel(application.payload.submittedAt)}</span>
                              <StatusBadge status={application.payload.paymentStatus} active={isActive} />
                              <StatusBadge status="ENROLLED" active={isActive} />
                              <span className="truncate text-xs font-black text-[#607366]">
                                {meta.studentCode ?? meta.applicationCode}
                              </span>
                              <span className="flex items-center justify-end gap-1.5">
                                <span
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openRosterPrint(application.payload.candidateName, [application]);
                                  }}
                                  className={`inline-flex items-center justify-center rounded-full px-2.5 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                                  isActive
                                    ? "bg-white text-[#173f33] hover:bg-[#eef8f1]"
                                    : "bg-[#eef8f1] text-[#173f33] hover:bg-[#d8eadf]"
                                }`}
                                >
                                  Print
                                </span>
                                <span
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openStudentProfile(application.id);
                                  }}
                                  className={`inline-flex items-center justify-center rounded-full px-2.5 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                                  isActive
                                    ? "bg-[#173f33] text-white hover:bg-[#0f2f25]"
                                    : "bg-[#173f33] text-white hover:bg-[#2b3540]"
                                }`}
                              >
                                View
                              </span>
                            </span>
                            </button>
                      );
                    })}
                      </div>
                  </div>
                  ) : null}
                </section>
              )})
          )}
        </div>
      </div>

      {profileOpen && selectedApplication ? (
        <ApplicationProfileOverlay
          application={selectedApplication}
          applications={applications}
          disabled={loading || !canMutate}
          onClose={() => setProfileOpen(false)}
          onSave={updateApplication}
        />
      ) : null}
    </section>
  );
}

function getApplicationTimelineTime(application: TrainingApplicationRecord) {
  const paidAt = application.latestPayment?.paidAt ? new Date(application.latestPayment.paidAt).getTime() : NaN;
  if (Number.isFinite(paidAt)) return paidAt;

  const submittedAt = new Date(application.payload.submittedAt).getTime();
  if (Number.isFinite(submittedAt)) return submittedAt;

  return new Date(application.createdAt).getTime();
}

type ProgramRosterCardData = {
  key: string;
  title: string;
  shortName: string;
  enrolled: number;
  capacity: number | null;
  vacancies: number | null;
  batchCount: number;
  latestEnrollment: string;
  collectedPaise: number;
};

type BatchSummaryCardData = {
  batchCode: string;
  programName: string;
  totalStudents: number;
  capacity: number | null;
  vacancies: number | null;
  collectedPaise: number;
  latestEnrollment: string;
  firstEnrollment: string;
};

function buildBatchSummary(batchCode: string, applications: TrainingApplicationRecord[]): BatchSummaryCardData {
  const programNames = Array.from(new Set(applications.map((application) => getRosterDisplayProgramName(application.payload.serviceName)))).sort();
  const primaryProgramName = programNames[0] ?? "Program not assigned";
  const capacity = programNames.length === 1 ? getRosterProgramCapacity(primaryProgramName) : null;
  const latestApplication = [...applications].sort((left, right) => getApplicationTimelineTime(right) - getApplicationTimelineTime(left))[0] ?? null;
  const firstApplication = [...applications].sort((left, right) => getApplicationTimelineTime(left) - getApplicationTimelineTime(right))[0] ?? null;
  const collectedPaise = applications.reduce((total, application) => total + (application.latestPayment?.amountPaise ?? 0), 0);

  return {
    batchCode,
    programName: programNames.length > 1 ? `${programNames.length} programs` : primaryProgramName,
    totalStudents: applications.length,
    capacity,
    vacancies: capacity === null ? null : Math.max(capacity - applications.length, 0),
    collectedPaise,
    latestEnrollment: latestApplication ? formatDateLabel(latestApplication.payload.submittedAt) : "No students yet",
    firstEnrollment: firstApplication ? formatDateLabel(firstApplication.payload.submittedAt) : "No students yet",
  };
}

function getRosterProgramCapacity(serviceName: string) {
  return findRosterCatalogProgram(serviceName)?.capacity ?? null;
}

function getRosterDisplayProgramName(serviceName: string) {
  return findRosterCatalogProgram(serviceName)?.title ?? serviceName;
}

function buildProgramRosterCards(applications: TrainingApplicationRecord[]): ProgramRosterCardData[] {
  const catalogPrograms = trainingProgramCatalog.filter((program) => !deprecatedTrainingProgramSlugs.has(program.slug));
  const cards = new Map<string, ProgramRosterCardData>();

  for (const program of catalogPrograms) {
    cards.set(program.slug, {
      key: program.slug,
      title: program.title,
      shortName: getProgramShortName(program.title),
      enrolled: 0,
      capacity: program.capacity,
      vacancies: program.capacity,
      batchCount: 0,
      latestEnrollment: "No students yet",
      collectedPaise: 0,
    });
  }

  const batchCodesByProgram = new Map<string, Set<string>>();
  const latestByProgram = new Map<string, number>();

  for (const application of applications) {
    const catalogProgram = findRosterCatalogProgram(application.payload.serviceName);
    const key = catalogProgram?.slug ?? normalizeRosterKey(application.payload.serviceName);
    const existing = cards.get(key) ?? {
      key,
      title: application.payload.serviceName,
      shortName: getProgramShortName(application.payload.serviceName),
      enrolled: 0,
      capacity: null,
      vacancies: null,
      batchCount: 0,
      latestEnrollment: "No students yet",
      collectedPaise: 0,
    };
    const submittedAt = new Date(application.payload.submittedAt).getTime();
    const meta = getPreviewApplicationMeta(application);

    existing.enrolled += 1;
    existing.collectedPaise += application.latestPayment?.amountPaise ?? 0;
    if (existing.capacity !== null) {
      existing.vacancies = Math.max(existing.capacity - existing.enrolled, 0);
    }

    const batchCodes = batchCodesByProgram.get(key) ?? new Set<string>();
    batchCodes.add(meta.batchNumber);
    batchCodesByProgram.set(key, batchCodes);
    existing.batchCount = batchCodes.size;

    if (Number.isFinite(submittedAt) && submittedAt > (latestByProgram.get(key) ?? 0)) {
      latestByProgram.set(key, submittedAt);
      existing.latestEnrollment = formatDateLabel(application.payload.submittedAt);
    }

    cards.set(key, existing);
  }

  return Array.from(cards.values()).sort((left, right) => {
    if (right.enrolled !== left.enrolled) return right.enrolled - left.enrolled;
    return left.title.localeCompare(right.title);
  });
}

function BatchSummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-[#fbfcfd] px-3 py-2">
      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#90a094]">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-[#173f33]">{value}</p>
    </div>
  );
}

function findRosterCatalogProgram(serviceName: string) {
  const normalizedServiceName = normalizeRosterKey(serviceName);
  if (normalizedServiceName === "beekeeping") {
    return trainingProgramCatalog.find((program) => program.slug === "scientific-beekeeping-foundation") ?? null;
  }

  return trainingProgramCatalog.find((program) => normalizeRosterKey(program.title) === normalizedServiceName) ?? null;
}

function normalizeRosterKey(value: string) {
  return value.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "");
}

function getProgramShortName(title: string) {
  if (title.toLowerCase().includes("scientific")) return "BK";
  if (title.toLowerCase().includes("honey")) return "HP";
  if (title.toLowerCase().includes("queen")) return "QBRJ";

  return title
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();
}

function ProgramRosterCard({ card }: { card: ProgramRosterCardData }) {
  const vacancyLabel = card.vacancies === null ? "Not set" : card.vacancies.toLocaleString("en-IN");
  const capacityLabel = card.capacity === null ? "Capacity not set" : `${card.capacity.toLocaleString("en-IN")} seats`;

  return (
    <article className="grid min-h-[12rem] w-[21rem] shrink-0 gap-3 rounded-lg border border-[#e7eee8] bg-[#fbfcfd] p-4 xl:w-[22rem]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-[#eef8f1] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#173f33]">
            {card.shortName}
          </span>
          <h3 className="mt-3 line-clamp-2 max-w-[14rem] text-base font-black leading-5 text-[#173f33]">{card.title}</h3>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#90a094]">Students</p>
          <p className="text-3xl font-black leading-none text-[#173f33]">{card.enrolled.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <ProgramRosterMetric label="Vacancies" value={vacancyLabel} />
        <ProgramRosterMetric label="Capacity" value={capacityLabel} />
        <ProgramRosterMetric label="Batches" value={card.batchCount.toLocaleString("en-IN")} />
        <ProgramRosterMetric label="Collected" value={formatRosterMoney(card.collectedPaise)} />
      </div>

      <p className="truncate border-t border-[#e7eee8] pt-2 text-xs font-semibold text-[#607366]">
        Latest: <span className="font-black text-[#607366]">{card.latestEnrollment}</span>
      </p>
    </article>
  );
}

function ProgramRosterMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-white px-3 py-2">
      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#90a094]">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-[#173f33]">{value}</p>
    </div>
  );
}

function formatRosterMoney(amountPaise: number) {
  return `Rs. ${(amountPaise / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function buildRosterPrintHtml(title: string, batchCode: string, applications: TrainingApplicationRecord[]) {
  const logoSrc = `${window.location.origin}/api-culture-logo-clean.png`;
  const printedAt = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const rows = applications.map((application, index) => {
    const meta = getPreviewApplicationMeta(application);
    return `
      <tr>
        <td>${index + 1}</td>
        <td>
          <strong>${escapeHtml(application.payload.candidateName)}</strong>
          <small>${escapeHtml(meta.studentCode ?? meta.applicationCode ?? "Not assigned")}</small>
        </td>
        <td>${escapeHtml(calculateAge(application.payload.dateOfBirth))}</td>
        <td>${escapeHtml(application.payload.aadhaarNo || "Not provided")}</td>
        <td>${escapeHtml(application.payload.phone || "Not provided")}</td>
        <td></td>
      </tr>
    `;
  }).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} roster</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #eef3ef; color: #173f33; font-family: Arial, sans-serif; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: flex-end; gap: 12px; padding: 14px 18px; background: #173f33; }
    .toolbar button { border: 0; border-radius: 999px; background: #f5c65e; color: #173f33; cursor: pointer; font-size: 13px; font-weight: 800; padding: 10px 18px; text-transform: uppercase; }
    .sheet { max-width: 1120px; min-height: 780px; margin: 24px auto; background: #fffdf8; padding: 34px; border: 1px solid #d9c89f; }
    header { text-align: center; border-bottom: 2px solid #173f33; padding-bottom: 18px; }
    .logo { height: 74px; width: 74px; object-fit: contain; margin: 0 auto 8px; display: block; }
    h1 { margin: 0; font-size: 26px; letter-spacing: 0.08em; text-transform: uppercase; }
    h2 { margin: 8px 0 0; font-size: 18px; }
    .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; }
    .meta div { border: 1px solid #d9c89f; padding: 10px 12px; }
    .meta span { display: block; color: #718477; font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
    .meta strong { display: block; margin-top: 4px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #173f33; padding: 10px 9px; text-align: left; vertical-align: top; }
    th { background: #f3ecdf; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
    td { height: 46px; font-size: 13px; }
    td:first-child { width: 44px; text-align: center; }
    td:nth-child(3) { width: 74px; text-align: center; }
    td:nth-child(4) { width: 150px; }
    td:nth-child(5) { width: 130px; }
    td:nth-child(6) { width: 170px; }
    small { display: block; margin-top: 4px; color: #718477; font-size: 11px; font-weight: 700; }
    footer { margin-top: 24px; display: flex; justify-content: space-between; gap: 28px; font-size: 12px; font-weight: 700; }
    .line { flex: 1; border-top: 1px solid #173f33; padding-top: 8px; text-align: center; }
    @media print {
      body { background: white; }
      .toolbar { display: none; }
      .sheet { margin: 0; max-width: none; min-height: auto; border: 0; padding: 18mm 12mm; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.print()">Print final</button>
    <button onclick="window.close()">Close</button>
  </div>
  <main class="sheet">
    <header>
      <img class="logo" src="${escapeHtml(logoSrc)}" alt="API CULTURE logo" />
      <h1>API CULTURE</h1>
      <h2>${escapeHtml(title)} - Enrolled Student Roster</h2>
    </header>
    <section class="meta">
      <div><span>Batch</span><strong>${escapeHtml(batchCode)}</strong></div>
      <div><span>Total enrolled</span><strong>${applications.length}</strong></div>
      <div><span>Prepared on</span><strong>${escapeHtml(printedAt)}</strong></div>
    </section>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name of enrolled student</th>
          <th>Age</th>
          <th>Aadhaar number</th>
          <th>Phone number</th>
          <th>Signature</th>
        </tr>
      </thead>
      <tbody>${rows || `<tr><td colspan="6">No enrolled students found for this roster.</td></tr>`}</tbody>
    </table>
    <footer>
      <div class="line">Training Coordinator</div>
      <div class="line">Admin Verification</div>
    </footer>
  </main>
</body>
</html>`;
}

function calculateAge(dateOfBirth: string) {
  const parsed = new Date(dateOfBirth);
  if (Number.isNaN(parsed.getTime())) return "N/A";

  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const monthDifference = today.getMonth() - parsed.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < parsed.getDate())) {
    age -= 1;
  }

  return age >= 0 && age < 130 ? String(age) : "N/A";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function StatusBadge({ status, active }: { status: string; active: boolean }) {
  const normalized = status.replaceAll("_", " ");
  const isGood = status === "PAID" || status === "ENROLLED" || status === "PAYMENT_COMPLETED";
  const isBad = status === "FAILED" || status === "PAYMENT_FAILED";

  if (active) {
    return (
      <span className="w-fit rounded-full bg-[#eef8f1] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#173f33]">
        {normalized}
      </span>
    );
  }

  return (
    <span
      className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${
        isGood
          ? "bg-[#eef8e9] text-[#4c8f35]"
          : isBad
            ? "bg-[#fff0f4] text-[#d9476f]"
            : "bg-[#fff5e7] text-[#9c6a18]"
      }`}
    >
      {normalized}
    </span>
  );
}

function ApplicationProfileOverlay({
  application,
  applications,
  disabled,
  onSave,
  onClose,
}: {
  application: TrainingApplicationRecord;
  applications: TrainingApplicationRecord[];
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(16,33,27,0.16)] p-3 backdrop-blur-[18px] sm:p-4" onClick={onClose}>
      <div
        className="mx-auto flex max-h-[82vh] w-full max-w-[74rem] flex-col overflow-hidden rounded-[1.2rem] border border-white/55 bg-white/55 shadow-[0_11px_32px_rgba(16,33,27,0.16),inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(23,63,51,0.08)] backdrop-blur-[18px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/45 bg-white/60 px-3 py-2.5 backdrop-blur-[18px] sm:px-4">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#7a5a12]">Student dossier</p>
            <h3 className="font-display mt-0.5 truncate text-lg font-semibold text-[#173f33]">{application.payload.candidateName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/65 text-[#173f33] shadow-[0_11px_22px_rgba(16,33,27,0.12)] backdrop-blur-[18px]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2.5 sm:p-3">
          <ApplicationCard application={application} applications={applications} disabled={disabled} onSave={onSave} />
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({
  application,
  applications,
  onSave,
  disabled,
}: {
  application: TrainingApplicationRecord;
  applications: TrainingApplicationRecord[];
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
  const [attemptStatus] = useState<ApplicationAttemptStatus>(application.payload.attemptStatus);
  const [paymentStatus] = useState<ApplicationPaymentStatus>(application.payload.paymentStatus);
  const [adminNotes, setAdminNotes] = useState(application.payload.adminNotes);
  const [paymentReference] = useState(application.payload.paymentReference);
  const [activeTab, setActiveTab] = useState<"details" | "transactions" | "logs">("details");
  const photoSrc = application.payload.photoUrl || application.payload.photoDataUrl;
  const previewMeta = getPreviewApplicationMeta(application);
  const age = calculateAge(application.payload.dateOfBirth);
  const paidAmount = application.latestPayment
    ? `Rs. ${(application.latestPayment.amountPaise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "Not captured";
  const duplicateMatches = applications
    .filter((candidate) => candidate.id !== application.id)
    .filter((candidate) =>
      candidate.payload.aadhaarNo === application.payload.aadhaarNo ||
      (candidate.payload.phone && candidate.payload.phone === application.payload.phone) ||
      (candidate.payload.email && candidate.payload.email.toLowerCase() === application.payload.email.toLowerCase()),
    );
  const personalRows = [
    ["Gender", application.payload.gender],
    ["Age", age],
    ["Date of birth", application.payload.dateOfBirth],
    ["Aadhaar", application.payload.aadhaarNo],
    ["Guardian", application.payload.guardianName],
  ];
  const contactRows = [
    ["Phone", application.payload.phone || "Not provided"],
    ["Email", application.payload.email || "Not provided"],
    ["Residence phone", application.payload.residencePhone || "Not provided"],
    ["Address", `${application.payload.addressLine}, ${application.payload.mandal}, ${application.payload.district}, ${application.payload.state}, ${application.payload.pinCode}`],
  ];
  const trainingRows = [
    ["Program", application.payload.serviceName],
    ["Batch number", previewMeta.batchNumber],
    ["Enrollment ID", previewMeta.studentCode ?? "Not assigned yet"],
    ["Application number", previewMeta.applicationCode ?? "Not assigned yet"],
    ["Education", application.payload.educationQualification || "Not provided"],
    ["Occupation", application.payload.occupation || "Not provided"],
    ["Sponsoring organization", application.payload.sponsoringOrganization || "Not provided"],
    ["Application date", application.payload.applicationDate],
    ["Files sent from student", previewMeta.studentFiles],
  ];
  const transactionRows = [
    ["Invoice number", application.latestPayment?.invoiceNumber ?? "Not generated yet"],
    ["Merchant order", application.latestPayment?.merchantOrderId ?? "Not available"],
    ["Gateway reference", application.latestPayment?.paymentReference ?? (paymentReference || "Not provided")],
    ["Payment status", application.latestPayment?.status ?? paymentStatus],
    ["Paid amount", paidAmount],
    ["Paid at", application.latestPayment?.paidAt ? formatDateLabel(application.latestPayment.paidAt) : "Captured by gateway"],
    ["Expires at", application.latestPayment?.expiresAt ? formatDateLabel(application.latestPayment.expiresAt) : "Not available"],
    ["Environment", application.latestPayment?.environment ?? "Not available"],
    ["Refund eligible", application.latestPayment?.refundEligible ? "Yes" : "No"],
    ["Latest gateway event", application.latestPayment?.latestEventName ?? "No gateway event stored"],
  ];
  const logRows = [
    ["Application created", formatDateLabel(application.createdAt), previewMeta.applicationCode ?? "Application number pending"],
    ["Application updated", formatDateLabel(application.updatedAt), "Latest admin or gateway update"],
    ["Payment sent", previewMeta.paymentSentDate, application.payload.paymentStatus.replaceAll("_", " ")],
    ["Payment confirmed", previewMeta.paymentApprovedDate, application.latestPayment?.status ?? paymentStatus],
    ["Duplicate check", `${duplicateMatches.length} possible match${duplicateMatches.length === 1 ? "" : "es"}`, "Matched by Aadhaar, phone, or email"],
  ];

  return (
    <article className="rounded-[1rem] border border-white/55 bg-white/50 p-2.5 shadow-[0_11px_26px_rgba(16,33,27,0.12),inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-[18px]">
      <div className="grid gap-2.5 xl:grid-cols-[10.5rem_minmax(0,1fr)]">
        <aside className="rounded-[0.85rem] border border-white/55 bg-white/62 p-2.5 shadow-[0_11px_18px_rgba(23,63,51,0.08),inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-[18px]">
          <div className="mx-auto h-16 w-16 overflow-hidden rounded-[0.8rem] bg-white/70">
            {photoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoSrc} alt={`${application.payload.candidateName} photo`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#173f33]">
                  <UserRound className="h-8 w-8" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="mt-2.5 grid gap-1.5">
            <StatusPill icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />} label="ENROLLED" />
            <StatusPill icon={<FileClock className="h-4 w-4" aria-hidden="true" />} label={attemptStatus} />
          </div>
          <button
            type="button"
            onClick={() => {
              const meta = getPreviewApplicationMeta(application);
              const printWindow = window.open("", "_blank", "width=1120,height=800");
              if (!printWindow) return;
              printWindow.document.write(buildRosterPrintHtml(application.payload.candidateName, meta.batchNumber, [application]));
              printWindow.document.close();
              printWindow.focus();
            }}
            className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-[0.65rem] bg-[#173f33] px-3 py-2 text-xs font-black text-[#fff9ec] shadow-[0_11px_20px_rgba(23,63,51,0.18)]"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            Print
          </button>
        </aside>

        <div className="min-w-0 overflow-hidden rounded-[0.85rem] border border-white/55 bg-white/62 shadow-[0_11px_20px_rgba(23,63,51,0.08),inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-[18px]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/55 bg-white/72 px-2.5 py-2 backdrop-blur-[18px]">
            <div className="flex rounded-full border border-white/55 bg-white/70 p-1 backdrop-blur-[18px]">
              {[
                ["details", "Details"],
                ["transactions", "Transactions"],
                ["logs", `Logs ${duplicateMatches.length ? `(${duplicateMatches.length})` : ""}`],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveTab(value as "details" | "transactions" | "logs")}
                  className={`h-7 rounded-full px-2.5 text-[10px] font-black uppercase tracking-[0.12em] transition ${
                    activeTab === value ? "bg-[#173f33] text-[#fff9ec] shadow-[0_11px_22px_rgba(23,63,51,0.16)]" : "text-[#4e6358] hover:bg-white/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5">
            {activeTab === "details" ? (
              <div className="grid gap-2.5 2xl:grid-cols-[0.85fr_1fr_1.15fr]">
                <DossierPanel title="Student details" rows={personalRows} />
                <DossierPanel title="Contact details" rows={contactRows} />
                <DossierPanel title="Program details" rows={trainingRows} />
              </div>
            ) : null}

            {activeTab === "transactions" ? (
              <section className="grid gap-2.5">
                <DossierPanel title="Gateway transaction details" rows={transactionRows} columns />
              </section>
            ) : null}

            {activeTab === "logs" ? (
              <section className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_16rem]">
                <div className="rounded-[0.85rem] border border-white/55 bg-white/62 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-[18px]">
                  <h4 className="text-sm font-black text-[#173f33]">Activity log</h4>
                  <div className="mt-2 grid gap-1.5">
                    {logRows.map(([label, value, meta]) => (
                      <DossierLogItem key={label} label={label} value={value} meta={meta} />
                    ))}
                    {duplicateMatches.map((match) => {
                      const matchMeta = getPreviewApplicationMeta(match);
                      return (
                        <DossierLogItem
                          key={match.id}
                          label="Possible duplicate student"
                          value={`${match.payload.candidateName} / ${matchMeta.studentCode ?? matchMeta.applicationCode}`}
                          meta={`Phone ${match.payload.phone || "not shared"} / Aadhaar ${match.payload.aadhaarNo}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[0.85rem] border border-white/55 bg-white/62 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-[18px]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-[#173f33]">Admin notes</h4>
                    <button
                      disabled={disabled}
                      onClick={() => onSave(application.id, { attemptStatus, paymentStatus, approvalStatus: "APPROVED", crossCheckStatus: "VERIFIED", adminNotes, paymentReference })}
                      className="inline-flex items-center justify-center rounded-full bg-[#173f33] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#fff9ec] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Save
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={adminNotes}
                    onChange={(event) => setAdminNotes(event.target.value)}
                    placeholder="Internal note for this enrolled student..."
                    className="w-full rounded-[0.75rem] border border-white/55 bg-white/70 px-3 py-2 text-sm font-medium text-[#173f33] outline-none ring-[#35b985] backdrop-blur-[18px] placeholder:text-[#6f8176] focus:ring-2"
                  />
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function DossierKeyValue({ label, value, boxed = false }: { label: string; value: string; boxed?: boolean }) {
  return (
    <div className={boxed ? "rounded-[0.7rem] border border-white/55 bg-white/70 px-2.5 py-1.5 backdrop-blur-[18px]" : "grid grid-cols-[5rem_minmax(0,1fr)] gap-1.5"}>
      <span className="text-[11px] font-black leading-5 text-[#123b2f]">{label}:</span>
      <span className="break-words text-[11px] font-bold leading-5 text-[#3c5147]">{value}</span>
    </div>
  );
}

function DossierPanel({ title, rows, columns = false }: { title: string; rows: string[][]; columns?: boolean }) {
  return (
    <section className="rounded-[0.85rem] border border-white/55 bg-white/68 p-2.5 shadow-[0_11px_18px_rgba(23,63,51,0.07),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-[18px]">
      <h4 className="text-[13px] font-black text-[#123b2f]">{title}</h4>
      <dl className={`mt-2 grid gap-1.5 ${columns ? "md:grid-cols-2" : ""}`}>
        {rows.map(([label, value]) => (
          <DossierKeyValue key={label} label={label} value={value} boxed={columns} />
        ))}
      </dl>
    </section>
  );
}

function DossierLogItem({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <div className="grid gap-1.5 rounded-[0.75rem] border border-white/55 bg-white/70 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-[18px] sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-center">
      <p className="text-[11px] font-black text-[#123b2f]">{label}</p>
      <div className="min-w-0">
        <p className="break-words text-xs font-black text-[#173f33]">{value}</p>
        <p className="mt-0.5 break-words text-[11px] font-bold leading-4 text-[#4f6259]">{meta}</p>
      </div>
    </div>
  );
}

function StatusPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/55 bg-white/70 px-2.5 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#123b2f] shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-[18px]">
      {icon}
      {label.replaceAll("_", " ")}
    </span>
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
  const unassignedBatchNumber = buildUnassignedBatchNumber();
  const unassignedStudentCode = formatStudentCode(
    unassignedBatchNumber,
    buildStableStudentSequence(application.id),
  );
  const applicationCode = application.applicationCode ?? (
    application.applicationNumber ? `API-${String(application.applicationNumber).padStart(4, "0")}` : null
  );
  const studentCode = application.batchCode && application.batchSequenceNumber
    ? formatStudentCode(application.batchCode, application.batchSequenceNumber)
    : application.studentCode ?? null;

  if (index >= 0) {
    const batchNumber = index < 10 ? "BK-01-Aug26" : index < 20 ? "QCM-01-Aug26" : "BK-02-Aug26";
    const previewStudentCode = formatStudentCode(batchNumber, index + 1);
    const paymentSentDate =
      application.payload.paymentStatus === "NOT_STARTED"
        ? "Not sent yet"
        : formatDateLabel(application.payload.submittedAt);
    const paymentApprovedDate =
      application.latestPayment?.paidAt
        ? formatDateLabel(application.latestPayment.paidAt)
        : application.payload.paymentStatus === "PAID"
          ? "Confirmed by gateway"
          : "Not confirmed yet";
    const passedOutDate = "Batch not completed yet";

    return {
      applicationCode: applicationCode ?? `API-P${String(index + 1).padStart(3, "0")}`,
      studentCode: studentCode ?? previewStudentCode,
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
    applicationCode: applicationCode ?? `API-${application.id.slice(-6).toUpperCase()}`,
    studentCode: studentCode ?? unassignedStudentCode,
    batchNumber: application.batchCode ?? unassignedBatchNumber,
    paymentSentDate: "Not captured yet",
    paymentApprovedDate: application.latestPayment?.paidAt ? formatDateLabel(application.latestPayment.paidAt) : "Not confirmed yet",
    passedOutDate: "Not captured yet",
    studentFiles: application.payload.photoName ? `${application.payload.photoName} (${application.payload.photoType || "file"})` : "No extra student files are stored yet",
  };
}

function buildUnassignedBatchNumber() {
  const now = new Date();
  const monthYear = now.toLocaleString("en-US", { month: "short", timeZone: "Asia/Kolkata" }) + String(now.getFullYear()).slice(-2);

  return `UN-01-${monthYear}`;
}

function buildStableStudentSequence(value: string) {
  const hash = Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);

  return (hash % 999) + 1;
}

