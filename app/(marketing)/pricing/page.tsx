import type { Metadata } from "next";
import MarketingVisualPage from "@/components/MarketingVisualPage";
import { readMarketingContent } from "@/lib/marketing-cms";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Explore transparent pricing on Klick-Pro. 100% free for clients to post jobs, and 100% full payout on completed milestones for verified professionals.",
};

export default async function PricingPage() {
  const content = await readMarketingContent("pricing");
  return <MarketingVisualPage page="pricing" content={content} />;
}
