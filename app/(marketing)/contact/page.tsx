import type { Metadata } from "next";
import Contact from "@/routes/contact";
import { readPageTexts } from "@/lib/cms-page-texts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Support",
  description:
    "Reach out to the Klick-Pro team for questions regarding job postings, professional onboarding, milestone escrow payments, or dispute assistance.",
};

export default async function ContactPage() {
  const pageTexts = await readPageTexts("contact");
  return <Contact pageTexts={pageTexts} />;
}
