import { institute } from "@/lib/fallback-data";

export const policyLastUpdated = "June 29, 2026";

export const policyLinks = [
  {
    title: "Terms and Conditions",
    href: "/terms-and-conditions",
    description: "Platform use, enrollment, payments, acceptable use, and governing terms.",
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    description: "How API CULTURE collects, uses, stores, and protects personal information.",
  },
  {
    title: "Refund Policy",
    href: "/refund-policy",
    description: "Refund and cancellation handling for training enrollments and related services.",
  },
  {
    title: "Return Policy",
    href: "/return-policy",
    description: "Returns and exchanges for any physical materials or goods, where applicable.",
  },
  {
    title: "Shipping Policy",
    href: "/shipping-policy",
    description: "Delivery expectations for confirmations, documents, and any physical shipments.",
  },
] as const;

export type PolicySection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PolicyDocument = {
  title: string;
  description: string;
  eyebrow: string;
  summary: string;
  sections: PolicySection[];
};

const grievanceContact = `${institute.legalName}, ${institute.address}. Email: ${institute.email}. Phone: ${institute.phone.join(" / ")}.`;

export const policyDocuments: Record<string, PolicyDocument> = {
  terms: {
    title: "Terms and Conditions",
    description: "Terms governing use of the API CULTURE website, training enrollment, and related services.",
    eyebrow: "Public Terms",
    summary:
      "These terms govern access to the API CULTURE website, inquiries, training applications, payment flows, and related digital or offline services offered by the center.",
    sections: [
      {
        title: "Platform and acceptance",
        paragraphs: [
          `The website at ${institute.website} and its related pages are operated for API CULTURE Technology Center (Bee Keeping), located at ${institute.address}. By accessing, browsing, applying for programs, making payments, or otherwise using the platform, you agree to these terms and the related public policies published on this website.`,
          "If you do not agree with these terms, please do not use the platform or submit information through it.",
        ],
      },
      {
        title: "Use of the platform",
        paragraphs: [
          "You agree to provide accurate, current, and complete information when using contact forms, training applications, payment journeys, or any other interactive features.",
          "You are responsible for activity carried out using the information you submit, including ensuring that uploaded records, contact details, and payment-related information are lawful and correct.",
        ],
        bullets: [
          "Do not misuse the platform for unlawful, fraudulent, abusive, or misleading activity.",
          "Do not attempt to interfere with site security, payment flows, or administrative systems.",
          "Do not copy, republish, or commercially exploit platform content without permission.",
        ],
      },
      {
        title: "Programs, fees, and payments",
        paragraphs: [
          "Program availability, schedules, fees, and seat capacity may change based on institutional decisions, operational readiness, or administrative review.",
          "Submitting an application or payment request does not by itself guarantee admission, confirmation, or final seat allocation unless the center has accepted and recorded the transaction or enrollment.",
        ],
        bullets: [
          "Payments are processed through authorized payment partners integrated into the platform.",
          "Any approved refund will be handled according to the published refund policy and applicable payment partner timelines.",
          "The center may decline, pause, or verify an application or payment where clarification, eligibility review, or fraud-prevention checks are required.",
        ],
      },
      {
        title: "Content, accuracy, and availability",
        paragraphs: [
          "We aim to keep website information current and useful, but we do not guarantee that every page, announcement, or program detail will always be complete, error-free, or uninterrupted.",
          "Training details, schedules, and public content may be updated without prior notice where needed for operational, technical, or institutional reasons.",
        ],
      },
      {
        title: "Intellectual property and external links",
        paragraphs: [
          "Website text, branding, layout, images, and educational presentation material available on the platform remain the property of API CULTURE or the relevant rights holders unless otherwise stated.",
          "The platform may link to third-party services or websites for convenience, including payment, maps, or communication tools. Use of those services is subject to their own terms and privacy practices.",
        ],
      },
      {
        title: "Liability, governing law, and contact",
        paragraphs: [
          "To the extent permitted by law, API CULTURE will not be liable for indirect, incidental, or consequential loss arising from use of the platform, interruption of service, or reliance on website content. Nothing in these terms limits liability where such limitation is not permitted by law.",
          "These terms are governed by the laws of India. Disputes relating to use of the platform shall be subject to the courts having jurisdiction in Hyderabad, Telangana, unless applicable law requires otherwise.",
          `Questions, complaints, or official communications relating to these terms may be sent to ${grievanceContact}`,
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description: "Privacy policy for API CULTURE website visitors, applicants, trainees, and payment users.",
    eyebrow: "Data Privacy",
    summary:
      "This policy explains how API CULTURE collects and uses personal information through the website, contact forms, training applications, and payment-related workflows.",
    sections: [
      {
        title: "What we collect",
        paragraphs: [
          "We may collect personal information that you provide directly, including your name, email address, phone number, address, application details, uploaded records, and messages submitted through the platform.",
          "Where a payment or refund workflow is used, we may also store transaction references, payment status information, and operational records needed to verify or support the transaction. We do not intentionally store full card or bank credentials unless provided to the payment partner in their secured environment.",
        ],
      },
      {
        title: "How we use information",
        paragraphs: [
          "We use personal information to respond to inquiries, process training applications, manage admissions and communication, support payment or refund operations, improve the website, and maintain security and audit records.",
          "We may also use submitted information to comply with institutional requirements, legal obligations, fraud-prevention measures, and recordkeeping connected to the center's operations.",
        ],
        bullets: [
          "Contact and support responses",
          "Program application review and administration",
          "Payment confirmation, reconciliation, and refund support",
          "Security monitoring and service improvement",
        ],
      },
      {
        title: "Sharing and storage",
        paragraphs: [
          "Information may be shared with service providers, payment processors, hosting providers, technical operators, or authorized institutional personnel strictly where needed to run the website or deliver services.",
          "We may also disclose information when required by law, lawful request, dispute handling, fraud investigation, or protection of the center, users, or the public.",
          "Personal information is primarily processed and stored in India or in infrastructure used to serve users of this platform.",
        ],
      },
      {
        title: "Retention and security",
        paragraphs: [
          "We keep personal information only for as long as reasonably necessary for the purpose for which it was collected, including application review, communication, transaction support, and legal or operational recordkeeping.",
          "Reasonable technical and organizational safeguards are used to protect information, but no internet transmission or storage system can be guaranteed as completely secure.",
        ],
      },
      {
        title: "Your choices and contact",
        paragraphs: [
          "You may request correction of inaccurate information submitted through the platform, and you may contact the center regarding deletion or withdrawal requests where applicable. Some information may need to be retained for admissions, accounting, fraud-prevention, or legal compliance reasons.",
          `For privacy-related requests or complaints, contact ${grievanceContact}`,
        ],
      },
    ],
  },
  refund: {
    title: "Refund Policy",
    description: "Refund and cancellation terms for training enrollments, fees, and related purchases.",
    eyebrow: "Refunds",
    summary:
      "This policy explains when cancellation requests may be reviewed and how approved refunds for training-related payments or other purchases are handled.",
    sections: [
      {
        title: "Cancellation requests",
        paragraphs: [
          "Cancellation requests should be raised as early as possible after payment or enrollment. Requests made after administrative processing, seat confirmation, training commencement, or fulfillment of the relevant service may be rejected or partially adjusted.",
          "Where a payment relates to a training seat, workshop, or scheduled service, cancellation eligibility may depend on the batch timeline, confirmation status, and whether resources have already been committed.",
        ],
      },
      {
        title: "When refunds may be considered",
        paragraphs: [
          "Refunds may be considered if payment was made in error, duplicate payment occurred, a program was cancelled by the center, or a verified service issue makes the enrollment or purchase ineligible to proceed.",
          "Approved refund amounts may be full or partial depending on the nature of the request, administrative costs already incurred, and whether any part of the service has been delivered.",
        ],
        bullets: [
          "Duplicate or excess payment",
          "Program cancellation by the center",
          "Verified technical payment error",
          "Exceptional cases approved by the center after review",
        ],
      },
      {
        title: "Review process and timelines",
        paragraphs: [
          "Users should report refund-related concerns promptly using the center's published contact channels with enough detail to identify the payment, application, and reason for the request.",
          "If a refund is approved, processing time depends on the payment partner, banking channels, and administrative verification. The center will initiate the refund after review, but credit timing may vary by provider.",
        ],
      },
      {
        title: "Non-refundable situations",
        paragraphs: [
          "Fees may be non-refundable where a user withdraws after the service has substantially begun, where eligibility conditions were misrepresented, or where non-refundable charges were clearly communicated in advance.",
          "Refunds are also not guaranteed merely because a user changes plans after seat allocation or after time-bound training arrangements have already been made.",
        ],
      },
    ],
  },
  returns: {
    title: "Return Policy",
    description: "Return and exchange terms for any physical materials, kits, or goods associated with the project.",
    eyebrow: "Returns",
    summary:
      "API CULTURE primarily provides training and service-based offerings. This return policy applies only where physical materials, kits, publications, or goods are supplied as part of a purchase.",
    sections: [
      {
        title: "Applicability",
        paragraphs: [
          "Training registrations, seat bookings, digital confirmations, and service access are not physical goods and therefore are not returnable in the ordinary product-return sense.",
          "If the center supplies a physical item as part of a separate sale or program package, return or exchange requests may be reviewed subject to this policy.",
        ],
      },
      {
        title: "Eligibility for returns or exchanges",
        paragraphs: [
          "To be eligible, the item should generally be unused, in its original condition, and accompanied by the original packaging or proof of purchase where available.",
          "Return or exchange requests should be raised promptly after receipt so the center can review the condition and cause of the issue.",
        ],
        bullets: [
          "Damage during delivery",
          "Defective item received",
          "Item materially different from what was described",
        ],
      },
      {
        title: "Non-returnable situations",
        paragraphs: [
          "Customized materials, used consumables, time-sensitive items, or products marked as non-returnable may not be eligible for return or exchange.",
          "Normal wear, misuse after delivery, or dissatisfaction unrelated to a verified defect may not qualify for return approval.",
        ],
      },
      {
        title: "How approved returns are handled",
        paragraphs: [
          "If a return or exchange is approved, the center will communicate the next steps, which may include inspection, replacement, store adjustment, or refund handling under the refund policy.",
          "Where the underlying purchase is service-based and only incidental physical material is involved, the center may choose a practical remedy such as replacement or partial adjustment instead of a full return outcome.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    description: "Shipping and delivery policy for confirmations, materials, and any physical goods.",
    eyebrow: "Shipping",
    summary:
      "API CULTURE mainly delivers training confirmations, updates, and service communication electronically. This policy describes how physical deliveries are handled when shipment is required.",
    sections: [
      {
        title: "General delivery model",
        paragraphs: [
          "Most applications, confirmations, payment updates, and training communication are delivered by email, phone, or through platform workflows rather than physical shipment.",
          "If the center supplies physical materials, publications, kits, or merchandise, dispatch may be arranged through a registered courier, postal service, or another suitable delivery channel.",
        ],
      },
      {
        title: "Shipping timelines",
        paragraphs: [
          "Dispatch timing depends on the nature of the item, stock availability, administrative approval, and delivery location. Estimated timelines communicated at the time of order or confirmation should be treated as indicative unless stated otherwise.",
          "The center is not responsible for delays caused by courier networks, weather, strikes, access issues, force majeure events, or incomplete delivery information supplied by the user.",
        ],
      },
      {
        title: "Address accuracy and receipt",
        paragraphs: [
          "Users are responsible for providing an accurate shipping address, phone number, and any required delivery instructions.",
          "Delivery may be considered complete when the shipment reaches the provided address, the recipient accepts delivery, or the courier records completion according to its standard process.",
        ],
      },
      {
        title: "Shipping charges and issues",
        paragraphs: [
          "Any applicable shipping charges, if communicated separately, may be non-refundable once dispatch has been initiated unless the center determines otherwise in a verified error case.",
          "If an item arrives damaged or materially incomplete, users should contact the center promptly so the issue can be reviewed under the return and refund policies.",
        ],
      },
    ],
  },
};
