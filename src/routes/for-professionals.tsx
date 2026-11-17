"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "@/lib/current-user";
import { capitalizeWords } from "@/lib/utils";
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
}: {
  cmsMode?: boolean;
  samplePro?: SampleProData | null;
} = {}) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (cmsMode) return;
    void fetchCurrentUser()
      .then((res) => setUser(res.user ?? null))
      .catch(() => setUser(null));
  }, [cmsMode]);

  // Real DB pro fallback
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
    <div className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-[#1748b5]">
      {/* 1. HERO */}
      <section className="gradient-hero border-b border-slate-200/60">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
              <Sparkles className="h-3.5 w-3.5" /> For Professionals
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
              Find Quality Jobs. Get Paid. Grow Your Business.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Electrician, welder, designer, or consultant: no more chasing leads or waiting indefinitely on payments. Klick-Pro brings verified nearby and remote projects straight to you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user?.role === "PROFESSIONAL" ? (
                <>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
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
              ) : user?.role === "CLIENT" ? (
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
                    Browse Services
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signup?role=pro"
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                  >
                    <UserPlus className="h-4 w-4" />
                    Become a Professional
                  </Link>
                  <Link
                    href="/how-it-works#pros"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    How It Works
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Real Live Database Professional Showcase Card */}
          <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">
                Featured Verified Pro
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <BadgeCheck className="h-4 w-4" /> {displayPro.isVerified ? "Verified Pro" : "Registered Pro"}
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
              <span className="font-semibold text-emerald-600">Open to New Jobs</span>
            </div>
            <div className="mt-5 border-t border-slate-100 pt-4 text-center">
              <Link
                href="/signup?role=pro"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-hover"
              >
                Create Your Profile Today <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Why Professionals Join
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
            Built to Help You Earn More
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Grow Your Business</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Direct matchmaking connects your specific skills with motivated, verified clients in your sector.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Verified Credibility</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Government ID verification and background verification badges boost client confidence and conversion.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Nearby &amp; Remote</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Filter available jobs by distance, district, budget and urgency to bid on work that fits your schedule.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">100% Full Payout</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Receive 100% full payout on approved milestones with zero hidden commission deductions.
            </p>
          </article>
        </div>
      </section>

      {/* 3. WHO CAN JOIN (6 SECTORS) */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              Who Can Join
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              Every Skill Has a Place on Klick-Pro
            </h2>
            <p className="mt-3 text-slate-500">
              Whether you are an independent craftsman or run a full enterprise team, list your service capabilities.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Residential</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Electricians, plumbers, painters, carpenters, cleaners, appliance technicians, and home repair experts.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Commercial</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Interior designers, facility crews, network cabling technicians, accountants, security and event crews.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Factory className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Industrial</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Precision welders, fabricators, heavy machinery technicians, PLC programmers and safety auditors.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Health Care</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Nurses, home caregivers, certified physiotherapists, medical equipment technicians and wellness therapists.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Personal Care &amp; Home Services</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Stylists, beauticians, spa &amp; massage therapists, fitness coaches, domestic help and culinary services.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Education</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Academic tutors, language instructors, specialized vocational trainers, and exam preparation coaches.
              </p>
            </article>
          </div>
          <p className="mt-8 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover"
            >
              View All Service Categories <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </section>

      {/* 4. GETTING STARTED */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              Start Earning
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              Up and Running in Four Steps
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Joining is seamless. Set up your profile once and start bidding on high-quality projects.
            </p>
            <Link
              href="/signup?role=pro"
              className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover"
            >
              Open Your Pro Account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ol className="space-y-4 lg:col-span-3">
            <li className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                1
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Create Your Profile</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Add your skills, hourly or fixed rates, geographic coverage area, and portfolio photos of previous work.
                </p>
              </div>
            </li>

            <li className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                2
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Get Verified</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Upload your identity and professional certifications to earn the trusted verified pro badge clients look for.
                </p>
              </div>
            </li>

            <li className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                3
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Send Proposals</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Browse open job listings in your domain, submit custom proposals with clear milestone structures, and chat directly.
                </p>
              </div>
            </li>

            <li className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                4
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Deliver &amp; Get Paid</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Finish each milestone, receive automatic escrow disbursements, and build reviews that unlock larger contracts.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 5. TOOLS + PAYMENTS */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8">
          <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-8">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Briefcase className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-[#0b1f4d]">Tools to Run Your Business</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>A professional public storefront displaying verified credentials and ratings</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Instant notifications for new job postings matching your categories</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Integrated real-time chat, contract milestones, and file uploads</span>
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-8">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Banknote className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-[#0b1f4d]">Get Paid, Your Way</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Online payments protected securely by milestone escrow</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Direct offline payments for local on-site visits agreed up front</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>100% full payout with zero hidden fees or unexpected commission deductions</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* 6. TIPS TO WIN WORK */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Win More Work
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
            What Top Professionals Do Differently
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Complete Profile</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Profiles with photo portfolios and verified ID receive up to 4x more proposal responses.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Respond Fast</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Replying within the first hour greatly improves your chances of securing the contract.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Itemize Proposals</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Provide clear milestones and timeline estimates so clients understand the full scope.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
              <Star className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Earn 5-Star Reviews</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Deliver quality results on time to build a strong reputation that wins repeated business.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="border-t border-slate-800 bg-[#081738] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Join the Network
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Take Your Business to the Next Level?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
            Sign up in minutes, verify your credentials, and start receiving job notifications today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup?role=pro"
              className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
            >
              <UserPlus className="h-4 w-4" />
              Join as a Professional
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              <Search className="h-4 w-4" />
              Browse Current Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
