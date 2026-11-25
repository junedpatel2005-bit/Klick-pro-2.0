import type { Metadata } from "next";
import FAQ from "@/routes/faq";
import { getPublishedFaqCategories } from "@/lib/queries/faq";
import { readPageTexts } from "@/lib/cms-page-texts";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Klick-Pro Help Center",
  description:
    "Find answers to common questions about posting jobs, bidding, escrow payments, verified credentials, and milestone guarantees on Klick-Pro.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const [initialData, pageTexts] = await Promise.all([
    getPublishedFaqCategories().catch(() => []),
    readPageTexts("faq"),
  ]);
  return <FAQ initialData={initialData} pageTexts={pageTexts} />;
}
