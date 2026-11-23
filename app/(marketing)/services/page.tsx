import type { Metadata } from "next";
import MarketingVisualPage from "@/components/MarketingVisualPage";
import { readMarketingContent } from "@/lib/marketing-cms";

export const metadata: Metadata = {
  title: "Service Directory",
  description:
    "Explore residential, commercial, industrial, health care, personal care, and education services on Klick-Pro. Browse categories, compare vetted professionals, and post jobs.",
};

export default async function ServicesPage() {
  const content = await readMarketingContent("services");
  return <MarketingVisualPage page="services" content={content} />;
}
