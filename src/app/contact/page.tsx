import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { institute } from "@/lib/fallback-data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact API CULTURE Technology Center.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <SectionHeading eyebrow="Contact" title="Reach API CULTURE">
          Use the secure contact form or the official contact details from the center. Our team at API CULTURE is ready to assist with inquiries about programs, training, and partnerships.
        </SectionHeading>
        <div className="glass-panel mt-10 rounded-xl p-6 text-sm leading-7 text-[#d4c4ac]">
          <p className="font-display text-2xl font-semibold text-[#ffd485]">{institute.legalName}</p>
          <p className="mt-3">{institute.address}</p>
          <p className="mt-3">Phone: {institute.phone.join(" / ")}</p>
          <p>Email: {institute.email}</p>
          <p>Website: {institute.website}</p>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
