import type { Metadata } from "next";
import Pricing from "@/routes/pricing";
import { readPageTexts } from "@/lib/cms-page-texts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Explore transparent pricing on Klick-Pro. 100% free for clients to post jobs, and 100% full payout on completed milestones for verified professionals.",
};

export default async function PricingPage() {
  const pageTexts = await readPageTexts("pricing");
  return <Pricing pageTexts={pageTexts} />;
}
