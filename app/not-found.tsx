import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Compass,
  Home,
  Briefcase,
  HelpCircle,
  Mail,
  ArrowRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen max-w-full overflow-x-clip flex-col bg-background text-foreground antialiased">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero 404 Banner */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            {/* Visual 404 Graphic Badge */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 shadow-soft text-primary">
              <Compass className="h-10 w-10 animate-pulse" />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-primary">
              Error 404 · Page Not Found
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Lost in the Marketplace?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              The page you are looking for doesn&apos;t exist, was moved, or the link may be outdated. Let&apos;s get you back on track.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-xl shadow-soft">
                <Link href="/" prefetch={false} className="gap-2">
                  <Home className="h-4 w-4" />
                  <span>Return to Homepage</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <Link href="/services" prefetch={false} className="gap-2">
                  <Search className="h-4 w-4" />
                  <span>Browse All Services</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Recovery Destinations Grid */}
        <section className="border-t border-border/70 bg-muted/30 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-lg font-bold text-foreground">
              Helpful Destinations
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/services"
                prefetch={false}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-2xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    Find Services
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Browse verified professionals across residential, commercial, and industrial trades.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/post-job"
                prefetch={false}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-2xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-cta/15 text-cta">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    Post a Job
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Tell us what you need done and receive competitive quotes from experts near you.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Post now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/faq"
                prefetch={false}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-2xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    Help & FAQ
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Learn how escrow protection, verified badges, and milestone payments work.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  View FAQ <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/contact"
                prefetch={false}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-2xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    Contact Support
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Need help with an account or project? Our support team is here for you.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Get in touch <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
