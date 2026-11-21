"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { ProCard } from "@/components/ProCard";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { moveItem } from "@/lib/move-item";
import type { DragHandle } from "@/components/cms/CmsSortable";
import type { HomeContent } from "@/lib/home-cms-file";
import type { MarketplaceProfessional } from "@/lib/types/marketplace";

// Drag-and-drop is CMS-only, so the libraries load lazily and never ship to
// public visitors on the marketing pages.
const SortableBoard = dynamic(
  () => import("@/components/cms/CmsSortable").then((m) => m.SortableBoard),
  { ssr: false },
);
const SortableItem = dynamic(
  () => import("@/components/cms/CmsSortable").then((m) => m.SortableItem),
  {
    ssr: false,
  },
);

const MASTER_CATEGORIES = [
  {
    title: "Residential",
    description: "Electricians, plumbers, cleaners, painters, carpenters, tutors and home care.",
    icon: Home,
    href: "/services?sector=residential",
  },
  {
    title: "Commercial",
    description: "Office fit-outs, facility upkeep, photography, marketing, accounting and legal help.",
    icon: Building2,
    href: "/services?sector=commercial",
  },
  {
    title: "Industrial",
    description: "Machinery maintenance, industrial wiring, welding, safety audits and logistics.",
    icon: Factory,
    href: "/services?sector=industrial",
  },
  {
    title: "Health Care",
    description: "Nurses, caregivers, physiotherapists, therapists, medical technicians and wellness support.",
    icon: HeartPulse,
    href: "/services?sector=healthcare",
  },
  {
    title: "Personal Care & Home Services",
    description: "Salon and grooming, spa and massage, beauty, fitness trainers, laundry and home help.",
    icon: Sparkles,
    href: "/services?sector=personal",
  },
  {
    title: "Education",
    description: "Tutors, coaches, language teachers, test prep, skill training and online courses.",
    icon: GraduationCap,
    href: "/services?sector=education",
  },
];

const FALLBACK_FEATURED_PROS = [
  {
    id: 1001,
    name: "Aarav Patel",
    category: "Full-Stack Next.js Dev",
    rate: "₹1,800/hr",
    rating: "4.9",
    reviewsCount: 42,
    initials: "AP",
    bgClass: "bg-blue-100 text-blue-700",
  },
  {
    id: 1002,
    name: "Priya Sharma",
    category: "UI/UX & Brand Designer",
    rate: "₹1,400/hr",
    rating: "5.0",
    reviewsCount: 68,
    initials: "PS",
    bgClass: "bg-amber-100 text-amber-700",
  },
  {
    id: 1003,
    name: "Rajesh Kumar",
    category: "Certified Electrician",
    rate: "₹499 visit",
    rating: "4.8",
    reviewsCount: 89,
    initials: "RK",
    bgClass: "bg-purple-100 text-purple-700",
  },
  {
    id: 1004,
    name: "Vikram Mehta",
    category: "Commercial Videographer",
    rate: "₹6,500/day",
    rating: "4.9",
    reviewsCount: 35,
    initials: "VM",
    bgClass: "bg-rose-100 text-rose-700",
  },
];

export default function Landing({
  isAuthenticated = false,
  homeContent,
  cmsMode = false,
  onHomeChange,
  selectedFeatureId,
  onFeatureSelect,
  onFeatureDelete,
  onFeatureDuplicate,
}: {
  isAuthenticated?: boolean;
  homeContent?: HomeContent;
  cmsMode?: boolean;
  onHomeChange?: (content: HomeContent) => void;
  selectedFeatureId?: string | null;
  onFeatureSelect?: (id: string) => void;
  onFeatureDelete?: (id: string) => void;
  onFeatureDuplicate?: (id: string) => void;
}) {
  const fallback: HomeContent = {
    hero: {
      eyebrow: "VERIFIED MARKETPLACE PROFESSIONALS",
      title: "Find trusted professionals for work that matters.",
      description:
        "Post work, compare qualified professionals, and manage every project in one place.",
      primaryCta: "Browse professionals",
      secondaryCta: "Post a job",
    },
    features: [
      {
        id: "projects",
        title: "Project Management",
        description:
          "Track progress, communicate in real-time, and manage all projects in one centralized dashboard.",
        icon: "briefcase",
      },
      {
        id: "verified",
        title: "Verified Professionals",
        description:
          "All professionals are verified and vetted to ensure quality work and your peace of mind.",
        icon: "shield",
      },
      {
        id: "matching",
        title: "Expert Matching",
        description:
          "Get matched with professionals that best fit your project needs and budget requirements.",
        icon: "users",
      },
      {
        id: "local",
        title: "Local & Remote",
        description:
          "Work with professionals near you or globally - choose what works best for your project.",
        icon: "map",
      },
      {
        id: "discovery",
        title: "Easy Discovery",
        description:
          "Browse portfolios, reviews, and rates to find the right fit. Make data-driven decisions.",
        icon: "search",
      },
      {
        id: "growth",
        title: "Seamless Growth",
        description:
          "Build long-term relationships with reliable partners and scale your business together.",
        icon: "arrow",
      },
    ],
  };

  const content: HomeContent = {
    hero: {
      eyebrow: homeContent?.hero?.eyebrow || fallback.hero.eyebrow,
      title: homeContent?.hero?.title || fallback.hero.title,
      description: homeContent?.hero?.description || fallback.hero.description,
      primaryCta: homeContent?.hero?.primaryCta || fallback.hero.primaryCta,
      secondaryCta: homeContent?.hero?.secondaryCta || fallback.hero.secondaryCta,
    },
    features:
      homeContent?.features && homeContent.features.length > 0
        ? homeContent.features
        : fallback.features,
  };
  const edit = (hero: Partial<HomeContent["hero"]>) =>
    onHomeChange?.({ ...content, hero: { ...content.hero, ...hero } });
  const router = useRouter();
  const [professionals, setProfessionals] = useState<MarketplaceProfessional[]>([]);
  const [failed, setFailed] = useState(false);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    if (cmsMode) return;
    async function loadHome() {
      try {
        const response = await fetch("/api/v1/marketplace/professionals");
        if (!response.ok) throw new Error("Marketplace request failed");
        const data = (await response.json()) as MarketplaceProfessional[];
        if (Array.isArray(data)) {
          setProfessionals(data);
        }
      } catch {
        setFailed(true);
      }
    }
    void loadHome();
  }, [cmsMode]);

  useEffect(() => {
    if (cmsMode || !isAuthenticated) return;
    async function loadSaved() {
      try {
        const res = await fetch("/api/client/saved-professionals");
        if (res.ok) {
          const data = (await res.json()) as { savedIds?: number[] };
          if (Array.isArray(data.savedIds)) setSavedIds(data.savedIds);
        }
      } catch {
        // Ignore saved professionals fetch error
      }
    }
    void loadSaved();
  }, [cmsMode, isAuthenticated]);

  const handleToggleSave = async (proId: string | number) => {
    if (!isAuthenticated) {
      toast.error("Please sign in as a client to save professionals.", {
        action: {
          label: "Sign in",
          onClick: () => router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`),
        },
      });
      return;
    }

    const numericId = Number(proId);
    if (!numericId) return;

    const isCurrentlySaved = savedIds.includes(numericId);
    setSavedIds((prev) =>
      isCurrentlySaved ? prev.filter((id) => id !== numericId) : [...prev, numericId],
    );

    try {
      const res = await fetch(`/api/client/saved-professionals/${numericId}`, {
        method: isCurrentlySaved ? "DELETE" : "POST",
      });

      if (!res.ok) {
        setSavedIds((prev) =>
          isCurrentlySaved ? [...prev, numericId] : prev.filter((id) => id !== numericId),
        );
        toast.error("Unable to update saved professional.");
        return;
      }

      toast.success(
        isCurrentlySaved ? "Professional removed from saved." : "Professional saved to favorites!",
      );
    } catch {
      setSavedIds((prev) =>
        isCurrentlySaved ? [...prev, numericId] : prev.filter((id) => id !== numericId),
      );
      toast.error("Network error. Please try again.");
    }
  };

  const renderFeature = (
    feature: HomeContent["features"][number],
    drag?: DragHandle,
    index?: number,
  ) => {
    const idx =
      index !== undefined ? index : content.features.findIndex((f) => f.id === feature.id);
    return (
      <HomeFeature
        key={feature.id}
        feature={feature}
        cmsMode={cmsMode}
        drag={drag}
        selected={selectedFeatureId === feature.id}
        onSelect={() => onFeatureSelect?.(feature.id)}
        onDelete={() => onFeatureDelete?.(feature.id)}
        onDuplicate={() => onFeatureDuplicate?.(feature.id)}
        onMoveLeft={
          idx > 0
            ? () =>
                onHomeChange?.({ ...content, features: moveItem(content.features, idx, idx - 1) })
            : undefined
        }
        onMoveRight={
          idx < content.features.length - 1
            ? () =>
                onHomeChange?.({ ...content, features: moveItem(content.features, idx, idx + 1) })
            : undefined
        }
        onChange={(changes) =>
          onHomeChange?.({
            ...content,
            features: content.features.map((item) =>
              item.id === feature.id ? { ...item, ...changes } : item,
            ),
          })
        }
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
      <main className="flex-grow">
        {/* ================= 1. HERO SECTION WITH OFFICIAL WEBSITE LOGO SHOWCASE ================= */}
        <section className="gradient-hero border-b border-slate-200/60">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span
                  contentEditable={cmsMode}
                  suppressContentEditableWarning={cmsMode}
                  onInput={(e) => edit({ eyebrow: e.currentTarget.textContent ?? "" })}
                >
                  {content.hero.eyebrow}
                </span>
              </p>

              <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl sm:leading-[1.15]">
                <span
                  contentEditable={cmsMode}
                  suppressContentEditableWarning={cmsMode}
                  onInput={(e) => edit({ title: e.currentTarget.textContent ?? "" })}
                >
                  {content.hero.title}
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
                <span
                  contentEditable={cmsMode}
                  suppressContentEditableWarning={cmsMode}
                  onInput={(e) => edit({ description: e.currentTarget.textContent ?? "" })}
                >
                  {content.hero.description}
                </span>
              </p>

              <div className="mt-8 flex flex-wrap gap-3.5">
                {cmsMode ? (
                  <div
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition cursor-text ring-1 ring-white/20 hover:ring-2 hover:ring-blue-400"
                    title="Click text to edit button"
                  >
                    <Search className="h-4 w-4 shrink-0 pointer-events-none" />
                    <span
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onInput={(e) => edit({ primaryCta: e.currentTarget.textContent ?? "" })}
                      className="outline-none focus:underline"
                    >
                      {content.hero.primaryCta}
                    </span>
                  </div>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-blue-700 transition"
                  >
                    <Link href="/services">
                      <Search className="mr-2 h-4 w-4" />
                      <span>{content.hero.primaryCta}</span>
                    </Link>
                  </Button>
                )}

                {cmsMode ? (
                  <div
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-xs transition cursor-text hover:border-blue-400"
                    title="Click text to edit button"
                  >
                    <Briefcase className="h-4 w-4 shrink-0 pointer-events-none" />
                    <span
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onInput={(e) => edit({ secondaryCta: e.currentTarget.textContent ?? "" })}
                      className="outline-none focus:underline"
                    >
                      {content.hero.secondaryCta}
                    </span>
                  </div>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
                  >
                    <Link href="/post-job">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>{content.hero.secondaryCta}</span>
                    </Link>
                  </Button>
                )}
              </div>

              {/* Quick Trust Bar Under CTAs */}
              <div className="mt-8 flex items-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Verified Identity
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  100% Escrow Protection
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Pan-India Coverage
                </span>
              </div>
            </div>

            {/* Official Website Logo Showcase Card */}
            <div className="mx-auto w-full max-w-md lg:max-w-lg">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xl transition-all duration-300 hover:shadow-2xl">
                {/* Decorative background glow */}
                <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-blue-100/60 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-amber-100/50 blur-3xl" />

                <div className="relative flex flex-col items-center text-center">
                  {/* Website Official Logo Icon */}
                  <Link
                    href="/"
                    title="Klick-Pro Homepage"
                    className="group relative grid h-24 w-24 place-items-center rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-md transition-transform duration-200 hover:scale-105"
                  >
                    <Image
                      src="/logo.png"
                      alt="Klick-Pro Official Website Logo"
                      width={96}
                      height={96}
                      className="h-full w-full object-contain"
                      priority
                    />
                  </Link>

                  <div className="mt-4">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Verified Service Marketplace
                    </div>
                    <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-tight text-slate-900">
                      Klick<span className="text-blue-600">-Pro</span>
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
                      Find trusted professionals for work that matters. Post requirements, compare quotes, and hire with milestone escrow safety.
                    </p>
                  </div>

                  {/* 3 Confidence Metrics */}
                  <div className="mt-6 grid w-full grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-left">
                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <p className="text-[10px] font-bold uppercase text-slate-600">Security</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">100% Escrow</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <p className="text-[10px] font-bold uppercase text-slate-600">Posting</p>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5">₹0 To Post</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <p className="text-[10px] font-bold uppercase text-slate-600">Identity</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">Vetted KYC</p>
                    </div>
                  </div>

                  {/* Direct Link to Services */}
                  <div className="mt-5 w-full">
                    {cmsMode ? (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-sm cursor-text hover:ring-2 hover:ring-blue-400">
                        <span contentEditable={true} suppressContentEditableWarning={true} className="outline-none">
                          Explore All Service Sectors
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                      </div>
                    ) : (
                      <Link
                        href="/services"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 shadow-sm"
                      >
                        <span>Explore All Service Sectors</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. 6 MASTER SERVICE CATEGORIES (EXACT FROM INDEX.HTML) ================= */}
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              SERVICES FOR EVERYONE
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Residential, Commercial, Industrial &amp; more
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500 text-sm sm:text-base">
              From a leaking tap to a factory upgrade to a health check or a private tutor, find the right expert for any job.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MASTER_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return cmsMode ? (
                <div
                  key={cat.title}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-7 shadow-soft transition flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 cursor-text hover:underline">
                    <span contentEditable={true} suppressContentEditableWarning={true} className="outline-none">
                      Explore {cat.title}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                  </div>
                </div>
              ) : (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-7 shadow-soft hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:underline">
                    <span>Explore {cat.title}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ================= 3. "WHY CHOOSE US" 6-CARD GRID ================= */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              WHY CHOOSE US
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500 text-sm sm:text-base">
              A complete platform built for seamless collaboration between professionals and clients
            </p>
          </div>

          {cmsMode ? (
            <SortableBoard
              ids={content.features.map((feature) => feature.id)}
              onReorder={(from, to) =>
                onHomeChange?.({ ...content, features: moveItem(content.features, from, to) })
              }
            >
              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {content.features.map((feature, index) => (
                  <SortableItem key={feature.id} id={feature.id}>
                    {(drag) => renderFeature(feature, drag, index)}
                  </SortableItem>
                ))}
              </div>
            </SortableBoard>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {content.features.map((feature) => renderFeature(feature))}
            </div>
          )}
        </section>

        {/* ================= 4. FEATURED PROFESSIONALS (DATABASE + REALISTIC FALLBACK) ================= */}
        <section className="bg-white border-t border-slate-200/80 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Featured</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Professionals ready to help
                </h2>
              </div>
              {cmsMode ? (
                <div className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 cursor-text hover:underline">
                  <span contentEditable={true} suppressContentEditableWarning={true} className="outline-none">
                    Browse all verified professionals
                  </span>
                  <ArrowRight className="h-4 w-4 pointer-events-none" />
                </div>
              ) : (
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Browse all <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* CMS Mode Skeleton Preview */}
            {cmsMode ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {FALLBACK_FEATURED_PROS.map((pro) => (
                  <div
                    key={pro.id}
                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`grid h-12 w-12 place-items-center rounded-full text-base font-bold ${pro.bgClass}`}>
                        {pro.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{pro.name}</p>
                        <p className="text-xs text-slate-500">{pro.category}</p>
                      </div>
                    </div>
                    <div className="mt-5 border-t border-slate-100 pt-4 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-600">Rate</p>
                        <p className="text-base font-bold text-slate-900">{pro.rate}</p>
                      </div>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        ★ {pro.rating} ({pro.reviewsCount})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Public Loading Skeleton */}
            {!cmsMode && !professionals.length && !failed && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            )}

            {/* Live Database Professionals */}
            {!cmsMode && professionals.length > 0 && (
              <div
                data-db-section="professionals"
                className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {professionals.slice(0, 4).map((professional) => (
                  <ProCard
                    key={professional.id}
                    pro={professional}
                    requireLogin={!isAuthenticated}
                    isSaved={savedIds.includes(Number(professional.id))}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}

            {/* Fallback Professionals from index.html if Database has 0 pros */}
            {!cmsMode && (failed || (!professionals.length && failed)) && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {FALLBACK_FEATURED_PROS.map((pro) => (
                  <div
                    key={pro.id}
                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`grid h-12 w-12 place-items-center rounded-full text-base font-bold ${pro.bgClass}`}>
                        {pro.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{pro.name}</p>
                        <p className="text-xs text-slate-500">{pro.category}</p>
                      </div>
                    </div>
                    <div className="mt-5 border-t border-slate-100 pt-4 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-600">Rate</p>
                        <p className="text-base font-bold text-slate-900">{pro.rate}</p>
                      </div>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        ★ {pro.rating} ({pro.reviewsCount})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= 5. DUAL-TRACK CALL TO ACTION BANNER ================= */}
        <section className="border-t border-slate-200/80 bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* For Clients CTA */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft flex flex-col justify-between">
                <div>
                  <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    For Clients
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">
                    Ready to start your next project?
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Post your job in minutes, compare verified professional bids, and keep 100% control through escrow protection.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {cmsMode ? (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-soft cursor-text hover:ring-2 hover:ring-blue-400">
                      <Briefcase className="h-4 w-4 pointer-events-none" />
                      <span contentEditable={true} suppressContentEditableWarning={true} className="outline-none">
                        Post a Job Free
                      </span>
                    </div>
                  ) : (
                    <Link
                      href="/post-job"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-blue-700 transition"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Post a Job Free</span>
                    </Link>
                  )}

                  {cmsMode ? (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 cursor-text hover:text-blue-600">
                      <span contentEditable={true} suppressContentEditableWarning={true} className="outline-none">
                        How it works for clients
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                    </div>
                  ) : (
                    <Link
                      href="/for-clients"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
                    >
                      <span>How it works for clients</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* For Professionals CTA */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft flex flex-col justify-between">
                <div>
                  <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    For Professionals
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">
                    Are you a qualified service specialist?
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Join Klick-Pro to connect directly with serious residential and commercial clients with zero platform commissions.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {cmsMode ? (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-soft cursor-text hover:ring-2 hover:ring-blue-400">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 pointer-events-none" />
                      <span contentEditable={true} suppressContentEditableWarning={true} className="outline-none">
                        Join as a Professional
                      </span>
                    </div>
                  ) : (
                    <Link
                      href="/signup?role=PROFESSIONAL"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-slate-800 transition"
                    >
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Join as a Professional</span>
                    </Link>
                  )}

                  {cmsMode ? (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 cursor-text hover:text-blue-600">
                      <span contentEditable={true} suppressContentEditableWarning={true} className="outline-none">
                        Explore pro benefits
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                    </div>
                  ) : (
                    <Link
                      href="/for-professionals"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
                    >
                      <span>Explore pro benefits</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function HomeFeature({
  feature,
  cmsMode,
  drag,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
  onChange,
  onMoveLeft,
  onMoveRight,
}: {
  feature: HomeContent["features"][number];
  cmsMode: boolean;
  drag?: DragHandle;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onChange: (changes: Partial<HomeContent["features"][number]>) => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
}) {
  const icons = {
    shield: ShieldCheck,
    briefcase: Briefcase,
    users: Users,
    map: MapPin,
    search: Search,
    arrow: ArrowRight,
  };
  const Icon = icons[feature.icon as keyof typeof icons] ?? ShieldCheck;
  const editable = (field: "title" | "description") =>
    cmsMode
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          onPointerDown: (event: React.PointerEvent<HTMLElement>) => event.stopPropagation(),
          onInput: (event: React.FormEvent<HTMLElement>) =>
            onChange({ [field]: event.currentTarget.textContent ?? "" }),
        }
      : {};

  return (
    <div
      ref={drag?.ref}
      style={drag?.style}
      {...(drag?.handleProps ?? {})}
      onClick={cmsMode ? onSelect : undefined}
      className={`relative rounded-2xl border border-slate-200/80 bg-white p-8 shadow-soft hover:shadow-md transition ${
        cmsMode ? "cursor-grab active:cursor-grabbing" : ""
      } ${selected ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-white" : ""} ${
        drag?.isDragging ? "z-10 scale-[1.02] opacity-70 shadow-2xl" : ""
      }`}
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-slate-900" {...editable("title")}>
        {feature.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-500" {...editable("description")}>
        {feature.description}
      </p>
      {cmsMode && selected && (
        <div
          className="absolute -top-3 right-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs shadow-lg"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          {onMoveLeft && (
            <button
              type="button"
              onClick={onMoveLeft}
              className="text-blue-600 font-bold hover:underline"
              title="Move box earlier"
            >
              &larr; Move
            </button>
          )}
          {onMoveRight && (
            <button
              type="button"
              onClick={onMoveRight}
              className="text-blue-600 font-bold hover:underline"
              title="Move box later"
            >
              Move &rarr;
            </button>
          )}
          <label className="text-slate-500">
            Icon{" "}
            <select
              value={feature.icon}
              onPointerDown={(event) => event.stopPropagation()}
              onChange={(event) => onChange({ icon: event.target.value })}
              className="bg-white text-slate-900"
            >
              <option value="shield">Shield</option>
              <option value="briefcase">Briefcase</option>
              <option value="users">Users</option>
              <option value="map">Map</option>
              <option value="search">Search</option>
              <option value="arrow">Arrow</option>
            </select>
          </label>
          <button type="button" onClick={onDelete} className="text-red-600 font-bold">
            Delete
          </button>
          <button type="button" onClick={onDuplicate} className="text-blue-600 font-bold">
            Duplicate
          </button>
        </div>
      )}
    </div>
  );
}
