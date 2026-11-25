import type { Metadata } from "next";
import Services from "@/routes/services";
import { readPageTexts } from "@/lib/cms-page-texts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Service Directory",
  description:
    "Explore residential, commercial, industrial, health care, personal care, and education services on Klick-Pro. Browse categories, compare vetted professionals, and post jobs.",
};

export default async function ServicesPage() {
  const pageTexts = await readPageTexts("services");
  return <Services pageTexts={pageTexts} />;
}
