"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "@/lib/current-user";
import { capitalizeWords } from "@/lib/utils";
import { CmsBoxGroup, CmsPageProvider, CmsText, type PageTextsMap } from "@/components/cms/CmsText";
import {
  Sparkles,
  MapPin,
  Calendar,
  Home,
  Building2,
  Factory,
  Laptop,
  CreditCard,
  ShieldCheck,
  Wallet,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  ListChecks,
  Image as ImageIcon,
  IndianRupee,
  CalendarClock,
  PlusCircle,
  LayoutDashboard,
  Search,
  ShieldAlert,
} from "lucide-react";

const CLIENT_BENEFITS = [
  {
    legacyPrefix: "benefits.b1",
    icon: "shield" as const,
    defaults: {
      title: "Vetted Professionals",
      desc: "Every professional is ID-verified. Background checks and trade certifications for in-home and industrial services.",
    },
  },
  {
    legacyPrefix: "benefits.b2",
    icon: "wallet" as const,
    defaults: {
      title: "Escrow Payments",
      desc: "Your money is safe. Online funds are held securely and released only when you approve each milestone.",
    },
  },
  {
    legacyPrefix: "benefits.b3",
    icon: "clock" as const,
    defaults: {
      title: "Fast Matches",
      desc: "Get competitive proposals from available nearby or remote professionals in under 2 hours on average.",
    },
  },
  {
    legacyPrefix: "benefits.b4",
    icon: "users" as const,
    defaults: {
      title: "Dedicated Support",
      desc: "Real human support whenever you need assistance with requirements, negotiations, or milestone releases.",
    },
  },
];

const CLIENT_HIRE_TYPES = [
  {
    legacyPrefix: "hire.c1",
    icon: "home" as const,
    defaults: {
      title: "At Home",
      desc: "Electrical, plumbing, cleaning, painting, appliance repair, home renovation and tutors.",
    },
  },
  {
    legacyPrefix: "hire.c2",
    icon: "building" as const,
    defaults: {
      title: "For Your Business",
      desc: "Office interiors, facility upkeep, digital marketing, bookkeeping, IT support and events.",
    },
  },
  {
    legacyPrefix: "hire.c3",
    icon: "factory" as const,
    defaults: {
      title: "For Your Plant",
      desc: "Machinery maintenance, industrial fabrication, heavy electrical, safety auditing and logistics.",
    },
  },
  {
    legacyPrefix: "hire.c4",
    icon: "laptop" as const,
    defaults: {
      title: "Online & Remote",
      desc: "Web development, UI/UX design, mobile apps, software architecture and expert consulting.",
    },
  },
];

const CLIENT_JOURNEY_STEPS = [
  {
    legacyPrefix: "journey.s1",
    defaults: {
      title: "Post Your Job",
      desc: "Describe the work, location, budget and timeline. Add photos or files to help professionals submit accurate estimates.",
    },
  },
  {
    legacyPrefix: "journey.s2",
    defaults: {
      title: "Compare Proposals",
      desc: "Review itemized quotes, ratings, client reviews and portfolios, and chat with your shortlist before deciding.",
    },
  },
  {
    legacyPrefix: "journey.s3",
    defaults: {
      title: "Hire & Track Progress",
      desc: "Agree on milestones, follow live task updates, and keep all communication and work files in one unified workspace.",
    },
  },
  {
    legacyPrefix: "journey.s4",
    defaults: {
      title: "Pay & Review",
      desc: "Release payment once satisfied with deliverables, then leave an honest review to empower the community.",
    },
  },
];

const CLIENT_TIPS = [
  {
    legacyPrefix: "tips.t1",
    icon: "list" as const,
    defaults: {
      title: "Be Specific",
      desc: "State clearly what needs to be done, requirements, and what completion looks like.",
    },
  },
  {
    legacyPrefix: "tips.t2",
    icon: "image" as const,
    defaults: {
      title: "Add Photos",
      desc: "Pictures, sketches and measurements help professionals provide exact quotes.",
    },
  },
  {
    legacyPrefix: "tips.t3",
    icon: "rupee" as const,
    defaults: {
      title: "Share a Realistic Budget",
      desc: "A transparent budget range attracts serious, high-caliber proposals quickly.",
    },
  },
  {
    legacyPrefix: "tips.t4",
    icon: "calendar" as const,
    defaults: {
      title: "Set a Timeline",
      desc: "Indicate whether you need immediate assistance or are scheduling for next week.",
    },
  },
];

export type SampleJobData = {
  id: number;
  title: string;
  category: string;
  location: string;
  workMode: string;
  timeline: string;
  proposalsCount: number;
  proposals: Array<{
    letter: string;
    proName: string;
    category: string;
  }>;
};

export default function ForClients({
  cmsMode = false,
  sampleJob,
  pageTexts,
  onTextChange,
}: {
  cmsMode?: boolean;
  sampleJob?: SampleJobData | null;
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

  const displayJob: SampleJobData = sampleJob ?? {
    id: 1,
    title: "Rewire 2BHK Apartment and Install New Switchboards",
    category: "Residential Electrical",
    location: "On-site",
    workMode: "On-site",
    timeline: "This Week",
    proposalsCount: 3,
    proposals: [
      { letter: "A", proName: "Verified Electrician", category: "Electrical" },
      { letter: "B", proName: "Verified Electrician", category: "Electrical" },
      { letter: "C", proName: "Verified Electrician", category: "Electrical" },
    ],
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
                <CmsText id="hero.label" defaultText="For Clients" />
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
                <CmsText
                  id="hero.title"
                  defaultText="Hire Trusted Professionals — Without the Back-and-Forth"
                />
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
                <CmsText
                  id="hero.description"
                  defaultText="Post once. Get qualified, vetted proposals fast. Pay online or offline, and only when the work is done. For your home, your business or your plant."
                />
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {user?.role === "CLIENT" ? (
                  <>
                    <Link
                      href="/post-job"
                      className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-cta/90"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <CmsText id="hero.btn.postJob" defaultText="Post a Job — It's Free" />
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
                      <CmsText id="hero.btn.browseServices" defaultText="Browse Services" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/post-job"
                      className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-cta/90"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <CmsText id="hero.btn.postJob" defaultText="Post a Job — It's Free" />
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <CmsText id="hero.btn.browseServices" defaultText="Browse Services" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Real Live Database Job Preview Card */}
            <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md transition hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">
                  <CmsText id="sample.badge" defaultText="Live Marketplace Job" />
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {displayJob.proposalsCount} {displayJob.proposalsCount === 1 ? "Proposal" : "Proposals"}
                </span>
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d] leading-snug">
                {capitalizeWords(displayJob.title)}
              </h2>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-brand" /> {capitalizeWords(displayJob.location)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-brand" /> {capitalizeWords(displayJob.timeline)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-brand" /> {capitalizeWords(displayJob.category)}
                </span>
              </div>
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                {displayJob.proposals.length > 0 ? (
                  displayJob.proposals.map((prop, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-xs font-bold text-brand">
                          {prop.letter}
                        </span>
                        <span className="font-medium text-slate-700">
                          {capitalizeWords(prop.proName)}
                        </span>
                      </span>
                      <span className="font-semibold text-emerald-600">
                        <CmsText id="sample.quoteStatus" defaultText="Quote Received" />
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-xs font-bold text-brand">
                        ✓
                      </span>
                      <span className="font-medium text-slate-700">
                        <CmsText id="sample.emptyPros" defaultText="Open to Verified Professionals" />
                      </span>
                    </span>
                    <span className="font-semibold text-blue-600">
                      <CmsText id="sample.receivingQuotes" defaultText="Receiving Quotes" />
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4 text-center">
                <Link
                  href="/post-job"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-hover"
                >
                  <CmsText id="sample.cta" defaultText="Post a Job Like This" /> <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. BENEFITS */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              <CmsText id="benefits.eyebrow" defaultText="Why Clients Choose Klick-Pro" />
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              <CmsText id="benefits.title" defaultText="Hire with Complete Confidence" />
            </h2>
          </div>
          <CmsBoxGroup
            groupId="benefits"
            templates={CLIENT_BENEFITS}
            gridClassName="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            renderItem={(tpl) => {
              const Icon =
                tpl.icon === "wallet"
                  ? Wallet
                  : tpl.icon === "clock"
                    ? Clock
                    : tpl.icon === "users"
                      ? Users
                      : ShieldCheck;
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

        {/* 3. WHAT YOU CAN HIRE FOR */}
        <section className="border-y border-slate-200/70 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                <CmsText id="hire.eyebrow" defaultText="What You Can Hire For" />
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
                <CmsText id="hire.title" defaultText="Whatever the Job, Whatever the Size" />
              </h2>
            </div>
            <CmsBoxGroup
              groupId="hireTypes"
              templates={CLIENT_HIRE_TYPES}
              gridClassName="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              renderItem={(tpl) => {
                const Icon =
                  tpl.icon === "building"
                    ? Building2
                    : tpl.icon === "factory"
                      ? Factory
                      : tpl.icon === "laptop"
                        ? Laptop
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
                <CmsText id="hire.link" defaultText="See All Categories" /> <ArrowRight className="h-4 w-4" />
              </Link>
            </p>
          </div>
        </section>

        {/* 4. HIRING JOURNEY */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                <CmsText id="journey.eyebrow" defaultText="Your Hiring Journey" />
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
                <CmsText id="journey.title" defaultText="From Idea to Done, All in One Place" />
              </h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                <CmsText
                  id="journey.desc"
                  defaultText="No endless phone calls or scattered messaging. Everything about your job stays organized, tracked, and protected on Klick-Pro."
                />
              </p>
              <Link
                href="/how-it-works"
                className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover"
              >
                <CmsText id="journey.link" defaultText="See How It Works" /> <ArrowRight className="h-4 w-4" />
              </Link>

              <article className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
                    <CreditCard className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#0b1f4d]">
                    <CmsText id="journey.pay.title" defaultText="Pay Your Way" />
                  </h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <CmsText
                      id="journey.pay.li1"
                      defaultText="Online with milestone escrow for bigger or remote projects"
                    />
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <CmsText
                      id="journey.pay.li2"
                      defaultText="Offline in person for on-site jobs once the work is complete"
                    />
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <CmsText
                      id="journey.pay.li3"
                      defaultText="Agreed milestone pricing with zero hidden surcharges"
                    />
                  </li>
                </ul>
              </article>
            </div>

            <CmsBoxGroup
              groupId="journeySteps"
              templates={CLIENT_JOURNEY_STEPS}
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

        {/* 5. TIPS FOR GREAT RESULTS */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              <CmsText id="tips.eyebrow" defaultText="Tips for Great Results" />
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              <CmsText id="tips.title" defaultText="Write a Job Post That Gets Great Proposals" />
            </h2>
          </div>
          <CmsBoxGroup
            groupId="tips"
            templates={CLIENT_TIPS}
            gridClassName="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            renderItem={(tpl) => {
              const Icon =
                tpl.icon === "image"
                  ? ImageIcon
                  : tpl.icon === "rupee"
                    ? IndianRupee
                    : tpl.icon === "calendar"
                      ? CalendarClock
                      : ListChecks;
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

        {/* 6. BOTTOM CTA */}
        <section className="border-t border-slate-800 bg-[#081738] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              <CmsText id="cta.eyebrow" defaultText="Post a Job Today" />
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
              <CmsText id="cta.title" defaultText="Ready to Find the Perfect Professional?" />
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              <CmsText
                id="cta.desc"
                defaultText="Tell us what you need and start reviewing verified proposals within hours."
              />
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-cta/90"
              >
                <PlusCircle className="h-4 w-4" />
                <CmsText id="cta.btn1" defaultText="Post a Job — It's Free" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                <Search className="h-4 w-4" />
                <CmsText id="cta.btn2" defaultText="Browse Services" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CmsPageProvider>
  );
}
