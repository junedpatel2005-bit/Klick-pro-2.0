import type { Metadata } from "next";
import ClientDashboard from "@/routes/client/dashboard";

export const metadata: Metadata = {
  title: "Client Dashboard",
  description:
    "Monitor active job postings, review specialist proposals, track ongoing milestones, and manage escrow deposits.",
};

export default function DashboardPage() {
  return <ClientDashboard />;
}
