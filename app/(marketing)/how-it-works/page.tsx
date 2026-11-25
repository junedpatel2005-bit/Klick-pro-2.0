import type { Metadata } from "next";
import HowItWorks from "@/routes/how-it-works";
import { readMarketingContent } from "@/lib/marketing-cms";
import { readPageTexts } from "@/lib/cms-page-texts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how Klick-Pro works: post a job, compare verified proposals, fund milestone escrow, and release payments upon approval.",
};

export default async function HowItWorksPage() {
  const [content, pageTexts] = await Promise.all([
    readMarketingContent("how-it-works"),
    readPageTexts("how-it-works"),
  ]);
  return <HowItWorks cmsContent={content} pageTexts={pageTexts} />;
}
