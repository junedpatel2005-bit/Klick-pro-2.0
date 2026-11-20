import type { Metadata } from "next";
import Notifications from "@/routes/notifications";

export const metadata: Metadata = {
  title: "Notifications & Alerts",
  description:
    "Stay informed on proposal submissions, milestone status updates, chat messages, and platform activity.",
};

export default function NotificationsPage() {
  return <Notifications />;
}
