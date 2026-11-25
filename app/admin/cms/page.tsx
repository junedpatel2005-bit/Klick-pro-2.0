import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, verifySession } from "@/lib/auth";
import CmsEditor from "@/components/CmsEditor";
import { getCompleteCategoryHierarchy } from "@/lib/queries/categories-hierarchy";
import { getPublishedFaqCategories } from "@/lib/queries/faq";

export default async function CmsPage() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect("/admin/login");
  try {
    if ((await verifySession(token)).role !== "ADMIN") redirect("/admin/login");
  } catch {
    redirect("/admin/login");
  }
  const [serviceHierarchy, faqCategories] = await Promise.all([
    getCompleteCategoryHierarchy().catch(() => undefined),
    getPublishedFaqCategories().catch(() => []),
  ]);
  return <CmsEditor serviceHierarchy={serviceHierarchy} faqCategories={faqCategories} />;
}
