export type TechnologyItem = {
  title: string;
  slug: string;
  category: string;
  description: string;
  practicalFocus: string[];
  outcomes: string[];
  imageSrc: string;
  imageAlt: string;
};

export const technologyItems: TechnologyItem[] = [
  {
    title: "Beekeeping",
    slug: "beekeeping",
    category: "Apiary foundation",
    description:
      "Core beekeeping covers colony setup, seasonal hive management, inspection routines, bee behavior, feeding support, swarm control, and field-safe handling practices.",
    practicalFocus: [
      "Hive placement, colony strength, and inspection planning",
      "Protective handling, smoker use, and routine colony checks",
      "Seasonal management for brood, food stores, and queen performance",
    ],
    outcomes: [
      "Build confidence in practical apiary work",
      "Improve colony care and field observation skills",
    ],
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Beekeeper_with_moveable_comb_hive.jpg",
    imageAlt: "Beekeeper holding a hive frame",
  },
  {
    title: "Honey processing and packing",
    slug: "honey-processing-and-packing",
    category: "Value addition",
    description:
      "This technology covers hygienic extraction, filtering, moisture-aware handling, settling, storage, and final packing methods for market-ready honey.",
    practicalFocus: [
      "Uncapping, extraction, filtration, and clean handling",
      "Moisture, storage, and contamination-control basics",
      "Bottle filling, sealing, labeling, and presentation",
    ],
    outcomes: [
      "Understand the path from comb to packed honey",
      "Support cleaner product handling and better shelf presentation",
    ],
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Honey_extracting.jpg/960px-Honey_extracting.jpg",
    imageAlt: "Honey extraction from capped honeycomb",
  },
  {
    title: "Royal Jelly Collection",
    slug: "royal-jelly-collection",
    category: "Specialized bee products",
    description:
      "Royal jelly collection is linked to queen-rearing style management where queen cells are prepared, grafted, monitored, and harvested at the correct stage.",
    practicalFocus: [
      "Preparation of cell cups and larval transfer basics",
      "Timing of collection from queen cells",
      "Clean collection and immediate handling care",
    ],
    outcomes: [
      "Understand how royal jelly is obtained practically",
      "Recognize the timing and care needed for quality collection",
    ],
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Queen_rearing.JPG/960px-Queen_rearing.JPG",
    imageAlt: "Queen rearing setup used in bee culture",
  },
  {
    title: "Royal Jelly processing and packing",
    slug: "royal-jelly-processing-and-packing",
    category: "Specialized bee products",
    description:
      "This area focuses on post-collection handling, hygienic transfer, storage sensitivity, and packing discipline for royal jelly after harvesting.",
    practicalFocus: [
      "Immediate transfer after collection",
      "Handling discipline for delicate bee products",
      "Packing and storage awareness for quality retention",
    ],
    outcomes: [
      "Gain awareness of quality-sensitive processing steps",
      "Prepare royal jelly for cleaner storage and packaging workflows",
    ],
    imageSrc: "/queen-rearing-bg.jpg",
    imageAlt: "Beekeeping training visual related to queen and colony work",
  },
  {
    title: "Bee Pollen Collection",
    slug: "bee-pollen-collection",
    category: "Specialized bee products",
    description:
      "Bee pollen collection introduces pollen trapping, handling, drying awareness, and care in maintaining colony balance while collecting product.",
    practicalFocus: [
      "Use of pollen traps and collection timing",
      "Clean separation and handling after collection",
      "Balancing product collection with colony needs",
    ],
    outcomes: [
      "Understand how pollen is harvested without careless loss",
      "Connect collection practice with product quality",
    ],
    imageSrc: "/field-beekeeping.jpg",
    imageAlt: "Field beekeeping session near an apiary",
  },
  {
    title: "Bee Pollen processing and packing",
    slug: "bee-pollen-processing-and-packing",
    category: "Value addition",
    description:
      "Processing and packing of bee pollen covers cleaning, moisture reduction awareness, storage, and market-ready packaging for product stability.",
    practicalFocus: [
      "Post-collection cleaning and drying awareness",
      "Handling for product cleanliness and storage suitability",
      "Packing options for value-added presentation",
    ],
    outcomes: [
      "Improve understanding of pollen value addition",
      "Support better shelf-readiness and handling practice",
    ],
    imageSrc: "/scientific-foundation-bg.jpg",
    imageAlt: "Scientific beekeeping visual",
  },
  {
    title: "Queen Rearing",
    slug: "queen-rearing",
    category: "Colony improvement",
    description:
      "Queen rearing focuses on grafting, queen cell development, mating support, colony selection, and improving replacement planning for stronger colonies.",
    practicalFocus: [
      "Larval selection and grafting workflow",
      "Queen cell development and nursery management",
      "Mating and replacement planning for colonies",
    ],
    outcomes: [
      "Build practical understanding of queen production methods",
      "Strengthen colony management decisions through better queen planning",
    ],
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Queen_rearing.JPG/960px-Queen_rearing.JPG",
    imageAlt: "Queen rearing cages and artificial queen cups",
  },
  {
    title: "Wax processing",
    slug: "wax-processing",
    category: "Value addition",
    description:
      "Wax processing covers wax recovery, cleaning, melting, filtering, moulding or sheet preparation, and practical use of beeswax in beekeeping workflows.",
    practicalFocus: [
      "Recovery and melting of beeswax materials",
      "Basic cleaning and filtering methods",
      "Preparation for reuse, moulding, or foundation-related work",
    ],
    outcomes: [
      "Understand beeswax recovery and reuse potential",
      "Link hive products with additional value-added opportunities",
    ],
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Mittelwand_17a.jpg/960px-Mittelwand_17a.jpg",
    imageAlt: "Beeswax foundation frame for honeycomb",
  },
  {
    title: "Venom Collection",
    slug: "venom-collection",
    category: "Specialized bee products",
    description:
      "Venom collection introduces controlled collection systems, safety discipline, equipment awareness, and careful handling practices due to the specialized nature of the product.",
    practicalFocus: [
      "Overview of controlled venom collection methods",
      "Safety and handling precautions",
      "Equipment awareness and product-sensitive handling",
    ],
    outcomes: [
      "Gain a practical introduction to a specialized bee product stream",
      "Recognize the importance of safety and controlled collection",
    ],
    imageSrc: "/field-beekeeping.jpg",
    imageAlt: "Beekeeper working with hive equipment in the field",
  },
  {
    title: "Propolis Collection",
    slug: "propolis-collection",
    category: "Specialized bee products",
    description:
      "Propolis collection covers the use of collection surfaces or traps, removal methods, cleaning, and the basic handling needed for this resinous hive product.",
    practicalFocus: [
      "Collection methods for hive resin materials",
      "Cleaning and separation basics",
      "Storage and value-addition awareness",
    ],
    outcomes: [
      "Understand how propolis can be collected and handled",
      "See its role in diversified hive-product training",
    ],
    imageSrc: "/scientific-foundation-bg.jpg",
    imageAlt: "Bee and hive-related scientific training visual",
  },
  {
    title: "Bee Hives and Equipment Manufacturing",
    slug: "bee-hives-and-equipment-manufacturing",
    category: "Infrastructure and fabrication",
    description:
      "This technology addresses hive components, equipment dimensions, assembly awareness, and practical manufacturing considerations that support colony management and harvesting work.",
    practicalFocus: [
      "Hive boxes, frames, and component familiarity",
      "Protective gear and handling tools",
      "Equipment readiness for apiary and product work",
    ],
    outcomes: [
      "Understand the equipment ecosystem behind apiary operations",
      "Connect fabrication quality with day-to-day beekeeping efficiency",
    ],
    imageSrc: "/honey-house-signboard.jpg",
    imageAlt: "API CULTURE center and institutional beekeeping context",
  },
];
