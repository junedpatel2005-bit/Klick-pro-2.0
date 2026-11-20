import type { Metadata } from "next";
import ProDetails from "@/routes/professional/pro.$proId";

export const metadata: Metadata = {
  title: "Professional Profile & Services",
  description:
    "View verified specialist credentials, past client reviews, ratings, and service rates on Klick-Pro.",
};

export default function ProPage() {
  return <ProDetails />;
}
