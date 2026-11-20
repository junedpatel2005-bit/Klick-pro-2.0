import type { Metadata } from "next";
import ForgotPassword from "@/routes/forgot-password";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Recover your Klick-Pro account password securely via registered email or SMS verification.",
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
