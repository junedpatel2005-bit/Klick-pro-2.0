import FAQ from "@/routes/faq";
import { getPublishedFaqCategories } from "@/lib/queries/faq";

export const revalidate = 60;

export default async function FaqPage() {
  const initialData = await getPublishedFaqCategories().catch(() => []);
  return <FAQ initialData={initialData} />;
}
