import type { Metadata } from "next";
import About from "@/routes/about";
import { readCmsContent } from "@/lib/cms-file";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how Klick-Pro connects customers with verified professionals across residential, commercial, and industrial services.",
};

export default async function AboutPage() {
  const content = await readCmsContent();
  return <About cmsContent={content} />;
}
