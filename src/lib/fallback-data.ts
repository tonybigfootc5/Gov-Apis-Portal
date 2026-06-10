export const institute = {
  name: "API CULTURE",
  legalName: "API Culture Technology Center (Bee Keeping)",
  parent:
    "National Institute of Rural Development & Panchayati Raj, Ministry of Rural Development, Government of India",
  address:
    "#12 & 13, CIAT-RTP, Rajendranagar, Hyderabad - 500 030, Telangana, India",
  phone: ["040-24017766", "9395507766"],
  email: "apiculturetechcenter@gmail.com",
  website: "https://www.apiculture.in",
};

export const fallbackPrograms = [
  {
    id: "program-foundation",
    title: "Beekeeping",
    slug: "scientific-beekeeping-foundation",
    summary:
      "Practical training covering colony biology, hive handling, safety, seasonal care, and honey hygiene.",
    description:
      "A field-led foundation program for farmers, self-help groups, youth entrepreneurs, and institutional trainees. Participants learn bee biology, apiary layout, hive inspection, protective practices, harvesting hygiene, and responsible colony care.",
    duration: "5 days",
    level: "FOUNDATION",
    fee: "As notified by the center",
    capacity: 30,
    batchStartsAt: new Date("2026-07-15T09:00:00.000Z"),
    enrollmentClosed: false,
    popupEnabled: true,
    published: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "program-queen",
    title: "Queen Rearing & Colony Multiplication",
    slug: "queen-rearing-and-colony-multiplication",
    summary:
      "Advanced instruction on selection, grafting, nucleus colonies, and sustainable apiary expansion.",
    description:
      "Designed for trained beekeepers and extension teams, this module focuses on genetic selection, grafting discipline, mating yard preparation, nucleus management, and record-led colony multiplication.",
    duration: "7 days",
    level: "ADVANCED",
    fee: "As notified by the center",
    capacity: 20,
    batchStartsAt: new Date("2026-08-05T09:00:00.000Z"),
    enrollmentClosed: false,
    popupEnabled: true,
    published: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

export const fallbackEvents = [
  {
    id: "event-orientation",
    title: "Apiculture Technology Orientation",
    slug: "apiculture-technology-orientation",
    summary:
      "Open orientation on modern beekeeping, honey value chains, and rural enterprise opportunities.",
    description:
      "A public orientation for prospective trainees, farmer groups, and partner institutions. Sessions include center briefing, equipment demonstrations, and guidance on training enrollment.",
    location: "API CULTURE Technology Center, Rajendranagar, Hyderabad",
    startsAt: new Date("2026-06-12T10:00:00.000Z"),
    endsAt: new Date("2026-06-12T13:00:00.000Z"),
    status: "UPCOMING",
    published: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

export const fallbackArticles = [
  {
    id: "article-queen-strength",
    title: "Managing Bee Colonies in High Temperature Without Losing Strength",
    slug: "managing-bee-colonies-in-high-temperature-without-losing-strength",
    excerpt: "A practical field note on summer hive care, airflow, shade, and hydration management for colony stability.",
    body:
      "High temperature can place major pressure on colonies when airflow, shade, and water access are not managed in time. This article outlines simple steps for reducing heat stress, keeping brood areas stable, protecting worker activity, and avoiding unnecessary colony weakening during peak seasonal stress.\n\nThe guidance is written for field teams, trainees, and rural beekeepers who need direct, practical actions rather than theory-heavy instructions.",
    category: "Field management",
    publishedAt: new Date("2026-06-14T10:00:00.000Z"),
    authorName: "API CULTURE Editorial Desk",
    authorRole: "Training and Field Team",
    mediaUrl: "/field-beekeeping.jpg",
    mediaObjectKey: "fallback/articles/field-beekeeping.jpg",
    mediaType: "IMAGE",
    externalLink: "",
    keyPoints: "Shade near apiary\nWater source nearby\nReduce comb overheating",
    seoTitle: "Managing Bee Colonies in High Temperature",
    metaDescription: "Practical field methods for keeping bee colonies stable during high summer temperatures.",
    published: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "article-honey-production",
    title: "How To Select a Bee Honey Production During Monsoon Season in Beekeeping",
    slug: "how-to-select-a-bee-honey-production-during-monsoon-season-in-beekeeping",
    excerpt: "Monsoon conditions change forage, moisture, and disease pressure, so honey production decisions must stay seasonal.",
    body:
      "Monsoon season requires more careful honey production planning because forage conditions, hive moisture, and colony strength may shift quickly. This article helps trainees understand when to hold back, when to inspect, and how to judge whether conditions are suitable for honey-focused management.\n\nThe note is meant for application in training discussions, field visits, and extension support.",
    category: "Seasonal guidance",
    publishedAt: new Date("2026-06-18T09:30:00.000Z"),
    authorName: "API CULTURE Training Wing",
    authorRole: "Seasonal Practice Unit",
    mediaUrl: "/scientific-foundation-bg.jpg",
    mediaObjectKey: "fallback/articles/scientific-foundation-bg.jpg",
    mediaType: "IMAGE",
    externalLink: "",
    keyPoints: "Check forage availability\nWatch humidity levels\nPrevent fungal pressure",
    seoTitle: "Monsoon Season Honey Production in Beekeeping",
    metaDescription: "Seasonal considerations for planning honey production during monsoon conditions.",
    published: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "article-pollination",
    title: "Poor Pollination in Crop Fields: How Better Bee Placement Can Improve Results",
    slug: "poor-pollination-in-crop-fields-how-better-bee-placement-can-improve-results",
    excerpt: "Placement strategy matters. Small shifts in colony position can improve pollination effectiveness across crop fields.",
    body:
      "When pollination results remain weak, the issue is not always colony count alone. Field placement, distance from bloom concentration, shade, access routes, and crop timing all influence how well bees support pollination activity.\n\nThis article provides a field-oriented explanation that can be used in training sessions and institutional advisory work.",
    category: "Pollination support",
    publishedAt: new Date("2026-06-22T08:45:00.000Z"),
    authorName: "API CULTURE Extension Team",
    authorRole: "Crop Interface Support",
    mediaUrl: "/hero-background-original.mp4",
    mediaObjectKey: "fallback/articles/hero-background-original.mp4",
    mediaType: "VIDEO",
    externalLink: "",
    keyPoints: "Place near bloom density\nAvoid blocked flight paths\nReview field spread",
    seoTitle: "Better Bee Placement for Crop Pollination",
    metaDescription: "Why bee placement strategy can improve pollination performance across crop fields.",
    published: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];
