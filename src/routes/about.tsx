"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "@/lib/current-user";
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

export default function About({
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
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
              <Sparkles className="h-3.5 w-3.5" /> Welcome to Klick-Pro
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
              Klick to <span className="text-[#1748b5]">Konnect</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Finding the right professional for a job shouldn't be difficult. Whether you need an electrician for your home, a plumber for a repair, a technician for your business, or a skilled professional for an industrial project, you should find someone reliable, qualified, available and trustworthy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                  >
                    <Briefcase className="h-4 w-4" />
                    Find Work
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
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Console
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Briefcase className="h-4 w-4" />
                    Browse Services
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/post-job"
                    className="rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                  >
                    Post a Job
                  </Link>
                  <Link
                    href="/services"
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Browse Services
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
              <Target className="h-6 w-6 text-[#1748b5]" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">Our goal</p>
            <p className="mt-2 font-display text-2xl font-bold leading-snug tracking-tight text-[#0b1f4d]">
              Make finding, hiring, and working with the right professional easier.
            </p>
            <div className="mt-6 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Home className="h-5 w-5 text-[#1748b5]" />
                <span>Residential</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Building2 className="h-5 w-5 text-[#1748b5]" />
                <span>Commercial</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Factory className="h-5 w-5 text-[#1748b5]" />
                <span>Industrial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY WE EXIST */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1748b5]">Why we exist</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              The gap was everywhere.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              Klick-Pro was created to bring two worlds together: customers who need work done, and professionals who are ready to do it.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-3">
            <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                <Search className="h-6 w-6 text-[#1748b5]" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">For customers</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Finding a skilled professional often depended on personal networks, referrals, phone calls and fragmented online searches, which takes time and effort.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                <Wrench className="h-6 w-6 text-[#1748b5]" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">For professionals</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Tradespeople, technicians, contractors and specialists have the skills, but finding consistent opportunities and reaching new customers was not always easy.
              </p>
            </article>
            <div className="rounded-2xl bg-[#1748b5] p-7 text-white sm:col-span-2">
              <p className="font-display text-xl font-bold">This wasn't just a local problem. It was a global opportunity.</p>
              <p className="mt-2 text-sm leading-6 text-blue-100">
                Wherever there is a customer who needs a service, there is a professional who can provide it. Klick-Pro exists to make that connection easier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GLOBAL VISION */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
            <Globe className="h-6 w-6 text-[#1748b5]" />
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
            A simple idea with a global vision
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
            What started as an observation from years of professional experience is now being developed into a technology platform designed to make service connections simpler, more transparent and more trustworthy &mdash; across communities, cities, and eventually around the world.
          </p>
        </div>
      </section>

      {/* 4. MORE THAN A MARKETPLACE */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1748b5]">One platform</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
            More than just a marketplace
          </h2>
          <p className="mt-3 text-slate-500">
            Klick-Pro brings the entire service experience together, replacing fragmented processes with one simple, organized digital experience that benefits both sides.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Customers can</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                <span>Discover professionals by service requirement and location</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                <span>Explore professional profiles</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                <span>Communicate about their projects and receive quotes</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                <span>Manage jobs and make payments</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                <span>Provide reviews</span>
              </li>
            </ul>
            <Link
              href="/for-clients"
              className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[#1748b5] hover:text-[#133b94]"
            >
              For clients <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-[#0b1f4d]">Professionals can</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                <span>Create profiles and showcase their skills and experience</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                <span>Connect with customers</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                <span>Receive new opportunities</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                <span>Manage their work</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1748b5]" />
                <span>Build their reputation</span>
              </li>
            </ul>
            <Link
              href="/for-professionals"
              className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[#1748b5] hover:text-[#133b94]"
            >
              For professionals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. BUILT ON TRUST */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1748b5]">Our foundation</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              Built on trust
            </h2>
            <p className="mt-3 text-slate-500">
              Trust is the foundation of every successful service relationship.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md lg:col-span-2">
              <BadgeCheck className="h-7 w-7 text-[#1748b5]" />
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Verification</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Helping customers find credible professionals.</p>
            </article>
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md lg:col-span-2">
              <Eye className="h-7 w-7 text-[#1748b5]" />
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Transparency</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Making communication, pricing and job expectations clearer.</p>
            </article>
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md lg:col-span-2">
              <Layers className="h-7 w-7 text-[#1748b5]" />
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Convenience</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Bringing discovery, communication, job management and payments together.</p>
            </article>
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md lg:col-span-3">
              <ShieldCheck className="h-7 w-7 text-[#1748b5]" />
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Security</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Creating a structured transaction experience.</p>
            </article>
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md lg:col-span-3">
              <Scale className="h-7 w-7 text-[#1748b5]" />
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Accountability</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Using ratings, reviews and a structured dispute process.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 6. EMPOWERING PROFESSIONALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1748b5]">For the people behind the work</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
            Empowering skilled professionals
          </h2>
          <p className="mt-3 text-slate-500">
            From independent tradespeople and technicians to contractors and specialized industrial professionals, Klick-Pro gives service providers an opportunity to grow.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-sm">
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-sm font-bold text-[#1748b5]">1</span>
            <p className="mt-3 font-display text-sm font-bold text-[#0b1f4d]">Create a Profile</p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-sm">
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-sm font-bold text-[#1748b5]">2</span>
            <p className="mt-3 font-display text-sm font-bold text-[#0b1f4d]">Showcase Skills</p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-sm">
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-sm font-bold text-[#1748b5]">3</span>
            <p className="mt-3 font-display text-sm font-bold text-[#0b1f4d]">Connect</p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-sm">
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-sm font-bold text-[#1748b5]">4</span>
            <p className="mt-3 font-display text-sm font-bold text-[#0b1f4d]">Win Jobs</p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-sm">
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-sm font-bold text-[#1748b5]">5</span>
            <p className="mt-3 font-display text-sm font-bold text-[#0b1f4d]">Get Paid</p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-sm">
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-sm font-bold text-[#1748b5]">6</span>
            <p className="mt-3 font-display text-sm font-bold text-[#0b1f4d]">Build Reputation</p>
          </div>
          <div className="rounded-2xl border border-[#1748b5] bg-[#1748b5] p-5 text-center shadow-sm">
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/15 text-sm font-bold text-white">7</span>
            <p className="mt-3 font-display text-sm font-bold text-white">Grow</p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-base text-slate-500">
          Our goal is to help professionals spend less time searching for their next customer and more time doing what they do best.
        </p>
      </section>

      {/* 7. SECTORS */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1748b5]">What we cover</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              From local services to global possibilities
            </h2>
            <p className="mt-3 text-slate-500">
              Klick-Pro is designed to support a wide range of service requirements, across six major sectors.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                <Home className="h-6 w-6 text-[#1748b5]" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Residential</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Electrical, plumbing, HVAC, cleaning, painting, carpentry, appliance repair, security and more.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                <Building2 className="h-6 w-6 text-[#1748b5]" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Commercial</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Office maintenance, facility services, electrical, HVAC, cleaning, security and other business services.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                <Factory className="h-6 w-6 text-[#1748b5]" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Industrial</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Industrial electrical, automation, maintenance, fabrication, machinery services, technicians and specialized industrial requirements.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                <HeartPulse className="h-6 w-6 text-[#1748b5]" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Health Care</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Nurses, caregivers, physiotherapists, therapists, medical technicians and wellness support.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                <Sparkles className="h-6 w-6 text-[#1748b5]" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Personal Care &amp; Home Services</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Salon and grooming, spa and massage, beauty, fitness trainers, laundry and home help.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 transition hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50">
                <GraduationCap className="h-6 w-6 text-[#1748b5]" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-[#0b1f4d]">Education</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Tutors, coaches, language teachers, test prep, skill training and online courses.
              </p>
            </article>
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-slate-500">
            Our ambition is not limited to one city or one country. The need for trusted professionals and better service connections exists everywhere, and Klick-Pro is being built with that global opportunity in mind.
          </p>
        </div>
      </section>

      {/* 8. OUR BELIEF */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#081738] px-6 py-14 text-center sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Our belief</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Technology should make people's lives simpler &mdash; not more complicated.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            We believe the right professional should be easier to find, skilled professionals should have better opportunities, and every service transaction should be built around trust, transparency and accountability. That's why we're building Klick-Pro.
          </p>
          <p className="mt-8 font-display text-xl font-bold text-white">One platform. Thousands of possibilities.</p>
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
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Client Dashboard
                </Link>
              </>
            ) : user?.role === "PROFESSIONAL" ? (
              <>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                >
                  <Briefcase className="h-4 w-4" />
                  Browse Available Jobs
                </Link>
                <Link
                  href="/professional/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Pro Dashboard
                </Link>
              </>
            ) : user?.role === "ADMIN" ? (
              <>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Console
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <Briefcase className="h-4 w-4" />
                  Browse Marketplace
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/post-job"
                  className="rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
                >
                  Post a Job
                </Link>
                <Link
                  href="/for-professionals"
                  className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Join as a Professional
                </Link>
              </>
            )}
          </div>
          <p className="mt-10 text-sm font-semibold text-slate-400">Klick-Pro &middot; Klick to Konnect</p>
        </div>
      </section>
    </div>
  );
}
