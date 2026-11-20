import type { Metadata } from "next";
import { MessagesWorkspace } from "@/components/MessagesWorkspace";

export const metadata: Metadata = {
  title: "Messages Workspace",
  description:
    "Direct, real-time messaging with clients and service specialists regarding projects and requirements.",
};

export default function ClientMessagesPage() {
  return <MessagesWorkspace />;
}
