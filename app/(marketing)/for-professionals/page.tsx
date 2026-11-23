import type { Metadata } from "next";
import MarketingVisualPage from "@/components/MarketingVisualPage";
import { readMarketingContent } from "@/lib/marketing-cms";

export const metadata: Metadata = {
  title: "For Professionals",
  description:
    "Find quality jobs, receive 100% full payout on milestones, and grow your professional client base across residential, commercial, and industrial sectors.",
};

export default async function ForProsPage() {
  const content = await readMarketingContent("for-professionals");
  return <MarketingVisualPage page="for-professionals" content={content} />;
}
