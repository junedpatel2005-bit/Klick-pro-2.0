import "server-only";

const ALLOWED_PREFIXES = [
  "/dashboard",
  "/client",
  "/professional",
  "/professional-home",
  "/admin",
  "/project",
  "/profile",
  "/verify",
  "/verify-email",
  "/marketplace",
  "/messages",
  "/wallet",
  "/settings",
  "/proposals",
  "/my-info",
] as const;

const FORBIDDEN_PREFIXES = ["/api", "/_next"] as const;

/**
 * Validates whether a requested redirect target is safely internal and in the allowlist.
 */
export function isAllowedRedirect(
  target: string | null | undefined,
  userRole?: string | null,
): boolean {
  if (!target || typeof target !== "string") return false;

  const trimmed = target.trim();
  if (!trimmed) return false;

  // Must strictly start with a single forward slash and not a protocol-relative double slash
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return false;

  // Block backslash bypass tricks (e.g. `/\evil.com` or `\/evil.com`)
  if (trimmed.includes("\\")) return false;

  // Block control characters and CR/LF
  if (/[\r\n\t\0]/.test(trimmed)) return false;

  // Block URLs with schemes like `http:`, `https:`, `javascript:`, `data:`
  if (/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return false;

  // Extract path without query parameters or hash
  const path = trimmed.split("?")[0]?.split("#")[0] ?? trimmed;

  // Block forbidden prefixes like `/api/*` or `/_next/*`
  if (FORBIDDEN_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return false;
  }

  // Protect admin paths: only allow `/admin` if the user role is specifically ADMIN
  if (path === "/admin" || path.startsWith("/admin/")) {
    if (userRole !== "ADMIN") return false;
  }

  // Check against allowed route prefixes
  return ALLOWED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/**
 * Returns the requested redirect URL if allowed, or falls back to a safe route.
 */
export function getSafeRedirectUrl(
  requestedUrl: string | null | undefined,
  fallbackUrl = "/dashboard",
  userRole?: string | null,
): string {
  if (isAllowedRedirect(requestedUrl, userRole)) {
    return requestedUrl!.trim();
  }
  return fallbackUrl;
}
