import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getLegalDocument } from "@/lib/legal-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms and conditions governing service projects, milestone payments, and marketplace conduct on Klick-Pro.",
};

export default async function TermsPage() {
  const doc = await getLegalDocument("terms");
  return (
    <LegalPage
      eyebrow={doc.eyebrow}
      title={doc.title}
      description={doc.description}
      sections={doc.rules}
    />
  );
}
