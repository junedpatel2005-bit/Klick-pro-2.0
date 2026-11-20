import type { Metadata } from "next";
import ClientDetails from "@/routes/client/client.$clientId";

export const metadata: Metadata = {
  title: "Client Profile & Project History",
  description: "View verified client profile, hiring history, and project ratings on Klick-Pro.",
};

export default function ClientPage() {
  return <ClientDetails />;
}
