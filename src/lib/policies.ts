import { institute } from "@/lib/fallback-data";

export const policyLastUpdated = "July 4, 2026";

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
      "This policy explains how API CULTURE collects, uses, shares, stores, and protects personal information when you browse the website, contact the center, submit a training application, or make a payment.",
    sections: [
      {
        title: "What we collect",
        paragraphs: [
          "We may collect the information you provide directly to us, including your name, guardian or organization details where applicable, email address, mobile number, postal address, district, educational or occupational details, uploaded photographs or records, and messages submitted through contact or application forms.",
          "When you browse the website, we may also collect limited technical information such as IP address, browser type, device information, approximate location derived from network information, page access logs, and basic diagnostic data used for security, fraud prevention, and service maintenance.",
          "Where a payment, cancellation, or refund workflow is used, we may store transaction reference numbers, payment status, refund status, order or application identifiers, and operational records needed to verify, reconcile, or support the transaction. Card, UPI PIN, bank password, and similar sensitive payment credentials are handled by the authorized payment partner and are not intentionally stored by API CULTURE on this website.",
        ],
      },
      {
        title: "Why we use the information",
        paragraphs: [
          "We use personal information to respond to inquiries, process training applications, review eligibility, manage admissions, communicate with applicants and trainees, issue confirmations, support payment and refund operations, and maintain security and audit records.",
          "We may also use submitted information to comply with institutional requirements, maintain accounting and attendance records, investigate suspected fraud or misuse, meet legal obligations, and improve website reliability and service delivery.",
        ],
        bullets: [
          "Contact and support responses",
          "Program application review and administration",
          "Payment confirmation, reconciliation, and refund support",
          "Security monitoring, fraud prevention, and service improvement",
        ],
      },
      {
        title: "Legal basis, consent, and communications",
        paragraphs: [
          "By submitting a form, application, or payment request on this website, you consent to the collection and use of information as described in this policy where consent is the appropriate basis. In other cases, we process information because it is necessary to take steps at your request, provide the requested service, meet legal obligations, or protect the legitimate interests of the center and its users.",
          "We may contact you by phone, SMS, WhatsApp, or email regarding your inquiry, application status, batch schedule, payment confirmation, refund update, or other service-related notices. We do not sell personal information to third parties for their own independent marketing use.",
        ],
      },
      {
        title: "Sharing, hosting, and third-party services",
        paragraphs: [
          "Information may be shared only on a need-to-know basis with authorized institutional personnel, website hosting and infrastructure providers, payment processors, messaging providers, technical operators, and professional service providers supporting the operation of the platform.",
          "We may disclose information if required by law, lawful request, audit requirement, dispute handling, fraud investigation, or for protection of the center, users, or the public.",
          "Personal information is primarily processed and stored in India or in infrastructure used to securely serve users of this platform. Where third-party service providers are used, they may process limited data under their own contractual and security obligations.",
        ],
      },
      {
        title: "Cookies, logs, and analytics",
        paragraphs: [
          "This website may use essential cookies, server logs, and similar technologies needed for session continuity, security, spam prevention, load balancing, and basic website functionality.",
          "We may also review aggregate traffic and performance data to understand how users access the site and to improve reliability. These tools are not used to sell your data.",
        ],
      },
      {
        title: "Retention, security, and children",
        paragraphs: [
          "We retain personal information only for as long as reasonably necessary for the purpose for which it was collected, including application review, communication, payment or refund support, compliance, accounting, and operational recordkeeping.",
          "Reasonable technical and organizational safeguards are used to protect information, including access controls and operational monitoring. However, no internet transmission or storage system can be guaranteed as completely secure.",
          "If an applicant is a minor, the relevant parent, guardian, school, institution, or authorized representative should ensure that submitted information is accurate and appropriately authorized.",
        ],
      },
      {
        title: "Your rights, complaints, and policy updates",
        paragraphs: [
          "You may request correction of inaccurate information submitted through the platform, and you may contact the center regarding withdrawal, deletion, or access requests where applicable. Some information may still need to be retained for admissions, accounting, fraud prevention, or legal compliance reasons.",
          "We may update this policy from time to time by publishing the revised version on this page. The updated version becomes effective from the date shown as the last updated date unless stated otherwise.",
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
      "This policy explains cancellation rules, refund eligibility, refund timelines, and non-refundable situations for training enrollment fees and any other eligible payments made to API CULTURE through the website.",
    sections: [
      {
        title: "Scope of this policy",
        paragraphs: [
          "This website is used primarily to accept payments for training applications, batch enrollment, workshops, and related service-based offerings of API CULTURE Technology Center (Bee Keeping).",
          "This policy applies to payments made directly to API CULTURE through the official website. Bank-level reversals for failed transactions may also happen separately as per NPCI, bank, UPI, card network, or payment partner rules.",
        ],
      },
      {
        title: "Cancellation before batch or service delivery",
        paragraphs: [
          "A participant may request cancellation by writing to the center through the published phone or email contact details and sharing the applicant name, registered phone number, payment reference, and reason for cancellation.",
          "If the cancellation request is received at least 7 calendar days before the scheduled batch start date or service date, the center may approve a refund of the amount paid after deducting any actual payment gateway or banking charges, if such charges have already been incurred.",
          "If the cancellation request is received between 3 and 6 calendar days before the scheduled batch start date, the center may review the request and may approve a partial refund depending on committed administrative, batch-planning, and seat-blocking costs.",
          "Cancellation requests received less than 72 hours before the scheduled batch start date, after attendance confirmation, or after service delivery has begun are ordinarily non-refundable unless the center decides otherwise in an exceptional case.",
        ],
      },
      {
        title: "When a refund may be approved",
        paragraphs: [
          "Refunds may be approved where a duplicate or excess payment was received, the payment was made in error, the same transaction was debited more than once, the center cancelled the batch or service, or the applicant was found ineligible after payment and the center decides to reverse the amount.",
          "If a batch is cancelled by the center and no acceptable alternative batch is chosen by the participant, the center will normally initiate a full refund of the eligible amount.",
          "If a batch is rescheduled by the center and the participant is unable to attend the revised batch, the participant may request cancellation and the case will be reviewed for refund eligibility.",
        ],
        bullets: [
          "Duplicate or excess payment",
          "Verified technical payment error",
          "Batch or service cancelled by the center",
          "Exceptional cases approved by the center after review",
        ],
      },
      {
        title: "Refund method and timelines",
        paragraphs: [
          "Refund requests should be raised promptly with sufficient details to identify the payment and applicant. The center may ask for supporting information before taking a decision.",
          "If a refund is approved, API CULTURE will normally initiate the refund within 7 business days after approval. The time taken for the amount to reflect in the customer's account depends on the payment method, bank, card issuer, UPI app, and payment partner, and usually takes about 5 to 7 business days after initiation, though some cases may take longer.",
          "Approved refunds are generally sent back to the original payment source used for the transaction unless a different route is required by law, bank rules, or payment partner restrictions.",
        ],
      },
      {
        title: "Non-refundable situations",
        paragraphs: [
          "Fees are ordinarily non-refundable after the training batch, workshop, or service has commenced, after attendance has been marked, where the participant does not attend, or where the participant withdraws after seat allocation without a qualifying reason under this policy.",
          "Refunds may also be denied where eligibility information, identity details, or supporting documents were materially inaccurate, incomplete, misleading, or fraudulent.",
          "Payment gateway charges, bank charges, taxes already remitted, courier charges, or other third-party costs may be non-refundable where those costs have actually been incurred.",
        ],
      },
      {
        title: "Support and grievance contact",
        paragraphs: [
          `For refund status, cancellation requests, or payment-related grievances, contact ${grievanceContact}`,
        ],
      },
    ],
  },
  returns: {
    title: "Return Policy",
    description: "Return and exchange terms for any physical materials, kits, or goods associated with the project.",
    eyebrow: "Returns",
    summary:
      "API CULTURE primarily provides training and service-based offerings. The website does not provide a general product-return facility for training fees, digital confirmations, or service bookings. This policy applies only if a physical item is separately supplied by the center.",
    sections: [
      {
        title: "No general returns for service payments",
        paragraphs: [
          "Training registrations, seat bookings, application processing, digital confirmations, and service access are not physical goods and therefore cannot be returned in the ordinary product-return sense.",
          "If your payment on this website is only for training, workshop enrollment, or a service booking, the applicable policy is the refund policy and not a product return policy.",
        ],
      },
      {
        title: "When this return policy applies",
        paragraphs: [
          "This policy applies only if the center separately supplies a physical training kit, printed material, merchandise item, publication, or another tangible good for which return review is relevant.",
          "A return or replacement request should be raised within 48 hours of delivery if the item was damaged, defective, missing parts, or materially different from what was communicated at the time of purchase.",
        ],
        bullets: [
          "Damage during delivery",
          "Defective item received",
          "Item materially different from what was described",
        ],
      },
      {
        title: "Eligibility conditions for approved returns",
        paragraphs: [
          "To be eligible, the item should ordinarily be unused, in the same condition in which it was received, and accompanied by the original packaging or proof of purchase where reasonably available.",
          "The center may request photographs, delivery details, or a short written explanation before approving a return, replacement, or refund.",
        ],
      },
      {
        title: "Non-returnable items and situations",
        paragraphs: [
          "Used consumables, customized materials, time-sensitive printed matter, items damaged after delivery due to misuse, and items specifically marked as non-returnable are ordinarily not eligible for return.",
          "Dissatisfaction unrelated to a verified defect, shipping damage, or description mismatch may not qualify for return approval.",
        ],
      },
      {
        title: "How approved returns are handled",
        paragraphs: [
          "If a return or replacement is approved, the center will share the next steps. Depending on the case, the remedy may be replacement of the item, partial adjustment, or refund handling under the refund policy.",
          "If the return is approved because the center sent the wrong item, sent a defective item, or the item was damaged in transit, the center may bear the reasonable return logistics cost. In other approved cases, the return cost may be communicated case by case.",
        ],
      },
      {
        title: "Important merchant declaration",
        paragraphs: [
          "For the current website payment flow, API CULTURE primarily accepts payments for training and related services rather than for sale of physical consumer goods. If the payment gateway or merchant onboarding form asks whether the business supports general product returns, the answer for service-only enrollments is ordinarily no.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    description: "Shipping and delivery policy for confirmations, materials, and any physical goods.",
    eyebrow: "Shipping",
    summary:
      "API CULTURE mainly delivers enrollment confirmations, payment updates, and training communication electronically. The website does not ordinarily ship physical goods for standard training enrollments. This policy explains both digital delivery and the limited cases where physical dispatch may apply.",
    sections: [
      {
        title: "Digital delivery for normal website payments",
        paragraphs: [
          "Most applications, confirmations, payment receipts, batch updates, and training communication are delivered by email, phone, WhatsApp, SMS, or through the website workflow rather than through physical shipment.",
          "For standard training enrollment payments, there is usually no physical shipping requirement. Applicants should therefore treat the service as a digitally confirmed or administratively confirmed enrollment unless the center separately communicates dispatch of a physical item.",
        ],
      },
      {
        title: "Physical dispatch where applicable",
        paragraphs: [
          "If the center separately supplies printed materials, kits, publications, certificates, or merchandise requiring dispatch, shipment may be arranged through a registered courier, India Post, or another suitable delivery partner.",
          "Unless a different timeline is specifically communicated at the time of order, physical dispatch, where applicable, is generally targeted within 5 to 7 business days after payment confirmation, stock availability, and administrative approval.",
          "Delivery timelines are estimates and may vary based on service area, courier operations, weekends, holidays, force majeure events, or local access constraints.",
        ],
      },
      {
        title: "Address accuracy and receipt",
        paragraphs: [
          "Users are responsible for providing an accurate shipping address, phone number, and any required delivery instructions.",
          "Delivery may be considered complete when the shipment reaches the provided address, the recipient accepts delivery, or the courier records completion according to its standard process.",
          "Address changes requested after dispatch may not be possible.",
        ],
      },
      {
        title: "Shipping charges, delays, and issues",
        paragraphs: [
          "Any applicable shipping or courier charge, if separately communicated before payment, may become non-refundable once dispatch has started unless the center determines otherwise in a verified error case.",
          "The center is not responsible for delays caused by inaccurate address details, recipient unavailability, courier disruptions, weather, strikes, public restrictions, or other events beyond reasonable control.",
          "If a dispatched item arrives damaged, materially incomplete, or different from what was communicated, users should contact the center within 48 hours of delivery so the case can be reviewed under the return and refund policies.",
        ],
      },
      {
        title: "Important merchant declaration",
        paragraphs: [
          "For the current website payment flow, API CULTURE primarily accepts payments for training and related services and does not ordinarily ship physical consumer goods as part of a standard checkout. If the merchant onboarding form asks whether the business ships goods for these payments, the answer for service-only enrollments is ordinarily no.",
        ],
      },
    ],
  },
};
