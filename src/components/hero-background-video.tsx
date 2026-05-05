export function HeroBackgroundVideo() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-70"
    >
      <source src="/hero-background.mp4" type="video/mp4" />
    </video>
  );
}
