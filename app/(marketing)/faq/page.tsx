import type { Metadata } from "next";
import FAQ from "@/routes/faq";
import { getPublishedFaqCategories } from "@/lib/queries/faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Klick-Pro Help Center",
  description:
    "Find answers to common questions about posting jobs, bidding, escrow payments, verified credentials, and milestone guarantees on Klick-Pro.",
};

export const revalidate = 60;

export default async function FaqPage() {
  const initialData = await getPublishedFaqCategories().catch(() => []);
  return <FAQ initialData={initialData} />;
}
