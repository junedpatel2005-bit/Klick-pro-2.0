import { getCompleteCategoryHierarchy } from "@/lib/queries/categories-hierarchy";
import { ServicesCatalog } from "@/components/ServicesCatalog";
import type { PageTextsMap } from "@/components/cms/CmsText";

export { ServicesCatalog };

export default async function Services({
  pageTexts,
}: {
  pageTexts?: PageTextsMap;
} = {}) {
  const data = await getCompleteCategoryHierarchy();
  return <ServicesCatalog data={data} pageTexts={pageTexts} />;
}
