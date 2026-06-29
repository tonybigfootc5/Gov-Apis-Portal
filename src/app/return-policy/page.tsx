import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
import { policyDocuments } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Return Policy",
  description: policyDocuments.returns.description,
};

export default function ReturnPolicyPage() {
  return <PolicyPage document={policyDocuments.returns} />;
}
