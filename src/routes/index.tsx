"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Factory,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { ProCard } from "@/components/ProCard";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { moveItem } from "@/lib/move-item";
import type { DragHandle } from "@/components/cms/CmsSortable";
import { defaultHomeContent, type HomeContent } from "@/lib/home-cms-shared";
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
  const content: HomeContent = {
    hero: {
      eyebrow: homeContent?.hero?.eyebrow ?? defaultHomeContent.hero.eyebrow,
      title: homeContent?.hero?.title ?? defaultHomeContent.hero.title,
      description: homeContent?.hero?.description ?? defaultHomeContent.hero.description,
      primaryCta: homeContent?.hero?.primaryCta ?? defaultHomeContent.hero.primaryCta,
      secondaryCta: homeContent?.hero?.secondaryCta ?? defaultHomeContent.hero.secondaryCta,
    },
    heroShowcase: {
      badge: homeContent?.heroShowcase?.badge ?? defaultHomeContent.heroShowcase!.badge,
      title: homeContent?.heroShowcase?.title ?? defaultHomeContent.heroShowcase!.title,
      description: homeContent?.heroShowcase?.description ?? defaultHomeContent.heroShowcase!.description,
      metrics: homeContent?.heroShowcase?.metrics ?? defaultHomeContent.heroShowcase!.metrics,
      ctaText: homeContent?.heroShowcase?.ctaText ?? defaultHomeContent.heroShowcase!.ctaText,
    },
    categoriesSection: {
      eyebrow: homeContent?.categoriesSection?.eyebrow ?? defaultHomeContent.categoriesSection!.eyebrow,
      title: homeContent?.categoriesSection?.title ?? defaultHomeContent.categoriesSection!.title,
      description: homeContent?.categoriesSection?.description ?? defaultHomeContent.categoriesSection!.description,
      items: homeContent?.categoriesSection?.items ?? defaultHomeContent.categoriesSection!.items,
    },
    whyChooseUsSection: {
      eyebrow: homeContent?.whyChooseUsSection?.eyebrow ?? defaultHomeContent.whyChooseUsSection!.eyebrow,
      title: homeContent?.whyChooseUsSection?.title ?? defaultHomeContent.whyChooseUsSection!.title,
      description: homeContent?.whyChooseUsSection?.description ?? defaultHomeContent.whyChooseUsSection!.description,
    },
    features:
      homeContent?.features && homeContent.features.length > 0
        ? homeContent.features
        : defaultHomeContent.features,
    featuredProsSection: {
      eyebrow: homeContent?.featuredProsSection?.eyebrow ?? defaultHomeContent.featuredProsSection!.eyebrow,
      title: homeContent?.featuredProsSection?.title ?? defaultHomeContent.featuredProsSection!.title,
      ctaText: homeContent?.featuredProsSection?.ctaText ?? defaultHomeContent.featuredProsSection!.ctaText,
    },
    ctaDualBanner: {
      client: {
        badge: homeContent?.ctaDualBanner?.client?.badge ?? defaultHomeContent.ctaDualBanner!.client.badge,
        title: homeContent?.ctaDualBanner?.client?.title ?? defaultHomeContent.ctaDualBanner!.client.title,
        description: homeContent?.ctaDualBanner?.client?.description ?? defaultHomeContent.ctaDualBanner!.client.description,
        primaryCta: homeContent?.ctaDualBanner?.client?.primaryCta ?? defaultHomeContent.ctaDualBanner!.client.primaryCta,
        secondaryCta: homeContent?.ctaDualBanner?.client?.secondaryCta ?? defaultHomeContent.ctaDualBanner!.client.secondaryCta,
      },
      pro: {
        badge: homeContent?.ctaDualBanner?.pro?.badge ?? defaultHomeContent.ctaDualBanner!.pro.badge,
        title: homeContent?.ctaDualBanner?.pro?.title ?? defaultHomeContent.ctaDualBanner!.pro.title,
        description: homeContent?.ctaDualBanner?.pro?.description ?? defaultHomeContent.ctaDualBanner!.pro.description,
        primaryCta: homeContent?.ctaDualBanner?.pro?.primaryCta ?? defaultHomeContent.ctaDualBanner!.pro.primaryCta,
        secondaryCta: homeContent?.ctaDualBanner?.pro?.secondaryCta ?? defaultHomeContent.ctaDualBanner!.pro.secondaryCta,
      },
    },
  };

  const edit = (hero: Partial<HomeContent["hero"]>) =>
    onHomeChange?.({ ...content, hero: { ...content.hero, ...hero } });

  const editShowcase = (showcase: Partial<NonNullable<HomeContent["heroShowcase"]>>) =>
    onHomeChange?.({ ...content, heroShowcase: { ...content.heroShowcase!, ...showcase } });

  const editCategories = (cat: Partial<NonNullable<HomeContent["categoriesSection"]>>) =>
    onHomeChange?.({ ...content, categoriesSection: { ...content.categoriesSection!, ...cat } });

  const editCategoryItem = (
    index: number,
    patch: Partial<NonNullable<NonNullable<HomeContent["categoriesSection"]>["items"]>[number]>,
  ) => {
    const nextItems = [...(content.categoriesSection?.items || [])];
    if (nextItems[index]) {
      nextItems[index] = { ...nextItems[index], ...patch };
      editCategories({ items: nextItems });
    }
  };

  const editWhyChooseUs = (why: Partial<NonNullable<HomeContent["whyChooseUsSection"]>>) =>
    onHomeChange?.({ ...content, whyChooseUsSection: { ...content.whyChooseUsSection!, ...why } });

  const editFeaturedPros = (pros: Partial<NonNullable<HomeContent["featuredProsSection"]>>) =>
    onHomeChange?.({ ...content, featuredProsSection: { ...content.featuredProsSection!, ...pros } });

  const editClientCta = (client: Partial<NonNullable<NonNullable<HomeContent["ctaDualBanner"]>["client"]>>) =>
    onHomeChange?.({
      ...content,
      ctaDualBanner: {
        client: { ...content.ctaDualBanner!.client, ...client },
        pro: { ...content.ctaDualBanner!.pro },
      },
    });

  const editProCta = (pro: Partial<NonNullable<NonNullable<HomeContent["ctaDualBanner"]>["pro"]>>) =>
    onHomeChange?.({
      ...content,
      ctaDualBanner: {
        client: { ...content.ctaDualBanner!.client },
        pro: { ...content.ctaDualBanner!.pro, ...pro },
      },
    });
  const router = useRouter();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
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
                  {cmsMode ? (
                    <div
                      title="Klick-Pro Homepage"
                      className="group relative grid h-24 w-24 place-items-center rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-md"
                    >
                      <Image
                        src="/logo.png"
                        alt="Klick-Pro Official Website Logo"
                        width={96}
                        height={96}
                        className="h-full w-full object-contain pointer-events-none"
                        priority
                      />
                    </div>
                  ) : (
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
                  )}

                  <div className="mt-4">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse pointer-events-none" />
                      <span
                        contentEditable={cmsMode}
                        suppressContentEditableWarning={cmsMode}
                        onInput={(e) => editShowcase({ badge: e.currentTarget.textContent ?? "" })}
                        className={cmsMode ? "outline-none focus:underline" : ""}
                      >
                        {content.heroShowcase?.badge}
                      </span>
                    </div>
                    <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-tight text-slate-900">
                      <span
                        contentEditable={cmsMode}
                        suppressContentEditableWarning={cmsMode}
                        onInput={(e) => editShowcase({ title: e.currentTarget.textContent ?? "" })}
                        className={cmsMode ? "outline-none focus:underline" : ""}
                      >
                        {content.heroShowcase?.title}
                      </span>
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
                      <span
                        contentEditable={cmsMode}
                        suppressContentEditableWarning={cmsMode}
                        onInput={(e) => editShowcase({ description: e.currentTarget.textContent ?? "" })}
                        className={cmsMode ? "outline-none focus:underline" : ""}
                      >
                        {content.heroShowcase?.description}
                      </span>
                    </p>
                  </div>

                  {/* 3 Confidence Metrics */}
                  <div className="mt-6 grid w-full grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-left">
                    {(content.heroShowcase?.metrics || defaultHomeContent.heroShowcase!.metrics).map((m, idx) => (
                      <div key={idx} className="rounded-xl bg-slate-50 p-2.5">
                        <p
                          className="text-[10px] font-bold uppercase text-slate-600 outline-none"
                          contentEditable={cmsMode}
                          suppressContentEditableWarning={cmsMode}
                          onInput={(e) => {
                            const nextMetrics = [
                              ...(content.heroShowcase?.metrics || defaultHomeContent.heroShowcase!.metrics),
                            ];
                            const current = nextMetrics[idx] ?? { label: "", value: "" };
                            nextMetrics[idx] = { label: e.currentTarget.textContent ?? "", value: current.value };
                            editShowcase({ metrics: nextMetrics });
                          }}
                        >
                          {m.label}
                        </p>
                        <p
                          className={`text-xs font-bold mt-0.5 outline-none ${idx === 1 ? "text-emerald-700" : "text-slate-900"}`}
                          contentEditable={cmsMode}
                          suppressContentEditableWarning={cmsMode}
                          onInput={(e) => {
                            const nextMetrics = [
                              ...(content.heroShowcase?.metrics || defaultHomeContent.heroShowcase!.metrics),
                            ];
                            const current = nextMetrics[idx] ?? { label: "", value: "" };
                            nextMetrics[idx] = { label: current.label, value: e.currentTarget.textContent ?? "" };
                            editShowcase({ metrics: nextMetrics });
                          }}
                        >
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Direct Link to Services */}
                  <div className="mt-5 w-full">
                    {cmsMode ? (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-sm cursor-text hover:ring-2 hover:ring-blue-400">
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onInput={(e) => editShowcase({ ctaText: e.currentTarget.textContent ?? "" })}
                          className="outline-none"
                        >
                          {content.heroShowcase?.ctaText}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                      </div>
                    ) : (
                      <Link
                        href="/services"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 shadow-sm"
                      >
                        <span>{content.heroShowcase?.ctaText}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. 6 MASTER SERVICE CATEGORIES ================= */}
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              <span
                contentEditable={cmsMode}
                suppressContentEditableWarning={cmsMode}
                onInput={(e) => editCategories({ eyebrow: e.currentTarget.textContent ?? "" })}
                className={cmsMode ? "outline-none focus:underline" : ""}
              >
                {content.categoriesSection?.eyebrow}
              </span>
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              <span
                contentEditable={cmsMode}
                suppressContentEditableWarning={cmsMode}
                onInput={(e) => editCategories({ title: e.currentTarget.textContent ?? "" })}
                className={cmsMode ? "outline-none focus:underline" : ""}
              >
                {content.categoriesSection?.title}
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500 text-sm sm:text-base">
              <span
                contentEditable={cmsMode}
                suppressContentEditableWarning={cmsMode}
                onInput={(e) => editCategories({ description: e.currentTarget.textContent ?? "" })}
                className={cmsMode ? "outline-none focus:underline" : ""}
              >
                {content.categoriesSection?.description}
              </span>
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(content.categoriesSection?.items || defaultHomeContent.categoriesSection!.items!).map((cat, idx) => {
              const fallbackCat = MASTER_CATEGORIES[idx] ?? MASTER_CATEGORIES[0]!;
              const Icon = fallbackCat.icon;
              const isSelected = selectedCategoryIndex === idx;
              const itemsList = content.categoriesSection?.items || defaultHomeContent.categoriesSection!.items!;
              return cmsMode ? (
                <div
                  key={idx}
                  onClick={() => setSelectedCategoryIndex(idx)}
                  className={`relative group rounded-2xl border border-slate-200/80 bg-white p-7 shadow-soft transition flex flex-col justify-between cursor-pointer ${
                    isSelected ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-white" : "hover:border-blue-300"
                  }`}
                >
                  <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-105">
                      <Icon className="h-6 w-6 pointer-events-none" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                      <span
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onPointerDown={(e) => e.stopPropagation()}
                        onInput={(e) => editCategoryItem(idx, { title: e.currentTarget.textContent ?? "" })}
                        className="outline-none focus:underline"
                      >
                        {cat.title}
                      </span>
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      <span
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onPointerDown={(e) => e.stopPropagation()}
                        onInput={(e) => editCategoryItem(idx, { description: e.currentTarget.textContent ?? "" })}
                        className="outline-none focus:underline"
                      >
                        {cat.description}
                      </span>
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition cursor-text ring-1 ring-blue-200"
                      title="Click text to edit button name"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onInput={(e) => editCategoryItem(idx, { ctaText: e.currentTarget.textContent ?? "" })}
                        className="outline-none"
                      >
                        {cat.ctaText || `Explore ${cat.title}`}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Floating Action Toolbar on Selected Category */}
                  {isSelected && (
                    <div
                      className="absolute -top-3 right-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs shadow-lg z-20"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = moveItem(itemsList, idx, idx - 1);
                            editCategories({ items: next });
                            setSelectedCategoryIndex(idx - 1);
                          }}
                          className="text-blue-600 font-bold hover:underline"
                          title="Move box earlier"
                        >
                          &larr; Move
                        </button>
                      )}
                      {idx < itemsList.length - 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = moveItem(itemsList, idx, idx + 1);
                            editCategories({ items: next });
                            setSelectedCategoryIndex(idx + 1);
                          }}
                          className="text-blue-600 font-bold hover:underline"
                          title="Move box later"
                        >
                          Move &rarr;
                        </button>
                      )}
                      {itemsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = itemsList.filter((_, i) => i !== idx);
                            editCategories({ items: next });
                            setSelectedCategoryIndex(null);
                          }}
                          className="text-red-600 font-bold hover:underline"
                        >
                          Delete
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const copy = { ...cat, title: `${cat.title} (Copy)` };
                          const next = [...itemsList];
                          next.splice(idx + 1, 0, copy);
                          editCategories({ items: next });
                          setSelectedCategoryIndex(idx + 1);
                        }}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Duplicate
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={idx}
                  href={cat.href || fallbackCat.href}
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
                    <span>{cat.ctaText || `Explore ${cat.title}`}</span>
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
              <span
                contentEditable={cmsMode}
                suppressContentEditableWarning={cmsMode}
                onInput={(e) => editWhyChooseUs({ eyebrow: e.currentTarget.textContent ?? "" })}
                className={cmsMode ? "outline-none focus:underline" : ""}
              >
                {content.whyChooseUsSection?.eyebrow}
              </span>
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              <span
                contentEditable={cmsMode}
                suppressContentEditableWarning={cmsMode}
                onInput={(e) => editWhyChooseUs({ title: e.currentTarget.textContent ?? "" })}
                className={cmsMode ? "outline-none focus:underline" : ""}
              >
                {content.whyChooseUsSection?.title}
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500 text-sm sm:text-base">
              <span
                contentEditable={cmsMode}
                suppressContentEditableWarning={cmsMode}
                onInput={(e) => editWhyChooseUs({ description: e.currentTarget.textContent ?? "" })}
                className={cmsMode ? "outline-none focus:underline" : ""}
              >
                {content.whyChooseUsSection?.description}
              </span>
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
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  <span
                    contentEditable={cmsMode}
                    suppressContentEditableWarning={cmsMode}
                    onInput={(e) => editFeaturedPros({ eyebrow: e.currentTarget.textContent ?? "" })}
                    className={cmsMode ? "outline-none focus:underline" : ""}
                  >
                    {content.featuredProsSection?.eyebrow}
                  </span>
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  <span
                    contentEditable={cmsMode}
                    suppressContentEditableWarning={cmsMode}
                    onInput={(e) => editFeaturedPros({ title: e.currentTarget.textContent ?? "" })}
                    className={cmsMode ? "outline-none focus:underline" : ""}
                  >
                    {content.featuredProsSection?.title}
                  </span>
                </h2>
              </div>
              {cmsMode ? (
                <div className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 cursor-text hover:underline">
                  <span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onInput={(e) => editFeaturedPros({ ctaText: e.currentTarget.textContent ?? "" })}
                    className="outline-none"
                  >
                    {content.featuredProsSection?.ctaText}
                  </span>
                  <ArrowRight className="h-4 w-4 pointer-events-none" />
                </div>
              ) : (
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                >
                  {content.featuredProsSection?.ctaText} <ArrowRight className="h-4 w-4" />
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
                  <Link
                    key={pro.id}
                    href="/services"
                    className="block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft hover:shadow-md transition hover:border-blue-400 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`grid h-12 w-12 place-items-center rounded-full text-base font-bold ${pro.bgClass}`}>
                        {pro.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{pro.name}</p>
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
                  </Link>
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
                    <span
                      contentEditable={cmsMode}
                      suppressContentEditableWarning={cmsMode}
                      onInput={(e) => editClientCta({ badge: e.currentTarget.textContent ?? "" })}
                      className={cmsMode ? "outline-none focus:underline" : ""}
                    >
                      {content.ctaDualBanner?.client.badge}
                    </span>
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">
                    <span
                      contentEditable={cmsMode}
                      suppressContentEditableWarning={cmsMode}
                      onInput={(e) => editClientCta({ title: e.currentTarget.textContent ?? "" })}
                      className={cmsMode ? "outline-none focus:underline" : ""}
                    >
                      {content.ctaDualBanner?.client.title}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    <span
                      contentEditable={cmsMode}
                      suppressContentEditableWarning={cmsMode}
                      onInput={(e) => editClientCta({ description: e.currentTarget.textContent ?? "" })}
                      className={cmsMode ? "outline-none focus:underline" : ""}
                    >
                      {content.ctaDualBanner?.client.description}
                    </span>
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {cmsMode ? (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-soft cursor-text hover:ring-2 hover:ring-blue-400">
                      <Briefcase className="h-4 w-4 pointer-events-none" />
                      <span
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onInput={(e) => editClientCta({ primaryCta: e.currentTarget.textContent ?? "" })}
                        className="outline-none"
                      >
                        {content.ctaDualBanner?.client.primaryCta}
                      </span>
                    </div>
                  ) : (
                    <Link
                      href="/post-job"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-blue-700 transition"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>{content.ctaDualBanner?.client.primaryCta}</span>
                    </Link>
                  )}

                  {cmsMode ? (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 cursor-text hover:text-blue-600">
                      <span
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onInput={(e) => editClientCta({ secondaryCta: e.currentTarget.textContent ?? "" })}
                        className="outline-none"
                      >
                        {content.ctaDualBanner?.client.secondaryCta}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                    </div>
                  ) : (
                    <Link
                      href="/for-clients"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
                    >
                      <span>{content.ctaDualBanner?.client.secondaryCta}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* For Professionals CTA */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft flex flex-col justify-between">
                <div>
                  <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <span
                      contentEditable={cmsMode}
                      suppressContentEditableWarning={cmsMode}
                      onInput={(e) => editProCta({ badge: e.currentTarget.textContent ?? "" })}
                      className={cmsMode ? "outline-none focus:underline" : ""}
                    >
                      {content.ctaDualBanner?.pro.badge}
                    </span>
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">
                    <span
                      contentEditable={cmsMode}
                      suppressContentEditableWarning={cmsMode}
                      onInput={(e) => editProCta({ title: e.currentTarget.textContent ?? "" })}
                      className={cmsMode ? "outline-none focus:underline" : ""}
                    >
                      {content.ctaDualBanner?.pro.title}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    <span
                      contentEditable={cmsMode}
                      suppressContentEditableWarning={cmsMode}
                      onInput={(e) => editProCta({ description: e.currentTarget.textContent ?? "" })}
                      className={cmsMode ? "outline-none focus:underline" : ""}
                    >
                      {content.ctaDualBanner?.pro.description}
                    </span>
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {cmsMode ? (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-soft cursor-text hover:ring-2 hover:ring-blue-400">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 pointer-events-none" />
                      <span
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onInput={(e) => editProCta({ primaryCta: e.currentTarget.textContent ?? "" })}
                        className="outline-none"
                      >
                        {content.ctaDualBanner?.pro.primaryCta}
                      </span>
                    </div>
                  ) : (
                    <Link
                      href="/signup?role=PROFESSIONAL"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-slate-800 transition"
                    >
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>{content.ctaDualBanner?.pro.primaryCta}</span>
                    </Link>
                  )}

                  {cmsMode ? (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 cursor-text hover:text-blue-600">
                      <span
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onInput={(e) => editProCta({ secondaryCta: e.currentTarget.textContent ?? "" })}
                        className="outline-none"
                      >
                        {content.ctaDualBanner?.pro.secondaryCta}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                    </div>
                  ) : (
                    <Link
                      href="/for-professionals"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
                    >
                      <span>{content.ctaDualBanner?.pro.secondaryCta}</span>
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
    award: Award,
    wallet: Wallet,
    clock: Clock,
    trend: TrendingUp,
    check: Check,
    star: Star,
    mail: Mail,
    phone: Phone,
    help: HelpCircle,
    building: Building2,
    factory: Factory,
    home: Home,
    heart: HeartPulse,
    graduation: GraduationCap,
    sparkles: Sparkles,
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
      className={`relative rounded-2xl border border-slate-200/80 bg-white p-8 shadow-soft hover:shadow-md transition flex flex-col justify-between ${
        cmsMode ? "cursor-grab active:cursor-grabbing hover:border-blue-300" : ""
      } ${selected ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-white" : ""} ${
        drag?.isDragging ? "z-10 scale-[1.02] opacity-70 shadow-2xl" : ""
      }`}
    >
      <div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold text-slate-900" {...editable("title")}>
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500" {...editable("description")}>
          {feature.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3">
        {cmsMode ? (
          <div
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition cursor-text ring-1 ring-blue-200"
            title="Click text to edit button name"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <span
              contentEditable={true}
              suppressContentEditableWarning={true}
              onInput={(e) => onChange({ buttonText: e.currentTarget.textContent ?? "" })}
              className="outline-none"
            >
              {feature.buttonText || "Learn more"}
            </span>
            <ArrowRight className="h-3 w-3 pointer-events-none" />
          </div>
        ) : (
          <Link
            href={feature.buttonLink || "/services"}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
          >
            <span>{feature.buttonText || "Learn more"}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {cmsMode && selected && (
        <div
          className="absolute -top-3 right-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs shadow-lg z-20"
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
          <label className="text-slate-500 font-medium">
            Icon{" "}
            <select
              value={feature.icon}
              onPointerDown={(event) => event.stopPropagation()}
              onChange={(event) => onChange({ icon: event.target.value })}
              className="bg-white text-slate-900 border border-slate-200 rounded px-1 py-0.5"
            >
              <option value="shield">Shield</option>
              <option value="briefcase">Briefcase</option>
              <option value="users">Users</option>
              <option value="map">Map</option>
              <option value="search">Search</option>
              <option value="wallet">Wallet</option>
              <option value="check">Check</option>
              <option value="star">Star</option>
              <option value="clock">Clock</option>
              <option value="trend">Trend</option>
              <option value="message">Message</option>
              <option value="mail">Mail</option>
              <option value="phone">Phone</option>
              <option value="help">Help</option>
              <option value="building">Building</option>
              <option value="factory">Factory</option>
              <option value="home">Home</option>
              <option value="heart">Heart</option>
              <option value="graduation">Education</option>
              <option value="sparkles">Sparkles</option>
              <option value="arrow">Arrow</option>
            </select>
          </label>
          <button type="button" onClick={onDelete} className="text-red-600 font-bold hover:underline">
            Delete
          </button>
          <button type="button" onClick={onDuplicate} className="text-blue-600 font-bold hover:underline">
            Duplicate
          </button>
        </div>
      )}
    </div>
  );
}
