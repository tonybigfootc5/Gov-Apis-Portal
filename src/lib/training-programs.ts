export type ProgramLevelValue = "FOUNDATION" | "ADVANCED" | "PROFESSIONAL";

export type TrainingProgramCatalogItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  duration: string;
  level: ProgramLevelValue;
  fee: string;
  capacity: number;
  batchStartsAt: string;
  enrollmentClosed: boolean;
  popupEnabled: boolean;
  published: boolean;
  focusLabel: string;
  focusText: string;
  targetAudience: string;
  detailBadge: string;
  imageSrc: string;
  imageAlt: string;
  highlights: string[];
  outcomes: string[];
  skills: string[];
};

export const trainingProgramCatalog: TrainingProgramCatalogItem[] = [
  {
    id: "program-beekeeping",
    title: "Bee Keeping",
    slug: "scientific-beekeeping-foundation",
    summary:
      "Foundation training that covers the basics of beekeeping, hive setup, inspection, and seasonal colony care.",
    description:
      "This beginner-friendly training introduces participants to bee behaviour, apiary layout, essential equipment, safe hive opening, colony inspection, feeding support, and seasonal maintenance practices. It is designed to build confidence before moving into specialized production work.",
    duration: "5 days",
    level: "FOUNDATION",
    fee: "INR 5,000",
    capacity: 30,
    batchStartsAt: "2026-07-15T09:00:00.000Z",
    enrollmentClosed: false,
    popupEnabled: true,
    published: true,
    focusLabel: "Foundation training",
    focusText: "Basics of beekeeping, hive setup, observation, inspection routine, and seasonal care.",
    targetAudience: "Beginners, farmers, rural youth, SHGs, and first-time trainees.",
    detailBadge: "Foundation batch",
    imageSrc: "/scientific-foundation-bg.jpg",
    imageAlt: "A beekeeper inspecting a honey bee frame during practical field training.",
    highlights: ["Hive setup", "Bee handling", "Seasonal care"],
    outcomes: [
      "Identify the basic structure of a bee colony and the role of each member.",
      "Set up a simple apiary space and prepare the hive for routine inspection.",
      "Perform safe opening, observation, and seasonal care for beginner-level colonies.",
      "Understand essential hygiene practices before honey harvesting starts.",
    ],
    skills: ["Hive inspection", "Colony basics", "Apiary setup", "Seasonal care"],
  },
  {
    id: "program-honey-processing",
    title: "Honey Processing",
    slug: "honey-processing",
    summary:
      "Specialized processing module focused on honey filtration, hygiene, quality control, and bottling workflow.",
    description:
      "Participants learn how harvested comb moves through uncapping, extraction, filtering, settling, hygienic handling, moisture awareness, quality checks, and packaging readiness. The emphasis is on practical post-harvest discipline and market-facing processing standards.",
    duration: "2 days",
    level: "PROFESSIONAL",
    fee: "INR 3,999",
    capacity: 24,
    batchStartsAt: "2026-07-29T09:00:00.000Z",
    enrollmentClosed: false,
    popupEnabled: true,
    published: true,
    focusLabel: "Specialized processing",
    focusText: "Honey filtration, hygiene standards, quality control, and bottling machinery workflow.",
    targetAudience: "Existing beekeepers, producer groups, honey units, and value-addition trainees.",
    detailBadge: "Processing module",
    imageSrc: "/honey-house-signboard.jpg",
    imageAlt: "Hands uncapping a honey frame during honey extraction and processing.",
    highlights: ["Filtering", "Hygiene", "Bottling"],
    outcomes: [
      "Follow the practical flow from uncapping to extraction and filtration.",
      "Apply hygiene and handling standards during post-harvest honey work.",
      "Understand the basics of moisture awareness, quality checks, and settling.",
      "Prepare honey for bottling and simple value-addition workflows.",
    ],
    skills: ["Extraction", "Filtration", "Quality control", "Packaging"],
  },
  {
    id: "program-queen-wax",
    title: "Queen Rearing & Wax Processing",
    slug: "queen-rearing-and-colony-multiplication",
    summary:
      "Advanced training that combines colony multiplication, queen rearing techniques, and beeswax extraction basics.",
    description:
      "This longer module is built for participants who already understand practical hive work. It covers queen cell handling, colony splitting, multiplication planning, breeder selection, wax recovery, beeswax cleaning, and product-oriented handling of wax after hive operations.",
    duration: "10 days",
    level: "ADVANCED",
    fee: "INR 7,999",
    capacity: 20,
    batchStartsAt: "2026-08-05T09:00:00.000Z",
    enrollmentClosed: false,
    popupEnabled: true,
    published: true,
    focusLabel: "Advanced training",
    focusText: "Queen rearing, colony multiplication, grafting basics, and practical beeswax processing.",
    targetAudience: "Experienced trainees, extension staff, progressive beekeepers, and trainers.",
    detailBadge: "Advanced queen and wax",
    imageSrc: "/queen-rearing-bg.jpg",
    imageAlt: "A beekeeper working on queen rearing in a practical training setting.",
    highlights: ["Queen cells", "Colony split", "Wax recovery"],
    outcomes: [
      "Understand the practical steps involved in colony multiplication planning.",
      "Handle queen cell work and basic queen rearing support tasks.",
      "Recover and clean beeswax from hive operations for further use.",
      "Connect wax processing with broader apiary productivity and management.",
    ],
    skills: ["Queen rearing", "Colony multiplication", "Wax recovery", "Apiary planning"],
  },
  {
    id: "program-royal-jelly",
    title: "Royal Jelly Production",
    slug: "royal-jelly-production",
    summary:
      "Specialized training focused on the collection, handling, and high-value production workflow of royal jelly.",
    description:
      "This program explains the practical cycle behind commercial royal jelly production, including queen cell preparation, timing of collection, hygienic transfer, cold-chain awareness, and handling methods required for a sensitive high-value bee product.",
    duration: "10 days",
    level: "PROFESSIONAL",
    fee: "INR 6,999",
    capacity: 18,
    batchStartsAt: "2026-08-21T09:00:00.000Z",
    enrollmentClosed: false,
    popupEnabled: true,
    published: true,
    focusLabel: "Specialized training",
    focusText: "High-value commercial harvesting and collection of royal jelly from prepared queen cells.",
    targetAudience: "Advanced beekeepers, entrepreneurs, product-focused units, and specialized trainees.",
    detailBadge: "High-value production",
    imageSrc: "/field-beekeeping.jpg",
    imageAlt: "Opened queen cells showing larvae in royal jelly during production training.",
    highlights: ["Queen cell prep", "Collection timing", "Cold handling"],
    outcomes: [
      "Understand how queen cells are prepared for royal jelly production work.",
      "Learn the collection timing required for higher-value jelly harvesting.",
      "Handle transfer and storage with better hygiene and temperature awareness.",
      "Connect royal jelly production with niche commercial beekeeping opportunities.",
    ],
    skills: ["Royal jelly collection", "Queen cell prep", "Hygienic transfer", "Cold handling"],
  },
];

export const trainingProgramCatalogBySlug = Object.fromEntries(
  trainingProgramCatalog.map((program) => [program.slug, program]),
) as Record<string, TrainingProgramCatalogItem>;

export const trainingProgramGallery = [
  {
    src: "/training-field-visuals/image1.jpeg",
    alt: "Field training participants gathered around a live beekeeping practice session.",
    label: "Field training",
  },
  {
    src: "/training-field-visuals/image2.jpeg",
    alt: "Hands-on hive observation during a practical beekeeping demonstration.",
    label: "Hive observation",
  },
  {
    src: "/training-field-visuals/image3.jpeg",
    alt: "Trainees receiving step-by-step guidance near the apiary field setup.",
    label: "Live guidance",
  },
  {
    src: "/training-field-visuals/image4.jpeg",
    alt: "Practical hive handling and supervised inspection in the field.",
    label: "Hive handling",
  },
  {
    src: "/training-field-visuals/image5.jpeg",
    alt: "Apiary learners engaging with colony management and frame inspection.",
    label: "Colony care",
  },
  {
    src: "/training-field-visuals/image6.jpeg",
    alt: "Beehive and beekeeper interaction captured during training practice.",
    label: "Apiary practice",
  },
  {
    src: "/training-field-visuals/image7.jpeg",
    alt: "Participants following a field-level beekeeping demonstration outdoors.",
    label: "Outdoor demo",
  },
  {
    src: "/training-field-visuals/image8.jpeg",
    alt: "Beekeeping training visual showing close supervision and learner participation.",
    label: "Learner support",
  },
  {
    src: "/training-field-visuals/image9.jpeg",
    alt: "Hands-on technical training focused on practical beekeeping workflow.",
    label: "Technical practice",
  },
  {
    src: "/training-field-visuals/image10.jpeg",
    alt: "Field visuals from the center's beekeeping training environment.",
    label: "Training environment",
  },
];
