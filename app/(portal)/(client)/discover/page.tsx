import type { Metadata } from "next";
import Discover from "@/routes/client/discover";

export const metadata: Metadata = {
  title: "Discover Verified Professionals",
  description:
    "Search and filter vetted service professionals by category, rating, location, and hourly rate across India.",
};

export default function DiscoverPage() {
  return <Discover />;
}
