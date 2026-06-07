"use client";

import { useEffect, useRef } from "react";

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applyPlaybackTuning = () => {
      video.playbackRate = 0.9;
      video.defaultPlaybackRate = 0.9;
      video.preservesPitch = true;
    };

    applyPlaybackTuning();
    void video.play().catch(() => {});
    video.addEventListener("loadeddata", applyPlaybackTuning);

    return () => {
      video.removeEventListener("loadeddata", applyPlaybackTuning);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    >
      <source src="/hero-background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
