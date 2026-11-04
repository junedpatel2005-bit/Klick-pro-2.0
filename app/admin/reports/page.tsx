"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UserPlus,
  Activity,
  Layers,
  ShieldAlert,
  Cpu,
  TrendingUp,
  Briefcase,
  Search,
  Download,
  RefreshCw,
  Calendar,
  X,
  Building2,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  FileText,
  UsersRound,
  BriefcaseBusiness,
  Eye,
} from "lucide-react";
import { capitalizeWords, capitalizeFirst } from "@/lib/utils";
import { downloadCsvFile } from "@/lib/reports/csv/export-csv";
import { ReportKpiCard } from "@/components/reports/ReportKpiCard";
import { AdminUserInspectionDrawer } from "@/components/admin/AdminUserInspectionDrawer";
import { UserManagementView } from "@/components/admin/UserManagementView";
import { OperationsManagementView } from "../operations/page";

// ---------------------------------------------------------------------------
// 3 Master Hubs & Underlying Sub-Reports
// ---------------------------------------------------------------------------
export type MasterGroupKey = "users" | "jobs" | "system-reliability";

export type TabKey =
  | "directory"
  | "client-registrations"
  | "client-activity"
  | "client-engagement"
  | "client-growth"
  | "operations"
  | "support-complaints"
  | "posting-growth"
  | "system-reliability";

export type TimeRange =
  | "all"
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "custom";

export const MASTER_MENUS = [
  {
    id: "users" as const,
    label: "User Management",
    icon: UsersRound,
    badge: "5 Views",
    description: "User Directory, Registrations, Activity, Engagement & Growth Cohorts for Clients & Professionals",
    defaultTab: "directory" as TabKey,
    reports: [
      { id: "directory" as const, label: "Accounts Directory", icon: UsersRound },
      { id: "client-registrations" as const, label: "New Registrations", icon: UserPlus },
      { id: "client-activity" as const, label: "User Activity", icon: Activity },
      { id: "client-engagement" as const, label: "User Engagement", icon: Layers },
      { id: "client-growth" as const, label: "User Growth", icon: TrendingUp },
    ],
  },
  {
    id: "jobs" as const,
    label: "Job Management",
    icon: BriefcaseBusiness,
    badge: "3 Views",
    description: "Operations Console, Disputes Arbitration, Support Requests, and Posting Growth Velocity",
    defaultTab: "operations" as TabKey,
    reports: [
      { id: "operations" as const, label: "Jobs & Operations", icon: BriefcaseBusiness },
      { id: "support-complaints" as const, label: "Support & Complaints", icon: ShieldAlert },
      { id: "posting-growth" as const, label: "Posting Growth", icon: Briefcase },
    ],
  },
  {
    id: "system-reliability" as const,
    label: "System Reliability",
    icon: Cpu,
    badge: "Single Report",
    description: "Production Server Uptime, Runtime Errors, Login Challenges, and API Latency",
    defaultTab: "system-reliability" as TabKey,
    reports: [
      { id: "system-reliability" as const, label: "Platform Telemetry & Health", icon: Cpu },
    ],
  },
] as const;

export const ALL_REPORTS: Array<{ id: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "directory", label: "Accounts Directory", icon: UsersRound },
  { id: "client-registrations", label: "New Registrations", icon: UserPlus },
  { id: "client-activity", label: "User Activity", icon: Activity },
  { id: "client-engagement", label: "User Engagement", icon: Layers },
  { id: "client-growth", label: "User Growth", icon: TrendingUp },
  { id: "operations", label: "Jobs & Operations", icon: BriefcaseBusiness },
  { id: "support-complaints", label: "Support & Complaints", icon: ShieldAlert },
  { id: "posting-growth", label: "Posting Growth", icon: Briefcase },
  { id: "system-reliability", label: "System Reliability", icon: Cpu },
];

function formatDateSafely(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getBadgeStyle(status: string) {
  const norm = (status || "").toUpperCase();
  if (
    [
      "ONLINE",
      "ACTIVE",
      "RESOLVED",
      "COMPLETED",
      "ALL_SYSTEMS_OPERATIONAL",
      "HIGH",
      "UPTIME",
      "OPERATIONAL",
    ].includes(norm)
  ) {
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
  }
  if (
    [
      "WAITING_RESPONSE",
      "UNDER_REVIEW",
      "PENDING",
      "MEDIUM",
      "WARNING",
      "SLOW_PAGE",
      "CHALLENGED",
      "EXPIRED_CODE",
    ].includes(norm)
  ) {
    return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
  }
  if (["OPEN", "IN_PROGRESS", "RUNNING", "JOB POSTINGS", "URGENT"].includes(norm)) {
    return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
  }
  if (
    [
      "FAILED_LOGIN",
      "API_FAILURE",
      "SERVER_ERROR",
      "LOST",
      "SUSPENDED",
      "CRITICAL",
    ].includes(norm)
  ) {
    return "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";
  }
  return "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30";
}

function AdminReportsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = (searchParams.get("tab") || "").toLowerCase();

  // Resolve active master menu and sub-report from URL query
  const { masterGroup, activeTab }: { masterGroup: MasterGroupKey; activeTab: TabKey } = useMemo(() => {
    if (rawTab === "jobs" || rawTab === "operations") {
      return { masterGroup: "jobs", activeTab: "operations" };
    }
    if (rawTab === "support-complaints" || rawTab === "posting-growth") {
      return { masterGroup: "jobs", activeTab: rawTab as TabKey };
    }
    if (rawTab === "system-reliability" || rawTab === "reliability") {
      return { masterGroup: "system-reliability", activeTab: "system-reliability" };
    }
    if (
      rawTab === "client-registrations" ||
      rawTab === "client-activity" ||
      rawTab === "client-engagement" ||
      rawTab === "client-growth"
    ) {
      return { masterGroup: "users", activeTab: rawTab as TabKey };
    }
    return { masterGroup: "users", activeTab: "directory" };
  }, [rawTab]);

  const currentTab = useMemo(() => ALL_REPORTS.find((t) => t.id === activeTab), [activeTab]);
  const activeMasterMenu = useMemo(() => MASTER_MENUS.find((m) => m.id === masterGroup), [masterGroup]);

  // Dual-role selector for User Management
  const [roleFilter, setRoleFilter] = useState<"ALL" | "CLIENT" | "PROFESSIONAL">("ALL");

  // Deep Details Slide-Over Sheet
  const [inspectUserId, setInspectUserId] = useState<number | null>(null);

  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [search, setSearch] = useState("");
  const [subFilter, setSubFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [downloadingRecordId, setDownloadingRecordId] = useState<string | number | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<"pdf" | "csv" | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [summaryData, setSummaryData] = useState<Record<string, any>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tableRows, setTableRows] = useState<Record<string, any>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newClientsDetails, setNewClientsDetails] = useState<Record<string, any>[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set());

  const handleTabChange = (tab: TabKey) => {
    setSearch("");
    setSubFilter("ALL");
    setPage(1);
    setSelectedRowIds(new Set());
    router.push(`/admin/reports?tab=${tab}`);
  };

  const handleMasterGroupChange = (group: MasterGroupKey) => {
    const targetMenu = MASTER_MENUS.find((m) => m.id === group);
    if (targetMenu) {
      setSearch("");
      setSubFilter("ALL");
      setPage(1);
      setSelectedRowIds(new Set());
      router.push(`/admin/reports?tab=${targetMenu.defaultTab}`);
    }
  };

  const fetchReport = useCallback(async () => {
    if (activeTab === "directory" || activeTab === "operations") {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        report: activeTab,
        timeRange,
      });
      if (masterGroup === "users") {
        params.set("role", roleFilter);
      }
      if (timeRange === "custom") {
        if (customStart) params.set("startDate", customStart);
        if (customEnd) params.set("endDate", customEnd);
      }
      if (search) params.set("search", search);

      const res = await fetch(`/api/v1/admin/reports/analytics?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load report analytics");
      const data = await res.json();
      setSummaryData(data.summary || {});
      setTableRows(Array.isArray(data.rows) ? data.rows : []);
      setNewClientsDetails(Array.isArray(data.newClientsDetails) ? data.newClientsDetails : []);
    } catch (err) {
      console.error("Report fetch error:", err);
      setTableRows([]);
      setNewClientsDetails([]);
      setSummaryData({});
    } finally {
      setLoading(false);
    }
  }, [activeTab, timeRange, customStart, customEnd, search, masterGroup, roleFilter]);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  // Handle client-side search, custom date range, and dropdown filtering
  const filteredRows = useMemo(() => {
    const isClientGrowthDetails = activeTab === "client-growth" && subFilter === "DETAILS";
    const baseRows = isClientGrowthDetails ? newClientsDetails : tableRows;

    let startDateBoundary: Date | null = null;
    let endDateBoundary: Date | null = null;

    if (timeRange === "custom") {
      if (customStart) startDateBoundary = new Date(customStart + "T00:00:00");
      if (customEnd) endDateBoundary = new Date(customEnd + "T23:59:59.999");
    } else if (timeRange === "today") {
      const now = new Date();
      startDateBoundary = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      endDateBoundary = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (timeRange === "yesterday") {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      startDateBoundary = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0, 0);
      endDateBoundary = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59, 999);
    } else if (timeRange === "last7days") {
      startDateBoundary = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === "last30days") {
      startDateBoundary = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else if (timeRange === "thisMonth") {
      const now = new Date();
      startDateBoundary = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    } else if (timeRange === "lastMonth") {
      const now = new Date();
      startDateBoundary = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      endDateBoundary = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    }

    return baseRows.filter((r) => {
      // Date filter check
      if (startDateBoundary || endDateBoundary) {
        const rawDate = r.createdAt || r.lastActive || r.lastActiveAt || r.timestamp || r.date || r.resolvedAt;
        if (rawDate) {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            if (startDateBoundary && d < startDateBoundary) return false;
            if (endDateBoundary && d > endDateBoundary) return false;
          }
        }
      }

      // Sub-filter checks
      if (subFilter !== "ALL" && subFilter !== "DETAILS") {
        if (activeTab === "client-registrations") {
          if (subFilter === "COMPANIES" && !r.isCompany) return false;
          if (subFilter === "INDIVIDUALS" && r.isCompany) return false;
        } else if (activeTab === "client-activity") {
          if (r.status !== subFilter) return false;
        } else if (activeTab === "client-engagement") {
          if (subFilter === "HIGH" && r.engagementScore < 10) return false;
          if (subFilter === "MEDIUM" && (r.engagementScore < 3 || r.engagementScore >= 10)) return false;
          if (subFilter === "LOW" && r.engagementScore >= 3) return false;
        } else if (activeTab === "support-complaints") {
          if (subFilter === "DISPUTE" && r.source !== "Dispute") return false;
          if (subFilter === "SUPPORT" && r.source !== "Support Request") return false;
          if (subFilter === "RESOLVED" && r.status !== "RESOLVED") return false;
          if (subFilter === "OPEN" && r.status === "RESOLVED") return false;
        } else if (activeTab === "system-reliability") {
          if (r.eventType !== subFilter) return false;
        } else if (activeTab === "posting-growth") {
          if (subFilter !== "ALL" && r.status !== subFilter) return false;
        }
      }

      // Search match across all fields
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return Object.values(r).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === "object") return JSON.stringify(val).toLowerCase().includes(q);
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [tableRows, newClientsDetails, subFilter, search, activeTab, timeRange, customStart, customEnd]);

  // Pagination calculation with dynamic pageSize
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Select all matching rows across all pages
  const handleSelectAllAcrossPages = () => {
    const allIds = new Set(filteredRows.map((r, i) => r.id ?? i));
    setSelectedRowIds(allIds);
  };

  // Generate numbered page pills with smart ellipsis
  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (typeof i === "number" && i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (typeof i === "number" && i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      if (typeof i === "number") l = i;
    }

    return rangeWithDots;
  };

  // Select all or individual rows
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedRows.map((r, i) => r.id ?? i));
      setSelectedRowIds(allIds);
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const handleToggleRow = (id: string | number) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // CSV Export handler with Full Info & Metadata
  const handleExportCsv = (selectedOnly = false) => {
    if (activeTab === "directory" || activeTab === "operations") return;
    const rowsToExport = selectedOnly && selectedRowIds.size > 0
      ? filteredRows.filter((r, i) => selectedRowIds.has(r.id ?? i))
      : filteredRows;

    if (rowsToExport.length === 0) {
      alert("No rows available to export.");
      return;
    }

    let filename = `klick-pro-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    let headers: string[] = [];
    let rowsData: (string | number | boolean | null | undefined)[][] = [];

    if (activeTab === "client-registrations") {
      filename = `klick-pro-client-registrations-full.csv`;
      headers = [
        "Client Full Name",
        "Company Name",
        "Account Type",
        "Email Address",
        "Phone Number",
        "Industry Category",
        "Location (State)",
        "KYC Verification Status",
        "Total Jobs Posted",
        "Registration Date & Time",
      ];
      rowsData = rowsToExport.map((r) => [
        capitalizeWords(r.name || "Client"),
        capitalizeWords(r.companyName || r.company || (r.isCompany ? "Corporate Client" : "Individual Client")),
        r.isCompany ? "Corporate Company" : "Individual Client",
        r.email || "—",
        r.phone || "—",
        capitalizeWords(r.industryType || r.category || "General Services"),
        capitalizeWords(r.state || r.location || "Maharashtra"),
        r.isVerified ? "Verified KYC" : "Pending Verification",
        r.jobsCount ?? 0,
        formatDateSafely(r.createdAt),
      ]);
    } else if (activeTab === "client-activity") {
      filename = `klick-pro-client-activity-full.csv`;
      headers = [
        "Client Full Name",
        "Company Name",
        "Email Address",
        "Phone Number",
        "Location (State)",
        "Industry Category",
        "Working Status",
        "Online Status",
        "Time Spent on Platform",
        "Total Lifetime Logins",
        "Weekly Login Frequency",
        "Activity Tier",
        "Last Active Timestamp",
        "Registration Date & Time",
      ];
      rowsData = rowsToExport.map((r) => [
        capitalizeWords(r.name || "Client"),
        capitalizeWords(r.company || "Individual Client"),
        r.email || "—",
        r.phone || "—",
        capitalizeWords(r.state || r.location || "Maharashtra"),
        capitalizeWords(r.category || "General Services"),
        r.workingStatus || (r.status === "ONLINE" ? "Working Now (Online)" : r.status === "ACTIVE" ? "Active Today" : r.status === "IDLE" ? "Idle" : "Never Logged In"),
        r.status === "ONLINE" ? "Online" : "Offline",
        r.timeSpentFormatted || "0m",
        r.totalLogins ?? 0,
        r.loginFrequencyWeekly || "0 logins/wk",
        capitalizeWords(r.activityLevel || "Standard"),
        formatDateSafely(r.lastActiveAt),
        formatDateSafely(r.createdAt),
      ]);
    } else if (activeTab === "client-engagement") {
      filename = `klick-pro-client-engagement-full.csv`;
      headers = [
        "Client Full Name",
        "Company Name",
        "Email Address",
        "Phone Number",
        "Location (State)",
        "Industry Category",
        "Documents Uploaded (Count)",
        "Itemized Uploaded Documents",
        "Jobs Posted (Count)",
        "Itemized Posted Jobs",
        "Milestones Completed (Count)",
        "Itemized Completed Milestones",
        "Primary Platform Feature",
        "All Platform Features Used",
        "Engagement Score",
      ];
      rowsData = rowsToExport.map((r) => [
        capitalizeWords(r.name || "Client"),
        capitalizeWords(r.company || "Individual Client"),
        r.email || "—",
        r.phone || "—",
        capitalizeWords(r.state || r.location || "Maharashtra"),
        capitalizeWords(r.category || "General Services"),
        r.documentsUploaded ?? 0,
        String(r.documentsList || "No uploaded documents").replace(/[\r\n]+/g, " ").trim(),
        r.jobsPosted ?? r.formsSubmitted ?? 0,
        String(r.jobsList || r.formsList || "No jobs posted").replace(/[\r\n]+/g, " ").trim(),
        r.tasksCompleted ?? 0,
        String(r.tasksList || "No milestones completed").replace(/[\r\n]+/g, " ").trim(),
        capitalizeWords(r.primaryFeature || "Job Posting Engine"),
        String(r.featuresList || "None").replace(/[\r\n]+/g, " ").trim(),
        r.engagementScore ?? 0,
      ]);
    } else if (activeTab === "support-complaints") {
      filename = `klick-pro-support-complaints-full.csv`;
      headers = [
        "Source Channel",
        "Project / Job Title",
        "Project Category",
        "Project Budget",
        "Disputed Milestone",
        "Disputed Milestone Amount",
        "Client Full Name",
        "Client Email Address",
        "Client Phone Number",
        "Client Location (State)",
        "Client Grievance / Statement",
        "Client Refund Claimed (INR)",
        "Professional Full Name",
        "Professional Email Address",
        "Professional Phone Number",
        "Professional Location (State)",
        "Professional Response Statement",
        "Professional Payout Claimed (INR)",
        "Issue Category",
        "Priority Level",
        "Resolution Status",
        "Arbitration Decision",
        "Average Turnaround Time",
        "Filed Date & Time",
        "Resolution Date & Time",
      ];
      rowsData = rowsToExport.map((r) => [
        r.source,
        capitalizeWords(r.projectDetails?.jobTitle || r.title || "Project"),
        capitalizeWords(r.projectDetails?.category || "General Services"),
        r.projectDetails?.budget || `₹${Number(r.disputedAmount || 0).toLocaleString("en-IN")}`,
        capitalizeWords(r.projectDetails?.milestoneTitle || "General Escrow Milestone"),
        r.projectDetails?.milestoneAmount || `₹${Number(r.disputedAmount || 0).toLocaleString("en-IN")}`,
        capitalizeWords(r.clientDetails?.name || r.reporterName || "Client"),
        r.clientDetails?.email || "—",
        r.clientDetails?.phone || "—",
        capitalizeWords(r.clientDetails?.state || "Maharashtra"),
        String(r.clientDetails?.statement || "Under Arbitration Review").replace(/[\r\n]+/g, " ").trim(),
        `₹${Number(r.clientDetails?.refundClaimed || 0).toLocaleString("en-IN")}`,
        capitalizeWords(r.proDetails?.name || r.respondentName || "Klick-Pro Contractor"),
        r.proDetails?.email || "—",
        r.proDetails?.phone || "—",
        capitalizeWords(r.proDetails?.state || "Maharashtra"),
        String(r.proDetails?.statement || "In Arbitration Review").replace(/[\r\n]+/g, " ").trim(),
        `₹${Number(r.proDetails?.payoutClaimed || 0).toLocaleString("en-IN")}`,
        capitalizeWords(r.issueType || "Billing & Milestone"),
        r.priority || "MEDIUM",
        r.status || "OPEN",
        String(r.arbitrationDetails?.decision || "Pending Formal Decision").replace(/[\r\n]+/g, " ").trim(),
        r.turnaroundTime || "24h",
        formatDateSafely(r.createdAt),
        formatDateSafely(r.resolvedAt),
      ]);
    } else if (activeTab === "system-reliability") {
      filename = `klick-pro-system-reliability-full.csv`;
      headers = [
        "Incident ID",
        "Event Timestamp",
        "Event Classification",
        "Target Action / Operation",
        "Incident Description & Telemetry",
        "Severity Classification",
        "Origin Request / IP Reference",
        "System Log Status",
      ];
      rowsData = rowsToExport.map((r) => [
        formatDateSafely(r.timestamp),
        r.eventType,
        r.target,
        String(r.details || "").replace(/[\r\n]+/g, " ").trim(),
        r.severity,
        r.ipAddress,
        r.status,
      ]);
    } else if (activeTab === "client-growth") {
      filename = `klick-pro-client-growth-full.csv`;
      const detailedList = (newClientsDetails && newClientsDetails.length > 0)
        ? newClientsDetails
        : (summaryData.newClientsDetails || []);
      const isDetailsMode = subFilter === "DETAILS" || detailedList.length > 0;
      if (isDetailsMode && detailedList.length > 0) {
        headers = [
          "Client Full Name",
          "Company Name",
          "Account Type",
          "Email Address",
          "Phone Number",
          "Location (State)",
          "Industry Category",
          "KYC Verification Status",
          "Total Jobs Posted",
          "Working Status",
          "Registration Date & Time",
          "Cohort Window",
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rowsData = detailedList.map((c: any) => [
          capitalizeWords(c.name || "Client"),
          capitalizeWords(c.company || c.companyName || "Individual Client"),
          c.isCompany ? "Corporate Company" : "Individual Client",
          c.email || "—",
          c.phone || "—",
          capitalizeWords(c.location || c.state || "Maharashtra"),
          capitalizeWords(c.category || c.industry || "General Services"),
          c.isVerified ? "Verified Identity" : "Pending Verification",
          c.jobsCount ?? 0,
          c.status || "Active",
          formatDateSafely(c.createdAt),
          c.cohortWindow || "Current Period",
        ]);
      } else {
        headers = [
          "Cohort Window",
          "Starting Client Base",
          "New Client Registrations",
          "Inactive / Churned Accounts",
          "Net Client Growth Count",
          "Cohort Growth Rate (%)",
        ];
        rowsData = rowsToExport.map((r) => [
          r.cohortPeriod,
          r.startingClients,
          r.newClients,
          r.inactiveClients,
          r.netGrowth,
          r.growthPercent,
        ]);
      }
    } else if (activeTab === "posting-growth") {
      filename = `klick-pro-posting-growth-full.csv`;
      headers = [
        "Project Title",
        "Service Category",
        "Job Description / Scope",
        "Client Owner Full Name",
        "Client Email Address",
        "Client Phone Number",
        "Location (State)",
        "Work Mode",
        "Agreed / Budget Amount (INR)",
        "Budget Min (INR)",
        "Budget Max (INR)",
        "Current Status",
        "Proposals Count",
        "Milestones Count",
        "Creation Date & Time",
      ];
      rowsData = rowsToExport.map((r) => [
        capitalizeWords(r.title || "Untitled Project"),
        capitalizeWords(r.category || "General Services"),
        String(r.description || "Scope defined under professional contract agreement").replace(/[\r\n]+/g, " ").trim(),
        capitalizeWords(r.clientName || "Client"),
        r.clientEmail || "—",
        r.clientPhone || "—",
        capitalizeWords(r.location || "Maharashtra"),
        r.workMode || "REMOTE",
        `₹${Number(r.budget || 0).toLocaleString("en-IN")}`,
        `₹${Number(r.budgetMin || 0).toLocaleString("en-IN")}`,
        `₹${Number(r.budgetMax || 0).toLocaleString("en-IN")}`,
        r.status || "OPEN",
        r.proposalsCount ?? 0,
        r.milestonesCount ?? 0,
        formatDateSafely(r.createdAt),
      ]);
    }

    const metadata = [
      { label: "Report Dashboard", value: ALL_REPORTS.find((t) => t.id === activeTab)?.label || "Report" },
      { label: "Export Scope", value: selectedOnly ? `Selected Rows (${rowsToExport.length})` : "Full Table Filtered" },
      { label: "Time Range Preset", value: timeRange === "custom" ? `${customStart || "Start"} to ${customEnd || "End"}` : timeRange },
      { label: "Active Sub-Filter", value: subFilter },
      { label: "Search Filter", value: search || "None" },
      { label: "Export Generated At", value: new Date().toLocaleString("en-IN") },
    ];

    downloadCsvFile({
      filename,
      title: `${ALL_REPORTS.find((t) => t.id === activeTab)?.label || "Report"} — Complete Enterprise Data`,
      metadata,
      headers,
      rows: rowsData,
      includeMetadataBanner: false,
    });
  };

  const handleExportPdf = async (selectedOnly = false) => {
    if (activeTab === "directory" || activeTab === "operations") return;
    setExportingPdf(true);
    try {
      const isClientGrowthCohorts = activeTab === "client-growth" && subFilter !== "DETAILS";
      const effectiveSelectedOnly = isClientGrowthCohorts ? false : selectedOnly;
      let ids: Array<string | number> | undefined = effectiveSelectedOnly && selectedRowIds.size > 0
        ? Array.from(selectedRowIds)
        : undefined;

      // If exporting full table but filters are active, export the exact matching filtered IDs
      if (!effectiveSelectedOnly && filteredRows.length > 0 && (search || timeRange !== "all" || subFilter !== "ALL")) {
        ids = filteredRows.map((r, i) => r.id ?? i);
      }

      const res = await fetch(`/api/v1/admin/reports/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: ids && ids.length > 0 ? "selected" : "all",
          ids: ids ? ids.map(String) : [],
          pageSize: "A4",
          orientation: "landscape",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Failed to generate PDF report.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `klick-pro-${activeTab}-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "PDF generation failed. Please try again.");
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportSingleRecord = async (
    recordId: string | number,
    format: "pdf" | "csv" = "pdf",
  ) => {
    if (activeTab === "directory" || activeTab === "operations") return;
    // In Client Growth Cohorts view, rows are weekly intervals, not individual user IDs
    if (activeTab === "client-growth" && subFilter !== "DETAILS") {
      if (format === "csv") {
        handleExportCsv(false);
      } else {
        void handleExportPdf(false);
      }
      return;
    }

    setDownloadingRecordId(recordId);
    setDownloadingFormat(format);
    try {
      const res = await fetch(`/api/v1/admin/reports/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: "selected",
          ids: [String(recordId)],
          format,
          pageSize: "A4",
          orientation: "landscape",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Failed to generate record ${format.toUpperCase()} dossier.`);
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      let filename = `klick-pro-${activeTab}-${recordId}-dossier.${format}`;
      if (disposition) {
        const match = disposition.match(/filename=["']?([^"';]+)["']?/i);
        if (match?.[1]) filename = match[1];
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : `Failed to export dossier in ${format.toUpperCase()}. Please try again.`);
    } finally {
      setDownloadingRecordId(null);
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-screen text-slate-900 dark:text-slate-100">
      {/* ----------------------------------------------------------------- */}
      {/* HEADER SECTION & 3 MASTER MENUS                                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
              <span>Admin Reports Console</span>
              <span>/</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                {activeMasterMenu?.label || "Reports"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {activeMasterMenu?.label || "Admin Reports"}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeMasterMenu?.description || "Enterprise analytics and real-time audit data for the marketplace."}
            </p>
          </div>
        </div>

        {/* The 3 Primary Master Menus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MASTER_MENUS.map((menu) => {
            const Icon = menu.icon;
            const isSelected = masterGroup === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => handleMasterGroupChange(menu.id)}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-xs ring-1 ring-indigo-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {menu.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-indigo-200/70 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {menu.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {menu.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-Tabs for Active Master Menu & Dual Role Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {activeMasterMenu?.reports.map((r) => {
              const SubIcon = r.icon;
              const isSubActive = activeTab === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleTabChange(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isSubActive
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700"
                  }`}
                >
                  <SubIcon className="h-3.5 w-3.5" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Role Filter Selector for User Management (Analytics Reports) */}
          {masterGroup === "users" && activeTab !== "directory" && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">
                Role:
              </span>
              <button
                onClick={() => setRoleFilter("ALL")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  roleFilter === "ALL"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setRoleFilter("CLIENT")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  roleFilter === "CLIENT"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Clients Only
              </button>
              <button
                onClick={() => setRoleFilter("PROFESSIONAL")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  roleFilter === "PROFESSIONAL"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Professionals Only
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* EMBEDDED CONSOLES FOR DIRECTORY & OPERATIONS                      */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === "directory" && (
        <UserManagementView onInspectUser={(id) => setInspectUserId(id)} />
      )}

      {activeTab === "operations" && (
        <OperationsManagementView />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* ANALYTICS REPORT VIEWS (KPIs, FILTERS & TABLES)                   */}
      {/* ----------------------------------------------------------------- */}
      {activeTab !== "directory" && activeTab !== "operations" && (
        <>
          {/* ----------------------------------------------------------------- */}
          {/* TOP KPI METRIC CARDS FOR CURRENT TAB                             */}
          {/* ----------------------------------------------------------------- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeTab === "client-registrations" && (
          <>
            <ReportKpiCard
              title="Total New Clients"
              value={summaryData.totalClients ?? 0}
              icon={UserPlus}
              iconBgColor="bg-blue-500/10 text-blue-600"
              definition="This metric tracks the total number of new client accounts registered on the marketplace within the selected time window, measuring customer acquisition pace and incoming demand volume."
            />

            <ReportKpiCard
              title="New Companies"
              value={summaryData.newCompaniesRegistered ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">Corporate & business accounts</div>}
              icon={Building2}
              iconBgColor="bg-purple-500/10 text-purple-600"
              definition="This metric counts verified corporate entities and commercial business accounts registered during the period, helping distinguish high-value enterprise clients from individual homeowners."
            />

            <ReportKpiCard
              title="Top Industry"
              value={summaryData.topIndustry || "General Services"}
              subtitle={<div className="text-xs text-slate-500 mt-1">Primary registration category</div>}
              icon={Briefcase}
              iconBgColor="bg-emerald-500/10 text-emerald-600"
              valueClassName="text-lg font-bold mt-2 truncate text-slate-900 dark:text-white"
              definition="This metric identifies the service sector generating the largest volume of client job postings and registrations, highlighting the primary industry driving marketplace demand."
            />

            <ReportKpiCard
              title="Top State"
              value={summaryData.topLocation || "Maharashtra"}
              subtitle={<div className="text-xs text-slate-500 mt-1">Highest client state concentration</div>}
              icon={MapPin}
              iconBgColor="bg-amber-500/10 text-amber-600"
              valueClassName="text-lg font-bold mt-2 truncate text-slate-900 dark:text-white"
              definition="This metric highlights the Indian state or union territory with the highest concentration of registered client accounts to help guide regional marketing campaigns and professional onboarding."
            />
          </>
        )}

        {activeTab === "client-activity" && (
          <>
            <ReportKpiCard
              title="Active Clients Today"
              value={summaryData.activeClientsToday ?? 0}
              subtitle={
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online & active today
                </div>
              }
              icon={Activity}
              iconBgColor="bg-emerald-500/10 text-emerald-600"
              definition="This metric shows the total number of unique client accounts that logged in, viewed jobs, or initiated platform actions in the past 24 hours, reflecting current daily client engagement."
            />

            <ReportKpiCard
              title="Active Users Today"
              value={summaryData.activeUsersToday ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">Clients & Professionals combined</div>}
              icon={UserPlus}
              iconBgColor="bg-blue-500/10 text-blue-600"
              definition="This metric records the combined count of all active users, including both clients and verified professionals, active on the platform today to measure total ecosystem activity and concurrency."
            />

            <ReportKpiCard
              title="Login Frequency"
              value={summaryData.avgLoginFrequency || "3.2 / week"}
              subtitle={<div className="text-xs text-slate-500 mt-1">Average user visits per week</div>}
              icon={Clock}
              iconBgColor="bg-indigo-500/10 text-indigo-600"
              definition="This metric measures the average number of distinct login and check-in sessions recorded per active user over a rolling seven-day window, serving as a primary indicator of repeat user retention."
            />

            <ReportKpiCard
              title="Time Spent on Platform"
              value={summaryData.avgTimeSpentPlatform || "28 mins / day"}
              subtitle={<div className="text-xs text-slate-500 mt-1">Estimated session duration</div>}
              icon={Clock}
              iconBgColor="bg-purple-500/10 text-purple-600"
              definition="This metric calculates the estimated average daily session duration per active user across browsing, chatting, and managing project milestones, reflecting overall user engagement."
            />
          </>
        )}

        {activeTab === "client-engagement" && (
          <>
            <ReportKpiCard
              title="Documents Uploaded"
              value={summaryData.documentsUploaded ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">Contracts, briefs & deliverables</div>}
              icon={Layers}
              iconBgColor="bg-blue-500/10 text-blue-600"
              definition="This metric counts all project briefs, architectural blueprints, deliverables, and legal contracts uploaded by users during this period, measuring collaborative project execution depth."
            />

            <ReportKpiCard
              title="Jobs Posted"
              value={summaryData.jobsPosted ?? summaryData.formsSubmitted ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">Published client job requests</div>}
              icon={Briefcase}
              iconBgColor="bg-purple-500/10 text-purple-600"
              definition="This metric tracks the total number of job postings, project specifications, and hiring briefs published by clients on the marketplace."
            />

            <ReportKpiCard
              title="Milestones Completed"
              value={summaryData.tasksCompleted ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">Approved project milestones</div>}
              icon={CheckCircle2}
              iconBgColor="bg-emerald-500/10 text-emerald-600"
              definition="This metric tracks the total number of project milestones and deliverables successfully reviewed, fulfilled, and approved by clients during this reporting period."
            />

            <ReportKpiCard
              title="Features Used"
              value={summaryData.featuresUsedAcrossClients ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">Escrow, Chat, Milestones, Reviews</div>}
              icon={Layers}
              iconBgColor="bg-amber-500/10 text-amber-600"
              definition="This metric shows the variety of core platform modules actively utilized by clients during this period, including secure escrow payments, live messaging, milestone tracking, and verified reviews."
            />
          </>
        )}

        {activeTab === "support-complaints" && (
          <>
            <ReportKpiCard
              title="New Issues Reported"
              value={summaryData.newIssuesReported ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">Disputes & support tickets</div>}
              icon={ShieldAlert}
              iconBgColor="bg-rose-500/10 text-rose-600"
              definition="This metric tracks the total number of new support inquiries, dispute tickets, and arbitration requests filed by users during the selected reporting window, indicating intake volume."
            />

            <ReportKpiCard
              title="Pending Issues"
              value={summaryData.pendingIssues ?? 0}
              subtitle={<div className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">Awaiting review / arbitration</div>}
              icon={Clock}
              iconBgColor="bg-amber-500/10 text-amber-600"
              definition="This metric shows the total count of unresolved support requests and active arbitration cases currently in the operational queue awaiting review or administrative action."
            />

            <ReportKpiCard
              title="Resolved Issues"
              value={summaryData.resolvedIssues ?? 0}
              subtitle={<div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Closed cases & settlements</div>}
              icon={CheckCircle2}
              iconBgColor="bg-emerald-500/10 text-emerald-600"
              definition="This metric records the total number of customer issues, support tickets, and arbitration disputes successfully mediated, settled, and closed within the reporting period."
            />

            <ReportKpiCard
              title="Average Response Time"
              value={summaryData.avgResponseTime || "3.5 hours"}
              subtitle={<div className="text-xs text-slate-500 mt-1">First-response turnaround</div>}
              icon={Clock}
              iconBgColor="bg-indigo-500/10 text-indigo-600"
              definition="This metric calculates the average turnaround time between an issue or dispute being filed and the first administrative response or resolution, reflecting customer support responsiveness."
            />
          </>
        )}

        {activeTab === "system-reliability" && (
          <>
            <ReportKpiCard
              title="System Uptime"
              value={summaryData.uptime || "99.96%"}
              subtitle={
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> High availability
                </div>
              }
              icon={Cpu}
              iconBgColor="bg-emerald-500/10 text-emerald-600"
              definition="This metric measures the percentage of total time the production application, APIs, and database services remained fully operational without unplanned downtime during the monitoring window."
            />

            <ReportKpiCard
              title="System Errors"
              value={summaryData.errors ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">Logged runtime exceptions</div>}
              icon={AlertTriangle}
              iconBgColor="bg-rose-500/10 text-rose-600"
              definition="This metric logs the total count of unhandled software exceptions, server-side 5xx errors, and database transaction failures recorded during the reporting period to monitor software stability."
            />

            <ReportKpiCard
              title="Failed Logins"
              value={summaryData.failedLogins ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">Authentication challenges</div>}
              icon={ShieldAlert}
              iconBgColor="bg-amber-500/10 text-amber-600"
              definition="This metric records the number of unsuccessful sign-in attempts caused by incorrect credentials, expired one-time passwords, or security rate limits, helping detect potential security threats."
            />

            <ReportKpiCard
              title="API Failures & Latency"
              value={summaryData.apiFailures ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">Slow queries: {summaryData.slowPages ?? 0}</div>}
              icon={Cpu}
              iconBgColor="bg-purple-500/10 text-purple-600"
              definition="This metric tracks server API endpoints that returned errors or experienced database query processing times longer than 1000 milliseconds, identifying performance bottlenecks before users are impacted."
            />
          </>
        )}

        {activeTab === "client-growth" && (
          <>
            <ReportKpiCard
              title="Total Clients"
              value={summaryData.totalClients ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">All-time client accounts</div>}
              icon={TrendingUp}
              iconBgColor="bg-blue-500/10 text-blue-600"
              definition="This metric represents the cumulative lifetime number of client accounts registered on the marketplace since platform launch, benchmarking overall platform scale and customer base expansion."
            />

            <ReportKpiCard
              title="New Clients This Week"
              value={summaryData.newClientsThisWeek ?? 0}
              subtitle={
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Recent acquisitions
                </div>
              }
              icon={UserPlus}
              iconBgColor="bg-emerald-500/10 text-emerald-600"
              definition="This metric measures the number of new client accounts created within the current seven-day rolling window, tracking short-term user acquisition velocity and campaign impact."
            />

            <ReportKpiCard
              title="Lost / Inactive Clients"
              value={summaryData.lostClients ?? 0}
              subtitle={<div className="text-xs text-rose-500 mt-1">Dormant (&gt; 30 days inactivity)</div>}
              icon={TrendingUp}
              iconBgColor="bg-rose-500/10 text-rose-600"
              definition="This metric identifies client accounts that have recorded no logins, job posts, or active project interactions for more than thirty consecutive days, serving as an early indicator of user churn."
            />

            <ReportKpiCard
              title="Net Growth %"
              value={summaryData.growthPercent || "+0.0%"}
              subtitle={<div className="text-xs text-slate-500 mt-1">Net customer acquisition trend</div>}
              icon={TrendingUp}
              iconBgColor="bg-indigo-500/10 text-indigo-600"
              valueClassName="text-2xl font-bold mt-2 text-indigo-600 dark:text-indigo-400"
              definition="This metric calculates the net percentage expansion of the client user base by factoring in newly registered clients against dormant or lost accounts over the period."
            />
          </>
        )}

        {activeTab === "posting-growth" && (
          <>
            <ReportKpiCard
              title="Total Postings"
              value={summaryData.totalPostings ?? 0}
              subtitle={<div className="text-xs text-slate-500 mt-1">All-time jobs & project requests</div>}
              icon={Briefcase}
              iconBgColor="bg-blue-500/10 text-blue-600"
              definition="This metric represents the cumulative lifetime number of job requests, tenders, and project briefs published by clients on the platform since inception, measuring total work opportunity supply."
            />

            <ReportKpiCard
              title="Postings This Week"
              value={summaryData.postingsThisWeek ?? 0}
              subtitle={
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Recent volume
                </div>
              }
              icon={Activity}
              iconBgColor="bg-emerald-500/10 text-emerald-600"
              definition="This metric counts the total number of new job requests and project opportunities published by clients over the last seven calendar days, reflecting immediate hiring demand."
            />

            <ReportKpiCard
              title="Posting Growth Rate"
              value={summaryData.growthRatePercent || "+0.0%"}
              subtitle={<div className="text-xs text-slate-500 mt-1">Growth vs prior equal window</div>}
              icon={TrendingUp}
              iconBgColor="bg-indigo-500/10 text-indigo-600"
              valueClassName="text-2xl font-bold mt-2 text-indigo-600 dark:text-indigo-400"
              definition="This metric shows the percentage change in job postings created compared to the immediately preceding time window, measuring whether platform work volume is accelerating or decelerating."
            />

            <ReportKpiCard
              title="Top Growing Category"
              value={summaryData.topCategory || "All Categories"}
              subtitle={<div className="text-xs text-slate-500 mt-1">Highest market demand</div>}
              icon={Layers}
              iconBgColor="bg-purple-500/10 text-purple-600"
              valueClassName="text-lg font-bold mt-2 truncate text-slate-900 dark:text-white"
              definition="This metric highlights the specific service category exhibiting the highest percentage increase in new job postings, identifying trending industries and surging market demand."
            />
          </>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* FILTER & SEARCH CONTROL BAR                                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Universal Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search in tab data (name, email, phone, location, status, job, etc.)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Range & Sub-Filters Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(e.target.value as TimeRange);
                  setPage(1);
                }}
                aria-label="Filter report by time range"
                className="bg-transparent border-none text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>

            {/* Custom Date Pickers */}
            {timeRange === "custom" && (
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => {
                    setCustomStart(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Start date filter"
                  className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                />
                <span className="text-slate-400 text-[11px]">to</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => {
                    setCustomEnd(e.target.value);
                    setPage(1);
                  }}
                  aria-label="End date filter"
                  className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                />
              </div>
            )}

            {/* Sub-Filters by Tab */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={subFilter}
                onChange={(e) => {
                  setSubFilter(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter report records"
                className="bg-transparent border-none text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Records</option>
                {activeTab === "client-registrations" && (
                  <>
                    <option value="COMPANIES">Companies Only</option>
                    <option value="INDIVIDUALS">Individuals Only</option>
                  </>
                )}
                {activeTab === "client-activity" && (
                  <>
                    <option value="ONLINE">Online Today</option>
                    <option value="ACTIVE">Active This Week</option>
                    <option value="IDLE">Idle Accounts</option>
                  </>
                )}
                {activeTab === "client-engagement" && (
                  <>
                    <option value="HIGH">High Engagement</option>
                    <option value="MEDIUM">Medium Engagement</option>
                    <option value="LOW">Low Engagement</option>
                  </>
                )}
                {activeTab === "support-complaints" && (
                  <>
                    <option value="OPEN">Open Cases</option>
                    <option value="RESOLVED">Resolved Cases</option>
                    <option value="DISPUTE">Disputes Only</option>
                    <option value="SUPPORT">General Support</option>
                  </>
                )}
                {activeTab === "system-reliability" && (
                  <>
                    <option value="UPTIME">System Uptime</option>
                    <option value="FAILED_LOGIN">Failed Logins</option>
                    <option value="API_FAILURE">API Failures</option>
                    <option value="SERVER_ERROR">Server Errors</option>
                    <option value="SLOW_PAGE">Slow Pages</option>
                  </>
                )}
                {activeTab === "client-growth" && (
                  <>
                    <option value="ALL">Weekly Cohorts View</option>
                    <option value="DETAILS">Detailed Clients Influx</option>
                  </>
                )}
                {activeTab === "posting-growth" && (
                  <>
                    <option value="OPEN">Open Postings</option>
                    <option value="AWARDED">Awarded / Active</option>
                    <option value="COMPLETED">Completed</option>
                  </>
                )}
              </select>
            </div>

            {/* Reset All Filters button */}
            {(search || timeRange !== "all" || subFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearch("");
                  setTimeRange("all");
                  setCustomStart("");
                  setCustomEnd("");
                  setSubFilter("ALL");
                  setPage(1);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline px-1 py-1"
                title="Reset all active filters"
              >
                Clear Filters
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={() => void fetchReport()}
              disabled={loading}
              title="Refresh current report"
              className="p-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
            </button>

            {/* Export CSV Button */}
            <button
              onClick={() => {
                const singleId = Array.from(selectedRowIds)[0];
                if (selectedRowIds.size === 1 && singleId !== undefined) {
                  void handleExportSingleRecord(singleId, "csv");
                } else {
                  handleExportCsv(selectedRowIds.size > 0);
                }
              }}
              disabled={downloadingRecordId !== null}
              title="Export complete detailed CSV spreadsheet"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {downloadingRecordId !== null && downloadingFormat === "csv" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>
                {selectedRowIds.size === 1
                  ? "Dossier CSV"
                  : selectedRowIds.size > 1
                    ? `CSV (${selectedRowIds.size})`
                    : "Export CSV"}
              </span>
            </button>

            {/* Export PDF Button */}
            <button
              onClick={() => {
                const singleId = Array.from(selectedRowIds)[0];
                if (selectedRowIds.size === 1 && singleId !== undefined) {
                  void handleExportSingleRecord(singleId, "pdf");
                } else {
                  void handleExportPdf(selectedRowIds.size > 0);
                }
              }}
              disabled={exportingPdf || downloadingRecordId !== null}
              title="Export complete detailed PDF report dossier"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {exportingPdf || (downloadingRecordId !== null && downloadingFormat === "pdf") ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              <span>
                {exportingPdf || (downloadingRecordId !== null && downloadingFormat === "pdf")
                  ? "Generating..."
                  : selectedRowIds.size === 1
                    ? "Download Dossier (PDF)"
                    : selectedRowIds.size > 1
                      ? `PDF (${selectedRowIds.size})`
                      : "Export PDF"}
              </span>
            </button>
          </div>
        </div>

        {/* Results Counter & Active Filter Summary Strip */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2 px-0.5">
          <div>
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredRows.length}</span> matching records
            {search && <span> for &ldquo;{search}&rdquo;</span>}
            {timeRange === "custom" && customStart && customEnd && (
              <span> from {customStart} to {customEnd}</span>
            )}
          </div>
          {filteredRows.length > 0 && selectedRowIds.size === 0 && (
            <div className="text-slate-400">
              Select rows to export individual or batch dossiers
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* DATA TABLE SECTION                                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Multi-Page Selection Banner */}
        {selectedRowIds.size > 0 && selectedRowIds.size < filteredRows.length && (
          <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-900/60 px-4 py-2.5 text-xs text-blue-700 dark:text-blue-300 flex items-center justify-between transition-all">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>
                All <strong className="font-semibold">{selectedRowIds.size}</strong> records on this page are selected.
              </span>
            </div>
            <button
              onClick={handleSelectAllAcrossPages}
              className="font-bold underline hover:text-blue-900 dark:hover:text-blue-100 transition-colors cursor-pointer text-xs"
            >
              Select all {filteredRows.length} matching records across all pages
            </button>
          </div>
        )}
        {selectedRowIds.size === filteredRows.length && filteredRows.length > paginatedRows.length && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/60 px-4 py-2.5 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between transition-all">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                All <strong className="font-semibold">{filteredRows.length}</strong> matching records across all pages are selected.
              </span>
            </div>
            <button
              onClick={() => setSelectedRowIds(new Set())}
              className="font-bold underline hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-pointer text-xs"
            >
              Clear selection
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium">Loading report metrics & logs...</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <AlertTriangle className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-700" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No records found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or date range.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      aria-label="Select all rows in current page"
                      checked={paginatedRows.length > 0 && paginatedRows.every((r, i) => selectedRowIds.has(r.id ?? i))}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>

                  {activeTab === "client-registrations" && (
                    <>
                      <th className="py-3 px-4">Client Name</th>
                      <th className="py-3 px-4">Company Name</th>
                      <th className="py-3 px-4">Industry Type</th>
                      <th className="py-3 px-4">Location (State)</th>
                      <th className="py-3 px-4">Jobs Posted</th>
                      <th className="py-3 px-4">Registered Date</th>
                    </>
                  )}

                  {activeTab === "client-activity" && (
                    <>
                      <th className="py-3 px-4">Client Full Name</th>
                      <th className="py-3 px-4">Location (State)</th>
                      <th className="py-3 px-4">Working Status</th>
                      <th className="py-3 px-4">Login Frequency</th>
                      <th className="py-3 px-4">Time Spent</th>
                      <th className="py-3 px-4">Activity Level</th>
                      <th className="py-3 px-4">Last Active</th>
                    </>
                  )}

                  {activeTab === "client-engagement" && (
                    <>
                      <th className="py-3 px-4">Client & Company</th>
                      <th className="py-3 px-4">Documents Uploaded</th>
                      <th className="py-3 px-4">Jobs Posted</th>
                      <th className="py-3 px-4">Milestones Completed</th>
                      <th className="py-3 px-4">Primary Feature</th>
                      <th className="py-3 px-4">Features Used</th>
                    </>
                  )}

                  {activeTab === "support-complaints" && (
                    <>
                      <th className="py-3 px-4">Project & Milestone</th>
                      <th className="py-3 px-4">Client Side</th>
                      <th className="py-3 px-4">Professional Side</th>
                      <th className="py-3 px-4">Category & Priority</th>
                      <th className="py-3 px-4">Status & Decision</th>
                      <th className="py-3 px-4">Turnaround</th>
                    </>
                  )}

                  {activeTab === "system-reliability" && (
                    <>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Event Type</th>
                      <th className="py-3 px-4">Target / Action</th>
                      <th className="py-3 px-4">Incident Details</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">IP Address</th>
                    </>
                  )}

                  {activeTab === "client-growth" && (
                    subFilter === "DETAILS" ? (
                      <>
                        <th className="py-3 px-4">Client Full Name</th>
                        <th className="py-3 px-4">Company Name</th>
                        <th className="py-3 px-4">Location (State)</th>
                        <th className="py-3 px-4">Industry Category</th>
                        <th className="py-3 px-4">KYC Status</th>
                        <th className="py-3 px-4">Jobs Posted</th>
                        <th className="py-3 px-4">Registered Date</th>
                      </>
                    ) : (
                      <>
                        <th className="py-3 px-4">Cohort Window</th>
                        <th className="py-3 px-4">Starting Clients</th>
                        <th className="py-3 px-4">New Registrations</th>
                        <th className="py-3 px-4">Inactive / Lost</th>
                        <th className="py-3 px-4">Net Growth</th>
                        <th className="py-3 px-4">Growth %</th>
                      </>
                    )
                  )}

                  {activeTab === "posting-growth" && (
                    <>
                      <th className="py-3 px-4">Job Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Client Owner</th>
                      <th className="py-3 px-4">Location (State)</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Proposals</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date Posted</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedRows.map((row, idx) => {
                  const rowId = row.id ?? idx;
                  const isSelected = selectedRowIds.has(rowId);

                  return (
                    <tr
                      key={rowId}
                      onClick={() => {
                        if (masterGroup === "users" && typeof row.id === "number") {
                          setInspectUserId(row.id);
                        }
                      }}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        masterGroup === "users" && typeof row.id === "number" ? "cursor-pointer hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20" : ""
                      } ${
                        isSelected ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Select row ${rowId}`}
                          checked={isSelected}
                          onChange={() => handleToggleRow(rowId)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* 1. New Client Registrations */}
                      {activeTab === "client-registrations" && (
                        <>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white capitalize hover:text-indigo-600 transition">
                                {row.name}
                              </span>
                              {row.role && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                                  row.role === "PROFESSIONAL"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}>
                                  {row.roleDisplay || row.role}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>{row.email}</span>
                              {row.phone !== "—" && <span>· {row.phone}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium capitalize text-slate-700 dark:text-slate-300">
                            {row.companyName}
                          </td>
                          <td className="py-3 px-4 capitalize text-slate-600 dark:text-slate-400">
                            {row.industryType}
                          </td>
                          <td className="py-3 px-4 capitalize font-medium text-slate-700 dark:text-slate-300">
                            {row.location}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            {row.jobsCount}
                          </td>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {formatDateSafely(row.createdAt)}
                          </td>
                        </>
                      )}

                      {/* 2. Client Activity */}
                      {activeTab === "client-activity" && (
                        <>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white capitalize hover:text-indigo-600 transition">
                                {row.name}
                              </span>
                              {row.role && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                                  row.role === "PROFESSIONAL"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}>
                                  {row.roleDisplay || row.role}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>{row.email}</span>
                              {row.phone !== "—" && <span>· {row.phone}</span>}
                            </div>
                            <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                              {row.company} · {row.category}
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize font-medium text-slate-700 dark:text-slate-300">
                            {row.state || row.location || "Maharashtra"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeStyle(
                                row.status,
                              )}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  row.status === "ONLINE"
                                    ? "bg-emerald-500 animate-pulse"
                                    : row.status === "ACTIVE"
                                      ? "bg-blue-500"
                                      : "bg-slate-400"
                                }`}
                              />
                              {row.status}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {row.workingStatus || (row.status === "ONLINE" ? "Working Now (Online)" : row.status === "ACTIVE" ? "Active This Week" : "Never Logged In")}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                            {row.loginFrequencyWeekly}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                            {row.timeSpentFormatted}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                                row.activityLevel === "High"
                                  ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                                  : row.activityLevel === "Medium"
                                    ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                                    : "bg-slate-500/15 text-slate-600 border-slate-500/30"
                              }`}
                            >
                              {row.activityLevel}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {row.lastActiveAt ? (
                              formatDateSafely(row.lastActiveAt)
                            ) : (
                              <span className="text-slate-400 italic">Never Logged In</span>
                            )}
                          </td>
                        </>
                      )}

                      {/* 3. Client Engagement */}
                      {activeTab === "client-engagement" && (
                        <>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 dark:text-white capitalize">
                              {row.name}
                            </div>
                            <div className="text-[11px] text-slate-500 capitalize">{row.company}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {row.email} {row.phone !== "—" && `· ${row.phone}`}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {row.documentsUploaded} files
                            </div>
                            {row.documentsList && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[150px]" title={row.documentsList}>
                                {row.documentsList}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {row.jobsPosted ?? row.formsSubmitted} jobs
                            </div>
                            {(row.jobsList || row.formsList) && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[150px]" title={row.jobsList || row.formsList}>
                                {row.jobsList || row.formsList}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {row.tasksCompleted} milestones
                            </div>
                            {row.tasksList && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[150px]" title={row.tasksList}>
                                {row.tasksList}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400 capitalize">
                            {row.primaryFeature}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate text-[11px]" title={row.featuresList}>
                            {row.featuresList}
                          </td>
                        </>
                      )}

                      {/* 4. Support & Complaints */}
                      {activeTab === "support-complaints" && (
                        <>
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-semibold capitalize text-slate-900 dark:text-white truncate" title={row.projectDetails?.jobTitle || row.title}>
                              {row.projectDetails?.jobTitle || row.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Milestone: <span className="font-medium text-slate-700 dark:text-slate-300">{row.projectDetails?.milestoneTitle || "General Escrow"}</span>
                              {row.projectDetails?.milestoneAmount && (
                                <span> ({String(row.projectDetails.milestoneAmount).startsWith("₹") ? row.projectDetails.milestoneAmount : `₹${Number(row.projectDetails.milestoneAmount || 0).toLocaleString("en-IN")}`})</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-900 dark:text-white capitalize">
                              {row.clientDetails?.name || row.reporterName}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <span>{row.clientDetails?.phone || "—"}</span> · <span>{row.clientDetails?.state || "India"}</span>
                            </div>
                            <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 truncate max-w-[160px]" title={row.clientDetails?.statement || row.clientDetails?.claims || row.disputeReason || "Case under arbitration"}>
                              Claim: {row.clientDetails?.refundClaimed ? `₹${Number(row.clientDetails.refundClaimed).toLocaleString("en-IN")} · ` : ""}{row.clientDetails?.statement || row.clientDetails?.claims || row.disputeReason || "Under review"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-900 dark:text-white capitalize">
                              {row.proDetails?.name || "Assigned Pro"}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <span>{row.proDetails?.phone || "—"}</span> · <span>{row.proDetails?.state || "India"}</span>
                            </div>
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5 truncate max-w-[160px]" title={row.proDetails?.statement || row.proDetails?.response || "Under Arbitration Review"}>
                              Resp: {row.proDetails?.payoutClaimed ? `₹${Number(row.proDetails.payoutClaimed).toLocaleString("en-IN")} · ` : ""}{row.proDetails?.statement || row.proDetails?.response || "Under Arbitration Review"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="capitalize text-slate-700 dark:text-slate-300 font-medium">{row.issueType}</div>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border mt-1 ${
                                row.priority === "URGENT" || row.priority === "HIGH"
                                  ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
                                  : "bg-slate-500/15 text-slate-600 border-slate-500/30"
                              }`}
                            >
                              {row.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBadgeStyle(
                                row.status,
                              )}`}
                            >
                              {row.status}
                            </span>
                            {row.arbitrationDetails?.decision && (
                              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                                {row.arbitrationDetails.decision}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {row.turnaroundTime}
                          </td>
                        </>
                      )}

                      {/* 5. System Reliability */}
                      {activeTab === "system-reliability" && (
                        <>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {formatDateSafely(row.timestamp)}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBadgeStyle(
                                row.eventType,
                              )}`}
                            >
                              {row.eventType}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                            {row.target}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-sm truncate" title={row.details}>
                            {row.details}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                row.severity === "CRITICAL"
                                  ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
                                  : row.severity === "HIGH"
                                    ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                                    : "bg-slate-500/15 text-slate-600 border-slate-500/30"
                              }`}
                            >
                              {row.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500">
                            {row.ipAddress}
                          </td>
                        </>
                      )}

                      {/* 6. Client Growth */}
                      {activeTab === "client-growth" && (
                        subFilter === "DETAILS" ? (
                          <>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900 dark:text-white capitalize">
                                {row.name}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span>{row.email}</span>
                                {row.phone !== "—" && <span>· {row.phone}</span>}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium capitalize text-slate-700 dark:text-slate-300">
                              {row.company}
                            </td>
                            <td className="py-3 px-4 capitalize font-medium text-slate-700 dark:text-slate-300">
                              {row.state || row.location}
                            </td>
                            <td className="py-3 px-4 capitalize text-slate-600 dark:text-slate-400">
                              {row.category}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  row.isVerified
                                    ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                                    : "bg-amber-500/15 text-amber-600 border-amber-500/30"
                                }`}
                              >
                                {row.isVerified ? "Verified KYC" : "Pending KYC"}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                              {row.jobsCount}
                            </td>
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                              {formatDateSafely(row.createdAt)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                              {row.cohortPeriod}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                              {row.startingClients}
                            </td>
                            <td className="py-3 px-4 font-semibold text-emerald-600">
                              +{row.newClients}
                            </td>
                            <td className="py-3 px-4 text-rose-500">
                              -{row.inactiveClients}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                              {row.netGrowth >= 0 ? `+${row.netGrowth}` : row.netGrowth}
                            </td>
                            <td className="py-3 px-4 font-bold text-indigo-600">
                              {row.growthPercent}
                            </td>
                          </>
                        )
                      )}

                      {/* 7. Posting Growth */}
                      {activeTab === "posting-growth" && (
                        <>
                          <td className="py-3 px-4 font-medium capitalize text-slate-900 dark:text-white max-w-xs truncate" title={row.title}>
                            {row.title}
                          </td>
                          <td className="py-3 px-4 capitalize text-slate-600 dark:text-slate-400">
                            {row.category}
                          </td>
                          <td className="py-3 px-4">
                            <div className="capitalize font-medium text-slate-700 dark:text-slate-300">
                              {row.clientName}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>{row.clientEmail}</span>
                              {row.clientPhone !== "—" && <span>· {row.clientPhone}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize font-medium text-slate-700 dark:text-slate-300">
                            {row.location}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                            ₹{Number(row.budget || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4 font-semibold text-indigo-600">
                            {row.proposalsCount ?? 0}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBadgeStyle(
                                row.status,
                              )}`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {formatDateSafely(row.createdAt)}
                          </td>
                        </>
                      )}

                      {/* Row Action Column */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {masterGroup === "users" && typeof row.id === "number" && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectUserId(row.id);
                              }}
                              title="Open website work & live milestone progress details"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>
                          )}
                          <button
                            onClick={() => void handleExportSingleRecord(rowId, "pdf")}
                            disabled={downloadingRecordId === rowId}
                            title="Download complete detailed PDF dossier for this record"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors disabled:opacity-50"
                          >
                            {downloadingRecordId === rowId && downloadingFormat === "pdf" ? (
                              <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                            ) : (
                              <FileText className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                            )}
                            <span>Full Dossier</span>
                          </button>
                          <button
                            onClick={() => void handleExportSingleRecord(rowId, "csv")}
                            disabled={downloadingRecordId === rowId}
                            title="Download complete detailed CSV dossier for this record"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors disabled:opacity-50"
                          >
                            {downloadingRecordId === rowId && downloadingFormat === "csv" ? (
                              <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                            ) : (
                              <Download className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            )}
                            <span>CSV</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Enhanced Enterprise Pagination Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/20 text-xs text-slate-500">
          {/* Left: Rows Per Page & Showing Counts */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                aria-label="Select rows per page"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {Math.min(currentPage * pageSize, filteredRows.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {filteredRows.length}
              </span>{" "}
              records
            </div>
          </div>

          {/* Right: Numbered Page Navigation Pills */}
          <div className="flex items-center gap-1">
            {/* First Page Button */}
            <button
              onClick={() => setPage(1)}
              disabled={currentPage <= 1}
              title="First Page"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page Button */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              title="Previous Page"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Numbered Page Pills */}
            <div className="flex items-center gap-1 px-1">
              {getPageNumbers().map((item, idx) => {
                if (item === "...") {
                  return (
                    <span key={`dots-${idx}`} className="px-1.5 py-1 text-slate-400 text-xs">
                      ...
                    </span>
                  );
                }
                const pageNum = Number(item);
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              title="Next Page"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage >= totalPages}
              title="Last Page"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Deep Details Slide-Over Sheet (Website Work & Milestones) */}
      <AdminUserInspectionDrawer
        userId={inspectUserId}
        onClose={() => setInspectUserId(null)}
      />
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-medium">
          Loading report data…
        </div>
      }
    >
      <AdminReportsContent />
    </Suspense>
  );
}
