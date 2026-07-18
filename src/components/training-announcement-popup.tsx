"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, BellRing, CalendarDays, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { formatDateTime } from "@/lib/utils";

type AnnouncementProgram = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  capacity: number;
  batchStartsAt: Date | string | null;
};

const COURSE_ACCENTS = [
  { from: "#f2b544", to: "#ff8a2a", soft: "rgba(242,181,68,0.16)", text: "#9c6a18" },
  { from: "#f2b544", to: "#ff8a2a", soft: "rgba(242,181,68,0.16)", text: "#9c6a18" },
  { from: "#f2b544", to: "#ff8a2a", soft: "rgba(242,181,68,0.16)", text: "#9c6a18" },
  { from: "#f2b544", to: "#ff8a2a", soft: "rgba(242,181,68,0.16)", text: "#9c6a18" },
] as const;

const ANNOUNCEMENT_AUTO_OPEN_KEY = "api-culture-training-announcement-auto-opened";

export function TrainingAnnouncementPopup({
  programs,
}: {
  programs: AnnouncementProgram[];
}) {
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";
  const [expandedVisible, setExpandedVisible] = useState(false);
  const [compactVisible, setCompactVisible] = useState(false);
  const [hasOverflowBelow, setHasOverflowBelow] = useState(false);
  const [closeProgress, setCloseProgress] = useState(0);
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

  const hideAnnouncementCards = useCallback(() => {
    clearTimers();
    setHasOverflowBelow(false);
    setExpandedVisible(false);
    setCompactVisible(false);
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
    const hasAlreadyAutoOpened = window.localStorage.getItem(ANNOUNCEMENT_AUTO_OPEN_KEY) === "true";
    if (hasAlreadyAutoOpened) {
      const hideTimer = window.setTimeout(() => hideAnnouncementCards(), 0);
      return () => {
        window.clearTimeout(hideTimer);
        clearTimers();
      };
    }

    const bootTimer = window.setTimeout(() => {
      window.localStorage.setItem(ANNOUNCEMENT_AUTO_OPEN_KEY, "true");
      showExpandedCard(true);
    }, 0);

    return () => {
      window.clearTimeout(bootTimer);
      clearTimers();
    };
  }, [clearTimers, hideAnnouncementCards, programs, showExpandedCard]);

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

  const orderedPrograms = [...programs].sort((left, right) => {
    const leftTime = left.batchStartsAt ? new Date(left.batchStartsAt).getTime() : Number.POSITIVE_INFINITY;
    const rightTime = right.batchStartsAt ? new Date(right.batchStartsAt).getTime() : Number.POSITIVE_INFINITY;
    return leftTime - rightTime;
  });

  const whatsappCta = (
    <a
      href="https://wa.me/919395507766"
      target="_blank"
      rel="noreferrer"
      className="pointer-events-auto block"
      aria-label="Send a WhatsApp enquiry to 9395507766"
    >
      <span className="block h-11 w-11 drop-shadow-[0_10px_22px_rgba(18,140,72,0.28)] transition-transform duration-300 hover:scale-105">
        <WhatsAppMark />
      </span>
    </a>
  );

  return (
    <div
      className={`pointer-events-none fixed z-50 flex flex-col gap-3 ${
        isHomeRoute ? "left-1/2 w-[calc(100vw-2rem)] max-w-[21.5rem] -translate-x-1/2 items-center" : "bottom-3 right-3 items-end sm:bottom-4 sm:right-4"
      }`}
      style={isHomeRoute ? { top: "29.25rem" } : undefined}
    >
      {compactVisible ? (
        <div className="pointer-events-auto transition-all duration-700 ease-out translate-y-0 opacity-100">
          <button
            type="button"
            onClick={() => showExpandedCard(false)}
            className="float-gentle relative flex w-full items-center gap-4 overflow-hidden rounded-[1.45rem] border border-[#f1d29c] bg-[linear-gradient(145deg,rgba(255,255,255,0.99),rgba(255,247,231,0.98))] px-5 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-16px_28px_rgba(255,184,67,0.08),0_18px_44px_rgba(29,20,5,0.28),0_2px_0_rgba(255,255,255,0.72)] ring-1 ring-[#54330a]/10 backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9b2d]"
            aria-label="Open new batch announcement"
          >
            <span className="pointer-events-none absolute inset-x-5 top-1 h-px bg-white/95" />
            <span className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-[radial-gradient(circle_at_top,rgba(255,177,62,0.3),rgba(255,255,255,0)_62%)]" />
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffbd4a,#ff8b24)] text-[#132119] shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_14px_28px_rgba(230,127,21,0.34)]">
              <FlyingBeeIcon className="relative h-11 w-11 drop-shadow-[0_2px_1px_rgba(255,255,255,0.34)]" />
            </span>
            <span className="relative min-w-0">
              <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#87540a]">New courses open</span>
              <span className="mt-1 block text-lg font-black leading-5 text-[#14281e]">
                {programs.length > 1 ? `${programs.length} courses available` : programs[0]?.title}
              </span>
            </span>
          </button>
        </div>
      ) : null}

      {expandedVisible ? (
        <aside className="pointer-events-auto relative flex max-h-[min(78dvh,42rem)] w-[min(23rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-[1.8rem] border border-white/60 bg-[linear-gradient(155deg,rgba(255,255,255,0.96)_0%,rgba(255,247,232,0.82)_46%,rgba(255,252,246,0.92)_100%)] shadow-[0_28px_80px_rgba(199,123,34,0.2)] backdrop-blur-2xl transition-all duration-700 ease-out sm:w-[min(24rem,calc(100vw-1.5rem))] xl:w-[25vw] xl:max-w-[25rem]">
          <div className="shrink-0 border-b border-[rgba(41,56,49,0.1)] px-4 pb-3 pt-3">
            <div className="relative overflow-hidden rounded-[1.35rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,247,232,0.78))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_14px_30px_rgba(199,123,34,0.08)]">
              <div className="absolute inset-y-0 right-0 w-24 bg-[linear-gradient(135deg,rgba(242,181,68,0.32),rgba(255,138,42,0.16),rgba(255,255,255,0.1))]" />
              <div className="relative flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b8842a]">
                  Admissions open
                </p>
                <span className="rounded-full bg-[#1f352b] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#fff8ea] shadow-[0_8px_18px_rgba(31,53,43,0.16)]">
                  {orderedPrograms.length} live
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-b border-[rgba(41,56,49,0.1)] px-4 pb-3 pt-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f2b544,#ff8a2a)] text-[#1f352b] shadow-[0_16px_34px_rgba(242,181,68,0.28)]">
                  <BellRing className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b8842a]">Training programs</p>
                  <h2 className="mt-1 font-display text-[1.55rem] leading-none font-semibold text-[#1f352b]">
                    Current batches
                  </h2>
                </div>
              </div>
              <div
                className="grid h-11 w-11 place-items-center rounded-full p-[2px] shadow-[0_10px_24px_rgba(64,44,8,0.08)]"
                style={
                  autoCloseEnabled
                    ? {
                        background: `conic-gradient(#f2b544 ${closeProgress * 3.6}deg, rgba(41,56,49,0.08) 0deg)`,
                      }
                    : { background: "rgba(41,56,49,0.08)" }
                }
                aria-hidden="true"
              >
                <button
                  type="button"
                  onClick={showCompactCard}
                  className="grid h-full w-full place-items-center rounded-full bg-white/86 text-[#516253] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:bg-[#fff7e8] hover:text-[#1f352b]"
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
                title="Available courses"
                emptyLabel="No courses listed right now"
                programs={orderedPrograms}
                tone="upcoming"
              />
            </div>
          </div>

          {hasOverflowBelow ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-[5.55rem] z-20 flex justify-center">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.8),rgba(255,247,232,0.42)_48%,rgba(242,181,68,0.24))] text-[#b8842a] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-10px_18px_rgba(242,181,68,0.08),0_18px_36px_rgba(199,123,34,0.16)] backdrop-blur-xl">
                <ArrowDown className="h-5 w-5 animate-bounce drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" aria-hidden="true" />
              </span>
            </div>
          ) : null}

          <div className="shrink-0 border-t border-[rgba(41,56,49,0.1)] bg-white/72 px-4 pb-4 pt-3 backdrop-blur-xl">
            <Link
              href="/programs"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#1f352b,#c77b22_54%,#ff8a2a)] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#fff8ea] shadow-[0_18px_38px_rgba(199,123,34,0.24)] transition hover:brightness-110"
            >
              View programs and apply
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
          badge: "text-[#1f352b] bg-[#f3f8ee]",
          card: "bg-[linear-gradient(145deg,rgba(255,253,248,0.94),rgba(255,255,255,0.72))]",
          icon: "text-[#1f352b]",
        }
      : {
          badge: "text-[#9c6a18] bg-[#fff5e1]",
          card: "bg-[linear-gradient(145deg,rgba(255,253,248,0.96),rgba(248,242,231,0.72))]",
          icon: "text-[#9c6a18]",
        };

  return (
    <section className="rounded-[1.4rem] border border-white/65 bg-[linear-gradient(155deg,rgba(255,255,255,0.8),rgba(255,247,232,0.58))] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_14px_34px_rgba(137,114,75,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#1f352b]">{title}</h3>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] ${toneClasses.badge}`}>
          {programs.length}
        </span>
      </div>

      {programs.length ? (
        <div className="mt-3 grid gap-2.5">
          {programs.map((program, index) => {
            const accent = COURSE_ACCENTS[index % COURSE_ACCENTS.length];

            return (
              <div
                key={program.id}
                className={`relative overflow-hidden rounded-[1.18rem] border border-white/62 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_12px_26px_rgba(3,18,28,0.06)] ${toneClasses.card}`}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
                />
                <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl" style={{ background: accent.soft }} />

                <div className="relative grid gap-3">
                  <div className="grid grid-cols-[2.65rem_minmax(0,1fr)] gap-3">
                    <span
                      className="grid h-10 w-10 place-items-center rounded-2xl text-sm font-black text-white shadow-[0_14px_28px_rgba(3,18,28,0.14)]"
                      style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-black leading-6 text-[#1f352b]">{program.title}</p>
                        <span
                          className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
                          style={{ background: accent.soft, color: accent.text }}
                        >
                          {program.capacity} seats
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#5e7064]">
                          {program.duration}
                        </span>
                        <span
                          className="rounded-full border border-white/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
                          style={{ background: accent.soft, color: accent.text }}
                        >
                          Hands-on
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[0.8fr_1.2fr]">
                    <div className="rounded-[0.95rem] border border-white/68 bg-white/78 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: accent.text }}>
                        Seats
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#1f352b]">{program.capacity} total</p>
                    </div>
                    <div className="rounded-[0.95rem] border border-white/68 bg-white/78 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: accent.text }}>
                        Starts
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f352b]">
                        <CalendarDays className="h-3.5 w-3.5" style={{ color: accent.text }} aria-hidden="true" />
                        {program.batchStartsAt ? formatDateTime(program.batchStartsAt) : "Start date not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-3 text-sm text-[#687870]">{emptyLabel}</p>
      )}
    </section>
  );
}

function FlyingBeeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="announcement-flower-petal" x1="33" x2="50" y1="31" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff8d8" />
          <stop offset="1" stopColor="#ffcf5a" />
        </linearGradient>
      </defs>

      <path d="M16 31c-3.8.3-7.4 1.1-10.6 2.6" stroke="#173024" strokeWidth="2.4" strokeLinecap="round" opacity="0.18">
        <animate attributeName="opacity" values="0.05;0.24;0.05" dur="2.8s" repeatCount="indefinite" />
      </path>
      <path d="M18 24c-3.3-.7-6.3-.6-9.1.3" stroke="#173024" strokeWidth="2.2" strokeLinecap="round" opacity="0.18">
        <animate attributeName="opacity" values="0.22;0.04;0.22" dur="2.8s" repeatCount="indefinite" />
      </path>

      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3 43 54;4 43 54;-3 43 54"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <path d="M43 56c-.8-8.5.4-15.2 3.4-20.7" stroke="#173024" strokeWidth="3" strokeLinecap="round" />
        <path d="M40.8 47.5c-4.4-.8-7.2-3.1-8.4-6.8 4.5-.5 7.5 1.5 9.1 5.9" fill="#2f6d3f" />
        <g>
          <circle cx="45.5" cy="33.7" r="5.9" fill="url(#announcement-flower-petal)" />
          <circle cx="39.7" cy="36" r="5.9" fill="#ffe47a" />
          <circle cx="47.7" cy="40" r="5.9" fill="#fff0a6" />
          <circle cx="53.2" cy="35.9" r="5.9" fill="#ffd15e" />
          <circle cx="46.7" cy="36.5" r="4.2" fill="#7a4a08" />
          <circle cx="45.3" cy="35.2" r="1.1" fill="#fff4bc" opacity="0.72" />
        </g>
      </g>

      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="-7 -8;3 -13;12 -3;16 6;16 6;-7 -8"
          keyTimes="0;0.28;0.58;0.74;0.88;1"
          dur="3.2s"
          repeatCount="indefinite"
        />
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-18 24 26;8 24 26;-6 24 26;0 24 26;0 24 26;-18 24 26"
            keyTimes="0;0.28;0.58;0.74;0.88;1"
            dur="3.2s"
            repeatCount="indefinite"
          />
          <path
            d="M20.6 21.4c-2.4-4.8-.3-8.3 2.8-8.4 3.1-.1 5 3.2 3 7.2"
            fill="rgba(255,255,255,0.7)"
            stroke="#fff8ea"
            strokeWidth="2.1"
            strokeLinecap="round"
          >
            <animateTransform attributeName="transform" type="rotate" values="-9 24 21;10 24 21;-9 24 21" dur="0.26s" repeatCount="indefinite" />
          </path>
          <path
            d="M27.2 22.2c2.7-4.6 6.9-4.8 8.6-2.4 1.8 2.5-.4 5.8-4.9 6"
            fill="rgba(255,255,255,0.64)"
            stroke="#fff8ea"
            strokeWidth="2.1"
            strokeLinecap="round"
          >
            <animateTransform attributeName="transform" type="rotate" values="9 28 23;-8 28 23;9 28 23" dur="0.26s" repeatCount="indefinite" />
          </path>
          <path
            d="M13.8 29c2.9-5.5 10.3-8.1 16.4-5 6 3.1 7.8 9.8 4.8 14.1-3.1 4.4-10.6 4.3-16.7 1.2-6.1-3.1-7.4-5-4.5-10.3Z"
            fill="#173024"
          />
          <path d="M18.7 25.9c-1.2 2.4-2 5.1-2.1 8" stroke="#ffcf5a" strokeWidth="3" strokeLinecap="round" />
          <path d="M24.1 23.8c-1.2 2.9-1.8 6.2-1.8 9.9" stroke="#ffcf5a" strokeWidth="3" strokeLinecap="round" />
          <path d="M29.7 25.2c-1 2.7-1.2 6-.4 9.4" stroke="#ffcf5a" strokeWidth="3" strokeLinecap="round" />
          <circle cx="34.4" cy="31.1" r="1.7" fill="#fff8ea" />
          <path d="M12 29.2 7.8 27.1" stroke="#173024" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M36.1 38.1 39.6 41.4" stroke="#173024" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-full w-full">
      <circle cx="24" cy="24" r="23" fill="#25D366" />
      <path
        d="M35.5 24.2c0 6.1-5 11.1-11.2 11.1-1.9 0-3.7-.5-5.3-1.3l-5.7 1.8 1.8-5.5c-1.1-1.8-1.7-3.8-1.7-6.1 0-6.1 5-11.1 11.1-11.1s11 5 11 11.1Z"
        fill="#25D366"
        stroke="white"
        strokeWidth="3.1"
        strokeLinejoin="round"
      />
      <path
        d="M20.4 18.8c-.3-.7-.6-.7-.9-.7h-.8c-.3 0-.8.1-1.2.6-.4.4-1.6 1.5-1.6 3.7 0 2.2 1.6 4.4 1.9 4.7.2.3 3.1 5 7.8 6.8 3.9 1.5 4.8 1.2 5.6 1.1.9-.1 2.8-1.1 3.2-2.2.4-1.1.4-2 .3-2.2-.1-.2-.4-.3-.9-.6l-3.2-1.6c-.5-.2-.8-.3-1.2.3-.3.5-1.3 1.6-1.6 1.9-.3.4-.6.4-1.1.1-.5-.2-2-.7-3.8-2.3-1.4-1.3-2.4-2.8-2.7-3.3-.3-.5 0-.8.2-1 .2-.2.5-.6.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8l-1.2-2.9Z"
        fill="white"
      />
    </svg>
  );
}
