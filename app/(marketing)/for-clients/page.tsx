import type { Metadata } from "next";
import MarketingVisualPage from "@/components/MarketingVisualPage";
import { readMarketingContent } from "@/lib/marketing-cms";

export const metadata: Metadata = {
  title: "For Clients",
  description:
    "Hire trusted and verified professionals without the back-and-forth. Post once, receive quotes, and pay safely with milestone escrow on Klick-Pro.",
};

export default async function ForClientsPage() {
  const content = await readMarketingContent("for-clients");
  return <MarketingVisualPage page="for-clients" content={content} />;
}
