"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Filter,
  MapPin,
  MessageSquare,
  Power,
  RotateCcw,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  UsersRound,
  XCircle,
  LogIn,
  Eye,
  RefreshCw,
} from "lucide-react";
import { ENABLE_ADMIN_EXTRA_SECTION } from "@/config/extra-features";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { capitalizeWords } from "@/lib/utils";

export type TimeRangePreset = "all" | "thisMonth" | "lastMonth" | "last30days" | "last7days" | "today";

function isDateWithinRange(dateStr?: string | null, range: TimeRangePreset = "all"): boolean {
  if (range === "all" || !dateStr) return true;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return true;

  const now = new Date();
  if (range === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return d >= start && d <= end;
  }
  if (range === "last7days") {
    const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return d >= start;
  }
  if (range === "last30days") {
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return d >= start;
  }
  if (range === "thisMonth") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    return d >= start;
  }
  if (range === "lastMonth") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return d >= start && d <= end;
  }
  return true;
}

export type AdminDirectoryUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: "CLIENT" | "PROFESSIONAL" | "ADMIN";
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  averageRating: number;
  reviewCount: number;
  completedProjects: number;
  closedProjects: number;
  totalProjects: number;
  location: string;
  companyName: string | null;
};

type UserManagementViewProps = {
  onInspectUser?: (userId: number) => void;
};

export function UserManagementView({ onInspectUser }: UserManagementViewProps) {
  const router = useRouter();
  const [users, setUsers] = useState<AdminDirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<"clients" | "professionals">("clients");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [verifiedFilter, setVerifiedFilter] = useState<"ALL" | "VERIFIED" | "UNVERIFIED">("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [minRating, setMinRating] = useState<number>(0);
  const [timeRange, setTimeRange] = useState<TimeRangePreset>("all");
  const [confirmAction, setConfirmAction] = useState<{
    user: AdminDirectoryUser;
    kind: "delete" | "toggle";
  } | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/data/users", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      const raw = Array.isArray(data?.users) ? data.users : [];
      setUsers(raw.filter((u: AdminDirectoryUser) => u.role !== "ADMIN"));
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
    window.addEventListener("servio:admin-users-update", loadUsers);
    window.addEventListener("servio:notification", loadUsers);
    window.addEventListener("focus", loadUsers);
    return () => {
      window.removeEventListener("servio:admin-users-update", loadUsers);
      window.removeEventListener("servio:notification", loadUsers);
      window.removeEventListener("focus", loadUsers);
    };
  }, []);

  const toggle = async (targetUser: AdminDirectoryUser) => {
    const nextState = !targetUser.isActive;
    try {
      const res = await fetch(`/api/v1/admin/users/${targetUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update account status.");
      const updatedActive = typeof data?.user?.isActive === "boolean" ? data.user.isActive : nextState;
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: updatedActive } : u)),
      );
      setMessage(`Account for ${capitalizeWords(`${targetUser.firstName} ${targetUser.lastName}`)} ${updatedActive ? "enabled" : "disabled"}.`);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Could not toggle status.");
    }
  };

  const deleteUser = async (targetUser: AdminDirectoryUser) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${targetUser.id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error ?? "Could not delete user.");
      }
      setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      setMessage(`User ${capitalizeWords(`${targetUser.firstName} ${targetUser.lastName}`)} permanently deleted.`);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Could not delete user.");
    }
  };

  const handleImpersonate = async (targetUser: AdminDirectoryUser) => {
    try {
      const res = await fetch("/api/admin/extra/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUser.id }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to start impersonation session.");
      }
      const data = await res.json();
      window.location.href = data.redirectUrl || (targetUser.role === "PROFESSIONAL" ? "/professional/dashboard" : "/client/dashboard");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Failed to impersonate.");
    }
  };

  const availableLocations = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.location && u.location.trim()) {
        const parts = u.location.split(",");
        const stateOrCity = parts[parts.length - 1]?.trim();
        if (stateOrCity) set.add(stateOrCity);
      }
    });
    return Array.from(set).sort();
  }, [users]);

  const clients = useMemo(() => {
    return users.filter((u) => {
      if (u.role !== "CLIENT") return false;
      if (statusFilter === "ACTIVE" && !u.isActive) return false;
      if (statusFilter === "INACTIVE" && u.isActive) return false;
      if (verifiedFilter === "VERIFIED" && !u.isVerified) return false;
      if (verifiedFilter === "UNVERIFIED" && u.isVerified) return false;
      if (!isDateWithinRange(u.createdAt, timeRange)) return false;
      if (selectedLocation !== "ALL" && !u.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        const matches =
          fullName.includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.includes(q)) ||
          (u.companyName && u.companyName.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [users, statusFilter, verifiedFilter, timeRange, selectedLocation, searchTerm]);

  const professionals = useMemo(() => {
    return users.filter((u) => {
      if (u.role !== "PROFESSIONAL") return false;
      if (statusFilter === "ACTIVE" && !u.isActive) return false;
      if (statusFilter === "INACTIVE" && u.isActive) return false;
      if (verifiedFilter === "VERIFIED" && !u.isVerified) return false;
      if (verifiedFilter === "UNVERIFIED" && u.isVerified) return false;
      if (!isDateWithinRange(u.createdAt, timeRange)) return false;
      if (minRating > 0 && (u.averageRating || 0) < minRating) return false;
      if (selectedLocation !== "ALL" && !u.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        const matches =
          fullName.includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.includes(q)) ||
          (u.companyName && u.companyName.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [users, statusFilter, verifiedFilter, timeRange, selectedLocation, minRating, searchTerm]);

  const currentList = activeGroup === "clients" ? clients : professionals;
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(currentList.length / pageSize));
  const paginatedUsers = currentList.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setVerifiedFilter("ALL");
    setSelectedLocation("ALL");
    setMinRating(0);
    setTimeRange("all");
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Role Group Selector */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => { setActiveGroup("clients"); setPage(1); }}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeGroup === "clients"
                  ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Clients ({users.filter((u) => u.role === "CLIENT").length})
            </button>
            <button
              onClick={() => { setActiveGroup("professionals"); setPage(1); }}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeGroup === "professionals"
                  ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Professionals ({users.filter((u) => u.role === "PROFESSIONAL").length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeGroup} by name, email, phone, company...`}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE"); setPage(1); }}
            aria-label="Filter directory users by status"
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All Account Status</option>
            <option value="ACTIVE">Active Accounts</option>
            <option value="INACTIVE">Disabled Accounts</option>
          </select>

          <select
            value={verifiedFilter}
            onChange={(e) => { setVerifiedFilter(e.target.value as "ALL" | "VERIFIED" | "UNVERIFIED"); setPage(1); }}
            aria-label="Filter directory users by verification state"
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All KYC States</option>
            <option value="VERIFIED">Verified KYC</option>
            <option value="UNVERIFIED">Pending KYC</option>
          </select>

          {availableLocations.length > 0 && (
            <select
              value={selectedLocation}
              onChange={(e) => { setSelectedLocation(e.target.value); setPage(1); }}
              aria-label="Filter directory users by geographic location"
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="ALL">All Locations</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          )}

          {activeGroup === "professionals" && (
            <select
              value={minRating}
              onChange={(e) => { setMinRating(Number(e.target.value)); setPage(1); }}
              aria-label="Filter directory users by minimum rating score"
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value={0}>All Ratings</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={4}>4.0+ Stars</option>
              <option value={3}>3.0+ Stars</option>
            </select>
          )}

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={timeRange}
              onChange={(e) => { setTimeRange(e.target.value as TimeRangePreset); setPage(1); }}
              aria-label="Filter directory users by registration date"
              className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last7days">Last 7 Days</option>
              <option value="today">Today</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== "ALL" || verifiedFilter !== "ALL" || selectedLocation !== "ALL" || minRating > 0 || timeRange !== "all") && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline ml-auto"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">×</button>
        </div>
      )}

      {/* Directory Users Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-xs font-semibold">Loading directory accounts...</p>
        </div>
      ) : paginatedUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
          <UsersRound className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No {activeGroup} match the filters</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the search terms or location filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {paginatedUsers.map((user) => {
            const fullName = capitalizeWords(`${user.firstName} ${user.lastName}`);
            return (
              <div
                key={user.id}
                onClick={() => onInspectUser?.(user.id)}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm shadow-2xs">
                        {user.firstName ? (user.firstName[0]?.toUpperCase() || "U") : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition truncate max-w-[150px]">
                            {fullName}
                          </h3>
                          {user.isVerified && (
                            <span title="KYC Verified" className="inline-flex">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[170px]">{user.email}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase shrink-0 ${
                      user.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}>
                      {user.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Company / Business</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                        {capitalizeWords(user.companyName || (user.role === "PROFESSIONAL" ? "Freelance Pro" : "Individual Client"))}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                        {capitalizeWords(user.location || "Not set")}
                      </span>
                    </div>
                    {user.role === "PROFESSIONAL" && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Rating</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {Number(user.averageRating) > 0 ? Number(user.averageRating).toFixed(1) : "—"}
                          </span>
                          <span className="text-[10px] text-slate-400">({user.reviewCount || 0})</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block text-[10px]">Work Projects</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {user.completedProjects ?? 0} closed / {user.totalProjects ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Quick Action Bar */}
                <div
                  className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    onClick={() => onInspectUser?.(user.id)}
                    variant="outline"
                    className="h-7 px-2.5 text-[11px] font-semibold border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 shadow-2xs"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Inspect
                  </Button>

                  <Link
                    href={`/admin/messages?to=${user.id}`}
                    prefetch={false}
                    className="h-7 px-2.5 rounded-md border border-slate-200 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:border-slate-300 text-[11px] font-semibold inline-flex items-center gap-1 shadow-2xs transition"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Message
                  </Link>

                  {ENABLE_ADMIN_EXTRA_SECTION && user.isActive && (
                    <Button
                      onClick={() => handleImpersonate(user)}
                      variant="outline"
                      className="h-7 px-2 text-[11px] font-semibold border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100 shadow-2xs"
                    >
                      <LogIn className="h-3 w-3" />
                    </Button>
                  )}

                  <Button
                    onClick={() => setConfirmAction({ user, kind: "toggle" })}
                    variant="outline"
                    className={`h-7 px-2 text-[11px] font-semibold shadow-2xs ${
                      user.isActive
                        ? "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                        : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    <Power className="h-3 w-3" />
                  </Button>

                  <Button
                    onClick={() => setConfirmAction({ user, kind: "delete" })}
                    variant="outline"
                    className="h-7 px-2 text-[11px] font-semibold border-slate-200 text-slate-500 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 shadow-2xs"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="pt-2">
          <AdminPagination
            currentPage={page}
            totalItems={currentList.length}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="font-bold text-lg text-slate-900">
              {confirmAction.kind === "delete"
                ? "Delete account?"
                : `${confirmAction.user.isActive ? "Disable" : "Enable"} account?`}
            </h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {capitalizeWords(`${confirmAction.user.firstName} ${confirmAction.user.lastName}`)}{" "}
              ({confirmAction.user.role}) will{" "}
              {confirmAction.kind === "delete"
                ? "be permanently deleted along with all profile data."
                : confirmAction.user.isActive
                  ? "lose platform access."
                  : "regain platform access."}
            </p>
            <div className="mt-6 flex justify-end gap-2.5">
              <Button
                variant="outline"
                className="h-8 text-xs font-semibold"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className={`h-8 text-xs font-semibold ${
                  confirmAction.kind === "delete" || confirmAction.user.isActive
                    ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
                onClick={() => {
                  const { user, kind } = confirmAction;
                  setConfirmAction(null);
                  if (kind === "delete") void deleteUser(user);
                  else void toggle(user);
                }}
              >
                {confirmAction.kind === "delete"
                  ? "Delete"
                  : confirmAction.user.isActive
                    ? "Disable"
                    : "Enable"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
