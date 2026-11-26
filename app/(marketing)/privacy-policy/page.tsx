import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getLegalDocument } from "@/lib/legal-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Klick-Pro collects, handles, and safeguards your personal, payment, and marketplace data.",
};

export default async function PrivacyPolicyPage() {
  const doc = await getLegalDocument("privacy");
  return (
    <LegalPage
      eyebrow={doc.eyebrow}
      title={doc.title}
      description={doc.description}
      sections={doc.rules}
    />
  );
}
