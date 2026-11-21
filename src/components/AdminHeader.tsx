"use client";

import { usePathname, useRouter } from "next/navigation";
import { invalidateCurrentUser } from "@/lib/current-user";
import { ExternalLink, LogOut, Menu, Bell } from "lucide-react";
import { useDatabaseStatus } from "@/hooks/use-database-status";
import { useAdminSidebar } from "@/components/AdminSidebarContext";
import { useAdminNotificationCount } from "@/lib/use-admin-notification-count";

const pageTitles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/users": "Users & Accounts",
  "/admin/verifications": "Verification & Compliance",
  "/admin/operations": "Jobs & Disputes",
  "/admin/services": "Services Catalog",
  "/admin/finance": "Finance & Payouts",
  "/admin/reports": "Reports & Analytics",
  "/admin/support": "Support & Knowledge Base",
  "/admin/cms": "Visual CMS Editor",
  "/admin/notifications": "Notifications & Alerts",
  "/admin/messages": "Admin Communications",
  "/admin/templates": "Email Template Library",
  "/admin/settings": "Platform Configuration & Settings",
  "/admin/sms-templates": "SMS Template Library",
  "/admin/extra/reviews": "Review Moderation",
  "/admin/extra/announcements": "Sitewide Banners",
  "/admin/extra/audit-logs": "Audit Trail & Logs",
  "/admin/extra/escrow": "Escrow Ledger",
};

function resolvePageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/admin/users/")) return "User Profile & Activity";
  if (pathname.startsWith("/admin/templates/")) return "Email Template Editor";
  if (pathname.startsWith("/admin/sms-templates/")) return "SMS Template Editor";
  return "Admin Workspace";
}

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const dbStatus = useDatabaseStatus();
  const { collapsed, toggleSidebar, toggleMobileOpen } = useAdminSidebar();
  const { unreadCount } = useAdminNotificationCount();
  const currentPageTitle = resolvePageTitle(pathname);
  const onNotificationsPage = pathname?.startsWith("/admin/notifications");

  async function logout() {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    invalidateCurrentUser();
    window.location.assign("/admin/login");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 sticky top-0 z-20">
      {/* 3 lines toggle & Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth < 1024) {
              toggleMobileOpen();
            } else {
              toggleSidebar();
            }
          }}
          aria-label="Toggle Sidebar Navigation"
          title={collapsed ? "Expand sidebar (show labels)" : "Collapse sidebar (icons only)"}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Admin</span>
          <span className="text-slate-300">/</span>
          <h2 className="text-sm font-semibold text-slate-900">{currentPageTitle}</h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Marketplace Quick Link */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <span>Marketplace</span>
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </a>

        {/* System Server Status Indicator */}
        <div
          title={`Platform System Server: ${dbStatus === "connected" ? "Operational & Live" : dbStatus === "disconnected" ? "Offline" : "Checking"}`}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              dbStatus === "connected"
                ? "bg-emerald-500"
                : dbStatus === "disconnected"
                  ? "bg-rose-500"
                  : "bg-slate-400"
            }`}
          />
          {dbStatus === "connected"
            ? "Live"
            : dbStatus === "disconnected"
              ? "Offline"
              : "Checking…"}
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          id="header-notification-bell"
          onClick={() => router.push("/admin/notifications")}
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          title={
            unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "Notifications"
          }
          className={`relative grid h-8 w-8 place-items-center rounded-lg border transition ${
            onNotificationsPage
              ? "border-slate-300 bg-slate-100 text-slate-900"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Admin Avatar & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-white font-medium text-xs">
            A
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            aria-label="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
