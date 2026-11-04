"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  User,
  ShieldCheck,
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
} from "lucide-react";
import { capitalizeWords, capitalizeFirst, formatReadableLabel } from "@/lib/utils";

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
  location?: string | null;
  address?: string | null;
  professionalCity?: string | null;
  professionalState?: string | null;
  companyName?: string | null;
  companyRole?: string | null;
  companyVat?: string | null;
  industryType?: string | null;
  averageRating?: number;
  reviewCount?: number;
  completedProjects?: number;
  authProvider?: string | null;
  clientProfiles?: { companyName?: string; companyVat?: string } | null;
  professionalCategory?: string | null;
  hourlyRate?: number | null;
  experienceYears?: number | null;
  workMode?: string | null;
  professionalProfile?: {
    hourlyRate?: number | null;
    experienceYears?: number | null;
    overview?: string | null;
    serviceCategory?: string | null;
  } | null;
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
  projectTitle: string;
  projectId: number;
  trackingStatus?: string;
  deliverables?: Array<{ fileUrl: string; fileName?: string }>;
};

type InspectedTracking = {
  id: number;
  status: string;
  job?: { title?: string };
  milestones?: Array<{
    id: number;
    title: string;
    amount: number;
    status: string;
    description?: string | null;
    deliverables?: Array<{ fileUrl: string; fileName?: string }>;
  }>;
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
  trackings?: InspectedTracking[];
};

export function AdminUserInspectionDrawer({
  userId,
  onClose,
}: UserInspectionDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserInspectionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "work" | "milestones">("overview");

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
  const trackings = data?.trackings || [];

  // Extract all milestones across active projects
  const allMilestones: InspectedMilestone[] = [];
  trackings.forEach((t) => {
    const projectTitle = t.job?.title || `Project #${t.id}`;
    (t.milestones || []).forEach((m) => {
      allMilestones.push({
        ...m,
        projectTitle,
        projectId: t.id,
        trackingStatus: t.status,
      });
    });
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-base shadow-2xs">
                {user?.firstName ? (user.firstName[0]?.toUpperCase() || "U") : "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {user ? capitalizeWords(`${user.firstName || ""} ${user.lastName || ""}`.trim()) : "User Profile Details"}
                  </h2>
                  {user?.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300/60">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                  <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {user?.role || "USER"}
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
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300 text-xs font-semibold shadow-2xs transition"
                title="Open full editable user management profile dossier"
              >
                <span>Full Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close user inspection sheet"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition ${
                activeTab === "overview"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Account Overview
            </button>
            <button
              onClick={() => setActiveTab("work")}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "work"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{isClient ? "Client Job Postings" : "Proposals & Bids"}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold">
                {isClient ? clientJobs.length : projectRequests.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("milestones")}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "milestones"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Milestones & Settlement</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold">
                {allMilestones.length}
              </span>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
                <p className="text-xs font-medium">Loading user details & website work...</p>
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm">
                {error}
              </div>
            ) : user ? (
              <>
                {/* Tab 1: Account Overview */}
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
                        <span className="text-[10px] text-slate-400">Escrow released</span>
                      </div>

                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3 shadow-2xs">
                        <span className="text-[11px] font-medium text-slate-500">Account State</span>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {user.isActive ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{user.authProvider || "LOCAL"}</span>
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
                          <span className="font-medium truncate">{user.email || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="font-medium">{user.phone || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="font-medium">
                            {capitalizeWords([user.professionalCity, user.professionalState].filter(Boolean).join(", ") || user.address || "Location not set")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="font-medium">
                            {capitalizeWords(user.companyName || user.clientProfiles?.companyName || "Individual")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Role Specific Details Card */}
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

                {/* Tab 2: Website Work (Job Postings & Proposals) */}
                {activeTab === "work" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {isClient ? "Client's Job Postings on Website" : "Submitted Bids & Proposals"}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {isClient ? `${clientJobs.length} postings recorded` : `${projectRequests.length} proposals recorded`}
                      </span>
                    </div>

                    {isClient ? (
                      clientJobs.length === 0 ? (
                        <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                          This client has not posted any jobs on the platform yet.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {clientJobs.map((j) => (
                            <div
                              key={j.id}
                              className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-white dark:bg-slate-900 space-y-2 shadow-2xs hover:border-indigo-200 transition"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600">
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
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                                  j.status === "COMPLETED"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : j.status === "IN_PROGRESS"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}>
                                  {j.status || "OPEN"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
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
                    ) : (
                      projectRequests.length === 0 ? (
                        <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                          This professional has not submitted any proposals yet.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {projectRequests.map((p) => (
                            <div
                              key={p.id}
                              className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-white dark:bg-slate-900 space-y-2 shadow-2xs hover:border-indigo-200 transition"
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
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                                  p.status === "ACCEPTED"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : p.status === "REJECTED"
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}>
                                  {p.status || "PENDING"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
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
                      )
                    )}
                  </div>
                )}

                {/* Tab 3: Milestones & Settlements */}
                {activeTab === "milestones" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Live Milestone Tracker & Deliverables
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {allMilestones.length} milestones across projects
                      </span>
                    </div>

                    {allMilestones.length === 0 ? (
                      <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                        No active project milestones recorded for this account.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {allMilestones.map((m, idx) => (
                          <div
                            key={m.id || idx}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 space-y-2 shadow-2xs"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {capitalizeWords(m.title || `Milestone Phase ${idx + 1}`)}
                                </span>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Under: {capitalizeWords(m.projectTitle)} (Project #{m.projectId})
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase shrink-0 ${
                                ["COMPLETED", "APPROVED", "RELEASED"].includes(m.status)
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : ["IN_PROGRESS", "SUBMITTED"].includes(m.status)
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}>
                                {m.status || "PENDING"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">
                                Allocated Amount: <strong className="text-slate-900 dark:text-white">₹{Number(m.amount || 0).toLocaleString("en-IN")}</strong>
                              </span>
                              {m.percentage && (
                                <span className="text-slate-400 text-[11px]">
                                  Weight: {m.percentage}%
                                </span>
                              )}
                            </div>
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
