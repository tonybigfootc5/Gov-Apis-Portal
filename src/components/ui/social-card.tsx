"use client";

import Image from "next/image";

type SocialLink = {
  href: string;
  label: string;
  iconSrc: string;
  className: string;
  iconClassName: string;
  delay?: string;
};

type SocialCardProps = {
  title?: string;
  socialLinks: SocialLink[];
};

export function SocialCard({ title = "Socials", socialLinks }: SocialCardProps) {
  return (
    <div className="group relative aspect-square w-full overflow-hidden rounded-[2.35rem] border-2 border-white/90 bg-[linear-gradient(135deg,#c24fce_0%,#d25caf_34%,#ee9d95_70%,#ffc475_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_35%,rgba(255,255,255,0.25),rgba(255,255,255,0)_35%)] transition duration-700 group-hover:scale-110" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.2)_54%,rgba(255,255,255,0.04))]" aria-hidden="true" />

      <p className="relative z-20 text-right text-[clamp(2.15rem,3vw,2.9rem)] font-black leading-none tracking-[-0.055em] text-white">
        {title}
      </p>

      {socialLinks.map((link) => (
        <SocialBox key={link.label} {...link} />
      ))}

      <div
        className="absolute -bottom-14 -left-14 h-24 w-24 rounded-tr-[1.1rem] border-2 border-white/85 bg-white/16 backdrop-blur-sm transition duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
        style={{ transitionDelay: "0.45s" }}
        aria-hidden="true"
      />
    </div>
  );
}

function SocialBox({ href, label, iconSrc, className, iconClassName, delay }: SocialLink) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={`absolute border-2 border-white/90 bg-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] backdrop-blur-sm transition duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 ${className}`}
      style={{ transitionDelay: delay }}
    >
      <span className={`absolute grid place-items-center rounded-2xl bg-white/62 shadow-[0_14px_28px_rgba(0,0,0,0.1)] ${iconClassName}`}>
        <Image src={iconSrc} alt="" fill sizes="42px" className="object-contain p-1.5" />
      </span>
    </a>
  );
}
