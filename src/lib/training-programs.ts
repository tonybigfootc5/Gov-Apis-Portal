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
  instructorName: string;
  rating: string;
  ratingLabel: string;
  experienceLabel: string;
  tools: string[];
  certificate: string;
  taughtIn: string;
  testimonial: {
    quote: string;
    name: string;
  };
};

export const trainingProgramCatalog: TrainingProgramCatalogItem[] = [
  {
    id: "program-beekeeping",
    title: "Beekeeping",
    slug: "scientific-beekeeping-foundation",
    summary:
      "A 5-day Scientific Beekeeping Training Programme at the Rural Technology Park, NIRDPR, Rajendranagar, Hyderabad.",
    description:
      "The Api Culture Technology Center conducts this 5-day programme at the Rural Technology Park, NIRDPR, Rajendranagar, Hyderabad. The programme combines classroom instruction, demonstrations, and individual hands-on practice around scientific beekeeping methods and beekeeping as a livelihood or enterprise.",
    duration: "5 days",
    level: "FOUNDATION",
    fee: "INR 5,000",
    capacity: 30,
    batchStartsAt: "2026-07-15T09:00:00.000Z",
    enrollmentClosed: false,
    popupEnabled: true,
    published: true,
    focusLabel: "Scientific beekeeping",
    focusText: "Classroom instruction, demonstrations, and individual hands-on practice for apiary readiness.",
    targetAudience:
      "Farmers, rural youth, women, tribal communities, landless individuals, existing beekeepers, aspiring beekeeping entrepreneurs, agriculture and horticulture workers, and anyone interested in starting an apiary.",
    detailBadge: "Scientific Beekeeping Training",
    imageSrc: "/beekeeping-program-updated.png",
    imageAlt: "A beekeeper inspecting a honey bee frame in a sunlit apiary.",
    highlights: ["Scientific methods", "Hands-on practice", "Apiary enterprise"],
    outcomes: [
      "Understand scientific beekeeping methods, bee species, castes, and colony structure.",
      "Handle bees, hives, and equipment safely while establishing and managing an apiary.",
      "Improve colonies through proper feeding and seasonal management.",
      "Understand pollination, its agricultural benefits, and the value of other beehive products.",
      "Extract, process, and package honey hygienically.",
      "Understand costs, government schemes, registrations, marketing, and enterprise development.",
    ],
    skills: ["Bee species", "Colony structure", "Safe hive handling", "Apiary management", "Honey hygiene", "Marketing"],
    instructorName: "Api Culture Training Faculty",
    rating: "4.9",
    ratingLabel: "Program reviews",
    experienceLabel: "Beginner friendly",
    tools: ["Bee veil", "Hive tool", "Smoker", "Bee boxes", "Honey extractor"],
    certificate: "Physical certificate issued after completion",
    taughtIn: "English and Telugu",
    testimonial: {
      quote: "The hands-on hive practice made it easier to understand how to start and manage an apiary.",
      name: "Foundation trainee",
    },
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
    imageSrc: "/honey-processing-training-program.png",
    imageAlt: "Honey frames arranged inside a stainless steel honey extractor.",
    highlights: ["Filtering", "Hygiene", "Bottling"],
    outcomes: [
      "Follow the practical flow from uncapping to extraction and filtration.",
      "Apply hygiene and handling standards during post-harvest honey work.",
      "Understand the basics of moisture awareness, quality checks, and settling.",
      "Prepare honey for bottling and simple value-addition workflows.",
    ],
    skills: ["Extraction", "Filtration", "Quality control", "Packaging"],
    instructorName: "Honey Processing Faculty",
    rating: "4.8",
    ratingLabel: "Program reviews",
    experienceLabel: "Beginner to practitioner",
    tools: ["Uncapping knife", "Extractor", "Filter unit", "Settling tank", "Bottling tools"],
    certificate: "Physical certificate issued after completion",
    taughtIn: "English and Telugu",
    testimonial: {
      quote: "The processing workflow made hygiene, filtration, and market-ready packing clear.",
      name: "Honey unit trainee",
    },
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
    imageSrc: "/queen-rearing-colony-multiplication.png",
    imageAlt: "A marked queen bee surrounded by worker bees during queen rearing.",
    highlights: ["Queen cells", "Colony split", "Wax recovery"],
    outcomes: [
      "Understand the practical steps involved in colony multiplication planning.",
      "Handle queen cell work and basic queen rearing support tasks.",
      "Recover and clean beeswax from hive operations for further use.",
      "Connect wax processing with broader apiary productivity and management.",
    ],
    skills: ["Queen rearing", "Colony multiplication", "Wax recovery", "Apiary planning"],
    instructorName: "Queen Rearing Faculty",
    rating: "4.8",
    ratingLabel: "Program reviews",
    experienceLabel: "Prior hive experience preferred",
    tools: ["Grafting frame", "Queen cups", "Nucleus box", "Wax melter", "Record sheets"],
    certificate: "Physical certificate issued after completion",
    taughtIn: "English and Telugu",
    testimonial: {
      quote: "The queen cell and colony multiplication sessions connected field practice with real expansion planning.",
      name: "Advanced trainee",
    },
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
    imageSrc: "/royal-jelly-production-training.png",
    imageAlt: "Royal jelly being collected from prepared queen cells with hygienic tools.",
    highlights: ["Queen cell prep", "Collection timing", "Cold handling"],
    outcomes: [
      "Understand how queen cells are prepared for royal jelly production work.",
      "Learn the collection timing required for higher-value jelly harvesting.",
      "Handle transfer and storage with better hygiene and temperature awareness.",
      "Connect royal jelly production with niche commercial beekeeping opportunities.",
    ],
    skills: ["Royal jelly collection", "Queen cell prep", "Hygienic transfer", "Cold handling"],
    instructorName: "Royal Jelly Production Faculty",
    rating: "4.9",
    ratingLabel: "Program reviews",
    experienceLabel: "Advanced beekeepers",
    tools: ["Queen cell bar", "Collection spoon", "Sterile containers", "Cold box", "Timing records"],
    certificate: "Physical certificate issued after completion",
    taughtIn: "English and Telugu",
    testimonial: {
      quote: "The course explained the timing and hygiene discipline needed for sensitive high-value bee products.",
      name: "Specialized trainee",
    },
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
    alt: "Trainees working near the apiary field setup.",
    label: "Live field session",
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
