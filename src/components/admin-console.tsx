"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  BookOpenText,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FolderKanban,
  History,
  LogOut,
  Menu,
  Power,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import { ApplicationAdminPanel } from "@/components/application-admin-panel";
import { getPresignedUploadUrlAction } from "@/app/actions/storage";
import type { TrainingApplicationRecord } from "@/lib/training-application";

type Program = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  duration: string;
  level: "FOUNDATION" | "ADVANCED" | "PROFESSIONAL";
  fee?: string | null;
  capacity: number;
  batchStartsAt?: string | null;
  enrollmentClosed: boolean;
  popupEnabled: boolean;
  published: boolean;
  updatedAt?: string;
};

type EventItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt?: string | null;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  published: boolean;
  updatedAt?: string;
};

type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  mediaUrl: string;
  mediaObjectKey: string;
  mediaType: "IMAGE" | "VIDEO" | "ARTICLE_ASSET" | null;
  externalLink: string;
  keyPoints: string;
  seoTitle: string;
  metaDescription: string;
  published: boolean;
};

type Props = {
  databaseConfigured: boolean;
  initialApplications: TrainingApplicationRecord[];
  initialPrograms: Program[];
  initialArticles: ArticleItem[];
  initialEvents: EventItem[];
};

type DashboardView = "programs" | "events" | "applications" | "articles";
type HistorySection = "overview" | DashboardView;

type HistoryEntry = {
  id: string;
  section: HistorySection;
  action: string;
  label: string;
  timestamp: string;
  details?: string;
};

type PublishSchedule = {
  id: string;
  section: HistorySection;
  label: string;
  publishAt: string;
  published: boolean;
  publishedAt?: string;
};

type NotificationItem = {
  id: string;
  section: HistorySection;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  variant: "success" | "warning" | "alert";
};

const emptyProgram: Omit<Program, "id"> = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  duration: "",
  level: "FOUNDATION",
  fee: "",
  capacity: 30,
  batchStartsAt: "",
  enrollmentClosed: false,
  popupEnabled: true,
  published: true,
};

const emptyEvent: Omit<EventItem, "id"> = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  location: "API CULTURE, Rajendranagar, Hyderabad",
  startsAt: "",
  endsAt: "",
  status: "UPCOMING",
  published: true,
};

const emptyArticle: Omit<ArticleItem, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  category: "",
  publishedAt: new Date().toISOString().slice(0, 16),
  authorName: "",
  authorRole: "",
  mediaUrl: "",
  mediaObjectKey: "",
  mediaType: null,
  externalLink: "",
  keyPoints: "",
  seoTitle: "",
  metaDescription: "",
  published: true,
};

const HISTORY_STORAGE_KEY = "api-culture-admin-history";
const SCHEDULE_STORAGE_KEY = "api-culture-admin-schedules";
const NOTIFICATION_STORAGE_KEY = "api-culture-admin-notifications";
const HISTORY_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

function readStoredHistory() {
  if (typeof window === "undefined") return [];

  const now = Date.now();
  const savedHistory = JSON.parse(window.localStorage.getItem(HISTORY_STORAGE_KEY) ?? "[]") as HistoryEntry[];
  return savedHistory.filter((entry) => now - new Date(entry.timestamp).getTime() <= HISTORY_RETENTION_MS);
}

function readStoredSchedules() {
  if (typeof window === "undefined") return [];
  return JSON.parse(window.localStorage.getItem(SCHEDULE_STORAGE_KEY) ?? "[]") as PublishSchedule[];
}

function readStoredNotifications() {
  if (typeof window === "undefined") return [];
  return JSON.parse(window.localStorage.getItem(NOTIFICATION_STORAGE_KEY) ?? "[]") as NotificationItem[];
}

export function AdminConsole({
  databaseConfigured,
  initialApplications,
  initialPrograms,
  initialArticles,
  initialEvents,
}: Props) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [programDraft, setProgramDraft] = useState(emptyProgram);
  const [eventDraft, setEventDraft] = useState(emptyEvent);
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [articleDraft, setArticleDraft] = useState<Omit<ArticleItem, "id">>(emptyArticle);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<DashboardView>("programs");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>(readStoredHistory);
  const [schedules, setSchedules] = useState<PublishSchedule[]>(readStoredSchedules);
  const [activeHistorySection, setActiveHistorySection] = useState<HistorySection | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(readStoredNotifications);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [readSystemNotificationIds, setReadSystemNotificationIds] = useState<string[]>([]);
  const [dismissedSystemNotificationIds, setDismissedSystemNotificationIds] = useState<string[]>([]);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement | null>(null);

  const applicationSummary = useMemo(() => {
    const ready = initialApplications.filter(
      (application) =>
        application.payload.crossCheckStatus === "VERIFIED" &&
        application.payload.paymentStatus === "PAID" &&
        application.payload.approvalStatus === "PENDING",
    ).length;

    return {
      total: initialApplications.length,
      pendingReview: initialApplications.length - initialApplications.filter((application) => application.payload.approvalStatus === "APPROVED").length,
      approved: initialApplications.filter((application) => application.payload.approvalStatus === "APPROVED").length,
      ready,
    };
  }, [initialApplications]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyEntries));
  }, [historyEntries]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!notificationPanelRef.current?.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    }

    if (notificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationOpen]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();

      setHistoryEntries((current) =>
        current.filter((entry) => now - new Date(entry.timestamp).getTime() <= HISTORY_RETENTION_MS),
      );

      setSchedules((current) => {
        const dueSchedules = current.filter((schedule) => !schedule.published && new Date(schedule.publishAt).getTime() <= now);
        if (!dueSchedules.length) return current;

        dueSchedules.forEach((schedule) => {
          appendHistory(schedule.section, "Scheduled publish", schedule.label, `Published automatically at ${formatDateTime(schedule.publishAt)}`);
          pushNotification({
            section: schedule.section,
            title: `${schedule.label} posted successfully`,
            message: `Scheduled content was published automatically at ${formatDateTime(schedule.publishAt)}.`,
            variant: "success",
          });
        });

        return current.map((schedule) =>
          dueSchedules.some((due) => due.id === schedule.id)
            ? { ...schedule, published: true, publishedAt: new Date().toISOString() }
            : schedule,
        );
      });
    }, 30_000);

    return () => window.clearInterval(timer);
  }, []);

  const viewItems: { id: DashboardView; label: string; description: string; icon: ReactNode }[] = [
    { id: "programs", label: "Training", description: "Training catalog", icon: <FolderKanban className="h-4 w-4" aria-hidden="true" /> },
    { id: "events", label: "Events", description: "Schedule control", icon: <CalendarDays className="h-4 w-4" aria-hidden="true" /> },
    { id: "applications", label: "Applications", description: "Admissions desk", icon: <UsersRound className="h-4 w-4" aria-hidden="true" /> },
    { id: "articles", label: "Articles", description: "Content publishing", icon: <BookOpenText className="h-4 w-4" aria-hidden="true" /> },
  ];

  const systemNotifications = useMemo(() => {
    const liveNotifications: NotificationItem[] = [];

    if (applicationSummary.ready > 0) {
      liveNotifications.push({
        id: "system-pending-approvals",
        section: "applications",
        title: "Pending approvals need attention",
        message: `${applicationSummary.ready} learner${applicationSummary.ready === 1 ? "" : "s"} are waiting for final approval in Applications.`,
        timestamp: new Date().toISOString(),
        read: readSystemNotificationIds.includes("system-pending-approvals"),
        variant: "warning",
      });
    }

    if (!databaseConfigured) {
      liveNotifications.push({
        id: "system-local-preview",
        section: "overview",
        title: "System alert: local preview is read-only",
        message: "DATABASE_URL is not configured locally, so save actions stay disabled until deployment setup is ready.",
        timestamp: new Date().toISOString(),
        read: readSystemNotificationIds.includes("system-local-preview"),
        variant: "alert",
      });
    }

    return liveNotifications.filter((notification) => !dismissedSystemNotificationIds.includes(notification.id));
  }, [applicationSummary.ready, databaseConfigured, dismissedSystemNotificationIds, readSystemNotificationIds]);

  const allNotifications = useMemo(
    () =>
      [...systemNotifications, ...notifications].sort(
        (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
      ),
    [notifications, systemNotifications],
  );

  const unreadNotifications = allNotifications.filter((notification) => !notification.read).length;

  function pushNotification(input: Omit<NotificationItem, "id" | "timestamp" | "read">) {
    setNotifications((current) => [
      {
        ...input,
        id: `${input.section}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...current,
    ].slice(0, 40));
  }

  function appendHistory(section: HistorySection, action: string, label: string, details?: string) {
    setHistoryEntries((current) => [
      {
        id: `${section}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        section,
        action,
        label,
        timestamp: new Date().toISOString(),
        details,
      },
      ...current,
    ]);
  }

  function saveSchedule(section: HistorySection, label: string, publishAt: string) {
    if (!publishAt) {
      setNotice("Choose a publish time to schedule this section.");
      return;
    }

    setSchedules((current) => [
      {
        id: `${section}-${Date.now()}`,
        section,
        label,
        publishAt,
        published: false,
      },
      ...current,
    ]);
    appendHistory(section, "Schedule created", label, `Scheduled for ${formatDateTime(publishAt)}`);
    pushNotification({
      section,
      title: `${label} scheduled successfully`,
      message: `Scheduled for ${formatDateTime(publishAt)}.`,
      variant: "success",
    });
    setNotice(`${label} scheduled for ${formatDateTime(publishAt)}.`);
  }

  const sectionSchedules = useMemo(
    () =>
      schedules.reduce<Record<HistorySection, PublishSchedule[]>>(
        (accumulator, schedule) => {
          accumulator[schedule.section].push(schedule);
          return accumulator;
        },
        { overview: [], programs: [], events: [], applications: [], articles: [] },
      ),
    [schedules],
  );

  async function load() {
    if (!databaseConfigured) {
      setNotice("Local preview is running without DATABASE_URL. You can review the layout, but save actions stay disabled until a database is connected.");
      return;
    }

    setLoading(true);
    setNotice("");
    try {
      const [programResponse, eventResponse, articleResponse] = await Promise.all([
        fetch("/api/admin/programs"),
        fetch("/api/admin/events"),
        fetch("/api/admin/articles"),
      ]);
      if (programResponse.status === 401 || eventResponse.status === 401 || articleResponse.status === 401) {
        window.location.assign("/admin/login");
        return;
      }
      if (!programResponse.ok || !eventResponse.ok || !articleResponse.ok) {
        setNotice("Unable to refresh the dashboard right now.");
        return;
      }
      setPrograms(await programResponse.json());
      setEvents(await eventResponse.json());
      setArticles(await articleResponse.json());
      appendHistory("overview", "Refresh", "Dashboard data refreshed");
      pushNotification({
        section: "overview",
        title: "Dashboard refreshed",
        message: "Programs, events, and articles were refreshed successfully.",
        variant: "success",
      });
      setNotice("Dashboard refreshed.");
    } catch {
      setNotice("Unable to refresh the dashboard right now.");
    } finally {
      setLoading(false);
    }
  }

  async function mutate(url: string, method: string, body?: unknown) {
    if (!databaseConfigured) {
      setNotice("Local preview is in read-only mode because DATABASE_URL is not configured yet.");
      return false;
    }

    setLoading(true);
    setNotice("");
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setNotice(data?.error ?? "Request failed.");
        return false;
      }
      setNotice("Changes saved successfully.");
      await load();
      return true;
    } catch {
      setNotice("Request failed.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function saveArticleDraft() {
    void (async () => {
      const ok = await mutate("/api/admin/articles", "POST", articleDraft);
      if (ok) {
        appendHistory("articles", "Create article", articleDraft.title || "Untitled article", "Article created.");
        pushNotification({
          section: "articles",
          title: "Article saved",
          message: `${articleDraft.title || "Untitled article"} was created successfully.`,
          variant: "success",
        });
        setArticleDraft(emptyArticle);
      }
    })();
  }

  function updateArticle(id: string, next: ArticleItem) {
    void (async () => {
      const ok = await mutate(`/api/admin/articles/${id}`, "PATCH", next);
      if (ok) {
        appendHistory("articles", "Update article", next.title, "Article details were updated.");
        pushNotification({
          section: "articles",
          title: "Article updated",
          message: `${next.title} was updated successfully.`,
          variant: "success",
        });
      }
    })();
  }

  function deleteArticle(id: string) {
    void (async () => {
      const article = articles.find((item) => item.id === id);
      const ok = await mutate(`/api/admin/articles/${id}`, "DELETE");
      if (ok) {
        appendHistory("articles", "Delete article", article?.title ?? "Article", "Article removed.");
        pushNotification({
          section: "articles",
          title: "Article removed",
          message: `${article?.title ?? "Article"} was deleted from the dashboard.`,
          variant: "warning",
        });
      }
    })();
  }

  async function createProgram() {
    const ok = await mutate("/api/admin/programs", "POST", programDraft);
    if (ok) {
      appendHistory("programs", "Create training", programDraft.title || "Untitled training", "Training service created.");
      pushNotification({
        section: "programs",
        title: "Training service posted",
        message: `${programDraft.title || "Untitled training"} was created successfully.`,
        variant: "success",
      });
      setProgramDraft(emptyProgram);
    }
  }

  async function saveProgram(program: Program) {
    const ok = await mutate(`/api/admin/programs/${program.id}`, "PATCH", program);
    if (ok) {
      appendHistory("programs", "Update training", program.title || "Untitled training", "Training service updated.");
      pushNotification({
        section: "programs",
        title: "Training service updated",
        message: `${program.title || "Untitled training"} was updated successfully.`,
        variant: "success",
      });
    }
  }

  async function removeProgram(id: string) {
    const currentProgram = programs.find((program) => program.id === id);
    const ok = await mutate(`/api/admin/programs/${id}`, "DELETE");
    if (ok) {
      appendHistory("programs", "Delete training", currentProgram?.title ?? "Training", "Training service deleted.");
      pushNotification({
        section: "programs",
        title: "Training service removed",
        message: `${currentProgram?.title ?? "Training"} was deleted from the dashboard.`,
        variant: "warning",
      });
    }
  }

  async function createEvent() {
    const ok = await mutate("/api/admin/events", "POST", eventDraft);
    if (ok) {
      appendHistory("events", "Create event", eventDraft.title || "Untitled event", "Event record created.");
      pushNotification({
        section: "events",
        title: "Event posted",
        message: `${eventDraft.title || "Untitled event"} was created successfully.`,
        variant: "success",
      });
      setEventDraft(emptyEvent);
    }
  }

  async function saveEvent(event: EventItem) {
    const ok = await mutate(`/api/admin/events/${event.id}`, "PATCH", event);
    if (ok) {
      appendHistory("events", "Update event", event.title || "Untitled event", "Event record updated.");
      pushNotification({
        section: "events",
        title: "Event updated",
        message: `${event.title || "Untitled event"} was updated successfully.`,
        variant: "success",
      });
    }
  }

  async function removeEvent(id: string) {
    const currentEvent = events.find((event) => event.id === id);
    const ok = await mutate(`/api/admin/events/${id}`, "DELETE");
    if (ok) {
      appendHistory("events", "Delete event", currentEvent?.title ?? "Event", "Event record deleted.");
      pushNotification({
        section: "events",
        title: "Event removed",
        message: `${currentEvent?.title ?? "Event"} was deleted from the dashboard.`,
        variant: "warning",
      });
    }
  }

  function markNotificationRead(id: string) {
    if (id.startsWith("system-")) {
      setReadSystemNotificationIds((current) => (current.includes(id) ? current : [...current, id]));
      return;
    }

    setNotifications((current) =>
      current.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    );
  }

  function clearNotifications() {
    setNotifications([]);
    setDismissedSystemNotificationIds((current) => [
      ...new Set([...current, ...systemNotifications.map((notification) => notification.id)]),
    ]);
  }

  return (
    <div className="mx-auto max-w-[96rem] px-4 py-6 sm:px-6 lg:px-8">
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black uppercase tracking-[0.14em] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)]"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          Dashboard menu
        </button>
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-[rgba(23,63,51,0.28)] lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div
            className="h-full w-[20rem] max-w-[86vw] bg-[#173f33] p-5 text-[#fff9ec] shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLogoutDialogOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,249,236,0.18)] bg-[rgba(255,255,255,0.08)] text-[#fff9ec]"
                  aria-label="Open logout confirmation"
                >
                  <Power className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#f5c65e]">Admin navigation</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-full border border-[rgba(255,249,236,0.18)] p-2 text-[#fff9ec]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-5 grid gap-3">
              {viewItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left transition ${
                    view === item.id
                      ? "bg-[#fff9ec] text-[#173f33]"
                      : "border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.06)] text-[#fff9ec]"
                  }`}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(245,198,94,0.16)]">
                    {item.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-black uppercase tracking-[0.16em]">{item.label}</span>
                    <span className={`mt-1 block text-sm ${view === item.id ? "text-[#607366]" : "text-[#d7e1db]"}`}>{item.description}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      <div
        className={`mt-4 grid gap-6 lg:mt-0 ${
          sidebarCollapsed
            ? "lg:grid-cols-[6rem_minmax(0,1fr)]"
            : "lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]"
        }`}
      >
        <aside className={`relative hidden lg:block ${sidebarCollapsed ? "w-[6rem]" : ""}`}>
          <button
            onClick={() => setSidebarCollapsed((current) => !current)}
            className="absolute -right-4 top-10 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(23,63,51,0.12)] bg-[#fffdf8] text-[#173f33] shadow-[0_12px_28px_rgba(64,44,8,0.12)]"
            aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : <ChevronLeft className="h-4 w-4" aria-hidden="true" />}
          </button>
          <div className="sticky top-24 rounded-[2rem] bg-[#173f33] p-5 text-[#fff9ec] shadow-[0_24px_60px_rgba(23,63,51,0.2)]">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLogoutDialogOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,249,236,0.18)] bg-[rgba(255,255,255,0.08)] text-[#fff9ec]"
                  aria-label="Open logout confirmation"
                >
                  <Power className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#f5c65e]">Admin navigation</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setLogoutDialogOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(245,198,94,0.14)] text-[#f5c65e]"
                  aria-label="Open logout confirmation"
                >
                  <Power className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}

            <nav className="mt-5 grid gap-3">
              {viewItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-4"} rounded-[1.2rem] py-3 text-left transition ${
                    view === item.id
                      ? "bg-[#fff9ec] text-[#173f33]"
                      : "border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.06)] text-[#fff9ec] hover:bg-[rgba(255,255,255,0.1)]"
                  }`}
                  title={item.label}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(245,198,94,0.16)]">
                    {item.icon}
                  </span>
                  {!sidebarCollapsed ? (
                    <span>
                      <span className="block text-sm font-black uppercase tracking-[0.16em]">{item.label}</span>
                      <span className={`mt-1 block text-sm ${view === item.id ? "text-[#607366]" : "text-[#d7e1db]"}`}>{item.description}</span>
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="grid gap-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <TopStatusChip
                label="Pending review"
                value={applicationSummary.pendingReview}
                detail="Applicants in review flow"
                tone="warm"
              />
              <TopStatusChip
                label="Ready to approve"
                value={applicationSummary.ready}
                detail="Verified and ready"
                tone="forest"
              />
              <TopStatusChip
                label="Approved learners"
                value={applicationSummary.approved}
                detail="Cleared to join"
                tone="gold"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 xl:flex-nowrap">
              <button
                disabled={loading}
                onClick={load}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(23,63,51,0.12)] bg-[#fffdf8] text-[#173f33] shadow-[0_14px_30px_rgba(64,44,8,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Refresh data"
              >
                <RefreshCw className={`h-5 w-5${loading ? " animate-spin" : ""}`} aria-hidden="true" />
              </button>

              <div className="relative" ref={notificationPanelRef}>
                <button
                  onClick={() => setNotificationOpen((current) => !current)}
                  className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(23,63,51,0.12)] bg-[#fffdf8] text-[#173f33] shadow-[0_14px_30px_rgba(64,44,8,0.08)]"
                  aria-label="Open notifications"
                  aria-expanded={notificationOpen}
                >
                  <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f1e7]">
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    {unreadNotifications ? (
                      <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[#d12e2e] px-1.5 py-0.5 text-[10px] font-black text-white">
                        {unreadNotifications}
                      </span>
                    ) : null}
                  </span>
                </button>

                {notificationOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[24rem] overflow-hidden rounded-[1.6rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] shadow-[0_24px_50px_rgba(64,44,8,0.16)]">
                    <div className="flex items-center justify-between gap-3 border-b border-[rgba(27,59,43,0.08)] px-4 py-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9c6a18]">Admin notifications</p>
                        <p className="mt-1 text-sm font-semibold text-[#607366]">{unreadNotifications} unread</p>
                      </div>
                      <button
                        onClick={clearNotifications}
                        className="rounded-full bg-[#f3ecdf] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#173f33]"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="max-h-[26rem] overflow-y-auto p-3">
                      {allNotifications.length ? (
                        <div className="grid gap-3">
                          {allNotifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => markNotificationRead(notification.id)}
                              className={`rounded-[1.2rem] border p-4 text-left transition ${
                                notification.read
                                  ? "border-[rgba(27,59,43,0.08)] bg-[#f7f4ed]"
                                  : "border-[rgba(28,95,212,0.16)] bg-[rgba(214,230,255,0.55)]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-black text-[#173f33]">{notification.title}</p>
                                  <p className="mt-2 text-sm leading-6 text-[#607366]">{notification.message}</p>
                                </div>
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                                    notification.variant === "success"
                                      ? "bg-[#eef8f1] text-[#21533f]"
                                      : notification.variant === "warning"
                                        ? "bg-[#fff5ea] text-[#8c4d1e]"
                                        : "bg-[#fff0ea] text-[#99462d]"
                                  }`}
                                >
                                  {notification.section}
                                </span>
                              </div>
                              <p className="mt-3 text-xs font-semibold text-[#7a8b80]">{timeAgo(notification.timestamp)}</p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-[1.2rem] border border-dashed border-[rgba(27,59,43,0.12)] bg-[#faf7ef] px-4 py-8 text-center text-sm font-semibold text-[#607366]">
                          No critical notifications right now.
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {notice ? (
            <div className="rounded-[1.5rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-5 py-4 text-sm font-semibold text-[#173f33] shadow-[0_14px_30px_rgba(64,44,8,0.06)]">
              {notice}
            </div>
          ) : null}

      {view === "programs" ? (
        <DashboardSection
          section="programs"
          eyebrow="Training manager"
          title="Manage training services"
          schedules={sectionSchedules.programs}
          onOpenHistory={() => setActiveHistorySection("programs")}
          onSchedule={(publishAt) => saveSchedule("programs", "Training manager", publishAt)}
          className="mt-8"
        >
          <ProgramsWorkspace
            databaseConfigured={databaseConfigured}
            disabled={loading || !databaseConfigured}
            programs={programs}
            draft={programDraft}
            onDraftChange={setProgramDraft}
            onDraftSave={createProgram}
            onProgramSave={saveProgram}
            onProgramDelete={removeProgram}
          />
        </DashboardSection>
      ) : null}

      {view === "events" ? (
        <DashboardSection
          section="events"
          eyebrow="Event planner"
          title="Schedule orientations and field sessions"
          schedules={sectionSchedules.events}
          onOpenHistory={() => setActiveHistorySection("events")}
          onSchedule={(publishAt) => saveSchedule("events", "Event planner", publishAt)}
          className="mt-8"
        >
          <div className="grid gap-6 xl:grid-cols-[370px_minmax(0,1fr)]">
            <TaskLane
              eyebrow="New event"
              title="Create event listing"
              description="This section is only for adding new event or orientation records."
            >
              <EditorPanel
                disabled={loading || !databaseConfigured}
                title="New event"
                description="Build a publish-ready event with timing, location, and public summary."
                actionLabel="Create event"
                onSave={createEvent}
              >
                <EventFields value={eventDraft} onChange={setEventDraft} />
              </EditorPanel>
            </TaskLane>
            <TaskLane
              eyebrow="Event actions"
              title="Edit or remove events"
              description="All event corrections, publishing changes, and deletions stay together here."
            >
              <div className="grid gap-4">
                {events.map((event) => (
                  <EventRow
                    key={`${event.id}-${event.updatedAt ?? ""}`}
                    disabled={loading || !databaseConfigured}
                    event={event}
                    onSave={saveEvent}
                    onDelete={() => removeEvent(event.id)}
                  />
                ))}
              </div>
            </TaskLane>
          </div>
        </DashboardSection>
      ) : null}

      {view === "applications" ? (
        <DashboardSection
          section="applications"
          eyebrow="Admissions desk"
          title="Review and approve learners"
          schedules={sectionSchedules.applications}
          onOpenHistory={() => setActiveHistorySection("applications")}
          onSchedule={(publishAt) => saveSchedule("applications", "Admissions desk", publishAt)}
          className="mt-8"
        >
          <ApplicationAdminPanel databaseConfigured={databaseConfigured} initialApplications={initialApplications} />
        </DashboardSection>
      ) : null}

      {view === "articles" ? (
        <DashboardSection
          section="articles"
          eyebrow="Article manager"
          title="Manage Articles"
          schedules={sectionSchedules.articles}
          onOpenHistory={() => setActiveHistorySection("articles")}
          onSchedule={(publishAt) => saveSchedule("articles", "Article manager", publishAt)}
          className="mt-8"
        >
          <ArticlesWorkspace
            articles={articles}
            draft={articleDraft}
            onDraftChange={setArticleDraft}
            onDraftSave={saveArticleDraft}
            onArticleSave={updateArticle}
            onArticleDelete={deleteArticle}
          />
        </DashboardSection>
      ) : null}
        </div>
      </div>

      {activeHistorySection ? (
        <HistoryDrawer
          section={activeHistorySection}
          entries={historyEntries.filter((entry) => entry.section === activeHistorySection)}
          schedules={sectionSchedules[activeHistorySection]}
          onClose={() => setActiveHistorySection(null)}
        />
      ) : null}

      {logoutDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(16,33,27,0.38)] p-4">
          <div className="w-full max-w-md rounded-[1.9rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-6 shadow-[0_28px_60px_rgba(16,33,27,0.24)]">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#9c6a18]">Logout confirmation</p>
            <h3 className="font-display mt-3 text-3xl font-semibold text-[#173f33]">Leave the command deck?</h3>
            <p className="mt-3 text-sm leading-7 text-[#607366]">
              This extra step helps avoid accidental logout clicks while you are working in the admin dashboard.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setLogoutDialogOpen(false)}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-[rgba(23,63,51,0.12)] bg-[#f7f4ed] px-4 py-3 text-sm font-black text-[#173f33]"
              >
                Stay here
              </button>
              <form
                action="/api/admin/logout"
                method="post"
                onSubmit={() => appendHistory("overview", "Logout", "Admin session ended")}
                className="flex-1"
              >
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-3 text-sm font-black text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)]"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Logout now
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DashboardSection({
  section,
  eyebrow,
  title,
  schedules,
  onOpenHistory,
  onSchedule,
  className = "",
  children,
}: {
  section: HistorySection;
  eyebrow: string;
  title: string;
  schedules: PublishSchedule[];
  onOpenHistory: () => void;
  onSchedule: (publishAt: string) => void;
  className?: string;
  children: ReactNode;
}) {
  const [scheduleAt, setScheduleAt] = useState("");

  return (
    <section className={`rounded-[2rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(246,239,228,0.98))] p-6 shadow-[0_24px_60px_rgba(64,44,8,0.08)] ${className}`}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_27rem] xl:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9c6a18]">{eyebrow}</p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-[#173f33]">{title}</h2>
        </div>
        <div className="min-w-[18rem] rounded-[1.35rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-3 shadow-[0_10px_24px_rgba(64,44,8,0.06)] xl:ml-auto xl:w-full">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onOpenHistory}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(23,63,51,0.12)] bg-[#f8f4ea] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#173f33]"
            >
              <History className="h-4 w-4" aria-hidden="true" />
              History
            </button>
            <span className="rounded-full bg-[#eef8f1] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#21533f]">
              {schedules.filter((schedule) => !schedule.published).length} scheduled
            </span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input
              type="datetime-local"
              className={fieldClass()}
              value={scheduleAt}
              onChange={(event) => setScheduleAt(event.target.value)}
            />
            <button
              onClick={() => {
                onSchedule(scheduleAt);
                setScheduleAt("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#fff9ec]"
            >
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              Schedule
            </button>
          </div>
          {schedules.length ? (
            <p className="mt-3 text-xs leading-6 text-[#607366]">
              Next timer for {section}: {formatDateTime(schedules.filter((schedule) => !schedule.published)[0]?.publishAt ?? schedules[0]?.publishAt)}
            </p>
          ) : (
            <p className="mt-3 text-xs leading-6 text-[#607366]">No timer is set for this section yet.</p>
          )}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function EditorPanel({
  title,
  description,
  children,
  onSave,
  actionLabel,
  disabled,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onSave: () => void;
  actionLabel: string;
  disabled: boolean;
}) {
  return (
    <div className="h-fit rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
      <h3 className="font-display text-2xl font-semibold text-[#173f33]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#607366]">{description}</p>
      <div className="mt-5 grid gap-3">{children}</div>
      <button
        disabled={disabled}
        onClick={onSave}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-3 text-sm font-black text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)] transition hover:bg-[#204d3f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {actionLabel}
      </button>
    </div>
  );
}

function TaskLane({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.44)] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#9c6a18]">{eyebrow}</p>
      <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#607366]">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ArticlesWorkspace({
  articles,
  draft,
  onDraftChange,
  onDraftSave,
  onArticleSave,
  onArticleDelete,
}: {
  articles: ArticleItem[];
  draft: Omit<ArticleItem, "id">;
  onDraftChange: (next: Omit<ArticleItem, "id">) => void;
  onDraftSave: () => void;
  onArticleSave: (id: string, next: ArticleItem) => void;
  onArticleDelete: (id: string) => void;
}) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | "new">(articles[0]?.id ?? "new");
  const selectedArticle =
    selectedArticleId === "new"
      ? null
      : articles.find((article) => article.id === selectedArticleId) ?? articles[0] ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.52)] p-4">
        <div className="rounded-[1.5rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(64,44,8,0.06)]">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#9c6a18]">Article actions</p>
          <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">Article index</h3>
          <p className="mt-2 text-sm leading-7 text-[#607366]">Use the index to open one article at a time, or start a new one from the top.</p>
          <button
            onClick={() => setSelectedArticleId("new")}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black transition ${
              selectedArticleId === "new"
                ? "bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)]"
                : "bg-[#f5c65e] text-[#173f33]"
            }`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New article
          </button>
        </div>

        <div className="mt-4 rounded-[1.5rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(64,44,8,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9c6a18]">Existing articles</p>
            <div className="rounded-full bg-[#f6efe4] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#607366]">
              {articles.length}
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {articles.map((article, index) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className={`rounded-[1.3rem] border px-4 py-4 text-left transition ${
                  selectedArticleId === article.id
                    ? "border-[rgba(23,63,51,0.18)] bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.14)]"
                    : "border-[rgba(27,59,43,0.08)] bg-[#faf7ef] text-[#173f33] hover:bg-[#f3ecdf]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${selectedArticleId === article.id ? "bg-[rgba(255,255,255,0.14)] text-[#f5c65e]" : "bg-[#fffdf8] text-[#9c6a18]"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${article.published ? selectedArticleId === article.id ? "bg-[rgba(255,255,255,0.14)] text-[#e4f6ea]" : "bg-[#eef8f1] text-[#21533f]" : selectedArticleId === article.id ? "bg-[rgba(255,255,255,0.14)] text-[#fff2d7]" : "bg-[#fff5ea] text-[#8c4d1e]"}`}>
                    {article.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-black uppercase tracking-[0.12em]">{article.title}</p>
                <p className={`mt-2 text-sm leading-6 ${selectedArticleId === article.id ? "text-[#dde4dc]" : "text-[#607366]"}`}>{article.category || "Uncategorized"} | {article.authorName || "No author"}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.52)] p-4">
        {selectedArticle ? (
          <ArticleEditorCard key={selectedArticle.id} article={selectedArticle} onSave={onArticleSave} onDelete={onArticleDelete} />
        ) : (
          <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">New article</p>
                <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">Create article</h3>
                <p className="mt-2 text-sm leading-7 text-[#607366]">Draft a new article from here. Once saved, it will move into the article index on the left.</p>
              </div>
            </div>
            <div className="mt-5">
              <ArticleFields value={draft} onChange={onDraftChange} />
            </div>
            <button
              onClick={onDraftSave}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-3 text-sm font-black text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)] transition hover:bg-[#204d3f]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add new article
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgramsWorkspace({
  databaseConfigured,
  disabled,
  programs,
  draft,
  onDraftChange,
  onDraftSave,
  onProgramSave,
  onProgramDelete,
}: {
  databaseConfigured: boolean;
  disabled: boolean;
  programs: Program[];
  draft: Omit<Program, "id">;
  onDraftChange: (next: Omit<Program, "id">) => void;
  onDraftSave: () => void;
  onProgramSave: (program: Program) => void;
  onProgramDelete: (id: string) => void;
}) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | "new">(programs[0]?.id ?? "new");
  const selectedProgram =
    selectedProgramId === "new"
      ? null
      : programs.find((program) => program.id === selectedProgramId) ?? programs[0] ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.52)] p-4">
        <div className="rounded-[1.5rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(64,44,8,0.06)]">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#9c6a18]">Training actions</p>
          <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">Training index</h3>
          <p className="mt-2 text-sm leading-7 text-[#607366]">Open one training at a time from the list, or start a new training from the top.</p>
          <button
            onClick={() => setSelectedProgramId("new")}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black transition ${
              selectedProgramId === "new"
                ? "bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)]"
                : "bg-[#f5c65e] text-[#173f33]"
            }`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New training
          </button>
        </div>

        <div className="mt-4 rounded-[1.5rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(64,44,8,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9c6a18]">Existing trainings</p>
            <div className="rounded-full bg-[#f6efe4] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#607366]">
              {programs.length}
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {programs.map((program, index) => (
              <button
                key={program.id}
                onClick={() => setSelectedProgramId(program.id)}
                className={`rounded-[1.3rem] border px-4 py-4 text-left transition ${
                  selectedProgramId === program.id
                    ? "border-[rgba(23,63,51,0.18)] bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.14)]"
                    : "border-[rgba(27,59,43,0.08)] bg-[#faf7ef] text-[#173f33] hover:bg-[#f3ecdf]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${selectedProgramId === program.id ? "bg-[rgba(255,255,255,0.14)] text-[#f5c65e]" : "bg-[#fffdf8] text-[#9c6a18]"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${program.published ? selectedProgramId === program.id ? "bg-[rgba(255,255,255,0.14)] text-[#e4f6ea]" : "bg-[#eef8f1] text-[#21533f]" : selectedProgramId === program.id ? "bg-[rgba(255,255,255,0.14)] text-[#fff2d7]" : "bg-[#fff5ea] text-[#8c4d1e]"}`}>
                    {program.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-black uppercase tracking-[0.12em]">{program.title}</p>
                <p className={`mt-2 text-sm leading-6 ${selectedProgramId === program.id ? "text-[#dde4dc]" : "text-[#607366]"}`}>
                  {program.level} | {program.duration}
                </p>
                <p className={`mt-1 text-xs font-semibold ${selectedProgramId === program.id ? "text-[#f4e7bd]" : "text-[#8a7d61]"}`}>
                  {program.enrollmentClosed
                    ? "Enrollment closed"
                    : program.batchStartsAt
                      ? `Starts ${formatDateTime(program.batchStartsAt)}`
                      : "Start date not set"}
                </p>
                <p className={`mt-1 text-[11px] font-semibold ${selectedProgramId === program.id ? "text-[#dde4dc]" : "text-[#607366]"}`}>
                  Popup {program.popupEnabled ? "enabled" : "disabled"}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.52)] p-4">
        {selectedProgram ? (
          <ProgramEditorCard key={selectedProgram.id} disabled={disabled} program={selectedProgram} onSave={onProgramSave} onDelete={onProgramDelete} />
        ) : (
          <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">New training</p>
                <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">Create training service</h3>
                <p className="mt-2 text-sm leading-7 text-[#607366]">Write the training exactly as the applicant should understand it.</p>
              </div>
              {!databaseConfigured ? (
                <span className="rounded-full bg-[#fff5ea] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8c4d1e]">
                  Read only
                </span>
              ) : null}
            </div>
            <div className="mt-5">
              <ProgramFields value={draft} onChange={onDraftChange} />
            </div>
            <button
              disabled={disabled}
              onClick={onDraftSave}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-3 text-sm font-black text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)] transition hover:bg-[#204d3f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add new training
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#718477]">
      {label}
      {children}
    </label>
  );
}

function fieldClass(multiline?: boolean) {
  return `${multiline ? "rounded-[1.35rem]" : "rounded-xl"} border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] px-3 py-2.5 text-sm font-medium text-[#173f33] outline-none ring-[#d9a127] transition placeholder:text-[#8ea091] focus:bg-white focus:ring-2`;
}

function ArticleMediaUploader<T extends Omit<ArticleItem, "id">>({
  value,
  onChange,
}: {
  value: T;
  onChange: (next: T) => void;
}) {
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleFileChange(file: File | null) {
    if (!file) return;

    startTransition(async () => {
      try {
        const { uploadUrl, publicUrl, objectKey } = await getPresignedUploadUrlAction(file.name, file.type);
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error("Article media upload failed.");
        }

        onChange({
          ...value,
          mediaUrl: publicUrl,
          mediaObjectKey: objectKey,
          mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
        });
        setNotice("Article media uploaded successfully.");
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Article media upload failed.");
      }
    });
  }

  return (
    <div className="rounded-[1.4rem] border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#718477]">Article media</p>
      <p className="mt-2 text-sm leading-6 text-[#607366]">
        Upload the main article image or video directly to R2 from here. This replaces the separate media desk workflow.
      </p>

      <div className="mt-4 grid gap-3">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
          className="block w-full rounded-[1rem] border border-dashed border-[rgba(27,59,43,0.18)] bg-white px-3 py-3 text-sm text-[#173f33]"
        />

        {value.mediaUrl ? (
          <div className="overflow-hidden rounded-[1rem] border border-[rgba(27,59,43,0.12)] bg-white">
            <div className="relative h-48">
              {value.mediaType === "VIDEO" ? (
                <video src={value.mediaUrl} controls className="h-full w-full object-cover" preload="metadata" />
              ) : (
                <Image src={value.mediaUrl} alt={value.title || "Article media"} fill unoptimized className="object-cover" />
              )}
            </div>
            <div className="flex items-center justify-between gap-3 p-3 text-xs font-semibold text-[#516253]">
              <span>{value.mediaType ?? "IMAGE"}</span>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    mediaUrl: "",
                    mediaObjectKey: "",
                    mediaType: null,
                  })
                }
                className="rounded-full bg-[#fff5ea] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#92462d]"
              >
                Remove media
              </button>
            </div>
          </div>
        ) : null}

        {notice ? (
          <p className="text-sm font-semibold text-[#516253]">{notice}</p>
        ) : null}

        {isPending ? (
          <p className="text-sm font-semibold text-[#9c6a18]">Uploading article media...</p>
        ) : null}
      </div>
    </div>
  );
}

function ArticleFields<T extends Omit<ArticleItem, "id">>({
  value,
  onChange,
}: {
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="grid gap-3">
      <Field label="Title">
        <input className={fieldClass()} value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} />
      </Field>
      <Field label="Slug">
        <input className={fieldClass()} value={value.slug} onChange={(event) => onChange({ ...value, slug: event.target.value })} />
      </Field>
      <Field label="Description">
        <textarea rows={3} className={fieldClass(true)} value={value.excerpt} onChange={(event) => onChange({ ...value, excerpt: event.target.value })} />
      </Field>
      <Field label="Full content">
        <textarea rows={7} className={fieldClass(true)} value={value.body} onChange={(event) => onChange({ ...value, body: event.target.value })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Category">
          <input className={fieldClass()} value={value.category} onChange={(event) => onChange({ ...value, category: event.target.value })} />
        </Field>
        <Field label="Published at">
          <input type="datetime-local" className={fieldClass()} value={value.publishedAt} onChange={(event) => onChange({ ...value, publishedAt: event.target.value })} />
        </Field>
      </div>
      <Field label="Author name">
        <input className={fieldClass()} value={value.authorName} onChange={(event) => onChange({ ...value, authorName: event.target.value })} />
      </Field>
      <Field label="Author role">
        <input className={fieldClass()} value={value.authorRole} onChange={(event) => onChange({ ...value, authorRole: event.target.value })} />
      </Field>
      <ArticleMediaUploader value={value} onChange={onChange} />
      <Field label="External link">
        <input className={fieldClass()} value={value.externalLink} onChange={(event) => onChange({ ...value, externalLink: event.target.value })} />
      </Field>
      <Field label="Bullet points">
        <textarea rows={4} className={fieldClass(true)} value={value.keyPoints} onChange={(event) => onChange({ ...value, keyPoints: event.target.value })} />
      </Field>
      <Field label="SEO title">
        <input className={fieldClass()} value={value.seoTitle} onChange={(event) => onChange({ ...value, seoTitle: event.target.value })} />
      </Field>
      <Field label="Meta description">
        <textarea rows={3} className={fieldClass(true)} value={value.metaDescription} onChange={(event) => onChange({ ...value, metaDescription: event.target.value })} />
      </Field>
      <label className="inline-flex items-center gap-2 rounded-xl bg-[#f3ecdf] px-3 py-2 text-sm font-semibold text-[#173f33]">
        <input type="checkbox" checked={value.published} onChange={(event) => onChange({ ...value, published: event.target.checked })} />
        Published article
      </label>
    </div>
  );
}

function ProgramFields<T extends Omit<Program, "id">>({ value, onChange }: { value: T; onChange: (next: T) => void }) {
  return (
    <>
      <Field label="Title">
        <input className={fieldClass()} value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} />
      </Field>
      <Field label="Slug">
        <input className={fieldClass()} value={value.slug} onChange={(event) => onChange({ ...value, slug: event.target.value })} />
      </Field>
      <Field label="Summary">
        <textarea className={fieldClass(true)} rows={3} value={value.summary} onChange={(event) => onChange({ ...value, summary: event.target.value })} />
      </Field>
      <Field label="Description">
        <textarea rows={5} className={fieldClass(true)} value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Duration">
          <input className={fieldClass()} value={value.duration} onChange={(event) => onChange({ ...value, duration: event.target.value })} />
        </Field>
        <Field label="Capacity">
          <input type="number" className={fieldClass()} value={value.capacity} onChange={(event) => onChange({ ...value, capacity: Number(event.target.value) })} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Batch starts at">
          <input
            type="datetime-local"
            className={fieldClass()}
            value={value.batchStartsAt?.slice(0, 16) ?? ""}
            onChange={(event) => onChange({ ...value, batchStartsAt: event.target.value })}
          />
        </Field>
        <div className="grid gap-3 sm:self-end">
          <label className="inline-flex items-center gap-2 rounded-xl bg-[#f3ecdf] px-3 py-2 text-sm font-semibold text-[#173f33]">
            <input
              type="checkbox"
              checked={value.enrollmentClosed}
              onChange={(event) => onChange({ ...value, enrollmentClosed: event.target.checked })}
            />
            Close batch enrollment
          </label>
          <label className="inline-flex items-center gap-2 rounded-xl bg-[#f3ecdf] px-3 py-2 text-sm font-semibold text-[#173f33]">
            <input
              type="checkbox"
              checked={value.popupEnabled}
              onChange={(event) => onChange({ ...value, popupEnabled: event.target.checked })}
            />
            Enable homepage popup
          </label>
        </div>
      </div>
      <Field label="Level">
        <select className={fieldClass()} value={value.level} onChange={(event) => onChange({ ...value, level: event.target.value as T["level"] })}>
          <option>FOUNDATION</option>
          <option>ADVANCED</option>
          <option>PROFESSIONAL</option>
        </select>
      </Field>
      <Field label="Fee">
        <input className={fieldClass()} value={value.fee ?? ""} onChange={(event) => onChange({ ...value, fee: event.target.value })} />
      </Field>
      <label className="inline-flex items-center gap-2 rounded-xl bg-[#f3ecdf] px-3 py-2 text-sm font-semibold text-[#173f33]">
        <input type="checkbox" checked={value.published} onChange={(event) => onChange({ ...value, published: event.target.checked })} />
        Published on website
      </label>
    </>
  );
}

function EventFields<T extends Omit<EventItem, "id">>({ value, onChange }: { value: T; onChange: (next: T) => void }) {
  return (
    <>
      <Field label="Title">
        <input className={fieldClass()} value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} />
      </Field>
      <Field label="Slug">
        <input className={fieldClass()} value={value.slug} onChange={(event) => onChange({ ...value, slug: event.target.value })} />
      </Field>
      <Field label="Summary">
        <textarea className={fieldClass(true)} rows={3} value={value.summary} onChange={(event) => onChange({ ...value, summary: event.target.value })} />
      </Field>
      <Field label="Description">
        <textarea rows={5} className={fieldClass(true)} value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} />
      </Field>
      <Field label="Location">
        <input className={fieldClass()} value={value.location} onChange={(event) => onChange({ ...value, location: event.target.value })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Starts at">
          <input type="datetime-local" className={fieldClass()} value={value.startsAt?.slice(0, 16) ?? ""} onChange={(event) => onChange({ ...value, startsAt: event.target.value })} />
        </Field>
        <Field label="Ends at">
          <input type="datetime-local" className={fieldClass()} value={value.endsAt?.slice(0, 16) ?? ""} onChange={(event) => onChange({ ...value, endsAt: event.target.value })} />
        </Field>
      </div>
      <Field label="Status">
        <select className={fieldClass()} value={value.status} onChange={(event) => onChange({ ...value, status: event.target.value as T["status"] })}>
          <option>UPCOMING</option>
          <option>COMPLETED</option>
          <option>CANCELLED</option>
        </select>
      </Field>
      <label className="inline-flex items-center gap-2 rounded-xl bg-[#f3ecdf] px-3 py-2 text-sm font-semibold text-[#173f33]">
        <input type="checkbox" checked={value.published} onChange={(event) => onChange({ ...value, published: event.target.checked })} />
        Published on website
      </label>
    </>
  );
}

function ProgramEditorCard({
  program,
  onSave,
  onDelete,
  disabled,
}: {
  program: Program;
  onSave: (program: Program) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}) {
  const [draft, setDraft] = useState(program);

  return (
    <article className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">Selected training</p>
          <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">{draft.title || "Untitled training"}</h3>
          <p className="mt-2 text-sm leading-7 text-[#607366]">
            {draft.level} | {draft.duration} | Capacity {draft.capacity}
          </p>
          <p className="mt-1 text-xs font-semibold text-[#8a7d61]">
            {draft.enrollmentClosed
              ? "Enrollment closed by admin"
              : draft.batchStartsAt
                ? `Batch starts ${formatDateTime(draft.batchStartsAt)}`
                : "Batch start date not set"}
          </p>
          <p className="mt-1 text-xs font-semibold text-[#8a7d61]">
            Homepage popup {draft.popupEnabled ? "enabled" : "disabled"}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${draft.published ? "bg-[#eef8f1] text-[#21533f]" : "bg-[#fff5ea] text-[#8c4d1e]"}`}>
          {draft.published ? "Published" : "Draft"}
        </span>
      </div>

      <ProgramFields value={draft} onChange={setDraft} />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          disabled={disabled}
          onClick={() => onSave(draft)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] transition hover:bg-[#204d3f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save changes
        </button>
        <button
          disabled={disabled}
          onClick={() => onDelete(program.id)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(146,70,45,0.16)] bg-[#fff8f5] px-4 py-2.5 text-sm font-black text-[#92462d] transition hover:bg-[#fbeee7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  );
}

function EventRow({
  event,
  onSave,
  onDelete,
  disabled,
}: {
  event: EventItem;
  onSave: (body: EventItem) => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  const [draft, setDraft] = useState(event);

  return (
    <RecordCard
      eyebrow={event.status.replaceAll("_", " ")}
      title={event.title}
      metadata={`${formatDateTime(event.startsAt)} | ${event.location}`}
      disabled={disabled}
      onSave={() => onSave(draft)}
      onDelete={onDelete}
    >
      <EventFields value={draft} onChange={setDraft} />
    </RecordCard>
  );
}

function ArticleEditorCard({
  article,
  onSave,
  onDelete,
}: {
  article: ArticleItem;
  onSave: (id: string, next: ArticleItem) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState(article);

  return (
    <article className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">Selected article</p>
          <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">{draft.title || "Untitled article"}</h3>
          <p className="mt-2 text-sm leading-7 text-[#607366]">
            {draft.authorName || "No author"} | {draft.publishedAt ? formatDateTime(draft.publishedAt) : "No publish date"}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${draft.published ? "bg-[#eef8f1] text-[#21533f]" : "bg-[#fff5ea] text-[#8c4d1e]"}`}>
          {draft.published ? "Published" : "Draft"}
        </span>
      </div>

      <ArticleFields value={draft} onChange={setDraft} />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => onSave(article.id, draft)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] transition hover:bg-[#204d3f]"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save changes
        </button>
        <button
          onClick={() => onDelete(article.id)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(146,70,45,0.16)] bg-[#fff8f5] px-4 py-2.5 text-sm font-black text-[#92462d] transition hover:bg-[#fbeee7]"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  );
}

function RecordCard({
  eyebrow,
  title,
  metadata,
  children,
  onSave,
  onDelete,
  disabled,
}: {
  eyebrow: string;
  title: string;
  metadata: string;
  children: ReactNode;
  onSave: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  return (
    <article className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">{eyebrow}</p>
          <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-[#607366]">{metadata}</p>
        </div>
      </div>

      <div className="grid gap-3">{children}</div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          disabled={disabled}
          onClick={onSave}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] transition hover:bg-[#204d3f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save changes
        </button>
        <button
          disabled={disabled}
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(146,70,45,0.16)] bg-[#fff8f5] px-4 py-2.5 text-sm font-black text-[#92462d] transition hover:bg-[#fbeee7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  );
}

function HistoryDrawer({
  section,
  entries,
  schedules,
  onClose,
}: {
  section: HistorySection;
  entries: HistoryEntry[];
  schedules: PublishSchedule[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[rgba(16,33,27,0.38)] p-4 sm:p-6" onClick={onClose}>
      <div
        className="ml-auto flex h-full w-full max-w-[30rem] flex-col rounded-[2rem] bg-[#fffdf8] p-5 shadow-[0_28px_60px_rgba(16,33,27,0.24)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#9c6a18]">{section}</p>
            <h3 className="font-display mt-2 text-3xl font-semibold text-[#173f33]">30-day history</h3>
            <p className="mt-2 text-sm leading-7 text-[#607366]">Recent edits, scheduling actions, and admin activity for this section.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-[rgba(27,59,43,0.12)] p-2 text-[#173f33]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-[rgba(27,59,43,0.08)] bg-[#f8f4ea] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9c6a18]">Active schedules</p>
          <div className="mt-3 grid gap-3">
            {schedules.length ? (
              schedules.map((schedule) => (
                <div key={schedule.id} className="rounded-[1.2rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black uppercase tracking-[0.1em] text-[#173f33]">{schedule.label}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${schedule.published ? "bg-[#eef8f1] text-[#21533f]" : "bg-[#fff5ea] text-[#8c4d1e]"}`}>
                      {schedule.published ? "Published" : "Scheduled"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#607366]">
                    {schedule.published ? `Published at ${formatDateTime(schedule.publishedAt)}` : `Will publish at ${formatDateTime(schedule.publishAt)}`}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#607366]">No schedules have been added for this section yet.</p>
            )}
          </div>
        </div>

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-3">
            {entries.length ? (
              entries.map((entry) => (
                <div key={entry.id} className="rounded-[1.2rem] border border-[rgba(27,59,43,0.08)] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">{entry.action}</p>
                      <h4 className="mt-2 text-base font-semibold text-[#173f33]">{entry.label}</h4>
                    </div>
                    <span className="text-xs font-semibold text-[#607366]">{formatDateTime(entry.timestamp)}</span>
                  </div>
                  {entry.details ? <p className="mt-2 text-sm leading-6 text-[#607366]">{entry.details}</p> : null}
                </div>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-[rgba(27,59,43,0.14)] bg-[#fffdf8] p-5 text-sm leading-7 text-[#607366]">
                No history items have been recorded for this section yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopStatusChip({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  tone: "warm" | "forest" | "gold";
}) {
  const toneClass = {
    warm: "bg-[#fff5ea] border-[rgba(153,70,45,0.12)] text-[#92462d]",
    forest: "bg-[#eef8f1] border-[rgba(33,83,63,0.12)] text-[#21533f]",
    gold: "bg-[#fff8df] border-[rgba(122,90,0,0.12)] text-[#7a5a00]",
  }[tone];

  return (
    <div className={`min-w-[14rem] rounded-[1.35rem] border px-5 py-4 shadow-[0_12px_28px_rgba(64,44,8,0.06)] ${toneClass}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.18em]">{label}</p>
      <div className="mt-2.5 flex items-end gap-3">
        <p className="font-display text-4xl font-semibold leading-none">{value}</p>
        <p className="pb-1 text-sm font-semibold opacity-80">{detail}</p>
      </div>
    </div>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return "Date not set";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60_000));

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}
