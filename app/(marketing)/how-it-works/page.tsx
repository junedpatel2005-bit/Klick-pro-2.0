import type { Metadata } from "next";
import HowItWorks from "@/routes/how-it-works";
import { readMarketingContent } from "@/lib/marketing-cms";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how Klick-Pro works: post a job, compare verified proposals, fund milestone escrow, and release payments upon approval.",
};

export default async function HowItWorksPage() {
  const content = await readMarketingContent("how-it-works");
  return <HowItWorks cmsContent={content} />;
}
