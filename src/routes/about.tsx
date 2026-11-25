"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "@/lib/current-user";
import type { CmsContent } from "@/lib/cms-file";
import { CmsBoxGroup, CmsPageProvider, CmsText, type PageTextsMap } from "@/components/cms/CmsText";
import {
  Sparkles,
  Target,
  Home,
  Building2,
  Factory,
  Search,
  Wrench,
  Globe,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Eye,
  Layers,
  ShieldCheck,
  Scale,
  HeartPulse,
  GraduationCap,
  LayoutDashboard,
  Briefcase,
  PlusCircle,
} from "lucide-react";

const ABOUT_WHY_CARDS = [
  {
    kind: "card" as const,
    icon: "search" as const,
    legacyPrefix: "why.card1",
    defaults: {
      title: "For customers",
      desc: "Finding a skilled professional often depended on personal networks, referrals, phone calls and fragmented online searches, which takes time and effort.",
    },
  },
  {
    kind: "card" as const,
    icon: "wrench" as const,
    legacyPrefix: "why.card2",
    defaults: {
      title: "For professionals",
      desc: "Tradespeople, technicians, contractors and specialists have the skills, but finding consistent opportunities and reaching new customers was not always easy.",
    },
  },
  {
    kind: "banner" as const,
    spanClassName: "sm:col-span-2",
    legacyPrefix: "why.banner",
    defaults: {
      title: "This wasn't just a local problem. It was a global opportunity.",
      desc: "Wherever there is a customer who needs a service, there is a professional who can provide it. Klick-Pro exists to make that connection easier.",
    },
  },
];

const ABOUT_PLATFORM_CARDS = [
  {
    legacyPrefix: "platform.cust",
    href: "/for-clients",
    defaults: {
      title: "Customers can",
      li1: "Discover professionals by service requirement and location",
      li2: "Explore professional profiles",
      li3: "Communicate about their projects and receive quotes",
      li4: "Manage jobs and make payments",
      li5: "Provide reviews",
      link: "For clients",
    },
  },
  {
    legacyPrefix: "platform.pro",
    href: "/for-professionals",
    defaults: {
      title: "Professionals can",
      li1: "Create profiles and showcase their skills and experience",
      li2: "Connect with customers",
      li3: "Receive new opportunities",
      li4: "Manage their work",
      li5: "Build their reputation",
      link: "For professionals",
    },
  },
];

const ABOUT_TRUST_CARDS = [
  {
    legacyPrefix: "trust.c1",
    icon: "badge" as const,
    spanClassName: "lg:col-span-2",
    defaults: {
      title: "Verification",
      desc: "Helping customers find credible professionals.",
    },
  },
  {
    legacyPrefix: "trust.c2",
    icon: "eye" as const,
    spanClassName: "lg:col-span-2",
    defaults: {
      title: "Transparency",
      desc: "Making communication, pricing and job expectations clearer.",
    },
  },
  {
    legacyPrefix: "trust.c3",
    icon: "layers" as const,
    spanClassName: "lg:col-span-2",
    defaults: {
      title: "Convenience",
      desc: "Bringing discovery, communication, job management and payments together.",
    },
  },
  {
    legacyPrefix: "trust.c4",
    icon: "shield" as const,
    spanClassName: "lg:col-span-3",
    defaults: {
      title: "Security",
      desc: "Creating a structured transaction experience.",
    },
  },
  {
    legacyPrefix: "trust.c5",
    icon: "scale" as const,
    spanClassName: "lg:col-span-3",
    defaults: {
      title: "Accountability",
      desc: "Using ratings, reviews and a structured dispute process.",
    },
  },
];

const ABOUT_EMP_STEPS = [
  { title: "Create a Profile" },
  { title: "Showcase Skills" },
  { title: "Connect" },
  { title: "Win Jobs" },
  { title: "Get Paid" },
  { title: "Build Reputation" },
  { title: "Grow", highlight: true },
].map((s, i) => ({
  ...s,
  legacyPrefix: `emp.s${i + 1}`,
  defaults: { title: s.title },
}));

const ABOUT_SECTORS = [
  {
    legacyPrefix: "sectors.s1",
    icon: "home" as const,
    defaults: {
      title: "Residential",
      desc: "Electrical, plumbing, HVAC, cleaning, painting, carpentry, appliance repair, security and more.",
    },
  },
  {
    legacyPrefix: "sectors.s2",
    icon: "building" as const,
    defaults: {
      title: "Commercial",
      desc: "Office maintenance, facility services, electrical, HVAC, cleaning, security and other business services.",
    },
  },
  {
    legacyPrefix: "sectors.s3",
    icon: "factory" as const,
    defaults: {
      title: "Industrial",
      desc: "Industrial electrical, automation, maintenance, fabrication, machinery services, technicians and specialized industrial requirements.",
    },
  },
  {
    legacyPrefix: "sectors.s4",
    icon: "heart" as const,
    defaults: {
      title: "Health Care",
      desc: "Nurses, caregivers, physiotherapists, therapists, medical technicians and wellness support.",
    },
  },
  {
    legacyPrefix: "sectors.s5",
    icon: "sparkles" as const,
    defaults: {
      title: "Personal Care & Home Services",
      desc: "Salon and grooming, spa and massage, beauty, fitness trainers, laundry and home help.",
    },
  },
  {
    legacyPrefix: "sectors.s6",
    icon: "graduation" as const,
    defaults: {
      title: "Education",
      desc: "Tutors, coaches, language teachers, test prep, skill training and online courses.",
    },
  },
];

export default function About({
  cmsMode = false,
  cmsContent,
  pageTexts,
  onTextChange,
}: {
  cmsMode?: boolean;
  cmsContent?: CmsContent;
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
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
                <Sparkles className="h-3.5 w-3.5" />{" "}
                <CmsText id="hero.label" defaultText={cmsContent?.hero?.label || "Welcome to Klick-Pro"} />
              </p>
              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
                {cmsMode || pageTexts?.["hero.title"] || cmsContent?.hero?.title ? (
                  <CmsText
                    id="hero.title"
                    defaultText={cmsContent?.hero?.title || "Klick to Konnect."}
                  />
                ) : (
                  <>
                    Klick to <span className="text-[#1748b5]">Konnect</span>.
                  </>
                )}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
                <CmsText
                  id="hero.description"
                  defaultText={
                    cmsContent?.hero?.description ||
                    "Finding the right professional for a job shouldn't be difficult. Whether you need an electrician for your home, a plumber for a repair, a technician for your business, or a skilled professional for an industrial project, you should find someone reliable, qualified, available and trustworthy."
                  }
                />
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
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
                      className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                    >
                      <Briefcase className="h-4 w-4" />
                      <CmsText id="hero.btn.findWork" defaultText="Find Work" />
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
                      className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <CmsText id="hero.btn.adminConsole" defaultText="Admin Console" />
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Briefcase className="h-4 w-4" />
                      <CmsText id="hero.btn.browseServices" defaultText="Browse Services" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/post-job"
                      className="rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                    >
                      <CmsText id="hero.btn.postJob" defaultText="Post a Job" />
                    </Link>
                    <Link
                      href="/services"
                      className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <CmsText id="hero.btn.browseServices" defaultText="Browse Services" />
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                <Target className="h-6 w-6 text-[#1748b5]" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
                <CmsText id="goal.eyebrow" defaultText="Our goal" />
              </p>
              <p className="mt-2 font-display text-2xl font-bold leading-snug tracking-tight text-[#0b1f4d]">
                <CmsText
                  id="goal.title"
                  defaultText="Make finding, hiring, and working with the right professional easier."
                />
              </p>
              <div className="mt-6 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Home className="h-5 w-5 text-[#1748b5]" />
                  <CmsText id="goal.sector1" defaultText="Residential" />
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Building2 className="h-5 w-5 text-[#1748b5]" />
                  <CmsText id="goal.sector2" defaultText="Commercial" />
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Factory className="h-5 w-5 text-[#1748b5]" />
                  <CmsText id="goal.sector3" defaultText="Industrial" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. WHY WE EXIST */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
                <CmsText id="why.eyebrow" defaultText="Why we exist" />
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
                <CmsText id="why.title" defaultText="The gap was everywhere." />
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-500">
                <CmsText
                  id="why.description"
                  defaultText="Klick-Pro was created to bring two worlds together: customers who need work done, and professionals who are ready to do it."
                />
              </p>
            </div>
            <CmsBoxGroup
              groupId="whyCards"
              templates={ABOUT_WHY_CARDS}
              gridClassName="grid gap-6 sm:grid-cols-2 lg:col-span-3"
              renderItem={(tpl) => {
                if (tpl.kind === "banner") {
                  return (
                    <div className="rounded-2xl bg-[#1748b5] p-7 text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                      <p className="font-display text-xl font-bold">
                        <CmsText id="title" defaultText={tpl.defaults.title} />
                      </p>
                      <p className="mt-2 text-sm leading-6 text-blue-100">
                        <CmsText id="desc" defaultText={tpl.defaults.desc} />
                      </p>
                    </div>
                  );
                }
                const Icon = tpl.icon === "wrench" ? Wrench : Search;
                return (
                  <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                      <Icon className="h-6 w-6 text-[#1748b5]" />
                    </span>
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

        {/* 3. GLOBAL VISION */}
        <section className="border-y border-slate-200/70 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
              <Globe className="h-6 w-6 text-[#1748b5]" />
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              <CmsText id="vision.title" defaultText="A simple idea with a global vision" />
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
              <CmsText
                id="vision.desc"
                defaultText="What started as an observation from years of professional experience is now being developed into a technology platform designed to make service connections simpler, more transparent and more trustworthy — across communities, cities, and eventually around the world."
              />
            </p>
          </div>
        </section>

        {/* 4. MORE THAN A MARKETPLACE */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
              <CmsText id="platform.eyebrow" defaultText="One platform" />
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              <CmsText id="platform.title" defaultText="More than just a marketplace" />
            </h2>
            <p className="mt-3 text-slate-500">
              <CmsText
                id="platform.desc"
                defaultText="Klick-Pro brings the entire service experience together, replacing fragmented processes with one simple, organized digital experience that benefits both sides."
              />
            </p>
          </div>
          <CmsBoxGroup
            groupId="platformCards"
            templates={ABOUT_PLATFORM_CARDS}
            gridClassName="mt-12 grid gap-6 md:grid-cols-2"
            renderItem={(tpl) => (
              <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <h3 className="font-display text-lg font-bold text-[#0b1f4d]">
                  <CmsText id="title" defaultText={tpl.defaults.title} />
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                    <CmsText id="li1" defaultText={tpl.defaults.li1} />
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                    <CmsText id="li2" defaultText={tpl.defaults.li2} />
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                    <CmsText id="li3" defaultText={tpl.defaults.li3} />
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                    <CmsText id="li4" defaultText={tpl.defaults.li4} />
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                    <CmsText id="li5" defaultText={tpl.defaults.li5} />
                  </li>
                </ul>
                <Link
                  href={tpl.href}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[#1748b5] hover:text-[#133b94]"
                >
                  <CmsText id="link" defaultText={tpl.defaults.link} />{" "}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          />
        </section>

        {/* 5. BUILT ON TRUST */}
        <section id="trust" className="border-y border-slate-200/70 bg-white scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
                <CmsText id="trust.eyebrow" defaultText="Our foundation" />
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
                <CmsText id="trust.title" defaultText="Built on trust" />
              </h2>
              <p className="mt-3 text-slate-500">
                <CmsText
                  id="trust.desc"
                  defaultText="Trust is the foundation of every successful service relationship."
                />
              </p>
            </div>
            <CmsBoxGroup
              groupId="trustCards"
              templates={ABOUT_TRUST_CARDS}
              gridClassName="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6"
              renderItem={(tpl) => {
                const Icon =
                  tpl.icon === "eye"
                    ? Eye
                    : tpl.icon === "layers"
                      ? Layers
                      : tpl.icon === "shield"
                        ? ShieldCheck
                        : tpl.icon === "scale"
                          ? Scale
                          : BadgeCheck;
                return (
                  <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
                    <Icon className="h-7 w-7 text-[#1748b5]" />
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

        {/* 6. EMPOWERING PROFESSIONALS */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
              <CmsText id="emp.eyebrow" defaultText="For the people behind the work" />
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              <CmsText id="emp.title" defaultText="Empowering skilled professionals" />
            </h2>
            <p className="mt-3 text-slate-500">
              <CmsText
                id="emp.desc"
                defaultText="From independent tradespeople and technicians to contractors and specialized industrial professionals, Klick-Pro gives service providers an opportunity to grow."
              />
            </p>
          </div>
          <CmsBoxGroup
            groupId="empSteps"
            templates={ABOUT_EMP_STEPS}
            gridClassName="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7"
            renderItem={(tpl, { index }) => {
              const isLast = Boolean(tpl.highlight);
              return (
                <div
                  className={
                    isLast
                      ? "rounded-2xl border border-[#1748b5] bg-[#1748b5] p-5 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      : "rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  }
                >
                  <span
                    className={
                      isLast
                        ? "mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/15 text-sm font-bold text-white"
                        : "mx-auto grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-sm font-bold text-[#1748b5]"
                    }
                  >
                    {index + 1}
                  </span>
                  <p
                    className={
                      isLast
                        ? "mt-3 font-display text-sm font-bold text-white"
                        : "mt-3 font-display text-sm font-bold text-[#0b1f4d]"
                    }
                  >
                    <CmsText id="title" defaultText={tpl.title} />
                  </p>
                </div>
              );
            }}
          />
          <p className="mx-auto mt-8 max-w-2xl text-center text-base text-slate-500">
            <CmsText
              id="emp.footer"
              defaultText="Our goal is to help professionals spend less time searching for their next customer and more time doing what they do best."
            />
          </p>
        </section>

        {/* 7. SECTORS */}
        <section className="border-y border-slate-200/70 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
                <CmsText id="sectors.eyebrow" defaultText="What we cover" />
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
                <CmsText id="sectors.title" defaultText="From local services to global possibilities" />
              </h2>
              <p className="mt-3 text-slate-500">
                <CmsText
                  id="sectors.desc"
                  defaultText="Klick-Pro is designed to support a wide range of service requirements, across six major sectors."
                />
              </p>
            </div>
            <CmsBoxGroup
              groupId="sectorCards"
              templates={ABOUT_SECTORS}
              gridClassName="mt-12 grid gap-6 md:grid-cols-3"
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
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                      <Icon className="h-6 w-6 text-[#1748b5]" />
                    </span>
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
            <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-slate-500">
              <CmsText
                id="sectors.footer"
                defaultText="Our ambition is not limited to one city or one country. The need for trusted professionals and better service connections exists everywhere, and Klick-Pro is being built with that global opportunity in mind."
              />
            </p>
          </div>
        </section>

        {/* 8. OUR BELIEF */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#081738] px-6 py-14 text-center sm:px-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              <CmsText id="belief.eyebrow" defaultText="Our belief" />
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              <CmsText
                id="belief.title"
                defaultText="Technology should make people's lives simpler — not more complicated."
              />
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
              <CmsText
                id="belief.desc"
                defaultText="We believe the right professional should be easier to find, skilled professionals should have better opportunities, and every service transaction should be built around trust, transparency and accountability. That's why we're building Klick-Pro."
              />
            </p>
            <p className="mt-8 font-display text-xl font-bold text-white">
              <CmsText id="belief.subline" defaultText="One platform. Thousands of possibilities." />
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {user?.role === "CLIENT" ? (
                <>
                  <Link
                    href="/post-job"
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <CmsText id="belief.btn.postJob" defaultText="Post a Job" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <CmsText id="belief.btn.clientDash" defaultText="Client Dashboard" />
                  </Link>
                </>
              ) : user?.role === "PROFESSIONAL" ? (
                <>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                  >
                    <Briefcase className="h-4 w-4" />
                    <CmsText id="belief.btn.browseJobs" defaultText="Browse Available Jobs" />
                  </Link>
                  <Link
                    href="/professional/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <CmsText id="belief.btn.proDash" defaultText="Professional Dashboard" />
                  </Link>
                </>
              ) : user?.role === "ADMIN" ? (
                <>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <CmsText id="belief.btn.admin" defaultText="Admin Console" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    <Briefcase className="h-4 w-4" />
                    <CmsText id="belief.btn.marketplace" defaultText="Browse Marketplace" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/post-job"
                    className="rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                  >
                    <CmsText id="belief.btn.postJob" defaultText="Post a Job" />
                  </Link>
                  <Link
                    href="/for-professionals"
                    className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    <CmsText id="belief.btn.joinPro" defaultText="Join as a Professional" />
                  </Link>
                </>
              )}
            </div>
            <p className="mt-10 text-sm font-semibold text-slate-400">
              <CmsText id="belief.tagline" defaultText="Klick-Pro · Klick to Konnect" />
            </p>
          </div>
        </section>
      </div>
    </CmsPageProvider>
  );
}
