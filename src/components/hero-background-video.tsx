export function HeroBackgroundVideo() {
  return (
    <video
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
