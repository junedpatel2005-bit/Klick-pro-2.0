"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "@/lib/current-user";
import type { MarketingPageContent } from "@/lib/marketing-cms-shared";
import {
  Sparkles,
  ClipboardCheck,
  MessageCircle,
  ShieldCheck,
  Wallet,
  UserCheck,
  Search,
  Send,
  CheckCircle2,
  Lock,
  Banknote,
  ArrowRight,
  PlusCircle,
  Briefcase,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";

export default function HowItWorks({
  cmsMode = false,
  cmsContent,
}: {
  cmsMode?: boolean;
  cmsContent?: MarketingPageContent;
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
            <Sparkles className="h-3.5 w-3.5" /> {cmsContent?.hero?.label || "How It Works"}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
            {cmsContent?.hero?.title || "A Simpler Way to Hire & Get Hired"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            {cmsContent?.hero?.description ||
              "Klick-Pro handles the busywork \u2014 discovery, vetting, milestone escrow payments and tracking \u2014 for home, business and industrial services, online or on-site."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {user?.role === "CLIENT" ? (
              <>
                <Link
                  href="/post-job"
                  className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                >
                  <PlusCircle className="h-4 w-4" />
                  Post a Job
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Client Dashboard
                </Link>
              </>
            ) : user?.role === "PROFESSIONAL" ? (
              <>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
                >
                  <Search className="h-4 w-4" />
                  Browse Available Jobs
                </Link>
                <Link
                  href="/professional/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Pro Dashboard
                </Link>
              </>
            ) : user?.role === "ADMIN" ? (
              <>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Admin Console
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Browse Marketplace
                </Link>
              </>
            ) : (
              <>
                <a
                  href="#clients"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
                >
                  I Want to Hire
                </a>
                <a
                  href="#pros"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  I Offer Services
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. FOR CLIENTS */}
      <section id="clients" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">For Clients</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
            Hire the Right Expert in Four Steps
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            From quick home fixes to major industrial contracts, get verified expertise with complete peace of mind.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <article className="relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <span className="absolute right-6 top-6 font-display text-3xl font-extrabold text-slate-200 select-none">
              01
            </span>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Post Your Job</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Describe the work, location, budget and timeline. It is free and takes about 2 minutes.
            </p>
          </article>

          <article className="relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <span className="absolute right-6 top-6 font-display text-3xl font-extrabold text-slate-200 select-none">
              02
            </span>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Compare Proposals</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Receive quotes from vetted pros. Chat, check ratings and portfolios, and shortlist the best.
            </p>
          </article>

          <article className="relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <span className="absolute right-6 top-6 font-display text-3xl font-extrabold text-slate-200 select-none">
              03
            </span>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Hire Safely</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Agree on scope and milestones. Online funds are held in secure escrow until each milestone is approved.
            </p>
          </article>

          <article className="relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <span className="absolute right-6 top-6 font-display text-3xl font-extrabold text-slate-200 select-none">
              04
            </span>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Pay &amp; Review</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Release final payment and rate your pro to help the community choose well.
            </p>
          </article>
        </div>
      </section>

      {/* 3. FOR PROFESSIONALS */}
      <section id="pros" className="scroll-mt-20 border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">For Professionals</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              Turn Your Skills into Steady Work
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Work on your terms, build a verified reputation, and get 100% full payout upon milestone completion.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <article className="relative rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <span className="absolute right-6 top-6 font-display text-3xl font-extrabold text-slate-200 select-none">
                01
              </span>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Create Your Profile</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                List your services, rates, service area and past work, then complete verification.
              </p>
            </article>

            <article className="relative rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <span className="absolute right-6 top-6 font-display text-3xl font-extrabold text-slate-200 select-none">
                02
              </span>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Find Matching Jobs</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Browse jobs in your category and area, or let verified clients discover your profile.
              </p>
            </article>

            <article className="relative rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <span className="absolute right-6 top-6 font-display text-3xl font-extrabold text-slate-200 select-none">
                03
              </span>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Send a Proposal</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Share your quote, timeline and approach, and agree on milestones up front.
              </p>
            </article>

            <article className="relative rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <span className="absolute right-6 top-6 font-display text-3xl font-extrabold text-slate-200 select-none">
                04
              </span>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Deliver &amp; Get Paid</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Complete the work, collect your payment and build your client ratings.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 4. PAYMENTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Payments</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
            Pay Online or Offline
          </h2>
          <p className="mt-3 text-slate-500">
            Choose the option that suits the job. Both are tracked transparently on Klick-Pro.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Lock className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-[#0b1f4d]">Online Payment (Escrow)</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Funds held in escrow and released per approved milestone</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Ideal for remote, digital and larger commercial projects</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Auditable digital payment trail and receipt records</span>
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Banknote className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-[#0b1f4d]">Offline Payment (In Person)</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Pay in person once the work is completed and inspected</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Ideal for on-site residential, commercial repairs and field visits</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Agreed scope and pricing up front directly in the proposal</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* 5. BELIEF / BOTTOM CTA */}
      <section className="border-t border-slate-800 bg-[#081738] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Get Started Today
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Experience a Better Way to Work?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
            Join thousands of clients and verified professionals already connecting and growing on Klick-Pro.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {user?.role === "CLIENT" ? (
              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
              >
                <PlusCircle className="h-4 w-4" />
                Post a Job
              </Link>
            ) : user?.role === "PROFESSIONAL" ? (
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500"
              >
                <Search className="h-4 w-4" />
                Browse Jobs
              </Link>
            ) : (
              <>
                <Link
                  href="/post-job"
                  className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                >
                  <PlusCircle className="h-4 w-4" />
                  Post a Job
                </Link>
                <Link
                  href="/for-professionals"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                >
                  <Briefcase className="h-4 w-4" />
                  Join as a Professional
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
