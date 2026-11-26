"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, ReactNode, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { GoogleMark } from "@/components/GoogleMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { FullPageLogoLoader } from "@/components/FullPageLogoLoader";
import { LegalConsentDialog, LegalDocumentDialog } from "@/components/LegalDocumentDialog";
import { invalidateCurrentUser } from "@/lib/current-user";
import { isValidEmailFormat } from "@/lib/email-validation";
import type { LegalDocumentKey } from "@/lib/legal-content";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"client" | "pro">("client");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [legalDoc, setLegalDoc] = useState<LegalDocumentKey | null>(null);
  const [pendingConsentMode, setPendingConsentMode] = useState<"email" | "google" | null>(null);
  const [emailCheckStatus, setEmailCheckStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const oauthError = searchParams.get("oauthError");
  const emailCheckSeqRef = useRef(0);
  const emailCheckAbortRef = useRef<AbortController | null>(null);
  const emailErrorCacheRef = useRef<Map<string, string>>(new Map());
  const checkedValidEmailsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const rawRole = searchParams.get("role")?.toLowerCase();
    if (rawRole === "pro" || rawRole === "professional") {
      setRole("pro");
    } else if (rawRole === "client") {
      setRole("client");
    }
  }, [searchParams]);

  function chooseRole(nextRole: "client" | "pro") {
    if (pending) return;
    setRole(nextRole);
    setError(null);
  }

  const checkEmail = useCallback(async (value: string, immediateInvalid = false) => {
    const trimmed = value.trim();
    if (!trimmed) {
      emailCheckAbortRef.current?.abort();
      setEmailCheckStatus("idle");
      return;
    }

    if (!isValidEmailFormat(trimmed)) {
      emailCheckAbortRef.current?.abort();
      if (immediateInvalid) {
        setEmailCheckStatus("invalid");
        setFieldErrors((current) => ({ ...current, email: "Enter a valid email address." }));
      }
      return;
    }

    const normalized = trimmed.toLowerCase();
    const cachedErr = emailErrorCacheRef.current.get(normalized);
    if (cachedErr) {
      setEmailCheckStatus("invalid");
      setFieldErrors((current) => ({ ...current, email: cachedErr }));
      return;
    }
    if (checkedValidEmailsRef.current.has(normalized)) {
      setEmailCheckStatus("valid");
      setFieldErrors((current) => {
        const next = { ...current };
        delete next.email;
        return next;
      });
      return;
    }

    emailCheckAbortRef.current?.abort();
    const controller = new AbortController();
    emailCheckAbortRef.current = controller;
    const seq = ++emailCheckSeqRef.current;
    setEmailCheckStatus("checking");

    try {
      const response = await fetch("/api/v1/auth/check-availability", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
        signal: controller.signal,
      });
      if (!response.ok || seq !== emailCheckSeqRef.current) {
        if (seq === emailCheckSeqRef.current) setEmailCheckStatus("idle");
        return;
      }
      const result =
        response.status === 204
          ? { fields: {} }
          : ((await response.json()) as { fields?: Record<string, string> });
      if (seq !== emailCheckSeqRef.current) return;

      const emailErr = result.fields?.email;
      if (emailErr) {
        emailErrorCacheRef.current.set(normalized, emailErr);
        setEmailCheckStatus("invalid");
      } else {
        checkedValidEmailsRef.current.add(normalized);
        setEmailCheckStatus("valid");
      }
      setFieldErrors((current) => {
        const next = { ...current };
        if (emailErr) next.email = emailErr;
        else delete next.email;
        return next;
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (seq === emailCheckSeqRef.current) setEmailCheckStatus("idle");
    }
  }, []);

  useEffect(() => {
    const trimmed = draft.email.trim();
    if (!trimmed) {
      emailCheckAbortRef.current?.abort();
      setEmailCheckStatus("idle");
      return;
    }
    const timer = window.setTimeout(() => {
      void checkEmail(trimmed, true);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [draft.email, checkEmail]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  async function submit() {
    if (pending) return;
    setError(null);
    const nextErrors: Record<string, string> = {};
    const firstName = draft.firstName.trim();
    const lastName = draft.lastName.trim();
    const email = draft.email.trim();
    const password = draft.password;
    if (!firstName) nextErrors.firstName = "First name is required.";
    if (!lastName) nextErrors.lastName = "Last name is required.";
    if (!email) nextErrors.email = "Email is required.";
    else if (!isValidEmailFormat(email))
      nextErrors.email = "Enter a valid email address.";
    else {
      const cachedErr = emailErrorCacheRef.current.get(email.toLowerCase());
      if (cachedErr) nextErrors.email = cachedErr;
    }
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(password))
      nextErrors.password = "Password must include an uppercase letter.";
    else if (!/[a-z]/.test(password))
      nextErrors.password = "Password must include a lowercase letter.";
    else if (!/\d/.test(password)) nextErrors.password = "Password must include a number.";
    if (!draft.confirmPassword) nextErrors.confirmPassword = "Please confirm your password.";
    else if (password !== draft.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }
    setPendingConsentMode("email");
  }

  async function completeEmailRegistration() {
    if (pending) return;
    const firstName = draft.firstName.trim();
    const lastName = draft.lastName.trim();
    const email = draft.email.trim();
    const password = draft.password;

    setPending(true);
    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role: role === "pro" ? "PROFESSIONAL" : "CLIENT",
          terms: true,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        redirect?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok) {
        setFieldErrors(result.fields ?? {});
        setError(result.error ?? "Unable to create your account.");
      } else {
        try {
          window.localStorage.removeItem("klick_skip_setup");
        } catch {
          // Ignore storage access errors
        }
        invalidateCurrentUser();
        router.push(result.redirect ?? "/verify");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  function handleAcceptConsent() {
    const mode = pendingConsentMode;
    setPendingConsentMode(null);
    setDraft((current) => ({ ...current, terms: true }));
    setError(null);
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.terms;
      return next;
    });

    if (mode === "google") {
      setGoogleLoading(true);
      const googleUrl = new URL("/api/auth/google", window.location.origin);
      googleUrl.searchParams.set("intent", "register");
      googleUrl.searchParams.set("role", role === "pro" ? "PROFESSIONAL" : "CLIENT");
      googleUrl.searchParams.set("termsAccepted", "1");
      window.location.href = googleUrl.toString();
      return;
    }

    if (mode === "email") {
      void completeEmailRegistration();
    }
  }

  function handleRejectConsent(reason: string) {
    setPendingConsentMode(null);
    setGoogleLoading(false);
    setDraft((current) => ({ ...current, terms: false }));
    setError(null);
    setFieldErrors((current) => ({ ...current, terms: reason }));
  }

  return (
    <>
      <FullPageLogoLoader
        active={pending || googleLoading}
        title={googleLoading ? "Connecting with Google…" : "Creating your Klick-Pro account…"}
        subtitle={
          googleLoading
            ? "Registering with your Google profile…"
            : "Setting up your profile, workspace, and secure wallet…"
        }
        overlay
      />
      <AuthLayout
        title="Create your account"
        subtitle="Join 50,000+ clients and professionals on Klick-Pro."
        hideAside
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </>
        }
      >
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-border/70 bg-muted/70 p-1">
          {(["client", "pro"] as const).map((choice) => (
            <button
              key={choice}
              type="button"
              disabled={pending}
              onClick={() => chooseRole(choice)}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${role === choice ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"} ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              I&apos;m a {choice === "client" ? "client" : "professional"}
            </button>
          ))}
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          {role === "client"
            ? "Create an account to post jobs and hire trusted professionals."
            : "Create a professional account to showcase your services and find work."}
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={pending || googleLoading}
          className="mb-5 h-11 w-full transition-transform hover:-translate-y-0.5"
          onClick={() => {
            setError(null);
            setPendingConsentMode("google");
          }}
        >
          {googleLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Connecting to Google…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <GoogleMark />
              Continue with Google
            </span>
          )}
        </Button>
        {oauthError === "google-not-configured" ? (
          <p className="mb-4 text-sm text-destructive">
            Google sign-up has not been configured yet.
          </p>
        ) : null}
        {oauthError === "access_denied" ? (
          <p className="mb-4 text-sm text-muted-foreground">
            Google sign-up was cancelled.
          </p>
        ) : null}
        {oauthError === "account-inactive" ? (
          <p className="mb-4 text-sm text-destructive">
            This account has been deactivated. Please contact support.
          </p>
        ) : null}
        {oauthError === "terms-required" ? (
          <p className="mb-4 text-sm font-bold text-destructive">
            Please accept our Terms and Conditions and Privacy Policy to register with Google.
          </p>
        ) : null}
        {oauthError &&
        !["google-not-configured", "access_denied", "account-inactive", "terms-required"].includes(
          oauthError,
        ) ? (
          <p className="mb-4 text-sm text-destructive">
            Google sign-up could not be completed. Please try again.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="first"
              name="firstName"
              label="First name"
              placeholder="First name"
              required
              disabled={pending}
              error={fieldErrors.firstName}
              value={draft.firstName}
              onValueChange={(value) => setDraft({ ...draft, firstName: value })}
            />
            <Field
              id="last"
              name="lastName"
              label="Last name"
              placeholder="Last name"
              required
              disabled={pending}
              error={fieldErrors.lastName}
              value={draft.lastName}
              onValueChange={(value) => setDraft({ ...draft, lastName: value })}
            />
          </div>
          <Field
            id="email"
            name="email"
            label="Work email"
            placeholder="you@example.com"
            type="email"
            required
            disabled={pending}
            error={fieldErrors.email}
            statusNote={
              !fieldErrors.email && emailCheckStatus === "checking" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Checking email address…
                </span>
              ) : !fieldErrors.email && emailCheckStatus === "valid" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Valid email address.
                </span>
              ) : null
            }
            value={draft.email}
            onValueChange={(value) => {
              setDraft({ ...draft, email: value });
              setEmailCheckStatus("idle");
              setFieldErrors((current) => {
                const next = { ...current };
                delete next.email;
                return next;
              });
            }}
            onBlur={() => void checkEmail(draft.email, true)}
          />
          <Field
            id="password"
            name="password"
            label="Password"
            placeholder="At least 8 characters"
            type={showPassword ? "text" : "password"}
            required
            disabled={pending}
            error={fieldErrors.password}
            value={draft.password}
            onValueChange={(value) => setDraft({ ...draft, password: value })}
            trailingAction={{
              label: showPassword ? "Hide password" : "Show password",
              onClick: () => setShowPassword((current) => !current),
            }}
          />
          <Field
            id="confirm-password"
            name="confirmPassword"
            label="Confirm password"
            placeholder="Repeat your password"
            type={showConfirmPassword ? "text" : "password"}
            required
            disabled={pending}
            error={fieldErrors.confirmPassword}
            value={draft.confirmPassword}
            onValueChange={(value) => setDraft({ ...draft, confirmPassword: value })}
            trailingAction={{
              label: showConfirmPassword ? "Hide password" : "Show password",
              onClick: () => setShowConfirmPassword((current) => !current),
            }}
          />
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input
              name="terms"
              type="checkbox"
              disabled={pending}
              checked={draft.terms}
              onChange={(event) => {
                const checked = event.target.checked;
                setDraft({ ...draft, terms: checked });
                if (checked) {
                  setFieldErrors((current) => {
                    const next = { ...current };
                    delete next.terms;
                    return next;
                  });
                }
              }}
              className="mt-0.5 h-4 w-4 accent-primary cursor-pointer"
            />
            <span>
              I agree to the{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLegalDoc("terms");
                }}
                className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Terms and Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLegalDoc("privacy");
                }}
                className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>
          {fieldErrors.terms && <p className="text-sm font-bold text-destructive">{fieldErrors.terms}</p>}
          {error && <p className="text-sm font-bold text-destructive">{error}</p>}
          <Button
            type="submit"
            className="h-11 w-full transition-all duration-200"
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? (
              <span className="flex items-center justify-center gap-2 font-semibold">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </AuthLayout>
      <LegalDocumentDialog document={legalDoc} onClose={() => setLegalDoc(null)} />
      <LegalConsentDialog
        open={pendingConsentMode !== null}
        acceptLabel={pendingConsentMode === "google" ? "Accept & Continue with Google" : "Accept & Register"}
        onAccept={handleAcceptConsent}
        onReject={handleRejectConsent}
      />
    </>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  error,
  statusNote,
  value,
  onValueChange,
  onBlur,
  trailingAction,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  statusNote?: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
  trailingAction?: { label: string; onClick: () => void };
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange?.(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`h-11 ${trailingAction ? "pr-16" : ""} ${error ? "border-destructive placeholder:text-destructive focus-visible:ring-destructive" : ""}`}
        />
        {trailingAction && (
          <button
            type="button"
            onClick={trailingAction.onClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-primary transition-all duration-200 hover:scale-105 hover:underline active:scale-95"
            aria-label={trailingAction.label}
          >
            {trailingAction.label.startsWith("Show") ? "Show" : "Hide"}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${name}-error`} className="text-sm font-bold text-destructive">
          {error}
        </p>
      ) : (
        statusNote ?? null
      )}
    </div>
  );
}
