import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sessionCookie, verifySession } from "@/lib/auth";
import ProfessionalHome from "@/routes/professional-home";
import { readProfessionalHomeContent } from "@/lib/home-cms-file";
import { readPageTexts } from "@/lib/cms-page-texts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Professional Workspace Home",
  description:
    "Discover open client requirements, submit quotes, track ongoing projects, and manage your earnings with zero platform deductions.",
};

export default async function ProfessionalHomePage() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect("/login");

  let session;
  try {
    session = await verifySession(token);
  } catch {
    redirect("/login");
  }
  if (session.role !== "PROFESSIONAL") redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      emailVerifiedAt: true,
      professionalCategory: true,
      professionalLatitude: true,
      professionalLongitude: true,
    },
  });

  if (!user?.emailVerifiedAt) redirect("/verify");
  if (
    !user.professionalCategory ||
    user.professionalLatitude === null ||
    user.professionalLongitude === null
  ) {
    redirect("/professional/setup?profileSetup=1");
  }

  const [homeContent, pageTexts] = await Promise.all([
    readProfessionalHomeContent(),
    readPageTexts("professional-home"),
  ]);
  return <ProfessionalHome homeContent={homeContent} pageTexts={pageTexts} />;
}
