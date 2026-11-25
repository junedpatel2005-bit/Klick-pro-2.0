import type { Metadata } from "next";
import About from "@/routes/about";
import { readCmsContent } from "@/lib/cms-file";
import { readPageTexts } from "@/lib/cms-page-texts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how Klick-Pro connects customers with verified professionals across residential, commercial, and industrial services.",
};

export default async function AboutPage() {
  const [content, pageTexts] = await Promise.all([readCmsContent(), readPageTexts("about")]);
  return <About cmsContent={content} pageTexts={pageTexts} />;
}
