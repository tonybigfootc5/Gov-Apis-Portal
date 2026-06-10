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

function createStudentPhotoDataUri(initials: string, bg: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
      <rect width="640" height="640" rx="48" fill="${bg}" />
      <circle cx="320" cy="240" r="110" fill="#fff7ea" opacity="0.92" />
      <path d="M170 520c26-94 95-142 150-142s124 48 150 142" fill="#fff7ea" opacity="0.92" />
      <text x="320" y="590" text-anchor="middle" font-size="72" font-family="Georgia, serif" fill="#173f33" font-weight="700">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const previewStudents = [
  ["K. Maheshwari", "K. Narsimha", "female", "B.Sc Agriculture", "Student"],
  ["R. Srinivas", "R. Laxman", "male", "Diploma", "Farmer"],
  ["A. Padmavathi", "A. Mallaiah", "female", "Intermediate", "Trainee"],
  ["M. Harish", "M. Rajaiah", "male", "B.Com", "Entrepreneur"],
  ["S. Keerthana", "S. Ramesh", "female", "Degree", "Student"],
  ["P. Venkatesh", "P. Krishna", "male", "ITI", "Worker"],
  ["G. Revathi", "G. Anjaneyulu", "female", "B.Sc", "Student"],
  ["T. Naveen", "T. Satyam", "male", "Intermediate", "Farmer"],
  ["Y. Soujanya", "Y. Narender", "female", "MBA", "Coordinator"],
  ["D. Suresh", "D. Lingaiah", "male", "Degree", "Farmer"],
  ["B. Lavanya", "B. Balaraju", "female", "B.Tech", "Student"],
  ["C. Mahender", "C. Gopal", "male", "Diploma", "Field assistant"],
  ["N. Bhavani", "N. Yadagiri", "female", "Intermediate", "Student"],
  ["V. Karthik", "V. Janardhan", "male", "B.Sc", "Farmer"],
  ["J. Aruna", "J. Prabhakar", "female", "Degree", "Self-help group member"],
  ["L. Rakesh", "L. Malla Reddy", "male", "BBA", "Entrepreneur"],
  ["H. Deepika", "H. Narasimulu", "female", "M.Sc", "Trainer"],
  ["E. Rajesh", "E. Ashok", "male", "Intermediate", "Student"],
  ["U. Meghana", "U. Sathish", "female", "B.Pharmacy", "Student"],
  ["Q. Pradeep", "Q. Venkanna", "male", "Degree", "Farmer"],
  ["K. Tejaswini", "K. Tirupathi", "female", "B.Sc Zoology", "Student"],
  ["R. Bhargav", "R. Sadanandam", "male", "MBA", "Business owner"],
  ["A. Niharika", "A. Devender", "female", "Intermediate", "Trainee"],
  ["M. Yashwanth", "M. Narayana", "male", "B.Tech", "Student"],
  ["S. Haripriya", "S. Srinivasulu", "female", "Degree", "Coordinator"],
  ["P. Chandu", "P. Nagesh", "male", "ITI", "Mechanic"],
  ["G. Sirisha", "G. Yellaiah", "female", "B.A.", "Student"],
  ["T. Kiran", "T. Veeraiah", "male", "Intermediate", "Farmer"],
  ["Y. Divya", "Y. Shankar", "female", "B.Com", "Student"],
  ["D. Naresh", "D. Bikshapathi", "male", "Degree", "Field assistant"],
] as const;

const previewBatches = [
  {
    code: "BK-26-07",
    serviceName: "Beekeeping",
    district: "Hyderabad",
    mandal: "Rajendranagar",
    pinCode: "500030",
    baseDate: new Date("2026-06-03T08:15:00.000Z"),
    color: "#d89a11",
  },
  {
    code: "QR-26-08",
    serviceName: "Queen Rearing & Colony Multiplication",
    district: "Ranga Reddy",
    mandal: "Shamshabad",
    pinCode: "501218",
    baseDate: new Date("2026-06-08T11:20:00.000Z"),
    color: "#7a5a00",
  },
  {
    code: "BK-26-09",
    serviceName: "Beekeeping",
    district: "Ranga Reddy",
    mandal: "Maheshwaram",
    pinCode: "501359",
    baseDate: new Date("2026-06-10T07:55:00.000Z"),
    color: "#21533f",
  },
] as const;

export const fallbackApplications = previewStudents.map((student, index) => {
  const [candidateName, guardianName, gender, educationQualification, occupation] = student;
  const batch = previewBatches[Math.floor(index / 10)];
  const batchIndex = index % 10;
  const sequence = String(index + 1).padStart(2, "0");
  const initials = candidateName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const attemptedAt = new Date(batch.baseDate.getTime() + batchIndex * 86_400_000);
  const submittedAt = new Date(attemptedAt.getTime() + 25 * 60 * 1000);
  const isApproved = batchIndex < 4;
  const isPaymentPending = batchIndex >= 4 && batchIndex < 7;
  const paymentStatus = isApproved ? "PAID" : isPaymentPending ? "PENDING" : "NOT_STARTED";
  const approvalStatus = isApproved ? "APPROVED" : batchIndex === 9 ? "REJECTED" : "PENDING";
  const crossCheckStatus = batchIndex < 7 ? "VERIFIED" : "PENDING";
  const attemptStatus =
    paymentStatus === "PAID"
      ? "PAYMENT_COMPLETED"
      : paymentStatus === "PENDING"
        ? "PAYMENT_INITIATED"
        : batchIndex > 7
          ? "ATTEMPTED"
          : "SUBMITTED";
  const approvedAt = isApproved ? new Date(submittedAt.getTime() + 2 * 86_400_000).toISOString() : null;
  const phone = `93${String(95500000 + index * 137).slice(-8)}`;
  const emailSlug = candidateName.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.+|\.+$/g, "");

  return {
    id: `app-preview-${sequence}`,
    createdAt: attemptedAt.toISOString(),
    updatedAt: (approvedAt ? new Date(approvedAt) : submittedAt).toISOString(),
    name: candidateName,
    email: `${emailSlug}.preview@apiculture.in`,
    phone,
    payload: {
      version: 2 as const,
      serviceName: batch.serviceName,
      applicationDate: attemptedAt.toISOString().slice(0, 10),
      candidateName,
      guardianName,
      email: `${emailSlug}.preview@apiculture.in`,
      gender: gender as "male" | "female",
      dateOfBirth: `20${String(1 + (index % 5)).padStart(2, "0")}-${String(1 + (index % 12)).padStart(2, "0")}-${String(10 + (index % 18)).padStart(2, "0")}`,
      addressLine: `H.No. ${4 + batchIndex}-${80 + batchIndex}, Preview Street`,
      mandal: batch.mandal,
      district: batch.district,
      state: "Telangana",
      pinCode: batch.pinCode,
      phone,
      residencePhone: batchIndex % 3 === 0 ? "04024017766" : "",
      educationQualification,
      occupation,
      sponsoringOrganization: batchIndex % 2 === 0 ? "Women SHG Cluster" : "Rural Youth Club",
      photoName: `${emailSlug}-photo.png`,
      photoType: "image/png",
      photoDataUrl: createStudentPhotoDataUri(initials, batch.color),
      attemptStatus: attemptStatus as "ATTEMPTED" | "SUBMITTED" | "PAYMENT_INITIATED" | "PAYMENT_FAILED" | "PAYMENT_COMPLETED",
      paymentStatus: paymentStatus as "NOT_STARTED" | "PENDING" | "PAID" | "FAILED",
      approvalStatus: approvalStatus as "PENDING" | "APPROVED" | "REJECTED",
      crossCheckStatus: crossCheckStatus as "PENDING" | "VERIFIED",
      attemptedAt: attemptedAt.toISOString(),
      submittedAt: submittedAt.toISOString(),
      approvedAt,
      approvedBy: isApproved ? "Preview Admin" : null,
      adminNotes: `Preview student assigned to Batch ${batch.code}.`,
      paymentReference: paymentStatus === "PAID" ? `UPI-${batch.code.replaceAll("-", "")}-${sequence}` : paymentStatus === "PENDING" ? `BANK-${batch.code.replaceAll("-", "")}-${sequence}` : "",
    },
  };
});
