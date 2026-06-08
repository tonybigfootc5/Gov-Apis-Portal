import type { Metadata } from "next";
import Image from "next/image";
import {
  BadgeCheck,
  Cpu,
  GraduationCap,
  MapPin,
  Microscope,
  ShieldCheck,
  Sprout,
  UsersRound,
  Waypoints,
  Wrench,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

export const metadata: Metadata = {
  title: "About",
  description: "About API CULTURE Technology Center for beekeeping and apiculture technology.",
};

const partners = [
  {
    name: "Bee Keepers Association",
    role: "Field and technical support",
    summary:
      "The 2025 profile credits the association with long-standing beekeeping leadership, field practice, technology support, and practical mentoring for farmers and trainees.",
    points: ["Apiary practice", "Bee breeding", "Farmer mentoring"],
    visual: "association",
  },
  {
    name: "NIRDPR",
    role: "Institutional and development platform",
    summary:
      "NIRDPR provides the institutional setting, rural development ecosystem, and campus base that helps the mission reach communities through structured programmes.",
    points: ["RTP campus", "Rural livelihoods", "Training infrastructure"],
    visual: "nirdpr",
  },
  {
    name: "Kavuri",
    role: "Product and enterprise support",
    summary:
      "Kavuri is part of the mission story as a technical support contributor connected to bee hive and natural product orientation around value addition.",
    points: ["Natural products", "Value addition", "Enterprise relevance"],
    visual: "kavuri",
  },
] as const;

const supportAddresses = [
  {
    title: "Mission campus",
    label: "Primary working address",
    body: "Api Culture Technology Center, Honey House, #12 & 13, CIAT&SJ-RTP, National Institute of Rural Development & Panchayati Raj, Rajendranagar, Hyderabad, Telangana - 500030.",
    note: "This is the published address shown in the 2025 profile.",
    icon: MapPin,
  },
  {
    title: "Central government linkage",
    label: "National institutional support",
    body: "National Institute of Rural Development & Panchayati Raj (NIRDPR), Ministry of Rural Development, Government of India, Rajendranagar, Hyderabad, Telangana - 500030.",
    note: "The profile also references National Bee Board linkages under the Ministry of Agriculture, Government of India through key members.",
    icon: Cpu,
  },
  {
    title: "State and field coordination",
    label: "Programme network",
    body: "Training and awareness programmes are conducted in association with State Agriculture and Horticulture Departments, ITDA, DRDA, NGOs, and other field institutions.",
    note: "The supplied profile confirms state-level coordination but does not publish a single official state office address, so this section uses the verified programme network wording.",
    icon: UsersRound,
  },
] as const;

const technologyBoard = [
  {
    title: "Scientific Beekeeping",
    text: "Core technical training in bee species, colony care, hive handling, feeding, seasonal management, and safe field practice.",
    icon: Waypoints,
  },
  {
    title: "Honey Processing and Packing",
    text: "Scientific extraction, filtering, hygienic handling, processing, and packing for higher quality apiary honey.",
    icon: Microscope,
  },
  {
    title: "Queen Rearing and Breeding",
    text: "Quality queen improvement, stock multiplication, bee breeding support, and colony development guidance.",
    icon: GraduationCap,
  },
  {
    title: "Pollination Services",
    text: "Knowledge and field support to improve crop yield and fruit or seed quality through managed bee pollination.",
    icon: Sprout,
  },
  {
    title: "Hive Products Training",
    text: "Royal jelly, bee pollen, bees wax, propolis, and bee venom awareness with collection and processing exposure.",
    icon: Wrench,
  },
  {
    title: "Equipment and Manufacturing Support",
    text: "Support around bee hives, extractors, colony supply, veils, tools, comb foundation sheets, feeders, and related equipment.",
    icon: Cpu,
  },
] as const;

const peopleSections = [
  {
    title: "Leadership and Committee",
    eyebrow: "Direction and governance",
    members: [
      {
        name: "K. Sambashiva Rao",
        designation: "President, Bee Keepers Association | Faculty Member & Field Expert",
        role: "40 years of beekeeping experience focused on beekeeping, bee breeding, colony management, and migration.",
        initials: "KS",
        highlights: ["SSC", "Life Member, National Bee Board", "Field expert"],
      },
      {
        name: "P. Ravindra Kumar",
        designation: "Director, Api Culture Technology Center | Vice President, Bee Keepers Association",
        role: "26 years of experience in beekeeping, queen rearing, honey processing and packing, colony migration, awareness, and hive products collection.",
        initials: "PR",
        highlights: ["Diploma in Mechanical Engineering", "Member, National Bee Board", "Director and faculty"],
      },
    ],
  },
  {
    title: "Faculty",
    eyebrow: "Training and learning",
    members: [
      {
        name: "P. Ravindra Kumar",
        designation: "Director and Faculty Member",
        role: "Leads scientific beekeeping, honey processing, queen rearing, migration, and awareness sessions in both classroom and practical formats.",
        initials: "PR",
        highlights: ["Trained under NBB in 2011 and 2012", "5-day course lead", "Entrepreneur training"],
      },
      {
        name: "P. Sita Rathnam",
        designation: "Faculty Member, Api Culture Technology Center",
        role: "Supports queen rearing, royal jelly collection, and honey processing and packing technology training.",
        initials: "PS",
        highlights: ["BA, B.Ed, MBA", "15 years experience", "Practical training support"],
      },
    ],
  },
  {
    title: "Technical Advisors and Senior Scientists",
    eyebrow: "Science and technical credibility",
    members: [
      {
        name: "K. Subba Rao",
        designation: "Sr. Scientist & Technical Adviser, Faculty Member",
        role: "50 years of beekeeping and R&D experience covering apiculture across all subjects with retired scientific experience from CBRI, Pune.",
        initials: "KR",
        highlights: ["BSc", "Retd. Scientist, CBRI Pune", "South Zone Member, National Bee Board"],
      },
    ],
  },
] as const;

const impactPoints = [
  {
    title: "Better farmer livelihoods",
    text: "The profile positions beekeeping as a supplementary income pathway for farmers, rural families, tribal communities, and landless people.",
    icon: UsersRound,
  },
  {
    title: "Stronger pollination future",
    text: "Bee pollination supports crop productivity and can improve yields by about 20 to 80 percent across many cultivated crops.",
    icon: Sprout,
  },
  {
    title: "Practical rural technology",
    text: "The center combines classroom teaching, practical sessions, equipment demonstration, and field-ready technology transfer.",
    icon: Cpu,
  },
  {
    title: "Public trust and continuity",
    text: "The mission links a national rural development institution, experienced beekeeping leadership, and long-term technical training support.",
    icon: ShieldCheck,
  },
] as const;

export default async function AboutPage() {
  const language = await getRequestLanguage();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
      <div className="grid gap-8 overflow-hidden rounded-[2.4rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(135deg,#fffdf8_0%,#f6efe4_54%,#f1e2c3_100%)] p-5 shadow-[0_28px_70px_rgba(64,44,8,0.08)] sm:p-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
        <div className="flex flex-col justify-between">
          <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fff7e5] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#b36b00]">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            One living mission
          </p>
          <SectionHeading className="mt-5" eyebrow={t(language, "about.eyebrow")} title="Helping honey farming grow for the future">
            Api Culture Technology Center was established in 2004 at Rural Technology Park in association with NIRDPR, with technical support from the Bee Keepers Association and Kavuri. The 2025 profile presents the center as a training, technology transfer, pollination, and livelihood mission built to support farmers, rural communities, tribal communities, and future beekeeping entrepreneurs.
          </SectionHeading>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.6rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-4 sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">Established</p>
              <p className="font-display mt-2 text-4xl font-semibold text-[#1b3b2b]">2004</p>
            </div>
            <div className="rounded-[1.6rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-4 sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">Partners</p>
              <p className="font-display mt-2 text-4xl font-semibold text-[#1b3b2b]">3</p>
            </div>
            <div className="rounded-[1.6rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-4 sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">Focus</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#1b3b2b] sm:text-base">Training, pollination, technology transfer</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.14em] text-[#1b3b2b]">
            <span className="rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-4 py-2">Field-first mission</span>
            <span className="rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-4 py-2">Science + livelihoods</span>
          </div>
        </div>

        <div className="grid self-start">
          <div className="overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#173f33] p-4 shadow-[0_18px_44px_rgba(64,44,8,0.12)] sm:p-5">
            <Image
              src="/field-beekeeping.jpg"
              alt="Field beekeeping mission"
              width={1000}
              height={563}
              className="h-auto w-full rounded-[1.5rem] bg-[#214c3d] object-contain"
              priority
            />
            <div className="mt-4 rounded-[1.3rem] border border-white/10 bg-[rgba(14,26,20,0.76)] px-4 py-4 text-[#fff8ea] backdrop-blur-md sm:px-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f6cf74]">Mission map</p>
              <p className="mt-2 text-sm leading-6 text-[#f2eee5]">
                The center works through training, awareness, pollination support, bee breeding, equipment access, and consumer education so honey farming grows with skill, trust, and livelihood value.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 sm:mt-16">
        <SectionHeading eyebrow="Collaboration" title="Three collaborators moving in one direction" bodyClassName="max-w-2xl">
          Each organization plays a distinct role, but the outcome is shared: stronger honey farming, better rural understanding, and more confidence in apiculture as a future-ready pathway.
        </SectionHeading>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {partners.map((partner) => (
            <article key={partner.name} className="paper-panel flex h-full flex-col rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <PartnerVisual visual={partner.visual} />
                <div className="min-w-0 rounded-[1.3rem] border border-[rgba(27,59,43,0.08)] bg-[#fff7e5] px-4 py-3">
                  <h3 className="font-display text-[1.45rem] font-semibold leading-tight text-[#1b3b2b] sm:text-[1.6rem]">{partner.name}</h3>
                </div>
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#b36b00] sm:text-sm">{partner.role}</p>
              <p className="mt-4 text-sm leading-7 text-[#516253]">{partner.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2 pt-1">
                {partner.points.map((point) => (
                  <span key={point} className="rounded-full border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-3 py-1.5 text-xs font-semibold text-[#1b3b2b]">
                    {point}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-14 rounded-[2.2rem] border border-[rgba(27,59,43,0.12)] bg-[#173f33] px-5 py-8 text-[#fff8ea] shadow-[0_26px_60px_rgba(23,63,51,0.14)] sm:mt-16 sm:px-8 sm:py-9">
        <SectionHeading
          eyebrow="Government and Institutional Support"
          title="Official support should feel visible and easy to scan"
          eyebrowClassName="text-[#f6cf74]"
          titleClassName="text-[#fff8ea]"
          bodyClassName="text-[#dbe3dc]"
        >
          The 2025 profile clearly connects the center to its working campus, national institutional linkage, and wider field-level programme network. This section shows the verified support structure without adding unconfirmed details.
        </SectionHeading>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {supportAddresses.map(({ title, label, body, note, icon: Icon }) => (
            <div key={title} className="rounded-[1.7rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur-sm sm:p-6">
              <Icon className="h-6 w-6 text-[#f6cf74]" aria-hidden="true" />
              <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-[#f6cf74]">{label}</p>
              <h3 className="mt-2 font-display text-[1.7rem] font-semibold leading-tight text-[#fff8ea]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#e5e7e3]">{body}</p>
              <p className="mt-4 text-xs leading-6 text-[#d1d8d3]">{note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 sm:mt-16">
        <SectionHeading eyebrow="Technology Board" title="What this mission actually uses and teaches" bodyClassName="max-w-2xl">
          The profile lists practical technology areas that the center teaches, demonstrates, processes, or supports. These blocks translate that list into simple, readable service boards.
        </SectionHeading>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {technologyBoard.map(({ title, text, icon: Icon }) => (
            <div key={title} className="paper-panel rounded-[1.9rem] p-5 transition hover:-translate-y-1 sm:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ebb428,#b36b00)] text-[#fff8ea] shadow-[0_12px_28px_rgba(64,44,8,0.12)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-display mt-4 text-[1.7rem] font-semibold leading-tight text-[#1b3b2b]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#516253]">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 sm:mt-16">
        <SectionHeading eyebrow="People Behind the Mission" title="Managing, faculty, and technical members" bodyClassName="max-w-2xl">
          These names and designations are filled from the 2025 profile. Photos were not clearly available in the supplied file set, so the cards use initials and verified profile details instead of made-up images.
        </SectionHeading>
        <div className="mt-8 grid gap-6">
          {peopleSections.map((group) => (
            <section key={group.title} className="rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-5 shadow-[0_22px_50px_rgba(64,44,8,0.06)] sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">{group.eyebrow}</p>
                  <h3 className="font-display mt-2 text-[1.95rem] font-semibold leading-tight text-[#1b3b2b]">{group.title}</h3>
                </div>
                <div className="inline-flex items-center rounded-full border border-[rgba(27,59,43,0.1)] bg-[#f6efe4] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#1b3b2b]">
                  Verified from 2025 profile
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.members.map((member) => (
                  <ProfileCard key={`${group.title}-${member.initials}`} member={member} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-14 sm:mt-16">
        <SectionHeading eyebrow="Why It Matters" title="Simple reasons this mission helps the future" bodyClassName="max-w-2xl">
          This mission is not only about honey. The profile shows a larger story of pollination, training, livelihoods, biodiversity, and practical rural development support.
        </SectionHeading>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {impactPoints.map(({ title, text, icon: Icon }) => (
            <div key={title} className="paper-panel rounded-[1.8rem] p-5 sm:p-6">
              <Icon className="h-7 w-7 text-[#b36b00]" aria-hidden="true" />
              <h3 className="font-display mt-4 text-[1.65rem] font-semibold leading-tight text-[#1b3b2b]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#516253]">{text}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

function PartnerVisual({ visual }: { visual: (typeof partners)[number]["visual"] }) {
  if (visual === "association") {
    return (
      <div className="flex h-18 w-18 items-center justify-center rounded-[1.5rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] shadow-[0_10px_24px_rgba(64,44,8,0.08)]">
        <Image src="/scientific-beekeeping-icon.png" alt="Bee Keepers Association logo" width={72} height={72} className="h-12 w-12 object-contain" />
      </div>
    );
  }

  if (visual === "nirdpr") {
    return (
      <div className="flex h-18 w-18 items-center justify-center overflow-hidden rounded-[1.5rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-1.5 shadow-[0_10px_24px_rgba(64,44,8,0.08)]">
        <Image src="/nirdpr-logo.jpeg" alt="NIRDPR logo" width={330} height={99} className="h-full w-full rounded-[0.9rem] object-contain" />
      </div>
    );
  }

  return (
    <div className="flex h-18 w-18 items-center justify-center overflow-hidden rounded-[1.5rem] border border-[rgba(27,59,43,0.08)] bg-[#fff7e5] p-2 shadow-[0_10px_24px_rgba(64,44,8,0.08)]">
      <Image src="/kavuri-extract-3.png" alt="Kavuri bee mark" width={137} height={113} className="h-full w-full object-contain" />
    </div>
  );
}

function ProfileCard({
  member,
}: {
  member: (typeof peopleSections)[number]["members"][number];
}) {
  return (
    <article className="flex h-full flex-col rounded-[1.7rem] border border-[rgba(27,59,43,0.1)] bg-[#f8f4ea] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-[1.6rem] bg-[linear-gradient(135deg,#173f33,#295646)] text-xl font-black uppercase text-[#fff8ea] shadow-[0_12px_28px_rgba(23,63,51,0.14)]">
          {member.initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b36b00]">Profile</p>
          <h4 className="font-display mt-2 text-[1.55rem] font-semibold leading-tight text-[#1b3b2b]">{member.name}</h4>
          <p className="mt-2 text-sm leading-6 font-semibold text-[#607366]">{member.designation}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#516253]">{member.role}</p>
      <div className="mt-4 flex flex-wrap gap-2 pt-1">
        {member.highlights.map((highlight) => (
          <span key={`${member.initials}-${highlight}`} className="rounded-full border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-3 py-1.5 text-xs font-semibold text-[#1b3b2b]">
            {highlight}
          </span>
        ))}
      </div>
    </article>
  );
}
