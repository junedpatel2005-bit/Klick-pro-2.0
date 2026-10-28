import { db } from "@/lib/db";
import { capitalizeWords } from "@/lib/utils";
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

  const location =
    [user.professionalCity, user.professionalState].filter(Boolean).join(", ") ||
    user.address ||
    user.clientProfiles?.address ||
    null;

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
    location: location ? capitalizeWords(location) : null,
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

  // Executive Metadata Header
  lines.push([sanitizeCell("KLICK-PRO ENTERPRISE PLATFORM"), sanitizeCell("INDIVIDUAL CLIENT DOSSIER STATEMENT")].join(","));
  lines.push([sanitizeCell("Document Type"), sanitizeCell("Comprehensive Client Dossier & Activity Audit")].join(","));
  lines.push([sanitizeCell("Export Generated At"), sanitizeCell(new Date().toLocaleString("en-IN"))].join(","));
  lines.push('""');

  // Section 1: Client Overview
  lines.push([sanitizeCell("Section"), sanitizeCell("Client Account Profile & KYC Overview")].join(","));
  const overviewPairs: [string, string | number][] = [
    ["Client User ID", `#USR-${data.userId}`],
    ["Full Legal Name", `${data.firstName} ${data.lastName}`.trim()],
    ["Username / Handle", data.username ? `@${data.username}` : "—"],
    ["Account Role", data.role],
    ["Email Address", data.email],
    ["Phone Number", data.phone || "—"],
    ["Company Name", data.companyName || "Individual Client"],
    ["Location / Address", data.location || "Pan-India"],
    ["Account Status", data.isActive ? "Active Account" : "Suspended / Inactive"],
    ["KYC Verification Status", data.isVerified ? "Verified Identity" : "Pending KYC Verification"],
    ["Registered Date", data.createdAt],
    ["Days Active / Tenure", `${data.daysActive} days`],
    ["Completed Projects", data.completedProjectsCount],
    ["Total Jobs Posted", data.jobs.length],
    ["Available Wallet Balance (INR)", `₹${data.walletBalance.toLocaleString("en-IN")}`],
    ["Escrow / Pending Deposits (INR)", `₹${data.totalTopUp.toLocaleString("en-IN")}`],
  ];

  for (const [k, v] of overviewPairs) {
    lines.push([sanitizeCell(k), sanitizeCell(v)].join(","));
  }
  lines.push('""');

  // Section 2: All Jobs Posted by Client
  lines.push([sanitizeCell("Section"), sanitizeCell(`All Jobs & Projects Posted by Client (${data.jobs.length})`)].join(","));
  lines.push(
    [
      sanitizeCell("Job Reference"),
      sanitizeCell("Job Title"),
      sanitizeCell("Service Category"),
      sanitizeCell("Budget / Range"),
      sanitizeCell("Job Status"),
      sanitizeCell("Date Posted"),
    ].join(","),
  );

  if (data.jobs.length === 0) {
    lines.push(
      [
        sanitizeCell("—"),
        sanitizeCell("No jobs posted by this client yet"),
        sanitizeCell("—"),
        sanitizeCell("—"),
        sanitizeCell("—"),
        sanitizeCell("—"),
      ].join(","),
    );
  } else {
    for (const job of data.jobs) {
      lines.push(
        [
          sanitizeCell(`#JOB-${job.id}`),
          sanitizeCell(job.title),
          sanitizeCell(job.category),
          sanitizeCell(job.budget),
          sanitizeCell(job.status),
          sanitizeCell(job.createdAt),
        ].join(","),
      );
    }
  }
  lines.push('""');

  return lines.join("\r\n");
}
