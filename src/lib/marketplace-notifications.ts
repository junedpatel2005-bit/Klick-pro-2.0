import "server-only";

import { db } from "@/lib/db";
import { logServerError } from "@/lib/server-logger";
import {
  emitRealtimeNotification,
  emitAdminNotification,
  emitAdminOverviewUpdate,
  emitAdminUsersUpdate,
  emitAdminOperationsUpdate,
  emitAdminVerificationsUpdate,
} from "@/lib/realtime";
import { sendNotificationEmail } from "@/lib/email";
import { sendSms, resolveSmsTemplate } from "@/lib/sms/engine";
import { enqueueBackgroundJob } from "@/lib/background-jobs";
import { maskDestinationString } from "@/lib/account-formatting";
import { formatReadableLabel } from "@/lib/utils";

type BroadcastNotification = {
  type: string;
  title: string;
  description: string;
  href: string;
  emailDetails?: Array<{ label: string; value: string }>;
  templateVariables?: Record<string, string | number | undefined | null>;
  transactional?: boolean;
};

function stripCurrencyPrefix(value: string | number | undefined | null): string | number | undefined | null {
  if (typeof value !== "string") return value;
  const cleaned = value.trim().replace(/^₹\s*/, "");
  return cleaned || value;
}

function formatIstTimestamp(date = new Date()): string {
  return `${new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date)} IST`;
}

async function sendEmails(
  recipients: Array<{
    id: number;
    email: string;
    emailNotificationsEnabled: boolean;
    firstName?: string | null;
    lastName?: string | null;
    role?: string | null;
  }>,
  notification: BroadcastNotification,
) {
  const results = await Promise.allSettled(
    recipients
      .filter(
        (recipient) =>
          (notification.transactional || recipient.emailNotificationsEnabled) &&
          recipient.email.trim(),
      )
      .map((recipient) => {
        const recipientName =
          [recipient.firstName, recipient.lastName].filter(Boolean).join(" ").trim() ||
          recipient.firstName ||
          "";

        return sendNotificationEmail({
          to: recipient.email.trim(),
          ...notification,
          details: notification.emailDetails,
          audience: (recipient.role as "CLIENT" | "PROFESSIONAL" | "ADMIN" | "SYSTEM") || undefined,
          recipientName: recipientName || undefined,
          templateVariables: {
            ...notification.templateVariables,
            user_name: recipientName || "there",
            client_name:
              recipient.role === "CLIENT"
                ? recipientName || "Client"
                : (notification.templateVariables?.client_name ?? "Client"),
            professional_name:
              recipient.role === "PROFESSIONAL"
                ? recipientName || "Professional"
                : (notification.templateVariables?.professional_name ?? "Professional"),
            prof_name:
              recipient.role === "PROFESSIONAL"
                ? recipientName || "Professional"
                : (notification.templateVariables?.prof_name ?? "Professional"),
          },
        });
      }),
  );
  results.forEach((result) => {
    if (result.status === "rejected")
      logServerError("marketplace.notification.email.failed", result.reason, {
        type: notification.type,
      });
  });
}

async function sendSmsNotifications(
  recipients: Array<{
    id: number;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: string | null;
  }>,
  notification: BroadcastNotification,
) {
  const validRecipients = recipients.filter(
    (recipient) => recipient.phone && recipient.phone.trim().length >= 8,
  );
  if (!validRecipients.length) return;

  const results = await Promise.allSettled(
    validRecipients.map((recipient) => {
      const recipientName =
        [recipient.firstName, recipient.lastName].filter(Boolean).join(" ").trim() ||
        recipient.firstName ||
        "";

      const audience =
        (recipient.role as "CLIENT" | "PROFESSIONAL" | "ADMIN" | "SYSTEM") || undefined;
      const templateKey = resolveSmsTemplate(notification.type, audience);
      if (!templateKey) return Promise.resolve({ ok: true, provider: "noop" as const });

      const appUrl =
        process.env.APP_URL?.trim() ||
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        "https://klickpro.in";
      const shortUrl = notification.href.startsWith("http")
        ? notification.href
        : `${appUrl.replace(/\/$/, "")}${notification.href}`;

      const vars = notification.templateVariables ?? {};
      return sendSms({
        to: recipient.phone!.trim(),
        templateKey,
        variables: {
          ...vars,
          amount: stripCurrencyPrefix(vars.amount),
          refund_amount: stripCurrencyPrefix(vars.refund_amount),
          payout_amount: stripCurrencyPrefix(vars.payout_amount),
          bid_amount: stripCurrencyPrefix(vars.bid_amount),
          milestone_amount: stripCurrencyPrefix(vars.milestone_amount),
          updated_balance: stripCurrencyPrefix(vars.updated_balance),
          budget: stripCurrencyPrefix(vars.budget),
          user_name: recipientName || "there",
          client_name:
            recipient.role === "CLIENT"
              ? recipientName || "Client"
              : (vars.client_name ?? "Client"),
          professional_name:
            recipient.role === "PROFESSIONAL"
              ? recipientName || "Professional"
              : (vars.professional_name ?? "Professional"),
          prof_name:
            recipient.role === "PROFESSIONAL"
              ? recipientName || "Professional"
              : (vars.prof_name ?? "Professional"),
          short_url: shortUrl,
          site_url: appUrl,
        },
      });
    }),
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      logServerError("marketplace.notification.sms.failed", result.reason, {
        type: notification.type,
      });
    }
  });
}

async function projectEmailDetails(projectId: number): Promise<{
  details: Array<{ label: string; value: string }>;
  variables: Record<string, string | number>;
}> {
  const project = await db.projectTracking.findUnique({
    where: { id: projectId },
    select: {
      status: true,
      progress: true,
      currentStage: true,
      jobId: true,
      requestId: true,
      startedAt: true,
      completedAt: true,
      client: { select: { firstName: true, lastName: true, email: true } },
      professional: { select: { firstName: true, lastName: true, email: true } },
    },
  });
  if (!project) return { details: [], variables: {} };
  const [job, request, latestMilestone] = await Promise.all([
    db.clientJob
      .findUnique({
        where: { id: project.jobId },
        select: {
          title: true,
          deadline: true,
          jobDate: true,
          category: true,
          budgetMin: true,
          budgetMax: true,
        },
      })
      .catch(() => null),
    project.requestId
      ? db.projectRequest
          .findUnique({
            where: { id: project.requestId },
            select: { bidAmount: true, duration: true },
          })
          .catch(() => null)
      : Promise.resolve(null),
    db.projectMilestone
      .findFirst({
        where: { trackingId: projectId },
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, amount: true, status: true },
      })
      .catch(() => null),
  ]);
  const safeDate = (value: unknown) => {
    if (!value) return "Not specified";
    try {
      const d = value instanceof Date ? value : new Date(String(value));
      return isNaN(d.getTime()) ? "Not specified" : d.toLocaleDateString("en-IN");
    } catch {
      return "Not specified";
    }
  };
  const clientName =
    [project.client?.firstName, project.client?.lastName].filter(Boolean).join(" ").trim() ||
    "Client";
  const profName =
    [project.professional?.firstName, project.professional?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Professional";
  const projectTitle = job?.title?.trim() || `Project #${projectId}`;
  const amountStr =
    request?.bidAmount != null ? `₹${request.bidAmount.toLocaleString("en-IN")}` : "Not specified";
  const milestoneAmountStr =
    latestMilestone?.amount != null
      ? `₹${latestMilestone.amount.toLocaleString("en-IN")}`
      : amountStr;

  const details = [
    { label: "Project", value: projectTitle },
    { label: "Project amount", value: amountStr },
    { label: "Project timeline", value: request?.duration?.trim() || "Not specified" },
    { label: "Status", value: formatReadableLabel(project.status) },
    { label: "Progress", value: `${project.progress}%` },
    { label: "Current stage", value: project.currentStage?.trim() || "Not specified" },
    { label: "Preferred job date", value: safeDate(job?.jobDate) },
    { label: "Deadline", value: safeDate(job?.deadline) },
    { label: "Started", value: safeDate(project.startedAt) },
    { label: "Completed", value: safeDate(project.completedAt) },
  ];

  if (latestMilestone?.title) {
    details.splice(2, 0, { label: "Milestone", value: latestMilestone.title });
    details.splice(3, 0, { label: "Milestone amount", value: milestoneAmountStr });
  }

  const variables: Record<string, string | number> = {
    client_name: clientName,
    professional_name: profName,
    prof_name: profName,
    user_name: clientName,
    project_title: projectTitle,
    job_title: projectTitle,
    category_name: job?.category || "Services",
    project_id: projectId,
    job_id: project.jobId,
    bid_amount: amountStr,
    accepted_amount: amountStr,
    agreed_amount: amountStr,
    amount: amountStr,
    budget: amountStr,
    delivery_time: request?.duration || "As scheduled",
    timeline: request?.duration || "As scheduled",
    milestone_title: latestMilestone?.title || "Project Milestone",
    milestone_amount: milestoneAmountStr,
  };

  return { details, variables };
}

async function jobEmailDetails(jobId: number): Promise<{
  details: Array<{ label: string; value: string }>;
  variables: Record<string, string | number>;
}> {
  const job = await db.clientJob.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      category: true,
      budgetMin: true,
      budgetMax: true,
      locationLabel: true,
      status: true,
      user: { select: { firstName: true, lastName: true } },
    },
  });
  if (!job) return { details: [], variables: {} };

  const clientName =
    [job.user?.firstName, job.user?.lastName].filter(Boolean).join(" ").trim() || "Client";
  const jobTitle = job.title?.trim() || "Job Posting";
  const categoryName = job.category?.trim() || "General Services";
  const jobLocation = job.locationLabel?.trim() || "Remote";
  const budgetStr =
    job.budgetMin != null && job.budgetMax != null
      ? `₹${job.budgetMin.toLocaleString("en-IN")} - ₹${job.budgetMax.toLocaleString("en-IN")}`
      : job.budgetMax != null
        ? `₹${job.budgetMax.toLocaleString("en-IN")}`
        : "Not specified";

  const details = [
    { label: "Job Title", value: jobTitle },
    { label: "Job Category", value: categoryName },
    { label: "Job Budget", value: budgetStr },
    { label: "Job ID", value: String(job.id) },
  ];

  const variables: Record<string, string | number> = {
    client_name: clientName,
    user_name: clientName,
    job_title: jobTitle,
    project_title: jobTitle,
    category_name: categoryName,
    budget: budgetStr,
    job_id: job.id,
    job_location: jobLocation,
  };

  return { details, variables };
}

export async function notifyRole(
  role: "ADMIN" | "CLIENT" | "PROFESSIONAL",
  notification: BroadcastNotification,
) {
  try {
    const projectIdMatch =
      notification.href.match(/\/project\/(\d+)/)?.[1] ||
      notification.href.match(/project=(\d+)/)?.[1];
    const jobIdMatch = !projectIdMatch
      ? notification.href.match(/\/jobs?\/(\d+)/)?.[1] || notification.href.match(/job=(\d+)/)?.[1]
      : null;

    const contextualInfo = projectIdMatch
      ? await projectEmailDetails(Number(projectIdMatch))
      : jobIdMatch
        ? await jobEmailDetails(Number(jobIdMatch))
        : { details: [], variables: {} };

    const emailDetails = [...contextualInfo.details, ...(notification.emailDetails ?? [])];
    const templateVariables = {
      ...contextualInfo.variables,
      ...(notification.templateVariables ?? {}),
    };

    const storedNotification = {
      type: notification.type,
      title: notification.title,
      description: notification.description,
      href: notification.href,
    };

    const recipients = await db.user.findMany({
      where: { role, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        email: true,
        phone: true,
        emailNotificationsEnabled: true,
      },
    });
    if (!recipients.length) return;

    const created = await db.userNotification.createManyAndReturn({
      data: recipients.map((recipient) => ({
        userId: recipient.id,
        ...storedNotification,
      })),
    });
    created.forEach((item) =>
      emitRealtimeNotification([item.userId], {
        type: item.type,
        title: item.title,
        description: item.description ?? "",
        href: item.href ?? "",
        id: item.id,
        createdAt: item.createdAt.toISOString(),
      }),
    );
    if (role === "ADMIN") {
      emitAdminNotification({
        type: notification.type,
        title: notification.title,
        description: notification.description,
        href: notification.href,
      });
      emitAdminOverviewUpdate();
      if (storedNotification.type.includes("ACCOUNT") || storedNotification.type.includes("USER")) {
        emitAdminUsersUpdate();
      }
      if (
        storedNotification.type.includes("JOB") ||
        storedNotification.type.includes("DISPUTE") ||
        storedNotification.type.includes("PROJECT")
      ) {
        emitAdminOperationsUpdate();
      }
      if (storedNotification.type.includes("VERIFICATION")) {
        emitAdminVerificationsUpdate();
      }
    }
    // Email leaves the request path: SMTP delivery must not hold the response open.
    enqueueBackgroundJob(
      "notification.email.role",
      () => sendEmails(recipients, { ...storedNotification, emailDetails, templateVariables }),
      {
        type: notification.type,
      },
    );
    // SMS notification
    enqueueBackgroundJob(
      "notification.sms.role",
      () =>
        sendSmsNotifications(recipients, {
          ...storedNotification,
          emailDetails,
          templateVariables,
        }),
      {
        type: notification.type,
      },
    );
  } catch (error) {
    // A failed notification must never block account creation or job publishing.
    logServerError("marketplace.notification.broadcast.failed", error, {
      role,
      type: notification.type,
    });
  }
}

export function notifyAdminsOfNewAccount(user: {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}) {
  const name = `${user.firstName} ${user.lastName}`.trim() || "A new user";
  const roleLabel = user.role === "PROFESSIONAL" ? "professional" : "client";
  return notifyRole("ADMIN", {
    type: "NEW_ACCOUNT",
    title: `New ${roleLabel} registration`,
    description: `${name} registered as a ${roleLabel}.`,
    href: `/admin/users/${user.id}`,
    templateVariables: {
      user_name: name,
      client_name: name,
    },
  });
}

export async function notifyUsers(userIds: number[], notification: BroadcastNotification) {
  const ids = [...new Set(userIds)].filter(
    (id): id is number => typeof id === "number" && !Number.isNaN(id) && id > 0,
  );
  if (!ids.length) return;

  const storedNotification = {
    type: notification.type,
    title: notification.title,
    description: notification.description,
    href: notification.href,
  };

  // Step 1: Create in-app notifications in DB FIRST and emit real-time Socket.IO events.
  // This is completely isolated so that email or context formatting can NEVER drop notifications.
  let recipients: Array<{
    id: number;
    firstName: string | null;
    lastName: string | null;
    role: string | null;
    email: string;
    phone: string | null;
    emailNotificationsEnabled: boolean;
  }> = [];

  try {
    recipients = await db.user.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        email: true,
        phone: true,
        emailNotificationsEnabled: true,
      },
    });

    if (recipients.length > 0) {
      const createdItems = await Promise.all(
        recipients.map(async (recipient) => {
          try {
            return await db.userNotification.create({
              data: {
                userId: recipient.id,
                type: storedNotification.type,
                title: storedNotification.title,
                description: storedNotification.description,
                href: storedNotification.href,
              },
            });
          } catch (err) {
            logServerError("marketplace.notification.create.failed", err, {
              userId: recipient.id,
              type: notification.type,
            });
            return null;
          }
        }),
      );

      for (const item of createdItems) {
        if (item) {
          emitRealtimeNotification([item.userId], {
            type: item.type,
            title: item.title,
            description: item.description ?? "",
            href: item.href ?? "",
            id: item.id,
            createdAt: item.createdAt.toISOString(),
          });
        }
      }
    }
  } catch (dbError) {
    logServerError("marketplace.notification.direct.db.failed", dbError, {
      userIds: ids.join(","),
      type: notification.type,
    });
  }

  if (!recipients.length) return;

  // Step 2: Background email & SMS delivery in try/catch (isolated from DB notifications)
  try {
    const projectIdMatch =
      notification.href.match(/\/project\/(\d+)/)?.[1] ||
      notification.href.match(/project=(\d+)/)?.[1];
    const jobIdMatch = !projectIdMatch
      ? notification.href.match(/\/jobs?\/(\d+)/)?.[1] || notification.href.match(/job=(\d+)/)?.[1]
      : null;

    const contextualInfo = projectIdMatch
      ? await projectEmailDetails(Number(projectIdMatch)).catch(() => ({
          details: [],
          variables: {},
        }))
      : jobIdMatch
        ? await jobEmailDetails(Number(jobIdMatch)).catch(() => ({ details: [], variables: {} }))
        : { details: [], variables: {} };

    const emailDetails = [...contextualInfo.details, ...(notification.emailDetails ?? [])];
    const templateVariables = {
      ...contextualInfo.variables,
      ...(notification.templateVariables ?? {}),
    };

    enqueueBackgroundJob(
      "notification.email.direct",
      () => sendEmails(recipients, { ...storedNotification, emailDetails, templateVariables }),
      { type: notification.type },
    );
    enqueueBackgroundJob(
      "notification.sms.direct",
      () =>
        sendSmsNotifications(recipients, {
          ...storedNotification,
          emailDetails,
          templateVariables,
        }),
      { type: notification.type },
    );
  } catch (error) {
    logServerError("marketplace.notification.direct.background.failed", error, {
      userIds: ids.join(","),
      type: notification.type,
    });
  }
}

export async function notifyDisputeRaised(input: {
  disputeId: number;
  trackingId: number;
  jobTitle: string | null;
  issueType: string;
  reporterRole: "CLIENT" | "PROFESSIONAL";
  reporterName: string;
  clientId: number;
  professionalId: number;
  disputeMessage?: string;
}) {
  const jobLabel = input.jobTitle?.trim() || "your project";
  const reporterLabel = input.reporterRole === "CLIENT" ? "the client" : "the professional";
  const disputeVars = {
    dispute_id: input.disputeId,
    project_id: input.trackingId,
    project_title: jobLabel,
    job_title: jobLabel,
    issue_type: input.issueType,
    raised_by: input.reporterName,
    dispute_message: input.disputeMessage?.trim() || `${input.issueType} dispute filed.`,
  };
  await notifyRole("ADMIN", {
    type: "DISPUTE_RAISED",
    title: "New dispute raised",
    description: `${input.reporterName} (${reporterLabel}) raised a ${input.issueType} dispute on ${jobLabel}.`,
    href: `/admin/operations?dispute=${input.disputeId}&project=${input.trackingId}`,
    templateVariables: disputeVars,
  });
  await notifyUsers(
    [input.clientId, input.professionalId].filter(
      (id) => id !== (input.reporterRole === "CLIENT" ? input.clientId : input.professionalId),
    ),
    {
      type: "DISPUTE_RAISED",
      title: "A dispute was raised on your project",
      description: `${input.reporterName} raised a ${input.issueType} dispute on ${jobLabel}. Our team will review it and follow up soon.`,
      href: `/project/${input.trackingId}/tracking`,
      templateVariables: disputeVars,
      emailDetails: [
        { label: "Issue Type", value: input.issueType },
        { label: "Raised By", value: input.reporterName },
      ],
    },
  );
}

export async function notifyDisputeResolved(input: {
  disputeId?: number;
  trackingId: number;
  jobTitle: string | null;
  status: "OPEN" | "RESOLVED";
  clientId: number;
  professionalId: number;
}) {
  const jobLabel = input.jobTitle?.trim() || "your project";
  const isResolved = input.status === "RESOLVED";
  await notifyUsers([input.clientId, input.professionalId], {
    type: isResolved ? "DISPUTE_RESOLVED" : "DISPUTE_CONTESTED",
    title: isResolved ? "Dispute resolved" : "Dispute reopened",
    description: isResolved
      ? `Klick-Pro support marked the dispute on ${jobLabel} as resolved.`
      : `Klick-Pro support reopened the dispute on ${jobLabel} for further review.`,
    href: `/project/${input.trackingId}/tracking`,
    templateVariables: {
      dispute_id: input.disputeId ?? input.trackingId,
      project_id: input.trackingId,
      project_title: jobLabel,
      job_title: jobLabel,
      decision_summary: isResolved ? "Dispute Closed / Resolved" : "Dispute Reopened for Review",
      resolution_notes: isResolved
        ? "Resolved by Klick-Pro moderation."
        : "Reopened for further review.",
    },
  });
}

export async function notifyDisputeAccepted(input: {
  disputeId: number;
  trackingId: number;
  jobTitle: string | null;
  complainantId: number;
  respondentName: string;
}) {
  const jobLabel = input.jobTitle?.trim() || "your project";
  await notifyUsers([input.complainantId], {
    type: "DISPUTE_RESOLVED",
    title: "Dispute accepted by other party",
    description: `${input.respondentName} accepted your dispute claim on ${jobLabel}. The dispute has been mutually settled.`,
    href: `/project/${input.trackingId}/tracking`,
    templateVariables: {
      dispute_id: input.disputeId,
      project_id: input.trackingId,
      project_title: jobLabel,
      job_title: jobLabel,
      decision_summary: "Mutually Settled",
      resolution_notes: `${input.respondentName} accepted the dispute claim.`,
    },
  });
  await notifyRole("ADMIN", {
    type: "DISPUTE_RESOLVED",
    title: `Dispute #${input.disputeId} mutually accepted`,
    description: `${input.respondentName} accepted the dispute claim on ${jobLabel}. Mutually settled.`,
    href: `/admin/operations?dispute=${input.disputeId}&project=${input.trackingId}`,
  });
}

export async function notifyDisputeContested(input: {
  disputeId: number;
  trackingId: number;
  jobTitle: string | null;
  complainantId: number;
  respondentName: string;
}) {
  const jobLabel = input.jobTitle?.trim() || "your project";
  await notifyUsers([input.complainantId], {
    type: "DISPUTE_CONTESTED",
    title: "Dispute contested - Escalated to Admin Review",
    description: `${input.respondentName} submitted counter-evidence for the dispute on ${jobLabel}. An admin is now reviewing the case.`,
    href: `/project/${input.trackingId}/tracking`,
    templateVariables: {
      dispute_id: input.disputeId,
      project_id: input.trackingId,
      project_title: jobLabel,
      job_title: jobLabel,
      issue_type: "Contested Dispute (Admin Review)",
      raised_by: input.respondentName,
    },
  });
  await notifyRole("ADMIN", {
    type: "DISPUTE_CONTESTED",
    title: `Action Required: Dispute #${input.disputeId} contested`,
    description: `${input.respondentName} rejected the dispute on ${jobLabel} and submitted counter-evidence. Requires Admin Review.`,
    href: `/admin/operations?dispute=${input.disputeId}&project=${input.trackingId}`,
  });
}

export async function notifyDisputeDecided(input: {
  disputeId: number;
  trackingId: number;
  jobTitle: string | null;
  clientId: number;
  professionalId: number;
  decision: "CLIENT_WINS" | "PROFESSIONAL_WINS" | "PARTIAL_SETTLEMENT";
  refundAmount?: number;
  payoutAmount?: number;
  reason?: string;
}) {
  const jobLabel = input.jobTitle?.trim() || "your project";
  const decisionLabel =
    input.decision === "CLIENT_WINS"
      ? "Client Wins (Refund processed)"
      : input.decision === "PROFESSIONAL_WINS"
        ? "Professional Wins (Payment released)"
        : `Partial Settlement (Split: ₹${(input.refundAmount ?? 0).toLocaleString("en-IN")} refund / ₹${(input.payoutAmount ?? 0).toLocaleString("en-IN")} payout)`;

  await notifyUsers([input.clientId, input.professionalId], {
    type: "DISPUTE_DECIDED",
    title: `Dispute #${input.disputeId} Decided: ${decisionLabel}`,
    description: `Admin has reviewed and resolved the dispute on ${jobLabel}. ${input.reason ? `Notes: "${input.reason}".` : ""}`,
    href: `/project/${input.trackingId}/tracking`,
    transactional: true,
    templateVariables: {
      dispute_id: input.disputeId,
      project_id: input.trackingId,
      project_title: jobLabel,
      job_title: jobLabel,
      decision_summary: decisionLabel,
      resolution_notes: input.reason?.trim() || "Settlement executed per platform review.",
    },
    emailDetails: [
      { label: "Case ID", value: `#${input.disputeId}` },
      { label: "Decision", value: decisionLabel },
      ...(input.reason?.trim() ? [{ label: "Resolution Notes", value: input.reason.trim() }] : []),
    ],
  });

  if ((input.refundAmount ?? 0) > 0) {
    const refundFormatted = `₹${(input.refundAmount ?? 0).toLocaleString("en-IN")}`;
    await notifyUsers([input.clientId], {
      type: "REFUND_PROCESSED",
      title: `Refund Receipt: ${refundFormatted} credited to your wallet`,
      description: `A dispute refund of ${refundFormatted} for ${jobLabel} has been credited to your Klick-Pro wallet.`,
      href: "/earnings",
      transactional: true,
      templateVariables: {
        project_title: jobLabel,
        job_title: jobLabel,
        refund_amount: refundFormatted,
        amount: refundFormatted,
        transaction_ref: `DSP-REF-${input.disputeId}`,
        payment_source: "Klick-Pro Wallet",
      },
      emailDetails: [
        { label: "Receipt No", value: `DSP-REF-${input.disputeId}` },
        { label: "Project", value: jobLabel },
        { label: "Refund Amount", value: refundFormatted },
        { label: "Payment Source", value: "Klick-Pro Wallet" },
        { label: "Date & Time", value: formatIstTimestamp() },
      ],
    });
  }
}

export function notifyDisputeMessage(input: {
  disputeId: number;
  trackingId: number;
  recipientId: number;
  senderName: string;
  message: string;
}) {
  return notifyUsers([input.recipientId], {
    type: "DISPUTE_MESSAGE",
    title: `Message from Klick-Pro support about dispute #${input.disputeId}`,
    description: `${input.senderName}: ${input.message.slice(0, 180)}`,
    href: `/project/${input.trackingId}/tracking`,
  });
}

export async function notifyMilestoneFunded(input: {
  projectId: number;
  milestoneId: number;
  milestoneTitle: string;
  amount: number;
  clientId: number;
  professionalId: number;
}) {
  const href = `/project/${input.projectId}/tracking?tab=milestones&milestoneId=${input.milestoneId}`;
  const amount = `₹${input.amount.toLocaleString("en-IN")}`;
  await notifyUsers([input.professionalId], {
    type: "MILESTONE_FUNDED",
    title: "Milestone funded",
    description: `${input.milestoneTitle} is funded for ${amount}. Your payout is waiting for admin approval.`,
    href,
    templateVariables: {
      milestone_title: input.milestoneTitle,
      milestone_amount: amount,
      amount,
      project_id: input.projectId,
    },
    emailDetails: [
      { label: "Milestone", value: input.milestoneTitle },
      { label: "Milestone amount", value: amount },
    ],
  });
  await notifyRole("ADMIN", {
    type: "MILESTONE_FUNDED",
    title: "Milestone payout approval required",
    description: `${input.milestoneTitle} has received ${amount}. Review and approve the professional payout.`,
    href: `/admin/finance?project=${input.projectId}`,
    templateVariables: {
      milestone_title: input.milestoneTitle,
      milestone_amount: amount,
      amount,
      project_id: input.projectId,
    },
    emailDetails: [
      { label: "Milestone", value: input.milestoneTitle },
      { label: "Milestone amount", value: amount },
    ],
  });
}

export async function notifyMilestonePayoutApproved(input: {
  projectId: number;
  milestoneTitle: string;
  payoutAmount: number;
  platformEarnings: number;
  clientId: number;
  professionalId: number;
  jobTitle?: string | null;
  paymentId?: number;
}) {
  const href = `/project/${input.projectId}/tracking`;
  const payout = `₹${input.payoutAmount.toLocaleString("en-IN")}`;
  const jobTitle = input.jobTitle?.trim() || `Project #${input.projectId}`;
  const proWallet = await db.wallet
    .findUnique({ where: { userId: input.professionalId }, select: { balance: true } })
    .catch(() => null);
  const updatedBalance = `₹${(proWallet?.balance ?? 0).toLocaleString("en-IN")}`;
  const receiptNo = input.paymentId
    ? `INV-${new Date().getFullYear()}-${String(input.paymentId).padStart(6, "0")}`
    : `PAY-${input.projectId}-${Date.now().toString().slice(-6)}`;

  // Notify professional with payout receipt (Rule 6: omit fee lines when zero commission)
  await notifyUsers([input.professionalId], {
    type: "MILESTONE_PAYOUT_APPROVED",
    title: `${jobTitle} · Milestone payout released`,
    description: `Payout for ${input.milestoneTitle} has been released. ${payout} has been added to your wallet.`,
    href,
    transactional: true,
    templateVariables: {
      receipt_no: receiptNo,
      milestone_title: input.milestoneTitle,
      payout_amount: payout,
      amount: payout,
      project_title: jobTitle,
      updated_balance: updatedBalance,
      platform_fee:
        input.platformEarnings > 0
          ? `₹${input.platformEarnings.toLocaleString("en-IN")}`
          : "",
    },
    emailDetails: [
      { label: "Receipt No", value: receiptNo },
      { label: "Project", value: jobTitle },
      { label: "Milestone", value: input.milestoneTitle },
      { label: "Payout Credited", value: payout },
      { label: "Updated Balance", value: updatedBalance },
      ...(input.platformEarnings > 0
        ? [{ label: "Platform commission", value: `₹${input.platformEarnings.toLocaleString("en-IN")}` }]
        : []),
    ],
  });
}

export async function notifyWalletTopupReceipt(input: {
  userId: number;
  amount: number;
  transactionId?: number;
  paymentId?: string;
  orderId?: string;
}) {
  const formattedAmount = `₹${input.amount.toLocaleString("en-IN")}`;
  const wallet = await db.wallet
    .findUnique({ where: { userId: input.userId }, select: { balance: true } })
    .catch(() => null);
  const updatedBalance = `₹${(wallet?.balance ?? input.amount).toLocaleString("en-IN")}`;
  const receiptNo = input.transactionId
    ? `RCP-WT-${input.transactionId}`
    : `RCP-WT-${Date.now().toString().slice(-6)}`;
  const transactionRef = input.paymentId || input.orderId || receiptNo;
  const transactionDate = formatIstTimestamp();

  await notifyUsers([input.userId], {
    type: "WALLET_TOPUP_RECEIPT",
    title: `Payment Receipt ${receiptNo} · ${formattedAmount} added to wallet`,
    description: `Your wallet top-up of ${formattedAmount} succeeded. Updated wallet balance: ${updatedBalance}.`,
    href: "/earnings",
    transactional: true,
    templateVariables: {
      receipt_no: receiptNo,
      amount: formattedAmount,
      transaction_ref: transactionRef,
      payment_method: "Razorpay Checkout",
      updated_balance: updatedBalance,
      transaction_date: transactionDate,
    },
    emailDetails: [
      { label: "Receipt No", value: receiptNo },
      { label: "Amount Credited", value: formattedAmount },
      { label: "Transaction Reference", value: transactionRef },
      { label: "Payment Method", value: "Razorpay Checkout" },
      { label: "Updated Balance", value: updatedBalance },
      { label: "Date & Time", value: transactionDate },
    ],
  });
}

/**
 * Formats stored JSON or legacy withdrawal destination strings into a safe human label
 * without exposing raw bank account numbers or encrypted blobs.
 */
export function formatWithdrawalDestinationLabel(
  destinationType?: string | null,
  destinationLabel?: string | null,
): string {
  if (!destinationLabel) return destinationType === "UPI" ? "UPI Account" : "Bank Account";
  try {
    const parsed = JSON.parse(destinationLabel) as {
      bankName?: string;
      last4?: string;
      upiId?: string;
    };
    if (parsed && typeof parsed === "object") {
      if (parsed.upiId) return `UPI (${parsed.upiId})`;
      if (parsed.bankName || parsed.last4) {
        return `${parsed.bankName || "Bank"} ${parsed.last4 ? `••••${parsed.last4}` : ""}`.trim();
      }
    }
  } catch {
    // Legacy string fallback
  }
  return maskDestinationString(destinationLabel);
}

export async function notifyWithdrawalReceipt(input: {
  userId: number;
  withdrawalId: number;
  status: "REQUESTED" | "COMPLETED" | "FAILED";
  amount: number;
  destination: string;
  utr?: string | null;
  failureReason?: string | null;
}) {
  const formattedAmount = `₹${input.amount.toLocaleString("en-IN")}`;
  const receiptNo = `WD-${input.withdrawalId}`;
  const transactionDate = formatIstTimestamp();
  const wallet = await db.wallet
    .findUnique({ where: { userId: input.userId }, select: { balance: true, pendingBalance: true } })
    .catch(() => null);
  const availableBalance = wallet ? Math.max(0, wallet.balance - wallet.pendingBalance) : 0;
  const updatedBalance = `₹${availableBalance.toLocaleString("en-IN")}`;

  if (input.status === "REQUESTED") {
    await notifyUsers([input.userId], {
      type: "WITHDRAWAL_REQUESTED",
      title: `Withdrawal Request ${receiptNo} · ${formattedAmount}`,
      description: `Your withdrawal request of ${formattedAmount} to ${input.destination} was submitted for approval.`,
      href: "/earnings",
      transactional: true,
      templateVariables: {
        receipt_no: receiptNo,
        amount: formattedAmount,
        destination: input.destination,
        updated_balance: updatedBalance,
        transaction_date: transactionDate,
      },
      emailDetails: [
        { label: "Receipt No", value: receiptNo },
        { label: "Withdrawal Amount", value: formattedAmount },
        { label: "Destination", value: input.destination },
        { label: "Status", value: "Pending Admin Approval" },
        { label: "Available Balance", value: updatedBalance },
        { label: "Date & Time", value: transactionDate },
      ],
    });
    return;
  }

  if (input.status === "COMPLETED") {
    const utr = input.utr?.trim() || receiptNo;
    await notifyUsers([input.userId], {
      type: "WITHDRAWAL_COMPLETED",
      title: `Withdrawal Receipt ${receiptNo} · ${formattedAmount} transferred`,
      description: `Your withdrawal of ${formattedAmount} has been transferred to ${input.destination}. UTR: ${utr}.`,
      href: "/earnings",
      transactional: true,
      templateVariables: {
        receipt_no: receiptNo,
        amount: formattedAmount,
        destination: input.destination,
        utr,
        updated_balance: updatedBalance,
        transaction_date: transactionDate,
      },
      emailDetails: [
        { label: "Receipt No", value: receiptNo },
        { label: "Transferred Amount", value: formattedAmount },
        { label: "UTR Reference", value: utr },
        { label: "Destination", value: input.destination },
        { label: "Updated Balance", value: updatedBalance },
        { label: "Date & Time", value: transactionDate },
      ],
    });
    return;
  }

  const failureReason = input.failureReason?.trim() || "Rejected or reversed during transfer.";
  await notifyUsers([input.userId], {
    type: "WITHDRAWAL_FAILED",
    title: `Withdrawal Update ${receiptNo} · ${formattedAmount} restored`,
    description: `Your withdrawal of ${formattedAmount} failed (${failureReason}). Funds have been restored to your wallet.`,
    href: "/earnings",
    transactional: true,
    templateVariables: {
      receipt_no: receiptNo,
      amount: formattedAmount,
      destination: input.destination,
      failure_reason: failureReason,
      updated_balance: updatedBalance,
      transaction_date: transactionDate,
    },
    emailDetails: [
      { label: "Reference No", value: receiptNo },
      { label: "Amount Restored", value: formattedAmount },
      { label: "Reason", value: failureReason },
      { label: "Updated Balance", value: updatedBalance },
      { label: "Date & Time", value: transactionDate },
    ],
  });
}

export async function notifyClientMilestoneReceipt(input: {
  clientId: number;
  projectId: number;
  paymentId?: number;
  milestoneTitle: string;
  projectTitle?: string | null;
  amount: number;
  paymentStatus: string;
  remainingBalance?: number;
}) {
  const formattedAmount = `₹${input.amount.toLocaleString("en-IN")}`;
  const projectTitle = input.projectTitle?.trim() || `Project #${input.projectId}`;
  const receiptNo = input.paymentId
    ? `INV-${new Date().getFullYear()}-${String(input.paymentId).padStart(6, "0")}`
    : `MS-${input.projectId}`;
  let balanceVal = input.remainingBalance;
  if (balanceVal === undefined) {
    const w = await db.wallet
      .findUnique({ where: { userId: input.clientId }, select: { balance: true } })
      .catch(() => null);
    balanceVal = w?.balance ?? 0;
  }
  const updatedBalance = `₹${balanceVal.toLocaleString("en-IN")}`;
  const transactionDate = formatIstTimestamp();

  await notifyUsers([input.clientId], {
    type: "CLIENT_MILESTONE_RECEIPT",
    title: `Payment Receipt ${receiptNo} · ${formattedAmount}`,
    description: `Your payment of ${formattedAmount} for milestone "${input.milestoneTitle}" on ${projectTitle} is recorded (${input.paymentStatus}).`,
    href: `/project/${input.projectId}/tracking`,
    transactional: true,
    templateVariables: {
      receipt_no: receiptNo,
      project_id: input.projectId,
      project_title: projectTitle,
      milestone_title: input.milestoneTitle,
      milestone_amount: formattedAmount,
      amount: formattedAmount,
      payment_status: input.paymentStatus,
      updated_balance: updatedBalance,
      transaction_date: transactionDate,
    },
    emailDetails: [
      { label: "Receipt No", value: receiptNo },
      { label: "Project", value: projectTitle },
      { label: "Milestone", value: input.milestoneTitle },
      { label: "Amount", value: formattedAmount },
      { label: "Status", value: input.paymentStatus },
      { label: "Updated Balance", value: updatedBalance },
      { label: "Date & Time", value: transactionDate },
    ],
  });
}

export async function notifyJobPosted(job: {
  id: number;
  title: string | null;
  category: string | null;
  userId: number;
  budgetMin?: number | null;
  budgetMax?: number | null;
}) {
  const jobTitle = job.title?.trim() || `Job #${job.id}`;
  const categoryLabel = job.category?.trim() || "General Services";
  const clientUser = await db.user.findUnique({
    where: { id: job.userId },
    select: { firstName: true, lastName: true },
  });
  const clientName = clientUser
    ? `${clientUser.firstName} ${clientUser.lastName}`.trim()
    : "Client";
  const budgetStr =
    job.budgetMin != null && job.budgetMax != null
      ? `₹${job.budgetMin.toLocaleString("en-IN")} - ₹${job.budgetMax.toLocaleString("en-IN")}`
      : job.budgetMax != null
        ? `₹${job.budgetMax.toLocaleString("en-IN")}`
        : "Flexible";

  // 1. Send confirmation email to the client using client_job_posted template
  await notifyUsers([job.userId], {
    type: "JOB_POSTED",
    title: `Job posted · ${jobTitle}`,
    description: `Your job "${jobTitle}" is now live in ${categoryLabel}. Matching professionals are being notified.`,
    href: `/job/${job.id}`,
    templateVariables: {
      client_name: clientName,
      job_title: jobTitle,
      category_name: categoryLabel,
      budget: budgetStr,
      job_id: job.id,
    },
    emailDetails: [
      { label: "Job Title", value: jobTitle },
      { label: "Job Category", value: categoryLabel },
      { label: "Job Budget", value: budgetStr },
      { label: "Job ID", value: String(job.id) },
    ],
  });

  // 3. Notify Matching Professionals in that category
  let matchingPros: { id: number }[] = [];
  try {
    matchingPros = await db.user.findMany({
      where: {
        role: "PROFESSIONAL",
        isActive: true,
        id: { not: job.userId },
        ...(job.category
          ? {
              OR: [
                { professionalCategory: job.category },
                { professionalCategoryRecord: { name: job.category } },
                { services: { some: { category: { name: job.category } } } },
              ],
            }
          : {}),
      },
      select: { id: true },
      take: 50,
    });
  } catch (err) {
    console.error("Failed to query matching professionals for job notification:", err);
  }

  const targetProIds = matchingPros.map((p) => p.id);
  if (targetProIds.length > 0) {
    await notifyUsers(targetProIds, {
      type: "NEW_JOB",
      title: `New job available · ${jobTitle}`,
      description: `A new job matching your expertise was posted: "${jobTitle}" (${categoryLabel}). Submit a proposal now.`,
      href: `/job/${job.id}`,
      templateVariables: {
        job_title: jobTitle,
        category_name: categoryLabel,
      },
    });
  }
}

export async function notifyProposalSubmitted(input: {
  jobId: number;
  proposalId?: number;
  jobTitle?: string | null;
  clientId: number;
  professionalId: number;
  bidAmount: number;
  duration: string;
  coverLetter?: string | null;
}) {
  const jobTitle = input.jobTitle?.trim() || `Job #${input.jobId}`;
  const proUser = await db.user.findUnique({
    where: { id: input.professionalId },
    select: { firstName: true, lastName: true },
  });
  const proName = proUser ? `${proUser.firstName} ${proUser.lastName}`.trim() : "A professional";
  const amountStr = `₹${input.bidAmount.toLocaleString("en-IN")}`;
  const proposalHref = input.proposalId
    ? `/job/${input.jobId}?proposal=${input.proposalId}`
    : `/job/${input.jobId}`;

  // 1. Notify Client
  await notifyUsers([input.clientId], {
    type: "NEW_PROPOSAL",
    title: `${jobTitle} · New Proposal`,
    description: `${proName} sent a proposal of ${amountStr} for ${jobTitle}.`,
    href: proposalHref,
    templateVariables: {
      professional_name: proName,
      prof_name: proName,
      job_title: jobTitle,
      bid_amount: amountStr,
      amount: amountStr,
      delivery_time: input.duration,
      job_id: input.jobId,
      ...(input.proposalId ? { proposal_id: input.proposalId } : {}),
    },
    emailDetails: [
      { label: "Professional", value: proName },
      { label: "Project", value: jobTitle },
      { label: "Proposed amount", value: amountStr },
      { label: "Delivery time", value: input.duration },
    ],
  });
}

export async function notifyProposalUpdated(input: {
  jobId: number;
  proposalId?: number;
  jobTitle?: string | null;
  clientId: number;
  professionalId: number;
  bidAmount: number;
  duration: string;
}) {
  const jobTitle = input.jobTitle?.trim() || `Job #${input.jobId}`;
  const proUser = await db.user.findUnique({
    where: { id: input.professionalId },
    select: { firstName: true, lastName: true },
  });
  const proName = proUser ? `${proUser.firstName} ${proUser.lastName}`.trim() : "A professional";
  const amountStr = `₹${input.bidAmount.toLocaleString("en-IN")}`;
  const proposalHref = input.proposalId
    ? `/job/${input.jobId}?proposal=${input.proposalId}`
    : `/job/${input.jobId}`;

  // Notify Client
  await notifyUsers([input.clientId], {
    type: "PROPOSAL_UPDATED",
    title: `${jobTitle} · Proposal Updated`,
    description: `${proName} updated their proposal for ${jobTitle} to ${amountStr}.`,
    href: proposalHref,
    templateVariables: {
      professional_name: proName,
      prof_name: proName,
      job_title: jobTitle,
      bid_amount: amountStr,
      amount: amountStr,
      delivery_time: input.duration,
      job_id: input.jobId,
      ...(input.proposalId ? { proposal_id: input.proposalId } : {}),
    },
    emailDetails: [
      { label: "Professional", value: proName },
      { label: "Project", value: jobTitle },
      { label: "Proposed amount", value: amountStr },
      { label: "Delivery time", value: input.duration },
    ],
  });
}

export async function notifyContractAwarded(input: {
  projectId: number;
  jobId: number;
  jobTitle?: string | null;
  clientId: number;
  professionalId: number;
  bidAmount: number;
  duration?: string | null;
}) {
  const jobTitle = input.jobTitle?.trim() || `Project #${input.projectId}`;
  const [clientUser, proUser] = await Promise.all([
    db.user.findUnique({
      where: { id: input.clientId },
      select: { firstName: true, lastName: true },
    }),
    db.user.findUnique({
      where: { id: input.professionalId },
      select: { firstName: true, lastName: true },
    }),
  ]);
  const clientName = clientUser ? `${clientUser.firstName} ${clientUser.lastName}`.trim() : "Client";
  const proName = proUser ? `${proUser.firstName} ${proUser.lastName}`.trim() : "Professional";
  const amountStr = `₹${input.bidAmount.toLocaleString("en-IN")}`;

  // 1. Notify Professional only (the client accepted the contract, so client does not need a self-notification)
  await notifyUsers([input.professionalId], {
    type: "REQUEST_ACCEPTED",
    title: `${jobTitle} · Congratulations! You got the project`,
    description: `Congratulations! ${clientName} accepted your proposal for ${jobTitle} (${amountStr}). The project is now active.`,
    href: `/project/${input.projectId}/tracking`,
    templateVariables: {
      prof_name: proName,
      professional_name: proName,
      client_name: clientName,
      job_title: jobTitle,
      project_title: jobTitle,
      accepted_amount: amountStr,
      amount: amountStr,
      project_id: input.projectId,
    },
    emailDetails: [
      { label: "Project", value: jobTitle },
      { label: "Agreed amount", value: amountStr },
      { label: "Client", value: clientName },
    ],
  });
}

export async function notifyHireRequestSent(input: {
  jobId: number;
  jobTitle?: string | null;
  requestId: number;
  clientId: number;
  professionalId: number;
  bidAmount: number;
  duration: string;
}) {
  const jobTitle = input.jobTitle?.trim() || `Job #${input.jobId}`;
  const [clientUser, proUser] = await Promise.all([
    db.user.findUnique({
      where: { id: input.clientId },
      select: { firstName: true, lastName: true },
    }),
    db.user.findUnique({
      where: { id: input.professionalId },
      select: { firstName: true, lastName: true },
    }),
  ]);
  const clientName = clientUser ? `${clientUser.firstName} ${clientUser.lastName}`.trim() : "A client";
  const proName = proUser ? `${proUser.firstName} ${proUser.lastName}`.trim() : "A professional";

  // 1. Notify Professional
  const offerStr = `₹${input.bidAmount.toLocaleString("en-IN")}`;
  await notifyUsers([input.professionalId], {
    type: "NEW_HIRE_REQUEST",
    title: `${jobTitle} · New hire request`,
    description: `${clientName} sent you a hire request for ${jobTitle} (${offerStr}).`,
    href: `/job/${input.jobId}?requestId=${input.requestId}`,
    templateVariables: {
      prof_name: proName,
      professional_name: proName,
      client_name: clientName,
      job_title: jobTitle,
      project_title: jobTitle,
      job_id: input.jobId,
      budget: offerStr,
      amount: offerStr,
      job_location: "Direct Hire Offer",
    },
    emailDetails: [
      { label: "Job", value: jobTitle },
      { label: "Offered amount", value: offerStr },
      { label: "Timeline", value: input.duration },
    ],
  });

}

export async function notifyVerificationStatus(input: {
  userId: number;
  provider: string;
  isApproved: boolean;
  rejectionReason?: string;
}) {
  const title = input.isApproved ? "Identity Verification Approved" : "Identity Verification Rejected";
  const reason =
    input.rejectionReason?.trim() ||
    "Submitted verification documents did not match requirements. Please upload a clear valid document.";
  const description = input.isApproved
    ? `Your ${input.provider} verification has been approved. Your profile now shows the verified badge.`
    : `Your ${input.provider} verification was reviewed and not approved: ${reason}`;

  await notifyUsers([input.userId], {
    type: input.isApproved ? "VERIFICATION_APPROVED" : "VERIFICATION_REJECTED",
    title,
    description,
    href: "/verification",
    transactional: true,
    templateVariables: {
      rejection_reason: reason,
    },
    ...(input.isApproved ? {} : { emailDetails: [{ label: "Reason / Notes", value: reason }] }),
  });

  await notifyRole("ADMIN", {
    type: "VERIFICATION_REVIEWED",
    title: `Verification ${input.isApproved ? "Approved" : "Rejected"}`,
    description: `User verification #${input.userId} (${input.provider}) marked as ${input.isApproved ? "APPROVED" : "REJECTED"}.`,
    href: `/admin/verifications?userId=${input.userId}`,
  });
}

export async function notifyVerificationSubmitted(input: {
  userId: number;
  provider: string;
}) {
  const user = await db.user.findUnique({
    where: { id: input.userId },
    select: { firstName: true, lastName: true, role: true },
  });
  const name = user ? `${user.firstName} ${user.lastName}`.trim() : `User #${input.userId}`;
  const roleLabel = user?.role === "PROFESSIONAL" ? "Professional" : "Client";


  await notifyRole("ADMIN", {
    type: "VERIFICATION_SUBMITTED",
    title: `New Verification Submitted · ${name}`,
    description: `${name} (${roleLabel}) submitted identity verification documents for review.`,
    href: `/admin/verifications?userId=${input.userId}`,
  });
}

export async function notifyProjectCompleted(input: {
  projectId: number;
  jobTitle?: string | null;
  clientId: number;
  professionalId: number;
}) {
  const jobTitle = input.jobTitle?.trim() || `Project #${input.projectId}`;
  const [clientUser, proUser] = await Promise.all([
    db.user.findUnique({
      where: { id: input.clientId },
      select: { firstName: true, lastName: true },
    }),
    db.user.findUnique({
      where: { id: input.professionalId },
      select: { firstName: true, lastName: true },
    }),
  ]);
  const clientName = clientUser ? `${clientUser.firstName} ${clientUser.lastName}`.trim() : "Client";
  const proName = proUser ? `${proUser.firstName} ${proUser.lastName}`.trim() : "Professional";

  await notifyUsers([input.clientId, input.professionalId], {
    type: "PROJECT_COMPLETED",
    title: `${jobTitle} · Project Completed`,
    description: `Project ${jobTitle} has been successfully completed. You can now leave a review.`,
    href: `/project/${input.projectId}/tracking`,
  });

}

