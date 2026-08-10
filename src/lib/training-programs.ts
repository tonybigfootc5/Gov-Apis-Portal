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
  batchStartsAt: string | null;
  registrationStartsAt?: string | null;
  registrationEndsAt?: string | null;
  scheduledPostAt?: string | null;
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

export const deprecatedTrainingProgramSlugs = new Set(["royal-jelly-production"]);

export const trainingProgramCatalog: TrainingProgramCatalogItem[] = [
  {
    id: "program-beekeeping",
    title: "Scientific Beekeeping",
    slug: "scientific-beekeeping-foundation",
    summary:
      "A 5-day Scientific Beekeeping Training Programme conducted at ATC's Training Hall, Rajendranagar, Hyderabad.",
    description:
      "The Api Culture Technology Center conducts this 5-day programme at ATC's Training Hall, Rajendranagar, Hyderabad. The programme combines classroom instruction, demonstrations, and individual hands-on practice around Pest control & disease and beekeeping as a livelihood or enterprise.",
    duration: "5 days",
    level: "FOUNDATION",
    fee: "INR 5,000",
    capacity: 30,
    batchStartsAt: "2026-08-17T10:00:00.000Z",
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
      "Understand Pest control & disease, bee species, castes, and colony structure.",
      "Handle bee hive production, hives, and equipment safely while establishing and managing an apiary.",
      "Improve colonies through proper feeding and seasonal management.",
      "Understand pollination, its agricultural benefits, and the value of other beehive products.",
      "Extract, process, and package honey hygienically.",
      "Understand costs, government schemes, registrations, marketing, and enterprise development.",
    ],
    skills: ["Bee species", "Colony structure", "Safe hive handling", "Apiary management", "Honey extraction", "Marketing"],
    rating: "4.9",
    ratingLabel: "Program reviews",
    experienceLabel: "Beginner friendly",
    tools: ["Bee veil", "Hive tool", "Smoker", "Bee boxes", "Honey extractor"],
    certificate: "Physical certificate issued after completion",
    taughtIn: "EN, తె, हिं",
    testimonial: {
      quote: "The hands-on hive practice made it easier to understand how to start and manage an apiary.",
      name: "Foundation trainee",
    },
  },
  {
    id: "program-honey-processing",
    title: "Honey Processing and Packing",
    slug: "honey-processing",
    summary:
      "Specialized processing module focused on honey filtration, hygiene, quality control, and bottling workflow.",
    description:
      "Participants learn how harvested honey moves through filtering, settling, hygienic handling, moisture awareness, quality checks, and packaging readiness. The emphasis is on practical post-harvest discipline and market-facing processing standards.",
    duration: "2 days",
    level: "PROFESSIONAL",
    fee: "INR 2,600",
    capacity: 15,
    batchStartsAt: null,
    enrollmentClosed: true,
    popupEnabled: true,
    published: true,
    focusLabel: "Specialized processing",
    focusText: "Honey filtration, hygiene standards, quality control, and bottling machinery workflow.",
    targetAudience: "Existing beekeepers, producer groups, honey units, and value-addition trainees.",
    detailBadge: "Processing module",
    imageSrc: "/honey-processing-program-updated.png",
    imageAlt: "Honey filtering and packing workflow arranged for practical training.",
    highlights: ["Filtering", "Hygiene", "Bottling"],
    outcomes: [
      "Follow the practical flow from filtering to packaged honey readiness.",
      "Apply hygiene and handling standards during post-harvest honey work.",
      "Understand the basics of moisture awareness, quality checks, and settling.",
      "Prepare honey for bottling and simple value-addition workflows.",
    ],
    skills: ["Filtration", "Quality control", "Bottling", "Packaging"],
    rating: "4.8",
    ratingLabel: "Program reviews",
    experienceLabel: "Beginner to practitioner",
    tools: ["Filter unit", "Settling tank", "Bottling tools", "Labeling tools", "Packing materials"],
    certificate: "Physical certificate issued after completion",
    taughtIn: "EN, తె, हिं",
    testimonial: {
      quote: "The processing workflow made hygiene, filtration, and market-ready packing clear.",
      name: "Honey unit trainee",
    },
  },
  {
    id: "program-queen-wax",
    title: "Queen Bee Breeding & Royal Jelly Harvesting",
    slug: "queen-rearing-and-colony-multiplication",
    summary:
      "Advanced training that combines queen bee breeding, colony multiplication, and royal jelly harvesting practice in one 10-day module.",
    description:
      "This longer module is built for participants who already understand practical hive work. It covers queen cell handling, grafting practice, colony splitting, nucleus colony management, mating yard preparation, repeated royal jelly collection practice, royal jelly processing, pre- and post-harvesting packing, cold handling, records, and business management.",
    duration: "10 days",
    level: "ADVANCED",
    fee: "INR 1",
    capacity: 10,
    batchStartsAt: null,
    enrollmentClosed: true,
    popupEnabled: true,
    published: true,
    focusLabel: "Advanced training",
    focusText: "Queen bee breeding, colony multiplication, royal jelly harvesting, and business management.",
    targetAudience: "Experienced trainees, extension staff, progressive beekeepers, and trainers.",
    detailBadge: "Queen breeding and royal jelly",
    imageSrc: "/queen-rearing-program-updated.png",
    imageAlt: "A marked queen bee surrounded by worker bees during queen rearing.",
    highlights: ["Queen cells", "Royal jelly", "Nucleus colonies"],
    outcomes: [
      "Understand the practical steps involved in colony multiplication planning.",
      "Handle queen cell work and basic queen bee breeding support tasks.",
      "Practice repeated royal jelly collection, processing, hygienic transfer, and packing discipline.",
      "Manage nucleus colonies and mating yard preparation with field-ready discipline.",
      "Connect colony multiplication records with apiary productivity, business management, and expansion.",
    ],
    skills: ["Queen bee breeding", "Colony multiplication", "Royal jelly harvesting", "Royal jelly processing", "Packing", "Business management"],
    rating: "4.8",
    ratingLabel: "Program reviews",
    experienceLabel: "Prior hive experience preferred",
    tools: ["Grafting frame", "Queen cups", "Collection spoon", "Sterile containers", "Nucleus box", "Mating yard records", "Record sheets"],
    certificate: "Physical certificate issued after completion",
    taughtIn: "EN, తె, हिं",
    testimonial: {
      quote: "The queen breeding and royal jelly harvesting sessions connected field practice with real expansion planning.",
      name: "Advanced trainee",
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
    alt: "Scientific beekeeping training visual showing close supervision and learner participation.",
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
