"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "@/lib/current-user";
import { CmsBoxGroup, CmsPageProvider, CmsText, type PageTextsMap } from "@/components/cms/CmsText";
import {
  Sparkles,
  Check,
  Star,
  Briefcase,
  CheckCircle2,
  PlusCircle,
  UserPlus,
  ArrowRight,
} from "lucide-react";

const PRICING_TIERS = [
  {
    legacyPrefix: "card1",
    icon: "check" as const,
    href: "/post-job",
    btnIcon: "plus" as const,
    featured: false,
    defaults: {
      title: "For Clients",
      price: "₹0",
      period: "Free forever",
      desc: "Post jobs, receive customized quotes, chat with verified professionals, and manage milestone deliverables at zero platform fee.",
      includedLabel: "What is included:",
      li1: "Free unlimited job postings",
      li2: "Direct messaging and file sharing",
      li3: "Protected milestone escrow",
      li4: "Choose online or offline payments",
      btn: "Post a Job Now",
    },
  },
  {
    legacyPrefix: "card2",
    icon: "star" as const,
    href: "/signup?role=pro",
    btnIcon: "userPlus" as const,
    featured: true,
    defaults: {
      badge: "Popular for Professionals",
      title: "For Professionals",
      price: "100%",
      period: "Milestone payout",
      desc: "Win quality contracts, showcase your verified portfolio, and collect 100% full disbursement upon completed milestones.",
      includedLabel: "What is included:",
      li1: "Free professional profile & storefront",
      li2: "Submit proposals to matching jobs",
      li3: "Verified professional credibility badge",
      li4: "Fast withdrawal to bank or UPI",
      btn: "Join as a Professional",
    },
  },
  {
    legacyPrefix: "card3",
    icon: "briefcase" as const,
    href: "/contact",
    btnIcon: "none" as const,
    featured: false,
    defaults: {
      title: "Commercial & Enterprise",
      price: "Custom",
      period: "Corporate solutions",
      desc: "Tailored service contracts for commercial facilities, factories, industrial plants, and multi-location businesses.",
      includedLabel: "What is included:",
      li1: "Dedicated account management",
      li2: "Corporate billing & GST invoices",
      li3: "Custom SLAs & priority dispatch",
      li4: "Multi-professional crew deployment",
      btn: "Talk to Enterprise Team",
    },
  },
];

export default function Pricing({
  cmsMode = false,
  pageTexts,
  onTextChange,
}: {
  cmsMode?: boolean;
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

  void user;

  return (
    <CmsPageProvider cmsMode={cmsMode} pageTexts={pageTexts} onTextChange={onTextChange}>
      <div className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-[#1748b5]">
        {/* 1. HERO */}
        <section className="gradient-hero border-b border-slate-200/60">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
              <Sparkles className="h-3.5 w-3.5" />{" "}
              <CmsText id="hero.label" defaultText="Transparent Pricing" />
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
              <CmsText id="hero.title" defaultText="Simple, Transparent Pricing" />
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              <CmsText
                id="hero.description"
                defaultText="100% free for clients to post jobs and review proposals. Professionals receive 100% full payout on approved milestones with zero hidden charges."
              />
            </p>
          </div>
        </section>

        {/* 2. PRICING TIERS */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <CmsBoxGroup
            groupId="tiers"
            templates={PRICING_TIERS}
            gridClassName="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            renderItem={(tpl) => {
              const Icon =
                tpl.icon === "star" ? Star : tpl.icon === "briefcase" ? Briefcase : Check;
              const d = tpl.defaults;
              return (
                <article
                  className={`relative flex flex-col justify-between rounded-3xl bg-white p-8 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    tpl.featured
                      ? "border-2 border-brand shadow-md"
                      : "border border-slate-200/90 shadow-sm"
                  }`}
                >
                  {tpl.featured && d.badge && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                      <CmsText id="badge" defaultText={d.badge} />
                    </span>
                  )}
                  <div>
                    <div
                      className={`grid h-12 w-12 place-items-center rounded-2xl text-brand ${
                        tpl.featured ? "bg-blue-100" : "bg-blue-50"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-6 font-display text-2xl font-bold text-[#0b1f4d]">
                      <CmsText id="title" defaultText={d.title} />
                    </h2>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-extrabold text-[#0b1f4d]">
                        <CmsText id="price" defaultText={d.price} />
                      </span>
                      <span className="text-sm font-semibold text-slate-500">
                        <CmsText id="period" defaultText={d.period} />
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      <CmsText id="desc" defaultText={d.desc} />
                    </p>

                    <div className="mt-6 border-t border-slate-100 pt-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        <CmsText id="includedLabel" defaultText={d.includedLabel} />
                      </p>
                      <ul className="mt-4 space-y-3 text-sm text-slate-600">
                        <li className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <CmsText id="li1" defaultText={d.li1} />
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <CmsText id="li2" defaultText={d.li2} />
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <CmsText id="li3" defaultText={d.li3} />
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <CmsText id="li4" defaultText={d.li4} />
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link
                      href={tpl.href}
                      className={
                        tpl.btnIcon === "plus"
                          ? "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                          : tpl.btnIcon === "userPlus"
                            ? "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-3.5 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-cta/90"
                            : "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      }
                    >
                      {tpl.btnIcon === "plus" && <PlusCircle className="h-4 w-4" />}
                      {tpl.btnIcon === "userPlus" && <UserPlus className="h-4 w-4" />}
                      <CmsText id="btn" defaultText={d.btn} />
                    </Link>
                  </div>
                </article>
              );
            }}
          />
        </section>

        {/* 3. TRUST BANNER */}
        <section className="border-t border-slate-800 bg-[#081738] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              <CmsText id="cta.eyebrow" defaultText="Escrow Protection" />
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
              <CmsText id="cta.title" defaultText="Peace of Mind on Every Milestone" />
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              <CmsText
                id="cta.desc"
                defaultText="Funds remain in secure escrow until you inspect and approve completed deliverables. No unexpected surprises, no delays."
              />
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-cta/90"
              >
                <CmsText id="cta.btn" defaultText="See How Milestone Payments Work" />{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CmsPageProvider>
  );
}
