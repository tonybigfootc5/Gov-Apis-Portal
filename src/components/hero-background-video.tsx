"use client";

import { useEffect, useRef } from "react";

const FADE_OUT_SECONDS = 1.15;
const FADE_IN_MS = 950;

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const fadeInTimeoutRef = useRef<number | null>(null);
  const hasTriggeredLoopRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;

    const setOverlayOpacity = (value: number) => {
      overlay.style.opacity = String(value);
    };

    const clearFadeTimeout = () => {
      if (fadeInTimeoutRef.current !== null) {
        window.clearTimeout(fadeInTimeoutRef.current);
        fadeInTimeoutRef.current = null;
      }
    };

    const step = () => {
      const duration = video.duration || 0;
      const currentTime = video.currentTime || 0;
      const remaining = Math.max(0, duration - currentTime);

      if (duration > 0 && remaining <= FADE_OUT_SECONDS) {
        const progress = 1 - remaining / FADE_OUT_SECONDS;
        setOverlayOpacity(Math.min(1, progress));
      } else if (!hasTriggeredLoopRef.current) {
        setOverlayOpacity(0);
      }

      frameRef.current = window.requestAnimationFrame(step);
    };

    const restartLoop = async () => {
      hasTriggeredLoopRef.current = true;
      clearFadeTimeout();
      setOverlayOpacity(1);

      video.currentTime = 0;
      try {
        await video.play();
      } catch {
        return;
      }

      fadeInTimeoutRef.current = window.setTimeout(() => {
        setOverlayOpacity(0);
        hasTriggeredLoopRef.current = false;
      }, 60);
    };

    const handleEnded = () => {
      void restartLoop();
    };

    video.loop = false;
    video.addEventListener("ended", handleEnded);
    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      video.removeEventListener("ended", handleEnded);
      clearFadeTimeout();
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
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
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-60 [filter:brightness(0.72)_contrast(0.92)] sm:object-[center_42%]"
      >
        <source src="/hero-background-original.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black"
        style={{
          opacity: 0,
          transition: `opacity ${FADE_IN_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
    </>
  );
}
