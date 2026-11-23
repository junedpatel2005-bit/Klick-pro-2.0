import type { Metadata } from "next";
import MarketingVisualPage from "@/components/MarketingVisualPage";
import { readMarketingContent } from "@/lib/marketing-cms";

export const metadata: Metadata = {
  title: "Contact Support",
  description:
    "Reach out to the Klick-Pro team for questions regarding job postings, professional onboarding, milestone escrow payments, or dispute assistance.",
};

export default async function ContactPage() {
  const content = await readMarketingContent("contact");
  return <MarketingVisualPage page="contact" content={content} />;
}
