"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "@/lib/current-user";
import type { MarketingPageContent } from "@/lib/marketing-cms-shared";
import { CmsBoxGroup, CmsPageProvider, CmsText, type PageTextsMap } from "@/components/cms/CmsText";
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

const CLIENT_STEPS = [
  {
    legacyPrefix: "clients.s1",
    icon: "clipboard" as const,
    defaults: {
      title: "Post Your Job",
      desc: "Describe the work, location, budget and timeline. It is free and takes about 2 minutes.",
    },
  },
  {
    legacyPrefix: "clients.s2",
    icon: "message" as const,
    defaults: {
      title: "Compare Proposals",
      desc: "Receive quotes from vetted professionals. Chat, check ratings and portfolios, and shortlist the best.",
    },
  },
  {
    legacyPrefix: "clients.s3",
    icon: "shield" as const,
    defaults: {
      title: "Hire Safely",
      desc: "Agree on scope and milestones. Online funds are held in secure escrow until each milestone is approved.",
    },
  },
  {
    legacyPrefix: "clients.s4",
    icon: "wallet" as const,
    defaults: {
      title: "Pay & Review",
      desc: "Release final payment and rate your professional to help the community choose well.",
    },
  },
];

const PRO_STEPS = [
  {
    legacyPrefix: "pros.s1",
    icon: "userCheck" as const,
    defaults: {
      title: "Create Your Profile",
      desc: "List your services, rates, service area and past work, then complete verification.",
    },
  },
  {
    legacyPrefix: "pros.s2",
    icon: "search" as const,
    defaults: {
      title: "Find Matching Jobs",
      desc: "Browse jobs in your category and area, or let verified clients discover your profile.",
    },
  },
  {
    legacyPrefix: "pros.s3",
    icon: "send" as const,
    defaults: {
      title: "Send a Proposal",
      desc: "Share your quote, timeline and approach, and agree on milestones up front.",
    },
  },
  {
    legacyPrefix: "pros.s4",
    icon: "check" as const,
    defaults: {
      title: "Deliver & Get Paid",
      desc: "Complete the work, collect your payment and build your client ratings.",
    },
  },
];

const PAYMENT_CARDS = [
  {
    legacyPrefix: "escrow.online",
    icon: "lock" as const,
    defaults: {
      title: "Online Payment (Escrow)",
      li1: "Funds held in escrow and released per approved milestone",
      li2: "Ideal for remote, digital and larger commercial projects",
      li3: "Auditable digital payment trail and receipt records",
    },
  },
  {
    legacyPrefix: "escrow.offline",
    icon: "banknote" as const,
    defaults: {
      title: "Offline Payment (In Person)",
      li1: "Pay in person once the work is completed and inspected",
      li2: "Ideal for on-site residential, commercial repairs and field visits",
      li3: "Agreed scope and pricing up front directly in the proposal",
    },
  },
];

export default function HowItWorks({
  cmsMode = false,
  cmsContent,
  pageTexts,
  onTextChange,
}: {
  cmsMode?: boolean;
  cmsContent?: MarketingPageContent;
  pageTexts?: PageTextsMap;
  onTextChange?: (id: string, value: string) => void;
} = {}) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (cmsMode) return;
    void fetchCurrentUser()
      .then((res) => setUser(res.user ?? null))
      .catch(() => setUser(null));
  }, [cmsMode]);

  return (
    <CmsPageProvider cmsMode={cmsMode} pageTexts={pageTexts} onTextChange={onTextChange}>
      <div className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-[#1748b5]">
        {/* 1. HERO */}
        <section className="gradient-hero border-b border-slate-200/60">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
              <Sparkles className="h-3.5 w-3.5" />{" "}
              <CmsText id="hero.label" defaultText={cmsContent?.hero?.label || "How It Works"} />
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
              <CmsText id="hero.title" defaultText={cmsContent?.hero?.title || "A Simpler Way to Hire & Get Hired"} />
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              <CmsText
                id="hero.description"
                defaultText={
                  cmsContent?.hero?.description ||
                  "Klick-Pro handles the busywork — discovery, vetting, milestone escrow payments and tracking — for home, business and industrial services, online or on-site."
                }
              />
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {user?.role === "CLIENT" ? (
                <>
                  <Link
                    href="/post-job"
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <CmsText id="hero.btn.postJob" defaultText="Post a Job" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <CmsText id="hero.btn.clientDash" defaultText="Client Dashboard" />
                  </Link>
                </>
              ) : user?.role === "PROFESSIONAL" ? (
                <>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-cta/90"
                  >
                    <Search className="h-4 w-4" />
                    <CmsText id="hero.btn.browseJobs" defaultText="Browse Available Jobs" />
                  </Link>
                  <Link
                    href="/professional/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <CmsText id="hero.btn.proDash" defaultText="Professional Dashboard" />
                  </Link>
                </>
              ) : user?.role === "ADMIN" ? (
                <>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-cta/90"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <CmsText id="hero.btn.admin" defaultText="Admin Console" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <CmsText id="hero.btn.marketplace" defaultText="Browse Marketplace" />
                  </Link>
                </>
              ) : (
                <>
                  <a
                    href="#clients"
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-cta/90"
                  >
                    <CmsText id="hero.btn.hire" defaultText="I Want to Hire" />
                  </a>
                  <a
                    href="#pros"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <CmsText id="hero.btn.offer" defaultText="I Offer Services" />
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 2. FOR CLIENTS */}
        <section id="clients" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              <CmsText id="clients.eyebrow" defaultText="For Clients" />
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              <CmsText id="clients.title" defaultText="Hire the Right Expert in Four Steps" />
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              <CmsText
                id="clients.desc"
                defaultText="From quick home fixes to major industrial contracts, get verified expertise with complete peace of mind."
              />
            </p>
          </div>
          <CmsBoxGroup
            groupId="clientSteps"
            templates={CLIENT_STEPS}
            gridClassName="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            renderItem={(tpl, { index }) => {
              const Icon =
                tpl.icon === "message"
                  ? MessageCircle
                  : tpl.icon === "shield"
                    ? ShieldCheck
                    : tpl.icon === "wallet"
                      ? Wallet
                      : ClipboardCheck;
              return (
                <article className="relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <span className="absolute right-6 top-6 font-display text-3xl font-extrabold text-slate-200 select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">
                    <CmsText id="title" defaultText={tpl.defaults.title} />
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    <CmsText id="desc" defaultText={tpl.defaults.desc} />
                  </p>
                </article>
              );
            }}
          />
        </section>

        {/* 3. FOR PROFESSIONALS */}
        <section id="pros" className="scroll-mt-20 border-y border-slate-200/70 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                <CmsText id="pros.eyebrow" defaultText="For Professionals" />
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
                <CmsText id="pros.title" defaultText="Turn Your Skills into Steady Work" />
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                <CmsText
                  id="pros.desc"
                  defaultText="Work on your terms, build a verified reputation, and get 100% full payout upon milestone completion."
                />
              </p>
            </div>
            <CmsBoxGroup
              groupId="proSteps"
              templates={PRO_STEPS}
              gridClassName="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              renderItem={(tpl, { index }) => {
                const Icon =
                  tpl.icon === "search"
                    ? Search
                    : tpl.icon === "send"
                      ? Send
                      : tpl.icon === "check"
                        ? CheckCircle2
                        : UserCheck;
                return (
                  <article className="relative rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
                    <span className="absolute right-6 top-6 font-display text-3xl font-extrabold text-slate-200 select-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">
                      <CmsText id="title" defaultText={tpl.defaults.title} />
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      <CmsText id="desc" defaultText={tpl.defaults.desc} />
                    </p>
                  </article>
                );
              }}
            />
          </div>
        </section>

        {/* 4. PAYMENTS */}
        <section id="escrow" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              <CmsText id="escrow.eyebrow" defaultText="Payments" />
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              <CmsText id="escrow.title" defaultText="Online Escrow or Offline in Person" />
            </h2>
            <p className="mt-3 text-slate-500">
              <CmsText
                id="escrow.desc"
                defaultText="Choose the option that suits the job. Both are tracked transparently on Klick-Pro."
              />
            </p>
          </div>
          <CmsBoxGroup
            groupId="paymentCards"
            templates={PAYMENT_CARDS}
            gridClassName="mt-12 grid gap-6 md:grid-cols-2"
            renderItem={(tpl) => {
              const Icon = tpl.icon === "banknote" ? Banknote : Lock;
              return (
                <article className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-[#0b1f4d]">
                    <CmsText id="title" defaultText={tpl.defaults.title} />
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                      <CmsText id="li1" defaultText={tpl.defaults.li1} />
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                      <CmsText id="li2" defaultText={tpl.defaults.li2} />
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                      <CmsText id="li3" defaultText={tpl.defaults.li3} />
                    </li>
                  </ul>
                </article>
              );
            }}
          />
        </section>

        {/* 5. BELIEF / BOTTOM CTA */}
        <section className="border-t border-slate-800 bg-[#081738] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              <CmsText id="cta.eyebrow" defaultText="Get Started Today" />
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
              <CmsText id="cta.title" defaultText="Ready to Experience a Better Way to Work?" />
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              <CmsText
                id="cta.desc"
                defaultText="Join thousands of clients and verified professionals already connecting and growing on Klick-Pro."
              />
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {user?.role === "CLIENT" ? (
                <Link
                  href="/post-job"
                  className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                >
                  <PlusCircle className="h-4 w-4" />
                  <CmsText id="cta.btn.postJob" defaultText="Post a Job" />
                </Link>
              ) : user?.role === "PROFESSIONAL" ? (
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-cta/90"
                >
                  <Search className="h-4 w-4" />
                  <CmsText id="cta.btn.browseJobs" defaultText="Browse Jobs" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/post-job"
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <CmsText id="cta.btn.postJob" defaultText="Post a Job" />
                  </Link>
                  <Link
                    href="/for-professionals"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                  >
                    <Briefcase className="h-4 w-4" />
                    <CmsText id="cta.btn.joinPro" defaultText="Join as a Professional" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </CmsPageProvider>
  );
}
