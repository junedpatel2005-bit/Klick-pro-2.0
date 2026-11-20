import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Milestone Tracking",
  description:
    "Track live project milestones, escrow fund releases, and deliverables in real time on Klick-Pro.",
};

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
