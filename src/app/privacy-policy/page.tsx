import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
import { policyDocuments } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: policyDocuments.privacy.description,
};

export default function PrivacyPolicyPage() {
  return <PolicyPage document={policyDocuments.privacy} />;
}
