"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Clock3,
  ShieldCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { capitalizeWords, capitalizeFirst } from "@/lib/utils";

type Data = {
  clients: number;
  professionals: number;
  pendingVerifications: number;
  jobs: number;
  disputes: number;
  payments: number;
  newUsers: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
  newJobs: {
    id: number;
    title: string | null;
    category: string | null;
    status: string;
    createdAt: string;
    user: { firstName: string; lastName: string };
  }[];
  newDisputes: {
    id: number;
    issueType: string;
    priority: string;
    status: string;
    createdAt: string;
  }[];
};

const ago = (date: string) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));

export default function Admin() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    void fetch("/api/v1/admin/data/overview", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload) setData(payload);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    window.addEventListener("servio:admin-overview-update", load);
    window.addEventListener("servio:notification", load);
    window.addEventListener("servio:project-update", load);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener("servio:admin-overview-update", load);
      window.removeEventListener("servio:notification", load);
      window.removeEventListener("servio:project-update", load);
      window.removeEventListener("focus", load);
    };
  }, []);

  const cards = [
    {
      label: "Registered Clients",
      value: data?.clients,
      icon: UsersRound,
      href: "/admin/users",
      badge: "Accounts",
    },
    {
      label: "Verified Professionals",
      value: data?.professionals,
      icon: BriefcaseBusiness,
      href: "/admin/users",
      badge: "Partners",
    },
    {
      label: "Pending Verifications",
      value: data?.pendingVerifications,
      icon: ShieldCheck,
      href: "/admin/verifications",
      badge: "Review Queue",
      isPending: (data?.pendingVerifications ?? 0) > 0,
    },
    {
      label: "Active Operations & Disputes",
      value: data?.disputes,
      icon: AlertTriangle,
      href: "/admin/operations",
      badge: "Tickets",
      isAction: (data?.disputes ?? 0) > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-500">Live operational sync</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Platform Overview
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Marketplace accounts, job workflows, verification requests, and dispute queues.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/verifications"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
            Verifications
          </Link>
          <Link
            href="/admin/operations"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 transition"
          >
            <BriefcaseBusiness className="h-3.5 w-3.5 text-slate-300" />
            Manage Jobs
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60">
                <card.icon className="h-4 w-4" />
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                  card.isAction
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : card.isPending
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200/60"
                }`}
              >
                {card.badge}
              </span>
            </div>
            {loading || data === null ? (
              <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200" />
            ) : (
              <p className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {card.value ?? 0}
              </p>
            )}
            <p className="mt-1 text-xs font-medium text-slate-500">{card.label}</p>
          </Link>
        ))}
      </div>


      {/* Activity Feeds */}
      <div className="grid gap-5 xl:grid-cols-3">
        <Latest title="Accounts Directory" icon={UsersRound} href="/admin/users">
          {loading || data === null ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                      <div className="h-2.5 w-36 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                  <div className="h-5 w-12 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : data.newUsers.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">No recent user registrations.</p>
          ) : (
            data.newUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 font-semibold text-xs text-slate-700 border border-slate-200">
                    {user.firstName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                      {capitalizeWords(`${user.firstName} ${user.lastName}`)}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email} ·{" "}
                      <span className="font-medium text-slate-700">{capitalizeWords(user.role)}</span>
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {ago(user.createdAt)}
                </span>
              </div>
            ))
          )}
        </Latest>

        <Latest title="Recent job posts" icon={BriefcaseBusiness} href="/admin/operations">
          {loading || data === null ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2">
                  <div className="space-y-1.5">
                    <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
                    <div className="h-2.5 w-44 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="h-5 w-12 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : data.newJobs.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">No recent job posts.</p>
          ) : (
            data.newJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                    {capitalizeFirst(job.title ?? "Untitled Job")}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {capitalizeWords(job.category ?? "General")} · {capitalizeWords(`${job.user.firstName} ${job.user.lastName}`)}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {ago(job.createdAt)}
                </span>
              </div>
            ))
          )}
        </Latest>

        <Latest title="Disputes & inquiries" icon={AlertTriangle} href="/admin/operations">
          {loading || data === null ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2">
                  <div className="space-y-1.5">
                    <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
                    <div className="h-2.5 w-40 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="h-5 w-12 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : data.newDisputes.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              No active disputes or inquiries.
            </p>
          ) : (
            data.newDisputes.map((dispute) => (
              <div key={dispute.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">{dispute.issueType}</p>
                  <p className="text-xs text-slate-500 truncate">
                    <span
                      className={`font-semibold ${
                        dispute.priority === "HIGH" || dispute.priority === "URGENT"
                          ? "text-rose-700"
                          : "text-amber-700"
                      }`}
                    >
                      {dispute.priority}
                    </span>{" "}
                    · {dispute.status}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {ago(dispute.createdAt)}
                </span>
              </div>
            ))
          )}
        </Latest>
      </div>
    </div>
  );
}

function Latest({
  title,
  icon: Icon,
  href,
  children,
}: {
  title: string;
  icon: typeof Clock3;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        </div>
        <Link href={href} className="text-xs font-medium text-slate-500 hover:text-slate-900 transition">
          View all →
        </Link>
      </div>
      <div className="mt-1 divide-y divide-slate-100">
        {children || <p className="py-6 text-sm text-slate-400">No recent records.</p>}
      </div>
    </section>
  );
}
