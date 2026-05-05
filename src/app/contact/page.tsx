import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { institute } from "@/lib/fallback-data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Honey House API Culture Technology Center.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <SectionHeading eyebrow="Contact" title="Reach Honey House">
          Use the secure contact form or the official contact details from the center signboard.
        </SectionHeading>
        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-5 text-sm leading-7 text-stone-700 shadow-sm">
          <p className="font-black text-emerald-950">{institute.legalName}</p>
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
