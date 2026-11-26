import { resolve4, resolve6, resolveMx } from "dns/promises";
import { isValidEmailFormat } from "@/lib/email-validation";

const CACHE_TTL_MS = 10 * 60 * 1000;
const DNS_TIMEOUT_MS = 2500;
const domainCache = new Map<string, { valid: boolean; expiresAt: number }>();

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("DNS_TIMEOUT")), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

function isMissingDomainError(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return code === "ENOTFOUND" || code === "ENODATA";
}

/**
 * Checks whether an email address domain can receive mail via DNS MX (or A/AAAA fallback).
 * Fails open on transient DNS/network errors so offline environments are not blocked.
 */
export async function hasValidEmailDomain(rawEmail: string): Promise<boolean> {
  if (!isValidEmailFormat(rawEmail)) return false;
  const domain = rawEmail.trim().split("@")[1]?.toLowerCase();
  if (!domain) return false;

  const cached = domainCache.get(domain);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.valid;
  }

  let valid = true;
  try {
    const mxRecords = await withTimeout(resolveMx(domain), DNS_TIMEOUT_MS);
    const activeMx = mxRecords.filter((record) => record.exchange && record.exchange !== ".");
    if (activeMx.length === 0) {
      valid = false;
    }
  } catch (mxErr) {
    if (isMissingDomainError(mxErr)) {
      const mxCode = (mxErr as { code?: string }).code;
      if (mxCode === "ENOTFOUND") {
        valid = false;
      } else {
        // RFC 5321 fallback: domain has no MX record; accept only if an A/AAAA record resolves.
        try {
          const ipv4 = await withTimeout(resolve4(domain), DNS_TIMEOUT_MS);
          valid = ipv4.length > 0;
        } catch (v4Err) {
          if (isMissingDomainError(v4Err)) {
            try {
              const ipv6 = await withTimeout(resolve6(domain), DNS_TIMEOUT_MS);
              valid = ipv6.length > 0;
            } catch (v6Err) {
              if (isMissingDomainError(v6Err)) valid = false;
            }
          }
        }
      }
    }
  }

  domainCache.set(domain, { valid, expiresAt: Date.now() + CACHE_TTL_MS });
  return valid;
}
