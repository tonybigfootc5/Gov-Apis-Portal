export type ApplicationErrorCode =
  | "APP-VAL-001"
  | "APP-PHOTO-001"
  | "APP-RATE-001"
  | "APP-FEE-001"
  | "APP-DB-001"
  | "APP-PAY-001"
  | "APP-PAY-002"
  | "APP-NET-001"
  | "APP-UNKNOWN-001";

export type ApplicationErrorGuideItem = {
  code: ApplicationErrorCode;
  summary: string;
  adminMeaning: string;
};

export const applicationErrorGuide: ApplicationErrorGuideItem[] = [
  {
    code: "APP-VAL-001",
    summary: "Application form has missing or invalid applicant details.",
    adminMeaning: "Check the field named in the message; common causes are Aadhaar, mobile, PIN code, DOB, address, program, or photo data.",
  },
  {
    code: "APP-PHOTO-001",
    summary: "Applicant photo is missing or still being prepared.",
    adminMeaning: "Ask the applicant to upload a clear photo and wait until the upload/preparation status says ready.",
  },
  {
    code: "APP-RATE-001",
    summary: "Too many application submissions came from the same connection.",
    adminMeaning: "Ask the applicant to wait for the retry window, or help them submit from the center desk if legitimate.",
  },
  {
    code: "APP-FEE-001",
    summary: "Selected program fee could not be converted into a payable amount.",
    adminMeaning: "Check the training catalog fee label and payment environment. Production fees must parse to at least Rs. 1.",
  },
  {
    code: "APP-DB-001",
    summary: "Application could not be saved in the database.",
    adminMeaning: "Check database connectivity, Prisma/Vercel logs, and duplicate or invalid stored data constraints.",
  },
  {
    code: "APP-PAY-001",
    summary: "Application was saved, but payment gateway credentials are unavailable.",
    adminMeaning: "PhonePe environment variables are missing or disabled. Applicant record exists, but checkout cannot open.",
  },
  {
    code: "APP-PAY-002",
    summary: "Application was saved, but payment checkout could not be created.",
    adminMeaning: "Check PhonePe credentials, amount, redirect URL, phone number, and the failed payment order log.",
  },
  {
    code: "APP-NET-001",
    summary: "Browser could not complete the application submit request.",
    adminMeaning: "Check the applicant network, browser console, Vercel availability, and whether the API returned a response.",
  },
  {
    code: "APP-UNKNOWN-001",
    summary: "Application submission failed unexpectedly.",
    adminMeaning: "Use the request ID in server logs to trace the unclassified failure.",
  },
];

export function getApplicationErrorGuideItem(code: ApplicationErrorCode) {
  return applicationErrorGuide.find((item) => item.code === code) ?? applicationErrorGuide.at(-1)!;
}
