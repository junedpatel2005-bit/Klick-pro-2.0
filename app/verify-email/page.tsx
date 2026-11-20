import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyEmail from "@/routes/verify-email";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Confirm your email address to activate your Klick-Pro marketplace account.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
