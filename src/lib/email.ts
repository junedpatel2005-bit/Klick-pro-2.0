import "server-only";
import nodemailer from "nodemailer";
import {
  getTemplateByKey,
  interpolateVariables,
  renderEmailHtml,
} from "@/lib/email-templates/engine";
import { capitalizeWords, capitalizeFirst } from "@/lib/utils";

let emailConfigurationWarningShown = false;

// One pooled SMTP connection for the whole process. Building a transport per
// message opened a fresh SMTP connection inside the HTTP response path.
const globalForMail = globalThis as typeof globalThis & {
  __servioMailTransporter?: nodemailer.Transporter;
};

function mailTransporter() {
  const port = Number(process.env.SMTP_PORT ?? 587);
  globalForMail.__servioMailTransporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });
  return globalForMail.__servioMailTransporter;
}

function klickProSender() {
  const configuredSender = process.env.SMTP_FROM?.trim();
  if (!configuredSender) return configuredSender;
  const address = configuredSender.match(/<([^<>]+)>/)?.[1] ?? configuredSender;
  return `Klick-Pro <${address}>`;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ??
      character,
  );
}

function publicAppOrigin() {
  const configured = process.env.APP_URL?.trim();
  if (!configured) return null;
  try {
    return new URL(configured).origin;
  } catch {
    return null;
  }
}

function absoluteAppUrl(path: string | undefined, origin: string | null) {
  if (!path || !origin) return path;
  try {
    return new URL(path, origin).toString();
  } catch {
    return path;
  }
}

export type SendAuthEmailOptions = {
  templateKey?: string;
  userName?: string;
  variables?: Record<string, string | number | undefined | null>;
  appOrigin?: string;
};

export async function sendAuthEmail(
  to: string,
  subject: string,
  heading: string,
  actionUrl: string,
  action: string,
  options?: SendAuthEmailOptions,
) {
  const transporter = mailTransporter();
  const websiteUrl = options?.appOrigin || publicAppOrigin() || undefined;

  // Determine template key (explicitly passed or auto-detected)
  let templateKey = options?.templateKey;
  if (!templateKey) {
    if (
      actionUrl.includes("reset-password") ||
      heading.toLowerCase().includes("reset") ||
      subject.toLowerCase().includes("reset")
    ) {
      templateKey = "auth_password_reset";
    } else if (
      actionUrl.includes("verify-email") ||
      heading.toLowerCase().includes("verify") ||
      subject.toLowerCase().includes("verify")
    ) {
      templateKey = "auth_email_verification";
    }
  }

  // Extract token from actionUrl if present
  let urlToken = "";
  try {
    const parsed = new URL(actionUrl, websiteUrl || "https://klick-pro.com");
    urlToken = parsed.searchParams.get("token") || "";
  } catch {
    // Ignore URL parse errors
  }

  const userName = options?.userName || "there";

  const mergedVariables: Record<string, string | number | undefined | null> = {
    user_name: userName,
    email: to,
    user_email: to,
    reset_token: urlToken,
    verification_token: urlToken,
    token: urlToken,
    action_url: actionUrl,
    website_url: websiteUrl || "https://klick-pro.com",
    support_email: "support@klick-pro.com",
    ...options?.variables,
  };

  if (templateKey) {
    try {
      const template = await getTemplateByKey(templateKey);
      if (template && template.isActive) {
        const resolvedSubject = interpolateVariables(template.subject, mergedVariables);
        const resolvedHeading = interpolateVariables(template.heading, mergedVariables);
        let resolvedBody = interpolateVariables(template.bodyText, mergedVariables);
        // Rule 6: omit any commission/platform-fee lines from receipts if an override kept {{platform_fee}} with zero fee
        const rawFee = String(mergedVariables.platform_fee ?? "").trim();
        if (!rawFee || rawFee === "₹0" || rawFee.toLowerCase().includes("zero fee")) {
          resolvedBody = resolvedBody
            .replace(/^.*(?:Platform Fee|Platform Commission):.*(?:\r?\n)?/gim, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
        }

        let resolvedActionUrl = actionUrl;
        if (template.actionUrl) {
          const interpolated = interpolateVariables(template.actionUrl, mergedVariables);
          resolvedActionUrl = absoluteAppUrl(interpolated, websiteUrl ?? null) || actionUrl;
        }

        const actionText = template.actionText || action || "Continue";

        const html = renderEmailHtml({
          subject: resolvedSubject,
          heading: resolvedHeading,
          bodyText: resolvedBody,
          actionText,
          actionUrl: resolvedActionUrl,
          websiteUrl,
        });

        await transporter.sendMail({
          from: klickProSender(),
          to,
          subject: resolvedSubject.startsWith("Klick-Pro")
            ? resolvedSubject
            : `Klick-Pro | ${resolvedSubject}`,
          text: `${resolvedHeading}\n\n${resolvedBody}\n\n${actionText}: ${resolvedActionUrl}\n\nIf you did not request this, you can safely ignore this email.`,
          html,
        });
        return;
      }
    } catch (err) {
      console.warn(
        `Template dispatch for auth email ${templateKey} failed, falling back to standard layout`,
        err,
      );
    }
  }

  // Modern fallback if no template is found or template disabled
  const safeHeading = heading || subject;
  const fallbackBody = `Use the secure link below to proceed with your request. This security link expires in 60 minutes.\n\nIf you did not make this request, you can safely ignore this email.`;
  const fallbackHtml = renderEmailHtml({
    subject,
    heading: safeHeading,
    bodyText: fallbackBody,
    actionText: action,
    actionUrl,
    websiteUrl,
  });

  await transporter.sendMail({
    from: klickProSender(),
    to,
    subject: subject.startsWith("Klick-Pro") ? subject : `Klick-Pro | ${subject}`,
    text: `${safeHeading}\n\n${fallbackBody}\n\n${action}: ${actionUrl}`,
    html: fallbackHtml,
  });
}

export function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_FROM,
  );
}

const NOTIFICATION_TYPE_MAP: Record<string, string> = {
  CLIENT_WELCOME: "client_welcome",
  JOB_POSTED: "client_job_posted",
  NEW_PROPOSAL: "client_proposal_received",
  PROPOSAL_RECEIVED: "client_proposal_received",
  PROPOSAL_UPDATED: "client_proposal_received",
  REQUEST_COUNTERED: "client_proposal_received",
  MILESTONE_SUBMITTED: "client_milestone_submitted",
  DISPUTE_RAISED: "client_dispute_opened",
  DISPUTE_OPENED: "client_dispute_opened",
  DISPUTE_CONTESTED: "client_dispute_opened",
  DISPUTE_RESOLVED: "client_dispute_resolved",
  DISPUTE_DECIDED: "client_dispute_resolved",
  REFUND_PROCESSED: "client_refund_processed",
  WALLET_TOPUP_RECEIPT: "wallet_topup_receipt",
  WITHDRAWAL_REQUESTED: "withdrawal_requested_receipt",
  WITHDRAWAL_COMPLETED: "withdrawal_completed_receipt",
  PAYOUT_COMPLETED: "withdrawal_completed_receipt",
  WITHDRAWAL_FAILED: "withdrawal_failed_notice",
  PAYOUT_FAILED: "withdrawal_failed_notice",
  PAYOUT_REVERSED: "withdrawal_failed_notice",
  CLIENT_MILESTONE_RECEIPT: "client_milestone_receipt",
  PROF_WELCOME: "prof_welcome",
  WELCOME_PROFESSIONAL: "prof_welcome",
  WELCOME_CLIENT: "client_welcome",
  VERIFICATION_APPROVED: "prof_verification_approved",
  VERIFICATION_REJECTED: "prof_verification_rejected",
  JOB_MATCH: "prof_job_match",
  NEW_JOB: "prof_job_match",
  NEW_JOB_POSTED: "prof_job_match",
  NEW_HIRE_REQUEST: "prof_job_match",
  REVISION_REQUESTED: "prof_revision_requested",
  MILESTONE_REVISION_REQUESTED: "prof_revision_requested",
  PROPOSAL_ACCEPTED: "prof_proposal_accepted",
  REQUEST_ACCEPTED: "prof_proposal_accepted",
  MILESTONE_FUNDED: "prof_milestone_funded",
  WALLET_MILESTONE_FUNDED: "prof_milestone_funded",
  PAYOUT_RELEASED: "prof_payout_released",
  MILESTONE_PAYOUT_APPROVED: "prof_payout_released",
  PROF_DISPUTE_OPENED: "prof_dispute_opened",
  PASSWORD_RESET: "auth_password_reset",
  EMAIL_VERIFICATION: "auth_email_verification",
};

export function resolveNotificationTemplate(
  type?: string,
  audience?: "CLIENT" | "PROFESSIONAL" | "ADMIN" | "SYSTEM",
): string | undefined {
  if (!type) return undefined;
  const isProf = audience === "PROFESSIONAL";
  const isAdmin = audience === "ADMIN";

  if (type.startsWith("PROJECT_ACTIVITY_")) {
    if (type.includes("REVISION_REQUESTED")) {
      return isProf ? "prof_revision_requested" : "client_milestone_submitted";
    }
    if (type.includes("MILESTONE") || type.includes("DELIVERABLE") || type.includes("WORK")) {
      return "client_milestone_submitted";
    }
    if (type.includes("DISPUTE")) {
      return isProf ? "prof_dispute_opened" : "client_dispute_opened";
    }
    if (type.includes("PAYOUT") || type.includes("PAYMENT")) {
      return isProf ? "prof_payout_released" : "client_milestone_receipt";
    }
    return isProf ? "prof_proposal_accepted" : "client_milestone_submitted";
  }

  switch (type) {
    case "WELCOME_CLIENT":
    case "CLIENT_WELCOME":
      return "client_welcome";
    case "WELCOME_PROFESSIONAL":
    case "PROF_WELCOME":
      return "prof_welcome";
    case "NEW_ACCOUNT":
      // Admin new-registration notices render the structured admin summary layout instead of user welcome copy.
      if (isAdmin) return undefined;
      return isProf ? "prof_welcome" : "client_welcome";
    case "JOB_POSTED":
      return "client_job_posted";
    case "JOB_MATCH":
    case "NEW_JOB":
    case "NEW_JOB_POSTED":
    case "NEW_HIRE_REQUEST":
      return "prof_job_match";
    case "REVISION_REQUESTED":
    case "MILESTONE_REVISION_REQUESTED":
      return "prof_revision_requested";
    case "NEW_PROPOSAL":
    case "PROPOSAL_RECEIVED":
    case "PROPOSAL_UPDATED":
    case "REQUEST_COUNTERED":
      return "client_proposal_received";
    case "PROPOSAL_ACCEPTED":
    case "REQUEST_ACCEPTED":
      return isProf ? "prof_proposal_accepted" : "client_milestone_receipt";
    case "REQUEST_DECLINED":
      return "client_job_posted";
    case "MILESTONE_SUBMITTED":
    case "PROJECT_COMPLETED":
    case "PROJECT_REOPENED":
    case "PROJECT_REOPEN_REQUESTED":
    case "PROJECT_REQUEST":
      return isProf ? "prof_proposal_accepted" : "client_milestone_submitted";
    case "MILESTONE_FUNDED":
    case "WALLET_MILESTONE_FUNDED":
      if (isAdmin) return undefined;
      return isProf ? "prof_milestone_funded" : "client_milestone_receipt";
    case "CLIENT_MILESTONE_RECEIPT":
      return "client_milestone_receipt";
    case "PAYOUT_RELEASED":
    case "MILESTONE_PAYOUT_APPROVED":
      return "prof_payout_released";
    case "WALLET_TOPUP_RECEIPT":
      return "wallet_topup_receipt";
    case "WITHDRAWAL_REQUESTED":
      return "withdrawal_requested_receipt";
    case "WITHDRAWAL_COMPLETED":
    case "PAYOUT_COMPLETED":
      return "withdrawal_completed_receipt";
    case "WITHDRAWAL_FAILED":
    case "PAYOUT_FAILED":
    case "PAYOUT_REVERSED":
      return "withdrawal_failed_notice";
    case "DISPUTE_RAISED":
    case "DISPUTE_OPENED":
    case "DISPUTE_CONTESTED":
      return isProf ? "prof_dispute_opened" : "client_dispute_opened";
    case "DISPUTE_UPDATED":
    case "DISPUTE_RESOLVED":
    case "DISPUTE_DECIDED":
      return "client_dispute_resolved";
    case "DISPUTE_MESSAGE":
      return isProf ? "prof_dispute_opened" : "client_dispute_opened";
    case "REFUND_PROCESSED":
      return "client_refund_processed";
    case "VERIFICATION_APPROVED":
      return "prof_verification_approved";
    case "VERIFICATION_REJECTED":
      return "prof_verification_rejected";
    case "PASSWORD_RESET":
      return "auth_password_reset";
    case "EMAIL_VERIFICATION":
      return "auth_email_verification";
    default:
      return NOTIFICATION_TYPE_MAP[type];
  }
}

export async function sendNotificationEmail(input: {
  to: string;
  title: string;
  description: string;
  href?: string;
  type?: string;
  details?: Array<{ label: string; value: string }>;
  templateKey?: string;
  templateVariables?: Record<string, string | number | undefined | null>;
  audience?: "CLIENT" | "PROFESSIONAL" | "ADMIN" | "SYSTEM";
  recipientName?: string;
}) {
  if (!isEmailConfigured()) {
    if (!emailConfigurationWarningShown) {
      emailConfigurationWarningShown = true;
      console.warn(
        "Email notifications are disabled. Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.",
      );
    }
    return;
  }
  const transporter = mailTransporter();
  const origin = publicAppOrigin();
  const websiteUrl = origin ?? undefined;
  const actionUrl = absoluteAppUrl(input.href, origin);

  const templateKey = input.templateKey || resolveNotificationTemplate(input.type, input.audience);

  // If a template key is supplied or resolved from notification type, attempt template-driven email dispatch
  if (templateKey) {
    try {
      const template = await getTemplateByKey(templateKey);
      if (template && template.isActive) {
        // Auto-extract semantic variables from input.details
        const detailVariables: Record<string, string> = {};
        if (input.details) {
          for (const d of input.details) {
            if (!d.label || !d.value) continue;
            const key = d.label
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "_")
              .replace(/^_+|_+$/g, "");
            detailVariables[key] = d.value;
            if (key === "project" || key === "project_name") {
              detailVariables["project_title"] = d.value;
              detailVariables["job_title"] = d.value;
            }
            if (key === "project_amount" || key === "proposed_amount" || key === "bid_amount" || key === "offered_amount") {
              detailVariables["bid_amount"] = d.value;
              detailVariables["amount"] = d.value;
              detailVariables["agreed_amount"] = d.value;
              detailVariables["budget"] = d.value;
              detailVariables["accepted_amount"] = d.value;
            }
            if (key === "professional") {
              detailVariables["professional_name"] = d.value;
              detailVariables["prof_name"] = d.value;
            }
            if (key === "client") {
              detailVariables["client_name"] = d.value;
            }
            if (key === "milestone") {
              detailVariables["milestone_title"] = d.value;
            }
            if (key === "milestone_amount") {
              detailVariables["milestone_amount"] = d.value;
              detailVariables["amount"] = d.value;
            }
            if (key === "project_timeline" || key === "delivery_time" || key === "timeline") {
              detailVariables["delivery_time"] = d.value;
              detailVariables["timeline"] = d.value;
            }
            if (key === "payout_credited") {
              detailVariables["payout_amount"] = d.value;
              detailVariables["amount"] = d.value;
            }
            if (key === "receipt_no") {
              detailVariables["receipt_no"] = d.value;
            }
            if (key === "utr" || key === "utr_reference") {
              detailVariables["utr"] = d.value;
            }
            if (key === "platform_commission") {
              detailVariables["platform_fee"] = d.value;
            }
          }
        }

        // Auto-extract project_id, job_id, dispute_id from href
        if (input.href) {
          const projectMatch = input.href.match(/\/project\/(\d+)/);
          if (projectMatch?.[1]) detailVariables["project_id"] = projectMatch[1];
          const jobMatch = input.href.match(/\/jobs?\/(\d+)/);
          if (jobMatch?.[1]) detailVariables["job_id"] = jobMatch[1];
          const disputeMatch = input.href.match(/dispute=(\d+)/);
          if (disputeMatch?.[1]) detailVariables["dispute_id"] = disputeMatch[1];
        }

        const recipientFallback = input.recipientName || "there";

        const mergedVariables: Record<string, string | number | undefined | null> = {
          client_name: input.recipientName || "Client",
          professional_name: input.recipientName || "Professional",
          prof_name: input.recipientName || "Professional",
          user_name: recipientFallback,
          project_title: detailVariables.project_title || input.title || "Project",
          job_title: detailVariables.job_title || input.title || "Job",
          milestone_title: detailVariables.milestone_title || "Project Milestone",
          milestone_amount:
            detailVariables.milestone_amount || detailVariables.amount || "Agreed Amount",
          amount: detailVariables.amount || "Agreed Amount",
          action_url: actionUrl ?? "",
          website_url: websiteUrl ?? "",
          title: input.title,
          description: input.description,
          ...detailVariables,
          ...input.templateVariables,
        };

        const resolvedSubject = interpolateVariables(template.subject, mergedVariables);
        const resolvedHeading = interpolateVariables(template.heading, mergedVariables);
        let resolvedBody = interpolateVariables(template.bodyText, mergedVariables);
        // Rule 6: omit any commission/platform-fee lines from receipts if an override kept {{platform_fee}} with zero fee
        const rawFee = String(mergedVariables.platform_fee ?? "").trim();
        if (!rawFee || rawFee === "₹0" || rawFee.toLowerCase().includes("zero fee")) {
          resolvedBody = resolvedBody
            .replace(/^.*(?:Platform Fee|Platform Commission):.*(?:\r?\n)?/gim, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
        }
        const resolvedActionUrl = template.actionUrl
          ? interpolateVariables(template.actionUrl, mergedVariables)
          : actionUrl;

        // Auto-generate Info Box details if not passed explicitly
        let effectiveDetails =
          input.details?.filter((d) => d && d.value && String(d.value).trim()) ?? [];

        if (effectiveDetails.length === 0 && template.variables?.length) {
          const nonInfoKeys = new Set([
            "client_name",
            "professional_name",
            "prof_name",
            "user_name",
            "support_email",
            "verification_token",
            "reset_token",
            "token",
            "action_url",
            "website_url",
            "title",
            "description",
          ]);
          effectiveDetails = template.variables
            .filter((v) => !nonInfoKeys.has(v.key))
            .map((v) => {
              const rawVal = mergedVariables[v.key];
              const valStr = rawVal !== undefined && rawVal !== null ? String(rawVal).trim() : "";
              return {
                label: v.label,
                value: valStr,
              };
            })
            .filter((d) => d.value.length > 0 && !d.value.startsWith("{{"));
        }

        const html = renderEmailHtml({
          subject: resolvedSubject,
          heading: resolvedHeading,
          bodyText: resolvedBody,
          actionText: template.actionText,
          actionUrl: resolvedActionUrl,
          websiteUrl,
          details: effectiveDetails,
        });

        await transporter.sendMail({
          from: klickProSender(),
          to: input.to,
          subject: resolvedSubject.startsWith("Klick-Pro")
            ? resolvedSubject
            : `Klick-Pro | ${resolvedSubject}`,
          text: `${resolvedHeading}\n\n${resolvedBody}${resolvedActionUrl ? `\n\n${template.actionText || "View in Klick-Pro"}: ${resolvedActionUrl}` : ""}`,
          html,
        });
        return;
      }
    } catch (err) {
      console.warn(
        `Template dispatch for ${input.templateKey} failed, falling back to standard notification layout`,
        err,
      );
    }
  }

  // Consistent modern fallback: renders with the exact same 600px responsive box & brand layout
  const fallbackDetails = input.details?.filter((detail) => detail.value.trim()) ?? [];
  const textDetails = fallbackDetails.length
    ? `\n\n${fallbackDetails.map((detail) => `${detail.label}: ${detail.value}`).join("\n")}`
    : "";
  const textDescription = `\n\n${input.description}`;
  const actionText = actionUrl ? `\n\nView in Klick-Pro: ${actionUrl}` : "";
  await transporter.sendMail({
    from: klickProSender(),
    to: input.to,
    subject: input.title.startsWith("Klick-Pro") ? input.title : `Klick-Pro | ${input.title}`,
    text: `${input.title}${textDescription}${textDetails}${actionText}`,
    html: renderEmailHtml({
      subject: input.title,
      heading: input.title,
      bodyText: input.description,
      actionText: actionUrl ? "View in Klick-Pro" : null,
      actionUrl,
      websiteUrl,
      details: fallbackDetails,
    }),
  });
}

export async function sendCustomEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  if (!isEmailConfigured()) {
    return { success: false, reason: "SMTP not configured" };
  }
  const transporter = mailTransporter();
  await transporter.sendMail({
    from: klickProSender(),
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    html: input.html,
    text: input.text || input.subject,
  });
  return { success: true };
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] || "U";
  const last = parts[parts.length - 1] || first;
  if (parts.length <= 1) {
    return first.slice(0, 2).toUpperCase();
  }
  return ((first[0] || "") + (last[0] || "")).toUpperCase();
}

function renderContactInquiryHtml(data: {
  contactId?: number | string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  topic?: string;
  subject: string;
  message: string;
  origin: string;
  adminEmail: string;
}): string {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone.trim()) : "";
  const safeRole = escapeHtml(data.role || "Client looking to hire");
  const safeTopic = escapeHtml(data.topic || "General Question");
  const safeSubject = escapeHtml(data.subject);
  const safeRef = data.contactId ? `#CR-${data.contactId}` : "#CR-NEW";
  const initials = getInitials(data.name);
  const safeOrigin = escapeHtml(data.origin);
  const supportUrl = `${data.origin.replace(/\/$/, "")}/admin/support`;
  const mailtoReply = `mailto:${encodeURIComponent(data.email)}?subject=Re:%20${encodeURIComponent(data.subject)}`;
  const telUrl = data.phone ? `tel:${data.phone.replace(/[^0-9+]/g, "")}` : "";

  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const messageHtml = data.message
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin: 0 0 14px 0; color: #1e293b; font-size: 15px; line-height: 1.65;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New Contact Lead: ${safeSubject}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    @media screen and (max-width: 600px) {
      .email-shell { width: 100% !important; border-radius: 0 !important; }
      .content-cell { padding: 20px 16px !important; }
      .header-cell { padding: 24px 20px !important; }
      .grid-stack { display: block !important; width: 100% !important; padding: 6px 0 !important; }
      .button-stack { display: block !important; width: 100% !important; margin-bottom: 10px !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; font-size: 1px; color: #ffffff;">
    New inquiry from ${safeName} (${safeEmail}) • Phone: ${safePhone || "Not provided"} • Topic: ${safeTopic}
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; width: 100%; margin: 0; padding: 32px 12px;">
    <tr>
      <td align="center" valign="top">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);" class="email-shell">
          
          <!-- BRAND & HEADER BANNER -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b1f4d 0%, #1748b5 60%, #2563eb 100%); padding: 32px 36px;" class="header-cell">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Klick<span style="color: #93c5fd;">-Pro</span></span>
                  </td>
                  <td align="right">
                    <span style="background: rgba(255, 255, 255, 0.2); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; padding: 5px 12px; border-radius: 9999px;">
                      NEW CONTACT LEAD
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 22px;">
                    <h1 style="margin: 0; font-size: 23px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                      New Customer Inquiry Received
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 14px; color: #bfdbfe; line-height: 1.5;">
                      A user submitted a message through the Klick-Pro website Contact Us form.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TIMESTAMP & REFERENCE BAR -->
          <tr>
            <td style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 12px 36px;" class="content-cell">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-size: 12px; font-weight: 600; color: #64748b;">
                    📅 ${formattedTime}
                  </td>
                  <td align="right" style="font-size: 12px; font-weight: 700; color: #1e40af;">
                    REF: ${safeRef}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN BODY -->
          <tr>
            <td style="padding: 28px 36px 20px;" class="content-cell">
              
              <!-- SENDER PROFILE CARD (FULL DETAILS) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px 22px;">
                    
                    <!-- User Avatar & Badges Header -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 14px;">
                      <tr>
                        <td width="48" valign="middle">
                          <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #1748b5 0%, #2563eb 100%); color: #ffffff; font-size: 16px; font-weight: 700; text-align: center; line-height: 44px; box-shadow: 0 2px 4px rgba(23, 72, 181, 0.25);">
                            ${initials}
                          </div>
                        </td>
                        <td valign="middle" style="padding-left: 14px;">
                          <div style="font-size: 18px; font-weight: 700; color: #0f172a; line-height: 1.2;">
                            ${safeName}
                          </div>
                          <div style="margin-top: 6px;">
                            <span style="display: inline-block; background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; margin-right: 6px;">
                              ${safeRole}
                            </span>
                            <span style="display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">
                              ${safeTopic}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <div style="height: 1px; background-color: #e2e8f0; margin: 12px 0 16px 0;"></div>

                    <!-- Contact Details 2-Column Grid -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td width="50%" valign="top" style="padding-right: 12px;" class="grid-stack">
                          <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                            ✉️ Email Address
                          </div>
                          <a href="mailto:${safeEmail}" style="font-size: 14px; font-weight: 600; color: #1748b5; text-decoration: none; word-break: break-all;">
                            ${safeEmail}
                          </a>
                        </td>
                        <td width="50%" valign="top" style="padding-left: 12px;" class="grid-stack">
                          <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                            📞 Phone Number
                          </div>
                          ${
                            safePhone
                              ? `<a href="${telUrl}" style="font-size: 14px; font-weight: 700; color: #059669; text-decoration: none;">${safePhone}</a>`
                              : `<span style="font-size: 14px; color: #94a3b8; font-style: italic;">Not provided</span>`
                          }
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- MESSAGE CONTENT CARD -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 28px;">
                <!-- Subject Header -->
                <tr>
                  <td style="background-color: #f1f5f9; padding: 12px 22px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">SUBJECT:</span>
                    <span style="font-size: 14px; font-weight: 700; color: #0f172a; margin-left: 6px;">${safeSubject}</span>
                  </td>
                </tr>
                <!-- Message Body -->
                <tr>
                  <td style="padding: 22px 22px 10px; background-color: #ffffff; border-left: 4px solid #1748b5;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                      MESSAGE CONTENT:
                    </div>
                    ${messageHtml}
                  </td>
                </tr>
              </table>

              <!-- QUICK ACTION BUTTONS -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 6px 8px;" class="button-stack">
                          <a href="${mailtoReply}" target="_blank" style="display: inline-block; background-color: #1748b5; color: #ffffff; font-size: 14px; font-weight: 700; padding: 13px 22px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(23, 72, 181, 0.3);">
                            ✉️ Reply to ${safeName.split(" ")[0]}
                          </a>
                        </td>
                        ${
                          safePhone
                            ? `
                        <td style="padding: 6px 8px;" class="button-stack">
                          <a href="${telUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 14px; font-weight: 700; padding: 13px 20px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.3);">
                            📞 Call ${safePhone}
                          </a>
                        </td>`
                            : ""
                        }
                        <td style="padding: 6px 8px;" class="button-stack">
                          <a href="${supportUrl}" target="_blank" style="display: inline-block; background-color: #f8fafc; color: #334155; border: 1px solid #cbd5e1; font-size: 14px; font-weight: 600; padding: 13px 18px; border-radius: 8px; text-decoration: none;">
                            Support Dashboard &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 36px; text-align: center;" class="content-cell">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                This notification was sent to <strong>${escapeHtml(data.adminEmail)}</strong> via the Klick-Pro Support System.
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                Confidential • Contains customer inquiry data • <a href="${safeOrigin}" style="color: #64748b; text-decoration: underline;">Klick-Pro Portal</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendContactInquiryNotification(input: {
  contactId?: number | string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  role?: string;
  topic?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || "junedpatel2005@gmail.com";
  if (!isEmailConfigured()) {
    console.warn("[Contact] Email notifications disabled or SMTP not configured.");
    return { success: false, reason: "SMTP not configured" };
  }

  const transporter = mailTransporter();
  const origin = publicAppOrigin() || "https://klick-pro.com";
  const formattedName = capitalizeWords(input.name) || input.name;
  const formattedSubject = capitalizeFirst(input.subject) || input.subject;

  const emailSubject = `New Contact Lead: ${formattedName} - ${formattedSubject}`;

  const html = renderContactInquiryHtml({
    contactId: input.contactId,
    name: formattedName,
    email: input.email,
    phone: input.phone,
    role: input.role,
    topic: input.topic,
    subject: formattedSubject,
    message: input.message,
    origin,
    adminEmail,
  });

  const text = `New Contact Form Lead\n\nReference: #CR-${input.contactId || "NEW"}\nSender Name: ${formattedName}\nRole: ${input.role || "Client"}\nTopic: ${input.topic || "General"}\nEmail: ${input.email}\nPhone: ${input.phone || "Not provided"}\nSubject: ${formattedSubject}\n\nMessage:\n${input.message}\n\nManage in Admin Support: ${origin}/admin/support`;

  await transporter.sendMail({
    from: klickProSender(),
    to: adminEmail,
    replyTo: `"${formattedName.replace(/"/g, "")}" <${input.email}>`,
    subject: emailSubject.startsWith("Klick-Pro") ? emailSubject : `Klick-Pro | ${emailSubject}`,
    text,
    html,
  });

  return { success: true };
}
