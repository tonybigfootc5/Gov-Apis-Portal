import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Globe2, GraduationCap, Landmark, Quote, ShieldCheck, Sprout, UsersRound } from "lucide-react";
import { t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

export const metadata: Metadata = {
  title: "About",
  description: "About API CULTURE Technology Center for beekeeping and apiculture technology.",
};

const partnerLogos = [
  { name: "Bee Keepers Association", type: "image", src: "/scientific-beekeeping-icon.png" },
  { name: "NIRDPR", type: "image", src: "/nirdpr-logo.jpeg" },
  { name: "Kavuri", type: "image", src: "/kavuri-extract-3.png" },
  { name: "Training", type: "text" },
  { name: "Pollination", type: "text" },
  { name: "Technology Transfer", type: "text" },
] as const;

const beliefCards = [
  {
    title: "Rural livelihoods matter",
    text: "Beekeeping creates an income-support pathway for farmers, women, tribal communities, and future rural entrepreneurs.",
    icon: UsersRound,
  },
  {
    title: "Pollination improves outcomes",
    text: "Managed bee activity supports crop productivity and strengthens the wider agricultural ecosystem around farming communities.",
    icon: Sprout,
  },
  {
    title: "Training must stay practical",
    text: "The center combines field demonstrations, technology transfer, colony care, processing awareness, and guided learning.",
    icon: GraduationCap,
  },
  {
    title: "Institutional support builds trust",
    text: "The mission is strengthened by NIRDPR, beekeeping leadership, and long-term technical support around apiculture practice.",
    icon: Landmark,
  },
] as const;

const storyFacts = [
  { label: "Established", value: "2004" },
  { label: "Partners", value: "3" },
  { label: "Focus", value: "Training, pollination, technology transfer" },
] as const;

const peopleSections = [
  {
    title: "Leadership and committee",
    eyebrow: "Direction and governance",
    members: [
      {
        name: "K. Sambashiva Rao",
        designation: "President, Bee Keepers Association | Faculty Member and Field Expert",
        role: "Brings around 40 years of beekeeping experience with emphasis on field practice, bee breeding, colony management, and migration support.",
        initials: "KS",
        highlights: ["40 years experience", "National Bee Board member", "Field expert"],
      },
      {
        name: "P. Ravindra Kumar",
        designation: "Director, Api Culture Technology Center | Vice President, Bee Keepers Association",
        role: "Supports center direction through training leadership across scientific beekeeping, honey processing, queen rearing, migration, and awareness work.",
        initials: "PR",
        highlights: ["26 years experience", "Director and faculty", "Training lead"],
      },
    ],
  },
  {
    title: "Faculty and technical advisors",
    eyebrow: "Training and science support",
    members: [
      {
        name: "P. Sita Rathnam",
        designation: "Faculty Member, Api Culture Technology Center",
        role: "Supports queen rearing, royal jelly collection, and honey processing and packing technology training through practical sessions.",
        initials: "PS",
        highlights: ["15 years experience", "MBA", "Practical training support"],
      },
      {
        name: "K. Subba Rao",
        designation: "Senior Scientist and Technical Adviser | Faculty Member",
        role: "Contributes long-standing scientific and R&D knowledge across beekeeping subjects with senior technical credibility.",
        initials: "KR",
        highlights: ["50 years experience", "Retd. scientist", "Technical adviser"],
      },
    ],
  },
] as const;

const moreAboutCards = [
  {
    title: "Mission and focus",
    body: "Scientific beekeeping, technology awareness, practical training, pollination support, and livelihood development.",
    icon: ShieldCheck,
  },
  {
    title: "What the center teaches",
    body: "Honey processing, queen rearing, hive products, equipment exposure, and field-ready apiary practice.",
    icon: Cpu,
  },
  {
    title: "Who the mission supports",
    body: "Farmers, rural youth, women groups, tribal communities, trainees, and future beekeeping entrepreneurs.",
    icon: Globe2,
  },
  {
    title: "Why it matters",
    body: "It connects apiculture training with income, crop support, pollination awareness, and confidence in rural technology.",
    icon: Sprout,
  },
] as const;

export default async function AboutPage() {
  const language = await getRequestLanguage();

  return (
    <section className="bg-[#faf8f2]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(135deg,#fffdf8_0%,#f6efe4_54%,#f1e2c3_100%)] shadow-[0_24px_60px_rgba(64,44,8,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_30rem]">
            <div className="px-6 py-10 sm:px-10 sm:py-14">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">
                {t(language, "about.eyebrow")}
              </p>
              <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[#1b3b2b] sm:text-5xl">
                We help honey farming grow through learning, technology, and field support.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#516253] sm:text-lg">
                API Culture Technology Center operates in Rajendranagar, Hyderabad as a practical beekeeping mission built around training, technology transfer, pollination awareness, and rural livelihood support.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-[#1b3b2b]">
                  Established in 2004
                </span>
                <span className="rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-[#1b3b2b]">
                  NIRDPR-linked mission
                </span>
                <span className="rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-[#1b3b2b]">
                  Field-first apiculture
                </span>
              </div>
            </div>

            <div className="relative min-h-[22rem] border-t border-[rgba(27,59,43,0.12)] lg:min-h-full lg:border-l lg:border-t-0">
              <Image
                src="/field-beekeeping.jpg"
                alt="API CULTURE beekeeping field practice"
                fill
                priority
                sizes="(min-width: 1024px) 30rem, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.12)_0%,rgba(17,24,39,0.34)_100%)]" />
            </div>
          </div>
        </div>

        <div className="bg-[#fffdf8] px-6 py-10 text-center sm:px-10">
          <h2 className="font-display text-3xl font-semibold text-[#1b3b2b] sm:text-4xl">
            Learn from leading institutional and field collaborators
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#516253]">
            The center works through a shared ecosystem that includes NIRDPR, practical beekeeping leadership, technical support partners, and field-driven rural training activity.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {partnerLogos.map((partner) => (
              <div
                key={partner.name}
                className="flex h-20 items-center justify-center rounded-[1.2rem] border border-[rgba(27,59,43,0.1)] bg-[#fffaf1] px-4 shadow-[0_8px_20px_rgba(64,44,8,0.05)]"
              >
                {partner.type === "image" ? (
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={120}
                    height={56}
                    className="max-h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="text-center text-sm font-semibold text-[#1b3b2b]">{partner.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.2rem] bg-[#173f33] px-6 py-12 text-white shadow-[0_24px_60px_rgba(23,63,51,0.18)] sm:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-semibold text-[#fff8ea]">We believe</h2>
            <p className="mt-3 text-lg text-[#e3ddd1]">
              Learning is the source of practical progress in honey farming and rural apiculture.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {beliefCards.map(({ title, text, icon: Icon }) => (
              <div key={title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/12 bg-white/8">
                  <Icon className="h-7 w-7 text-[#f6cf74]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#fff8ea]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#d9dfd8]">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm font-semibold text-[#e3ddd1]">
            So that farmers, trainees, and rural communities can build stronger futures through apiculture.
          </p>
        </div>

        <div className="grid gap-8 py-12 lg:grid-cols-[26rem_minmax(0,1fr)] lg:items-center">
          <div className="relative overflow-hidden rounded-[1.8rem] border border-[rgba(27,59,43,0.1)] bg-[#fff7e5] p-6 shadow-[0_16px_40px_rgba(64,44,8,0.06)]">
            <div className="absolute -left-20 top-8 h-72 w-72 rounded-full border-2 border-[#eab308]/40" />
            <div className="absolute -right-8 top-20 h-36 w-36 rounded-full border border-[#eab308]/45" />
            <div className="relative mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-[12px] border-[#f4f0df] bg-[#f7f1de]">
              <Image
                src="/field-beekeeping.jpg"
                alt="Mission voice from API CULTURE field practice"
                fill
                sizes="12rem"
                className="object-cover"
              />
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-6 shadow-[0_16px_40px_rgba(64,44,8,0.06)] sm:p-8">
            <Quote className="h-8 w-8 text-[#b36b00]" aria-hidden="true" />
            <p className="mt-4 text-xl leading-9 text-[#1b3b2b]">
              API CULTURE was established to connect practical beekeeping training with pollination support, field confidence, and rural livelihood opportunity across communities that need sustainable income pathways.
            </p>
            <p className="mt-5 text-sm font-semibold text-[#1b3b2b]">Mission voice</p>
            <p className="mt-1 text-sm text-[#667085]">
              Drawn from the center&apos;s 2025 profile and institutional mission narrative.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#f6efe4_0%,#efe3c8_100%)] px-6 py-10 text-center shadow-[0_16px_40px_rgba(64,44,8,0.06)] sm:px-10">
          <h2 className="font-display text-4xl font-semibold text-[#1b3b2b]">Join the community and start learning today</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-[#516253]">
            Explore the center&apos;s training pathways, technology guidance, and rural support mission through API CULTURE.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/programs"
              className="inline-flex items-center justify-center rounded-xl bg-[#1b3b2b] px-6 py-3 text-sm font-semibold text-[#fff8ea] shadow-[0_12px_28px_rgba(27,59,43,0.18)]"
            >
              View training
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#b36b00]">
              Contact the center
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 py-12 lg:grid-cols-[26rem_minmax(0,1fr)] lg:items-center">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="overflow-hidden rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] shadow-[0_10px_24px_rgba(64,44,8,0.05)]">
              <Image src="/nirdpr-logo.jpeg" alt="NIRDPR institutional support" width={500} height={260} className="h-44 w-full object-contain bg-[#fffaf1] p-5" />
            </div>
            <div className="overflow-hidden rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] shadow-[0_10px_24px_rgba(64,44,8,0.05)]">
              <Image src="/scientific-beekeeping-icon.png" alt="Bee keeping practice support" width={500} height={260} className="h-44 w-full object-contain bg-[#fffaf1] p-5" />
            </div>
            <div className="overflow-hidden rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] shadow-[0_10px_24px_rgba(64,44,8,0.05)] sm:col-span-2">
              <Image src="/kavuri-extract-3.png" alt="Value addition and field support" width={900} height={320} className="h-44 w-full object-contain bg-[#fffaf1] p-5" />
            </div>
          </div>

          <div>
            <h2 className="font-display text-4xl font-semibold text-[#1b3b2b]">Our story</h2>
            <p className="mt-5 text-base leading-8 text-[#516253]">
              Api Culture Technology Center was established in 2004 at Rural Technology Park in association with NIRDPR, with technical support from the Bee Keepers Association and Kavuri. The center presents itself as a practical mission for training, technology transfer, pollination, and livelihood support across rural communities.
            </p>
            <p className="mt-5 text-base leading-8 text-[#516253]">
              The mission grows through scientific beekeeping, honey processing, queen rearing, hive product awareness, equipment access, and public-facing apiculture education. It is designed to help farmers and future beekeeping entrepreneurs build more confident and sustainable pathways.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {storyFacts.map((fact) => (
                <div key={fact.label} className="rounded-[1.2rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-4 py-5 shadow-[0_8px_20px_rgba(64,44,8,0.04)]">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b36b00]">{fact.label}</p>
                  <p className="mt-2 text-lg font-semibold text-[#1b3b2b]">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-4">
          <div className="rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-6 py-10 shadow-[0_16px_40px_rgba(64,44,8,0.06)] sm:px-10">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">People Behind the Mission</p>
              <h2 className="font-display mt-4 text-4xl font-semibold text-[#1b3b2b]">Leadership, faculty, and technical guidance</h2>
              <p className="mt-4 text-base leading-8 text-[#516253]">
                The center&apos;s mission is backed by experienced beekeeping leaders, faculty members, and senior technical advisors who guide training, field practice, and institutional continuity.
              </p>
            </div>

            <div className="mt-8 grid gap-6">
              {peopleSections.map((group) => (
                <section key={group.title} className="rounded-[1.6rem] border border-[rgba(27,59,43,0.1)] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f2e7_100%)] p-5 shadow-[0_10px_24px_rgba(64,44,8,0.04)] sm:p-6">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b36b00]">{group.eyebrow}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-[#1b3b2b]">{group.title}</h3>
                    </div>
                    <div className="rounded-full border border-[rgba(27,59,43,0.1)] bg-[#fff7e5] px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#1b3b2b]">
                      Verified profile roles
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    {group.members.map((member) => (
                      <article key={`${group.title}-${member.initials}`} className="rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 shadow-[0_8px_20px_rgba(64,44,8,0.04)]">
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,#173f33,#295646)] text-lg font-black uppercase text-[#fff8ea] shadow-[0_10px_24px_rgba(23,63,51,0.14)]">
                            {member.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b36b00]">Profile</p>
                            <h4 className="mt-2 text-xl font-semibold leading-tight text-[#1b3b2b]">{member.name}</h4>
                            <p className="mt-2 text-sm font-semibold leading-6 text-[#607366]">{member.designation}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[#516253]">{member.role}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {member.highlights.map((highlight) => (
                            <span key={`${member.initials}-${highlight}`} className="rounded-full border border-[rgba(27,59,43,0.1)] bg-[#fff7e5] px-3 py-1.5 text-xs font-semibold text-[#1b3b2b]">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#f6efe4_0%,#f1e6cf_100%)] px-6 py-10 shadow-[0_16px_40px_rgba(64,44,8,0.06)] sm:px-10">
          <h2 className="font-display text-center text-4xl font-semibold text-[#1b3b2b]">More about API CULTURE</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {moreAboutCards.map(({ title, body, icon: Icon }) => (
              <div key={title} className="rounded-[1.4rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-5 text-center shadow-[0_8px_22px_rgba(64,44,8,0.04)]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1cd] text-[#b36b00]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#1b3b2b]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#516253]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
