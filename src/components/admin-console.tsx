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
    { id: "programs", label: "Services", description: "Training catalog", icon: <FolderKanban className="h-4 w-4" aria-hidden="true" /> },
    { id: "events", label: "Events", description: "Schedule control", icon: <CalendarDays className="h-4 w-4" aria-hidden="true" /> },
    { id: "applications", label: "Applications", description: "Admissions desk", icon: <UsersRound className="h-4 w-4" aria-hidden="true" /> },
    { id: "articles", label: "Articles", description: "Content publishing", icon: <BookOpenText className="h-4 w-4" aria-hidden="true" /> },
  ];
  const activeView = viewItems.find((item) => item.id === view) ?? viewItems[0];

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
      {view === "overview" ? (
      <section className="relative overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(145deg,rgba(255,253,248,0.98),rgba(243,236,223,0.96))] p-6 shadow-[0_30px_80px_rgba(64,44,8,0.08)] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,180,40,0.18),transparent_22rem),radial-gradient(circle_at_bottom_left,rgba(27,59,43,0.08),transparent_24rem)]" />
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#9c6a18]">Institutional oversight</p>
              <h1 className="font-display mt-3 text-4xl font-semibold leading-none text-[#173f33] sm:text-5xl">
                Admin command deck
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#4f6255] sm:text-lg">
                A clearer control room for training services, event planning, and applicant approvals. The layout is tuned for fast daily handling instead of dense back-office clutter.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:hidden">
              <button
                disabled={loading}
                onClick={load}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.12)] bg-[#173f33] px-4 py-2.5 text-sm font-bold text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.18)] transition hover:bg-[#204d3f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4${loading ? " animate-spin" : ""}`} aria-hidden="true" />
                Refresh
              </button>
              <form action="/api/admin/logout" method="post">
                <button className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-2.5 text-sm font-bold text-[#173f33] transition hover:bg-[#f7f1e4]">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Logout
                </button>
              </form>
            </div>
          </div>

          {!databaseConfigured ? (
            <div className="rounded-[1.5rem] border border-[rgba(179,107,0,0.18)] bg-[linear-gradient(135deg,rgba(255,239,192,0.9),rgba(255,246,221,0.98))] px-5 py-4 text-sm font-semibold leading-7 text-[#7a4b00]">
              Local admin preview is running without `DATABASE_URL`. You can open the dashboard and review the design, but create, edit, and delete actions remain disabled until a database is configured.
            </div>
          ) : null}

          {notice ? (
            <div className="rounded-[1.5rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-5 py-4 text-sm font-semibold text-[#173f33] shadow-[0_14px_30px_rgba(64,44,8,0.06)]">
              {notice}
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] bg-[#173f33] p-5 text-[#fff9ec] shadow-[0_24px_50px_rgba(23,63,51,0.18)]">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#f5c65e]">
                <Layers3 className="h-4 w-4" aria-hidden="true" />
                Today at a glance
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {overviewCards.map((card) => (
                  <div key={card.label} className="rounded-[1.4rem] border border-[rgba(255,249,236,0.12)] bg-[rgba(255,255,255,0.07)] p-4">
                    <div className={`inline-flex rounded-full bg-gradient-to-r ${card.accent} p-2 text-white`}>{card.icon}</div>
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#d9dfd5]">{card.label}</p>
                    <p className="font-display mt-2 text-4xl font-semibold">{card.value}</p>
                    <p className="mt-2 text-sm text-[#dde4dc]">{card.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">Quick routing</p>
                <div className="mt-4 grid gap-3">
                  {viewItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`flex items-center justify-between rounded-[1.3rem] px-4 py-3 text-left transition ${
                        view === item.id
                          ? "bg-[#173f33] text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.16)]"
                          : "border border-[rgba(27,59,43,0.1)] bg-[#f7f2e8] text-[#173f33] hover:bg-[#efe7d8]"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-black uppercase tracking-[0.16em]">{item.label}</span>
                        <span className={`mt-1 block text-sm ${view === item.id ? "text-[#e9efea]" : "text-[#607366]"}`}>{item.description}</span>
                      </span>
                      <span className="text-xs font-black uppercase tracking-[0.18em]">{view === item.id ? "Open" : "View"}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(145deg,#fff8e8,#fffdf8)] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c6a18]">Operations notes</p>
                <ul className="mt-4 grid gap-3 text-sm leading-7 text-[#4f6255]">
                  <li>Keep service titles and summaries simple so applicants can choose the right training quickly.</li>
                  <li>Use upcoming events for orientations, field demonstrations, and batch announcements.</li>
                  <li>Approve students only after cross-check and payment verification are both complete.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : (
      <section className="rounded-[2rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(246,239,228,0.98))] p-6 shadow-[0_24px_60px_rgba(64,44,8,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#9c6a18]">Active workspace</p>
            <h1 className="font-display mt-3 text-4xl font-semibold leading-none text-[#173f33] sm:text-5xl">
              {activeView.label}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#4f6255] sm:text-lg">
              {activeView.description}. Only the selected section is shown on the right side so you can focus on one task at a time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:hidden">
            <button
              disabled={loading}
              onClick={load}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.12)] bg-[#173f33] px-4 py-2.5 text-sm font-bold text-[#fff9ec] shadow-[0_14px_30px_rgba(23,63,51,0.18)] transition hover:bg-[#204d3f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4${loading ? " animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </button>
            <form action="/api/admin/logout" method="post">
              <button className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-4 py-2.5 text-sm font-bold text-[#173f33] transition hover:bg-[#f7f1e4]">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </form>
          </div>
        </div>

        {!databaseConfigured ? (
          <div className="mt-6 rounded-[1.5rem] border border-[rgba(179,107,0,0.18)] bg-[linear-gradient(135deg,rgba(255,239,192,0.9),rgba(255,246,221,0.98))] px-5 py-4 text-sm font-semibold leading-7 text-[#7a4b00]">
            Local admin preview is running without `DATABASE_URL`. You can review the selected section, but create, edit, and delete actions remain disabled until a database is configured.
          </div>
        ) : null}

        {notice ? (
          <div className="mt-6 rounded-[1.5rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-5 py-4 text-sm font-semibold text-[#173f33] shadow-[0_14px_30px_rgba(64,44,8,0.06)]">
            {notice}
          </div>
        ) : null}
      </section>
      )}

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
          eyebrow="Service manager"
          title="Manage training services"
          description="Create, edit, and retire service records with clearer spacing, stronger contrast, and a simpler editing rhythm."
          className="mt-8"
        >
          <div className="grid gap-6 xl:grid-cols-[370px_minmax(0,1fr)]">
            <TaskLane
              eyebrow="New program"
              title="Create training service"
              description="This section is only for adding new training programs."
            >
              <EditorPanel
                disabled={loading || !databaseConfigured}
                title="New service"
                description="Write the program exactly as the applicant will understand it."
                actionLabel="Create service"
                onSave={() => mutate("/api/admin/programs", "POST", programDraft).then((ok) => ok && setProgramDraft(emptyProgram))}
              >
                <ProgramFields value={programDraft} onChange={setProgramDraft} />
              </EditorPanel>
            </TaskLane>
            <TaskLane
              eyebrow="Program actions"
              title="Edit or remove training services"
              description="Everything related to updating, unpublishing, or deleting services lives here."
            >
              <div className="grid gap-4">
                {programs.map((program) => (
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
          title="Articles and knowledge publishing"
          description="This section is reserved for article publishing, center updates, learning notes, and future content management tools."
          className="mt-8"
        >
          <div className="grid gap-6 xl:grid-cols-[370px_minmax(0,1fr)]">
            <TaskLane
              eyebrow="Coming next"
              title="Create new article"
              description="We can use this area for blog posts, training notices, beekeeping guidance, and institutional announcements."
            >
              <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_18px_44px_rgba(64,44,8,0.07)]">
                <p className="text-sm leading-7 text-[#607366]">
                  Article creation tools are not built yet, but this workspace is now added to the admin navigation and ready for the next step.
                </p>
              </div>
            </TaskLane>

            <TaskLane
              eyebrow="Publishing board"
              title="Manage article library"
              description="Existing and draft articles can be listed here once we connect the article database and editor."
            >
              <div className="rounded-[1.75rem] border border-dashed border-[rgba(27,59,43,0.16)] bg-[rgba(255,255,255,0.46)] p-6 text-sm leading-7 text-[#607366]">
                No article records are connected yet. When you want, I can build the full article system next with create, edit, publish, and delete controls.
              </div>
            </TaskLane>
          </div>
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
