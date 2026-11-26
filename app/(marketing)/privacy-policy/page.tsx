import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL_DOCUMENTS } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Klick-Pro collects, handles, and safeguards your personal, payment, and marketplace data.",
};

export default function PrivacyPolicyPage() {
  const doc = LEGAL_DOCUMENTS.privacy;
  return (
    <LegalPage
      eyebrow={doc.eyebrow}
      title={doc.title}
      description={doc.description}
      sections={doc.sections}
    />
  );
}
