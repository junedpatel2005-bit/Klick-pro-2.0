import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Secure administrator sign-in for the Klick-Pro management console.",
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
