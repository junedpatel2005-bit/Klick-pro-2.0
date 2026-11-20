import type { Metadata } from "next";
import ClientReviews from "@/routes/client/reviews";

export const metadata: Metadata = {
  title: "Ratings & Reviews",
  description: "View and manage feedback and ratings for completed projects.",
};

export default function ClientReviewsPage() {
  return <ClientReviews />;
}
