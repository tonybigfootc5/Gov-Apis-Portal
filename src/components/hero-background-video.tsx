"use client";

import { useEffect, useRef, useState } from "react";

export function HeroBackgroundVideo() {
  const primaryVideoRef = useRef<HTMLVideoElement>(null);
  const secondaryVideoRef = useRef<HTMLVideoElement>(null);
  const hasStartedOverlapRef = useRef(false);
  const [activeVideo, setActiveVideo] = useState<"primary" | "secondary">("primary");
  const playbackRate = 0.28;
  const overlapSeconds = 1.4;

  useEffect(() => {
    const primary = primaryVideoRef.current;
    const secondary = secondaryVideoRef.current;
    if (!primary || !secondary) return;

    const syncPlayback = (video: HTMLVideoElement) => {
      video.playbackRate = playbackRate;
      video.muted = true;
    };

    const playVideo = async (video: HTMLVideoElement) => {
      syncPlayback(video);
      try {
        await video.play();
      } catch {
        // Browser autoplay may defer playback until allowed.
      }
    };

    const prepareNextVideo = (current: HTMLVideoElement, next: HTMLVideoElement) => {
      if (!current.duration || current.duration - current.currentTime > overlapSeconds || hasStartedOverlapRef.current) {
        return;
      }

      hasStartedOverlapRef.current = true;
      next.currentTime = 0;
      void playVideo(next);
      setActiveVideo(next === primary ? "primary" : "secondary");
    };

    const handlePrimaryTimeUpdate = () => prepareNextVideo(primary, secondary);
    const handleSecondaryTimeUpdate = () => prepareNextVideo(secondary, primary);

    const handlePrimaryEnded = () => {
      primary.pause();
      primary.currentTime = 0;
      hasStartedOverlapRef.current = false;
    };

    const handleSecondaryEnded = () => {
      secondary.pause();
      secondary.currentTime = 0;
      hasStartedOverlapRef.current = false;
    };

    void playVideo(primary);
    primary.addEventListener("timeupdate", handlePrimaryTimeUpdate);
    secondary.addEventListener("timeupdate", handleSecondaryTimeUpdate);
    primary.addEventListener("ended", handlePrimaryEnded);
    secondary.addEventListener("ended", handleSecondaryEnded);

    return () => {
      primary.removeEventListener("timeupdate", handlePrimaryTimeUpdate);
      secondary.removeEventListener("timeupdate", handleSecondaryTimeUpdate);
      primary.removeEventListener("ended", handlePrimaryEnded);
      secondary.removeEventListener("ended", handleSecondaryEnded);
    };
  }, []);

  return (
    <>
      <video
        ref={primaryVideoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen transition-opacity duration-[1400ms] ${
          activeVideo === "primary" ? "opacity-70" : "opacity-0"
        }`}
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>
      <video
        ref={secondaryVideoRef}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen transition-opacity duration-[1400ms] ${
          activeVideo === "secondary" ? "opacity-70" : "opacity-0"
        }`}
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>
    </>
  );
}
