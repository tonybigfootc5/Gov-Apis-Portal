"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, ChevronDown, ChevronUp, CreditCard, FileClock, Printer, RefreshCw, Search, SlidersHorizontal, UserRound, WalletCards, X } from "lucide-react";
import type {
  ApplicationApprovalStatus,
  ApplicationAttemptStatus,
  ApplicationCrossCheckStatus,
  ApplicationPaymentStatus,
  TrainingApplicationRecord,
} from "@/lib/training-application";
import { formatStudentCode, isSuccessfulPaymentApplication } from "@/lib/training-application";

type Props = {
  storageMode: "database" | "local";
  initialApplications: TrainingApplicationRecord[];
  onApplicationsChange?: (applications: TrainingApplicationRecord[]) => void;
};

const paymentOptions: ApplicationPaymentStatus[] = ["NOT_STARTED", "PENDING", "PAID", "FAILED"];
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
  const applicationsByStudent = useMemo(() => groupApplicationsByStudentIdentity(filteredApplications), [filteredApplications]);
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
  const visibleApplicationGroups = viewMode === "student" ? applicationsByStudent : viewMode === "batch" ? applicationsByBatch : applicationsByDate;
  const paidCount = filteredApplications.filter((application) => application.payload.paymentStatus === "PAID").length;
  const withPhotoCount = filteredApplications.filter((application) => application.payload.photoName).length;
  const programCount = new Set(filteredApplications.map((application) => application.payload.serviceName)).size;
  const statCards = [
    { label: "Enrolled", value: filteredApplications.length, hint: "Payment successful", dot: "bg-[#1b8f63]" },
    { label: "Paid", value: paidCount, hint: "Gateway confirmed", dot: "bg-[#077b76]" },
    { label: "Programs", value: programCount, hint: "Active roster", dot: "bg-[#6b7cff]" },
    { label: "Photos", value: withPhotoCount, hint: "Applicant files", dot: "bg-[#f5a524]" },
  ];

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
    <section className="grid gap-4">
      {notice ? <p className="rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-[#173f33] shadow-[0_12px_28px_rgba(64,44,8,0.05)]">{notice}</p> : null}

      <div className="rounded-[1.35rem] border border-[rgba(23,63,51,0.08)] bg-[#173f33] p-4 text-[#fff9ec] shadow-[0_12px_28px_rgba(23,63,51,0.12)]">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#f5c65e]">Enrollment roster</p>
        <p className="mt-1 text-sm font-semibold text-[#d4e1d8]">
          {enrolledApplications.length.toLocaleString("en-IN")} student{enrolledApplications.length === 1 ? "" : "s"} with successful gateway payment.
        </p>
      </div>

      <div className="rounded-[1.55rem] bg-white p-3 shadow-[0_12px_30px_rgba(23,63,51,0.06)]">
        <div className="grid gap-3 xl:grid-cols-[minmax(18rem,1fr)_auto] xl:items-center">
          <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[18rem] flex-1 items-center rounded-[0.9rem] border border-[#e5ebe6] bg-[#fbfdfb] px-4">
            <Search className="h-4 w-4 shrink-0 text-[#9c6a18]" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, phone, Aadhaar, invoice, transaction, enrollment ID"
              className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-[#173f33] outline-none placeholder:text-[#819083]"
              aria-label="Search applications"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3ecdf] text-[#173f33]"
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
              className="inline-flex h-11 items-center gap-2 rounded-[0.9rem] border border-[#e5ebe6] bg-[#fbfdfb] px-4 text-sm font-black text-[#173f33]"
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
            <div className="flex flex-wrap items-center gap-2 rounded-[0.9rem] border border-[#e5ebe6] bg-[#fbfdfb] px-3 py-2">
              <CalendarDays className="h-4 w-4 text-[#9c6a18]" aria-hidden="true" />
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="bg-transparent text-sm font-semibold text-[#173f33] outline-none"
              />
              <span className="text-xs font-black uppercase tracking-[0.12em] text-[#718477]">to</span>
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
            <div className="flex items-center rounded-[0.95rem] bg-[#eef3ef] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode((current) => {
                      const next = current === "student" ? "batch" : current === "batch" ? "date" : "student";
                      setSortBy(next === "batch" ? "BATCH" : "LATEST");
                      return next;
                    });
                  }}
                className="relative inline-flex h-9 w-[18.75rem] items-center rounded-[0.75rem]"
                  aria-label="Toggle roster view mode"
                >
                  <span
                  className={`absolute top-0 h-9 rounded-[0.75rem] bg-[#173f33] shadow-[0_10px_18px_rgba(23,63,51,0.18)] transition-all ${
                    viewMode === "student" ? "left-0 w-[6.05rem]" : viewMode === "batch" ? "left-[6.25rem] w-[6.05rem]" : "left-[12.5rem] w-[6.05rem]"
                    }`}
                  />
                  <span className={`relative z-10 flex w-1/3 items-center justify-center text-[11px] font-black uppercase tracking-[0.16em] ${viewMode === "student" ? "text-[#fff9ec]" : "text-[#607366]"}`}>
                    Student
                  </span>
                  <span className={`relative z-10 flex w-1/3 items-center justify-center text-[11px] font-black uppercase tracking-[0.16em] ${viewMode === "batch" ? "text-[#fff9ec]" : "text-[#607366]"}`}>
                    Batch Wise
                  </span>
                  <span className={`relative z-10 flex w-1/3 items-center justify-center gap-1 text-[11px] font-black uppercase tracking-[0.16em] ${viewMode === "date" ? "text-[#fff9ec]" : "text-[#607366]"}`}>
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    Date
                  </span>
                </button>
            </div>
            <button
              disabled={loading}
              onClick={load}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[0.9rem] bg-[#f5c65e] px-4 text-sm font-black text-[#173f33] shadow-[0_10px_22px_rgba(217,147,31,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4${loading ? " animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-3 grid gap-1 overflow-hidden rounded-[1.1rem] bg-[#f5f8f5] sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => (
            <ApplicationStatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.55rem] bg-white shadow-[0_14px_34px_rgba(23,63,51,0.07)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2ee] px-4 py-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9c6a18]">
              Enrolled students
            </p>
            <h3 className="mt-1 text-xl font-black text-[#173f33]">
              {viewMode === "student"
                ? `${visibleApplicationGroups.length} applicant profile${visibleApplicationGroups.length === 1 ? "" : "s"} from ${filteredApplications.length} paid record${filteredApplications.length === 1 ? "" : "s"}`
                : `${filteredApplications.length} visible enrolled student${filteredApplications.length === 1 ? "" : "s"}`}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={expandAllGroups} className="rounded-[0.8rem] border border-[#e6ece7] bg-[#fbfdfb] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#173f33]">
              Expand all
            </button>
            <button type="button" onClick={collapseAllGroups} className="rounded-[0.8rem] border border-[#e6ece7] bg-[#eef3ef] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#173f33]">
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
                  className="border-b border-[#edf2ee] last:border-b-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fbfdfb] px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff8df] text-xs font-black text-[#9c6a18]">
                        {String(groupApplications.length).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">{viewMode === "student" ? "Applicant" : viewMode === "batch" ? "Batch" : "Date"}</p>
                        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                          <h4 className="truncate text-sm font-black text-[#173f33]">{viewMode === "date" ? formatDateGroup(groupLabel) : groupLabel}</h4>
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
                          <p className="mt-1 truncate text-xs font-semibold text-[#718477]">
                            Matching Aadhaar/phone, sorted by newest transaction
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleGroup(groupLabel)}
                      className="inline-flex items-center gap-2 rounded-[0.8rem] border border-[#e6ece7] bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#173f33]"
                      >
                        {isCollapsed ? <ChevronDown className="h-4 w-4" aria-hidden="true" /> : <ChevronUp className="h-4 w-4" aria-hidden="true" />}
                        {isCollapsed ? "Expand" : "Collapse"}
                      </button>
                    </div>
                  </div>

                  {!isCollapsed ? (
                    <div className="overflow-x-auto">
                      <div className="min-w-[62rem]">
                        <div className="grid grid-cols-[minmax(12rem,1.55fr)_minmax(11rem,1.25fr)_minmax(7rem,0.85fr)_minmax(9rem,1fr)_minmax(7rem,0.8fr)_minmax(7rem,0.85fr)_minmax(10rem,1.15fr)_minmax(8rem,0.7fr)] gap-3 border-b border-[#edf2ee] px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#718477]">
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
                              className={`grid grid-cols-[minmax(12rem,1.55fr)_minmax(11rem,1.25fr)_minmax(7rem,0.85fr)_minmax(9rem,1fr)_minmax(7rem,0.8fr)_minmax(7rem,0.85fr)_minmax(10rem,1.15fr)_minmax(8rem,0.7fr)] items-center gap-3 border-b border-[#edf2ee] px-4 py-3 text-left transition last:border-b-0 ${
                            isActive
                                  ? "bg-[#173f33] text-[#fff9ec]"
                                  : "bg-white text-[#173f33] hover:bg-[#fbf7ee]"
                          }`}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedApplicationId(application.id);
                            }
                          }}
                        >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-black">{application.payload.candidateName}</p>
                                <p className={`mt-1 truncate text-xs font-semibold ${isActive ? "text-[#d4e1d8]" : "text-[#718477]"}`}>Guardian: {application.payload.guardianName}</p>
                            </div>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-black uppercase tracking-[0.08em]">{application.payload.serviceName}</p>
                                <p className={`mt-1 truncate text-xs font-semibold ${isActive ? "text-[#d4e1d8]" : "text-[#718477]"}`}>{meta.batchNumber}</p>
                              </div>
                              <span className="truncate text-sm font-semibold">{application.payload.phone}</span>
                              <span className={`text-xs font-semibold ${isActive ? "text-[#d4e1d8]" : "text-[#718477]"}`}>{formatDateLabel(application.payload.submittedAt)}</span>
                              <StatusBadge status={application.payload.paymentStatus} active={isActive} />
                              <StatusBadge status="ENROLLED" active={isActive} />
                              <span className={`truncate text-xs font-black ${isActive ? "text-[#f5c65e]" : "text-[#9c6a18]"}`}>
                                {meta.studentCode ?? meta.applicationCode}
                              </span>
                              <span className="flex items-center justify-end gap-2">
                                <span
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openRosterPrint(application.payload.candidateName, [application]);
                                  }}
                                  className={`inline-flex items-center justify-center rounded-full px-2.5 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                                  isActive
                                    ? "bg-[rgba(255,255,255,0.14)] text-[#fff9ec] hover:bg-[rgba(255,255,255,0.2)]"
                                    : "bg-[#f5c65e] text-[#173f33] hover:bg-[#edba36]"
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
                                    ? "bg-[rgba(255,255,255,0.14)] text-[#fff9ec] hover:bg-[rgba(255,255,255,0.2)]"
                                    : "bg-[#173f33] text-[#fff9ec] hover:bg-[#204d3f]"
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
          disabled={loading || !canMutate}
          onClose={() => setProfileOpen(false)}
          onSave={updateApplication}
        />
      ) : null}
    </section>
  );
}

function groupApplicationsByStudentIdentity(applications: TrainingApplicationRecord[]) {
  const parent = new Map<string, string>();
  const identityOwner = new Map<string, string>();

  function find(id: string): string {
    const current = parent.get(id) ?? id;
    if (current === id) return current;
    const root = find(current);
    parent.set(id, root);
    return root;
  }

  function union(left: string, right: string) {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) parent.set(rightRoot, leftRoot);
  }

  for (const application of applications) {
    parent.set(application.id, application.id);
  }

  for (const application of applications) {
    for (const identity of getStudentIdentityKeys(application)) {
      const owner = identityOwner.get(identity);
      if (owner) {
        union(owner, application.id);
      } else {
        identityOwner.set(identity, application.id);
      }
    }
  }

  const groups = new Map<string, TrainingApplicationRecord[]>();
  for (const application of applications) {
    const root = find(application.id);
    groups.set(root, [...(groups.get(root) ?? []), application]);
  }

  return Array.from(groups.values())
    .map((groupApplications) => {
      const sorted = [...groupApplications].sort(
        (left, right) => getApplicationTimelineTime(right) - getApplicationTimelineTime(left),
      );
      const primary = sorted[0];
      const identitySummary = [
        primary.payload.aadhaarNo ? `Aadhaar ${maskValue(primary.payload.aadhaarNo, 4)}` : "",
        primary.payload.phone ? `Phone ${primary.payload.phone}` : "",
      ].filter(Boolean).join(" / ");
      const label = `${primary.payload.candidateName}${identitySummary ? ` - ${identitySummary}` : ""}`;

      return [label, sorted] as [string, TrainingApplicationRecord[]];
    })
    .sort(([, leftApplications], [, rightApplications]) =>
      getApplicationTimelineTime(rightApplications[0]) - getApplicationTimelineTime(leftApplications[0]),
    );
}

function getStudentIdentityKeys(application: TrainingApplicationRecord) {
  const aadhaar = application.payload.aadhaarNo.replace(/\D/g, "");
  const phone = application.payload.phone.replace(/\D/g, "");

  return [
    aadhaar.length >= 4 ? `aadhaar:${aadhaar}` : "",
    phone.length >= 6 ? `phone:${phone}` : "",
  ].filter(Boolean);
}

function getApplicationTimelineTime(application: TrainingApplicationRecord) {
  const paidAt = application.latestPayment?.paidAt ? new Date(application.latestPayment.paidAt).getTime() : NaN;
  if (Number.isFinite(paidAt)) return paidAt;

  const submittedAt = new Date(application.payload.submittedAt).getTime();
  if (Number.isFinite(submittedAt)) return submittedAt;

  return new Date(application.createdAt).getTime();
}

function maskValue(value: string, visibleDigits: number) {
  const normalized = value.replace(/\D/g, "");
  if (normalized.length <= visibleDigits) return normalized;
  return `${"*".repeat(Math.max(0, normalized.length - visibleDigits))}${normalized.slice(-visibleDigits)}`;
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

function ApplicationStatCard({
  label,
  value,
  hint,
  dot,
}: {
  label: string;
  value: number;
  hint: string;
  dot: string;
}) {
  return (
    <div className="bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-black leading-none text-[#173f33]">{value.toLocaleString("en-IN")}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            <p className="text-xs font-semibold text-[#607366]">{label}</p>
          </div>
        </div>
        <span className="rounded-full bg-[#eef3ef] px-2 py-1 text-[10px] font-black text-[#607366]">{hint}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status, active }: { status: string; active: boolean }) {
  const normalized = status.replaceAll("_", " ");
  const isGood = status === "PAID" || status === "ENROLLED" || status === "PAYMENT_COMPLETED";
  const isBad = status === "FAILED" || status === "PAYMENT_FAILED";

  if (active) {
    return (
      <span className="w-fit rounded-full bg-[rgba(255,255,255,0.14)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#fff9ec]">
        {normalized}
      </span>
    );
  }

  return (
    <span
      className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${
        isGood
          ? "bg-[#eef8f1] text-[#1f6b4b]"
          : isBad
            ? "bg-[#fff0ec] text-[#a74224]"
            : "bg-[#fff5e7] text-[#9c6a18]"
      }`}
    >
      {normalized}
    </span>
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
  const [attemptStatus] = useState<ApplicationAttemptStatus>(application.payload.attemptStatus);
  const [paymentStatus] = useState<ApplicationPaymentStatus>(application.payload.paymentStatus);
  const [adminNotes, setAdminNotes] = useState(application.payload.adminNotes);
  const [paymentReference] = useState(application.payload.paymentReference);
  const photoSrc = application.payload.photoUrl || application.payload.photoDataUrl;
  const previewMeta = getPreviewApplicationMeta(application);
  const paidAmount = application.latestPayment
    ? `Rs. ${(application.latestPayment.amountPaise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "Not captured";
  const identityRows = [
    ["Gender", application.payload.gender],
    ["Age", calculateAge(application.payload.dateOfBirth)],
    ["DOB", application.payload.dateOfBirth],
    ["Aadhaar", application.payload.aadhaarNo],
    ["Phone", application.payload.phone || "Not provided"],
    ["Email", application.payload.email || "Not provided"],
    ["Student ID", previewMeta.studentCode ?? "Not assigned yet"],
  ];
  const reportRows = [
    { label: "Application number", value: previewMeta.applicationCode ?? "Not assigned yet", meta: formatDateLabel(application.payload.submittedAt) },
    { label: "Payment sent", value: previewMeta.paymentSentDate, meta: application.payload.paymentStatus.replaceAll("_", " ") },
    { label: "Payment confirmed", value: previewMeta.paymentApprovedDate, meta: application.latestPayment?.status ?? paymentStatus },
  ];
  const transactionRows = [
    ["Invoice number", application.latestPayment?.invoiceNumber ?? "Not generated yet"],
    ["Merchant order", application.latestPayment?.merchantOrderId ?? "Not available"],
    ["Gateway reference", application.latestPayment?.paymentReference ?? (paymentReference || "Not provided")],
    ["Paid amount", paidAmount],
    ["Paid at", application.latestPayment?.paidAt ? formatDateLabel(application.latestPayment.paidAt) : "Captured by gateway"],
    ["Billing proof", "Handled by payment gateway flow"],
  ];
  const backgroundRows = [
    ["Program", application.payload.serviceName],
    ["Batch number", previewMeta.batchNumber],
    ["Education", application.payload.educationQualification || "Not provided"],
    ["Occupation", application.payload.occupation || "Not provided"],
    ["Sponsoring organization", application.payload.sponsoringOrganization || "Not provided"],
    ["Application date", application.payload.applicationDate],
  ];
  const contactRows = [
    ["Guardian", application.payload.guardianName],
    ["Residence", application.payload.residencePhone || "Not provided"],
    ["Address", `${application.payload.addressLine}, ${application.payload.mandal}, ${application.payload.district}, ${application.payload.state}, ${application.payload.pinCode}`],
    ["Files sent from student", previewMeta.studentFiles],
  ];

  return (
    <article className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[#f4f7f5] p-3 shadow-[0_18px_48px_rgba(64,44,8,0.08)] sm:p-4">
      <div className="grid gap-4 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="grid gap-4">
          <section className="rounded-[1.1rem] bg-white p-4 text-center shadow-[0_12px_28px_rgba(23,63,51,0.06)]">
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-[1.2rem] bg-[#d5f1ed]">
              {photoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoSrc} alt={`${application.payload.candidateName} photo`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#173f33]">
                  <UserRound className="h-10 w-10" aria-hidden="true" />
                </div>
              )}
            </div>
            <h3 className="mt-3 text-lg font-black text-[#173f33]">{application.payload.candidateName}</h3>
            <p className="mt-1 text-xs font-semibold text-[#607366]">Age: {calculateAge(application.payload.dateOfBirth)}</p>
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
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-[0.75rem] bg-[#35b985] px-5 py-2 text-xs font-black text-white shadow-[0_10px_18px_rgba(53,185,133,0.2)]"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              Print
            </button>
          </section>

          <section className="rounded-[1.1rem] bg-white p-4 shadow-[0_12px_28px_rgba(23,63,51,0.06)]">
            <h4 className="text-sm font-black text-[#173f33]">Information:</h4>
            <dl className="mt-3 grid gap-2">
              {identityRows.map(([label, value]) => (
                <DossierKeyValue key={label} label={label} value={value} />
              ))}
            </dl>
          </section>
        </aside>

        <div className="grid min-w-0 gap-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <DossierMetric icon={<BadgeCheck className="h-5 w-5" aria-hidden="true" />} label="Enrollment ID" value={previewMeta.studentCode ?? "Pending"} tone="green" />
            <DossierMetric icon={<CreditCard className="h-5 w-5" aria-hidden="true" />} label="Invoice" value={application.latestPayment?.invoiceNumber ?? "Pending"} tone="gold" />
            <DossierMetric icon={<WalletCards className="h-5 w-5" aria-hidden="true" />} label="Amount paid" value={paidAmount} tone="teal" />
            <DossierMetric icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />} label="Batch" value={previewMeta.batchNumber} tone="rose" />
          </div>

          <section className="rounded-[1.1rem] bg-white p-4 shadow-[0_12px_28px_rgba(23,63,51,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9c6a18]">{application.payload.serviceName}</p>
                <h3 className="font-display mt-1 text-2xl font-semibold text-[#173f33]">{application.payload.candidateName}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill icon={<FileClock className="h-4 w-4" aria-hidden="true" />} label={attemptStatus} />
                <StatusPill icon={<CreditCard className="h-4 w-4" aria-hidden="true" />} label={paymentStatus} />
                <StatusPill icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />} label="ENROLLED" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {reportRows.map((row) => (
                <DossierReportCard key={row.label} icon={<FileClock className="h-4 w-4" aria-hidden="true" />} label={row.label} value={row.value} meta={row.meta} />
              ))}
            </div>
          </section>

          <section className="rounded-[1.1rem] bg-white p-4 shadow-[0_12px_28px_rgba(23,63,51,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-black text-[#173f33]">Transactions</h4>
              <span className="rounded-full bg-[#eef8f1] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#21533f]">
                Gateway records
              </span>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {transactionRows.map(([label, value]) => (
                <DossierKeyValue key={label} label={label} value={value} boxed />
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <DossierPanel title="Training Details" rows={backgroundRows} />
            <DossierPanel title="Contact & Files" rows={contactRows} />
          </section>

          <section className="rounded-[1.1rem] bg-white p-4 shadow-[0_12px_28px_rgba(23,63,51,0.06)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-black text-[#173f33]">Admin notes</h4>
              <button
                disabled={disabled}
                onClick={() => onSave(application.id, { attemptStatus, paymentStatus, approvalStatus: "APPROVED", crossCheckStatus: "VERIFIED", adminNotes, paymentReference })}
                className="inline-flex items-center justify-center rounded-full bg-[#173f33] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#fff9ec] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save note
              </button>
            </div>
            <textarea
              rows={5}
              value={adminNotes}
              onChange={(event) => setAdminNotes(event.target.value)}
              placeholder="Internal note for this enrolled student..."
              className="w-full rounded-[1rem] border border-dashed border-[#dbe5de] bg-[#fbfdfb] px-4 py-3 text-sm font-medium text-[#173f33] outline-none ring-[#35b985] placeholder:text-[#8ca091] focus:ring-2"
            />
          </section>
        </div>
      </div>
    </article>
  );
}

function DossierMetric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "green" | "gold" | "teal" | "rose";
}) {
  const toneClass = {
    green: "bg-[#e8f8ef] text-[#35b985]",
    gold: "bg-[#fff6df] text-[#d99a1e]",
    teal: "bg-[#e7f5f4] text-[#077b76]",
    rose: "bg-[#fff0ed] text-[#d26955]",
  }[tone];

  return (
    <div className="min-h-[7.25rem] rounded-[1.1rem] bg-white p-4 text-center shadow-[0_12px_28px_rgba(23,63,51,0.06)]">
      <span className={`mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full ${toneClass}`}>
        {icon}
      </span>
      <p className="mt-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#718477]">{label}</p>
      <p className="mt-1 break-words text-lg font-black leading-tight text-[#173f33]">{value}</p>
    </div>
  );
}

function DossierReportCard({
  icon,
  label,
  value,
  meta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  meta: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[0.95rem] border border-[#eef2ef] bg-[#fbfdfb] p-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] bg-[#eef8f1] text-[#35b985]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-black text-[#173f33]">{label}</span>
        <span className="mt-1 block truncate text-[11px] font-semibold text-[#607366]">{value}</span>
        <span className="mt-0.5 block truncate text-[10px] font-semibold text-[#9aa99d]">{meta}</span>
      </span>
    </div>
  );
}

function DossierKeyValue({ label, value, boxed = false }: { label: string; value: string; boxed?: boolean }) {
  return (
    <div className={boxed ? "rounded-[0.85rem] bg-[#fbf7ee] px-3 py-2" : "grid grid-cols-[5.6rem_minmax(0,1fr)] gap-2"}>
      <span className="text-xs font-black text-[#173f33]">{label}:</span>
      <span className="break-words text-xs font-semibold leading-5 text-[#607366]">{value}</span>
    </div>
  );
}

function DossierPanel({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className="rounded-[1.1rem] bg-white p-4 shadow-[0_12px_28px_rgba(23,63,51,0.06)]">
      <h4 className="text-sm font-black text-[#173f33]">{title}</h4>
      <dl className="mt-3 grid gap-2">
        {rows.map(([label, value]) => (
          <DossierKeyValue key={label} label={label} value={value} />
        ))}
      </dl>
    </section>
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
