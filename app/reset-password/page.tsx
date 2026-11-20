import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPassword from "@/routes/reset-password";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new, secure password for your Klick-Pro account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
