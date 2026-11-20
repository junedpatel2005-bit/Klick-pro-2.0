import type { Metadata } from "next";
import PostJob from "@/routes/client/post-job";

export const metadata: Metadata = {
  title: "Post a Job Requirement",
  description:
    "Publish a new service requirement and receive competitive proposals from verified trade specialists near you.",
};

export default function PostJobPage() {
  return <PostJob />;
}
