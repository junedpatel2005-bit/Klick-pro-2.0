import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL_DOCUMENTS } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms and conditions governing service projects, milestone payments, and marketplace conduct on Klick-Pro.",
};

export default function TermsPage() {
  const doc = LEGAL_DOCUMENTS.terms;
  return (
    <LegalPage
      eyebrow={doc.eyebrow}
      title={doc.title}
      description={doc.description}
      sections={doc.sections}
    />
  );
}
