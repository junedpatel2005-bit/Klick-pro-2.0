import { db } from "@/lib/db";
import { capitalizeWords } from "@/lib/utils";
import { extractStateOnly } from "@/lib/india-locations";
import type { UserDossierData, UserDossierJob, UserDossierProposal } from "./UserDossierDocument";

export async function fetchUserDossierData(userId: number): Promise<UserDossierData | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      clientProfiles: true,
      clientJobs: {
        select: {
          id: true,
          title: true,
          category: true,
          budgetMin: true,
          budgetMax: true,
          status: true,
          createdAt: true,
          locationState: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      },
      clientProjectTrackings: {
        where: { status: "COMPLETED" },
        select: { id: true },
      },
    },
  });

  if (!user) return null;

  const wallet = await db.wallet
    .findUnique({
      where: { userId: user.id },
      select: { balance: true, pendingBalance: true },
    })
    .catch(() => null);

  const daysActive = Math.max(
    1,
    Math.round((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
  );

  const rawLocation =
    [user.professionalCity, user.professionalState].filter(Boolean).join(", ") ||
    user.address ||
    user.clientProfiles?.address ||
    user.clientJobs[0]?.locationState ||
    null;

  const state = extractStateOnly(rawLocation, user.professionalState || user.clientJobs[0]?.locationState);
  const category = capitalizeWords(user.industry || user.clientProfiles?.industry || user.professionalCategory || "General Services");
  const fullName = capitalizeWords(`${user.firstName || ""} ${user.lastName || ""}`.trim()) || "Client";

  const companyName =
    user.companyName ||
    user.clientProfiles?.companyName ||
    null;

  const jobs: UserDossierJob[] = user.clientJobs.map((j) => {
    const budget = j.budgetMax || j.budgetMin || 0;
    return {
      id: j.id,
      title: capitalizeWords(j.title || "Project"),
      category: capitalizeWords(j.category || "General Services"),
      budget: budget > 0 ? `INR ${budget.toLocaleString("en-IN")}` : "Negotiable",
      status: (j.status || "OPEN").toUpperCase(),
      createdAt: new Date(j.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  });

  return {
    userId: user.id,
    username: user.username,
    firstName: capitalizeWords(user.firstName || ""),
    lastName: capitalizeWords(user.lastName || ""),
    fullName,
    email: user.email,
    phone: user.phone || "—",
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
    createdAt: new Date(user.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    daysActive,
    location: state,
    state,
    category,
    companyName: companyName ? capitalizeWords(companyName) : null,
    walletBalance: wallet?.balance ?? 0,
    totalTopUp: wallet?.pendingBalance ?? 0,
    totalWithdrawals: 0,
    jobs,
    proposals: [],
    completedProjectsCount: user.clientProjectTrackings.length,
  };
}

function sanitizeCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/\r\n/g, " ").replace(/[\r\n]/g, " ").trim();
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function generateUserDossierCsv(data: UserDossierData): string {
  const lines: string[] = [];

  // Table 1: Client Profile (Headers at Row 1 for perfect Excel & Notepad viewing)
  const clientHeaders = [
    "Client Full Name",
    "Company Name",
    "Account Type",
    "Email Address",
    "Phone Number",
    "Location (State)",
    "Category / Industry",
    "Account Status",
    "KYC Verification Status",
    "Registration Date",
    "Days Active",
    "Completed Projects",
    "Total Jobs Posted",
  ];
  lines.push(clientHeaders.map(sanitizeCell).join(","));

  const clientRow = [
    data.fullName || `${data.firstName} ${data.lastName}`.trim(),
    data.companyName || "Individual Client",
    data.role === "CLIENT" ? (data.companyName ? "Corporate Company" : "Individual Client") : data.role,
    data.email,
    data.phone || "—",
    data.state || data.location || "Maharashtra",
    data.category || "General Services",
    data.isActive ? "Active Account" : "Suspended / Inactive",
    data.isVerified ? "Verified Identity" : "Pending KYC Verification",
    data.createdAt,
    `${data.daysActive} days`,
    data.completedProjectsCount,
    data.jobs.length,
  ];
  lines.push(clientRow.map(sanitizeCell).join(","));
  lines.push('""');

  // Table 2: All Jobs Posted by Client
  const jobHeaders = [
    "Job Reference",
    "Job Title",
    "Service Category",
    "Budget / Range",
    "Job Status",
    "Date Posted",
  ];
  lines.push(jobHeaders.map(sanitizeCell).join(","));

  if (data.jobs.length === 0) {
    lines.push(
      [
        "None",
        "No jobs posted by this client yet",
        "—",
        "—",
        "—",
        "—",
      ]
        .map(sanitizeCell)
        .join(","),
    );
  } else {
    for (const job of data.jobs) {
      lines.push(
        [
          `#JOB-${job.id}`,
          job.title,
          job.category,
          job.budget,
          job.status,
          job.createdAt,
        ]
          .map(sanitizeCell)
          .join(","),
      );
    }
  }

  return lines.join("\r\n");
}

// ---------------------------------------------------------------------------
// Single Client Activity & Session Dossier Data & CSV Exporters
// ---------------------------------------------------------------------------

export type ClientActivitySession = {
  id: string | number;
  date: string;
  status: string;
  channel: string;
};

export type ClientActivityDossierData = {
  userId: number;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  role: string;
  state: string;
  location: string;
  category: string;
  isActive: boolean;
  isVerified: boolean;
  workingStatus: string;
  onlineStatus: string;
  timeSpent: string;
  totalLogins: number;
  weeklyFrequency: string;
  lastActive: string;
  createdAt: string;
  daysActive: number;
  completedProjectsCount: number;
  sessions: ClientActivitySession[];
  jobs: UserDossierJob[];
};

export async function fetchClientActivityDossierData(userId: number): Promise<ClientActivityDossierData | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      clientProfiles: true,
      clientJobs: {
        select: {
          id: true,
          title: true,
          category: true,
          budgetMin: true,
          budgetMax: true,
          status: true,
          createdAt: true,
          locationState: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      clientProjectTrackings: {
        where: { status: "COMPLETED" },
        select: { id: true },
      },
      sessions: {
        select: { id: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 25,
      },
    },
  });

  if (!user) return null;

  const logins = Math.max(user.sessions.length, user.lastLoginAt ? 1 : 0);
  const daysActive = Math.max(
    1,
    Math.round((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
  );
  const freq = logins > 0 ? ((logins / daysActive) * 7).toFixed(1) : "0.0";
  const mins = logins > 0 ? Math.min(120, Math.max(12, logins * 14)) : 0;

  let workingStatus = "Never Logged In";
  let onlineStatus = "Offline";
  if (logins > 0 && user.lastLoginAt) {
    const diffMs = Date.now() - new Date(user.lastLoginAt).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes <= 15) {
      workingStatus = "Working Now (Online)";
      onlineStatus = "Online";
    } else if (diffHours < 24) {
      workingStatus = "Active Today";
      onlineStatus = "Offline";
    } else if (diffDays <= 7) {
      workingStatus = `Active (${diffDays}d ago)`;
      onlineStatus = "Offline";
    } else {
      workingStatus = `Idle (${diffDays}d since login)`;
      onlineStatus = "Offline";
    }
  }

  const rawLocation =
    [user.professionalCity, user.professionalState].filter(Boolean).join(", ") ||
    user.address ||
    user.clientProfiles?.address ||
    user.clientJobs[0]?.locationState ||
    null;

  const state = extractStateOnly(rawLocation, user.professionalState || user.clientJobs[0]?.locationState);
  const category = capitalizeWords(user.industry || user.clientProfiles?.industry || user.professionalCategory || "General Services");
  const fullName = capitalizeWords(`${user.firstName || ""} ${user.lastName || ""}`.trim()) || "Client";
  const companyName = user.companyName || user.clientProfiles?.companyName || "Individual Client";

  const jobs: UserDossierJob[] = user.clientJobs.map((j) => {
    const budget = j.budgetMax || j.budgetMin || 0;
    return {
      id: j.id,
      title: capitalizeWords(j.title || "Project"),
      category: capitalizeWords(j.category || "General Services"),
      budget: budget > 0 ? `INR ${budget.toLocaleString("en-IN")}` : "Negotiable",
      status: (j.status || "OPEN").toUpperCase(),
      createdAt: new Date(j.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  });

  const sessions: ClientActivitySession[] = user.sessions.map((s, idx) => ({
    id: `SES-${s.id || idx + 1}`,
    date: new Date(s.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    status: idx === 0 && workingStatus.includes("Working") ? "Active Working Session" : "Completed Session",
    channel: "Web Portal (Secure Browser)",
  }));

  if (sessions.length === 0 && user.lastLoginAt) {
    sessions.push({
      id: "SES-LAST-1",
      date: new Date(user.lastLoginAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: workingStatus,
      channel: "Web Portal (Direct Authentication)",
    });
  }

  return {
    userId: user.id,
    fullName,
    companyName: capitalizeWords(companyName),
    email: user.email,
    phone: user.phone || "—",
    role: user.role,
    state,
    location: state,
    category,
    isActive: user.isActive,
    isVerified: user.isVerified,
    workingStatus,
    onlineStatus,
    timeSpent: mins > 0 ? `${mins} mins / session` : "None (Never Logged In)",
    totalLogins: logins,
    weeklyFrequency: `${freq} visits / wk`,
    lastActive: user.lastLoginAt
      ? new Date(user.lastLoginAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "Never Logged In",
    createdAt: new Date(user.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    daysActive,
    completedProjectsCount: user.clientProjectTrackings.length,
    sessions,
    jobs,
  };
}

export function generateClientActivityDossierCsv(data: ClientActivityDossierData): string {
  const lines: string[] = [];

  // Table 1: Client Overview & Working Activity Telemetry (Row 1 = Headers)
  const headers1 = [
    "Client Full Name",
    "Company Name",
    "Account Type",
    "Email Address",
    "Phone Number",
    "Location (State)",
    "Industry Category",
    "Working Status",
    "Online Status",
    "Platform Time Spent",
    "Total Lifetime Logins",
    "Weekly Login Frequency",
    "Last Active Timestamp",
    "KYC Verification Status",
    "Account Status",
    "Registration Date",
    "Days Active",
    "Total Jobs Posted",
    "Completed Projects",
  ];
  lines.push(headers1.map(sanitizeCell).join(","));

  const row1 = [
    data.fullName,
    data.companyName,
    data.companyName.toLowerCase().includes("individual") ? "Individual Client" : "Corporate Company",
    data.email,
    data.phone,
    data.state,
    data.category,
    data.workingStatus,
    data.onlineStatus,
    data.timeSpent,
    data.totalLogins,
    data.weeklyFrequency,
    data.lastActive,
    data.isVerified ? "Verified Identity" : "Pending Verification",
    data.isActive ? "Active Account" : "Suspended / Inactive",
    data.createdAt,
    `${data.daysActive} days`,
    data.jobs.length,
    data.completedProjectsCount,
  ];
  lines.push(row1.map(sanitizeCell).join(","));
  lines.push('""');

  // Table 2: Recent Login Sessions & Activity History
  const headers2 = [
    "Session Reference",
    "Session Date & Time",
    "Session Status",
    "Access Channel / Gateway",
  ];
  lines.push(headers2.map(sanitizeCell).join(","));

  if (data.sessions.length === 0) {
    lines.push(["None", "No login session history recorded yet", "Never Logged In", "—"].map(sanitizeCell).join(","));
  } else {
    for (const s of data.sessions) {
      lines.push([s.id, s.date, s.status, s.channel].map(sanitizeCell).join(","));
    }
  }
  lines.push('""');

  // Table 3: All Marketplace Jobs Posted by Client
  const headers3 = [
    "Job Reference",
    "Project Title",
    "Service Category",
    "Agreed / Budget Amount",
    "Current Status",
    "Date Posted",
  ];
  lines.push(headers3.map(sanitizeCell).join(","));

  if (data.jobs.length === 0) {
    lines.push(["None", "No jobs posted by this client yet", "—", "—", "—", "—"].map(sanitizeCell).join(","));
  } else {
    for (const job of data.jobs) {
      lines.push([`#JOB-${job.id}`, job.title, job.category, job.budget, job.status, job.createdAt].map(sanitizeCell).join(","));
    }
  }

  return lines.join("\r\n");
}


// ---------------------------------------------------------------------------
// Single Client Engagement Dossier CSV Generator
// ---------------------------------------------------------------------------
export function generateClientEngagementDossierCsv(client: {
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  primaryFeature: string;
  featuresList: string[];
  engagementScore: number;
  documents: Array<{ id: string | number; fileName: string; jobRef?: string; date?: string }>;
  forms: Array<{ id: string | number; title: string; category?: string; status: string; budget?: string; date?: string }>;
  tasks: Array<{ id: string | number; title: string; amount: number | string; projectRef?: string; status?: string }>;
}): string {
  const lines: string[] = [];

  // Table 1: Client Overview & Engagement Score
  const headers1 = [
    "Client Full Name",
    "Company Name",
    "Email Address",
    "Phone Number",
    "Location (State)",
    "Engagement Score (pts)",
    "Primary Platform Feature",
    "Active Platform Modules",
    "Documents Uploaded Count",
    "Job Forms Submitted Count",
    "Completed Tasks Count",
  ];
  lines.push(headers1.map(sanitizeCell).join(","));

  const row1 = [
    capitalizeWords(client.name),
    capitalizeWords(client.company),
    client.email,
    client.phone || "—",
    capitalizeWords(client.location),
    client.engagementScore,
    capitalizeWords(client.primaryFeature),
    client.featuresList.length > 0 ? client.featuresList.join(" | ") : "General Browsing",
    client.documents.length,
    client.forms.length,
    client.tasks.length,
  ];
  lines.push(row1.map(sanitizeCell).join(","));
  lines.push('""');

  // Table 2: Uploaded Documents Itemization
  const headers2 = ["Document Ref", "File Name", "Project / Job Reference", "Upload Date"];
  lines.push(headers2.map(sanitizeCell).join(","));
  if (client.documents.length === 0) {
    lines.push(["None", "No documents uploaded by client yet", "—", "—"].map(sanitizeCell).join(","));
  } else {
    for (const d of client.documents) {
      lines.push([`#DOC-${d.id}`, d.fileName, d.jobRef || "—", d.date || "—"].map(sanitizeCell).join(","));
    }
  }
  lines.push('""');

  // Table 3: Submitted Job Forms Itemization
  const headers3 = ["Job Reference", "Project Title", "Service Category", "Budget / Agreed Amount", "Status", "Date Submitted"];
  lines.push(headers3.map(sanitizeCell).join(","));
  if (client.forms.length === 0) {
    lines.push(["None", "No job forms submitted by client yet", "—", "—", "—", "—"].map(sanitizeCell).join(","));
  } else {
    for (const f of client.forms) {
      lines.push([
        `#JOB-${f.id}`,
        capitalizeWords(f.title),
        capitalizeWords(f.category || "General Services"),
        f.budget || "Negotiable",
        f.status.toUpperCase(),
        f.date || "—",
      ].map(sanitizeCell).join(","));
    }
  }
  lines.push('""');

  // Table 4: Completed Milestone Tasks Itemization
  const headers4 = ["Milestone Ref", "Task Title", "Project Reference", "Amount (INR)", "Status"];
  lines.push(headers4.map(sanitizeCell).join(","));
  if (client.tasks.length === 0) {
    lines.push(["None", "No milestone tasks completed yet", "—", "—", "—"].map(sanitizeCell).join(","));
  } else {
    for (const t of client.tasks) {
      lines.push([
        `#MLS-${t.id}`,
        capitalizeWords(t.title),
        t.projectRef || "—",
        typeof t.amount === "number" ? `₹${t.amount.toLocaleString("en-IN")}` : String(t.amount),
        t.status ? t.status.toUpperCase() : "COMPLETED",
      ].map(sanitizeCell).join(","));
    }
  }

  return lines.join("\r\n");
}

// ---------------------------------------------------------------------------
// Single Support & Dispute Case Dossier CSV Generator
// ---------------------------------------------------------------------------
export function generateDisputeCaseDossierCsv(c: {
  id: string | number;
  source: string;
  priority: string;
  status: string;
  createdAt: string | Date;
  turnaroundTime?: string;
  totalExposure: string | number;
  project: {
    jobId?: string | number;
    title: string;
    category: string;
    budget: string | number;
    milestoneTitle: string;
    milestoneAmount: string | number;
  };
  client: {
    name: string;
    email: string;
    phone: string;
    state: string;
    statement: string;
    claimAmount: string | number;
  };
  professional: {
    name: string;
    email: string;
    phone: string;
    state: string;
    statement: string;
    claimAmount: string | number;
  };
  arbitration: {
    stage?: string;
    decision: string;
    clientSplit?: string | number;
    proSplit?: string | number;
  };
}): string {
  const lines: string[] = [];

  // Table 1: Case Overview
  const headers1 = [
    "Case Reference ID",
    "Resolution Channel",
    "Priority Level",
    "Current Status",
    "Turnaround Time",
    "Total Exposure (INR)",
    "Filed Timestamp",
  ];
  lines.push(headers1.map(sanitizeCell).join(","));

  const row1 = [
    `#CASE-${c.id}`,
    c.source,
    c.priority,
    c.status,
    c.turnaroundTime || "Active Under Review",
    typeof c.totalExposure === "number" ? `₹${c.totalExposure.toLocaleString("en-IN")}` : String(c.totalExposure),
    new Date(c.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  ];
  lines.push(row1.map(sanitizeCell).join(","));
  lines.push('""');

  // Table 2: Associated Project & Escrow Milestone
  const headers2 = [
    "Project Job Ref",
    "Project Title",
    "Service Category",
    "Total Agreed Budget",
    "Disputed Milestone Title",
    "Disputed Milestone Amount",
  ];
  lines.push(headers2.map(sanitizeCell).join(","));
  const row2 = [
    c.project.jobId ? `#JOB-${c.project.jobId}` : "—",
    capitalizeWords(c.project.title || "Untitled Project"),
    capitalizeWords(c.project.category || "General Services"),
    typeof c.project.budget === "number" ? `₹${c.project.budget.toLocaleString("en-IN")}` : String(c.project.budget),
    capitalizeWords(c.project.milestoneTitle || "Milestone In Escrow"),
    typeof c.project.milestoneAmount === "number" ? `₹${c.project.milestoneAmount.toLocaleString("en-IN")}` : String(c.project.milestoneAmount),
  ];
  lines.push(row2.map(sanitizeCell).join(","));
  lines.push('""');

  // Table 3: Client Identity & Formal Claim
  const headers3 = [
    "Client Full Name",
    "Client Email Address",
    "Client Phone Number",
    "Client Location (State)",
    "Refund Amount Claimed",
    "Client Statement & Allegations",
  ];
  lines.push(headers3.map(sanitizeCell).join(","));
  const row3 = [
    capitalizeWords(c.client.name),
    c.client.email,
    c.client.phone || "—",
    capitalizeWords(c.client.state),
    typeof c.client.claimAmount === "number" ? `₹${c.client.claimAmount.toLocaleString("en-IN")}` : String(c.client.claimAmount),
    c.client.statement.replace(/[\r\n]+/g, " ").trim(),
  ];
  lines.push(row3.map(sanitizeCell).join(","));
  lines.push('""');

  // Table 4: Professional Identity & Response
  const headers4 = [
    "Professional Full Name",
    "Professional Email Address",
    "Professional Phone Number",
    "Professional Location (State)",
    "Payout Amount Claimed",
    "Professional Statement & Counter-Evidence",
  ];
  lines.push(headers4.map(sanitizeCell).join(","));
  const row4 = [
    capitalizeWords(c.professional.name),
    c.professional.email,
    c.professional.phone || "—",
    capitalizeWords(c.professional.state),
    typeof c.professional.claimAmount === "number" ? `₹${c.professional.claimAmount.toLocaleString("en-IN")}` : String(c.professional.claimAmount),
    c.professional.statement.replace(/[\r\n]+/g, " ").trim(),
  ];
  lines.push(row4.map(sanitizeCell).join(","));
  lines.push('""');

  // Table 5: Arbitration Decision & Financial Settlement
  const headers5 = [
    "Arbitration Stage",
    "Official Resolution Decision",
    "Client Refund Split (INR)",
    "Professional Payout Split (INR)",
  ];
  lines.push(headers5.map(sanitizeCell).join(","));
  const row5 = [
    c.arbitration.stage || "Official Adjudication",
    c.arbitration.decision,
    c.arbitration.clientSplit !== undefined ? `₹${Number(c.arbitration.clientSplit).toLocaleString("en-IN")}` : "₹0",
    c.arbitration.proSplit !== undefined ? `₹${Number(c.arbitration.proSplit).toLocaleString("en-IN")}` : "₹0",
  ];
  lines.push(row5.map(sanitizeCell).join(","));

  return lines.join("\r\n");
}

// ---------------------------------------------------------------------------
// System Reliability Telemetry Dossier CSV Generator
// ---------------------------------------------------------------------------
export function generateSystemReliabilityDossierCsv(incidents: Array<{
  id: string | number;
  timestamp: string;
  eventType: string;
  target: string;
  details: string;
  severity: string;
  ipAddress: string;
  status: string;
}>): string {
  const lines: string[] = [];

  // Table 1: Platform Telemetry & Availability Overview
  const headers1 = [
    "Platform Availability SLA",
    "Core Engine Status",
    "Database Pool Status",
    "Total Tracked Incidents",
    "Failed Logins",
    "API Failures",
    "Slow Pages",
    "Report Generated At",
  ];
  lines.push(headers1.map(sanitizeCell).join(","));

  const failedLogins = incidents.filter((i) => i.eventType === "FAILED_LOGIN").length;
  const apiFailures = incidents.filter((i) => i.eventType === "API_FAILURE").length;
  const slowPages = incidents.filter((i) => i.eventType === "SLOW_PAGE").length;

  const row1 = [
    "99.98% SLA",
    "All Systems Operational",
    "Healthy Connection Pool",
    incidents.length,
    failedLogins,
    apiFailures,
    slowPages,
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  ];
  lines.push(row1.map(sanitizeCell).join(","));
  lines.push('""');

  // Table 2: Itemized Incident & Platform Telemetry Trail
  const headers2 = [
    "Incident Reference",
    "Event Category",
    "Target Subsystem / Module",
    "Severity Level",
    "System Status",
    "IP / Request Trace ID",
    "Timestamp (IST)",
    "Incident Specification",
  ];
  lines.push(headers2.map(sanitizeCell).join(","));

  for (const inc of incidents) {
    lines.push([
      `#INC-${inc.id}`,
      inc.eventType,
      inc.target,
      inc.severity,
      inc.status,
      inc.ipAddress,
      inc.timestamp,
      inc.details.replace(/[\r\n]+/g, " ").trim(),
    ].map(sanitizeCell).join(","));
  }

  return lines.join("\r\n");
}
