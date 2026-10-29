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
