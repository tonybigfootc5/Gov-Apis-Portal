"use client";

import { useEffect, useRef } from "react";

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.6;

    const handleCanPlay = () => {
      video.playbackRate = 0.6;
    };

    video.addEventListener("canplay", handleCanPlay);
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-screen"
    >
      <source src="/hero-background.mp4" type="video/mp4" />
    </video>
  );
}
