import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Sparkles,
  Clock,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Resource Guides — Work Smarter, Together",
  description:
    "Expert insights, practical guides, hiring tips, and escrow workflows for clients and service specialists on Klick-Pro.",
};

const articles = [
  {
    id: "job-post-guide",
    tag: "For Clients",
    title: "How to Write a Job Post That Attracts Verified Specialists",
    summary:
      "Clear goals, realistic budget ranges, and concise milestone definitions help top professionals send accurate, high-quality proposals quickly.",
    readingTime: "4 min read",
    href: "/for-clients",
    actionLabel: "Read Client Guide",
  },
  {
    id: "pro-profile-trust",
    tag: "For Professionals",
    title: "Build Trust and Win Contracts with a Complete Profile",
    summary:
      "Adding verified trade documents, past work photos, accurate service radiuses, and transparent pricing establishes instant credibility with clients.",
    readingTime: "5 min read",
    href: "/for-professionals",
    actionLabel: "Read Professional Guide",
  },
  {
    id: "escrow-protection",
    tag: "Trust & Safety",
    title: "How Escrow Milestones Protect Both Clients and Specialists",
    summary:
      "Learn how 100% money-back escrow deposits ensure clients only pay for approved milestones while professionals work with guaranteed funding.",
    readingTime: "3 min read",
    href: "/how-it-works",
    actionLabel: "Explore Escrow Workflow",
  },
  {
    id: "pricing-transparency",
    tag: "Pricing & Finance",
    title: "Zero Platform Commissions: How 100% Payouts Work",
    summary:
      "Discover how Klick-Pro eliminates middleman commission cuts, allowing clients to get fair market rates and specialists to retain 100% of earnings.",
    readingTime: "4 min read",
    href: "/pricing",
    actionLabel: "View Pricing Breakdown",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background text-foreground antialiased">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-28 gradient-hero border-b border-border/60">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Klick-Pro Resources</span>
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Work Smarter, Together.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              Practical marketplace advice, escrow guides, and business best practices for clients
              and independent professionals across India.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-7 sm:p-8 shadow-2xs transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                        {article.tag}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {article.readingTime}
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      <Link href={article.href} prefetch={false}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border/80">
                    <Link
                      href={article.href}
                      prefetch={false}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary group-hover:underline"
                    >
                      <span>{article.actionLabel}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Newsletter / Resource Banner */}
            <div className="mt-16 rounded-3xl border border-border bg-muted/40 p-8 sm:p-12 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary mx-auto">
                <HelpCircle className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                Have a Specific Question?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Check our comprehensive Help Center or contact our dedicated operations team directly.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/faq"
                  prefetch={false}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition"
                >
                  Visit FAQ Center
                </Link>
                <Link
                  href="/contact"
                  prefetch={false}
                  className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
