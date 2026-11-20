import type { Metadata } from "next";
import Signup from "@/routes/signup";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join Klick-Pro. Register as a client to hire vetted service experts, or as a professional to grow your business with 100% payouts.",
};

export default function SignupPage() {
  return <Signup />;
}
