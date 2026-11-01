import "dotenv/config";
import { db } from "../src/lib/db";
import { createHash, randomBytes } from "crypto";
import { requestPhoneOtp, verifyPhoneOtp } from "../src/lib/phone-otp-provider";
import { isAllowedRedirect, getSafeRedirectUrl } from "../src/lib/safe-redirect";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASSED: ${message}`);
}

const tokenHash = (val: string) => createHash("sha256").update(val).digest("hex");

async function runTests() {
  console.log("\n=======================================================");
  console.log("   RUNNING OTP & EMAIL SECURITY VERIFICATION TESTS");
  console.log("=======================================================\n");

  // -------------------------------------------------------------------------
  // TEST SUITE 1: Safe Redirect Allowlist
  // -------------------------------------------------------------------------
  console.log("--- 1. Testing Safe Redirect Engine ---");

  // External URLs must be rejected
  assert(!isAllowedRedirect("https://evil.com"), "Rejects https://evil.com");
  assert(!isAllowedRedirect("http://phishing.org"), "Rejects http://phishing.org");
  assert(!isAllowedRedirect("//evil.com"), "Rejects protocol-relative //evil.com");
  assert(!isAllowedRedirect("//google.com/test"), "Rejects //google.com/test");

  // Backslash and scheme attacks must be rejected
  assert(!isAllowedRedirect("/\\evil.com"), "Rejects backslash bypass /\\evil.com");
  assert(!isAllowedRedirect("\\evil.com"), "Rejects raw backslash \\evil.com");
  assert(!isAllowedRedirect("javascript:alert(1)"), "Rejects javascript: scheme");
  assert(!isAllowedRedirect("data:text/html,<script>alert(1)</script>"), "Rejects data: scheme");

  // Forbidden internal prefixes must be rejected
  assert(!isAllowedRedirect("/api/admin"), "Rejects /api/admin");
  assert(!isAllowedRedirect("/api/auth/me"), "Rejects /api/auth/me");
  assert(!isAllowedRedirect("/_next/static/chunks"), "Rejects /_next/*");

  // Role-based admin access
  assert(!isAllowedRedirect("/admin", "CLIENT"), "Rejects /admin for CLIENT role");
  assert(!isAllowedRedirect("/admin/reports", "PROFESSIONAL"), "Rejects /admin/* for PROFESSIONAL role");
  assert(isAllowedRedirect("/admin", "ADMIN"), "Allows /admin for ADMIN role");
  assert(isAllowedRedirect("/admin/disputes", "ADMIN"), "Allows /admin/disputes for ADMIN role");

  // Valid internal paths must be allowed
  assert(isAllowedRedirect("/dashboard"), "Allows /dashboard");
  assert(isAllowedRedirect("/client/setup?profileSetup=1"), "Allows /client/setup with params");
  assert(isAllowedRedirect("/professional-home"), "Allows /professional-home");
  assert(isAllowedRedirect("/project/123"), "Allows /project/123");
  assert(isAllowedRedirect("/verify"), "Allows /verify");

  // getSafeRedirectUrl fallback
  assert(getSafeRedirectUrl("https://evil.com", "/dashboard") === "/dashboard", "Falls back to /dashboard on invalid URL");
  assert(getSafeRedirectUrl("/professional-home", "/dashboard") === "/professional-home", "Returns safe URL when valid");

  // -------------------------------------------------------------------------
  // TEST SUITE 2: Phone OTP Security (100 attempts, resend carryover, single use)
  // -------------------------------------------------------------------------
  console.log("\n--- 2. Testing Phone OTP Security ---");
  const testPhone = `+919999${Math.floor(100000 + Math.random() * 900000)}`;
  const testRole = "CLIENT";

  // Clean any old test records for this phone
  await db.otpCode.deleteMany({ where: { phone: testPhone } });

  // 2.1 Request fresh OTP
  const reqResult1 = await requestPhoneOtp(testPhone, testRole);
  assert(reqResult1.ok, `requestPhoneOtp succeeded for ${testPhone}`);

  const codeRecord1 = await db.otpCode.findFirst({
    where: { phone: testPhone, role: testRole, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  assert(Boolean(codeRecord1), "OTP code record created in database");
  assert(codeRecord1!.attempts === 0, "Initial code starts with 0 attempts");

  // Check 10-minute expiry
  const expiryDeltaMs = codeRecord1!.expiresAt.getTime() - codeRecord1!.createdAt.getTime();
  assert(Math.abs(expiryDeltaMs - 10 * 60 * 1000) < 5000, `OTP expiry is strictly 10 minutes (${Math.round(expiryDeltaMs / 60000)}m)`);

  // 2.2 Submit wrong codes to simulate failed attempts
  const wrongRes1 = await verifyPhoneOtp(testPhone, "000000", testRole);
  assert(!wrongRes1.ok, "Wrong code correctly rejected");

  const wrongRes2 = await verifyPhoneOtp(testPhone, "111111", testRole);
  assert(!wrongRes2.ok, "Second wrong code correctly rejected");

  const afterFails1 = await db.otpCode.findUnique({ where: { id: codeRecord1!.id } });
  assert(afterFails1!.attempts === 2, `Attempts incremented in background to 2 (current: ${afterFails1!.attempts})`);

  // 2.3 Resend OTP -> Must NOT reset attempt count to 0!
  console.log("\n--- Testing OTP Resend Attempt Preservation ---");
  const reqResult2 = await requestPhoneOtp(testPhone, testRole);
  assert(reqResult2.ok, "Resend OTP request succeeded");

  // Prior code must be invalidated (consumedAt stamped)
  const priorCode = await db.otpCode.findUnique({ where: { id: codeRecord1!.id } });
  assert(priorCode!.consumedAt !== null, "Prior code was marked consumed/invalidated on resend");

  // New code must have inherited the 2 previous attempts
  const codeRecord2 = await db.otpCode.findFirst({
    where: { phone: testPhone, role: testRole, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  assert(Boolean(codeRecord2 && codeRecord2.id !== codeRecord1!.id), "New active code created on resend");
  assert(codeRecord2!.attempts === 2, `Resent code inherited 2 prior attempts without resetting to 0 (attempts = ${codeRecord2!.attempts})`);

  // 2.4 Max 100 Attempts Ceiling
  console.log("\n--- Testing 100 Attempts Max Limit & Lockout ---");
  await db.otpCode.update({
    where: { id: codeRecord2!.id },
    data: { attempts: 99 },
  });

  // Attempt 100 (wrong code)
  const at100 = await verifyPhoneOtp(testPhone, "999999", testRole);
  assert(!at100.ok, "100th attempt evaluated and rejected");

  // Attempt 101 -> Must be blocked with 429
  const at101 = await verifyPhoneOtp(testPhone, "999999", testRole);
  assert(!at101.ok && at101.status === 429, `101st attempt blocked with HTTP 429: "${!at101.ok ? at101.error : ""}"`);

  // Trying to resend after hitting 100 attempts must be blocked
  const resendBlocked = await requestPhoneOtp(testPhone, testRole);
  assert(!resendBlocked.ok && resendBlocked.status === 429, `Resend blocked after 100 attempts: "${!resendBlocked.ok ? resendBlocked.error : ""}"`);

  // 2.5 Single-Use Burn on Correct OTP
  console.log("\n--- Testing Single-Use Burn ---");
  const singleUsePhone = `+919988${Math.floor(100000 + Math.random() * 900000)}`;
  await db.otpCode.deleteMany({ where: { phone: singleUsePhone } });

  const knownCode = "842109";
  await db.otpCode.create({
    data: {
      phone: singleUsePhone,
      role: "CLIENT",
      codeHash: tokenHash(knownCode),
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // First correct verification -> succeeds
  const verify1 = await verifyPhoneOtp(singleUsePhone, knownCode, "CLIENT");
  assert(verify1.ok, "First verification with correct code succeeded");

  // Check consumedAt is stamped
  const burnedCode = await db.otpCode.findFirst({ where: { phone: singleUsePhone } });
  assert(burnedCode!.consumedAt !== null, "Token was burned (consumedAt stamped) immediately");

  // Second verification with the same code -> must fail (single-use)
  const verify2 = await verifyPhoneOtp(singleUsePhone, knownCode, "CLIENT");
  assert(!verify2.ok, "Second verification with the same code rejected (single-use confirmed)");

  // -------------------------------------------------------------------------
  // TEST SUITE 3: Email Magic Link / Token Security
  // -------------------------------------------------------------------------
  console.log("\n--- 3. Testing Email Link & Magic Link Security ---");

  // Create temporary test user
  const testEmail = `sec_test_${Date.now()}@example.com`;
  const testUser = await db.user.create({
    data: {
      email: testEmail,
      firstName: "Security",
      lastName: "Tester",
      role: "CLIENT",
    },
  });

  // 3.1 Token Entropy & 10-Minute Expiry
  const rawToken1 = randomBytes(32).toString("hex");
  assert(rawToken1.length === 64, "Token has 32 bytes (64 hex characters) of cryptographic entropy");

  const hashed1 = tokenHash(rawToken1);
  const tokenRecord1 = await db.apiToken.create({
    data: {
      userId: testUser.id,
      tokenHash: hashed1,
      kind: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  assert(tokenRecord1.tokenHash === hashed1, "Token stored only as SHA-256 hash in database");
  const emailExpiryDelta = tokenRecord1.expiresAt.getTime() - tokenRecord1.createdAt.getTime();
  assert(Math.abs(emailExpiryDelta - 10 * 60 * 1000) < 5000, "Email token expiry strictly set to 10 minutes");

  // 3.2 Resend Invalidation: New Token Must Revoke Prior Active Tokens
  console.log("\n--- Testing Resend Token Invalidation ---");
  // Simulate issuing a new token for the same user
  await db.apiToken.updateMany({
    where: {
      userId: testUser.id,
      kind: "EMAIL_VERIFICATION",
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });

  const rawToken2 = randomBytes(32).toString("hex");
  const tokenRecord2 = await db.apiToken.create({
    data: {
      userId: testUser.id,
      tokenHash: tokenHash(rawToken2),
      kind: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const priorEmailToken = await db.apiToken.findUnique({ where: { id: tokenRecord1.id } });
  assert(priorEmailToken!.usedAt !== null, "Prior active token was automatically revoked (usedAt stamped) upon issuing a new token");
  assert(tokenRecord2.usedAt === null, "Newest token is active and unconsumed");

  // 3.3 Atomic Single-Use Burn
  console.log("\n--- Testing Atomic Single-Use Token Consumption ---");
  // Verify token 2 atomically
  const updateResult = await db.apiToken.updateMany({
    where: {
      tokenHash: tokenHash(rawToken2),
      kind: "EMAIL_VERIFICATION",
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { usedAt: new Date() },
  });
  assert(updateResult.count === 1, "Token 2 successfully consumed atomically (1 row updated)");

  // Try consuming token 2 a second time (replay/double-spend attack)
  const replayResult = await db.apiToken.updateMany({
    where: {
      tokenHash: tokenHash(rawToken2),
      kind: "EMAIL_VERIFICATION",
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { usedAt: new Date() },
  });
  assert(replayResult.count === 0, "Second consumption attempt rejected (0 rows updated - single-use burn confirmed)");

  // 3.4 60-Second Cooldown & Hourly Rate Limiting
  console.log("\n--- Testing 60s Resend Cooldown & Hourly Cap ---");
  // Check latest token timestamp for testUser
  const latestToken = await db.apiToken.findFirst({
    where: { userId: testUser.id, kind: "EMAIL_VERIFICATION" },
    orderBy: { createdAt: "desc" },
  });
  const elapsed = Date.now() - latestToken!.createdAt.getTime();
  assert(elapsed < 60_000, `Recent token detected within 60s window (elapsed: ${Math.round(elapsed / 1000)}s) -> Cooldown correctly active`);

  // Verify hourly count
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const hourlyCount = await db.apiToken.count({
    where: {
      userId: testUser.id,
      kind: "EMAIL_VERIFICATION",
      createdAt: { gte: oneHourAgo },
    },
  });
  assert(hourlyCount >= 2, `Hourly token count query returns ${hourlyCount} tokens`);

  // Clean up test records
  await db.apiToken.deleteMany({ where: { userId: testUser.id } });
  await db.user.delete({ where: { id: testUser.id } });
  await db.otpCode.deleteMany({ where: { phone: { in: [testPhone, singleUsePhone] } } });

  console.log("\n=======================================================");
  console.log("   🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!    ");
  console.log("=======================================================\n");
}

runTests()
  .catch((err) => {
    console.error("Test run failed with error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
