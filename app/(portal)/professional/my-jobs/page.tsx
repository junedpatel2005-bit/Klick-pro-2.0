import type { Metadata } from "next";
import ProfessionalMyJobs from "@/routes/professional/my-jobs";

export const metadata: Metadata = {
  title: "Available Jobs & Quotes",
  description:
    "Explore matching job requirements in your service trades, submit competitive quotes, and manage proposals.",
};

export default function ProfessionalMyJobsPage() {
  return <ProfessionalMyJobs />;
}
