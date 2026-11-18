"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "@/lib/current-user";
import { capitalizeFirst, capitalizeWords } from "@/lib/utils";
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
}: {
  cmsMode?: boolean;
  sampleJob?: SampleJobData | null;
} = {}) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (cmsMode) return;
    void fetchCurrentUser()
      .then((res) => setUser(res.user ?? null))
      .catch(() => setUser(null));
  }, [cmsMode]);

  // Use real DB job if available, else clean fallback
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
    <div className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-[#1748b5]">
      {/* 1. HERO */}
      <section className="gradient-hero border-b border-slate-200/60">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
              <Sparkles className="h-3.5 w-3.5" /> For Clients
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
              Hire Trusted Pros &mdash; Without the Back-and-Forth
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Post once. Get qualified, vetted proposals fast. Pay online or offline, and only when the work is done. For your home, your business or your plant.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user?.role === "CLIENT" ? (
                <>
                  <Link
                    href="/post-job"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1748b5] px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition hover:bg-[#133b94]"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Post a Job &mdash; It&apos;s Free
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
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1748b5] px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition hover:bg-[#133b94]"
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
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1748b5] px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition hover:bg-[#133b94]"
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
                    href="/post-job"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1748b5] px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition hover:bg-[#133b94]"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Post a Job &mdash; It&apos;s Free
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Browse Services
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Real Live Database Job Preview Card */}
          <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">
                Live Marketplace Job
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
                    <span className="font-semibold text-emerald-600">Quote Received</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-xs font-bold text-brand">
                      ✓
                    </span>
                    <span className="font-medium text-slate-700">Open to Verified Pros</span>
                  </span>
                  <span className="font-semibold text-blue-600">Receiving Quotes</span>
                </div>
              )}
            </div>
            <div className="mt-5 border-t border-slate-100 pt-4 text-center">
              <Link
                href="/post-job"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-hover"
              >
                Post a Job Like This <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Why Clients Choose Klick-Pro
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
            Hire with Complete Confidence
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Vetted Professionals</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Every pro is ID-verified. Background checks and trade certifications for in-home and industrial services.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Escrow Payments</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your money is safe. Online funds are held securely and released only when you approve each milestone.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Fast Matches</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Get competitive proposals from available nearby or remote professionals in under 2 hours on average.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Dedicated Support</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Real human support whenever you need assistance with requirements, negotiations, or milestone releases.
            </p>
          </article>
        </div>
      </section>

      {/* 3. WHAT YOU CAN HIRE FOR */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              What You Can Hire For
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              Whatever the Job, Whatever the Size
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">At Home</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Electrical, plumbing, cleaning, painting, appliance repair, home renovation and tutors.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">For Your Business</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Office interiors, facility upkeep, digital marketing, bookkeeping, IT support and events.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Factory className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">For Your Plant</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Machinery maintenance, industrial fabrication, heavy electrical, safety auditing and logistics.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:bg-white hover:shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Online &amp; Remote</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Web development, UI/UX design, mobile apps, software architecture and expert consulting.
              </p>
            </article>
          </div>
          <p className="mt-8 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover"
            >
              See All Categories <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </section>

      {/* 4. HIRING JOURNEY */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              Your Hiring Journey
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              From Idea to Done, All in One Place
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              No endless phone calls or scattered messaging. Everything about your job stays organized, tracked, and protected on Klick-Pro.
            </p>
            <Link
              href="/how-it-works"
              className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover"
            >
              See How It Works <ArrowRight className="h-4 w-4" />
            </Link>

            <article className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
                  <CreditCard className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Pay Your Way</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span>Online with milestone escrow for bigger or remote projects</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span>Offline in person for on-site jobs once the work is complete</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span>Agreed milestone pricing with zero hidden surcharges</span>
                </li>
              </ul>
            </article>
          </div>

          <ol className="space-y-4 lg:col-span-3">
            <li className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                1
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Post Your Job</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Describe the work, location, budget and timeline. Add photos or files to help pros submit accurate estimates.
                </p>
              </div>
            </li>

            <li className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                2
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Compare Proposals</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Review itemized quotes, ratings, client reviews and portfolios, and chat with your shortlist before deciding.
                </p>
              </div>
            </li>

            <li className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                3
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Hire &amp; Track Progress</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Agree on milestones, follow live task updates, and keep all communication and work files in one unified workspace.
                </p>
              </div>
            </li>

            <li className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                4
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Pay &amp; Review</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Release payment once satisfied with deliverables, then leave an honest review to empower the community.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 5. TIPS FOR GREAT RESULTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Tips for Great Results
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
            Write a Job Post That Gets Great Proposals
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
              <ListChecks className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Be Specific</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              State clearly what needs to be done, requirements, and what completion looks like.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Add Photos</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Pictures, sketches and measurements help professionals provide exact quotes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
              <IndianRupee className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Share a Realistic Budget</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              A transparent budget range attracts serious, high-caliber proposals quickly.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
              <CalendarClock className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Set a Timeline</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Indicate whether you need immediate assistance or are scheduling for next week.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="border-t border-slate-800 bg-[#081738] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Post a Job Today
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Find the Perfect Professional?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
            Tell us what you need and start reviewing verified proposals within hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/post-job"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1748b5] px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition hover:bg-[#133b94]"
            >
              <PlusCircle className="h-4 w-4" />
              Post a Job &mdash; It&apos;s Free
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              <Search className="h-4 w-4" />
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
