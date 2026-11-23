import type { Metadata } from "next";
import MarketingVisualPage from "@/components/MarketingVisualPage";
import { readMarketingContent } from "@/lib/marketing-cms";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how Klick-Pro connects customers with verified professionals across residential, commercial, and industrial services.",
};

export default async function AboutPage() {
  const content = await readMarketingContent("about");
  return <MarketingVisualPage page="about" content={content} />;
}
