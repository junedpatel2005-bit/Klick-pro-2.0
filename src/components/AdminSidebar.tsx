"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDatabaseStatus } from "@/hooks/use-database-status";
import {
  BarChart3,
  Bell,
  Briefcase,
  BriefcaseBusiness,
  ChevronRight,
  ChevronDown,
  CircleDollarSign,
  FileBarChart,
  FileText,
  LayoutDashboard,
  Mail,
  MessageSquare,
  ShieldCheck,
  UsersRound,
  Wrench,
  Sliders,
  Smartphone,
  Star,
  Megaphone,
  History,
  Landmark,
  UserPlus,
  Activity,
  Layers,
  ShieldAlert,
  Cpu,
  TrendingUp,
} from "lucide-react";
import { ENABLE_ADMIN_EXTRA_SECTION } from "@/config/extra-features";
import { useAdminSidebar } from "@/components/AdminSidebarContext";

export const REPORT_SUB_TABS = [
  { id: "users", label: "User Management", icon: UsersRound },
  { id: "jobs", label: "Job Management", icon: BriefcaseBusiness },
  { id: "system-reliability", label: "System Reliability", icon: Cpu },
] as const;

const linkGroups = [
  {
    group: "MAIN",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/users", label: "Users", icon: UsersRound, badge: "newUsers" },
      {
        href: "/admin/verifications",
        label: "Verification",
        icon: ShieldCheck,
        badge: "verification",
      },
      {
        href: "/admin/operations",
        label: "Jobs & disputes",
        icon: BriefcaseBusiness,
        badge: "jobs",
      },
    ],
  },
  {
    group: "CATALOG & FINANCE",
    items: [
      { href: "/admin/services", label: "Services catalog", icon: Wrench },
      {
        href: "/admin/finance",
        label: "Finance & payouts",
        icon: CircleDollarSign,
        badge: "payouts",
      },
      { href: "/admin/reports", label: "Reports & exports", icon: FileBarChart },
    ],
  },
  {
    group: "PLATFORM & CONTENT",
    items: [
      { href: "/admin/templates", label: "Email templates", icon: Mail },
      { href: "/admin/sms-templates", label: "SMS templates", icon: Smartphone },
      { href: "/admin/support", label: "Support & FAQs", icon: FileText },
      { href: "/admin/cms", label: "Website content", icon: FileText },
      { href: "/admin/settings", label: "Platform settings", icon: Sliders },
      { href: "/admin/notifications", label: "Notifications", icon: Bell, badge: "notifications" },
      { href: "/admin/messages", label: "Messages", icon: MessageSquare, badge: "messages" },
    ],
  },
  ...(ENABLE_ADMIN_EXTRA_SECTION
    ? [
        {
          group: "EXTRA",
          items: [
            { href: "/admin/extra/reviews", label: "Review moderation", icon: Star },
            { href: "/admin/extra/announcements", label: "Sitewide banners", icon: Megaphone },
            { href: "/admin/extra/audit-logs", label: "Audit logs", icon: History },
            { href: "/admin/extra/escrow", label: "Escrow ledger", icon: Landmark },
          ],
        },
      ]
    : []),
];

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dbStatus = useDatabaseStatus();
  const { collapsed } = useAdminSidebar();
  const [counts, setCounts] = useState<Record<string, number>>({});

  const isReportsPage = pathname === "/admin/reports" || pathname?.startsWith("/admin/reports");
  const activeReportTab = searchParams?.get("tab") || "client-registrations";
  const [reportsSubmenuOpen, setReportsSubmenuOpen] = useState(true);

  useEffect(() => {
    if (isReportsPage) {
      setReportsSubmenuOpen(true);
    }
  }, [isReportsPage]);

  useEffect(() => {
    let inflight = false;
    let lastLoaded = 0;
    const load = () => {
      const now = Date.now();
      if (inflight || now - lastLoaded < 600) return;
      inflight = true;
      void fetch("/api/admin/sidebar-counts", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: Record<string, number> | null) => {
          setCounts(data ?? {});
          lastLoaded = Date.now();
        })
        .catch(() => setCounts({}))
        .finally(() => {
          inflight = false;
        });
    };
    load();
    window.addEventListener("servio:notification", load);
    window.addEventListener("servio:message", load);
    window.addEventListener("servio:message-read", load);
    window.addEventListener("servio:notifications-read", load);
    window.addEventListener("servio:admin-overview-update", load);
    window.addEventListener("servio:admin-verifications-update", load);
    window.addEventListener("servio:admin-operations-update", load);
    window.addEventListener("servio:admin-users-update", load);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener("servio:notification", load);
      window.removeEventListener("servio:message", load);
      window.removeEventListener("servio:message-read", load);
      window.removeEventListener("servio:notifications-read", load);
      window.removeEventListener("servio:admin-overview-update", load);
      window.removeEventListener("servio:admin-verifications-update", load);
      window.removeEventListener("servio:admin-operations-update", load);
      window.removeEventListener("servio:admin-users-update", load);
      window.removeEventListener("focus", load);
    };
  }, []);

  useEffect(() => {
    let section: string | null = null;
    let badgeKey: string | null = null;

    if (pathname === "/admin/users") {
      section = "users";
      badgeKey = "newUsers";
    } else if (pathname === "/admin/verifications") {
      section = "verifications";
      badgeKey = "verification";
    } else if (pathname === "/admin/operations") {
      section = "operations";
      badgeKey = "jobs";
    } else if (pathname === "/admin/messages") {
      section = "messages";
      badgeKey = "messages";
    } else if (pathname === "/admin/notifications") {
      section = "notifications";
      badgeKey = "notifications";
    }

    if (!section) return;

    // Immediately clear in local sidebar state
    if (badgeKey) {
      setCounts((current) => ({ ...current, [badgeKey!]: 0 }));
    }

    void fetch("/api/admin/sidebar-counts", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ section }),
    }).then(() => {
      window.dispatchEvent(new Event("servio:notifications-read"));
      window.dispatchEvent(new Event("servio:message-read"));
    });
  }, [pathname]);

  return (
    <aside
      className={`fixed inset-y-0 hidden border-r border-slate-200 bg-white lg:flex lg:flex-col justify-between shadow-xs z-30 overflow-y-auto transition-all duration-200 ease-in-out ${
        collapsed ? "w-20 p-2.5 items-center" : "w-64 p-4"
      }`}
    >
      <div className={collapsed ? "w-full" : ""}>
        {/* Brand Header */}
        <Link
          href="/admin"
          prefetch={false}
          title="Klick-Pro Admin"
          className={`flex items-center gap-3 px-2 py-2 group ${collapsed ? "justify-center px-0" : ""}`}
        >
          <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg overflow-hidden bg-white border border-slate-200">
            <img
              src="/logo-icon.png"
              alt="" aria-hidden="true"
              className="h-full w-full object-contain p-0.5"
            />
          </div>
          {!collapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm text-slate-900 tracking-tight">
                  Klick-Pro
                </p>
                <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600 border border-slate-200">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">Platform Workspace</p>
            </div>
          )}
        </Link>

        {/* Grouped Navigation */}
        <nav className={`mt-5 ${collapsed ? "space-y-3" : "space-y-5"}`}>
          {linkGroups.map((group) => (
            <div key={group.group}>
              {!collapsed ? (
                <p className="px-2.5 text-[11px] font-medium tracking-normal text-slate-400 mb-1.5">
                  {group.group}
                </p>
              ) : (
                <div className="h-px w-6 bg-slate-200 mx-auto my-2" />
              )}
              <div className="space-y-0.5">
                {group.items.map((link) => {
                  const isThisReportLink = link.href === "/admin/reports";
                  const active = isThisReportLink
                    ? isReportsPage
                    : pathname === link.href;
                  const badgeCount = link.badge ? (counts[link.badge] ?? 0) : 0;

                  return (
                    <div key={link.href} className="space-y-0.5">
                      <Link
                        href={link.href}
                        prefetch={false}
                        title={link.label}
                        className={`group relative flex items-center rounded-lg transition-colors duration-150 ${
                          collapsed
                            ? "h-9 w-9 justify-center mx-auto"
                            : "gap-2.5 px-2.5 py-1.5 text-xs font-medium"
                        } ${
                          active
                            ? "bg-slate-100 text-slate-900 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <link.icon
                          className={`h-4 w-4 shrink-0 ${
                            active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-700"
                          }`}
                        />
                        {!collapsed && <span className="truncate">{link.label}</span>}
                        {badgeCount > 0 &&
                          (collapsed ? (
                            <span
                              className={`absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-medium text-white ${
                                link.badge === "payouts" ? "bg-amber-600" : "bg-slate-800"
                              }`}
                            >
                              {badgeCount > 99 ? "99+" : badgeCount}
                            </span>
                          ) : (
                            <span
                              className={`ml-auto grid h-4.5 min-w-4.5 place-items-center rounded-full px-1.5 text-[10px] font-medium border ${
                                link.badge === "payouts"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200/80"
                              }`}
                            >
                              {badgeCount > 99 ? "99+" : badgeCount}
                            </span>
                          ))}
                        {active && !collapsed && badgeCount === 0 && (
                          isThisReportLink ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setReportsSubmenuOpen((prev) => !prev);
                              }}
                              className="ml-auto p-0.5 rounded text-slate-500 hover:text-slate-900 transition"
                              aria-label={reportsSubmenuOpen ? "Collapse reports submenu" : "Expand reports submenu"}
                            >
                              {reportsSubmenuOpen ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5" />
                              )}
                            </button>
                          ) : (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-slate-900" />
                          )
                        )}
                      </Link>

                      {/* 3 Menus Sub-menu under Reports & Exports */}
                      {isThisReportLink && isReportsPage && reportsSubmenuOpen && !collapsed && (
                        <div className="ml-4 pl-3 border-l border-slate-200 space-y-0.5 py-0.5">
                          {REPORT_SUB_TABS.map((sub) => {
                            const SubIcon = sub.icon;
                            const currentTabParam = searchParams?.get("tab") || "users";
                            const isSubActive =
                              sub.id === "users"
                                ? (!searchParams?.get("tab") || ["users", "directory", "client-registrations", "client-activity", "client-engagement", "client-growth"].includes(currentTabParam))
                                : sub.id === "jobs"
                                  ? ["jobs", "operations", "support-complaints", "posting-growth"].includes(currentTabParam)
                                  : ["system-reliability", "reliability"].includes(currentTabParam);
                            return (
                              <Link
                                key={sub.id}
                                href={`/admin/reports?tab=${sub.id}`}
                                prefetch={false}
                                title={sub.label}
                                className={`group flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                                  isSubActive
                                    ? "bg-slate-100 text-slate-900 font-semibold"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                              >
                                <SubIcon
                                  className={`h-3.5 w-3.5 shrink-0 ${
                                    isSubActive
                                      ? "text-slate-900"
                                      : "text-slate-400 group-hover:text-slate-600"
                                  }`}
                                />
                                <span className="truncate">{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* System Status Footer */}
      {!collapsed ? (
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-700">Environment</p>
            <span className="rounded bg-white border border-slate-200 px-1 py-0.2 text-[9px] font-medium text-slate-500">
              v2.4.0
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                dbStatus === "connected"
                  ? "bg-emerald-500"
                  : dbStatus === "disconnected"
                    ? "bg-rose-500"
                    : "bg-slate-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                dbStatus === "connected"
                  ? "text-slate-700"
                  : dbStatus === "disconnected"
                    ? "text-rose-700"
                    : "text-slate-500"
              }`}
            >
              {dbStatus === "connected"
                ? "Operational"
                : dbStatus === "disconnected"
                  ? "Offline"
                  : "Checking…"}
            </span>
          </div>
        </div>
      ) : (
        <div
          title={
            dbStatus === "connected"
              ? "All services operational"
              : dbStatus === "disconnected"
                ? "Database disconnected"
                : "Checking health…"
          }
          className="my-3 flex justify-center"
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              dbStatus === "connected"
                ? "bg-emerald-500"
                : dbStatus === "disconnected"
                  ? "bg-rose-500"
                  : "bg-slate-400"
            }`}
          />
        </div>
      )}
    </aside>
  );
}
