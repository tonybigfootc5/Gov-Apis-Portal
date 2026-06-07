"use client";

import { useRef, useState } from "react";

const FADE_DURATION_MS = 1800;
const FADE_WINDOW_SECONDS = 1.8;

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  function handleTimeUpdate() {
    const video = videoRef.current;

    if (!video || !Number.isFinite(video.duration) || video.duration <= FADE_WINDOW_SECONDS) {
      return;
    }

    if (video.duration - video.currentTime <= FADE_WINDOW_SECONDS) {
      setOverlayVisible(true);
    }
  }

  async function handleEnded() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = 0;

    try {
      await video.play();
    } catch {
      return;
    }

    requestAnimationFrame(() => {
      setOverlayVisible(false);
    });
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[#120c12] transition-opacity ease-in-out ${
          overlayVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
      />
    </>
  );
}
