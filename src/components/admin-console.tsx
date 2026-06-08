"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpenText,
  CalendarDays,
  FolderKanban,
  Layers3,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { ApplicationAdminPanel } from "@/components/application-admin-panel";
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
  initialEvents: EventItem[];
};

type DashboardView = "overview" | "programs" | "events" | "applications" | "articles";

const emptyProgram: Omit<Program, "id"> = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  duration: "",
  level: "FOUNDATION",
  fee: "",
  capacity: 30,
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

const sampleArticles: ArticleItem[] = [
  {
    id: "article-queen-strength",
    title: "Managing Bee Colonies in High Temperature Without Losing Strength",
    slug: "managing-bee-colonies-in-high-temperature-without-losing-strength",
    excerpt: "A practical field note on summer hive care, airflow, shade, and hydration management for colony stability.",
    body:
      "High temperature can place major pressure on colonies when airflow, shade, and water access are not managed in time. This article outlines simple steps for reducing heat stress, keeping brood areas stable, protecting worker activity, and avoiding unnecessary colony weakening during peak seasonal stress.\n\nThe guidance is written for field teams, trainees, and rural beekeepers who need direct, practical actions rather than theory-heavy instructions.",
    category: "Field management",
    publishedAt: "2026-06-14T10:00",
    authorName: "API CULTURE Editorial Desk",
    authorRole: "Training and Field Team",
    externalLink: "",
    keyPoints: "Shade near apiary\nWater source nearby\nReduce comb overheating",
    seoTitle: "Managing Bee Colonies in High Temperature",
    metaDescription: "Practical field methods for keeping bee colonies stable during high summer temperatures.",
    published: true,
  },
  {
    id: "article-honey-production",
    title: "How To Select a Bee Honey Production During Monsoon Season in Beekeeping",
    slug: "how-to-select-a-bee-honey-production-during-monsoon-season-in-beekeeping",
    excerpt: "Monsoon conditions change forage, moisture, and disease pressure, so honey production decisions must stay seasonal.",
    body:
      "Monsoon season requires more careful honey production planning because forage conditions, hive moisture, and colony strength may shift quickly. This article helps trainees understand when to hold back, when to inspect, and how to judge whether conditions are suitable for honey-focused management.\n\nThe note is meant for application in training discussions, field visits, and extension support.",
    category: "Seasonal guidance",
    publishedAt: "2026-06-18T09:30",
    authorName: "API CULTURE Training Wing",
    authorRole: "Seasonal Practice Unit",
    externalLink: "",
    keyPoints: "Check forage availability\nWatch humidity levels\nPrevent fungal pressure",
    seoTitle: "Monsoon Season Honey Production in Beekeeping",
    metaDescription: "Seasonal considerations for planning honey production during monsoon conditions.",
    published: true,
  },
  {
    id: "article-pollination",
    title: "Poor Pollination in Crop Fields: How Better Bee Placement Can Improve Results",
    slug: "poor-pollination-in-crop-fields-how-better-bee-placement-can-improve-results",
    excerpt: "Placement strategy matters. Small shifts in colony position can improve pollination effectiveness across crop fields.",
    body:
      "When pollination results remain weak, the issue is not always colony count alone. Field placement, distance from bloom concentration, shade, access routes, and crop timing all influence how well bees support pollination activity.\n\nThis article provides a field-oriented explanation that can be used in training sessions and institutional advisory work.",
    category: "Pollination support",
    publishedAt: "2026-06-22T08:45",
    authorName: "API CULTURE Extension Team",
    authorRole: "Crop Interface Support",
    externalLink: "",
    keyPoints: "Place near bloom density\nAvoid blocked flight paths\nReview field spread",
    seoTitle: "Better Bee Placement for Crop Pollination",
    metaDescription: "Why bee placement strategy can improve pollination performance across crop fields.",
    published: true,
  },
];

const emptyArticle: Omit<ArticleItem, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  category: "",
  publishedAt: new Date().toISOString().slice(0, 16),
  authorName: "",
  authorRole: "",
  externalLink: "",
  keyPoints: "",
  seoTitle: "",
  metaDescription: "",
  published: true,
};

export function AdminConsole({
  databaseConfigured,
  initialApplications,
  initialPrograms,
  initialEvents,
}: Props) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [programDraft, setProgramDraft] = useState(emptyProgram);
  const [eventDraft, setEventDraft] = useState(emptyEvent);
  const [articles, setArticles] = useState<ArticleItem[]>(sampleArticles);
  const [articleDraft, setArticleDraft] = useState<Omit<ArticleItem, "id">>(emptyArticle);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<DashboardView>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const applicationSummary = useMemo(() => {
    const ready = initialApplications.filter(
      (application) =>
        application.payload.crossCheckStatus === "VERIFIED" &&
        application.payload.paymentStatus === "PAID" &&
        application.payload.approvalStatus === "PENDING",
    ).length;

    return {
      total: initialApplications.length,
      approved: initialApplications.filter((application) => application.payload.approvalStatus === "APPROVED").length,
      ready,
    };
  }, [initialApplications]);

  const overviewCards = [
    {
      label: "Published services",
      value: programs.filter((program) => program.published).length,
      detail: `${programs.length} total training services`,
      icon: <FolderKanban className="h-5 w-5" aria-hidden="true" />,
      accent: "from-[#173f33] to-[#2a5a49]",
    },
    {
      label: "Live events",
      value: events.filter((event) => event.published && event.status === "UPCOMING").length,
      detail: `${events.length} event records managed`,
      icon: <CalendarDays className="h-5 w-5" aria-hidden="true" />,
      accent: "from-[#7f4f16] to-[#b87716]",
    },
    {
      label: "Applications",
      value: applicationSummary.total,
      detail: `${applicationSummary.ready} ready for decision`,
      icon: <UsersRound className="h-5 w-5" aria-hidden="true" />,
      accent: "from-[#5e3d7c] to-[#915dc0]",
    },
    {
      label: "Approved learners",
      value: applicationSummary.approved,
      detail: "Cleared to join services",
      icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
      accent: "from-[#285c46] to-[#4c9470]",
    },
  ];

  const viewItems: { id: DashboardView; label: string; description: string; icon: ReactNode }[] = [
    { id: "overview", label: "Overview", description: "Daily picture", icon: <Layers3 className="h-4 w-4" aria-hidden="true" /> },
    { id: "programs", label: "Training", description: "Training catalog", icon: <FolderKanban className="h-4 w-4" aria-hidden="true" /> },
    { id: "events", label: "Events", description: "Schedule control", icon: <CalendarDays className="h-4 w-4" aria-hidden="true" /> },
    { id: "applications", label: "Applications", description: "Admissions desk", icon: <UsersRound className="h-4 w-4" aria-hidden="true" /> },
    { id: "articles", label: "Articles", description: "Content publishing", icon: <BookOpenText className="h-4 w-4" aria-hidden="true" /> },
  ];
  async function load() {
    if (!databaseConfigured) {
      setNotice("Local preview is running without DATABASE_URL. You can review the layout, but save actions stay disabled until a database is connected.");
      return;
    }

    setLoading(true);
    setNotice("");
    try {
      const [programResponse, eventResponse] = await Promise.all([fetch("/api/admin/programs"), fetch("/api/admin/events")]);
      if (programResponse.status === 401 || eventResponse.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!programResponse.ok || !eventResponse.ok) {
        setNotice("Unable to refresh the dashboard right now.");
        return;
      }
      setPrograms(await programResponse.json());
      setEvents(await eventResponse.json());
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
    if (!articleDraft.title.trim()) {
      setNotice("Article title is required.");
      return;
    }

    const slug = (articleDraft.slug || articleDraft.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setArticles((current) => [
      {
        id: `article-${Date.now()}`,
        ...articleDraft,
        slug,
      },
      ...current,
    ]);
    setArticleDraft(emptyArticle);
    setNotice("Article draft added to the article workspace.");
  }

  function updateArticle(id: string, next: ArticleItem) {
    setArticles((current) => current.map((article) => (article.id === id ? next : article)));
    setNotice("Article changes saved in the workspace.");
  }

  function deleteArticle(id: string) {
    setArticles((current) => current.filter((article) => article.id !== id));
    setNotice("Article removed from the workspace.");
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
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#f5c65e]">Admin navigation</p>
                <h2 className="font-display mt-2 text-3xl font-semibold">Command deck</h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-full border border-[rgba(255,249,236,0.18)] p-2 text-[#fff9ec]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-6 grid gap-3">
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

      <div className="mt-4 grid gap-6 lg:mt-0 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[2rem] bg-[#173f33] p-5 text-[#fff9ec] shadow-[0_24px_60px_rgba(23,63,51,0.2)]">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#f5c65e]">Admin navigation</p>
            <h2 className="font-display mt-3 text-3xl font-semibold">Command deck</h2>
            <p className="mt-3 text-sm leading-7 text-[#d7e1db]">
              All main sections sit here on the left so the dashboard stays easy to move through.
            </p>

            <nav className="mt-6 grid gap-3">
              {viewItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left transition ${
                    view === item.id
                      ? "bg-[#fff9ec] text-[#173f33]"
                      : "border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.06)] text-[#fff9ec] hover:bg-[rgba(255,255,255,0.1)]"
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

            <div className="mt-6 rounded-[1.4rem] border border-[rgba(255,249,236,0.14)] bg-[rgba(255,255,255,0.06)] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f5c65e]">Quick actions</p>
              <div className="mt-4 grid gap-3">
                <button
                  disabled={loading}
                  onClick={load}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5c65e] px-4 py-2.5 text-sm font-black text-[#173f33] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4${loading ? " animate-spin" : ""}`} aria-hidden="true" />
                  Refresh data
                </button>
                <form action="/api/admin/logout" method="post">
                  <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(255,249,236,0.2)] px-4 py-2.5 text-sm font-black text-[#fff9ec]">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        <div className="grid gap-8">
          {notice ? (
            <div className="rounded-[1.5rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-5 py-4 text-sm font-semibold text-[#173f33] shadow-[0_14px_30px_rgba(64,44,8,0.06)]">
              {notice}
            </div>
          ) : null}

          {view === "overview" ? (
            <section className="grid gap-4">
              <div className="rounded-[1.75rem] bg-[#173f33] p-5 text-[#fff9ec] shadow-[0_24px_50px_rgba(23,63,51,0.18)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#f5c65e]">
                    <Layers3 className="h-4 w-4" aria-hidden="true" />
                    Today at a glance
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d9dfd5]">Quick operational summary</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {overviewCards.map((card) => (
                    <CompactOverviewCard key={card.label} card={card} />
                  ))}
                </div>
              </div>
            </section>
          ) : null}

      {view === "overview" ? (
        <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <DashboardSection
            eyebrow="Training services"
            title="Published catalog and drafting flow"
            description="Keep the application-facing training list current. Use one section to create services and another to edit or remove existing services."
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <TaskLane
                eyebrow="Service creation"
                title="Add a new training service"
                description="Create new training programs here with learner-friendly details."
              >
                <EditorPanel
                  disabled={loading || !databaseConfigured}
                  title="Create service"
                  description="Add a new training service with clear learner-facing information."
                  actionLabel="Create service"
                  onSave={() => mutate("/api/admin/programs", "POST", programDraft).then((ok) => ok && setProgramDraft(emptyProgram))}
                >
                  <ProgramFields value={programDraft} onChange={setProgramDraft} />
                </EditorPanel>
              </TaskLane>
              <TaskLane
                eyebrow="Service maintenance"
                title="Edit, publish, or remove services"
                description="All existing programs stay together here so updates and deletions happen in one place."
              >
                <div className="grid gap-4">
                  {programs.slice(0, 3).map((program) => (
                    <ProgramRow
                      key={`${program.id}-${program.updatedAt ?? ""}`}
                      disabled={loading || !databaseConfigured}
                      program={program}
                      onSave={(body) => mutate(`/api/admin/programs/${program.id}`, "PATCH", body)}
                      onDelete={() => mutate(`/api/admin/programs/${program.id}`, "DELETE")}
                    />
                  ))}
                </div>
              </TaskLane>
            </div>
          </DashboardSection>

          <DashboardSection
            eyebrow="Admissions"
            title="Approval pipeline"
            description="The applications desk remains focused on applicant review, payment confirmation, and approval decisions."
          >
            <div className="grid gap-4">
              <MiniStatCard label="Pending review" value={applicationSummary.total - applicationSummary.approved} tone="warm" />
              <MiniStatCard label="Ready to approve" value={applicationSummary.ready} tone="forest" />
              <MiniStatCard label="Approved learners" value={applicationSummary.approved} tone="gold" />
              <button
                onClick={() => setView("applications")}
                className="rounded-[1.4rem] bg-[#173f33] px-5 py-4 text-left text-[#fff9ec] shadow-[0_16px_34px_rgba(23,63,51,0.16)] transition hover:bg-[#204d3f]"
              >
                <span className="block text-xs font-black uppercase tracking-[0.2em] text-[#f5c65e]">Open review desk</span>
                <span className="mt-2 block text-lg font-semibold">Go to application handling</span>
                <span className="mt-1 block text-sm text-[#dde4dc]">Use filters, notes, payment status, and cross-check controls in one place.</span>
              </button>
            </div>
          </DashboardSection>
        </section>
      ) : null}

      {view === "programs" ? (
        <DashboardSection
          eyebrow="Training manager"
          title="Manage training services"
          description="Use a focused training index to open one program at a time, edit it cleanly, or start a new training from the command deck."
          className="mt-8"
        >
          <ProgramsWorkspace
            databaseConfigured={databaseConfigured}
            disabled={loading || !databaseConfigured}
            programs={programs}
            draft={programDraft}
            onDraftChange={setProgramDraft}
            onDraftSave={() => mutate("/api/admin/programs", "POST", programDraft).then((ok) => ok && setProgramDraft(emptyProgram))}
            onProgramSave={(program) => mutate(`/api/admin/programs/${program.id}`, "PATCH", program)}
            onProgramDelete={(id) => mutate(`/api/admin/programs/${id}`, "DELETE")}
          />
        </DashboardSection>
      ) : null}

      {view === "events" ? (
        <DashboardSection
          eyebrow="Event planner"
          title="Schedule orientations and field sessions"
          description="Use the event board for public training touchpoints, demos, and attendance-driving announcements."
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
                onSave={() => mutate("/api/admin/events", "POST", eventDraft).then((ok) => ok && setEventDraft(emptyEvent))}
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
                    onSave={(body) => mutate(`/api/admin/events/${event.id}`, "PATCH", body)}
                    onDelete={() => mutate(`/api/admin/events/${event.id}`, "DELETE")}
                  />
                ))}
              </div>
            </TaskLane>
          </div>
        </DashboardSection>
      ) : null}

      {view === "applications" ? (
        <div className="mt-8">
          <ApplicationAdminPanel databaseConfigured={databaseConfigured} initialApplications={initialApplications} />
        </div>
      ) : null}

      {view === "articles" ? (
        <DashboardSection
          eyebrow="Article manager"
          title="Manage Articles"
          description="Create articles, publish field guidance, and maintain knowledge records for training, rural work, and institutional communication."
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
    </div>
  );
}

function DashboardSection({
  eyebrow,
  title,
  description,
  className = "",
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`rounded-[2rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(246,239,228,0.98))] p-6 shadow-[0_24px_60px_rgba(64,44,8,0.08)] ${className}`}>
      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9c6a18]">{eyebrow}</p>
      <h2 className="font-display mt-3 text-3xl font-semibold text-[#173f33]">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#607366]">{description}</p>
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
          <ArticleEditorCard article={selectedArticle} onSave={onArticleSave} onDelete={onArticleDelete} />
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
                <p className={`mt-2 text-sm leading-6 ${selectedProgramId === program.id ? "text-[#dde4dc]" : "text-[#607366]"}`}>{program.level} | {program.duration}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.52)] p-4">
        {selectedProgram ? (
          <ProgramEditorCard disabled={disabled} program={selectedProgram} onSave={onProgramSave} onDelete={onProgramDelete} />
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

function ProgramRow({
  program,
  onSave,
  onDelete,
  disabled,
}: {
  program: Program;
  onSave: (body: Program) => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  const [draft, setDraft] = useState(program);

  return (
    <RecordCard
      eyebrow={program.level.replaceAll("_", " ")}
      title={program.title}
      metadata={`${program.duration} | Capacity ${program.capacity} | ${program.published ? "Published" : "Draft"}`}
      disabled={disabled}
      onSave={() => onSave(draft)}
      onDelete={onDelete}
    >
      <ProgramFields value={draft} onChange={setDraft} />
    </RecordCard>
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

function MiniStatCard({ label, value, tone }: { label: string; value: number; tone: "warm" | "forest" | "gold" }) {
  const styles = {
    warm: "bg-[#fff5ea] text-[#8c4d1e] border-[rgba(140,77,30,0.12)]",
    forest: "bg-[#eef8f1] text-[#21533f] border-[rgba(33,83,63,0.12)]",
    gold: "bg-[#fff8df] text-[#7a5a00] border-[rgba(122,90,0,0.12)]",
  }[tone];

  return (
    <div className={`rounded-[1.4rem] border p-4 shadow-[0_12px_28px_rgba(64,44,8,0.05)] ${styles}`}>
      <p className="text-xs font-black uppercase tracking-[0.2em]">{label}</p>
      <p className="font-display mt-3 text-4xl font-semibold">{value}</p>
    </div>
  );
}

function CompactOverviewCard({
  card,
}: {
  card: {
    label: string;
    value: number;
    detail: string;
    icon: ReactNode;
    accent: string;
  };
}) {
  return (
    <div className="rounded-[1.35rem] border border-[rgba(255,249,236,0.12)] bg-[rgba(255,255,255,0.07)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className={`inline-flex rounded-full bg-gradient-to-r ${card.accent} p-2 text-white`}>{card.icon}</div>
        <p className="font-display text-4xl font-semibold leading-none text-[#fff9ec]">{card.value}</p>
      </div>
      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#d9dfd5]">{card.label}</p>
      <p className="mt-2 text-sm leading-6 text-[#dde4dc]">{card.detail}</p>
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
