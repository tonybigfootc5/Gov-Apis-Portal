"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BellRing, CalendarDays, X } from "lucide-react";
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
  const [expandedVisible, setExpandedVisible] = useState(false);
  const [compactVisible, setCompactVisible] = useState(false);
  const [hasOverflowBelow, setHasOverflowBelow] = useState(false);
  const [closeProgress, setCloseProgress] = useState(0);
  const [referenceNow] = useState(() => Date.now());
  const [autoCloseEnabled, setAutoCloseEnabled] = useState(false);
  const enterTimerRef = useRef<number | null>(null);
  const collapseTimerRef = useRef<number | null>(null);
  const scrollPanelRef = useRef<HTMLDivElement | null>(null);

  const clearTimers = useCallback(() => {
    if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
    if (collapseTimerRef.current) window.clearTimeout(collapseTimerRef.current);
  }, []);

  const showCompactCard = useCallback(() => {
    clearTimers();
    setHasOverflowBelow(false);
    setExpandedVisible(false);
    setCompactVisible(true);
    setCloseProgress(0);
    setAutoCloseEnabled(false);
  }, [clearTimers]);

  const showExpandedCard = useCallback((autoClose: boolean) => {
    clearTimers();
    setHasOverflowBelow(false);
    setCompactVisible(false);
    setAutoCloseEnabled(autoClose);
    setCloseProgress(autoClose ? 100 : 0);
    enterTimerRef.current = window.setTimeout(() => setExpandedVisible(true), 160);
    if (autoClose) {
      collapseTimerRef.current = window.setTimeout(() => showCompactCard(), 5000);
    }
  }, [clearTimers, showCompactCard]);

  useEffect(() => {
    if (!programs.length) return;
    const bootTimer = window.setTimeout(() => showExpandedCard(true), 0);

    return () => {
      window.clearTimeout(bootTimer);
      clearTimers();
    };
  }, [clearTimers, programs, showExpandedCard]);

  useEffect(() => {
    if (!expandedVisible) return;

    const element = scrollPanelRef.current;
    if (!element) return;

    const updateOverflowState = () => {
      const remaining = element.scrollHeight - element.scrollTop - element.clientHeight;
      setHasOverflowBelow(remaining > 12);
    };

    updateOverflowState();
    element.addEventListener("scroll", updateOverflowState, { passive: true });
    window.addEventListener("resize", updateOverflowState);

    const resizeObserver = new ResizeObserver(updateOverflowState);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", updateOverflowState);
      window.removeEventListener("resize", updateOverflowState);
      resizeObserver.disconnect();
    };
  }, [expandedVisible, programs]);

  useEffect(() => {
    if (!expandedVisible || !autoCloseEnabled) return;

    const startedAt = performance.now();
    const duration = 5000;
    let frameId = 0;

    const updateProgress = (now: number) => {
      const elapsed = now - startedAt;
      const remaining = Math.max(0, duration - elapsed);
      setCloseProgress((remaining / duration) * 100);

      if (remaining > 0) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    frameId = window.requestAnimationFrame(updateProgress);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [autoCloseEnabled, expandedVisible]);

  if (!programs.length) return null;

  const currentPrograms = programs.filter((program) => {
    if (!program.batchStartsAt) return true;
    return new Date(program.batchStartsAt).getTime() <= referenceNow;
  });
  const upcomingPrograms = programs.filter((program) => {
    if (!program.batchStartsAt) return false;
    return new Date(program.batchStartsAt).getTime() > referenceNow;
  });

  const whatsappCta = (
    <a
      href="https://wa.me/919395507766"
      target="_blank"
      rel="noreferrer"
      className="pointer-events-auto block"
      aria-label="Send a WhatsApp enquiry to 9395507766"
    >
      <span className="relative block h-11 w-11 overflow-hidden rounded-full">
        <Image
          src="/whatsapp-logo.png"
          alt=""
          fill
          sizes="44px"
          className="object-cover"
          aria-hidden="true"
        />
      </span>
    </a>
  );

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-50 flex flex-col items-end gap-3 sm:bottom-4 sm:right-4">
      {compactVisible ? (
        <div className="pointer-events-auto transition-all duration-700 ease-out translate-y-0 opacity-100">
          <button
            type="button"
            onClick={() => showExpandedCard(false)}
            className="float-gentle flex items-center gap-3 rounded-[1.2rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,242,232,0.94))] px-4 py-3 text-left shadow-[0_18px_42px_rgba(64,44,8,0.12)]"
            aria-label="Open new batch announcement"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ebb428,#b36b00)] text-[#fff8ea] shadow-[0_10px_24px_rgba(64,44,8,0.16)]">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#b36b00]">Upcoming batch</span>
              <span className="mt-0.5 block text-sm font-semibold text-[#1b3b2b]">
                {programs.length > 1 ? `${programs.length} listed batches` : programs[0]?.title}
              </span>
            </span>
          </button>
        </div>
      ) : null}

      {expandedVisible ? (
        <aside className="pointer-events-auto relative flex max-h-[min(78dvh,42rem)] w-[min(23rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-[1.8rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(180deg,#fffdf8_0%,#fbf6ee_100%)] shadow-[0_24px_60px_rgba(64,44,8,0.14)] transition-all duration-700 ease-out sm:w-[min(24rem,calc(100vw-1.5rem))] xl:w-[25vw] xl:max-w-[25rem]">
          <div className="shrink-0 border-b border-[rgba(27,59,43,0.08)] px-4 pb-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ebb428,#b36b00)] text-[#fff8ea] shadow-[0_12px_30px_rgba(64,44,8,0.16)]">
                  <BellRing className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b36b00]">Upcoming training</p>
                  <h2 className="mt-1 font-display text-[1.65rem] leading-none font-semibold text-[#1b3b2b]">
                    Batch status
                  </h2>
                </div>
              </div>
              <div
                className="grid h-11 w-11 place-items-center rounded-full p-[2px] shadow-[0_10px_24px_rgba(64,44,8,0.08)]"
                style={
                  autoCloseEnabled
                    ? {
                        background: `conic-gradient(#ebb428 ${closeProgress * 3.6}deg, rgba(27,59,43,0.08) 0deg)`,
                      }
                    : { background: "rgba(27,59,43,0.08)" }
                }
                aria-hidden="true"
              >
                <button
                  type="button"
                  onClick={showCompactCard}
                  className="grid h-full w-full place-items-center rounded-full bg-[#fffdf8] text-[#516253] transition hover:bg-[#fff7e8] hover:text-[#1b3b2b]"
                  aria-label="Close training update"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={scrollPanelRef}
            className="relative min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4 scroll-smooth"
          >
            <div className="grid gap-4">
              <BatchSection
                title="Current batches"
                emptyLabel="No current batches listed"
                programs={currentPrograms}
                tone="current"
              />
              <BatchSection
                title="Upcoming batches"
                emptyLabel="No upcoming batches listed"
                programs={upcomingPrograms}
                tone="upcoming"
              />
            </div>

            {hasOverflowBelow ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-2">
                <div className="h-14 bg-[linear-gradient(180deg,rgba(255,253,248,0),rgba(255,253,248,0.96)_58%,#fffdf8_100%)]" />
                <div className="absolute inset-x-4 bottom-2 flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(179,107,0,0.14)] bg-[#fff9ef]/96 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#9a6507] shadow-[0_10px_24px_rgba(64,44,8,0.08)]">
                    <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden="true" />
                    Scroll for more
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="shrink-0 border-t border-[rgba(27,59,43,0.08)] bg-[#fffdf8] px-4 pb-4 pt-3">
            <Link
              href="/programs"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1b3b2b] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#fff8ea] transition hover:bg-[#2d312e]"
            >
              View training batches
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      ) : null}

      <div className="pointer-events-auto">{whatsappCta}</div>
    </div>
  );
}

function BatchSection({
  title,
  emptyLabel,
  programs,
  tone,
}: {
  title: string;
  emptyLabel: string;
  programs: AnnouncementProgram[];
  tone: "current" | "upcoming";
}) {
  const toneClasses =
    tone === "current"
      ? {
          badge: "text-[#5f7d52] bg-[#f3f8ee]",
          card: "bg-[rgba(247,250,243,0.9)]",
          icon: "text-[#5f7d52]",
        }
      : {
          badge: "text-[#a66a08] bg-[#fff5e1]",
          card: "bg-[rgba(255,249,239,0.92)]",
          icon: "text-[#a66a08]",
        };

  return (
    <section className="rounded-[1.4rem] border border-[rgba(27,59,43,0.08)] bg-[rgba(255,255,255,0.72)] p-3.5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#1f352b]">{title}</h3>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${toneClasses.badge}`}>
          {programs.length}
        </span>
      </div>

      {programs.length ? (
        <div className="mt-3 grid gap-2.5">
          {programs.map((program) => (
            <div key={program.id} className={`rounded-[1rem] px-3 py-3 ${toneClasses.card}`}>
              <p className="text-sm font-semibold leading-6 text-[#1b3b2b]">{program.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#596b62]">
                <span>{program.duration}</span>
                <span>{program.capacity} seats</span>
                {program.batchStartsAt ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className={`h-3.5 w-3.5 ${toneClasses.icon}`} aria-hidden="true" />
                    {formatDateTime(program.batchStartsAt)}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-[#687870]">{emptyLabel}</p>
      )}
    </section>
  );
}
