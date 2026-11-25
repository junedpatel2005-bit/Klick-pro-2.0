"use client";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckCircle2,
  ExternalLink,
  Eye,
  Globe,
  Italic,
  Laptop,
  Layers,
  Link as LinkIcon,
  List,
  ListOrdered,
  Plus,
  RemoveFormatting,
  Save,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Strikethrough,
  Tablet,
  Trash2,
  Underline,
  Wallet,
  Clock,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Landing from "@/routes/index";
import About from "@/routes/about";
import HowItWorks from "@/routes/how-it-works";
import { ServicesCatalog } from "@/components/ServicesCatalog";
import ForClients from "@/routes/for-clients";
import ForPros from "@/routes/for-professionals";
import Pricing from "@/routes/pricing";
import FAQ, { type FAQCategory } from "@/routes/faq";
import Contact from "@/routes/contact";
import ProfessionalHome from "@/routes/professional-home";
import MarketingVisualPage from "@/components/MarketingVisualPage";
import type { HomeContent, HomeFeature } from "@/lib/home-cms-shared";
import type { CompleteCategoryHierarchy } from "@/lib/queries/categories-hierarchy";
import type { PageTextsMap } from "@/components/cms/CmsText";
import type {
  MarketingPageContent,
  MarketingItem,
  MarketingPageId,
} from "@/lib/marketing-cms-shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type PageOption = {
  slug: string;
  title: string;
  href: string;
  isCustom: boolean;
};

const DEFAULT_PAGES: PageOption[] = [
  { slug: "home", title: "Home", href: "/", isCustom: false },
  { slug: "about", title: "About Us", href: "/about", isCustom: false },
  { slug: "how-it-works", title: "How It Works", href: "/how-it-works", isCustom: false },
  { slug: "services", title: "Services", href: "/services", isCustom: false },
  { slug: "for-clients", title: "For Clients", href: "/for-clients", isCustom: false },
  { slug: "for-professionals", title: "For Professionals", href: "/for-professionals", isCustom: false },
  { slug: "pricing", title: "Pricing", href: "/pricing", isCustom: false },
  { slug: "faq", title: "FAQ", href: "/faq", isCustom: false },
  { slug: "contact", title: "Contact", href: "/contact", isCustom: false },
  { slug: "professional-home", title: "Professional Home", href: "/professional-home", isCustom: false },
];

const fallbackHomeContent: HomeContent = {
  hero: {
    eyebrow: "VERIFIED MARKETPLACE PROFESSIONALS",
    title: "Find trusted professionals for work that matters.",
    description: "Post work, compare qualified professionals, and manage every project in one place.",
    primaryCta: "Browse professionals",
    secondaryCta: "Post a job",
  },
  features: [
    {
      id: "projects",
      title: "Project Management",
      description: "Track progress, communicate in real-time, and manage all projects in one centralized dashboard.",
      icon: "briefcase",
    },
    {
      id: "verified",
      title: "Verified Professionals",
      description: "All professionals are verified and vetted to ensure quality work and your peace of mind.",
      icon: "shield",
    },
    {
      id: "matching",
      title: "Expert Matching",
      description: "Get matched with professionals that best fit your project needs and budget requirements.",
      icon: "users",
    },
    {
      id: "escrow",
      title: "100% Milestone Escrow",
      description: "Funds are protected safely in escrow and released only when you approve the deliverables.",
      icon: "wallet",
    },
  ],
};

const fallbackMarketingContent: MarketingPageContent = {
  hero: {
    label: "VERIFIED SERVICES",
    title: "A simpler, safer way to get work done",
    description: "Connect with vetted professionals backed by secure milestone escrow protection.",
  },
  items: [
    {
      id: "item-1",
      title: "Verified Trust & Identity",
      description: "Every professional undergoes background screening and government credential verification.",
      icon: "shield",
    },
    {
      id: "item-2",
      title: "Guaranteed Milestone Escrow",
      description: "Payments are deposited safely in escrow before work begins and released upon your approval.",
      icon: "wallet",
    },
    {
      id: "item-3",
      title: "Fast Response & Turnaround",
      description: "Receive competitive proposals from top-rated professionals in your area within minutes.",
      icon: "clock",
    },
  ],
};

export default function CmsEditor({
  serviceHierarchy,
  faqCategories,
}: {
  serviceHierarchy?: CompleteCategoryHierarchy;
  faqCategories?: FAQCategory[];
} = {}) {
  const [pagesList, setPagesList] = useState<PageOption[]>(DEFAULT_PAGES);
  const [selectedSlug, setSelectedSlug] = useState<string>("home");
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "saved" | "error">("loading");
  const [dirty, setDirty] = useState<boolean>(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  // Content state for home vs marketing/custom & full-page texts
  const [homeContent, setHomeContent] = useState<HomeContent>(fallbackHomeContent);
  const [marketingContent, setMarketingContent] = useState<MarketingPageContent>(fallbackMarketingContent);
  const [pageTexts, setPageTexts] = useState<PageTextsMap>({});

  // Modals
  const [addBoxOpen, setAddBoxOpen] = useState(false);
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  // New Page form
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [creatingPage, setCreatingPage] = useState(false);

  // SEO state
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  // Load pages list on mount
  useEffect(() => {
    void fetch("/api/admin/cms?action=list", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { pages?: PageOption[] };
        if (Array.isArray(data.pages) && data.pages.length > 0) {
          setPagesList(data.pages);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch page content when selectedSlug changes
  useEffect(() => {
    setStatus("loading");
    setDirty(false);
    setSelectedBoxId(null);

    const activePage = pagesList.find((p) => p.slug === selectedSlug);
    const title = activePage?.title || selectedSlug;
    setMetaTitle(`${title} | Klick-Pro`);

    void fetch(`/api/admin/cms?page=${encodeURIComponent(selectedSlug)}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Load failed");
        const data = await res.json();

        if (selectedSlug === "home" || selectedSlug === "professional-home") {
          if (data.homeContent) {
            setHomeContent(data.homeContent);
          } else {
            const hero = data.hero || fallbackHomeContent.hero;
            const features = Array.isArray(data.boxes) && data.boxes.length > 0
              ? data.boxes
              : Array.isArray(data.features) && data.features.length > 0
                ? data.features
                : fallbackHomeContent.features;
            setHomeContent({ hero, features });
          }
          setPageTexts(data.pageTexts && typeof data.pageTexts === "object" ? data.pageTexts : {});
          setMetaDescription(data.hero?.description || "");
        } else {
          const hero = {
            label: data.hero?.eyebrow || data.hero?.label || "VERIFIED PLATFORM",
            title: data.hero?.title || `${title}`,
            description: data.hero?.description || "Explore verified services with escrow safeguards.",
          };
          const items: MarketingItem[] = Array.isArray(data.boxes) && data.boxes.length > 0
            ? data.boxes.map((b: { id: string; title: string; description: string; icon?: string; buttonText?: string; buttonLink?: string }) => ({
                id: b.id,
                title: b.title,
                description: b.description,
                icon: b.icon || "shield",
                buttonText: b.buttonText || "Learn more",
                buttonLink: b.buttonLink || "/services",
              }))
            : Array.isArray(data.items) && data.items.length > 0
              ? data.items.map((i: MarketingItem) => ({
                  ...i,
                  buttonText: i.buttonText || "Learn more",
                  buttonLink: i.buttonLink || "/services",
                }))
              : fallbackMarketingContent.items;
          const cta = data.cta || {
            title: "Get started today",
            primaryBtn: "Post a Job",
            primaryLink: "/post-job",
            secondaryBtn: "Become a Professional",
            secondaryLink: "/signup",
          };
          setMarketingContent({ hero, items, cta });
          setPageTexts(data.pageTexts && typeof data.pageTexts === "object" ? data.pageTexts : {});
          setMetaDescription(hero.description || "");
        }

        if (data.seo?.metaTitle) setMetaTitle(data.seo.metaTitle);
        if (data.seo?.metaDescription) setMetaDescription(data.seo.metaDescription);
        if (data.seo?.keywords) setMetaKeywords(data.seo.keywords);

        setStatus("saved");
      })
      .catch(() => {
        setStatus("ready");
      });
  }, [selectedSlug, pagesList]);

  // Save content to API
  const handleSave = async () => {
    setStatus("saving");
    try {
      let payload: Record<string, unknown>;

      if (selectedSlug === "home" || selectedSlug === "professional-home") {
        payload = {
          slug: selectedSlug,
          title: selectedSlug === "home" ? "Home" : "Professional Home",
          hero: homeContent.hero,
          boxes: homeContent.features,
          homeContent: homeContent,
          pageTexts,
          seo: {
            metaTitle,
            metaDescription,
            keywords: metaKeywords,
          },
        };
      } else {
        const activePage = pagesList.find((p) => p.slug === selectedSlug);
        const syncedHero = {
          eyebrow: pageTexts["hero.label"] ?? marketingContent.hero.label,
          title: pageTexts["hero.title"] ?? marketingContent.hero.title,
          description: pageTexts["hero.description"] ?? marketingContent.hero.description,
        };
        payload = {
          slug: selectedSlug,
          title: activePage?.title || selectedSlug,
          hero: syncedHero,
          boxes: marketingContent.items,
          pageTexts,
          cta: marketingContent.cta,
          seo: {
            metaTitle,
            metaDescription,
            keywords: metaKeywords,
          },
        };
      }

      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save request failed");
      setStatus("saved");
      setDirty(false);
      toast.success("Page published live to the website!");
    } catch {
      setStatus("error");
      toast.error("Unable to save changes. Please try again.");
    }
  };

  // Add Box to current page (without adding extra button or link defaults)
  const handleAddBox = (preset?: Partial<MarketingItem>) => {
    const newId = `box-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newTitle = preset?.title || "New Service Guarantee";
    const newDesc = preset?.description || "Click directly here to change this text.";
    const newIcon = preset?.icon || "shield";

    if (selectedSlug === "home" || selectedSlug === "professional-home") {
      const newFeature: HomeFeature = {
        id: newId,
        title: newTitle,
        description: newDesc,
        icon: newIcon,
      };
      setHomeContent({
        ...homeContent,
        features: [...homeContent.features, newFeature],
      });
    } else {
      const newItem: MarketingItem = {
        id: newId,
        title: newTitle,
        description: newDesc,
        icon: newIcon,
      };
      setMarketingContent({
        ...marketingContent,
        items: [...marketingContent.items, newItem],
      });
    }

    setSelectedBoxId(newId);
    setDirty(true);
    setAddBoxOpen(false);
    toast.success("Content box added!");
  };

  // Create new dynamic page
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      toast.error("Please enter a title and slug.");
      return;
    }
    setCreatingPage(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newPageTitle.trim(), slug: newPageSlug.trim() }),
      });
      const data = (await res.json()) as { success?: boolean; page?: { slug: string; title: string }; error?: string };
      if (!res.ok || !data.page) throw new Error(data.error || "Failed to create page");

      const created = data.page;
      const newOption: PageOption = {
        slug: created.slug,
        title: created.title,
        href: `/p/${created.slug}`,
        isCustom: true,
      };

      setPagesList((prev) => [...prev, newOption]);
      setSelectedSlug(created.slug);
      setNewPageOpen(false);
      setNewPageTitle("");
      setNewPageSlug("");
      toast.success(`Created dynamic page "${created.title}" successfully!`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create page");
    } finally {
      setCreatingPage(false);
    }
  };

  // Delete custom dynamic page
  const handleDeletePage = async () => {
    const activePage = pagesList.find((p) => p.slug === selectedSlug);
    if (!activePage?.isCustom) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${activePage.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/cms?slug=${encodeURIComponent(selectedSlug)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`Deleted page "${activePage.title}"`);
      setPagesList((prev) => prev.filter((p) => p.slug !== selectedSlug));
      setSelectedSlug("home");
    } catch {
      toast.error("Failed to delete page.");
    }
  };

  const activePage = pagesList.find((p) => p.slug === selectedSlug);
  const liveWebsiteUrl = activePage?.href || (activePage?.isCustom ? `/p/${selectedSlug}` : `/${selectedSlug}`);
  const supportsDynamicBoxes =
    selectedSlug === "home" || selectedSlug === "professional-home" || Boolean(activePage?.isCustom);

  const handlePageTextChange = (key: string, value: string) => {
    setPageTexts((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      {/* ================= TOP CMS HEADER CONTROLS ================= */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
              <Layers className="h-3.5 w-3.5" />
              Live Webpage Editor
            </span>
            <span className="text-xs font-medium text-slate-400">· Click text to edit &middot; Move boxes</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Webpage Editor
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Edit text directly, add/remove/move boxes, and publish changes straight to the website.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Page Picker (ZERO .html) */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Page:
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => {
                if (dirty && !window.confirm("You have unsaved changes. Discard and switch page?")) return;
                setSelectedSlug(e.target.value);
              }}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 shadow-2xs outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
            >
              {pagesList.map((p) => (
                <option key={p.slug} value={p.slug} className="text-slate-900">
                  {p.title} {p.isCustom ? "(Custom)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* New Dynamic Page Trigger */}
          <button
            type="button"
            onClick={() => setNewPageOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="Create a new dynamic CMS page"
          >
            <Plus className="h-4 w-4 text-blue-600" />
            <span>New Page</span>
          </button>

          {/* Add Box Modal Trigger (only on pages with dynamic box grids) */}
          {supportsDynamicBoxes && (
            <button
              type="button"
              onClick={() => setAddBoxOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-2xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Box</span>
            </button>
          )}

          {/* SEO Modal Trigger */}
          <button
            type="button"
            onClick={() => setSeoOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Globe className="h-4 w-4 text-blue-600" />
            <span>SEO &amp; Meta</span>
          </button>

          {/* View Live on Website */}
          <a
            href={liveWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="View this page live on the website in a new tab"
          >
            <Eye className="h-4 w-4 text-emerald-600" />
            <span>Live Website</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>

          {/* Delete Page button if custom */}
          {activePage?.isCustom && (
            <button
              type="button"
              onClick={() => void handleDeletePage()}
              className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-2xs"
              title="Delete this custom CMS page"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {/* Save & Publish Button */}
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={status === "saving"}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-60 transition"
          >
            <Save className="h-4 w-4" />
            <span>{status === "saving" ? "Publishing…" : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Notification */}
      {dirty && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900 shadow-2xs">
          <span>You have unsaved changes. Don&apos;t forget to click &quot;Save &amp; Publish&quot; to apply to the website.</span>
          <button
            type="button"
            onClick={() => void handleSave()}
            className="rounded-lg bg-amber-600 px-3 py-1 text-white hover:bg-amber-500 transition"
          >
            Save Now
          </button>
        </div>
      )}

      {/* ================= PERSISTENT TOOLBAR (FORMATTING & DEVICE VIEWPORT) ================= */}
      <div className="sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-2.5 shadow-md shadow-slate-900/5 backdrop-blur-md">
        <RichFormattingToolbar />

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            title="Desktop View (100%)"
            onClick={() => setViewport("desktop")}
            className={`rounded-lg p-1.5 transition ${
              viewport === "desktop" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Laptop className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Tablet View (768px)"
            onClick={() => setViewport("tablet")}
            className={`rounded-lg p-1.5 transition ${
              viewport === "tablet" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Tablet className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Mobile View (375px)"
            onClick={() => setViewport("mobile")}
            className={`rounded-lg p-1.5 transition ${
              viewport === "mobile" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ================= LIVE CANVAS PREVIEW (SAME TO SAME LIKE WEBSITE PAGE, NO HEADER & NO FOOTER) ================= */}
      {status === "loading" && (
        <div className="py-20 text-center font-medium text-slate-500">
          <Sparkles className="mx-auto mb-3 h-8 w-8 animate-pulse text-blue-500" />
          Loading visual editor…
        </div>
      )}

      {status !== "loading" && (
        <div className="flex justify-center transition-all duration-300">
          <div
            onClickCapture={(e) => {
              const target = e.target as HTMLElement;
              // Always allow CMS toolbar buttons, icon selectors, and interactive CMS controls
              if (target.closest("[data-cms-toolbar='true']")) {
                return;
              }
              // Allow text editing inside contentEditable while preventing link navigation / submit
              if (target.isContentEditable || target.closest("[contenteditable='true']")) {
                const linkOrSubmit = target.closest("a, button[type='submit'], input[type='submit']");
                if (linkOrSubmit) {
                  e.preventDefault();
                }
                return;
              }
              // Prevent link navigation or form submissions while letting clicks bubble for box selection
              const interactive = target.closest("a, button, input[type='submit'], input[type='button']");
              if (interactive) {
                e.preventDefault();
              }
            }}
            onSubmitCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all duration-300 ${
              viewport === "tablet"
                ? "max-w-[768px] ring-8 ring-slate-200/80 my-4"
                : viewport === "mobile"
                  ? "max-w-[390px] ring-12 ring-slate-300 my-6 shadow-2xl"
                  : "max-w-full"
            }`}
          >
            {/* Visual Canvas Notice Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/90 px-4 py-2 text-[11px] font-bold text-slate-600">
              <span>CANVAS &middot; {activePage?.title || selectedSlug} (Live Website View &middot; Header/Footer Hidden)</span>
              <span className="text-blue-600 font-semibold">Editable Webpage Mode</span>
            </div>

            {/* RENDER ACTUAL WEBSITE PAGE (SAME TO SAME, NO HEADER & NO FOOTER) */}
            {selectedSlug === "home" ? (
              <Landing
                isAuthenticated={false}
                homeContent={homeContent}
                cmsMode={true}
                onHomeChange={(newContent) => {
                  setHomeContent(newContent);
                  setDirty(true);
                }}
                selectedFeatureId={selectedBoxId}
                onFeatureSelect={setSelectedBoxId}
                onFeatureDelete={(id) => {
                  if (homeContent.features.length <= 1) return;
                  setHomeContent({
                    ...homeContent,
                    features: homeContent.features.filter((f) => f.id !== id),
                  });
                  setDirty(true);
                  toast.success("Box removed");
                }}
                onFeatureDuplicate={(id) => {
                  const idx = homeContent.features.findIndex((f) => f.id === id);
                  if (idx < 0) return;
                  const source = homeContent.features[idx];
                  if (!source) return;
                  const newId = `feature-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                  const copy = { ...source, id: newId, title: `${source.title} (Copy)` };
                  const next = [...homeContent.features];
                  next.splice(idx + 1, 0, copy);
                  setHomeContent({ ...homeContent, features: next });
                  setDirty(true);
                  toast.success("Box duplicated");
                }}
              />
            ) : selectedSlug === "about" ? (
              <About
                cmsMode={true}
                cmsContent={{
                  hero: marketingContent.hero,
                  cards: [],
                  sectionOrder: ["hero", "features"],
                  updatedAt: null,
                }}
                pageTexts={pageTexts}
                onTextChange={handlePageTextChange}
              />
            ) : selectedSlug === "how-it-works" ? (
              <HowItWorks
                cmsMode={true}
                cmsContent={marketingContent}
                pageTexts={pageTexts}
                onTextChange={handlePageTextChange}
              />
            ) : selectedSlug === "services" ? (
              <ServicesCatalog
                data={serviceHierarchy}
                cmsMode={true}
                pageTexts={pageTexts}
                onTextChange={handlePageTextChange}
              />
            ) : selectedSlug === "for-clients" ? (
              <ForClients
                cmsMode={true}
                pageTexts={pageTexts}
                onTextChange={handlePageTextChange}
              />
            ) : selectedSlug === "for-professionals" ? (
              <ForPros
                cmsMode={true}
                pageTexts={pageTexts}
                onTextChange={handlePageTextChange}
              />
            ) : selectedSlug === "pricing" ? (
              <Pricing
                cmsMode={true}
                pageTexts={pageTexts}
                onTextChange={handlePageTextChange}
              />
            ) : selectedSlug === "faq" ? (
              <FAQ
                initialData={faqCategories}
                cmsMode={true}
                pageTexts={pageTexts}
                onTextChange={handlePageTextChange}
              />
            ) : selectedSlug === "contact" ? (
              <Contact
                cmsMode={true}
                pageTexts={pageTexts}
                onTextChange={handlePageTextChange}
              />
            ) : selectedSlug === "professional-home" ? (
              <ProfessionalHome
                homeContent={homeContent}
                cmsMode={true}
                onHomeChange={(newContent) => {
                  setHomeContent(newContent);
                  setDirty(true);
                }}
                pageTexts={pageTexts}
                onTextChange={handlePageTextChange}
                selectedFeatureId={selectedBoxId}
                onFeatureSelect={setSelectedBoxId}
                onFeatureDelete={(id) => {
                  if (homeContent.features.length <= 1) return;
                  setHomeContent({
                    ...homeContent,
                    features: homeContent.features.filter((f) => f.id !== id),
                  });
                  setDirty(true);
                  toast.success("Box removed");
                }}
                onFeatureDuplicate={(id) => {
                  const idx = homeContent.features.findIndex((f) => f.id === id);
                  if (idx < 0) return;
                  const source = homeContent.features[idx];
                  if (!source) return;
                  const newId = `feature-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                  const copy = { ...source, id: newId, title: `${source.title} (Copy)` };
                  const next = [...homeContent.features];
                  next.splice(idx + 1, 0, copy);
                  setHomeContent({ ...homeContent, features: next });
                  setDirty(true);
                  toast.success("Box duplicated");
                }}
              />
            ) : (
              <MarketingVisualPage
                page={selectedSlug as MarketingPageId}
                content={marketingContent}
                cmsMode={true}
                selectedId={selectedBoxId}
                onSelect={setSelectedBoxId}
                onChange={(newContent) => {
                  setMarketingContent(newContent);
                  setDirty(true);
                }}
                onDelete={(id) => {
                  if (marketingContent.items.length <= 1) return;
                  setMarketingContent({
                    ...marketingContent,
                    items: marketingContent.items.filter((item) => item.id !== id),
                  });
                  setDirty(true);
                  toast.success("Box removed");
                }}
                onDuplicate={(id) => {
                  const idx = marketingContent.items.findIndex((item) => item.id === id);
                  if (idx < 0) return;
                  const source = marketingContent.items[idx];
                  if (!source) return;
                  const newId = `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                  const copy = { ...source, id: newId, title: `${source.title} (Copy)` };
                  const next = [...marketingContent.items];
                  next.splice(idx + 1, 0, copy);
                  setMarketingContent({ ...marketingContent, items: next });
                  setDirty(true);
                  toast.success("Box duplicated");
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD BOX ================= */}
      <Dialog open={addBoxOpen} onOpenChange={setAddBoxOpen}>
        <DialogContent className="max-w-2xl rounded-3xl bg-white p-6 sm:p-8 border-slate-200">
          <DialogHeader>
            <DialogTitle className="font-display font-extrabold text-xl text-slate-900">
              Add Content Box to {activePage?.title || selectedSlug}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select a pre-designed layout preset to insert into this page.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                handleAddBox({
                  title: "Trust & Identity Verification",
                  description: "Every professional is verified with government ID and background checks.",
                  icon: "shield",
                })
              }
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-left hover:border-blue-400 hover:bg-blue-50/40 transition"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Trust &amp; Verification</p>
                <p className="mt-1 text-xs text-slate-500">Highlight security, badges, and background screening.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleAddBox({
                  title: "Milestone Escrow Protection",
                  description: "Funds are safely deposited in escrow and released only upon approval.",
                  icon: "wallet",
                })
              }
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-left hover:border-blue-400 hover:bg-blue-50/40 transition"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Payment &amp; Escrow</p>
                <p className="mt-1 text-xs text-slate-500">Highlight milestone deposits and release workflows.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleAddBox({
                  title: "Fast Verified Proposals",
                  description: "Receive competitive proposals from top-rated professionals in minutes.",
                  icon: "clock",
                })
              }
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-left hover:border-blue-400 hover:bg-blue-50/40 transition"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Speed &amp; Efficiency</p>
                <p className="mt-1 text-xs text-slate-500">Highlight immediate proposals and project turnaround.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleAddBox({
                  title: "Quality Deliverables Guarantee",
                  description: "Clear expectations and mediation ensure every project meets your standards.",
                  icon: "award",
                })
              }
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-left hover:border-blue-400 hover:bg-blue-50/40 transition"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-100 text-purple-700">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Quality Guarantee</p>
                <p className="mt-1 text-xs text-slate-500">Highlight high rating benchmarks and workmanship.</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: CREATE NEW PAGE ================= */}
      <Dialog open={newPageOpen} onOpenChange={setNewPageOpen}>
        <DialogContent className="max-w-md rounded-3xl bg-white p-6 sm:p-8 border-slate-200">
          <DialogHeader>
            <DialogTitle className="font-display font-extrabold text-xl text-slate-900">
              Create New Website Page
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add a new dynamic CMS page to the website without code or static files.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => void handleCreatePage(e)} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={newPageTitle}
                onChange={(e) => {
                  setNewPageTitle(e.target.value);
                  if (!newPageSlug) {
                    setNewPageSlug(
                      e.target.value
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-"),
                    );
                  }
                }}
                placeholder="e.g. Security &amp; Guarantees"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                URL Slug (No .html)
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                <span className="font-semibold text-slate-400">/p/</span>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) =>
                    setNewPageSlug(
                      e.target.value
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9-]+/g, "-"),
                    )
                  }
                  placeholder="security-guarantees"
                  className="w-full bg-transparent font-bold text-slate-900 outline-none"
                  required
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                This page will connect to the live website at /p/{newPageSlug || "your-slug"}.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setNewPageOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingPage}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-60 transition"
              >
                {creatingPage ? "Creating Page…" : "Create & Edit"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: SEO & META ================= */}
      <Dialog open={seoOpen} onOpenChange={setSeoOpen}>
        <DialogContent className="max-w-xl rounded-3xl bg-white p-6 sm:p-8 border-slate-200">
          <DialogHeader>
            <DialogTitle className="font-display font-extrabold text-xl text-slate-900">
              SEO &amp; Search Engine Metadata
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Configure search engine snippets and keywords for {activePage?.title || selectedSlug}.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Meta Title (Browser Tab &amp; Google)
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => {
                  setMetaTitle(e.target.value);
                  setDirty(true);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => {
                  setMetaDescription(e.target.value);
                  setDirty(true);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={metaKeywords}
                onChange={(e) => {
                  setMetaKeywords(e.target.value);
                  setDirty(true);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Google Search Result Preview */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Search Engine Result Preview
              </span>
              <p className="mt-1 text-sm font-semibold text-blue-800 line-clamp-1">
                {metaTitle || `${activePage?.title || selectedSlug} | Klick-Pro`}
              </p>
              <p className="text-[11px] text-emerald-700">
                https://klick-pro.com/p/{selectedSlug}
              </p>
              <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                {metaDescription || "Connect with vetted service professionals with milestone escrow."}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSeoOpen(false)}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition"
              >
                Done
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

{/* ================= RICH FORMATTING TOOLBAR ================= */}
function RichFormattingToolbar() {
  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  const insertLink = () => {
    const url = window.prompt("Enter destination URL (e.g. https://... or /services):");
    if (url) exec("createLink", url);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 text-slate-600">
      <button
        type="button"
        title="Bold (Ctrl+B)"
        onClick={() => exec("bold")}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Italic (Ctrl+I)"
        onClick={() => exec("italic")}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Underline (Ctrl+U)"
        onClick={() => exec("underline")}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <Underline className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Strikethrough"
        onClick={() => exec("strikeThrough")}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <Strikethrough className="h-4 w-4" />
      </button>

      <span className="mx-1 h-4 w-[1px] bg-slate-200" />

      <button
        type="button"
        title="Align Left"
        onClick={() => exec("justifyLeft")}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Align Center"
        onClick={() => exec("justifyCenter")}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Align Right"
        onClick={() => exec("justifyRight")}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <AlignRight className="h-4 w-4" />
      </button>

      <span className="mx-1 h-4 w-[1px] bg-slate-200" />

      <button
        type="button"
        title="Bullet List"
        onClick={() => exec("insertUnorderedList")}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Numbered List"
        onClick={() => exec("insertOrderedList")}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Insert Hyperlink"
        onClick={insertLink}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <LinkIcon className="h-4 w-4 text-blue-600" />
      </button>
      <button
        type="button"
        title="Clear Formatting"
        onClick={() => exec("removeFormat")}
        className="rounded-lg p-1.5 hover:bg-slate-100 transition"
      >
        <RemoveFormatting className="h-4 w-4 text-rose-500" />
      </button>
    </div>
  );
}
