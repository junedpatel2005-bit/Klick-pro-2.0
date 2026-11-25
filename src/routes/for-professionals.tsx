"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "@/lib/current-user";
import { capitalizeWords } from "@/lib/utils";
import { CmsBoxGroup, CmsPageProvider, CmsText, type PageTextsMap } from "@/components/cms/CmsText";
import {
  Sparkles,
  BadgeCheck,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Wallet,
  Home,
  Building2,
  Factory,
  HeartPulse,
  GraduationCap,
  ArrowRight,
  Briefcase,
  Banknote,
  CheckCircle2,
  Zap,
  Calculator,
  Star,
  FileText,
  Search,
  LayoutDashboard,
  ShieldAlert,
  PlusCircle,
  UserPlus,
} from "lucide-react";

const PRO_BENEFITS = [
  {
    legacyPrefix: "benefits.b1",
    icon: "trend" as const,
    defaults: {
      title: "Grow Your Business",
      desc: "Direct matchmaking connects your specific skills with motivated, verified clients in your sector.",
    },
  },
  {
    legacyPrefix: "benefits.b2",
    icon: "shield" as const,
    defaults: {
      title: "Verified Credibility",
      desc: "Government ID verification and background verification badges boost client confidence and conversion.",
    },
  },
  {
    legacyPrefix: "benefits.b3",
    icon: "map" as const,
    defaults: {
      title: "Nearby & Remote",
      desc: "Filter available jobs by distance, district, budget and urgency to bid on work that fits your schedule.",
    },
  },
  {
    legacyPrefix: "benefits.b4",
    icon: "wallet" as const,
    defaults: {
      title: "100% Full Payout",
      desc: "Receive 100% full payout on approved milestones with zero hidden commission deductions.",
    },
  },
];

const PRO_SECTORS = [
  {
    legacyPrefix: "who.s1",
    icon: "home" as const,
    defaults: {
      title: "Residential",
      desc: "Electricians, plumbers, painters, carpenters, cleaners, appliance technicians, and home repair experts.",
    },
  },
  {
    legacyPrefix: "who.s2",
    icon: "building" as const,
    defaults: {
      title: "Commercial",
      desc: "Interior designers, facility crews, network cabling technicians, accountants, security and event crews.",
    },
  },
  {
    legacyPrefix: "who.s3",
    icon: "factory" as const,
    defaults: {
      title: "Industrial",
      desc: "Precision welders, fabricators, heavy machinery technicians, PLC programmers and safety auditors.",
    },
  },
  {
    legacyPrefix: "who.s4",
    icon: "heart" as const,
    defaults: {
      title: "Health Care",
      desc: "Nurses, home caregivers, certified physiotherapists, medical equipment technicians and wellness therapists.",
    },
  },
  {
    legacyPrefix: "who.s5",
    icon: "sparkles" as const,
    defaults: {
      title: "Personal Care & Home Services",
      desc: "Stylists, beauticians, spa & massage therapists, fitness coaches, domestic help and culinary services.",
    },
  },
  {
    legacyPrefix: "who.s6",
    icon: "graduation" as const,
    defaults: {
      title: "Education",
      desc: "Academic tutors, language instructors, specialized vocational trainers, and exam preparation coaches.",
    },
  },
];

const PRO_START_STEPS = [
  {
    legacyPrefix: "start.s1",
    defaults: {
      title: "Create Your Profile",
      desc: "Add your skills, hourly or fixed rates, geographic coverage area, and portfolio photos of previous work.",
    },
  },
  {
    legacyPrefix: "start.s2",
    defaults: {
      title: "Get Verified",
      desc: "Upload your identity and professional certifications to earn the trusted verified badge clients look for.",
    },
  },
  {
    legacyPrefix: "start.s3",
    defaults: {
      title: "Send Proposals",
      desc: "Browse open job listings in your domain, submit custom proposals with clear milestone structures, and chat directly.",
    },
  },
  {
    legacyPrefix: "start.s4",
    defaults: {
      title: "Deliver & Get Paid",
      desc: "Finish each milestone, receive automatic escrow disbursements, and build reviews that unlock larger contracts.",
    },
  },
];

const PRO_TOOL_CARDS = [
  {
    legacyPrefix: "tools.c1",
    icon: "briefcase" as const,
    defaults: {
      title: "Tools to Run Your Business",
      li1: "A professional public storefront displaying verified credentials and ratings",
      li2: "Instant notifications for new job postings matching your categories",
      li3: "Integrated real-time chat, contract milestones, and file uploads",
    },
  },
  {
    legacyPrefix: "tools.c2",
    icon: "banknote" as const,
    defaults: {
      title: "Get Paid, Your Way",
      li1: "Online payments protected securely by milestone escrow",
      li2: "Direct offline payments for local on-site visits agreed up front",
      li3: "100% full payout with zero hidden fees or unexpected commission deductions",
    },
  },
];

const PRO_TIPS = [
  {
    legacyPrefix: "tips.t1",
    icon: "file" as const,
    defaults: {
      title: "Complete Profile",
      desc: "Profiles with photo portfolios and verified ID receive up to 4x more proposal responses.",
    },
  },
  {
    legacyPrefix: "tips.t2",
    icon: "zap" as const,
    defaults: {
      title: "Respond Fast",
      desc: "Replying within the first hour greatly improves your chances of securing the contract.",
    },
  },
  {
    legacyPrefix: "tips.t3",
    icon: "calc" as const,
    defaults: {
      title: "Itemize Proposals",
      desc: "Provide clear milestones and timeline estimates so clients understand the full scope.",
    },
  },
  {
    legacyPrefix: "tips.t4",
    icon: "star" as const,
    defaults: {
      title: "Earn 5-Star Reviews",
      desc: "Deliver quality results on time to build a strong reputation that wins repeated business.",
    },
  },
];

export type SampleProData = {
  id: number;
  name: string;
  initials: string;
  category: string;
  location: string;
  skills: string[];
  isVerified: boolean;
  rating: number;
  reviewCount: number;
};

export default function ForPros({
  cmsMode = false,
  samplePro,
  pageTexts,
  onTextChange,
}: {
  cmsMode?: boolean;
  samplePro?: SampleProData | null;
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

  const displayPro: SampleProData = samplePro ?? {
    id: 1,
    name: "Rajesh Patel",
    initials: "RP",
    category: "Commercial Electrician • Residential & Commercial",
    location: "Surat, Gujarat",
    skills: ["Industrial Wiring", "Switchboards", "Inverters & UPS"],
    isVerified: true,
    rating: 4.9,
    reviewCount: 28,
  };

  return (
    <CmsPageProvider cmsMode={cmsMode} pageTexts={pageTexts} onTextChange={onTextChange}>
      <div className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-[#1748b5]">
        {/* 1. HERO */}
        <section className="gradient-hero border-b border-slate-200/60">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
                <Sparkles className="h-3.5 w-3.5" />{" "}
                <CmsText id="hero.label" defaultText="For Professionals" />
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
                <CmsText id="hero.title" defaultText="Find Quality Jobs. Get Paid. Grow Your Business." />
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
                <CmsText
                  id="hero.description"
                  defaultText="Electrician, welder, designer, or consultant: no more chasing leads or waiting indefinitely on payments. Klick-Pro brings verified nearby and remote projects straight to you."
                />
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {user?.role === "PROFESSIONAL" ? (
                  <>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
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
                ) : user?.role === "CLIENT" ? (
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
                      <CmsText id="hero.btn.browseServices" defaultText="Browse Services" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup?role=pro"
                      className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                    >
                      <UserPlus className="h-4 w-4" />
                      <CmsText id="hero.btn.becomePro" defaultText="Become a Professional" />
                    </Link>
                    <Link
                      href="/how-it-works#pros"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <CmsText id="hero.btn.howItWorks" defaultText="How It Works" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Real Live Database Professional Showcase Card */}
            <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md transition hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">
                  <CmsText id="sample.badge" defaultText="Featured Verified Professional" />
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <BadgeCheck className="h-4 w-4" />{" "}
                  {displayPro.isVerified ? "Verified Professional" : "Registered Professional"}
                </span>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-blue-100 text-lg font-bold text-brand shadow-inner">
                  {displayPro.initials}
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-[#0b1f4d]">
                    {capitalizeWords(displayPro.name)}
                  </p>
                  <p className="text-sm leading-6 text-slate-500">
                    {capitalizeWords(displayPro.category)}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {displayPro.skills.length > 0 ? (
                  displayPro.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {capitalizeWords(skill)}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    Specialized Services
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <MapPin className="h-4 w-4 text-brand" /> {capitalizeWords(displayPro.location)}
                </span>
                <span className="font-semibold text-emerald-600">
                  <CmsText id="sample.status" defaultText="Open to New Jobs" />
                </span>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4 text-center">
                <Link
                  href="/signup?role=pro"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-hover"
                >
                  <CmsText id="sample.cta" defaultText="Create Your Profile Today" /> <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. BENEFITS */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              <CmsText id="benefits.eyebrow" defaultText="Why Professionals Join" />
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              <CmsText id="benefits.title" defaultText="Built to Help You Earn More" />
            </h2>
          </div>
          <CmsBoxGroup
            groupId="benefits"
            templates={PRO_BENEFITS}
            gridClassName="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            renderItem={(tpl) => {
              const Icon =
                tpl.icon === "shield"
                  ? ShieldCheck
                  : tpl.icon === "map"
                    ? MapPin
                    : tpl.icon === "wallet"
                      ? Wallet
                      : TrendingUp;
              return (
                <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
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

        {/* 3. WHO CAN JOIN (6 SECTORS) */}
        <section className="border-y border-slate-200/70 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                <CmsText id="who.eyebrow" defaultText="Who Can Join" />
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
                <CmsText id="who.title" defaultText="Every Skill Has a Place on Klick-Pro" />
              </h2>
              <p className="mt-3 text-slate-500">
                <CmsText
                  id="who.desc"
                  defaultText="Whether you are an independent craftsman or run a full enterprise team, list your service capabilities."
                />
              </p>
            </div>
            <CmsBoxGroup
              groupId="sectors"
              templates={PRO_SECTORS}
              gridClassName="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              renderItem={(tpl) => {
                const Icon =
                  tpl.icon === "building"
                    ? Building2
                    : tpl.icon === "factory"
                      ? Factory
                      : tpl.icon === "heart"
                        ? HeartPulse
                        : tpl.icon === "sparkles"
                          ? Sparkles
                          : tpl.icon === "graduation"
                            ? GraduationCap
                            : Home;
                return (
                  <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">
                      <CmsText id="title" defaultText={tpl.defaults.title} />
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      <CmsText id="desc" defaultText={tpl.defaults.desc} />
                    </p>
                  </article>
                );
              }}
            />
            <p className="mt-8 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover"
              >
                <CmsText id="who.link" defaultText="View All Service Categories" /> <ArrowRight className="h-4 w-4" />
              </Link>
            </p>
          </div>
        </section>

        {/* 4. GETTING STARTED */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                <CmsText id="start.eyebrow" defaultText="Start Earning" />
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
                <CmsText id="start.title" defaultText="Up and Running in Four Steps" />
              </h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                <CmsText
                  id="start.desc"
                  defaultText="Joining is seamless. Set up your profile once and start bidding on high-quality projects."
                />
              </p>
              <Link
                href="/signup?role=pro"
                className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover"
              >
                <CmsText id="start.link" defaultText="Open Your Professional Account" /> <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <CmsBoxGroup
              groupId="startSteps"
              templates={PRO_START_STEPS}
              itemTag="li"
              gridClassName="space-y-4 lg:col-span-3"
              renderItem={(tpl, { index }) => (
                <div className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0b1f4d]">
                      <CmsText id="title" defaultText={tpl.defaults.title} />
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      <CmsText id="desc" defaultText={tpl.defaults.desc} />
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        </section>

        {/* 5. TOOLS + PAYMENTS */}
        <section className="border-y border-slate-200/70 bg-white">
          <CmsBoxGroup
            groupId="toolCards"
            templates={PRO_TOOL_CARDS}
            gridClassName="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8"
            renderItem={(tpl) => {
              const Icon = tpl.icon === "banknote" ? Banknote : Briefcase;
              return (
                <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-8 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
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

        {/* 6. TIPS TO WIN WORK */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              <CmsText id="tips.eyebrow" defaultText="Win More Work" />
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              <CmsText id="tips.title" defaultText="What Top Professionals Do Differently" />
            </h2>
          </div>
          <CmsBoxGroup
            groupId="tips"
            templates={PRO_TIPS}
            gridClassName="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            renderItem={(tpl) => {
              const Icon =
                tpl.icon === "zap"
                  ? Zap
                  : tpl.icon === "calc"
                    ? Calculator
                    : tpl.icon === "star"
                      ? Star
                      : FileText;
              return (
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">
                    <CmsText id="title" defaultText={tpl.defaults.title} />
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    <CmsText id="desc" defaultText={tpl.defaults.desc} />
                  </p>
                </div>
              );
            }}
          />
        </section>

        {/* 7. BOTTOM CTA */}
        <section className="border-t border-slate-800 bg-[#081738] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              <CmsText id="cta.eyebrow" defaultText="Join the Network" />
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
              <CmsText id="cta.title" defaultText="Ready to Take Your Business to the Next Level?" />
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              <CmsText
                id="cta.desc"
                defaultText="Sign up in minutes, verify your credentials, and start receiving job notifications today."
              />
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup?role=pro"
                className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
              >
                <UserPlus className="h-4 w-4" />
                <CmsText id="cta.btn1" defaultText="Join as a Professional" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                <Search className="h-4 w-4" />
                <CmsText id="cta.btn2" defaultText="Browse Current Jobs" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CmsPageProvider>
  );
}
