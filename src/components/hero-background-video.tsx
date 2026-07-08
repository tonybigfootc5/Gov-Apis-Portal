"use client";

import { useEffect, useRef } from "react";

const FADE_OUT_SECONDS = 2.5;
const FADE_OUT_MS = FADE_OUT_SECONDS * 1000;
const FADE_IN_MS = 1500;
const BASE_OVERLAY_OPACITY = 0.08;
const BLACKOUT_OVERLAY_OPACITY = 1;

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fadeInTimeoutRef = useRef<number | null>(null);
  const isFadingOutRef = useRef(false);
  const isRestartingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;

    const setOverlay = (opacity: number, durationMs: number) => {
      overlay.style.transition = `opacity ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      overlay.style.opacity = String(opacity);
    };

    const clearFadeTimeout = () => {
      if (fadeInTimeoutRef.current !== null) {
        window.clearTimeout(fadeInTimeoutRef.current);
        fadeInTimeoutRef.current = null;
      }
    };

    const handleTimeUpdate = () => {
      const duration = video.duration || 0;
      const currentTime = video.currentTime || 0;
      const remaining = Math.max(0, duration - currentTime);

      if (!isRestartingRef.current && duration > 0 && remaining <= FADE_OUT_SECONDS && !isFadingOutRef.current) {
        isFadingOutRef.current = true;
        setOverlay(BLACKOUT_OVERLAY_OPACITY, FADE_OUT_MS);
      }
    };

    const restartLoop = async () => {
      isRestartingRef.current = true;
      clearFadeTimeout();
      setOverlay(BLACKOUT_OVERLAY_OPACITY, 0);

      video.currentTime = 0;
      try {
        await video.play();
      } catch {
        isRestartingRef.current = false;
        return;
      }

      fadeInTimeoutRef.current = window.setTimeout(() => {
        setOverlay(BASE_OVERLAY_OPACITY, FADE_IN_MS);
        isFadingOutRef.current = false;
        isRestartingRef.current = false;
      }, 40);
    };

    const handleEnded = () => {
      void restartLoop();
    };

    const handlePlaying = () => {
      if (!isFadingOutRef.current && !isRestartingRef.current) {
        setOverlay(BASE_OVERLAY_OPACITY, 0);
      }
    };

    video.loop = false;
    setOverlay(BASE_OVERLAY_OPACITY, 0);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("playing", handlePlaying);
      clearFadeTimeout();
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-95 [filter:brightness(0.84)_contrast(1.08)_saturate(1.02)] sm:object-[center_42%]"
      >
        <source src="/hero-background-original.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black"
        style={{
          opacity: BASE_OVERLAY_OPACITY,
          transition: `opacity ${FADE_IN_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
    </>
  );
}
