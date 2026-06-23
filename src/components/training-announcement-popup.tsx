"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BellRing, X } from "lucide-react";
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
  }, [clearTimers]);

  const showExpandedCard = useCallback(() => {
    clearTimers();
    setHasOverflowBelow(false);
    setCompactVisible(false);
    enterTimerRef.current = window.setTimeout(() => setExpandedVisible(true), 160);
    collapseTimerRef.current = window.setTimeout(() => showCompactCard(), 5000);
  }, [clearTimers, showCompactCard]);

  useEffect(() => {
    if (!programs.length) return;
    const bootTimer = window.setTimeout(() => showExpandedCard(), 0);

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

  if (!programs.length) return null;

  const spotlightPrograms = programs.slice(0, 2);
  const overflowPrograms = programs.slice(2);

  const whatsappCta = (
    <a
      href="https://wa.me/919395507766"
      target="_blank"
      rel="noreferrer"
      className="pointer-events-auto flex items-center gap-0 rounded-full border border-[rgba(24,128,56,0.18)] bg-[#f7fff9] p-2 text-left shadow-[0_18px_42px_rgba(15,82,33,0.16)] sm:gap-3 sm:px-4 sm:py-3"
      aria-label="Send a WhatsApp enquiry to 9395507766"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_10px_24px_rgba(18,140,55,0.18)]">
        <Image
          src="/whatsapp-logo.png"
          alt=""
          fill
          sizes="44px"
          className="object-cover"
          aria-hidden="true"
        />
      </span>
      <span className="hidden sm:block">
        <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#128c37]">WhatsApp enquiry</span>
        <span className="mt-0.5 block text-sm font-semibold text-[#17432a]">Chat with 9395507766</span>
      </span>
    </a>
  );

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-50 flex flex-col items-end gap-3 sm:bottom-4 sm:right-4">
      {compactVisible ? (
        <div className="pointer-events-auto transition-all duration-700 ease-out translate-y-0 opacity-100">
          <button
            type="button"
            onClick={showExpandedCard}
            className="float-gentle flex items-center gap-3 rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-4 py-3 text-left shadow-[0_18px_42px_rgba(64,44,8,0.14)]"
            aria-label="Open new batch announcement"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ebb428,#b36b00)] text-[#fff8ea] shadow-[0_10px_24px_rgba(64,44,8,0.16)]">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#b36b00]">New batch upcoming</span>
              <span className="mt-0.5 block text-sm font-semibold text-[#1b3b2b]">
                {programs.length > 1 ? `${programs.length} active training batches` : programs[0]?.title}
              </span>
            </span>
          </button>
        </div>
      ) : null}

      {expandedVisible ? (
        <aside className="pointer-events-auto relative flex max-h-[min(78dvh,42rem)] w-[min(22rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-[1.8rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] shadow-[0_24px_60px_rgba(64,44,8,0.16)] transition-all duration-700 ease-out sm:w-[min(22rem,calc(100vw-1.5rem))] xl:w-[24vw] xl:max-w-[24rem]">
          <div className="shrink-0 border-b border-[rgba(27,59,43,0.08)] px-4 pb-3 pt-4">
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
                onClick={showCompactCard}
                className="rounded-full border border-[rgba(27,59,43,0.1)] p-2 text-[#516253] transition hover:border-[#b36b00]/40 hover:text-[#1b3b2b]"
                aria-label="Close training update"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            ref={scrollPanelRef}
            className="relative min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4 scroll-smooth"
          >
            <div className="rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(135deg,#fffaf1_0%,#f6efe4_100%)] p-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b36b00]">
                {programs.length > 1 ? `${programs.length} batches currently visible` : "1 batch currently visible"}
              </p>
            </div>

            <div className="mt-4 grid gap-3">
              {spotlightPrograms.map((program, index) => (
                <div key={program.id} className="rounded-[1.35rem] border border-[rgba(27,59,43,0.1)] bg-[#f6efe4] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8a6a1f]">
                        {index === 0 ? "Primary spotlight" : "Also opening"}
                      </p>
                      <p className="mt-1 text-sm font-black uppercase tracking-[0.12em] text-[#1b3b2b]">{program.title}</p>
                    </div>
                    <span className="rounded-full border border-[rgba(179,107,0,0.16)] bg-[#fffaf1] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#b36b00]">
                      {program.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#516253] line-clamp-2">{program.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#fffaf1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a6a1f]">
                      {program.batchStartsAt ? `Starts ${formatDateTime(program.batchStartsAt)}` : "Start date to be announced"}
                    </span>
                    <span className="rounded-full bg-[#fffaf1] px-3 py-1 text-[11px] font-semibold text-[#607366]">
                      Capacity {program.capacity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {overflowPrograms.length ? (
              <div className="mt-3 rounded-[1.35rem] border border-[rgba(27,59,43,0.1)] bg-[#fffaf1] p-3">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b36b00]">
                  +{overflowPrograms.length} more active {overflowPrograms.length === 1 ? "batch" : "batches"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {overflowPrograms.map((program) => (
                    <span
                      key={program.id}
                      className="rounded-full border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-3 py-1.5 text-[11px] font-semibold text-[#435648]"
                    >
                      {program.title}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

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
