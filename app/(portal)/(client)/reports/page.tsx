import type { Metadata } from "next";
import ClientReports from "@/routes/client/reports";

export const metadata: Metadata = {
  title: "Payment Reports & Invoices",
  description:
    "Download GST-compliant project invoices, escrow release statements, and milestone payment summaries.",
};

export default function Page() {
  return <ClientReports />;
}
