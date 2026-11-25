import { AdminPageSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <AdminPageSkeleton
      title="Loading Webpage Editor…"
      subtitle="Fetching webpages, policies, and editorial sections…"
    />
  );
}
