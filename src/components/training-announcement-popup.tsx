"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BellRing, X } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type AnnouncementProgram = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  capacity: number;
  batchStartsAt: Date | string | null;
};

export function TrainingAnnouncementPopup({
  programs,
}: {
  programs: AnnouncementProgram[];
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!programs.length) return;

    const enterTimer = window.setTimeout(() => setVisible(true), 160);
    const exitTimer = window.setTimeout(() => setVisible(false), 5000);
    const removeTimer = window.setTimeout(() => setDismissed(true), 5600);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [programs]);

  if (!programs.length || dismissed) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex justify-end">
      <aside
        className={`pointer-events-auto w-[calc(100vw-1.5rem)] rounded-[1.8rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-4 shadow-[0_24px_60px_rgba(64,44,8,0.16)] transition-all duration-500 ease-out sm:w-[22rem] xl:w-[24vw] xl:max-w-[24rem] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ebb428,#b36b00)] text-[#fff8ea] shadow-[0_12px_30px_rgba(64,44,8,0.18)]">
              <BellRing className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b36b00]">Upcoming training</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-[#1b3b2b]">New batch update</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              window.setTimeout(() => setDismissed(true), 400);
            }}
            className="rounded-full border border-[rgba(27,59,43,0.1)] p-2 text-[#516253] transition hover:border-[#b36b00]/40 hover:text-[#1b3b2b]"
            aria-label="Close training update"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {programs.map((program) => (
            <div key={program.id} className="rounded-[1.35rem] border border-[rgba(27,59,43,0.1)] bg-[#f6efe4] p-3">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[#1b3b2b]">{program.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#516253]">{program.summary}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#8a6a1f]">
                {program.batchStartsAt ? `Starts ${formatDateTime(program.batchStartsAt)}` : "Start date to be announced"}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#607366]">
                {program.duration} | Capacity {program.capacity}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/programs"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1b3b2b] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#fff8ea] transition hover:bg-[#2d312e]"
        >
          View training batches
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
