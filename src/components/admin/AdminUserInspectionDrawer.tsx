"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  User,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  Star,
  ExternalLink,
  MessageSquare,
  IndianRupee,
  Layers,
  Clock,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  FileText,
  Check,
} from "lucide-react";
import { capitalizeWords, capitalizeFirst } from "@/lib/utils";

type UserInspectionDrawerProps = {
  userId: number | null;
  onClose: () => void;
};

type InspectedUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: "CLIENT" | "PROFESSIONAL" | "ADMIN";
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  lastActiveAt?: string | null;
  accountState?: "ONLINE" | "ACTIVE" | "IDLE" | "NEVER_LOGGED_IN" | "DISABLED";
  accountStateLabel?: string;
  isOnline?: boolean;
  totalLogins?: number;
  location?: string | null;
  address?: string | null;
  professionalCity?: string | null;
  professionalState?: string | null;
  industryType?: string | null;
  averageRating?: number;
  reviewCount?: number;
  completedProjects?: number;
  authProvider?: string | null;
  professionalCategory?: string | null;
  hourlyRate?: number | null;
  experienceYears?: number | null;
  workMode?: string | null;
};

type InspectedJob = {
  id: number;
  title: string;
  category: string;
  status: string;
  budget?: number;
  proposalsCount?: number;
  createdAt: string;
  projectRequests?: unknown[];
};

type InspectedProposal = {
  id: number;
  jobId: number;
  bidAmount: number;
  status: string;
  duration?: string | null;
  createdAt: string;
  job?: { id: number; title: string };
};

type InspectedMilestone = {
  id: number;
  title: string;
  amount: number;
  status: string;
  percentage?: number | null;
  description?: string | null;
  dueDate?: string | null;
  projectTitle: string;
  projectId: number;
  trackingStatus?: string;
};

type InspectedProject = {
  id: number;
  jobId: number;
  title: string;
  category: string;
  status: string;
  progress?: number;
  milestones?: Array<{
    id: number;
    title: string;
    amount: number;
    status: string;
    description?: string | null;
    dueDate?: string | null;
  }>;
  totalMilestones: number;
  completedMilestones: number;
  createdAt: string;
  updatedAt: string;
};

type InspectedDispute = {
  id: number;
  trackingId: number;
  projectTitle: string;
  reporterRole: string;
  issueType: string;
  priority: string;
  status: string;
  message: string;
  decision?: string | null;
  decisionReason?: string | null;
  refundAmount?: number | null;
  payoutAmount?: number | null;
  createdAt: string;
  updatedAt: string;
};

type UserInspectionData = {
  user?: InspectedUser;
  stats?: Record<string, number>;
  metrics?: {
    totalSpent?: number;
    totalEarnings?: number;
    completedProjectsCount?: number;
  };
  jobs?: InspectedJob[];
  projectRequests?: InspectedProposal[];
  projects?: InspectedProject[];
  disputes?: InspectedDispute[];
};

export type DrawerTabKey = "overview" | "projects" | "milestones" | "complaints";

export function AdminUserInspectionDrawer({
  userId,
  onClose,
}: UserInspectionDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserInspectionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DrawerTabKey>("overview");

  useEffect(() => {
    if (!userId) {
      setData(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    void fetch(`/api/v1/admin/users/${userId}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load user details.");
        return res.json();
      })
      .then((result: UserInspectionData) => {
        if (isMounted) setData(result);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load user profile");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (!userId) return null;

  const user = data?.user;
  const metrics = data?.metrics || {};
  const isClient = user?.role === "CLIENT";
  const clientJobs = data?.jobs || [];
  const projectRequests = data?.projectRequests || [];
  const activeContracts = data?.projects || [];
  const userDisputes = data?.disputes || [];

  // Extract all milestones across active contract projects
  const allMilestones: InspectedMilestone[] = [];
  activeContracts.forEach((p) => {
    const projectTitle = p.title || `Project #${p.id}`;
    (p.milestones || []).forEach((m) => {
      allMilestones.push({
        ...m,
        projectTitle,
        projectId: p.id,
        trackingStatus: p.status,
      });
    });
  });

  const totalProjectsCount = (isClient ? clientJobs.length : projectRequests.length) + activeContracts.length;
  const totalMilestoneValue = allMilestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 font-semibold text-sm">
                {user?.firstName ? (user.firstName[0]?.toUpperCase() || "U") : "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {user ? capitalizeWords(`${user.firstName || ""} ${user.lastName || ""}`.trim()) : "User Profile Details"}
                  </h2>
                  {user?.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {user?.role === "PROFESSIONAL" ? "Professional" : "Client"}
                  </span>
                  <span>•</span>
                  <span>ID #{userId}</span>
                  <span>•</span>
                  <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/users/${userId}`}
                prefetch={false}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium shadow-2xs transition"
                title="Open full editable user management profile dossier"
              >
                <span>Full Page</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close user inspection sheet"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 4 Clean Separated Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 pt-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
            {/* Tab 1: Overview */}
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "overview"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            {/* Tab 2: Projects */}
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "projects"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Projects</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                {totalProjectsCount}
              </span>
            </button>

            {/* Tab 3: Milestones */}
            <button
              onClick={() => setActiveTab("milestones")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "milestones"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Milestones</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                {allMilestones.length}
              </span>
            </button>

            {/* Tab 4: Complaints & Disputes */}
            <button
              onClick={() => setActiveTab("complaints")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "complaints"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Complaints & Disputes</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  userDisputes.length > 0
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {userDisputes.length}
              </span>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
                <p className="text-xs font-medium">Loading user details & records...</p>
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm">
                {error}
              </div>
            ) : user ? (
              <>
                {/* ------------------------------------------------------------- */}
                {/* TAB 1: ACCOUNT OVERVIEW                                       */}
                {/* ------------------------------------------------------------- */}
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    {/* Key Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3 shadow-2xs">
                        <span className="text-[11px] font-medium text-slate-500">Rating</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                          <span className="text-base font-bold text-slate-900 dark:text-white">
                            {Number(user.averageRating) > 0 ? Number(user.averageRating).toFixed(1) : "—"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{user.reviewCount || 0} reviews</span>
                      </div>

                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3 shadow-2xs">
                        <span className="text-[11px] font-medium text-slate-500">Completed Work</span>
                        <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {metrics.completedProjectsCount ?? 0}
                        </p>
                        <span className="text-[10px] text-slate-400">Projects closed</span>
                      </div>

                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3 shadow-2xs">
                        <span className="text-[11px] font-medium text-slate-500">
                          {isClient ? "Total Spend" : "Total Earnings"}
                        </span>
                        <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          ₹{Number(isClient ? metrics.totalSpent || 0 : metrics.totalEarnings || 0).toLocaleString("en-IN")}
                        </p>
                        <span className="text-[10px] text-slate-400">Settled deliverables</span>
                      </div>

                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3 shadow-2xs">
                        <span className="text-[11px] font-medium text-slate-500">Presence State</span>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              !user.isActive
                                ? "bg-rose-500"
                                : user.isOnline || user.accountState === "ONLINE"
                                  ? "bg-emerald-500 animate-pulse"
                                  : user.accountState === "ACTIVE"
                                    ? "bg-blue-500"
                                    : user.accountState === "IDLE"
                                      ? "bg-amber-500"
                                      : "bg-slate-400"
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {user.isOnline ? "Online Now" : user.accountStateLabel || (user.isActive ? "Active (Offline)" : "Disabled")}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {user.lastActiveAt
                            ? `Last seen ${new Date(user.lastActiveAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
                            : user.authProvider || "LOCAL"}
                        </span>
                      </div>
                    </div>

                    {/* Contact & Personal Information Card */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-white dark:bg-slate-900 shadow-2xs">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Contact & Account Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                          {user.email ? (
                            <a
                              href={`mailto:${user.email}`}
                              className="font-medium truncate text-primary hover:underline"
                            >
                              {user.email}
                            </a>
                          ) : (
                            <span className="font-medium text-slate-400">—</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                          {user.phone ? (
                            <a
                              href={`tel:${user.phone.replace(/\s+/g, "")}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {user.phone}
                            </a>
                          ) : (
                            <span className="font-medium text-slate-400">—</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="font-medium">
                            {capitalizeWords([user.professionalCity, user.professionalState].filter(Boolean).join(", ") || user.address || "Location not set")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Role Specific Practice Details */}
                    {!isClient && (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-white dark:bg-slate-900 shadow-2xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Professional Practice Details
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Primary Category</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {capitalizeWords(user.professionalCategory || "General Practice")}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Hourly Billing Rate</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {user.hourlyRate ? `₹${Number(user.hourlyRate).toLocaleString("en-IN")}/hr` : "Not specified"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Experience</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {user.experienceYears ? `${user.experienceYears} Years` : "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Work Mode</span>
                            <span className="font-bold text-slate-900 dark:text-white uppercase">
                              {user.workMode || "BOTH"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 2: PROJECTS & WORK (CONTRACTS + POSTINGS / PROPOSALS)    */}
                {/* ------------------------------------------------------------- */}
                {activeTab === "projects" && (
                  <div className="space-y-6">
                    {/* Section 1: Active & Awarded Contracts */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            Active & Awarded Contracts
                          </h3>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {activeContracts.length} contracts
                        </span>
                      </div>

                      {activeContracts.length === 0 ? (
                        <div className="p-5 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                          No awarded contract projects found for this account.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {activeContracts.map((p) => (
                            <div
                              key={p.id}
                              className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 space-y-2 shadow-2xs hover:border-indigo-300 transition"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {capitalizeWords(p.title || `Contract #${p.id}`)}
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                                    <span>Contract #{p.id}</span>
                                    <span>•</span>
                                    <span>{capitalizeWords(p.category || "General")}</span>
                                    <span>•</span>
                                    <span>Started {new Date(p.createdAt).toLocaleDateString("en-IN")}</span>
                                  </div>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase shrink-0 ${
                                    p.status === "COMPLETED"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : p.status === "IN_PROGRESS"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-slate-100 text-slate-700 border-slate-200"
                                  }`}
                                >
                                  {p.status || "ACTIVE"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-slate-500">
                                  Milestones: <strong className="text-slate-900 dark:text-white">{p.completedMilestones} / {p.totalMilestones} Completed</strong>
                                </span>
                                {p.progress !== undefined && (
                                  <span className="font-semibold text-indigo-600">
                                    {p.progress}% Progress
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section 2: Published Job Postings (Clients) OR Submitted Proposals (Professionals) */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-purple-600" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            {isClient ? "Published Marketplace Job Postings" : "Submitted Bids & Proposals"}
                          </h3>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {isClient ? `${clientJobs.length} postings` : `${projectRequests.length} proposals`}
                        </span>
                      </div>

                      {isClient ? (
                        clientJobs.length === 0 ? (
                          <div className="p-5 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                            This client has not published any job postings yet.
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {clientJobs.map((j) => (
                              <div
                                key={j.id}
                                className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-white dark:bg-slate-900 space-y-2 shadow-2xs hover:border-indigo-300 transition"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                      {capitalizeWords(j.title || `Job #${j.id}`)}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                                      <span>#{j.id}</span>
                                      <span>•</span>
                                      <span>{capitalizeWords(j.category || "General")}</span>
                                      <span>•</span>
                                      <span>{j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-IN") : "—"}</span>
                                    </div>
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase shrink-0 ${
                                      j.status === "COMPLETED"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : j.status === "IN_PROGRESS"
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : "bg-slate-100 text-slate-700 border-slate-200"
                                    }`}
                                  >
                                    {j.status || "OPEN"}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                  <span className="text-slate-500">
                                    Budget: <strong className="text-slate-900 dark:text-white">₹{Number(j.budget || 0).toLocaleString("en-IN")}</strong>
                                  </span>
                                  <span className="text-slate-500">
                                    Applicants: <strong className="text-indigo-600">{j.proposalsCount ?? (j.projectRequests?.length || 0)}</strong>
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      ) : projectRequests.length === 0 ? (
                        <div className="p-5 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                          This professional has not submitted any proposals yet.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {projectRequests.map((p) => (
                            <div
                              key={p.id}
                              className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-white dark:bg-slate-900 space-y-2 shadow-2xs hover:border-indigo-300 transition"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {capitalizeWords(p.job?.title || `Proposal #${p.id}`)}
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                                    <span>Bid #{p.id}</span>
                                    <span>•</span>
                                    <span>For Job #{p.jobId}</span>
                                    <span>•</span>
                                    <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "—"}</span>
                                  </div>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase shrink-0 ${
                                    p.status === "ACCEPTED"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : p.status === "REJECTED"
                                        ? "bg-rose-50 text-rose-700 border-rose-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}
                                >
                                  {p.status || "PENDING"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-slate-500">
                                  Bid Amount: <strong className="text-slate-900 dark:text-white">₹{Number(p.bidAmount || 0).toLocaleString("en-IN")}</strong>
                                </span>
                                <span className="text-slate-500">
                                  Duration: <strong className="text-slate-700 dark:text-slate-300">{p.duration || "Standard"}</strong>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 3: MILESTONES & DELIVERABLES                              */}
                {/* ------------------------------------------------------------- */}
                {activeTab === "milestones" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                          Milestone Phases & Deliverables
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Total Value: <strong className="text-slate-900 dark:text-white">₹{totalMilestoneValue.toLocaleString("en-IN")}</strong>
                      </span>
                    </div>

                    {allMilestones.length === 0 ? (
                      <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                        No project milestone records found for this account.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {allMilestones.map((m, idx) => (
                          <div
                            key={m.id || idx}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 space-y-2 shadow-2xs hover:border-emerald-300 transition"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {capitalizeWords(m.title || `Milestone Phase ${idx + 1}`)}
                                </span>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Under: <strong className="text-slate-600 dark:text-slate-300">{capitalizeWords(m.projectTitle)}</strong> (Project #{m.projectId})
                                </p>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase shrink-0 ${
                                  ["COMPLETED", "APPROVED", "RELEASED"].includes(m.status)
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : ["IN_PROGRESS", "SUBMITTED"].includes(m.status)
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                              >
                                {m.status || "UPCOMING"}
                              </span>
                            </div>

                            {m.description && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 mt-1">
                                {capitalizeFirst(m.description)}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">
                                Allocated Escrow: <strong className="text-slate-900 dark:text-white">₹{Number(m.amount || 0).toLocaleString("en-IN")}</strong>
                              </span>
                              {m.dueDate && (
                                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Due {new Date(m.dueDate).toLocaleDateString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 4: COMPLAINTS & DISPUTES                                  */}
                {/* ------------------------------------------------------------- */}
                {activeTab === "complaints" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                          Disputes & Grievance History
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {userDisputes.length} records
                      </span>
                    </div>

                    {userDisputes.length === 0 ? (
                      <div className="p-8 text-center rounded-xl border border-dashed border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-300">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="font-semibold text-sm">Clean Arbitration Record</p>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                          Zero complaints, dispute claims, or arbitration requests are on record for this account.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userDisputes.map((d) => (
                          <div
                            key={d.id}
                            className="rounded-xl border border-rose-200 dark:border-rose-900/60 p-4 bg-white dark:bg-slate-900 space-y-3 shadow-2xs hover:border-rose-400 transition"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    Dispute #{d.id} · {capitalizeWords(d.issueType || "Contract Grievance")}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold border uppercase ${
                                      d.priority === "CRITICAL"
                                        ? "bg-rose-100 text-rose-700 border-rose-300"
                                        : d.priority === "HIGH"
                                          ? "bg-amber-100 text-amber-700 border-amber-300"
                                          : "bg-slate-100 text-slate-700 border-slate-200"
                                    }`}
                                  >
                                    {d.priority} Priority
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Under: <strong className="text-slate-600 dark:text-slate-300">{capitalizeWords(d.projectTitle)}</strong> · Filed {new Date(d.createdAt).toLocaleDateString("en-IN")}
                                </p>
                              </div>

                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase shrink-0 ${
                                  d.status === "RESOLVED"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : d.status === "WAITING_RESPONSE"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-rose-50 text-rose-700 border-rose-200"
                                }`}
                              >
                                {d.status}
                              </span>
                            </div>

                            {/* Complaint Message */}
                            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Filed Statement
                              </span>
                              <p className="leading-relaxed">
                                {capitalizeFirst(d.message || "No statement provided.")}
                              </p>
                            </div>

                            {/* Arbitration Decision (if resolved or decided) */}
                            {d.decision && (
                              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg p-2.5 text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                                  Formal Arbitration Decision
                                </span>
                                <p className="font-medium">
                                  {capitalizeFirst(d.decision)}
                                </p>
                                {d.decisionReason && (
                                  <p className="text-[11px] text-emerald-600 dark:text-emerald-300 mt-1">
                                    Reasoning: {capitalizeFirst(d.decisionReason)}
                                  </p>
                                )}
                                {(Number(d.refundAmount || 0) > 0 || Number(d.payoutAmount || 0) > 0) && (
                                  <div className="flex items-center gap-3 text-[11px] font-semibold pt-1 border-t border-emerald-200/60 dark:border-emerald-800">
                                    {Number(d.refundAmount || 0) > 0 && (
                                      <span>Refund: ₹{Number(d.refundAmount).toLocaleString("en-IN")}</span>
                                    )}
                                    {Number(d.payoutAmount || 0) > 0 && (
                                      <span>Payout: ₹{Number(d.payoutAmount).toLocaleString("en-IN")}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
