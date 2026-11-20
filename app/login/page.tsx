import type { Metadata } from "next";
import Login from "@/routes/login";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Sign in to your Klick-Pro account to manage job posts, milestone releases, proposals, and direct messages.",
};

export default function LoginPage() {
  return <Login />;
}
