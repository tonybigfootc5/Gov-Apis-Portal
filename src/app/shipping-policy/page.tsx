import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
import { policyDocuments } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: policyDocuments.shipping.description,
};

export default function ShippingPolicyPage() {
  return <PolicyPage document={policyDocuments.shipping} />;
}
