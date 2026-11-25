import type { Metadata } from "next";
import { db } from "@/lib/db";
import ForClients, { type SampleJobData } from "@/routes/for-clients";
import { readPageTexts } from "@/lib/cms-page-texts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "For Clients",
  description:
    "Hire trusted and verified professionals without the back-and-forth. Post once, receive quotes, and pay safely with milestone escrow on Klick-Pro.",
};

async function getSampleJob(): Promise<SampleJobData | null> {
  try {
    const job = await db.clientJob.findFirst({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      include: {
        projectRequests: {
          take: 3,
          include: {
            professional: {
              select: {
                firstName: true,
                lastName: true,
                professionalCategory: true,
              },
            },
          },
        },
      },
    });

    if (!job) return null;

    const letters = ["A", "B", "C"];
    const proposals = job.projectRequests.map((pr, idx) => ({
      letter: letters[idx] ?? String(idx + 1),
      proName: `${pr.professional.firstName} ${pr.professional.lastName}`.trim(),
      category: pr.professional.professionalCategory ?? "Verified Professional",
    }));

    return {
      id: job.id,
      title: job.title ?? "General Service Requirement",
      category: job.category ?? "Marketplace Job",
      location: job.locationDistrict ?? job.locationAddress ?? "On-site",
      workMode: job.workMode ?? "On-site",
      timeline: job.urgency === "HIGH" ? "Urgent Priority" : "This Week",
      proposalsCount: job.projectRequests.length,
      proposals,
    };
  } catch {
    return null;
  }
}

export default async function ForClientsPage() {
  const [sampleJob, pageTexts] = await Promise.all([getSampleJob(), readPageTexts("for-clients")]);
  return <ForClients sampleJob={sampleJob} pageTexts={pageTexts} />;
}
