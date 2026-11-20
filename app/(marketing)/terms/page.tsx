import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms and conditions governing service projects, milestone payments, and marketplace conduct on Klick-Pro.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      description="The basic rules for using the Klick-Pro marketplace."
      sections={[
        {
          title: "Using Klick-Pro",
          body: "Clients and professionals must provide accurate information and use the marketplace respectfully and lawfully.",
        },
        {
          title: "Marketplace projects",
          body: "Project payments, milestones, reviews, disputes, and communications should be managed through Klick-Pro where available.",
        },
      ]}
    />
  );
}
