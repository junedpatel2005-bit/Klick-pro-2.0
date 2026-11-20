import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Briefcase,
  Code2,
  ShieldCheck,
  Headphones,
  Palette,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Careers — Build the Future of Service Work",
  description:
    "Join the Klick-Pro team. Explore opportunities across engineering, operations, trust & safety, customer experience, and product design.",
};

const departments = [
  {
    id: "eng",
    title: "Engineering & Platform Architecture",
    type: "Full-Time · Remote / Hybrid",
    icon: Code2,
    badge: "Engineering",
    description:
      "Build high-performance real-time web applications, payment resilience engines, geocoding microservices, and reliable WebSocket notifications.",
    skills: ["TypeScript", "Next.js", "PostgreSQL", "Prisma", "WebSockets"],
    contactRole: "Platform Engineer",
  },
  {
    id: "trust",
    title: "Trust, Verification & Compliance",
    type: "Full-Time · Operations",
    icon: ShieldCheck,
    badge: "Operations",
    description:
      "Protect our marketplace by verifying identity credentials, auditing professional trade qualifications, and managing dispute mediation.",
    skills: ["KYC Auditing", "Risk Analysis", "Compliance", "Document Verification"],
    contactRole: "Verification Specialist",
  },
  {
    id: "cx",
    title: "Customer Success & Pro Concierge",
    type: "Full-Time · Customer Experience",
    icon: Headphones,
    badge: "Customer Support",
    description:
      "Guide clients in posting successful requirements, support service specialists with onboarding, and resolve inquiries rapidly.",
    skills: ["Customer Communication", "Case Resolution", "Client Onboarding", "CRM"],
    contactRole: "Customer Success Specialist",
  },
  {
    id: "design",
    title: "Product & UI/UX Design",
    type: "Full-Time · Design",
    icon: Palette,
    badge: "Product",
    description:
      "Craft frictionless discovery experiences, intuitive milestone management flows, and responsive design systems across desktop and mobile.",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    contactRole: "Product Designer",
  },
];

const perks = [
  {
    title: "Meaningful Impact",
    desc: "Help real people earn a dignified living and help homeowners find dependable, verified specialists.",
    icon: HeartHandshake,
  },
  {
    title: "Modern Engineering Stack",
    desc: "Work with modern tooling: Next.js 16, React 19, TypeScript, PostgreSQL, and Tailwind CSS.",
    icon: Zap,
  },
  {
    title: "High Autonomy & Ownership",
    desc: "Small, agile teams where your individual contributions make a direct, visible difference every day.",
    icon: Sparkles,
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background text-foreground antialiased">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-28 gradient-hero border-b border-border/60">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Join Klick-Pro</span>
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Build a Better Way to Work.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              We are creating India&apos;s most reliable marketplace where clients meet verified
              professionals with zero platform commissions and complete escrow protection.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-xl shadow-soft">
                <a href="#openings">View Open Teams</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <Link href="/about" prefetch={false}>
                  Learn About Our Mission
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Culture & Perks */}
        <section className="py-16 sm:py-20 border-b border-border/60 bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Why Work With Us</p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Built Around Craft, Trust &amp; Speed
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {perks.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-2xs transition-all hover:shadow-md"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-base text-foreground">{p.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Department Openings */}
        <section id="openings" className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Opportunities</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
                  Open Roles &amp; Teams
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                We review applications continuously on a rolling basis. Find a role below or submit an open portfolio.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="flex flex-col justify-between rounded-3xl border border-border bg-card p-7 shadow-2xs transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                          <dept.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                            {dept.badge}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">{dept.type}</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                      {dept.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {dept.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {dept.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-lg border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Actively Recruiting
                    </span>
                    <Button asChild size="sm" className="rounded-xl gap-1">
                      <Link
                        href={`/contact?topic=Careers&role=${encodeURIComponent(dept.contactRole)}`}
                        prefetch={false}
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Open Application Card */}
            <div className="mt-12 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-primary/5 p-8 text-center sm:p-10 shadow-soft">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                Don&apos;t See the Exact Role for You?
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
                We are always excited to hear from talented individuals passionate about service marketplaces, design, or engineering. Send us an open application.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild size="default" className="rounded-xl shadow-soft">
                  <Link href="/contact?topic=Careers" prefetch={false}>
                    Submit an Open Application
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default" className="rounded-xl">
                  <a href="mailto:support@klick-pro.com">Email Resume Directly</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
