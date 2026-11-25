"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";
import { moveItem } from "@/lib/move-item";
import type { DragHandle } from "@/components/cms/CmsSortable";
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
import { Button } from "@/components/ui/button";
import { capitalizeFirst, capitalizeWords } from "@/lib/utils";
import {
  defaultProfessionalHomeContent,
  type HomeContent,
} from "@/lib/home-cms-shared";
import { CmsPageProvider, CmsText, type PageTextsMap } from "@/components/cms/CmsText";

type HomeJob = {
  id: number;
  title: string | null;
  category: string | null;
  description: string | null;
  locationAddress: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  hourlyRate: number | null;
  timingType: "HOURLY" | string;
  clientName: string;
};

const MASTER_CATEGORIES = [
  {
    title: "Residential",
    description: "Electricians, plumbers, cleaners, painters, carpenters, tutors and home care.",
    icon: Home,
    href: "/professional/my-jobs?tab=find",
  },
  {
    title: "Commercial",
    description: "Office fit-outs, facility upkeep, photography, marketing, accounting and legal help.",
    icon: Building2,
    href: "/professional/my-jobs?tab=find",
  },
  {
    title: "Industrial",
    description: "Machinery maintenance, industrial wiring, welding, safety audits and logistics.",
    icon: Factory,
    href: "/professional/my-jobs?tab=find",
  },
  {
    title: "Health Care",
    description: "Nurses, caregivers, physiotherapists, therapists, medical technicians and wellness support.",
    icon: HeartPulse,
    href: "/professional/my-jobs?tab=find",
  },
  {
    title: "Personal Care & Home Services",
    description: "Salon and grooming, spa and massage, beauty, fitness trainers, laundry and home help.",
    icon: Sparkles,
    href: "/professional/my-jobs?tab=find",
  },
  {
    title: "Education",
    description: "Tutors, coaches, language teachers, test prep, skill training and online courses.",
    icon: GraduationCap,
    href: "/professional/my-jobs?tab=find",
  },
];

const FALLBACK_FEATURED_JOBS: HomeJob[] = [
  {
    id: 2001,
    title: "3BHK Complete Interior Electrical Upgrade",
    category: "Electrician",
    description: "Full MCB panel upgrade, concealed wiring check, and modular switch installation.",
    locationAddress: "Mumbai, Maharashtra",
    budgetMin: 12000,
    budgetMax: 18000,
    hourlyRate: null,
    timingType: "FIXED",
    clientName: "Rohan Verma",
  },
  {
    id: 2002,
    title: "SaaS Marketing Website & UI Redesign",
    category: "UI/UX & Web Design",
    description: "Design and build responsive landing pages with clean component architecture.",
    locationAddress: "Bengaluru, Karnataka",
    budgetMin: 25000,
    budgetMax: 45000,
    hourlyRate: null,
    timingType: "FIXED",
    clientName: "Ananya Nair",
  },
  {
    id: 2003,
    title: "Monthly Commercial HVAC Inspection",
    category: "HVAC Technician",
    description: "Scheduled preventive servicing and duct airflow check for corporate office floor.",
    locationAddress: "Pune, Maharashtra",
    budgetMin: null,
    budgetMax: null,
    hourlyRate: 850,
    timingType: "HOURLY",
    clientName: "Crest Facilities",
  },
  {
    id: 2004,
    title: "Home Physiotherapy Recovery Plan",
    category: "Physiotherapist",
    description: "Three weekly post-operative mobility sessions at residence in South Delhi.",
    locationAddress: "New Delhi, Delhi",
    budgetMin: 6000,
    budgetMax: 9000,
    hourlyRate: null,
    timingType: "FIXED",
    clientName: "Meera Kapoor",
  },
];

// Drag-and-drop is CMS-only, so public visitors never download @dnd-kit.
const SortableBoard = dynamic(
  () => import("@/components/cms/CmsSortable").then((m) => m.SortableBoard),
  { ssr: false },
);
const SortableItem = dynamic(
  () => import("@/components/cms/CmsSortable").then((m) => m.SortableItem),
  { ssr: false },
);

/**
 * Ref-managed contentEditable span that avoids cursor jumps while typing in CMS mode.
 */
function EditableSpan({
  value,
  cmsMode,
  onChange,
  className = "",
  stopPointer = false,
}: {
  value: string;
  cmsMode: boolean;
  onChange: (nextValue: string) => void;
  className?: string;
  stopPointer?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const focusedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || focusedRef.current) return;
    if (el.textContent !== value) {
      el.textContent = value;
    }
  }, [value]);

  if (!cmsMode) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span
      ref={(node) => {
        ref.current = node;
        if (node && !focusedRef.current && node.textContent !== value) {
          node.textContent = value;
        }
      }}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onFocus={() => {
        focusedRef.current = true;
      }}
      onBlur={(e) => {
        focusedRef.current = false;
        const next = e.currentTarget.textContent ?? "";
        if (next !== value) onChange(next);
      }}
      onPointerDown={stopPointer ? (e) => e.stopPropagation() : undefined}
      onInput={(e) => onChange(e.currentTarget.textContent ?? "")}
      className={`outline-none focus:underline focus:decoration-blue-500/60 cursor-text ${className}`.trim()}
    />
  );
}

export default function ProfessionalHome({
  homeContent,
  cmsMode = false,
  onHomeChange,
  pageTexts,
  onTextChange,
  selectedFeatureId,
  onFeatureSelect,
  onFeatureDelete,
  onFeatureDuplicate,
}: {
  homeContent?: HomeContent;
  cmsMode?: boolean;
  onHomeChange?: (content: HomeContent) => void;
  pageTexts?: PageTextsMap;
  onTextChange?: (id: string, value: string) => void;
  selectedFeatureId?: string | null;
  onFeatureSelect?: (id: string) => void;
  onFeatureDelete?: (id: string) => void;
  onFeatureDuplicate?: (id: string) => void;
}) {
  const [jobs, setJobs] = useState<HomeJob[]>([]);
  const [loading, setLoading] = useState(!cmsMode);
  const [failed, setFailed] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

  const content: HomeContent = {
    hero: {
      eyebrow: homeContent?.hero?.eyebrow ?? defaultProfessionalHomeContent.hero.eyebrow,
      title: homeContent?.hero?.title ?? defaultProfessionalHomeContent.hero.title,
      description:
        homeContent?.hero?.description ?? defaultProfessionalHomeContent.hero.description,
      primaryCta: homeContent?.hero?.primaryCta ?? defaultProfessionalHomeContent.hero.primaryCta,
      secondaryCta:
        homeContent?.hero?.secondaryCta ?? defaultProfessionalHomeContent.hero.secondaryCta,
    },
    heroShowcase: {
      badge:
        homeContent?.heroShowcase?.badge ?? defaultProfessionalHomeContent.heroShowcase!.badge,
      title:
        homeContent?.heroShowcase?.title ?? defaultProfessionalHomeContent.heroShowcase!.title,
      description:
        homeContent?.heroShowcase?.description ??
        defaultProfessionalHomeContent.heroShowcase!.description,
      metrics:
        homeContent?.heroShowcase?.metrics ?? defaultProfessionalHomeContent.heroShowcase!.metrics,
      ctaText:
        homeContent?.heroShowcase?.ctaText ?? defaultProfessionalHomeContent.heroShowcase!.ctaText,
    },
    categoriesSection: {
      eyebrow:
        homeContent?.categoriesSection?.eyebrow ??
        defaultProfessionalHomeContent.categoriesSection!.eyebrow,
      title:
        homeContent?.categoriesSection?.title ??
        defaultProfessionalHomeContent.categoriesSection!.title,
      description:
        homeContent?.categoriesSection?.description ??
        defaultProfessionalHomeContent.categoriesSection!.description,
      items:
        homeContent?.categoriesSection?.items ??
        defaultProfessionalHomeContent.categoriesSection!.items,
    },
    whyChooseUsSection: {
      eyebrow:
        homeContent?.whyChooseUsSection?.eyebrow ??
        defaultProfessionalHomeContent.whyChooseUsSection!.eyebrow,
      title:
        homeContent?.whyChooseUsSection?.title ??
        defaultProfessionalHomeContent.whyChooseUsSection!.title,
      description:
        homeContent?.whyChooseUsSection?.description ??
        defaultProfessionalHomeContent.whyChooseUsSection!.description,
    },
    features:
      homeContent?.features && homeContent.features.length > 0
        ? homeContent.features
        : defaultProfessionalHomeContent.features,
    featuredProsSection: {
      eyebrow:
        homeContent?.featuredProsSection?.eyebrow ??
        defaultProfessionalHomeContent.featuredProsSection!.eyebrow,
      title:
        homeContent?.featuredProsSection?.title ??
        defaultProfessionalHomeContent.featuredProsSection!.title,
      ctaText:
        homeContent?.featuredProsSection?.ctaText ??
        defaultProfessionalHomeContent.featuredProsSection!.ctaText,
    },
    ctaDualBanner: {
      client: {
        badge:
          homeContent?.ctaDualBanner?.client?.badge ??
          defaultProfessionalHomeContent.ctaDualBanner!.client.badge,
        title:
          homeContent?.ctaDualBanner?.client?.title ??
          defaultProfessionalHomeContent.ctaDualBanner!.client.title,
        description:
          homeContent?.ctaDualBanner?.client?.description ??
          defaultProfessionalHomeContent.ctaDualBanner!.client.description,
        primaryCta:
          homeContent?.ctaDualBanner?.client?.primaryCta ??
          defaultProfessionalHomeContent.ctaDualBanner!.client.primaryCta,
        secondaryCta:
          homeContent?.ctaDualBanner?.client?.secondaryCta ??
          defaultProfessionalHomeContent.ctaDualBanner!.client.secondaryCta,
      },
      pro: {
        badge:
          homeContent?.ctaDualBanner?.pro?.badge ??
          defaultProfessionalHomeContent.ctaDualBanner!.pro.badge,
        title:
          homeContent?.ctaDualBanner?.pro?.title ??
          defaultProfessionalHomeContent.ctaDualBanner!.pro.title,
        description:
          homeContent?.ctaDualBanner?.pro?.description ??
          defaultProfessionalHomeContent.ctaDualBanner!.pro.description,
        primaryCta:
          homeContent?.ctaDualBanner?.pro?.primaryCta ??
          defaultProfessionalHomeContent.ctaDualBanner!.pro.primaryCta,
        secondaryCta:
          homeContent?.ctaDualBanner?.pro?.secondaryCta ??
          defaultProfessionalHomeContent.ctaDualBanner!.pro.secondaryCta,
      },
    },
  };

  const editHero = (patch: Partial<HomeContent["hero"]>) =>
    onHomeChange?.({ ...content, hero: { ...content.hero, ...patch } });

  const editShowcase = (patch: Partial<NonNullable<HomeContent["heroShowcase"]>>) =>
    onHomeChange?.({ ...content, heroShowcase: { ...content.heroShowcase!, ...patch } });

  const editCategories = (patch: Partial<NonNullable<HomeContent["categoriesSection"]>>) =>
    onHomeChange?.({ ...content, categoriesSection: { ...content.categoriesSection!, ...patch } });

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

  const editWhyChooseUs = (patch: Partial<NonNullable<HomeContent["whyChooseUsSection"]>>) =>
    onHomeChange?.({
      ...content,
      whyChooseUsSection: { ...content.whyChooseUsSection!, ...patch },
    });

  const editFeaturedJobs = (patch: Partial<NonNullable<HomeContent["featuredProsSection"]>>) =>
    onHomeChange?.({
      ...content,
      featuredProsSection: { ...content.featuredProsSection!, ...patch },
    });

  const editBannerPrimary = (
    patch: Partial<NonNullable<NonNullable<HomeContent["ctaDualBanner"]>["client"]>>,
  ) =>
    onHomeChange?.({
      ...content,
      ctaDualBanner: {
        client: { ...content.ctaDualBanner!.client, ...patch },
        pro: { ...content.ctaDualBanner!.pro },
      },
    });

  const editBannerSecondary = (
    patch: Partial<NonNullable<NonNullable<HomeContent["ctaDualBanner"]>["pro"]>>,
  ) =>
    onHomeChange?.({
      ...content,
      ctaDualBanner: {
        client: { ...content.ctaDualBanner!.client },
        pro: { ...content.ctaDualBanner!.pro, ...patch },
      },
    });

  const loadJobs = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/portal/professional-jobs", { cache: "no-store" });
      if (response.ok) {
        const data = (await response.json()) as { openJobs: HomeJob[] };
        setJobs(Array.isArray(data.openJobs) ? data.openJobs : []);
        setFailed(false);
      } else {
        const pubResponse = await fetch("/api/v1/marketplace/jobs", { cache: "no-store" });
        if (pubResponse.ok) {
          const pubJobs = (await pubResponse.json()) as HomeJob[];
          setJobs(Array.isArray(pubJobs) ? pubJobs : []);
          setFailed(false);
        } else {
          setFailed(true);
        }
      }
    } catch {
      try {
        const pubResponse = await fetch("/api/v1/marketplace/jobs", { cache: "no-store" });
        if (pubResponse.ok) {
          const pubJobs = (await pubResponse.json()) as HomeJob[];
          setJobs(Array.isArray(pubJobs) ? pubJobs : []);
          setFailed(false);
        } else {
          setFailed(true);
        }
      } catch {
        setFailed(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cmsMode) {
      setLoading(false);
      return;
    }
    void loadJobs();

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const socket = io(origin, {
      path: "/api/realtime",
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const onJobEvent = () => {
      void loadJobs();
    };

    socket.on("job:posted", onJobEvent);
    socket.on("job:created", onJobEvent);
    socket.on("notification:new", onJobEvent);

    return () => {
      socket.off("job:posted", onJobEvent);
      socket.off("job:created", onJobEvent);
      socket.off("notification:new", onJobEvent);
      socket.disconnect();
    };
  }, [cmsMode, loadJobs]);

  const renderFeature = (
    feature: HomeContent["features"][number],
    drag?: DragHandle,
    index?: number,
  ) => {
    const idx =
      index !== undefined ? index : content.features.findIndex((f) => f.id === feature.id);
    return (
      <ProHomeFeature
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
    <CmsPageProvider cmsMode={cmsMode} pageTexts={pageTexts} onTextChange={onTextChange}>
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <main className="flex-grow">
          {/* ================= 1. HERO SECTION WITH OFFICIAL WEBSITE LOGO SHOWCASE ================= */}
          <section className="gradient-hero border-b border-slate-200/60">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  <EditableSpan
                    cmsMode={cmsMode}
                    value={content.hero.eyebrow}
                    onChange={(eyebrow) => editHero({ eyebrow })}
                  />
                </p>

                <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl sm:leading-[1.15]">
                  <EditableSpan
                    cmsMode={cmsMode}
                    value={content.hero.title}
                    onChange={(title) => editHero({ title })}
                  />
                </h1>

                <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
                  <EditableSpan
                    cmsMode={cmsMode}
                    value={content.hero.description}
                    onChange={(description) => editHero({ description })}
                  />
                </p>

                <div className="mt-8 flex flex-wrap gap-3.5">
                  {cmsMode ? (
                    <div
                      className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground shadow-soft transition cursor-text ring-1 ring-white/20 hover:ring-2 hover:ring-cta"
                      title="Click text to edit button"
                    >
                      <Search className="h-4 w-4 shrink-0 pointer-events-none" />
                      <EditableSpan
                        cmsMode={true}
                        value={content.hero.primaryCta}
                        onChange={(primaryCta) => editHero({ primaryCta })}
                      />
                    </div>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground shadow-soft hover:bg-cta/90 transition"
                    >
                      <Link href="/professional/my-jobs?tab=find">
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
                      <EditableSpan
                        cmsMode={true}
                        value={content.hero.secondaryCta}
                        onChange={(secondaryCta) => editHero({ secondaryCta })}
                      />
                    </div>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
                    >
                      <Link href="/professional/dashboard">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>{content.hero.secondaryCta}</span>
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Quick Trust Bar Under CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <CmsText id="trust.badge1" defaultText="Verified Client Requirements" />
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <CmsText id="trust.badge2" defaultText="100% Escrow Protection" />
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <CmsText id="trust.badge3" defaultText="Zero Platform Fees" />
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
                    {cmsMode ? (
                      <div
                        title="Klick-Pro Professional Workspace"
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
                        href="/professional-home"
                        title="Klick-Pro Professional Workspace"
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
                        <EditableSpan
                          cmsMode={cmsMode}
                          value={content.heroShowcase?.badge ?? ""}
                          onChange={(badge) => editShowcase({ badge })}
                        />
                      </div>
                      <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-tight text-slate-900">
                        <EditableSpan
                          cmsMode={cmsMode}
                          value={content.heroShowcase?.title ?? ""}
                          onChange={(title) => editShowcase({ title })}
                        />
                      </h2>
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
                        <EditableSpan
                          cmsMode={cmsMode}
                          value={content.heroShowcase?.description ?? ""}
                          onChange={(description) => editShowcase({ description })}
                        />
                      </p>
                    </div>

                    {/* 3 Confidence Metrics */}
                    <div className="mt-6 grid w-full grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-left">
                      {(
                        content.heroShowcase?.metrics ||
                        defaultProfessionalHomeContent.heroShowcase!.metrics
                      ).map((m, idx) => (
                        <div key={idx} className="rounded-xl bg-slate-50 p-2.5">
                          <p className="text-[10px] font-bold uppercase text-slate-600">
                            <EditableSpan
                              cmsMode={cmsMode}
                              value={m.label}
                              onChange={(label) => {
                                const nextMetrics = [
                                  ...(content.heroShowcase?.metrics ||
                                    defaultProfessionalHomeContent.heroShowcase!.metrics),
                                ];
                                const current = nextMetrics[idx] ?? { label: "", value: "" };
                                nextMetrics[idx] = { label, value: current.value };
                                editShowcase({ metrics: nextMetrics });
                              }}
                            />
                          </p>
                          <p
                            className={`text-xs font-bold mt-0.5 ${idx === 1 ? "text-emerald-700" : "text-slate-900"}`}
                          >
                            <EditableSpan
                              cmsMode={cmsMode}
                              value={m.value}
                              onChange={(value) => {
                                const nextMetrics = [
                                  ...(content.heroShowcase?.metrics ||
                                    defaultProfessionalHomeContent.heroShowcase!.metrics),
                                ];
                                const current = nextMetrics[idx] ?? { label: "", value: "" };
                                nextMetrics[idx] = { label: current.label, value };
                                editShowcase({ metrics: nextMetrics });
                              }}
                            />
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Direct Link to Find Projects */}
                    <div className="mt-5 w-full">
                      {cmsMode ? (
                        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-2.5 text-xs font-semibold text-cta-foreground shadow-sm cursor-text hover:ring-2 hover:ring-cta/60">
                          <EditableSpan
                            cmsMode={true}
                            value={content.heroShowcase?.ctaText ?? ""}
                            onChange={(ctaText) => editShowcase({ ctaText })}
                          />
                          <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                        </div>
                      ) : (
                        <Link
                          href="/professional/my-jobs?tab=find"
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-2.5 text-xs font-semibold text-cta-foreground transition hover:bg-cta/90 shadow-sm"
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
                <EditableSpan
                  cmsMode={cmsMode}
                  value={content.categoriesSection?.eyebrow ?? ""}
                  onChange={(eyebrow) => editCategories({ eyebrow })}
                />
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                <EditableSpan
                  cmsMode={cmsMode}
                  value={content.categoriesSection?.title ?? ""}
                  onChange={(title) => editCategories({ title })}
                />
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-500 text-sm sm:text-base">
                <EditableSpan
                  cmsMode={cmsMode}
                  value={content.categoriesSection?.description ?? ""}
                  onChange={(description) => editCategories({ description })}
                />
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(
                content.categoriesSection?.items ||
                defaultProfessionalHomeContent.categoriesSection!.items!
              ).map((cat, idx) => {
                const fallbackCat = MASTER_CATEGORIES[idx] ?? MASTER_CATEGORIES[0]!;
                const Icon = fallbackCat.icon;
                const isSelected = selectedCategoryIndex === idx;
                const itemsList =
                  content.categoriesSection?.items ||
                  defaultProfessionalHomeContent.categoriesSection!.items!;
                return cmsMode ? (
                  <div
                    key={idx}
                    onClick={() => setSelectedCategoryIndex(idx)}
                    className={`relative group rounded-2xl border border-slate-200/80 bg-white p-7 shadow-soft transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-white"
                        : "hover:border-blue-300"
                    }`}
                  >
                    <div>
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-105">
                        <Icon className="h-6 w-6 pointer-events-none" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                        <EditableSpan
                          cmsMode={true}
                          stopPointer={true}
                          value={cat.title}
                          onChange={(title) => editCategoryItem(idx, { title })}
                        />
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        <EditableSpan
                          cmsMode={true}
                          stopPointer={true}
                          value={cat.description}
                          onChange={(description) => editCategoryItem(idx, { description })}
                        />
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition cursor-text ring-1 ring-blue-200"
                        title="Click text to edit button name"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EditableSpan
                          cmsMode={true}
                          value={cat.ctaText || `Find ${cat.title} Jobs`}
                          onChange={(ctaText) => editCategoryItem(idx, { ctaText })}
                        />
                        <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Floating Action Toolbar on Selected Category */}
                    {isSelected && (
                      <div
                        data-cms-toolbar="true"
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
                    className="group rounded-2xl border border-slate-200/80 bg-white p-7 shadow-soft hover:shadow-md transition duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-105">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                        {cat.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{cat.description}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:underline">
                      <span>{cat.ctaText || `Find ${cat.title} Jobs`}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ================= 3. "WHY PROFESSIONALS CHOOSE US" 6-CARD GRID ================= */}
          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                <EditableSpan
                  cmsMode={cmsMode}
                  value={content.whyChooseUsSection?.eyebrow ?? ""}
                  onChange={(eyebrow) => editWhyChooseUs({ eyebrow })}
                />
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                <EditableSpan
                  cmsMode={cmsMode}
                  value={content.whyChooseUsSection?.title ?? ""}
                  onChange={(title) => editWhyChooseUs({ title })}
                />
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-500 text-sm sm:text-base">
                <EditableSpan
                  cmsMode={cmsMode}
                  value={content.whyChooseUsSection?.description ?? ""}
                  onChange={(description) => editWhyChooseUs({ description })}
                />
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

          {/* ================= 4. FEATURED OPEN JOBS (SAME UI, PROFESSIONAL DATA & LINKS) ================= */}
          <section className="bg-white border-t border-slate-200/80 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    <EditableSpan
                      cmsMode={cmsMode}
                      value={content.featuredProsSection?.eyebrow ?? ""}
                      onChange={(eyebrow) => editFeaturedJobs({ eyebrow })}
                    />
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    <EditableSpan
                      cmsMode={cmsMode}
                      value={content.featuredProsSection?.title ?? ""}
                      onChange={(title) => editFeaturedJobs({ title })}
                    />
                  </h2>
                </div>
                {cmsMode ? (
                  <div className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 cursor-text hover:underline">
                    <EditableSpan
                      cmsMode={true}
                      value={content.featuredProsSection?.ctaText ?? ""}
                      onChange={(ctaText) => editFeaturedJobs({ ctaText })}
                    />
                    <ArrowRight className="h-4 w-4 pointer-events-none" />
                  </div>
                ) : (
                  <Link
                    href="/professional/my-jobs?tab=find"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    <span>{content.featuredProsSection?.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

              {/* CMS Mode Preview Grid */}
              {cmsMode ? (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {FALLBACK_FEATURED_JOBS.map((job) => (
                    <div
                      key={job.id}
                      className="flex min-h-60 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                        {capitalizeWords(job.category ?? "General")}
                      </p>
                      <h3 className="mt-2 line-clamp-2 font-display text-base font-bold text-slate-900">
                        {capitalizeWords(job.title ?? "Untitled Job")}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                        {capitalizeFirst(job.description)}
                      </p>
                      <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {capitalizeWords(job.locationAddress) || "Remote"}
                      </p>
                      <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-600">Budget</p>
                          <p className="text-base font-bold text-slate-900">
                            {job.timingType === "HOURLY"
                              ? `₹${job.hourlyRate ?? 0}/hr`
                              : `₹${job.budgetMin ?? 0} – ₹${job.budgetMax ?? 0}`}
                          </p>
                        </div>
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          <CmsText id="featured.viewJob" defaultText="View job" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Live Loading Skeleton */}
              {!cmsMode && loading && (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              )}

              {/* Live Database Open Jobs */}
              {!cmsMode && !loading && !failed && (
                <div
                  data-db-section="jobs"
                  className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {jobs.slice(0, 4).map((job) => (
                    <Link
                      key={job.id}
                      href={`/professional/job/${job.id}`}
                      className="group flex min-h-60 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft hover:shadow-md hover:border-blue-400 transition"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                        {capitalizeWords(job.category ?? "General")}
                      </p>
                      <h3 className="mt-2 line-clamp-2 font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {capitalizeWords(job.title ?? "Untitled Job")}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                        {capitalizeFirst(job.description)}
                      </p>
                      <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {capitalizeWords(job.locationAddress) || "Remote"}
                      </p>
                      <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-600">Budget</p>
                          <p className="text-base font-bold text-slate-900">
                            {job.timingType === "HOURLY"
                              ? `₹${job.hourlyRate ?? 0}/hr`
                              : `₹${job.budgetMin ?? 0} – ₹${job.budgetMax ?? 0}`}
                          </p>
                        </div>
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 group-hover:bg-blue-100 transition">
                          <CmsText id="featured.viewJob" defaultText="View job" />
                        </span>
                      </div>
                    </Link>
                  ))}
                  {!jobs.length && (
                    <p className="col-span-full rounded-2xl border border-slate-200/80 bg-slate-50 p-6 text-sm text-slate-600">
                      <CmsText id="featured.empty" defaultText="No open jobs are available right now." />
                    </p>
                  )}
                </div>
              )}

              {!cmsMode && failed && (
                <p className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50 p-6 text-sm text-slate-600">
                  <CmsText id="featured.error" defaultText="Could not load jobs right now." />
                </p>
              )}
            </div>
          </section>

          {/* ================= 5. DUAL-TRACK CALL TO ACTION BANNER ================= */}
          <section className="border-t border-slate-200/80 bg-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Find Open Requirements Card */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft flex flex-col justify-between transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <div>
                    <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      <EditableSpan
                        cmsMode={cmsMode}
                        value={content.ctaDualBanner?.client.badge ?? ""}
                        onChange={(badge) => editBannerPrimary({ badge })}
                      />
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">
                      <EditableSpan
                        cmsMode={cmsMode}
                        value={content.ctaDualBanner?.client.title ?? ""}
                        onChange={(title) => editBannerPrimary({ title })}
                      />
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      <EditableSpan
                        cmsMode={cmsMode}
                        value={content.ctaDualBanner?.client.description ?? ""}
                        onChange={(description) => editBannerPrimary({ description })}
                      />
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {cmsMode ? (
                      <div className="inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-2.5 text-xs font-semibold text-cta-foreground shadow-soft cursor-text hover:ring-2 hover:ring-cta/60">
                        <Search className="h-4 w-4 pointer-events-none" />
                        <EditableSpan
                          cmsMode={true}
                          value={content.ctaDualBanner?.client.primaryCta ?? ""}
                          onChange={(primaryCta) => editBannerPrimary({ primaryCta })}
                        />
                      </div>
                    ) : (
                      <Link
                        href="/professional/my-jobs?tab=find"
                        className="inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-2.5 text-xs font-semibold text-cta-foreground shadow-soft hover:bg-cta/90 transition"
                      >
                        <Search className="h-4 w-4" />
                        <span>{content.ctaDualBanner?.client.primaryCta}</span>
                      </Link>
                    )}

                    {cmsMode ? (
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 cursor-text hover:text-blue-600">
                        <EditableSpan
                          cmsMode={true}
                          value={content.ctaDualBanner?.client.secondaryCta ?? ""}
                          onChange={(secondaryCta) => editBannerPrimary({ secondaryCta })}
                        />
                        <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                      </div>
                    ) : (
                      <Link
                        href="/how-it-works"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
                      >
                        <span>{content.ctaDualBanner?.client.secondaryCta}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Manage Workspace Card */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft flex flex-col justify-between transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <div>
                    <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      <EditableSpan
                        cmsMode={cmsMode}
                        value={content.ctaDualBanner?.pro.badge ?? ""}
                        onChange={(badge) => editBannerSecondary({ badge })}
                      />
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">
                      <EditableSpan
                        cmsMode={cmsMode}
                        value={content.ctaDualBanner?.pro.title ?? ""}
                        onChange={(title) => editBannerSecondary({ title })}
                      />
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      <EditableSpan
                        cmsMode={cmsMode}
                        value={content.ctaDualBanner?.pro.description ?? ""}
                        onChange={(description) => editBannerSecondary({ description })}
                      />
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {cmsMode ? (
                      <div className="inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-2.5 text-xs font-semibold text-cta-foreground shadow-soft cursor-text hover:ring-2 hover:ring-cta/60">
                        <Briefcase className="h-4 w-4 text-white pointer-events-none" />
                        <EditableSpan
                          cmsMode={true}
                          value={content.ctaDualBanner?.pro.primaryCta ?? ""}
                          onChange={(primaryCta) => editBannerSecondary({ primaryCta })}
                        />
                      </div>
                    ) : (
                      <Link
                        href="/professional/dashboard"
                        className="inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-2.5 text-xs font-semibold text-cta-foreground shadow-soft hover:bg-cta/90 transition"
                      >
                        <Briefcase className="h-4 w-4 text-white" />
                        <span>{content.ctaDualBanner?.pro.primaryCta}</span>
                      </Link>
                    )}

                    {cmsMode ? (
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 cursor-text hover:text-blue-600">
                        <EditableSpan
                          cmsMode={true}
                          value={content.ctaDualBanner?.pro.secondaryCta ?? ""}
                          onChange={(secondaryCta) => editBannerSecondary({ secondaryCta })}
                        />
                        <ArrowRight className="h-3.5 w-3.5 pointer-events-none" />
                      </div>
                    ) : (
                      <Link
                        href="/professional/setup"
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
    </CmsPageProvider>
  );
}

function ProHomeFeature({
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
    checkCircle: CheckCircle2,
    star: Star,
    mail: Mail,
    phone: Phone,
    help: HelpCircle,
    message: MessageCircle,
    building: Building2,
    factory: Factory,
    home: Home,
    heart: HeartPulse,
    graduation: GraduationCap,
    sparkles: Sparkles,
  };
  const Icon = icons[feature.icon as keyof typeof icons] ?? ShieldCheck;

  return (
    <div
      ref={drag?.ref}
      style={drag?.style}
      {...(drag?.handleProps ?? {})}
      onClick={cmsMode ? onSelect : undefined}
      className={`relative rounded-2xl border border-slate-200/80 bg-white p-8 shadow-soft hover:shadow-md transition duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
        cmsMode ? "cursor-grab active:cursor-grabbing hover:border-blue-300" : ""
      } ${selected ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-white" : ""} ${
        drag?.isDragging ? "z-10 scale-[1.02] opacity-70 shadow-2xl" : ""
      }`}
    >
      <div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
          <EditableSpan
            cmsMode={cmsMode}
            stopPointer={true}
            value={feature.title}
            onChange={(title) => onChange({ title })}
          />
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          <EditableSpan
            cmsMode={cmsMode}
            stopPointer={true}
            value={feature.description}
            onChange={(description) => onChange({ description })}
          />
        </p>
      </div>

      {cmsMode && selected && (
        <div
          data-cms-toolbar="true"
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
              <option value="trend">Trend</option>
              <option value="shield">Shield</option>
              <option value="star">Star</option>
              <option value="briefcase">Briefcase</option>
              <option value="users">Users</option>
              <option value="message">Message</option>
              <option value="wallet">Wallet</option>
              <option value="map">Map</option>
              <option value="search">Search</option>
              <option value="check">Check</option>
              <option value="clock">Clock</option>
              <option value="award">Award</option>
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
