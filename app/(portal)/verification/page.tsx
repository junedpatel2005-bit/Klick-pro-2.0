import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, sessionCookie } from "@/lib/auth";
import Verification from "@/routes/professional/verification";
import ClientVerification from "@/routes/client/verification";

export const metadata: Metadata = {
  title: "Identity & Trade Verification",
  description:
    "Complete identity and credential verification to earn the verified badge on Klick-Pro.",
};

async function getSessionTokenFromCookies() {
  return (await cookies()).get(sessionCookie)?.value;
}

async function ensureProfessionalAccess() {
  const token = await getSessionTokenFromCookies();
  if (!token) redirect("/login");

  let session;
  try {
    session = await verifySession(token);
  } catch {
    redirect("/login");
  }

  if (session.role !== "PROFESSIONAL" && session.role !== "CLIENT") {
    if (session.role === "ADMIN") redirect("/admin");
    redirect("/login");
  }
}

export default async function VerificationPage() {
  const token = await getSessionTokenFromCookies();
  if (!token) redirect("/login");
  let session;
  try {
    session = await verifySession(token);
  } catch {
    redirect("/login");
  }
  if (session.role === "CLIENT") return <ClientVerification />;
  if (session.role === "PROFESSIONAL") return <Verification />;
  redirect("/admin");
}
