import type { Metadata } from "next";
import MyJobs from "@/routes/client/my-jobs";

export const metadata: Metadata = {
  title: "My Jobs & Projects",
  description: "Track all your posted requirements, active contracts, and completed projects.",
};

export default function Page() {
  return <MyJobs />;
}
