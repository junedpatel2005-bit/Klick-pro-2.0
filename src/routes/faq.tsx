"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Sparkles,
  Search,
  ChevronDown,
  Headset,
  Route,
  LayoutGrid,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  cat: string;
  items: FAQItem[];
};

const FAQ_DATA: FAQCategory[] = [
  {
    cat: "General",
    items: [
      {
        question: "What is Klick-Pro?",
        answer:
          "Klick-Pro is an enterprise hybrid marketplace connecting clients with vetted professionals for local on-site services (such as plumbing, electrical, maintenance) and remote digital projects (software development, design, marketing).",
      },
      {
        question: "What kinds of services can I find?",
        answer:
          "We support six major sectors: Residential (home repairs, cleaning, renovation, appliances), Commercial (office fit-outs, facility services, marketing, accounting), Industrial (machinery maintenance, fabrication, industrial electrical, safety), Health Care (caregivers, nursing, physiotherapy), Personal Care & Home Services (wellness, styling, fitness), and Education (tutors, coaches, trainers).",
      },
      {
        question: "Is Klick-Pro only for IT and online work?",
        answer:
          "No. Klick-Pro covers on-site trades and industrial services as well as remote digital work. You can hire qualified experts to visit your home, shop, or factory, or collaborate with remote specialists online.",
      },
      {
        question: "How do I create an account?",
        answer:
          "Sign up with your contact details, choose whether you want to hire or offer services, and complete your profile. You can hire and offer services seamlessly using the same account.",
      },
    ],
  },
  {
    cat: "For Clients",
    items: [
      {
        question: "How do I post a job?",
        answer:
          "Describe the work, location, budget and timeline, attach photos or sketches if helpful, and submit. Matching professionals in your category and area will review and send you competitive proposals.",
      },
      {
        question: "How do I choose the right professional?",
        answer:
          "Compare itemized quotes, customer ratings, reviews, verified badges, and portfolios. You can also chat directly with your shortlisted candidates before making a hiring decision.",
      },
      {
        question: "Can I hire someone for a small, one-time job?",
        answer:
          "Absolutely. Jobs can be a quick service call, a one-day task, or a multi-month commercial contract. Simply post what you need and agree on scope and milestones up front.",
      },
      {
        question: "Can I hire a professional for both on-site and remote work?",
        answer:
          "Yes. When creating your job posting, choose On-Site, Remote, or Either, and professionals will tailor their proposals accordingly.",
      },
      {
        question: "What if I need to cancel or change the scope?",
        answer:
          "Discuss adjustments with your professional in the project chat and adjust the agreed milestones together. If you cannot reach an agreement, our support and dispute resolution team is here to assist.",
      },
    ],
  },
  {
    cat: "For Professionals",
    items: [
      {
        question: "How do I join as a professional?",
        answer:
          "Create a profile with your services, rates, service area, and previous work portfolio, then submit your identity verification. Once approved, you can browse open jobs and submit custom proposals immediately.",
      },
      {
        question: "Do I need to be an incorporated company to join?",
        answer:
          "No. Independent tradespeople, individual freelancers, small teams, and registered enterprise businesses are all welcome on Klick-Pro.",
      },
      {
        question: "How do I get more jobs?",
        answer:
          "Keep your profile complete with photos of past work, respond promptly to inquiries, provide itemized proposals, and deliver great service to accumulate 5-star ratings.",
      },
      {
        question: "Can I offer services in more than one category?",
        answer:
          "Yes. You can select all service categories you are qualified for, such as both residential electrical maintenance and commercial lighting installations.",
      },
      {
        question: "When and how do I get paid?",
        answer:
          "For online contracts, funds are deposited into secure milestone escrow and released directly to your wallet upon client approval with 100% full payout. For offline jobs, you collect payment directly upon completion as agreed.",
      },
    ],
  },
  {
    cat: "Payments",
    items: [
      {
        question: "How does milestone escrow protect my payment?",
        answer:
          "Funds are deposited into neutral escrow before work starts. The professional knows payment is guaranteed, while the client knows money is released only after deliverables are inspected and approved.",
      },
      {
        question: "Is it free to post jobs and join as a pro?",
        answer:
          "Yes! Posting jobs for clients is 100% free with zero recurring subscription charges. Professionals can also register and submit proposals for free.",
      },
      {
        question: "Can I pay offline or in cash?",
        answer:
          "Yes. For on-site and local trade services, you can agree to pay in person upon job completion. Make sure to agree on the exact price in the proposal up front.",
      },
      {
        question: "Which online payment methods are accepted?",
        answer:
          "You can fund escrow using UPI, major debit/credit cards, and net banking through our secure checkout gateway.",
      },
      {
        question: "What if there is a payment or milestone dispute?",
        answer:
          "Contact our dedicated support team with your job and milestone ID. We inspect project evidence and logs to ensure fair resolution.",
      },
    ],
  },
];

const CATEGORIES = ["All", "General", "For Clients", "For Professionals", "Payments"];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter(
      (group) => activeCategory === "All" || group.cat === activeCategory,
    )
      .map((group) => {
        const filteredItems = group.items.filter(
          (item) =>
            !q ||
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q),
        );
        return { ...group, items: filteredItems };
      })
      .filter((group) => group.items.length > 0);
  }, [activeCategory, searchQuery]);

  const totalResults = filteredCategories.reduce(
    (acc, group) => acc + group.items.length,
    0,
  );

  return (
    <div className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-[#1748b5]">
      {/* 1. HERO */}
      <section className="gradient-hero border-b border-slate-200/60">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
            <HelpCircle className="h-3.5 w-3.5" /> Help Center
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Quick answers about hiring, working, payments and staying safe on Klick-Pro. Cannot find what you need? Our team is always one click away.
          </p>
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, e.g. escrow, cash, verification, milestone..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TABS & FAQ ACCORDIONS */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === cat
                  ? "border-brand bg-brand text-white shadow-sm"
                  : "border-slate-300 bg-white text-slate-600 hover:border-brand hover:text-brand"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {totalResults === 0 ? (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <HelpCircle className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 text-base font-semibold text-slate-800">No matching questions found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try different keywords or contact our team directly for custom support.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
            >
              Contact Support
            </Link>
          </div>
        ) : (
          <div className="mt-12 space-y-10">
            {filteredCategories.map((group) => (
              <div key={group.cat} className="space-y-4">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-brand">
                  {group.cat}
                </h2>
                <div className="space-y-3">
                  {group.items.map((item, idx) => {
                    const itemKey = `${group.cat}-${idx}`;
                    const isOpen = Boolean(openItems[itemKey]);
                    return (
                      <article
                        key={itemKey}
                        className="rounded-2xl border border-slate-200/90 bg-white transition hover:border-slate-300"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(itemKey)}
                          className="flex w-full items-center justify-between gap-4 p-6 text-left"
                        >
                          <span className="font-display text-base font-bold text-[#0b1f4d]">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-brand" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="border-t border-slate-100 px-6 pb-6 pt-4 text-sm leading-relaxed text-slate-600">
                            {item.answer}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. STILL NEED HELP */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/contact"
            className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Headset className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Contact Support</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Talk to a member of our team about your account, milestone status, or dispute.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/how-it-works"
            className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Route className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">How It Works</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              See the complete end-to-end journey for clients and professionals.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand">
              Explore Guide <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/services"
            className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Browse Services</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Explore hundreds of trade, technical, and digital categories across six sectors.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand">
              View Catalog <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
