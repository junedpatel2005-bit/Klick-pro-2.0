const EMAIL_FORMAT_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

/**
 * Validates that an email address matches standard format rules without
 * spaces, consecutive dots, invalid labels, or missing alphabetic TLDs.
 */
export function isValidEmailFormat(rawEmail: string): boolean {
  const email = rawEmail.trim();
  if (!email || email.length > 254) return false;
  if (!EMAIL_FORMAT_REGEX.test(email)) return false;

  const atIndex = email.indexOf("@");
  if (atIndex <= 0 || atIndex !== email.lastIndexOf("@")) return false;

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (local.length > 64 || domain.length > 253) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (domain.includes("..")) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;
  if (labels.some((label) => !label || label.length > 63 || label.startsWith("-") || label.endsWith("-"))) {
    return false;
  }

  const tld = labels[labels.length - 1] ?? "";
  return /^[a-zA-Z]{2,24}$/.test(tld);
}
