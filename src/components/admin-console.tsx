"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  BookOpenText,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  FolderKanban,
  History,
  LayoutGrid,
  Images,
  LogOut,
  Mail,
  Menu,
  Power,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import { ApplicationAdminPanel } from "@/components/application-admin-panel";
import { ContactInboxPanel } from "@/components/contact-inbox-panel";
import { GalleryWorkspace, type GalleryAdminItem, type GalleryDraftInput } from "@/components/gallery-workspace";
import { PaymentAdminPanel } from "@/components/payment-admin-panel";
import { optimizeImageForInlineStorage } from "@/lib/client-media";
import type { ContactInboxRecord } from "@/lib/contact-inbox";
import type { TrainingApplicationRecord } from "@/lib/training-application";
import type { PaymentAdminRecord } from "@/lib/training-application-store";

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
  applicationStorageMode: "database" | "local";
  initialApplications: TrainingApplicationRecord[];
  initialPayments: PaymentAdminRecord[];
  initialContactMessages: ContactInboxRecord[];
  initialPrograms: Program[];
  initialArticles: ArticleItem[];
  initialEvents: EventItem[];
  initialGalleryImages: GalleryAdminItem[];
};

type DashboardView = "overview" | "programs" | "events" | "applications" | "payments" | "contacts" | "articles" | "gallery";
type HistorySection = DashboardView;

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

type SectionTheme = {
  navActive: string;
  navDescriptionActive: string;
  navIconActive: string;
  panelShell: string;
  panelSurface: string;
  panelMuted: string;
  badge: string;
};

const ADMIN_THEME: SectionTheme = {
  navActive: "border-[rgba(245,198,94,0.18)] bg-[#f4f7f3] text-[#173f33]",
  navDescriptionActive: "text-[#607366]",
  navIconActive: "bg-[#fff8df] text-[#b87912]",
  panelShell: "border-[rgba(245,198,94,0.16)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(248,244,234,0.98))]",
  panelSurface: "border-[rgba(23,63,51,0.08)] bg-[rgba(255,255,255,0.78)]",
  panelMuted: "bg-[#eef3ef]",
  badge: "bg-[#173f33] text-[#fff9ec]",
};

const SECTION_THEMES: Record<DashboardView, SectionTheme> = {
  overview: ADMIN_THEME,
  applications: ADMIN_THEME,
  payments: ADMIN_THEME,
  contacts: ADMIN_THEME,
  programs: ADMIN_THEME,
  events: ADMIN_THEME,
  articles: ADMIN_THEME,
  gallery: ADMIN_THEME,
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
  applicationStorageMode,
  initialApplications,
  initialPayments,
  initialContactMessages,
  initialPrograms,
  initialArticles,
  initialEvents,
  initialGalleryImages,
}: Props) {
  const [applications, setApplications] = useState<TrainingApplicationRecord[]>(initialApplications);
  const [payments, setPayments] = useState<PaymentAdminRecord[]>(initialPayments);
  const [contactMessages, setContactMessages] = useState<ContactInboxRecord[]>(initialContactMessages);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [programDraft, setProgramDraft] = useState(emptyProgram);
  const [eventDraft, setEventDraft] = useState(emptyEvent);
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [galleryImages, setGalleryImages] = useState<GalleryAdminItem[]>(initialGalleryImages);
  const [articleDraft, setArticleDraft] = useState<Omit<ArticleItem, "id">>(emptyArticle);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<DashboardView>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>(readStoredHistory);
  const [schedules, setSchedules] = useState<PublishSchedule[]>(readStoredSchedules);
  const [activeHistorySection, setActiveHistorySection] = useState<HistorySection | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(readStoredNotifications);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [readSystemNotificationIds, setReadSystemNotificationIds] = useState<string[]>([]);
  const [dismissedSystemNotificationIds, setDismissedSystemNotificationIds] = useState<string[]>([]);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement | null>(null);
  const activityPanelRef = useRef<HTMLDivElement | null>(null);

  const applicationSummary = useMemo(() => {
    const ready = applications.filter(
      (application) =>
        application.payload.crossCheckStatus === "VERIFIED" &&
        application.payload.paymentStatus === "PAID" &&
        application.payload.approvalStatus === "PENDING",
    ).length;

    return { ready };
  }, [applications]);

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
      if (!activityPanelRef.current?.contains(event.target as Node)) {
        setActivityOpen(false);
      }
    }

    if (notificationOpen || activityOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activityOpen, notificationOpen]);

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
    { id: "overview", label: "Overview", description: "Today at a glance", icon: <LayoutGrid className="h-4 w-4" aria-hidden="true" /> },
    { id: "applications", label: "Applications", description: "Admissions desk", icon: <UsersRound className="h-4 w-4" aria-hidden="true" /> },
    { id: "payments", label: "Payments", description: "Gateway control", icon: <CreditCard className="h-4 w-4" aria-hidden="true" /> },
    { id: "contacts", label: "Contact Inbox", description: "Student inbox", icon: <Mail className="h-4 w-4" aria-hidden="true" /> },
    { id: "articles", label: "Articles", description: "Content publishing", icon: <BookOpenText className="h-4 w-4" aria-hidden="true" /> },
    { id: "gallery", label: "Gallery", description: "Media showcase", icon: <Images className="h-4 w-4" aria-hidden="true" /> },
    { id: "events", label: "Events", description: "Schedule control", icon: <CalendarDays className="h-4 w-4" aria-hidden="true" /> },
    { id: "programs", label: "Training", description: "Training catalog", icon: <FolderKanban className="h-4 w-4" aria-hidden="true" /> },
  ];
  const activeTheme = SECTION_THEMES[view];
  const activeNavItem = viewItems.find((item) => item.id === view) ?? viewItems[0];
  const navGroups: Array<{ title?: string; items: DashboardView[] }> = [
    { items: ["overview"] },
    { title: "Operations", items: ["applications", "payments", "contacts"] },
    { title: "Content", items: ["programs", "events", "articles", "gallery"] },
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
        message:
          applicationStorageMode === "local"
            ? "Local preview is running without DATABASE_URL. Training applications are stored locally, while the content manager stays read-only until the database is connected."
            : "DATABASE_URL is not configured locally, so save actions stay disabled until deployment setup is ready.",
        timestamp: new Date().toISOString(),
        read: readSystemNotificationIds.includes("system-local-preview"),
        variant: "alert",
      });
    }

    return liveNotifications.filter((notification) => !dismissedSystemNotificationIds.includes(notification.id));
  }, [applicationStorageMode, applicationSummary.ready, databaseConfigured, dismissedSystemNotificationIds, readSystemNotificationIds]);

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
        { overview: [], programs: [], events: [], applications: [], payments: [], contacts: [], articles: [], gallery: [] },
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
      const [programResponse, eventResponse, articleResponse, galleryResponse, applicationResponse, paymentResponse, contactResponse] = await Promise.all([
        fetch("/api/admin/programs"),
        fetch("/api/admin/events"),
        fetch("/api/admin/articles"),
        fetch("/api/admin/gallery"),
        fetch("/api/admin/applications"),
        fetch("/api/admin/payments"),
        fetch("/api/admin/contact-messages"),
      ]);
      if (
        programResponse.status === 401 ||
        eventResponse.status === 401 ||
        articleResponse.status === 401 ||
        galleryResponse.status === 401 ||
        applicationResponse.status === 401 ||
        paymentResponse.status === 401 ||
        contactResponse.status === 401
      ) {
        window.location.assign("/admin");
        return;
      }
      if (!programResponse.ok || !eventResponse.ok || !articleResponse.ok || !galleryResponse.ok || !applicationResponse.ok || !paymentResponse.ok || !contactResponse.ok) {
        setNotice("Unable to refresh the dashboard right now.");
        return;
      }
      setPrograms(await programResponse.json());
      setEvents(await eventResponse.json());
      setArticles(await articleResponse.json());
      setGalleryImages(await galleryResponse.json());
      setApplications(await applicationResponse.json());
      setPayments(await paymentResponse.json());
      setContactMessages(await contactResponse.json());
      appendHistory("overview", "Refresh", "Dashboard data refreshed");
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

  async function createGalleryImages(records: GalleryDraftInput[]) {
    const ok = await mutate("/api/admin/gallery", "POST", records);
    if (ok) {
      appendHistory("gallery", "Create gallery images", records[0]?.caption || "Gallery image", "Gallery images were added.");
      pushNotification({
        section: "gallery",
        title: "Gallery updated",
        message: `${records.length} gallery image${records.length === 1 ? "" : "s"} added successfully.`,
        variant: "success",
      });
    }
  }

  async function saveGalleryImage(id: string, record: GalleryDraftInput) {
    const ok = await mutate(`/api/admin/gallery/${id}`, "PATCH", record);
    if (ok) {
      appendHistory("gallery", "Update gallery image", record.caption || "Gallery image", "Gallery image details were updated.");
      pushNotification({
        section: "gallery",
        title: "Gallery image updated",
        message: `${record.caption || "Gallery image"} was updated successfully.`,
        variant: "success",
      });
    }
  }

  async function deleteGalleryImage(id: string) {
    const image = galleryImages.find((item) => item.id === id);
    const ok = await mutate(`/api/admin/gallery/${id}`, "DELETE");
    if (ok) {
      appendHistory("gallery", "Delete gallery image", image?.caption ?? "Gallery image", "Gallery image deleted.");
      pushNotification({
        section: "gallery",
        title: "Gallery image removed",
        message: `${image?.caption ?? "Gallery image"} was removed from the gallery manager.`,
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
    <div className="min-h-screen bg-[#173f33] px-3 py-3 sm:px-4 lg:px-5">
      <div className={`mx-auto grid max-w-[108rem] gap-0 overflow-hidden rounded-[2rem] bg-[#173f33] shadow-[0_30px_90px_rgba(7,23,17,0.35)] ${
        sidebarCollapsed ? "lg:grid-cols-[6rem_minmax(0,1fr)]" : "lg:grid-cols-[17rem_minmax(0,1fr)]"
      }`}>
      <div className="border-b border-[rgba(23,63,51,0.08)] bg-[#f4f7f3] p-3 lg:hidden">
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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,249,236,0.18)] bg-[#fffdf8] text-[#173f33] shadow-[0_10px_24px_rgba(0,0,0,0.14)]"
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

            <nav className="mt-5 grid gap-5">
              {navGroups.map((group, index) => (
                <div key={group.title ?? `mobile-group-${index}`} className="grid gap-3">
                  {group.title ? (
                    <p className="px-1 text-[10px] font-black uppercase tracking-[0.3em] text-[rgba(245,198,94,0.76)]">
                      {group.title}
                    </p>
                  ) : null}
                  {group.items.map((viewId) => {
                    const item = viewItems.find((entry) => entry.id === viewId);
                    if (!item) return null;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setView(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 text-left transition ${
                          view === item.id
                            ? "relative -mr-5 rounded-l-[1.1rem] rounded-r-none border border-transparent bg-[#f4f7f3] text-[#173f33] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] after:absolute after:right-[-1.25rem] after:top-0 after:h-full after:w-5 after:bg-[#f4f7f3]"
                            : "border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.06)] text-[#fff9ec]"
                        }`}
                      >
                        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                          view === item.id ? "bg-[#e4ece6] text-[#173f33]" : "bg-[rgba(245,198,94,0.16)] text-[#fff9ec]"
                        }`}>
                          {item.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-black uppercase tracking-[0.16em]">{item.label}</span>
                          <span className={`mt-1 block text-sm ${view === item.id ? "text-[#607366]" : "text-[#d7e1db]"}`}>{item.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      <div
        className="contents"
      >
        <aside className={`relative hidden min-h-[calc(100vh-1.5rem)] bg-[linear-gradient(180deg,#1f513d_0%,#173f33_52%,#123429_100%)] lg:block ${sidebarCollapsed ? "w-[6rem]" : ""}`}>
          <button
            onClick={() => setSidebarCollapsed((current) => !current)}
            className="absolute -right-4 top-6 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(23,63,51,0.12)] bg-[#fffdf8] text-[#173f33] shadow-[0_12px_28px_rgba(64,44,8,0.12)]"
            aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : <ChevronLeft className="h-4 w-4" aria-hidden="true" />}
          </button>
          <div className="sticky top-0 min-h-[calc(100vh-1.5rem)] rounded-r-[1.8rem] bg-transparent p-5 text-[#fff9ec] shadow-[18px_0_50px_rgba(23,63,51,0.18)]">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 border-b border-[rgba(255,249,236,0.12)] pb-5">
                <button
                  onClick={() => setLogoutDialogOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,249,236,0.18)] bg-[#fffdf8] text-[#173f33] shadow-[0_10px_24px_rgba(0,0,0,0.14)]"
                  aria-label="Open logout confirmation"
                >
                  <Power className="h-4 w-4" aria-hidden="true" />
                </button>
                <div>
                  <p className="text-sm font-black tracking-[0.02em] text-[#fff9ec]">API Culture</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#f5c65e]">Admin desk</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setLogoutDialogOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#fffdf8] text-[#173f33] shadow-[0_10px_24px_rgba(0,0,0,0.14)]"
                  aria-label="Open logout confirmation"
                >
                  <Power className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}

            <nav className="mt-5 grid gap-4">
              {navGroups.map((group, index) => (
                <div key={group.title ?? `desktop-group-${index}`} className="grid gap-2.5">
                  {group.title && !sidebarCollapsed ? (
                    <div className="flex items-center gap-3 px-3 pt-2">
                      <span className="h-px flex-1 bg-[rgba(245,198,94,0.18)]" />
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[rgba(245,198,94,0.78)]">
                        {group.title}
                      </p>
                      <span className="h-px flex-1 bg-[rgba(245,198,94,0.18)]" />
                    </div>
                  ) : null}
                  {group.items.map((viewId) => {
                    const item = viewItems.find((entry) => entry.id === viewId);
                    if (!item) return null;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        className={`flex min-h-[3.9rem] items-center ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3.5"} text-left transition ${
                          view === item.id
                            ? sidebarCollapsed
                              ? "rounded-[1rem] border border-transparent bg-[#f4f7f3] text-[#173f33] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                              : "relative -mr-5 overflow-visible rounded-l-[1.25rem] rounded-r-none border border-transparent bg-[#f4f7f3] text-[#173f33] shadow-[0_16px_34px_rgba(7,23,17,0.12),inset_0_1px_0_rgba(255,255,255,0.82)] after:absolute after:right-[-1.25rem] after:top-0 after:h-full after:w-5 after:bg-[#f4f7f3]"
                            : "rounded-[1rem] border border-[rgba(255,249,236,0.08)] bg-[rgba(255,255,255,0.035)] text-[#eef5ee] hover:border-[rgba(245,198,94,0.2)] hover:bg-[rgba(255,255,255,0.075)]"
                        }`}
                        title={item.label}
                      >
                        {view === item.id && !sidebarCollapsed ? (
                          <>
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -right-5 -top-5 h-5 w-5 rounded-br-[1.25rem]"
                              style={{ boxShadow: "8px 8px 0 8px #f4f7f3" }}
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -bottom-5 -right-5 h-5 w-5 rounded-tr-[1.25rem]"
                              style={{ boxShadow: "8px -8px 0 8px #f4f7f3" }}
                            />
                          </>
                        ) : null}
                        <span className={`relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] ${
                          view === item.id ? "bg-[#fff8df] text-[#b87912]" : "bg-[rgba(245,198,94,0.14)] text-[#f6d783]"
                        }`}>
                          {item.icon}
                        </span>
                        {!sidebarCollapsed ? (
                          <span className="relative z-10 min-w-0">
                            <span className="block truncate text-[14px] font-black tracking-[0.01em]">{item.label}</span>
                            <span className={`mt-1 block truncate text-xs font-semibold ${view === item.id ? "text-[#607366]" : "text-[#b9c9c0]"}`}>{item.description}</span>
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className="relative min-w-0 bg-[#f4f7f3] p-3 sm:p-4 lg:rounded-l-[2rem] lg:p-5 lg:shadow-[-24px_0_45px_rgba(244,247,243,0.18)]">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] bg-[#ffffff] px-4 py-3 shadow-[0_10px_28px_rgba(23,63,51,0.06)]">
              <div>
                <p className="text-xs font-semibold text-[#718477]">Application / Dashboard</p>
                <h1 className="mt-1 text-xl font-black text-[#173f33]">{activeNavItem.label}</h1>
              </div>
              <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
                <label className="hidden h-10 min-w-[16rem] max-w-xl flex-1 items-center rounded-full bg-[#edf2ef] px-4 text-[#607366] md:flex">
                  <input
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#173f33] outline-none placeholder:text-[#8b9a90]"
                    placeholder="Search..."
                    aria-label="Admin quick search"
                  />
                  <Search className="h-4 w-4" aria-hidden="true" />
                </label>
                <div className="flex items-center gap-2.5 rounded-full bg-[#f6faf7] p-1 shadow-[inset_0_0_0_1px_rgba(23,63,51,0.05)]">
                  <button
                    disabled={loading}
                    onClick={load}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2ef] text-[#173f33] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Refresh data"
                  >
                    <RefreshCw className={`h-4 w-4${loading ? " animate-spin" : ""}`} aria-hidden="true" />
                  </button>

                  <div className="relative" ref={notificationPanelRef}>
                    <button
                      onClick={() => setNotificationOpen((current) => !current)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2ef] text-[#173f33] transition hover:scale-105"
                      aria-label="Open notifications"
                      aria-expanded={notificationOpen}
                    >
                      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full">
                        <Bell className="h-4 w-4" aria-hidden="true" />
                        {unreadNotifications ? (
                          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[#d12e2e] px-1.5 py-0.5 text-[10px] font-black text-white">
                            {unreadNotifications}
                          </span>
                        ) : null}
                      </span>
                    </button>

                    {notificationOpen ? (
                      <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[24rem] max-w-[calc(100vw-3rem)] overflow-hidden rounded-[1.6rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] shadow-[0_24px_50px_rgba(64,44,8,0.16)]">
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

                  <div
                    className="relative"
                    ref={activityPanelRef}
                    onMouseLeave={() => setActivityOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setActivityOpen((current) => !current)}
                      onMouseEnter={() => setActivityOpen(true)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2ef] text-[#173f33] transition hover:scale-105"
                      aria-label="Open activity log"
                      aria-expanded={activityOpen}
                    >
                      <History className="h-4 w-4" aria-hidden="true" />
                    </button>

                    {activityOpen ? (
                      <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[26rem] max-w-[calc(100vw-3rem)] overflow-hidden rounded-[1.6rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] shadow-[0_24px_50px_rgba(64,44,8,0.16)]">
                        <div className="flex items-center gap-3 border-b border-[rgba(27,59,43,0.08)] px-4 py-4">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef3ef] text-[#173f33]">
                            <History className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9c6a18]">Activity log</p>
                            <p className="mt-1 text-sm font-semibold text-[#607366]">{historyEntries.length} entries</p>
                          </div>
                        </div>

                        <div className="max-h-[26rem] overflow-y-auto p-3">
                          {historyEntries.length ? (
                            <div className="grid gap-2.5">
                              {historyEntries.map((entry) => (
                                <div key={entry.id} className="rounded-[1.1rem] border border-[rgba(27,59,43,0.08)] bg-[#f9f6ef] px-3.5 py-3 text-left">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[#173f33]">{entry.action}</p>
                                    <p className="text-xs font-semibold text-[#7a8b80]">{timeAgo(entry.timestamp)}</p>
                                  </div>
                                  <p className="mt-1 text-[13px] font-semibold text-[#395547]">{entry.label}</p>
                                  {entry.details ? <p className="mt-1 text-[13px] leading-5 text-[#607366]">{entry.details}</p> : null}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-[1.2rem] border border-dashed border-[rgba(27,59,43,0.12)] bg-[#faf7ef] px-4 py-8 text-center text-sm font-semibold text-[#607366]">
                              No activity yet.
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {view === "overview" ? (
              <CurrentBatchCard applications={applications} programs={programs} theme={activeTheme} />
            ) : null}

          {notice ? (
            <div className={`rounded-[1.2rem] border px-4 py-2.5 text-[13px] font-semibold shadow-[0_14px_28px_rgba(0,0,0,0.12)] ${activeTheme.panelShell}`}>
              {notice}
            </div>
          ) : null}

      {view === "overview" ? (
        <OverviewDashboard
          applications={applications}
          payments={payments}
          contactMessages={contactMessages}
          programs={programs}
          events={events}
          articles={articles}
          galleryImages={galleryImages}
          onOpenSection={setView}
          theme={SECTION_THEMES.overview}
        />
      ) : null}

      {view === "programs" ? (
        <DashboardSection
          view="programs"
          eyebrow="Training manager"
          title=""
          className="mt-5"
        >
          <ProgramsWorkspace
            databaseConfigured={databaseConfigured}
            disabled={loading || !databaseConfigured}
            programs={programs}
            draft={programDraft}
            schedules={sectionSchedules.programs}
            onOpenHistory={() => setActiveHistorySection("programs")}
            onSchedule={(label, publishAt) => saveSchedule("programs", label, publishAt)}
            onDraftChange={setProgramDraft}
            onDraftSave={createProgram}
            onProgramSave={saveProgram}
            onProgramDelete={removeProgram}
          />
        </DashboardSection>
      ) : null}

      {view === "events" ? (
        <DashboardSection
          view="events"
          eyebrow="Event planner"
          title=""
          className="mt-5"
        >
          <EventsWorkspace
            disabled={loading || !databaseConfigured}
            events={events}
            draft={eventDraft}
            schedules={sectionSchedules.events}
            onOpenHistory={() => setActiveHistorySection("events")}
            onSchedule={(label, publishAt) => saveSchedule("events", label, publishAt)}
            onDraftChange={setEventDraft}
            onDraftSave={createEvent}
            onEventSave={saveEvent}
            onEventDelete={removeEvent}
          />
        </DashboardSection>
      ) : null}

      {view === "applications" ? (
        <DashboardSection
          view="applications"
          eyebrow="Admissions desk"
          title=""
          className="mt-5"
        >
          <ApplicationAdminPanel
            storageMode={applicationStorageMode}
            initialApplications={applications}
          />
        </DashboardSection>
      ) : null}

      {view === "payments" ? (
        <DashboardSection
          view="payments"
          eyebrow="Payment control"
          title=""
          className="mt-5"
        >
          <PaymentAdminPanel
            databaseConfigured={databaseConfigured}
            initialPayments={payments}
          />
        </DashboardSection>
      ) : null}

      {view === "contacts" ? (
        <DashboardSection
          view="contacts"
          eyebrow="Contact desk"
          title=""
          className="mt-5"
        >
          <ContactInboxPanel messages={contactMessages} loading={loading} />
        </DashboardSection>
      ) : null}

      {view === "articles" ? (
        <DashboardSection
          view="articles"
          eyebrow="Article manager"
          title=""
          className="mt-5"
        >
          <ArticlesWorkspace
            articles={articles}
            draft={articleDraft}
            schedules={sectionSchedules.articles}
            onOpenHistory={() => setActiveHistorySection("articles")}
            onSchedule={(label, publishAt) => saveSchedule("articles", label, publishAt)}
            onDraftChange={setArticleDraft}
            onDraftSave={saveArticleDraft}
            onArticleSave={updateArticle}
            onArticleDelete={deleteArticle}
          />
        </DashboardSection>
      ) : null}

      {view === "gallery" ? (
        <DashboardSection
          view="gallery"
          eyebrow="Gallery manager"
          title=""
          className="mt-5"
        >
          <GalleryWorkspace
            disabled={loading || !databaseConfigured}
            images={galleryImages}
            onOpenHistory={() => setActiveHistorySection("gallery")}
            onCreate={createGalleryImages}
            onSave={saveGalleryImage}
            onDelete={deleteGalleryImage}
          />
        </DashboardSection>
      ) : null}
          </div>
        </main>
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

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
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

function OverviewDashboard({
  applications,
  payments,
  contactMessages,
  programs,
  events,
  articles,
  galleryImages,
  onOpenSection,
}: {
  applications: TrainingApplicationRecord[];
  payments: PaymentAdminRecord[];
  contactMessages: ContactInboxRecord[];
  programs: Program[];
  events: EventItem[];
  articles: ArticleItem[];
  galleryImages: GalleryAdminItem[];
  onOpenSection: (view: DashboardView) => void;
  theme: SectionTheme;
}) {
  const pendingApplications = applications.filter((application) => application.payload.approvalStatus !== "APPROVED").length;
  const pendingPayments = payments.filter((payment) => !["PAID", "SUCCESS", "CAPTURED"].includes(payment.status)).length;
  const contactCount = contactMessages.length;
  const operationsLoad = pendingApplications + pendingPayments + contactCount;
  const publishedAssets = programs.length + events.length + articles.length + galleryImages.length;
  const paidPayments = payments.filter((payment) => ["PAID", "SUCCESS", "CAPTURED"].includes(payment.status));
  const approvedApplications = applications.filter((application) => application.payload.approvalStatus === "APPROVED").length;
  const latestApplication = [...applications].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0] ?? null;
  const latestPayment = [...payments].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0] ?? null;
  const latestContact = [...contactMessages].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0] ?? null;
  const latestTimes = [
    latestApplication?.createdAt,
    latestPayment?.createdAt,
    latestContact?.createdAt,
    programs[0]?.updatedAt,
    events[0]?.updatedAt,
    articles[0]?.publishedAt,
  ].filter(Boolean) as string[];
  const lastUpdated = latestTimes
    .map((value) => new Date(value).getTime())
    .filter((value) => Number.isFinite(value))
    .sort((left, right) => right - left)[0];
  const paidAmountPaise = paidPayments.reduce((total, payment) => total + payment.amountPaise, 0);
  const totalPaymentAmountPaise = payments.reduce((total, payment) => total + payment.amountPaise, 0);
  const reviewRows = [
    { label: "Pending applications", value: pendingApplications, view: "applications" as DashboardView },
    { label: "Pending payments", value: pendingPayments, view: "payments" as DashboardView },
    { label: "Contact messages", value: contactCount, view: "contacts" as DashboardView },
  ];
  const liveBars = [applications.length, approvedApplications, pendingApplications, payments.length, pendingPayments, contactCount];
  const maxLiveBar = Math.max(...liveBars, 1);
  const recentPayments = payments.slice(0, 3);
  const reviewTarget = pendingApplications > 0 ? "applications" : pendingPayments > 0 ? "payments" : "contacts";

  return (
    <div className="mt-4 grid gap-4">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#173f33]">Hello, Admin!</h2>
          <p className="mt-1 text-sm font-semibold text-[#607366]">
            Last updated: {lastUpdated ? formatDateTime(new Date(lastUpdated).toISOString()) : "No activity yet"}
          </p>
        </div>
        <button onClick={() => onOpenSection(reviewTarget)} className="rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] shadow-[0_12px_28px_rgba(23,63,51,0.14)]">
          Review queue
        </button>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1rem] bg-[#077b76] px-4 py-3 text-[#f9fffb] shadow-[0_14px_34px_rgba(7,123,118,0.18)]">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.85rem] bg-[#fffdf8] text-[#173f33] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <UsersRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-black">{operationsLoad ? `${operationsLoad} live items need review` : "All live queues are clear"}</p>
            <p className="mt-1 truncate text-xs font-semibold text-[#d6f4ed]">
              {latestApplication ? `Latest application: ${latestApplication.payload.candidateName}` : "No applications submitted yet."}
            </p>
          </div>
        </div>
        <button onClick={() => onOpenSection(reviewTarget)} className="rounded-[0.65rem] bg-[#fffdf8] px-3 py-2 text-xs font-black text-[#173f33]">
          Review
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <OverviewMetricCard label="Applications" value={applications.length} description={`${approvedApplications} approved`} icon={<UsersRound className="h-5 w-5" aria-hidden="true" />} onClick={() => onOpenSection("applications")} />
        <OverviewMetricCard label="Payments" value={payments.length} description={`${paidPayments.length} paid`} icon={<CreditCard className="h-5 w-5" aria-hidden="true" />} onClick={() => onOpenSection("payments")} />
        <OverviewMetricCard label="Inbox" value={contactCount} description="Current messages" icon={<Mail className="h-5 w-5" aria-hidden="true" />} onClick={() => onOpenSection("contacts")} />
        <OverviewMetricCard label="Content" value={publishedAssets} description="Programs, events, articles, gallery" icon={<FolderKanban className="h-5 w-5" aria-hidden="true" />} onClick={() => onOpenSection("programs")} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)_minmax(16rem,0.7fr)]">
        <section className="rounded-[1rem] bg-white p-4 shadow-[0_12px_30px_rgba(23,63,51,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-[#173f33]">Live Balance</h2>
            <span className="rounded-full bg-[#edf2ef] px-3 py-1.5 text-xs font-black text-[#607366]">Current</span>
          </div>
          <div className="mt-5 h-44 rounded-[0.9rem] bg-[linear-gradient(180deg,#fbfdfb_0%,#f2f6f3_100%)] p-4">
            <div className="relative flex h-full items-end gap-3">
              <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-[#dfe7e2]" />
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#dfe7e2]" />
              <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-[#dfe7e2]" />
              {liveBars.map((value, index) => (
                <div key={`${value}-${index}`} className="relative z-10 flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-[0.7rem] bg-[#077b76]" style={{ height: `${Math.max(10, (value / maxLiveBar) * 100)}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Admissions" value={applications.length} />
            <MiniStat label="Payments" value={payments.length} />
            <MiniStat label="Messages" value={contactCount} />
          </div>
        </section>

        <section className="rounded-[1rem] bg-white p-4 shadow-[0_12px_30px_rgba(23,63,51,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-[#173f33]">Payments</h2>
            <span className="text-xs font-black text-[#077b76]">Live</span>
          </div>
          <p className="mt-3 text-xs font-semibold text-[#718477]">Paid amount</p>
          <p className="mt-1 text-3xl font-black text-[#173f33]">{formatRupees(paidAmountPaise)}</p>
          <p className="mt-2 text-xs font-semibold text-[#607366]">Total initiated: {formatRupees(totalPaymentAmountPaise)}</p>
          <div className="mt-5 rounded-[1rem] bg-[#eef5ef] p-4">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-[1rem] border-[#077b76] bg-[#fffdf8]">
              <span className="text-xl font-black text-[#173f33]">{payments.length ? Math.round((paidPayments.length / payments.length) * 100) : 0}%</span>
            </div>
          </div>
        </section>

        <section className="rounded-[1rem] bg-white p-4 text-center shadow-[0_12px_30px_rgba(23,63,51,0.06)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff8df] text-[#d9931f]">
            <BadgeMark />
          </div>
          <h2 className="mt-4 text-lg font-black text-[#173f33]">System Status</h2>
          <p className="mt-1 text-sm font-semibold text-[#607366]">Live admin state</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <MiniStat label="Programs" value={programs.length} />
            <MiniStat label="Events" value={events.length} />
            <MiniStat label="Media" value={galleryImages.length} />
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
        <section className="rounded-[1rem] bg-white p-4 shadow-[0_12px_30px_rgba(23,63,51,0.06)]">
          <h2 className="text-lg font-black text-[#173f33]">Review Queue</h2>
          <div className="mt-4 grid gap-3">
            {reviewRows.map((row) => (
              <button key={row.label} onClick={() => onOpenSection(row.view)} className="flex items-center justify-between rounded-[0.9rem] bg-[#f7faf7] px-4 py-3 text-left">
                <span className="text-sm font-black text-[#173f33]">{row.label}</span>
                <span className="rounded-full bg-[#173f33] px-3 py-1 text-xs font-black text-[#fff9ec]">{row.value}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[1rem] bg-white p-4 shadow-[0_12px_30px_rgba(23,63,51,0.06)]">
          <h2 className="text-lg font-black text-[#173f33]">Recent Payments</h2>
          <div className="mt-4 grid gap-3">
            {recentPayments.length ? recentPayments.map((payment) => (
              <div key={payment.id} className="rounded-[0.9rem] bg-[#f7faf7] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-black text-[#173f33]">{payment.application.candidateName}</p>
                  <span className="text-xs font-black text-[#077b76]">{formatRupees(payment.amountPaise)}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-[#607366]">{payment.status} - {formatDateTime(payment.createdAt)}</p>
              </div>
            )) : (
              <p className="rounded-[0.9rem] bg-[#f7faf7] px-4 py-6 text-center text-sm font-semibold text-[#607366]">No payment records yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function deriveBatchCode(program: Program, index: number) {
  const initials = program.title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "BT";

  const date = program.batchStartsAt ? new Date(program.batchStartsAt) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return `${initials}-${String(index + 1).padStart(2, "0")}`;
  }

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${initials}-${year}${month}`;
}

function getCurrentBatchSnapshot(programs: Program[], applications: TrainingApplicationRecord[]) {
  const now = Date.now();
  const sortedPrograms = [...programs].sort((left, right) => {
    const leftTime = left.batchStartsAt ? new Date(left.batchStartsAt).getTime() : Number.POSITIVE_INFINITY;
    const rightTime = right.batchStartsAt ? new Date(right.batchStartsAt).getTime() : Number.POSITIVE_INFINITY;
    return leftTime - rightTime;
  });

  const startedProgram =
    [...sortedPrograms]
      .filter((program) => program.batchStartsAt && new Date(program.batchStartsAt).getTime() <= now)
      .at(-1) ?? null;

  const upcomingProgram =
    sortedPrograms.find((program) => program.batchStartsAt && new Date(program.batchStartsAt).getTime() > now) ?? null;

  const program = startedProgram ?? upcomingProgram ?? sortedPrograms[0] ?? null;
  if (!program) return null;

  const programIndex = sortedPrograms.findIndex((entry) => entry.id === program.id);
  const joinedCount = applications.filter(
    (application) =>
      application.payload.serviceName.trim().toLowerCase() === program.title.trim().toLowerCase() &&
      application.payload.approvalStatus === "APPROVED",
  ).length;

  const capacity = Math.max(0, program.capacity || 0);
  const vacancies = Math.max(0, capacity - joinedCount);
  const startTime = program.batchStartsAt ? new Date(program.batchStartsAt).getTime() : null;
  const hasStarted = startTime !== null && !Number.isNaN(startTime) && startTime <= now;
  const statusLabel = hasStarted ? "Already started" : program.enrollmentClosed ? "Enrollment closed" : "Upcoming";

  return {
    program,
    batchCode: deriveBatchCode(program, Math.max(programIndex, 0)),
    joinedCount,
    vacancies,
    capacity,
    statusLabel,
  };
}

function OverviewMetricCard({
  label,
  value,
  description,
  icon,
  onClick,
}: {
  label: string;
  value: number;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[8.2rem] rounded-[1rem] bg-white p-4 text-left shadow-[0_12px_30px_rgba(23,63,51,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(23,63,51,0.1)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[#fff8df] text-[#d9931f]">
          {icon}
        </span>
        <span className="rounded-full bg-[#eef5ef] px-2.5 py-1 text-[10px] font-black text-[#077b76]">Live</span>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold text-[#607366]">{label}</p>
        <div className="mt-1">
          <p className="text-3xl font-black leading-none text-[#173f33]">{value.toLocaleString("en-IN")}</p>
        </div>
        <p className="mt-3 text-xs font-semibold text-[#718477]">{description}</p>
      </div>
    </button>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[0.85rem] bg-[#f7faf7] px-3 py-2">
      <p className="text-[11px] font-semibold text-[#718477]">{label}</p>
      <p className="mt-1 text-lg font-black text-[#173f33]">{value.toLocaleString("en-IN")}</p>
    </div>
  );
}

function formatRupees(amountPaise: number) {
  return `Rs. ${(amountPaise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function BadgeMark() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-current">
      <Check className="h-3 w-3" aria-hidden="true" />
    </span>
  );
}

function CurrentBatchCard({
  applications,
  programs,
  theme,
}: {
  applications: TrainingApplicationRecord[];
  programs: Program[];
  theme: SectionTheme;
}) {
  const snapshot = getCurrentBatchSnapshot(programs, applications);

  if (!snapshot) {
    return (
      <section className={`rounded-[1.45rem] border p-4 shadow-[0_18px_38px_rgba(10,5,4,0.11)] ${theme.panelShell}`}>
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9c6a18]">Current batch</p>
        <p className="mt-3 text-sm font-semibold text-[#607366]">No batch is configured yet.</p>
      </section>
    );
  }

  return (
    <section className={`rounded-[1.3rem] border p-3.5 shadow-[0_16px_32px_rgba(10,5,4,0.1)] ${theme.panelShell}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9c6a18]">Current batch</p>
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#173f33]">{snapshot.batchCode}</span>
          </div>
          <p className="mt-1.5 truncate text-sm font-semibold text-[#173f33]">{snapshot.program.title}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${theme.badge}`}>
          {snapshot.statusLabel}
        </span>
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-4">
        <div className={`rounded-[0.95rem] border px-3 py-2.5 ${theme.panelSurface}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Joined</p>
          <p className="mt-1 text-xl font-semibold text-[#173f33]">{snapshot.joinedCount}</p>
        </div>
        <div className={`rounded-[0.95rem] border px-3 py-2.5 ${theme.panelSurface}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Vacancies</p>
          <p className="mt-1 text-xl font-semibold text-[#173f33]">{snapshot.vacancies}</p>
        </div>
        <div className={`rounded-[0.95rem] border px-3 py-2.5 ${theme.panelSurface}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Capacity</p>
          <p className="mt-1 text-xl font-semibold text-[#173f33]">{snapshot.capacity}</p>
        </div>
        <div className={`rounded-[0.95rem] border px-3 py-2.5 ${theme.panelSurface}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">Starts</p>
          <p className="mt-1 text-[13px] font-semibold text-[#173f33]">
            {snapshot.program.batchStartsAt ? formatDateTime(snapshot.program.batchStartsAt) : "Not set"}
          </p>
        </div>
      </div>
    </section>
  );
}

function DashboardSection({
  view,
  eyebrow,
  title,
  className = "",
  children,
}: {
  view: DashboardView;
  eyebrow: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  const theme = SECTION_THEMES[view];

  return (
    <section className={`rounded-[1.65rem] border p-5 shadow-[0_24px_60px_rgba(64,44,8,0.08)] ${theme.panelShell} ${className}`}>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9c6a18]">{eyebrow}</p>
        {title ? <h2 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">{title}</h2> : null}
      </div>
      <div className={title ? "mt-4" : "mt-2"}>{children}</div>
    </section>
  );
}

function ScheduleActionRow({
  label,
  schedules,
  onSchedule,
}: {
  section: HistorySection;
  label: string;
  schedules: PublishSchedule[];
  onSchedule: (label: string, publishAt: string) => void;
}) {
  const [scheduleAt, setScheduleAt] = useState("");
  const nextSchedule = schedules.find((schedule) => !schedule.published) ?? schedules[0];

  return (
    <div className="min-w-0 rounded-[1.35rem] border border-[rgba(27,59,43,0.08)] bg-[#f8f4ea] p-3">
      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto]">
        <input
          type="datetime-local"
          className={fieldClass()}
          value={scheduleAt}
          onChange={(event) => setScheduleAt(event.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            onSchedule(label, scheduleAt);
            setScheduleAt("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#fff9ec]"
        >
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          Schedule
        </button>
      </div>
      {nextSchedule ? (
        <p className="mt-2 text-xs leading-6 text-[#607366]">
          Next scheduled publish: {formatDateTime(nextSchedule.publishAt)}
        </p>
      ) : null}
    </div>
  );
}

function EventsWorkspace({
  disabled,
  events,
  draft,
  schedules,
  onOpenHistory,
  onSchedule,
  onDraftChange,
  onDraftSave,
  onEventSave,
  onEventDelete,
}: {
  disabled: boolean;
  events: EventItem[];
  draft: Omit<EventItem, "id">;
  schedules: PublishSchedule[];
  onOpenHistory: () => void;
  onSchedule: (label: string, publishAt: string) => void;
  onDraftChange: (next: Omit<EventItem, "id">) => void;
  onDraftSave: () => void;
  onEventSave: (body: EventItem) => void;
  onEventDelete: (id: string) => void;
}) {
  const [selectedEventId, setSelectedEventId] = useState<string | "new">(events[0]?.id ?? "new");
  const selectedEvent =
    selectedEventId === "new" ? null : events.find((event) => event.id === selectedEventId) ?? events[0] ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.52)] p-4">
        <div className="rounded-[1.5rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(64,44,8,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9c6a18]">Existing events</p>
            <div className="rounded-full bg-[#f6efe4] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#607366]">
              {events.length}
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {events.map((event, index) => (
              <button
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className={`rounded-[1.3rem] border px-4 py-4 text-left transition ${
                  selectedEventId === event.id
                    ? "border-[rgba(23,63,51,0.18)] bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.14)]"
                    : "border-[rgba(27,59,43,0.08)] bg-[#faf7ef] text-[#173f33] hover:bg-[#f3ecdf]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${selectedEventId === event.id ? "bg-[rgba(255,255,255,0.14)] text-[#f5c65e]" : "bg-[#fffdf8] text-[#9c6a18]"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${event.published ? selectedEventId === event.id ? "bg-[rgba(255,255,255,0.14)] text-[#e4f6ea]" : "bg-[#eef8f1] text-[#21533f]" : selectedEventId === event.id ? "bg-[rgba(255,255,255,0.14)] text-[#fff2d7]" : "bg-[#fff5ea] text-[#8c4d1e]"}`}>
                    {event.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-black uppercase tracking-[0.12em]">{event.title}</p>
                <p className={`mt-2 text-sm leading-6 ${selectedEventId === event.id ? "text-[#dde4dc]" : "text-[#607366]"}`}>
                  {event.status} | {event.location}
                </p>
                <p className={`mt-1 text-xs font-semibold ${selectedEventId === event.id ? "text-[#f4e7bd]" : "text-[#8a7d61]"}`}>
                  {event.startsAt ? `Starts ${formatDateTime(event.startsAt)}` : "Start date not set"}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(23,63,51,0.12)] bg-[#f8f4ea] px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#173f33]"
          >
            <History className="h-4 w-4" aria-hidden="true" />
            History
          </button>
          <button
            type="button"
            onClick={() => setSelectedEventId("new")}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
              selectedEventId === "new"
                ? "bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)]"
                : "bg-[#f5c65e] text-[#173f33]"
            }`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New event
          </button>
        </div>

        <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.52)] p-4">
          {selectedEvent ? (
            <EventRow
              key={`${selectedEvent.id}-${selectedEvent.updatedAt ?? ""}`}
              disabled={disabled}
              event={selectedEvent}
              schedules={schedules}
              onSchedule={onSchedule}
              onSave={onEventSave}
              onDelete={() => onEventDelete(selectedEvent.id)}
            />
          ) : (
            <RecordCard
              eyebrow="New event"
              title="Create event listing"
              metadata="Build a publish-ready event with timing, location, and public summary."
              disabled={disabled}
              onSave={onDraftSave}
              onDelete={() => onDraftChange(emptyEvent)}
              saveLabel="Create event"
              deleteLabel="Delete draft"
              schedules={schedules}
              section="events"
              scheduleLabel={draft.title || "New event draft"}
              onSchedule={onSchedule}
            >
              <EventFields value={draft} onChange={onDraftChange} />
            </RecordCard>
          )}
        </div>
      </div>
    </div>
  );
}

function ArticlesWorkspace({
  articles,
  draft,
  schedules,
  onOpenHistory,
  onSchedule,
  onDraftChange,
  onDraftSave,
  onArticleSave,
  onArticleDelete,
}: {
  articles: ArticleItem[];
  draft: Omit<ArticleItem, "id">;
  schedules: PublishSchedule[];
  onOpenHistory: () => void;
  onSchedule: (label: string, publishAt: string) => void;
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

      <div className="grid gap-4">
        <div className="flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(23,63,51,0.12)] bg-[#f8f4ea] px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#173f33]"
          >
            <History className="h-4 w-4" aria-hidden="true" />
            History
          </button>
          <button
            type="button"
            onClick={() => setSelectedArticleId("new")}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
              selectedArticleId === "new"
                ? "bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)]"
                : "bg-[#f5c65e] text-[#173f33]"
            }`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New article
          </button>
        </div>

        <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.52)] p-4">
          {selectedArticle ? (
            <ArticleEditorCard
              key={selectedArticle.id}
              article={selectedArticle}
              schedules={schedules}
              onSchedule={onSchedule}
              onSave={onArticleSave}
              onDelete={onArticleDelete}
            />
          ) : (
            <article className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">New article</p>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">Create article</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onDraftChange(emptyArticle)}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(146,70,45,0.16)] bg-[#fff8f5] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#92462d]"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete draft
                </button>
              </div>
              <ArticleFields value={draft} onChange={onDraftChange} />
              <div className="mt-5 grid gap-3 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-start">
                <button
                  onClick={onDraftSave}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] transition hover:bg-[#204d3f]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add new article
                </button>
                <ScheduleActionRow
                  section="articles"
                  label={draft.title || "New article draft"}
                  schedules={schedules}
                  onSchedule={onSchedule}
                />
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgramsWorkspace({
  databaseConfigured,
  disabled,
  programs,
  draft,
  schedules,
  onOpenHistory,
  onSchedule,
  onDraftChange,
  onDraftSave,
  onProgramSave,
  onProgramDelete,
}: {
  databaseConfigured: boolean;
  disabled: boolean;
  programs: Program[];
  draft: Omit<Program, "id">;
  schedules: PublishSchedule[];
  onOpenHistory: () => void;
  onSchedule: (label: string, publishAt: string) => void;
  onDraftChange: (next: Omit<Program, "id">) => void;
  onDraftSave: () => void;
  onProgramSave: (program: Program) => void;
  onProgramDelete: (id: string) => void;
}) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | "new">(programs[0]?.id ?? "new");
  const [programListCollapsed, setProgramListCollapsed] = useState(false);
  const selectedProgram =
    selectedProgramId === "new"
      ? null
      : programs.find((program) => program.id === selectedProgramId) ?? programs[0] ?? null;
  const upcomingPrograms = [...programs].sort((left, right) => {
    const leftTime = left.batchStartsAt ? new Date(left.batchStartsAt).getTime() : Number.MAX_SAFE_INTEGER;
    const rightTime = right.batchStartsAt ? new Date(right.batchStartsAt).getTime() : Number.MAX_SAFE_INTEGER;
    return leftTime - rightTime;
  });

  function discardNewTrainingDraft() {
    onDraftChange(emptyProgram);
    setSelectedProgramId(programs[0]?.id ?? "new");
  }

  return (
    <div className="grid gap-4">
      <section className="overflow-hidden rounded-[1.8rem] bg-white shadow-[0_18px_42px_rgba(23,63,51,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2ee] px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9c6a18]">Training</p>
              <h3 className="mt-1 text-2xl font-black text-[#173f33]">Upcoming programs</h3>
            </div>
            <span className="rounded-full bg-[#eef3ef] px-3 py-1.5 text-xs font-black text-[#607366]">{programs.length} programs</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenHistory}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f7faf7] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#173f33]"
            >
              <History className="h-4 w-4" aria-hidden="true" />
              History
            </button>
            <button
              onClick={() => setSelectedProgramId("new")}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-black transition ${
                selectedProgramId === "new"
                  ? "bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)]"
                  : "bg-[#f5c65e] text-[#173f33]"
              }`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New training
            </button>
          </div>
        </div>

        <div
          className={`grid gap-4 bg-[#f5f6f3] p-4 transition-[grid-template-columns] ${
            programListCollapsed ? "xl:grid-cols-[5rem_minmax(0,1fr)]" : "xl:grid-cols-[22rem_minmax(0,1fr)]"
          }`}
        >
          <aside className="min-w-0 rounded-[1.15rem] bg-[#eef1ed] p-3">
            <div className={`flex items-center gap-3 px-1 pb-3 ${programListCollapsed ? "justify-center" : "justify-between"}`}>
              {!programListCollapsed ? (
                <div>
                  <p className="text-sm font-black text-[#173f33]">Upcoming</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#718477]">Existing training programs</p>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setProgramListCollapsed((current) => !current)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#173f33] shadow-[0_8px_18px_rgba(23,63,51,0.08)]"
                aria-label={programListCollapsed ? "Expand program list" : "Collapse program list"}
              >
                {programListCollapsed ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : <ChevronLeft className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            <div className={`grid gap-3 ${programListCollapsed ? "justify-items-center" : ""}`}>
              {upcomingPrograms.length ? (
                upcomingPrograms.map((program, index) =>
                  programListCollapsed ? (
                    <button
                      key={program.id}
                      type="button"
                      onClick={() => setSelectedProgramId(program.id)}
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-xs font-black ${
                        selectedProgramId === program.id ? "bg-[#173f33] text-[#fff9ec]" : "bg-white text-[#9c6a18]"
                      }`}
                      title={program.title}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  ) : (
                    <ProgramKanbanCard
                      key={program.id}
                      program={program}
                      selected={selectedProgramId === program.id}
                      index={index}
                      onSelect={() => setSelectedProgramId(program.id)}
                    />
                  ),
                )
              ) : (
                <div className="rounded-[0.95rem] border border-dashed border-[#dce4de] bg-white/65 px-3 py-8 text-center text-xs font-semibold text-[#718477]">
                  No training programs yet
                </div>
              )}
            </div>
          </aside>

          <div className="min-w-0 rounded-[1.15rem] bg-white p-4 shadow-[0_12px_28px_rgba(23,63,51,0.06)]">
            {selectedProgram ? (
              <>
                <div className="mb-4 grid gap-3 rounded-[1.1rem] bg-[#f7faf7] p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9c6a18]">Preview</p>
                    <h4 className="mt-1 text-2xl font-black text-[#173f33]">{selectedProgram.title || "Untitled training"}</h4>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#607366]">{selectedProgram.summary || "No summary added yet."}</p>
                  </div>
                  <div className="grid gap-2 text-right text-xs font-black text-[#607366]">
                    <span className="rounded-full bg-white px-3 py-1.5">{selectedProgram.duration}</span>
                    <span className="rounded-full bg-white px-3 py-1.5">{selectedProgram.capacity} seats</span>
                    <span className="rounded-full bg-white px-3 py-1.5">{selectedProgram.published ? "Published" : "Draft"}</span>
                  </div>
                </div>
                <ProgramEditorCard
                  key={selectedProgram.id}
                  disabled={disabled}
                  program={selectedProgram}
                  schedules={schedules}
                  onSchedule={onSchedule}
                  onSave={onProgramSave}
                  onDelete={onProgramDelete}
                />
              </>
            ) : (
              <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">New training</p>
                    <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">Create training service</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {!databaseConfigured ? (
                      <span className="rounded-full bg-[#fff5ea] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8c4d1e]">
                        Read only
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={discardNewTrainingDraft}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(146,70,45,0.16)] bg-[#fff8f5] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#92462d]"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete draft
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <ProgramFields value={draft} onChange={onDraftChange} />
                </div>
                <div className="mt-5 grid gap-3 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-start">
                  <button
                    disabled={disabled}
                    onClick={onDraftSave}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-3 text-sm font-black text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)] transition hover:bg-[#204d3f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add new training
                  </button>
                  <ScheduleActionRow
                    section="programs"
                    label={draft.title || "New training draft"}
                    schedules={schedules}
                    onSchedule={onSchedule}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgramKanbanCard({
  program,
  selected,
  index,
  onSelect,
}: {
  program: Program;
  selected: boolean;
  index: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-[0.95rem] border p-3 text-left shadow-[0_8px_20px_rgba(23,63,51,0.06)] transition ${
        selected
          ? "border-[#173f33] bg-[#173f33] text-[#fff9ec]"
          : "border-[#e2e8e3] bg-white text-[#173f33] hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(23,63,51,0.10)]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${selected ? "bg-[rgba(255,255,255,0.14)] text-[#f5c65e]" : "bg-[#eef8f1] text-[#1f6b4b]"}`}>
          {program.level}
        </span>
        <span className={`text-[10px] font-semibold ${selected ? "text-[#d4e1d8]" : "text-[#718477]"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h4 className="mt-3 line-clamp-2 text-sm font-black leading-5">{program.title || "Untitled training"}</h4>
      <p className={`mt-2 line-clamp-2 text-xs leading-5 ${selected ? "text-[#d4e1d8]" : "text-[#607366]"}`}>
        {program.summary || "No summary added yet."}
      </p>
      <div className={`mt-3 grid gap-1 text-[11px] font-semibold ${selected ? "text-[#f4e7bd]" : "text-[#718477]"}`}>
        <span>{program.duration} | {program.capacity} seats</span>
        <span>
          {program.enrollmentClosed
            ? "Enrollment closed"
            : program.batchStartsAt
              ? `Starts ${formatDateTime(program.batchStartsAt)}`
              : "No start date"}
        </span>
        <span>Banner {program.popupEnabled ? "on" : "off"}</span>
      </div>
    </button>
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
        if (!file.type.startsWith("image/")) {
          throw new Error("Temporary inline storage supports images only right now.");
        }
        const optimized = await optimizeImageForInlineStorage(file, { maxSide: 1600 });

        onChange({
          ...value,
          mediaUrl: optimized.dataUrl,
          mediaObjectKey: "",
          mediaType: "IMAGE",
        });
        setNotice("Article image staged for saving.");
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Article media upload failed.");
      }
    });
  }

  return (
    <div className="rounded-[1.4rem] border border-[rgba(27,59,43,0.12)] bg-[#f8f4ea] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#718477]">Article media</p>
      <div className="mt-3 grid gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
          className="block w-full rounded-[1rem] border border-dashed border-[rgba(27,59,43,0.18)] bg-white px-3 py-3 text-sm text-[#173f33]"
        />
        <p className="text-xs font-semibold text-[#607366]">Temporary mode stores article images directly in the database.</p>

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
      <div className="grid gap-3">
        <label className="inline-flex items-center gap-2 rounded-xl bg-[#f3ecdf] px-3 py-2 text-sm font-semibold text-[#173f33]">
          <input type="checkbox" checked={value.published} onChange={(event) => onChange({ ...value, published: event.target.checked })} />
          Published on website
        </label>
        <div className="rounded-[1.2rem] border border-[rgba(27,59,43,0.1)] bg-[#f8f4ea] px-4 py-3">
          <button
            type="button"
            onClick={() => onChange({ ...value, popupEnabled: !value.popupEnabled })}
            className="flex w-full items-center justify-between gap-4 text-left"
            aria-pressed={value.popupEnabled}
          >
              <span>
                <span className="block text-sm font-semibold text-[#173f33]">Show in upcoming training banner</span>
              </span>
            <span
              className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition ${
                value.popupEnabled ? "bg-[#34c759]" : "bg-[#d3d9d4]"
              }`}
            >
              <span
                className={`h-6 w-6 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.16)] transition ${
                  value.popupEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
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
  schedules,
  onSchedule,
  onSave,
  onDelete,
  disabled,
}: {
  program: Program;
  schedules: PublishSchedule[];
  onSchedule: (label: string, publishAt: string) => void;
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
            Upcoming banner {draft.popupEnabled ? "enabled" : "disabled"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${draft.published ? "bg-[#eef8f1] text-[#21533f]" : "bg-[#fff5ea] text-[#8c4d1e]"}`}>
            {draft.published ? "Published" : "Draft"}
          </span>
          <button
            disabled={disabled}
            onClick={() => onDelete(program.id)}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(146,70,45,0.16)] bg-[#fff8f5] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#92462d] transition hover:bg-[#fbeee7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>

      <ProgramFields value={draft} onChange={setDraft} />

      <div className="mt-5 grid gap-3 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-start">
        <button
          disabled={disabled}
          onClick={() => onSave(draft)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] transition hover:bg-[#204d3f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save changes
        </button>
        <ScheduleActionRow
          section="programs"
          label={draft.title || "Untitled training"}
          schedules={schedules}
          onSchedule={onSchedule}
        />
      </div>
    </article>
  );
}

function EventRow({
  event,
  schedules,
  onSchedule,
  onSave,
  onDelete,
  disabled,
}: {
  event: EventItem;
  schedules: PublishSchedule[];
  onSchedule: (label: string, publishAt: string) => void;
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
      schedules={schedules}
      section="events"
      scheduleLabel={draft.title || "Untitled event"}
      onSchedule={onSchedule}
    >
      <EventFields value={draft} onChange={setDraft} />
    </RecordCard>
  );
}

function ArticleEditorCard({
  article,
  schedules,
  onSchedule,
  onSave,
  onDelete,
}: {
  article: ArticleItem;
  schedules: PublishSchedule[];
  onSchedule: (label: string, publishAt: string) => void;
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
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${draft.published ? "bg-[#eef8f1] text-[#21533f]" : "bg-[#fff5ea] text-[#8c4d1e]"}`}>
            {draft.published ? "Published" : "Draft"}
          </span>
          <button
            onClick={() => onDelete(article.id)}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(146,70,45,0.16)] bg-[#fff8f5] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#92462d] transition hover:bg-[#fbeee7]"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>

      <ArticleFields value={draft} onChange={setDraft} />

      <div className="mt-5 grid gap-3 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-start">
        <button
          onClick={() => onSave(article.id, draft)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] transition hover:bg-[#204d3f]"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save changes
        </button>
        <ScheduleActionRow
          section="articles"
          label={draft.title || "Untitled article"}
          schedules={schedules}
          onSchedule={onSchedule}
        />
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
  schedules,
  section,
  scheduleLabel,
  onSchedule,
  saveLabel = "Save changes",
  deleteLabel = "Delete",
}: {
  eyebrow: string;
  title: string;
  metadata: string;
  children: ReactNode;
  onSave: () => void;
  onDelete: () => void;
  disabled: boolean;
  schedules: PublishSchedule[];
  section: HistorySection;
  scheduleLabel: string;
  onSchedule: (label: string, publishAt: string) => void;
  saveLabel?: string;
  deleteLabel?: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">{eyebrow}</p>
          <h3 className="font-display mt-2 text-2xl font-semibold text-[#173f33]">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-[#607366]">{metadata}</p>
        </div>
        <button
          disabled={disabled}
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(146,70,45,0.16)] bg-[#fff8f5] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#92462d] transition hover:bg-[#fbeee7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {deleteLabel}
        </button>
      </div>

      <div className="grid gap-3">{children}</div>

      <div className="mt-5 grid gap-3 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-start">
        <button
          disabled={disabled}
          onClick={onSave}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173f33] px-4 py-2.5 text-sm font-black text-[#fff9ec] transition hover:bg-[#204d3f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {saveLabel}
        </button>
        <ScheduleActionRow section={section} label={scheduleLabel} schedules={schedules} onSchedule={onSchedule} />
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
