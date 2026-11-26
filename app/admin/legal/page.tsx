import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, verifySession } from "@/lib/auth";
import { getAllLegalDocuments } from "@/lib/legal-service";
import { AdminLegalManager } from "@/components/admin/AdminLegalManager";

export const dynamic = "force-dynamic";

export default async function AdminLegalPage() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect("/admin/login");
  try {
    if ((await verifySession(token)).role !== "ADMIN") redirect("/admin/login");
  } catch {
    redirect("/admin/login");
  }

  const initialDocs = await getAllLegalDocuments();
  return <AdminLegalManager initialDocuments={initialDocs} />;
}
