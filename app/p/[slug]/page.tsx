import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCmsPage } from "@/lib/cms-unified";
import {
  Award,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Factory,
  GraduationCap,
  HeartPulse,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: ShieldCheck,
  briefcase: Briefcase,
  users: Users,
  award: Award,
  star: Star,
  wallet: Wallet,
  clock: Clock,
  check: Check,
  message: MessageCircle,
  map: MapPin,
  search: Search,
  trend: TrendingUp,
  mail: Mail,
  sparkles: Sparkles,
  heart: HeartPulse,
  education: GraduationCap,
  home: Home,
  building: Building2,
  factory: Factory,
  handshake: Users,
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await getCmsPage(slug);
    return {
      title: page.seo?.metaTitle || `${page.title} | Klick-Pro`,
      description: page.seo?.metaDescription || page.hero.description,
      keywords: page.seo?.keywords,
    };
  } catch {
    return {
      title: "Page Not Found",
    };
  }
}

export default async function StandaloneCmsPage({ params }: Props) {
  const { slug } = await params;
  let page;
  try {
    page = await getCmsPage(slug);
  } catch {
    notFound();
  }

  const primaryHref = page.hero.primaryCtaLink || "/services";
  const secondaryHref = page.hero.secondaryCtaLink || "/post-job";

  return (
    <div className="flex min-h-screen flex-col justify-between">
      <main className="flex-grow">
        {/* ================= 1. HERO SECTION ================= */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            {page.hero.eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-2xs backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>{page.hero.eyebrow}</span>
              </div>
            )}

            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl sm:leading-[1.15]">
              {page.hero.title}
            </h1>

            {page.hero.description && (
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {page.hero.description}
              </p>
            )}

            {(page.hero.primaryCta || page.hero.secondaryCta) && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                {page.hero.primaryCta && (
                  <Link
                    href={primaryHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
                  >
                    <span>{page.hero.primaryCta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {page.hero.secondaryCta && (
                  <Link
                    href={secondaryHref}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50"
                  >
                    <span>{page.hero.secondaryCta}</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ================= 2. CONTENT BOXES & SECTIONS ================= */}
        {page.boxes && page.boxes.length > 0 && (
          <section className="py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {(page.boxesSection?.title || page.boxesSection?.subtitle) && (
                <div className="mb-14 text-center">
                  {page.boxesSection.title && (
                    <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {page.boxesSection.title}
                    </h2>
                  )}
                  {page.boxesSection.subtitle && (
                    <p className="mt-3 text-sm font-medium text-slate-500 sm:text-base">
                      {page.boxesSection.subtitle}
                    </p>
                  )}
                </div>
              )}

              <div
                className={`grid gap-6 ${
                  page.boxes.length === 1
                    ? "mx-auto max-w-md"
                    : page.boxes.length === 2
                      ? "mx-auto max-w-4xl md:grid-cols-2"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {page.boxes.map((box) => {
                  const Icon = ICON_MAP[box.icon] || ShieldCheck;
                  return (
                    <div
                      key={box.id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div>
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-5 font-display text-lg font-bold text-slate-900">
                          {box.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {box.description}
                        </p>
                      </div>

                      {box.badge && (
                        <div className="mt-5">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                            {box.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ================= 3. CALL TO ACTION / BOTTOM BANNER ================= */}
        <section className="border-t border-slate-200/80 bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Ready to work with verified professionals?
            </h2>
            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              Post your job for free and receive verified quotes with milestone escrow security.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Post a Job Free</span>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50"
              >
                <span>Browse Marketplace</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Clean minimal footer line - NO website header and NO website footer */}
      <footer className="border-t border-slate-200/60 bg-slate-50 py-6 text-center text-xs font-medium text-slate-400">
        Klick-Pro &middot; Verified Milestone Escrow Marketplace
      </footer>
    </div>
  );
}
