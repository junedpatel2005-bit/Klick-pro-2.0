"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "@/lib/current-user";
import {
  Sparkles,
  Check,
  Star,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  LayoutDashboard,
  Search,
  ShieldAlert,
  UserPlus,
  ArrowRight,
} from "lucide-react";

export default function Pricing({
  cmsMode = false,
}: {
  cmsMode?: boolean;
} = {}) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (cmsMode) return;
    void fetchCurrentUser()
      .then((res) => setUser(res.user ?? null))
      .catch(() => setUser(null));
  }, [cmsMode]);

  return (
    <div className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-[#1748b5]">
      {/* 1. HERO */}
      <section className="gradient-hero border-b border-slate-200/60">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
            <Sparkles className="h-3.5 w-3.5" /> Transparent Pricing
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            100% free for clients to post jobs and review proposals. Professionals receive 100% full payout on approved milestones with zero hidden charges.
          </p>
        </div>
      </section>

      {/* 2. PRICING TIERS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: For Clients */}
          <article className="relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm transition hover:shadow-md">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-brand">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold text-[#0b1f4d]">For Clients</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-[#0b1f4d]">₹0</span>
                <span className="text-sm font-semibold text-slate-500">Free forever</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Post jobs, receive customized quotes, chat with verified pros, and manage milestone deliverables at zero platform fee.
              </p>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">What is included:</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Free unlimited job postings</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Direct messaging and file sharing</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Protected milestone escrow</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Choose online or offline payments</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/post-job"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
              >
                <PlusCircle className="h-4 w-4" />
                Post a Job Now
              </Link>
            </div>
          </article>

          {/* Card 2: For Professionals */}
          <article className="relative flex flex-col justify-between rounded-3xl border-2 border-brand bg-white p-8 shadow-md">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
              Popular for Professionals
            </span>
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-brand">
                <Star className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold text-[#0b1f4d]">For Professionals</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-[#0b1f4d]">100%</span>
                <span className="text-sm font-semibold text-slate-500">Milestone payout</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Win quality contracts, showcase your verified portfolio, and collect 100% full disbursement upon completed milestones.
              </p>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">What is included:</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Free professional profile &amp; storefront</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Submit proposals to matching jobs</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Verified professional credibility badge</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Fast withdrawal to bank or UPI</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/signup?role=pro"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
              >
                <UserPlus className="h-4 w-4" />
                Join as a Professional
              </Link>
            </div>
          </article>

          {/* Card 3: Business & Enterprise */}
          <article className="relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm transition hover:shadow-md">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-brand">
                <Briefcase className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold text-[#0b1f4d]">Commercial &amp; Enterprise</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-[#0b1f4d]">Custom</span>
                <span className="text-sm font-semibold text-slate-500">Corporate solutions</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Tailored service contracts for commercial facilities, factories, industrial plants, and multi-location businesses.
              </p>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">What is included:</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Dedicated account management</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Corporate billing &amp; GST invoices</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Custom SLAs &amp; priority dispatch</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Multi-professional crew deployment</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Talk to Enterprise Team
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* 3. TRUST BANNER */}
      <section className="border-t border-slate-800 bg-[#081738] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Escrow Protection
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Peace of Mind on Every Milestone
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
            Funds remain in secure escrow until you inspect and approve completed deliverables. No unexpected surprises, no delays.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500"
            >
              See How Milestone Payments Work <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
