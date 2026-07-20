"use client";

import type React from "react";
import Image from "next/image";
import { useRef } from "react";
import { BadgeCheck, Calendar, GraduationCap, Leaf, Map, ShieldCheck, Sprout, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { getSiteCopy } from "@/lib/site-copy";
import type { SiteLanguage } from "@/lib/i18n";

const aboutStats = [
  {
    icon: Sprout,
    value: "20-80%",
    label: "Crop Yield Potential",
    body: "Beekeeping enhances pollination leading to 20-80% higher crop yield.",
    tone: "green",
  },
  {
    icon: Calendar,
    value: "5-Day",
    label: "Scientific Beekeeping Training",
    body: "Hands-on training with expert guidance and real-world applications.",
    tone: "gold",
  },
  {
    icon: Users,
    value: "130+ Years",
    label: "Combined Faculty Experience",
    body: "Learn from experienced professionals and apiculture experts.",
    tone: "green",
  },
  {
    icon: ShieldCheck,
    value: "Pan-India",
    label: "Training & Technical Reach",
    body: "Empowering beekeepers across India with knowledge and support.",
    tone: "gold",
  },
] as const;

const impactPillars = [
  { icon: BadgeCheck, label: "Practical Training" },
  { icon: Leaf, label: "Sustainable Livelihoods" },
  { icon: Users, label: "Stronger Communities" },
  { icon: GraduationCap, label: "Better Tomorrow" },
] as const;

export default function AboutUsSection({ language }: { language: SiteLanguage }) {
  const copy = getSiteCopy(language);
  const peopleGroups = copy.about.peopleGroups;
  const moreCards = copy.about.moreCards;
  const peopleRef = useRef<HTMLDivElement>(null);
  const isPeopleInView = useInView(peopleRef, { once: true, amount: 0.15 });
  const missionMembers = peopleGroups.flatMap((group) =>
    group.members.map((member) => ({
      ...member,
      groupEyebrow: group.eyebrow,
    })),
  );

  const storyParagraphs = [
    <>
      Api Culture Technology Center was <strong>established in 2004</strong> at Rural Technology Park in association with NIRDPR, with technical support from the Bee Keepers Association and Kavuri.
    </>,
    <>
      The center presents itself as a practical mission for <strong>training, technology transfer, pollination, and livelihood support</strong> across rural communities.
    </>,
    <>
      The mission grows through scientific beekeeping, honey processing, queen rearing, hive product awareness, equipment access, and public-facing apiculture education for farmers and future beekeeping entrepreneurs.
    </>,
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="about-section"
      className="relative scroll-mt-28 overflow-hidden bg-[#fbfcf9] px-4 py-20 text-[#173f33] sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fffaf0_0%,#fbfcf9_48%,#f5f8f1_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#e5ead9] to-transparent" aria-hidden="true" />

      <motion.div
        className="relative z-10 mx-auto max-w-[1480px]"
        initial="visible"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="relative isolate overflow-hidden rounded-[1.6rem] border border-white/65 bg-[#f4e7b4] p-3 shadow-[0_30px_90px_rgba(76,45,5,0.16),inset_0_1px_0_rgba(255,255,255,0.58)] sm:p-4 lg:p-5"
          style={{ minHeight: "56rem" }}
          variants={itemVariants}
        >
          <Image
            src="/about-bee-flower-background.png"
            alt=""
            fill
            sizes="(min-width: 1536px) 1480px, 100vw"
            className="object-cover object-center"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,252,240,0.52)_0%,rgba(255,248,227,0.26)_42%,rgba(255,255,255,0.04)_100%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28),inset_0_40px_90px_rgba(255,255,255,0.08)]" aria-hidden="true" />

          <div className="relative z-10 grid h-full items-stretch gap-4 xl:grid-cols-2">
          <article
            className="relative isolate min-h-[42rem] overflow-hidden rounded-[1.35rem] border border-white/48 bg-white/18 p-7 shadow-[0_24px_70px_rgba(74,46,6,0.13),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-24px_42px_rgba(255,255,255,0.05)] backdrop-blur-[14px] backdrop-saturate-150 sm:p-10 lg:p-12"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.26),rgba(255,255,255,0.08)_48%,rgba(255,255,255,0.14)_100%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-[1px] rounded-[1.3rem] border border-white/38" aria-hidden="true" />

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-4 text-[#d99a00]">
                <p className="text-xs font-black uppercase tracking-[0.42em]">About Us</p>
                <div className="h-px w-16 bg-[#d99a00]" />
                <Image src="/api-culture-logo-clean.png" alt="" width={42} height={42} className="h-10 w-10 object-contain" />
                <div className="hidden h-px w-24 bg-[#d99a00] sm:block" />
              </div>

              <h1
                aria-label="Api Culture Technology Center"
                className="mt-7 max-w-[42rem] text-5xl font-black leading-[0.96] text-[#123f31] sm:text-6xl lg:text-7xl"
              >
                Api Culture
                <span className="block">Technology Center</span>
              </h1>
              <div className="mt-6 h-1.5 w-24 bg-[#d99a00] shadow-[2px_2px_0_rgba(18,63,49,0.14)]" />

              <div className="mt-10 space-y-7 text-lg font-semibold leading-8 text-[#182a22] sm:text-xl sm:leading-9">
                {storyParagraphs.map((paragraph, index) => (
                  <p key={index} className="[&_strong]:font-black [&_strong]:text-[#1f6543]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>

          <aside className="relative isolate overflow-hidden rounded-[1.35rem] border border-white/45 bg-white/12 p-3 shadow-[0_28px_75px_rgba(74,46,6,0.15),inset_0_1px_0_rgba(255,255,255,0.68),inset_0_-24px_46px_rgba(255,255,255,0.05)] backdrop-blur-[14px] backdrop-saturate-150 sm:p-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(255,255,255,0.24),transparent_34%),radial-gradient(circle_at_80%_80%,rgba(255,189,38,0.08),transparent_32%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-[1px] rounded-[1.3rem] border border-white/32" aria-hidden="true" />
            <div className="relative z-10 grid gap-3 sm:grid-cols-2">
              {aboutStats.map((stat) => (
                <AboutStatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="relative z-10 mt-3 grid overflow-hidden rounded-[1rem] border border-white/30 bg-[#063f2e]/42 text-white shadow-[0_16px_34px_rgba(6,67,47,0.16),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-[12px] sm:grid-cols-4">
              {impactPillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.label} className="flex items-center gap-3 border-white/18 px-5 py-5 sm:border-l sm:first:border-l-0">
                    <Icon className="h-8 w-8 shrink-0 text-[#e1a400]" strokeWidth={2.2} />
                    <p className="text-sm font-black leading-snug">{pillar.label}</p>
                    {index < impactPillars.length - 1 ? <span className="sr-only">,</span> : null}
                  </div>
                );
              })}
            </div>
          </aside>
          </div>
        </motion.div>

        <motion.div
          ref={peopleRef}
          className="mx-auto mt-20 max-w-7xl"
          initial="hidden"
          animate={isPeopleInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div className="mx-auto max-w-3xl text-center" variants={itemVariants}>
            <p className="font-display text-sm italic text-[#8a978f]">{copy.about.peopleEyebrow}</p>
            <h2 className="mt-3 text-[clamp(2.25rem,4.2vw,4.4rem)] font-black leading-[0.92] tracking-[-0.03em] text-[#101713]">
              {copy.about.peopleTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6a7771]">
              {copy.about.peopleBody}
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {missionMembers.map((member, index) => (
              <TeamMemberTile key={member.name} member={member} index={index} />
            ))}
          </div>
        </motion.div>

        <motion.div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4" variants={containerVariants}>
          {moreCards.map((card) => (
            <motion.div
              key={card.title}
              className="rounded-[1.35rem] border border-[#e8eee9] bg-white p-5 shadow-[0_12px_30px_rgba(34,45,38,0.05)]"
              variants={itemVariants}
            >
              <p className="text-lg font-semibold text-[#173f33]">{card.title}</p>
              <p className="mt-3 text-sm leading-7 text-[#5f6e67]">{card.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function AboutStatCard({
  icon: Icon,
  value,
  label,
  body,
  tone,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  body: string;
  tone: "green" | "gold";
}) {
  const isGold = tone === "gold";

  return (
    <div className="group relative flex min-h-[18rem] flex-col items-center justify-center overflow-hidden rounded-[1.1rem] border border-white/40 bg-white/14 p-6 text-center shadow-[0_18px_38px_rgba(74,46,6,0.12),inset_0_1px_0_rgba(255,255,255,0.62),inset_0_-18px_34px_rgba(255,255,255,0.04)] backdrop-blur-[12px] backdrop-saturate-150">
      <div
        className={`pointer-events-none absolute inset-0 opacity-48 transition duration-500 group-hover:opacity-78 ${
          isGold
            ? "bg-[radial-gradient(circle_at_50%_14%,rgba(255,211,81,0.18),transparent_46%),linear-gradient(145deg,rgba(255,255,255,0.15),rgba(255,255,255,0.04))]"
            : "bg-[radial-gradient(circle_at_50%_14%,rgba(116,132,47,0.14),transparent_46%),linear-gradient(145deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))]"
        }`}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 grid h-20 w-20 place-items-center rounded-full border-4 border-white/58 shadow-[0_10px_28px_rgba(74,46,6,0.14),inset_0_2px_0_rgba(255,255,255,0.5)] backdrop-blur-md ${
          isGold ? "bg-[#f2b21c]/72 text-white ring-2 ring-[#f2b21c]/35" : "bg-[#58762a]/72 text-white ring-2 ring-[#6e8f2f]/28"
        }`}
      >
        <Icon className="h-10 w-10" strokeWidth={2.2} />
      </div>
      <div className="relative z-10 my-4 h-px w-24 bg-gradient-to-r from-transparent via-white/68 to-transparent" />
      <p className="relative z-10 text-5xl font-black leading-none text-[#123f31] [text-shadow:0_1px_16px_rgba(255,255,255,0.84)] sm:text-6xl">{value}</p>
      <h3 className="relative z-10 mt-3 max-w-64 text-xl font-black leading-snug text-[#123f31] [text-shadow:0_1px_14px_rgba(255,255,255,0.72)]">{label}</h3>
      <p className="relative z-10 mt-4 max-w-72 text-base font-semibold leading-6 text-[#26382f] [text-shadow:0_1px_12px_rgba(255,255,255,0.72)]">{body}</p>
      <div className="pointer-events-none absolute -bottom-8 -right-10 text-[#123f31]/[0.045]" aria-hidden="true">
        <Map className="h-40 w-40" strokeWidth={1.2} />
      </div>
    </div>
  );
}

function TeamMemberTile({
  member,
  index,
}: {
  member: {
    name: string;
    designation: string;
    role: string;
    highlights: string[];
    groupEyebrow: string;
  };
  index: number;
}) {
  const splitName = member.name.replace(/\. /g, ".\n");
  const toneClasses = [
    "from-[#f6f8f3] to-[#eef3ee]",
    "from-[#f8f5ef] to-[#eff4f0]",
    "from-[#f4f7f8] to-[#eef3ef]",
    "from-[#f7f4ef] to-[#f0f4ef]",
  ];
  const portraitTones = [
    {
      skin: "#d7b08a",
      hair: "#59655f",
      shirt: "#ffffff",
      accent: "#f2b544",
    },
    {
      skin: "#c99773",
      hair: "#3d4742",
      shirt: "#f8faf7",
      accent: "#8aa392",
    },
    {
      skin: "#b98567",
      hair: "#2d3833",
      shirt: "#ffffff",
      accent: "#d6a84b",
    },
    {
      skin: "#e0b991",
      hair: "#4b554f",
      shirt: "#f5f7f4",
      accent: "#9fb6a7",
    },
  ];
  const portrait = portraitTones[index % portraitTones.length];

  return (
    <motion.article
      className={`group relative flex min-h-[25rem] overflow-hidden rounded-[1.35rem] bg-gradient-to-b ${toneClasses[index % toneClasses.length]} p-5`}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: index * 0.06 },
        },
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%]" aria-hidden="true">
        <div
          className="absolute bottom-[-1.2rem] right-[-0.8rem] h-56 w-44 rounded-t-[5rem] transition duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03]"
          style={{ backgroundColor: portrait.shirt }}
        />
        <div
          className="absolute bottom-[9.2rem] right-[3.2rem] h-20 w-20 rounded-full shadow-[inset_-10px_-8px_0_rgba(70,55,42,0.08)] transition duration-500 group-hover:-translate-y-1"
          style={{ backgroundColor: portrait.skin }}
        />
        <div
          className="absolute bottom-[13.8rem] right-[2.75rem] h-12 w-24 rounded-t-full transition duration-500 group-hover:-translate-y-1"
          style={{ backgroundColor: portrait.hair }}
        />
        <div
          className="absolute bottom-[13.1rem] right-[4.75rem] h-7 w-12 rounded-b-full"
          style={{ backgroundColor: portrait.hair }}
        />
        <div className="absolute bottom-[11.2rem] right-[4.55rem] h-2 w-2 rounded-full bg-[#173f33]/55" />
        <div className="absolute bottom-[11.2rem] right-[6.2rem] h-2 w-2 rounded-full bg-[#173f33]/55" />
        <div className="absolute bottom-[10.2rem] right-[5.08rem] h-1.5 w-5 rounded-full bg-[#173f33]/30" />
        <div
          className="absolute bottom-[4.3rem] right-[1.6rem] h-10 w-40 rounded-full opacity-80"
          style={{ backgroundColor: portrait.accent }}
        />
        <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white/42 blur-2xl" />
      </div>
      <div className="relative z-10 flex min-h-full w-full flex-col">
        <div>
          <h4 className="whitespace-pre-line text-[clamp(1.65rem,2.2vw,2.35rem)] font-black leading-[0.88] tracking-[-0.04em] text-[#111813]">
            {splitName}
          </h4>
          <p className="mt-3 font-display text-sm italic text-[#7f8d85]">{member.groupEyebrow}</p>
          <p className="mt-2 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-[#b97816]">{member.designation}</p>
        </div>

        <div className="relative mt-auto pt-8">
          <p className="relative z-10 max-w-[13.5rem] text-sm font-medium leading-6 text-[#4f6058]">{member.role}</p>
          <div className="relative z-10 mt-4 flex flex-wrap gap-2">
            {member.highlights.slice(0, 2).map((highlight) => (
              <span key={highlight} className="rounded-full bg-white/76 px-3 py-1 text-[11px] font-bold text-[#61716a]">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
