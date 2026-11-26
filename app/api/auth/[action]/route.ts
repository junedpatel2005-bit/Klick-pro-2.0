import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { db } from "@/lib/db";
import {
  createSession,
  revokeSession,
  sessionCookie,
  sessionOptions,
  verifySession,
} from "@/lib/auth";
import {
  createPhoneVerificationProof,
  hasValidPhoneVerificationProof,
  phoneProofCookie,
  phoneProofCookieOptions,
} from "@/lib/dev-phone-otp";
import { requestPhoneOtp, verifyPhoneOtp } from "@/lib/phone-otp-provider";
import { clearRateLimit, rateLimit } from "@/lib/rate-limit";
import { sendAuthEmail } from "@/lib/email";
import { enqueueBackgroundJob } from "@/lib/background-jobs";
import { logServerError } from "@/lib/server-logger";
import { notifyAdminsOfNewAccount } from "@/lib/marketplace-notifications";
import { isValidInternationalPhoneNumber } from "@/lib/phone-validation";
import { hasValidEmailDomain } from "@/lib/email-domain-check";
import { isValidEmailFormat } from "@/lib/email-validation";
import { getSafeRedirectUrl } from "@/lib/safe-redirect";
import { capitalizeWords } from "@/lib/utils";

const passwordSchema = z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/);
const registerSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(25).optional(),
  password: passwordSchema,
  role: z.enum(["CLIENT", "PROFESSIONAL"]),
  terms: z.literal(true),
});
const credentials = z.object({ email: z.string().email(), password: z.string().min(1) });
const tokenHash = (value: string) => createHash("sha256").update(value).digest("hex");
const clientKey = (request: NextRequest) =>
  request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
const safe = (message: string, status = 400) => NextResponse.json({ error: message }, { status });
function publicAppOrigin(request: NextRequest) {
  // If an explicit public APP_URL is configured, that is the primary origin
  const configured = process.env.APP_URL?.trim();

  // Check for proxy-forwarded host from frontend (e.g. localhost:3000)
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "http";
  if (forwardedHost && !forwardedHost.includes(":5000")) {
    try {
      return new URL(`${forwardedProto}://${forwardedHost}`).origin;
    } catch {
      // Fall through
    }
  }

  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Fall through
    }
  }

  const requestHost = request.headers.get("host")?.trim();
  const requestProtocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    request.nextUrl.protocol.replace(":", "");

  if (requestHost && requestHost !== "0.0.0.0:3000" && !requestHost.includes(":5000")) {
    try {
      return new URL(`${requestProtocol}://${requestHost}`).origin;
    } catch {
      // Fall through
    }
  }

  return "http://localhost:3000";
}

function getAuthRedirect(
  user: {
    role: string;
    emailVerifiedAt: Date | null;
    lastLoginAt: Date | null;
    professionalCategory?: string | null;
    professionalLatitude?: number | null;
    professionalLongitude?: number | null;
  },
  hasClientProfile: boolean,
  skipSetupCookie: boolean,
): string {
  if (user.role === "ADMIN") return "/admin";
  if (!user.emailVerifiedAt) return "/verify";

  if (user.role === "PROFESSIONAL") {
    const hasProProfile =
      Boolean(user.professionalCategory) &&
      user.professionalLatitude !== null &&
      user.professionalLongitude !== null;
    if (skipSetupCookie || hasProProfile) {
      return "/professional-home";
    }
    return "/professional/setup?profileSetup=1";
  }

  // Client role: open setup until a client profile exists or setup is explicitly skipped
  if (skipSetupCookie || hasClientProfile) {
    return "/dashboard";
  }
  return "/client/setup?profileSetup=1";
}

async function createEmailVerificationToken(userId: number) {
  // Revoke all previously issued active tokens for this user
  await db.apiToken.updateMany({
    where: {
      userId,
      kind: "EMAIL_VERIFICATION",
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });

  const raw = randomBytes(32).toString("hex");
  await db.apiToken.create({
    data: {
      userId,
      tokenHash: tokenHash(raw),
      kind: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // strictly 10 minutes
    },
  });
  return raw;
}
async function sendEmailVerificationLink(
  email: string,
  raw: string,
  appOrigin: string,
  userName?: string,
) {
  await sendAuthEmail(
    email,
    "Verify your email address for Klick-Pro",
    "Confirm your Klick-Pro email address",
    `${appOrigin}/verify-email?token=${encodeURIComponent(raw)}`,
    "Verify Email Address",
    {
      templateKey: "auth_email_verification",
      userName: userName || "there",
      appOrigin,
      variables: {
        user_name: userName || "there",
        verification_token: raw,
      },
    },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  if (action === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET === "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"
        ? "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"
        : process.env.GOOGLE_CLIENT_SECRET;
    const configuredCallback = process.env.GOOGLE_CALLBACK_URL?.trim();
    const appOrigin = publicAppOrigin(request);
    const defaultCallback = `${appOrigin}/api/auth/google`;
    const callbackUrl = configuredCallback || defaultCallback;

    const intent = request.nextUrl.searchParams.get("intent") === "register" ? "register" : "login";

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL(
          `${intent === "register" ? "/signup" : "/login"}?oauthError=google-not-configured`,
          appOrigin,
        ),
      );
    }

    const savedCookie = (() => {
      try {
        return JSON.parse(request.cookies.get("servio_google_oauth")?.value ?? "{}") as {
          state?: string;
          intent?: "login" | "register";
          role?: "CLIENT" | "PROFESSIONAL";
          nextPath?: string | null;
          callbackUrl?: string;
        };
      } catch {
        return {};
      }
    })();
    const oauthIntent = savedCookie.intent === "register" ? "register" : "login";
    const errorRedirectPath = oauthIntent === "register" ? "/signup" : "/login";

    const oauthError = request.nextUrl.searchParams.get("error");
    if (oauthError) {
      const response = NextResponse.redirect(
        new URL(`${errorRedirectPath}?oauthError=${encodeURIComponent(oauthError)}`, appOrigin),
      );
      response.cookies.set("servio_google_oauth", "", { httpOnly: true, path: "/", maxAge: 0 });
      return response;
    }

    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
      const role =
        request.nextUrl.searchParams.get("role") === "PROFESSIONAL" ? "PROFESSIONAL" : "CLIENT";
      const nextPath = request.nextUrl.searchParams.get("next");
      const state = randomBytes(24).toString("hex");
      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("redirect_uri", callbackUrl);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile");
      url.searchParams.set("prompt", "select_account");
      url.searchParams.set("state", state);
      const response = NextResponse.redirect(url);
      response.cookies.set(
        "servio_google_oauth",
        JSON.stringify({ state, intent, role, nextPath, callbackUrl }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 600,
        },
      );
      return response;
    }

    try {
      const saved = savedCookie;
      if (!saved.state || saved.state !== request.nextUrl.searchParams.get("state")) {
        throw new Error("Invalid OAuth state");
      }

      let activeCallbackUrl = saved.callbackUrl || callbackUrl;

      let tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: activeCallbackUrl,
          grant_type: "authorization_code",
        }),
      });

      let tokenData = (await tokenResponse.json().catch(() => ({}))) as {
        access_token?: string;
        error?: string;
        error_description?: string;
      };

      // If redirect_uri mismatch occurred, retry with alternate canonical path (/api/v1/auth/google <-> /api/auth/google)
      if (!tokenResponse.ok && tokenData.error === "redirect_uri_mismatch") {
        const alternateCallbackUrl = activeCallbackUrl.includes("/api/v1/auth/google")
          ? activeCallbackUrl.replace("/api/v1/auth/google", "/api/auth/google")
          : activeCallbackUrl.replace("/api/auth/google", "/api/v1/auth/google");

        if (alternateCallbackUrl !== activeCallbackUrl) {
          const retryResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: alternateCallbackUrl,
              grant_type: "authorization_code",
            }),
          });
          const retryData = (await retryResponse.json().catch(() => ({}))) as typeof tokenData;
          if (retryResponse.ok && retryData.access_token) {
            tokenResponse = retryResponse;
            tokenData = retryData;
            activeCallbackUrl = alternateCallbackUrl;
          }
        }
      }

      if (!tokenResponse.ok || !tokenData.access_token) {
        console.error("[Google OAuth Token Error]", {
          status: tokenResponse.status,
          error: tokenData.error,
          description: tokenData.error_description,
          activeCallbackUrl,
        });
        throw new Error(
          `Google token exchange failed: ${tokenData.error || "unknown"} - ${tokenData.error_description || "no description"}`,
        );
      }

      const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const profile = (await profileResponse.json()) as {
        sub?: string;
        email?: string;
        given_name?: string;
        family_name?: string;
        name?: string;
        picture?: string;
        email_verified?: boolean;
      };
      if (!profileResponse.ok || !profile.sub || !profile.email || profile.email_verified !== true) {
        throw new Error("Could not read Google profile");
      }

      const normalizedEmail = profile.email.trim().toLowerCase();
      let user = await db.user.findFirst({
        where: {
          OR: [
            { googleId: profile.sub },
            { email: { equals: normalizedEmail, mode: "insensitive" } },
          ],
        },
      });

      const names = (profile.name ?? "New User").trim().split(/\s+/, 2);
      const rawFirst = profile.given_name ?? names[0] ?? "New";
      const rawLast = profile.family_name ?? names[1] ?? "";
      const firstName = capitalizeWords(rawFirst) || "New";
      const lastName = capitalizeWords(rawLast) || "";
      const avatarUrl = profile.picture?.trim() || null;

      let createdAccount = false;
      if (!user) {
        if (oauthIntent !== "register") {
          const response = NextResponse.redirect(
            new URL("/login?oauthError=account-not-registered", appOrigin),
          );
          response.cookies.set("servio_google_oauth", "", { httpOnly: true, path: "/", maxAge: 0 });
          return response;
        }
        user = await db.user.create({
          data: {
            googleId: profile.sub,
            authProvider: "GOOGLE",
            email: normalizedEmail,
            firstName,
            lastName,
            avatarUrl,
            role: saved.role ?? "CLIENT",
            emailVerifiedAt: new Date(),
          },
        });
        createdAccount = true;
      } else {
        if (!user.isActive) {
          const response = NextResponse.redirect(
            new URL(`${errorRedirectPath}?oauthError=account-inactive`, appOrigin),
          );
          response.cookies.set("servio_google_oauth", "", { httpOnly: true, path: "/", maxAge: 0 });
          return response;
        }
        const updateData: {
          googleId?: string;
          authProvider?: string;
          emailVerifiedAt?: Date;
          avatarUrl?: string;
        } = {};
        if (!user.googleId) {
          updateData.googleId = profile.sub;
          if (user.authProvider === "LOCAL") updateData.authProvider = "GOOGLE";
        }
        if (!user.emailVerifiedAt) {
          updateData.emailVerifiedAt = new Date();
        }
        if (!user.avatarUrl && avatarUrl) {
          updateData.avatarUrl = avatarUrl;
        }
        if (Object.keys(updateData).length > 0) {
          user = await db.user.update({
            where: { id: user.id },
            data: updateData,
          });
        }
      }

      if (createdAccount && user.role !== "ADMIN") {
        await notifyAdminsOfNewAccount(user);
        await db.userNotification
          .create({
            data: {
              userId: user.id,
              type: user.role === "PROFESSIONAL" ? "WELCOME_PROFESSIONAL" : "WELCOME_CLIENT",
              title:
                user.role === "PROFESSIONAL"
                  ? "Welcome to your professional dashboard"
                  : "Welcome to Klick-Pro",
              description:
                user.role === "PROFESSIONAL"
                  ? "Your profile is ready. Update your setup and start getting matched with clients."
                  : "Your account is ready. Start exploring professionals or post your first project.",
              href: user.role === "PROFESSIONAL" ? "/professional-home" : "/dashboard",
            },
          })
          .catch(() => {});
      }

      const hasClientProfile =
        user.role === "CLIENT"
          ? Boolean(
              await db.clientProfile.findFirst({
                where: { userId: user.id },
                select: { id: true },
              }),
            )
          : false;

      const safeRedirect =
        saved.nextPath?.startsWith("/") && !saved.nextPath.startsWith("//")
          ? saved.nextPath
          : getAuthRedirect(user, hasClientProfile, !createdAccount && request.cookies.get("klick_skip_setup")?.value === "1");

      const response = NextResponse.redirect(new URL(safeRedirect, appOrigin));
      response.cookies.set(
        sessionCookie,
        await createSession({
          userId: user.id,
          role: user.role,
          emailVerifiedAt: user.emailVerifiedAt,
        }),
        sessionOptions,
      );
      response.cookies.set("servio_google_oauth", "", { httpOnly: true, path: "/", maxAge: 0 });
      if (createdAccount) {
        response.cookies.set("klick_skip_setup", "", { path: "/", maxAge: 0 });
      }
      return response;
    } catch (err) {
      logServerError("auth.google.oauth", err);
      const response = NextResponse.redirect(
        new URL(`${errorRedirectPath}?oauthError=google-failed`, appOrigin),
      );
      response.cookies.set("servio_google_oauth", "", { httpOnly: true, path: "/", maxAge: 0 });
      return response;
    }
  }

  if (action === "me") {
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    const cookieHeader = request.headers.get("cookie") ?? "";
    const tokenMatch = cookieHeader.match(new RegExp(`${sessionCookie}=([^;]+)`));
    const token = bearerToken || tokenMatch?.[1];
    if (!token) {
      return NextResponse.json({ user: null });
    }
    try {
      const session = await verifySession(token);
      return NextResponse.json({
        user: {
          id: String(session.userId),
          role: session.role,
          firstName: session.firstName,
          lastName: session.lastName,
          email: session.email,
          emailVerifiedAt: session.emailVerifiedAt,
          avatarUrl: session.avatarUrl,
        },
      });
    } catch {
      return NextResponse.json({ user: null });
    }
  }

  if (["login", "register", "send-phone-otp", "verify-phone", "check-availability"].includes(action)) {
    return NextResponse.json(
      {
        error: "METHOD_NOT_ALLOWED",
        message: `HTTP GET is not supported on /api/auth/${action}. You must send an HTTP POST request with a JSON payload.`,
        requiredMethod: "POST",
        endpoint: `/api/auth/${action}`,
        expectedHeaders: { "Content-Type": "application/json" },
        exampleBody:
          action === "login"
            ? { email: "user@example.com", password: "YourPassword123!" }
            : action === "register"
              ? { firstName: "John", lastName: "Doe", email: "user@example.com", password: "Password123!", role: "CLIENT", terms: true }
              : undefined,
      },
      { status: 405, headers: { Allow: "POST" } },
    );
  }

  return safe("Not found", 404);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  const body = await request.json().catch(() => null);
  // Credential attempts are scoped to an address as well as the browser IP.
  // In local development every user shares the "local" client key; using only
  // that key locks every account after five attempts from any account.
  const loginEmail =
    action === "login" && typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
  const rateLimitKey = loginEmail
    ? `${action}:${clientKey(request)}:${loginEmail}`
    : `${action}:${clientKey(request)}`;
  const rateAllowed =
    action === "check-availability" ? rateLimit(rateLimitKey, 60, 60_000) : rateLimit(rateLimitKey);
  if (!rateAllowed) return safe("Too many attempts. Please try again shortly.", 429);
  if (action === "send-phone-otp") {
    const parsed = z
      .object({
        phone: z.string().min(7).max(25),
        role: z.enum(["CLIENT", "PROFESSIONAL"]),
      })
      .refine((value) => isValidInternationalPhoneNumber(value.phone), {
        path: ["phone"],
        message: "Enter a valid phone number for the selected country.",
      })
      .safeParse(body);
    if (!parsed.success) return safe("Enter a valid phone number and account type.");
    const sessionToken = request.cookies.get(sessionCookie)?.value;
    let sessionUserId: number | null = null;
    if (sessionToken) {
      try {
        sessionUserId = (await verifySession(sessionToken)).userId;
      } catch {
        sessionUserId = null;
      }
    }
    const existingUser = await db.user.findFirst({
      where: { phone: parsed.data.phone, ...(sessionUserId ? { id: { not: sessionUserId } } : {}) },
    });
    if (existingUser)
      return NextResponse.json(
        {
          error:
            "This phone number is already registered. Please log in or use a different number.",
        },
        { status: 409 },
      );
    if (
      !rateLimit(`send-phone-otp:${clientKey(request)}:${parsed.data.phone.trim()}`, 3, 10 * 60_000)
    )
      return safe("Too many code requests. Please try again later.", 429);
    const result = await requestPhoneOtp(parsed.data.phone, parsed.data.role);
    if (!result.ok) return safe(result.error, result.status);
    return NextResponse.json({
      success: true,
    });
  }
  if (action === "verify-phone") {
    const parsed = z
      .object({
        phone: z.string().min(7).max(25),
        code: z.string().min(1).max(20),
        role: z.enum(["CLIENT", "PROFESSIONAL"]).optional(),
      })
      .refine((value) => isValidInternationalPhoneNumber(value.phone), {
        path: ["phone"],
        message: "Enter a valid phone number for the selected country.",
      })
      .safeParse(body);
    if (!parsed.success) return safe("Enter a valid phone number, account type, and code.");
    if (
      !rateLimit(`verify-phone:${clientKey(request)}:${parsed.data.phone.trim()}`, 100, 10 * 60_000)
    )
      return safe("Too many verification attempts. Please try again later.", 429);
    let role = parsed.data.role;
    const sessionToken = request.cookies.get(sessionCookie)?.value;
    let session: Awaited<ReturnType<typeof verifySession>> | null = null;
    if (sessionToken) {
      try {
        session = await verifySession(sessionToken);
        role = session.role === "CLIENT" || session.role === "PROFESSIONAL" ? session.role : role;
      } catch {
        session = null;
      }
    }
    if (!role || (session && session.role !== role)) return safe("Your account type is invalid.");
    const verifiedRole = role;
    if (session) {
      const duplicate = await db.user.findFirst({
        where: { phone: parsed.data.phone.trim(), id: { not: session.userId } },
        select: { id: true },
      });
      if (duplicate) return safe("This phone number is already registered.", 409);
    }
    const result = await verifyPhoneOtp(parsed.data.phone, parsed.data.code, verifiedRole);
    if (!result.ok) return safe(result.error, result.status);

    if (session) {
      await db.user.update({
        where: { id: session.userId },
        data: { phone: parsed.data.phone.trim(), phoneVerifiedAt: new Date() },
      });
      return NextResponse.json({ success: true });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      phoneProofCookie,
      await createPhoneVerificationProof(parsed.data.phone, verifiedRole),
      phoneProofCookieOptions,
    );
    return response;
  }
  if (action === "check-availability") {
    const parsed = z
      .object({
        email: z.string().trim().max(254).optional(),
        phone: z.string().min(7).max(25).optional(),
      })
      .refine((value) => !value.phone || isValidInternationalPhoneNumber(value.phone), {
        path: ["phone"],
        message: "Enter a valid phone number for the selected country.",
      })
      .refine((value) => Boolean(value.email || value.phone), {
        message: "Email or phone is required.",
      })
      .safeParse(body);
    if (!parsed.success) {
      return safe("Enter a valid email or phone number.");
    }
    const fields: Record<string, string> = {};
    if (parsed.data.email) {
      if (!isValidEmailFormat(parsed.data.email)) {
        fields.email = "Enter a valid email address.";
      } else if (!(await hasValidEmailDomain(parsed.data.email))) {
        fields.email = "This email domain does not exist. Enter a valid email address.";
      } else {
        const emailTaken = await db.user.findFirst({
          where: { email: { equals: parsed.data.email.trim(), mode: "insensitive" } },
          select: { id: true },
        });
        if (emailTaken) fields.email = "Email is already registered.";
      }
    }
    if (parsed.data.phone) {
      const phoneTaken = await db.user.findFirst({ where: { phone: parsed.data.phone } });
      if (phoneTaken) fields.phone = "Phone number is already registered.";
    }
    return NextResponse.json({ fields }, { status: 200 });
  }

  if (action === "register") {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const fields = Object.fromEntries(
        parsed.error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]),
      );
      return NextResponse.json(
        { error: "Please correct the highlighted fields.", fields },
        { status: 400 },
      );
    }
    const data = parsed.data;
    if (!isValidEmailFormat(data.email) || !(await hasValidEmailDomain(data.email))) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
          fields: { email: "This email domain does not exist. Enter a valid email address." },
        },
        { status: 400 },
      );
    }
    if (data.phone) {
      const proofToken = request.cookies.get(phoneProofCookie)?.value;
      const hasProof = await hasValidPhoneVerificationProof(proofToken, data.phone, data.role);
      if (!hasProof) {
        return NextResponse.json(
          {
            error: "Phone verification is required before completing registration.",
            fields: { phone: "Please verify your phone number via OTP first." },
          },
          { status: 403 },
        );
      }
    }
    const existingEmailUser = await db.user.findUnique({ where: { email: data.email } });
    const existingPhoneUser = data.phone
      ? await db.user.findFirst({ where: { phone: data.phone } })
      : null;
    const duplicateFields: Record<string, string> = {};
    if (existingEmailUser) duplicateFields.email = "Email is already registered.";
    if (existingPhoneUser) duplicateFields.phone = "Phone number is already registered.";
    if (existingEmailUser || existingPhoneUser) {
      return NextResponse.json(
        {
          error: "An account already exists with that email or phone.",
          fields: duplicateFields,
        },
        { status: 409 },
      );
    }
    const user = await db.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        phoneVerifiedAt: data.phone ? new Date() : null,
        passwordHash: await bcrypt.hash(data.password, 12),
        role: data.role,
      },
    });
    // Registration notifications and verification emails are dispatched in the background
    // so registration completes instantly and does not block or crash if SMTP is slow.
    enqueueBackgroundJob(
      "notifications.new_account",
      async () => {
        await notifyAdminsOfNewAccount(user);
      },
      { userId: user.id },
    );
    const raw = await createEmailVerificationToken(user.id);
    const userName =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.firstName || "there";
    enqueueBackgroundJob(
      "email.verification",
      () => sendEmailVerificationLink(user.email, raw, publicAppOrigin(request), userName),
      { userId: user.id },
    );
    const response = NextResponse.json(
      {
        success: true,
        redirect: `/verify?email=${encodeURIComponent(user.email)}`,
        email: user.email,
      },
      { status: 201 },
    );
    response.cookies.set(
      sessionCookie,
      await createSession({ userId: user.id, role: user.role }, { updateLastLogin: false }),
      sessionOptions,
    );
    response.cookies.set(phoneProofCookie, "", { ...phoneProofCookieOptions, maxAge: 0 });
    response.cookies.set("klick_skip_setup", "", { path: "/", maxAge: 0 });
    return response;
  }
  if (action === "login") {
    const parsed = credentials.safeParse(body);
    if (!parsed.success) return safe("Invalid email or password.", 401);
    const email = parsed.data.email.trim().toLowerCase();
    const user = await db.user.findUnique({ where: { email } });
    if (
      !user?.passwordHash ||
      !user.isActive ||
      !(await bcrypt.compare(parsed.data.password, user.passwordHash))
    )
      return safe("Invalid email or password.", 401);

    const isFirstLogin = !user.lastLoginAt;
    const skipSetupCookie = request.cookies.get("klick_skip_setup")?.value === "1";
    const hasClientProfile =
      user.role !== "CLIENT" ||
      Boolean(
        await db.clientProfile.findFirst({ where: { userId: user.id }, select: { id: true } }),
      );
    const nextRedirect = getAuthRedirect(user, hasClientProfile, skipSetupCookie);

    if (!user.emailVerifiedAt) {
      const response = NextResponse.json(
        {
          error: "EMAIL_NOT_VERIFIED",
          message: "Please verify your email before signing in.",
          redirect: "/verify",
        },
        { status: 403 },
      );
      return response;
    }

    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      }),
      ...(isFirstLogin
        ? [
            db.userNotification.create({
              data: {
                userId: user.id,
                type: user.role === "PROFESSIONAL" ? "WELCOME_PROFESSIONAL" : "WELCOME_CLIENT",
                title:
                  user.role === "PROFESSIONAL"
                    ? "Welcome to your professional dashboard"
                    : "Welcome to Klick-Pro",
                description:
                  user.role === "PROFESSIONAL"
                    ? "Your profile is ready. Update your setup and start getting matched with clients."
                    : "Your account is ready. Start exploring professionals or post your first project.",
                href: user.role === "PROFESSIONAL" ? "/professional-home" : "/dashboard",
              },
            }),
          ]
        : []),
    ]);

    clearRateLimit(rateLimitKey);
    const sessionToken = await createSession({ userId: user.id, role: user.role });
    const response = NextResponse.json({
      success: true,
      redirect: nextRedirect,
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
    response.cookies.set(sessionCookie, sessionToken, sessionOptions);
    return response;
  }
  if (action === "send-phone-login-otp") {
    const parsed = z
      .object({ phone: z.string().min(7).max(25) })
      .refine((value) => isValidInternationalPhoneNumber(value.phone), {
        path: ["phone"],
        message: "Enter a valid phone number.",
      })
      .safeParse(body);
    if (!parsed.success) return safe("Enter a valid phone number.");
    const user = await db.user.findFirst({
      where: { phone: parsed.data.phone.trim(), isActive: true },
      select: { role: true },
    });
    if (!user || (user.role !== "CLIENT" && user.role !== "PROFESSIONAL"))
      return safe("No active account was found with this phone number.", 404);
    const result = await requestPhoneOtp(parsed.data.phone, user.role);
    if (!result.ok) return safe(result.error, result.status);
    return NextResponse.json({
      success: true,
    });
  }
  if (action === "login-phone") {
    const parsed = z
      .object({ phone: z.string().min(7).max(25), code: z.string().min(1).max(20) })
      .refine((value) => isValidInternationalPhoneNumber(value.phone), {
        path: ["phone"],
        message: "Enter a valid phone number.",
      })
      .safeParse(body);
    if (!parsed.success) return safe("Enter a valid phone number and code.", 401);
    const user = await db.user.findFirst({
      where: { phone: parsed.data.phone.trim(), isActive: true },
    });
    if (!user || (user.role !== "CLIENT" && user.role !== "PROFESSIONAL"))
      return safe("Invalid phone number or verification code.", 401);
    const result = await verifyPhoneOtp(parsed.data.phone, parsed.data.code, user.role);
    if (!result.ok) return safe(result.error, result.status);
    const skipSetupCookie = request.cookies.get("klick_skip_setup")?.value === "1";
    const hasClientProfile =
      user.role !== "CLIENT" ||
      Boolean(
        await db.clientProfile.findFirst({ where: { userId: user.id }, select: { id: true } }),
      );
    const nextRedirect = getAuthRedirect(user, hasClientProfile, skipSetupCookie);
    if (!user.emailVerifiedAt)
      return NextResponse.json(
        {
          error: "EMAIL_NOT_VERIFIED",
          message: "Please verify your email before signing in.",
          redirect: "/verify",
        },
        { status: 403 },
      );
    const response = NextResponse.json({ success: true, redirect: nextRedirect });
    response.cookies.set(
      sessionCookie,
      await createSession({ userId: user.id, role: user.role }),
      sessionOptions,
    );
    return response;
  }
  if (action === "login-phone-password") {
    const parsed = z
      .object({ phone: z.string().min(7).max(25), password: z.string().min(1) })
      .refine((value) => isValidInternationalPhoneNumber(value.phone), {
        path: ["phone"],
        message: "Enter a valid phone number.",
      })
      .safeParse(body);
    if (!parsed.success) return safe("Enter a valid phone number and password.", 401);
    const user = await db.user.findFirst({
      where: { phone: parsed.data.phone.trim(), isActive: true },
    });
    if (
      !user ||
      (user.role !== "CLIENT" && user.role !== "PROFESSIONAL") ||
      !user.passwordHash ||
      !(await bcrypt.compare(parsed.data.password, user.passwordHash))
    )
      return safe("Invalid phone number or password.", 401);
    const skipSetupCookie = request.cookies.get("klick_skip_setup")?.value === "1";
    const hasClientProfile =
      user.role !== "CLIENT" ||
      Boolean(
        await db.clientProfile.findFirst({ where: { userId: user.id }, select: { id: true } }),
      );
    const nextRedirect = getAuthRedirect(user, hasClientProfile, skipSetupCookie);
    const response = NextResponse.json(
      !user.emailVerifiedAt
        ? {
            error:
              "You are registered, but your email is not confirmed. Please confirm your email before continuing.",
            redirect: nextRedirect,
          }
        : { success: true, redirect: nextRedirect },
      !user.emailVerifiedAt ? { status: 403 } : undefined,
    );
    response.cookies.set(
      sessionCookie,
      await createSession({ userId: user.id, role: user.role }),
      sessionOptions,
    );
    return response;
  }
  if (action === "logout") {
    const token = request.cookies.get(sessionCookie)?.value;
    if (token) {
      try {
        await revokeSession(token);
      } catch {
        return safe("Unable to sign out right now.", 500);
      }
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set(sessionCookie, "", { ...sessionOptions, maxAge: 0 });
    return response;
  }
  if (action === "update-email") {
    const parsed = z.object({ email: z.string().email() }).safeParse(body);
    if (!parsed.success) return safe("Enter a valid email address.");
    const token = request.cookies.get(sessionCookie)?.value;
    if (!token) return safe("Please sign in again.", 401);
    try {
      const session = await verifySession(token);
      const user = await db.user.findUniqueOrThrow({ where: { id: session.userId } });
      const existingEmailUser = await db.user.findUnique({ where: { email: parsed.data.email } });
      if (existingEmailUser && existingEmailUser.id !== user.id) {
        return NextResponse.json(
          {
            error: "This email address is already registered.",
            fields: { email: "Email is already registered." },
          },
          { status: 409 },
        );
      }
      const raw = randomBytes(32).toString("hex");
      await db.$transaction([
        db.apiToken.updateMany({
          where: {
            userId: user.id,
            kind: "EMAIL_VERIFICATION",
            usedAt: null,
          },
          data: { usedAt: new Date() },
        }),
        db.user.update({
          where: { id: user.id },
          data: { email: parsed.data.email, emailVerifiedAt: null },
        }),
        db.apiToken.create({
          data: {
            userId: user.id,
            tokenHash: tokenHash(raw),
            kind: "EMAIL_VERIFICATION",
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // strictly 10 minutes
          },
        }),
      ]);
      const userName =
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
        user.firstName ||
        "there";
      await sendEmailVerificationLink(parsed.data.email, raw, publicAppOrigin(request), userName);
      return NextResponse.json({
        success: true,
        message: "Email updated. A new confirmation link has been sent.",
        email: parsed.data.email,
      });
    } catch {
      return safe("Unable to update your email.", 500);
    }
  }

  if (action === "resend-verification") {
    const token = request.cookies.get(sessionCookie)?.value;
    let targetUser: {
      id: number;
      email: string;
      firstName: string | null;
      lastName: string | null;
      emailVerifiedAt: Date | null;
    } | null = null;
    if (token) {
      try {
        const session = await verifySession(token);
        targetUser = await db.user.findUnique({
          where: { id: session.userId },
          select: { id: true, email: true, firstName: true, lastName: true, emailVerifiedAt: true },
        });
      } catch {
        // Fall back to body.email below
      }
    }
    if (
      !targetUser &&
      typeof body === "object" &&
      body !== null &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      const email = body.email.trim().toLowerCase();
      targetUser = await db.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: { id: true, email: true, firstName: true, lastName: true, emailVerifiedAt: true },
      });
    }
    if (!targetUser) return safe("Please sign in or enter your registered email.", 401);
    try {
      if (targetUser.emailVerifiedAt) return NextResponse.json({ success: true });

      // 1. Enforce 60-second cooldown between resends
      const latestToken = await db.apiToken.findFirst({
        where: {
          userId: targetUser.id,
          kind: "EMAIL_VERIFICATION",
        },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      });

      if (latestToken) {
        const elapsedMs = Date.now() - latestToken.createdAt.getTime();
        if (elapsedMs < 60_000) {
          const retryAfterSec = Math.ceil((60_000 - elapsedMs) / 1000);
          return NextResponse.json(
            {
              error: `Please wait ${retryAfterSec} second${retryAfterSec === 1 ? "" : "s"} before requesting another verification link.`,
              retryAfter: retryAfterSec,
            },
            { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
          );
        }
      }

      // 2. Cap requests at 5 per email per hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const hourlyCount = await db.apiToken.count({
        where: {
          userId: targetUser.id,
          kind: "EMAIL_VERIFICATION",
          createdAt: { gte: oneHourAgo },
        },
      });

      if (hourlyCount >= 5) {
        return NextResponse.json(
          {
            error: "Too many verification link requests. You can request up to 5 links per hour. Please check your spam folder or try again later.",
          },
          { status: 429 },
        );
      }

      const raw = await createEmailVerificationToken(targetUser.id);
      const userName =
        [targetUser.firstName, targetUser.lastName].filter(Boolean).join(" ").trim() ||
        targetUser.firstName ||
        "there";
      enqueueBackgroundJob(
        "email.verification.resend",
        () => sendEmailVerificationLink(targetUser!.email, raw, publicAppOrigin(request), userName),
        { userId: targetUser.id },
      );
      return NextResponse.json({
        success: true,
        message: "A new verification link has been sent to your email.",
      });
    } catch {
      return safe("Unable to send a new verification code.", 500);
    }
  }
  if (action === "forgot-password") {
    const parsed = z.object({ email: z.string().email() }).safeParse(body);
    if (!parsed.success) return safe("Please enter a valid email address.", 400);
    const email = parsed.data.email.trim().toLowerCase();
    const user = await db.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (!user) {
      return NextResponse.json({ error: "Your email is not registered." }, { status: 404 });
    }
    const raw = randomBytes(32).toString("hex");
    await db.apiToken.create({
      data: {
        userId: user.id,
        tokenHash: tokenHash(raw),
        kind: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + 3600000),
      },
    });
    const userName =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.firstName || "there";
    const appOrigin = publicAppOrigin(request);
    const resetUrl = `${appOrigin}/reset-password?token=${encodeURIComponent(raw)}`;
    enqueueBackgroundJob(
      "email.password-reset",
      () =>
        sendAuthEmail(
          user.email,
          "Reset your Klick-Pro account password",
          "Password Reset Request",
          resetUrl,
          "Reset My Password",
          {
            templateKey: "auth_password_reset",
            userName,
            appOrigin,
            variables: {
              user_name: userName,
              reset_token: raw,
            },
          },
        ),
      { userId: user.id },
    );
    return NextResponse.json({ success: true, message: "Reset link sent to your email." });
  }
  if (action === "forgot-password-phone") {
    const parsed = z.object({ phone: z.string().min(7).max(25) }).safeParse(body);
    if (!parsed.success) return safe("Enter a valid phone number.", 400);
    const phone = parsed.data.phone.trim();
    if (!rateLimit(`forgot-password-phone:${clientKey(request)}:${phone}`, 3, 10 * 60_000))
      return safe("Too many code requests. Please try again later.", 429);
    const user = await db.user.findFirst({ where: { phone, isActive: true } });
    if (!user || (user.role !== "CLIENT" && user.role !== "PROFESSIONAL")) {
      return safe("Your phone number is not registered.", 404);
    }
    const result = await requestPhoneOtp(phone, user.role);
    if (!result.ok) return safe(result.error, result.status);
    return NextResponse.json({
      success: true,
      message: "Verification code sent to your phone.",
    });
  }
  if (action === "verify-forgot-password-phone") {
    const parsed = z
      .object({ phone: z.string().min(7).max(25), code: z.string().min(1).max(20) })
      .safeParse(body);
    if (!parsed.success) return safe("Enter a valid phone number and code.");
    const phone = parsed.data.phone.trim();
    if (!rateLimit(`verify-forgot-password-phone:${clientKey(request)}:${phone}`, 100, 10 * 60_000))
      return safe("Too many verification attempts. Please try again later.", 429);
    const user = await db.user.findFirst({ where: { phone, isActive: true } });
    if (!user || (user.role !== "CLIENT" && user.role !== "PROFESSIONAL"))
      return safe("That verification code is invalid or has expired.");
    const result = await verifyPhoneOtp(phone, parsed.data.code, user.role);
    if (!result.ok) return safe(result.error, result.status);
    const raw = randomBytes(32).toString("hex");
    await db.apiToken.create({
      data: {
        userId: user.id,
        tokenHash: tokenHash(raw),
        kind: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
    return NextResponse.json({ success: true, token: raw });
  }
  if (action === "verify-email") {
    try {
      const parsed = z
        .object({
          token: z.string().min(32),
          redirect: z.string().optional(),
        })
        .safeParse(body);
      if (!parsed.success) return safe("This verification link is invalid or has expired.");

      const hashed = tokenHash(parsed.data.token);

      // Atomic single-use burn: update usedAt only if not already consumed and not expired
      const updated = await db.apiToken.updateMany({
        where: {
          tokenHash: hashed,
          kind: "EMAIL_VERIFICATION",
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { usedAt: new Date() },
      });

      if (updated.count === 0) {
        return safe("This verification link is invalid or has expired.", 400);
      }

      const tokenRecord = await db.apiToken.findUnique({
        where: { tokenHash: hashed },
        select: { userId: true },
      });

      if (!tokenRecord) {
        return safe("This verification link is invalid or has expired.", 400);
      }

      const user = await db.user.update({
        where: { id: tokenRecord.userId },
        data: { emailVerifiedAt: new Date() },
      });

      const skipSetupCookie = request.cookies.get("klick_skip_setup")?.value === "1";
      const hasClientProfile =
        user.role !== "CLIENT" ||
        Boolean(
          await db.clientProfile.findFirst({ where: { userId: user.id }, select: { id: true } }),
        );
      const defaultRedirect = getAuthRedirect(
        { ...user, emailVerifiedAt: new Date() },
        hasClientProfile,
        skipSetupCookie,
      );

      // Enforce safe redirects via allowlist
      const safeRedirect = getSafeRedirectUrl(
        parsed.data.redirect,
        defaultRedirect,
        user.role,
      );

      const response = NextResponse.json({
        success: true,
        redirect: safeRedirect,
      });
      response.cookies.set(
        sessionCookie,
        await createSession({ userId: user.id, role: user.role }, { updateLastLogin: false }),
        sessionOptions,
      );
      return response;
    } catch (error) {
      logServerError("auth.email_verification.failed", error);
      return safe("Unable to verify your email right now. Please request a new link.", 500);
    }
  }
  if (action === "reset-password") {
    const parsed = z
      .object({ token: z.string().min(32), password: passwordSchema })
      .safeParse(body);
    if (!parsed.success) {
      const tokenValid = z.string().min(32).safeParse(body?.token).success;
      return safe(
        tokenValid
          ? "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number."
          : "Invalid or expired link.",
      );
    }
    const token = await db.apiToken.findFirst({
      where: {
        tokenHash: tokenHash(parsed.data.token),
        kind: "PASSWORD_RESET",
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (!token) return safe("Invalid or expired link.");
    await db.$transaction([
      db.apiToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
      db.user.update({
        where: { id: token.userId },
        data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) },
      }),
      db.session.updateMany({
        where: { userId: token.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return NextResponse.json({ success: true });
  }
  return safe("Not found", 404);
}
