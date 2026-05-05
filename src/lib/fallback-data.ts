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
    title: "Scientific Beekeeping Foundation",
    slug: "scientific-beekeeping-foundation",
    summary:
      "Practical training covering colony biology, hive handling, safety, seasonal care, and honey hygiene.",
    description:
      "A field-led foundation program for farmers, self-help groups, youth entrepreneurs, and institutional trainees. Participants learn bee biology, apiary layout, hive inspection, protective practices, harvesting hygiene, and responsible colony care.",
    duration: "5 days",
    level: "FOUNDATION",
    fee: "As notified by the center",
    capacity: 30,
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
