import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
import { policyDocuments } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: policyDocuments.terms.description,
};

export default function TermsAndConditionsPage() {
  return <PolicyPage document={policyDocuments.terms} />;
}
