import type { Metadata } from "next";
import ProfessionalDashboard from "@/routes/professional/dashboard";

export const metadata: Metadata = {
  title: "Professional Dashboard",
  description:
    "Track your open proposals, active contracts, client invitations, milestone releases, and profile ratings.",
};

export default function ProfessionalDashboardPage() {
  return <ProfessionalDashboard />;
}
