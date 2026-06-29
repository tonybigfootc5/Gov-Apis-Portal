import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
import { policyDocuments } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: policyDocuments.refund.description,
};

export default function RefundPolicyPage() {
  return <PolicyPage document={policyDocuments.refund} />;
}
