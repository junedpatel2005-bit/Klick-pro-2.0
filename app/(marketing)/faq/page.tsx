import type { Metadata } from "next";
import MarketingVisualPage from "@/components/MarketingVisualPage";
import { readMarketingContent } from "@/lib/marketing-cms";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Klick-Pro Help Center",
  description:
    "Find answers to common questions about posting jobs, bidding, escrow payments, verified credentials, and milestone guarantees on Klick-Pro.",
};

export const revalidate = 60;

export default async function FaqPage() {
  const content = await readMarketingContent("faq");
  return <MarketingVisualPage page="faq" content={content} />;
}
