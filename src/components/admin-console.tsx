"use client";

import { useState } from "react";
import { Plus, RefreshCw, Save, Trash2 } from "lucide-react";

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
  published: true,
};

const emptyEvent: Omit<EventItem, "id"> = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  location: "Honey House, Rajendranagar, Hyderabad",
  startsAt: "",
  endsAt: "",
  status: "UPCOMING",
  published: true,
};

export function AdminConsole({
  initialPrograms,
  initialEvents,
}: {
  initialPrograms: Program[];
  initialEvents: EventItem[];
}) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [programDraft, setProgramDraft] = useState(emptyProgram);
  const [eventDraft, setEventDraft] = useState(emptyEvent);
  const [notice, setNotice] = useState("");

  async function load() {
    const [programResponse, eventResponse] = await Promise.all([
      fetch("/api/admin/programs"),
      fetch("/api/admin/events"),
    ]);
    if (programResponse.status === 401 || eventResponse.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    setPrograms(await programResponse.json());
    setEvents(await eventResponse.json());
  }

  async function mutate(url: string, method: string, body?: unknown) {
    setNotice("");
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setNotice(data?.error ?? "Request failed");
      return false;
    }
    setNotice("Saved successfully");
    await load();
    return true;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-emerald-950">Programs and events</h1>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-bold">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </button>
      </div>
      {notice ? <p className="mt-4 rounded-md bg-amber-100 px-4 py-3 text-sm font-semibold text-stone-800">{notice}</p> : null}

      <section className="mt-8 grid gap-5 lg:grid-cols-[380px_1fr]">
        <Editor title="Create program" onSave={() => mutate("/api/admin/programs", "POST", programDraft).then((ok) => ok && setProgramDraft(emptyProgram))}>
          <ProgramFields value={programDraft} onChange={setProgramDraft} />
        </Editor>
        <div className="grid gap-4">
          {programs.map((program) => (
            <ProgramRow key={program.id} program={program} onSave={(body) => mutate(`/api/admin/programs/${program.id}`, "PATCH", body)} onDelete={() => mutate(`/api/admin/programs/${program.id}`, "DELETE")} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[380px_1fr]">
        <Editor title="Create event" onSave={() => mutate("/api/admin/events", "POST", eventDraft).then((ok) => ok && setEventDraft(emptyEvent))}>
          <EventFields value={eventDraft} onChange={setEventDraft} />
        </Editor>
        <div className="grid gap-4">
          {events.map((event) => (
            <EventRow key={event.id} event={event} onSave={(body) => mutate(`/api/admin/events/${event.id}`, "PATCH", body)} onDelete={() => mutate(`/api/admin/events/${event.id}`, "DELETE")} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Editor({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => void }) {
  return (
    <div className="h-fit rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-black text-emerald-950">{title}</h2>
      <div className="mt-4 grid gap-3">{children}</div>
      <button onClick={onSave} className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-950 px-4 py-2 text-sm font-black text-white">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Create
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1 text-xs font-black uppercase tracking-[0.12em] text-stone-600">{label}{children}</label>;
}

function textClass() {
  return "rounded-md border border-stone-300 px-3 py-2 text-sm font-medium normal-case tracking-normal text-stone-900 outline-none ring-amber-400 focus:ring-2";
}

function ProgramFields<T extends Omit<Program, "id">>({ value, onChange }: { value: T; onChange: (next: T) => void }) {
  return (
    <>
      <Field label="Title"><input className={textClass()} value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /></Field>
      <Field label="Slug"><input className={textClass()} value={value.slug} onChange={(e) => onChange({ ...value, slug: e.target.value })} /></Field>
      <Field label="Summary"><textarea className={textClass()} value={value.summary} onChange={(e) => onChange({ ...value, summary: e.target.value })} /></Field>
      <Field label="Description"><textarea rows={4} className={textClass()} value={value.description} onChange={(e) => onChange({ ...value, description: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Duration"><input className={textClass()} value={value.duration} onChange={(e) => onChange({ ...value, duration: e.target.value })} /></Field>
        <Field label="Capacity"><input type="number" className={textClass()} value={value.capacity} onChange={(e) => onChange({ ...value, capacity: Number(e.target.value) })} /></Field>
      </div>
      <Field label="Level"><select className={textClass()} value={value.level} onChange={(e) => onChange({ ...value, level: e.target.value as T["level"] })}><option>FOUNDATION</option><option>ADVANCED</option><option>PROFESSIONAL</option></select></Field>
      <Field label="Fee"><input className={textClass()} value={value.fee ?? ""} onChange={(e) => onChange({ ...value, fee: e.target.value })} /></Field>
      <label className="flex items-center gap-2 text-sm font-bold text-stone-700"><input type="checkbox" checked={value.published} onChange={(e) => onChange({ ...value, published: e.target.checked })} /> Published</label>
    </>
  );
}

function EventFields<T extends Omit<EventItem, "id">>({ value, onChange }: { value: T; onChange: (next: T) => void }) {
  return (
    <>
      <Field label="Title"><input className={textClass()} value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /></Field>
      <Field label="Slug"><input className={textClass()} value={value.slug} onChange={(e) => onChange({ ...value, slug: e.target.value })} /></Field>
      <Field label="Summary"><textarea className={textClass()} value={value.summary} onChange={(e) => onChange({ ...value, summary: e.target.value })} /></Field>
      <Field label="Description"><textarea rows={4} className={textClass()} value={value.description} onChange={(e) => onChange({ ...value, description: e.target.value })} /></Field>
      <Field label="Location"><input className={textClass()} value={value.location} onChange={(e) => onChange({ ...value, location: e.target.value })} /></Field>
      <Field label="Starts at"><input type="datetime-local" className={textClass()} value={value.startsAt?.slice(0, 16) ?? ""} onChange={(e) => onChange({ ...value, startsAt: e.target.value })} /></Field>
      <Field label="Ends at"><input type="datetime-local" className={textClass()} value={value.endsAt?.slice(0, 16) ?? ""} onChange={(e) => onChange({ ...value, endsAt: e.target.value })} /></Field>
      <Field label="Status"><select className={textClass()} value={value.status} onChange={(e) => onChange({ ...value, status: e.target.value as T["status"] })}><option>UPCOMING</option><option>COMPLETED</option><option>CANCELLED</option></select></Field>
      <label className="flex items-center gap-2 text-sm font-bold text-stone-700"><input type="checkbox" checked={value.published} onChange={(e) => onChange({ ...value, published: e.target.checked })} /> Published</label>
    </>
  );
}

function ProgramRow({ program, onSave, onDelete }: { program: Program; onSave: (body: Program) => void; onDelete: () => void }) {
  const [draft, setDraft] = useState(program);
  return <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"><ProgramFields value={draft} onChange={setDraft} /><RowActions onSave={() => onSave(draft)} onDelete={onDelete} /></div>;
}

function EventRow({ event, onSave, onDelete }: { event: EventItem; onSave: (body: EventItem) => void; onDelete: () => void }) {
  const [draft, setDraft] = useState(event);
  return <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"><EventFields value={draft} onChange={setDraft} /><RowActions onSave={() => onSave(draft)} onDelete={onDelete} /></div>;
}

function RowActions({ onSave, onDelete }: { onSave: () => void; onDelete: () => void }) {
  return (
    <div className="mt-4 flex gap-2">
      <button onClick={onSave} className="inline-flex items-center gap-2 rounded-md bg-emerald-950 px-4 py-2 text-sm font-black text-white"><Save className="h-4 w-4" aria-hidden="true" />Save</button>
      <button onClick={onDelete} className="inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-black text-red-700"><Trash2 className="h-4 w-4" aria-hidden="true" />Delete</button>
    </div>
  );
}
