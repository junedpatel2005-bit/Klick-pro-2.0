"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Loader2, ShieldCheck } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const redirectParam = params.get("redirect") || params.get("next");

  const [status, setStatus] = useState<"ready" | "verifying" | "success" | "error">(
    token ? "ready" : "error",
  );
  const [error, setError] = useState<string | null>(
    token ? null : "This verification link is invalid or has expired.",
  );

  async function handleConfirm() {
    if (!token || status === "verifying") return;

    setStatus("verifying");
    setError(null);

    try {
      const response = await fetch("/api/v1/auth/verify-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          redirect: redirectParam || undefined,
        }),
      });

      const body = await response.text();
      let result: { error?: string; redirect?: string } = {};
      try {
        result = JSON.parse(body) as { error?: string; redirect?: string };
      } catch {
        result.error = `Verification request failed (${response.status}).`;
      }

      if (!response.ok) {
        setStatus("error");
        setError(result.error ?? "This verification link is invalid or has expired.");
        return;
      }

      setStatus("success");
      const target = result.redirect ?? "/dashboard";
      setTimeout(() => {
        router.replace(target);
      }, 1200);
    } catch {
      setStatus("error");
      setError("Unable to verify your email. Please try again or request a new link.");
    }
  }

  if (status === "success") {
    return (
      <AuthLayout
        title="Email confirmed!"
        subtitle="Your email address has been verified successfully."
        hideAside
        footer={
          <Link href="/login" className="text-primary hover:underline">
            Continue to log in
          </Link>
        }
      >
        <div className="space-y-4 py-4 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Verification successful!</p>
            <p className="mt-1 text-sm text-muted-foreground">Redirecting you to your account…</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (status === "error") {
    return (
      <AuthLayout
        title="Verification link issue"
        subtitle="We couldn't confirm your email address."
        hideAside
        footer={
          <Link href="/login" className="text-primary hover:underline">
            Back to log in
          </Link>
        }
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
          <Button asChild className="h-11 w-full font-medium">
            <Link href="/verify">Request a new verification link</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Confirm your email"
      subtitle="Click below to complete your email verification."
      hideAside
      footer={
        <Link href="/login" className="text-primary hover:underline">
          Back to log in
        </Link>
      }
    >
      <div className="space-y-5">
        <div className="flex justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
            <ShieldCheck className="h-8 w-8" strokeWidth={1.8} />
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/30 p-4 text-sm space-y-2">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>Link expires in 10 minutes</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This verification step ensures anti-scanner protection so automated corporate email
            security scanners do not prematurely invalidate your one-time link.
          </p>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={status === "verifying"}
          className="h-12 w-full text-base font-semibold transition-all"
        >
          {status === "verifying" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Confirming your email…
            </>
          ) : (
            "Click to Confirm Email"
          )}
        </Button>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
