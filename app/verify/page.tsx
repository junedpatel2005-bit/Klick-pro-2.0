import type { Metadata } from "next";
import { Suspense } from "react";
import Verify from "@/routes/verify";

export const metadata: Metadata = {
  title: "Account Verification",
  description: "Complete your Klick-Pro phone and identity verification.",
};

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <Verify />
    </Suspense>
  );
}
