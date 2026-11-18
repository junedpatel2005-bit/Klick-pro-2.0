"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowRight,
  Award,
  Bold,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  Factory,
  Globe,
  GripVertical,
  GraduationCap,
  Heading1,
  Heading2,
  Heading3,
  HeartPulse,
  Home,
  Italic,
  Laptop,
  Layers,
  Link as LinkIcon,
  List,
  ListOrdered,
  Mail,
  MapPin,
  MessageCircle,
  Plus,
  Redo2,
  RemoveFormatting,
  Save,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Strikethrough,
  Tablet,
  Trash2,
  TrendingUp,
  Type,
  Underline,
  Undo2,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type CmsBox = {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  link?: string;
};

export type CmsPageData = {
  slug: string;
  title: string;
  isCustom?: boolean;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta?: string;
    primaryCtaLink?: string;
    secondaryCta?: string;
    secondaryCtaLink?: string;
  };
  boxesSection?: {
    title?: string;
    subtitle?: string;
  };
  boxes: CmsBox[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  updatedAt?: string;
};

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

const AVAILABLE_ICONS = [
  { id: "shield", label: "Shield / Trust", icon: ShieldCheck },
  { id: "briefcase", label: "Briefcase / Work", icon: Briefcase },
  { id: "users", label: "Users / Team", icon: Users },
  { id: "award", label: "Award / Quality", icon: Award },
  { id: "star", label: "Star / Rating", icon: Star },
  { id: "wallet", label: "Wallet / Escrow", icon: Wallet },
  { id: "clock", label: "Clock / Speed", icon: Clock },
  { id: "check", label: "Check / Guarantee", icon: Check },
  { id: "message", label: "Message / Chat", icon: MessageCircle },
  { id: "map", label: "Map / Local", icon: MapPin },
  { id: "search", label: "Search / Find", icon: Search },
  { id: "trend", label: "Trend / Growth", icon: TrendingUp },
  { id: "mail", label: "Mail / Contact", icon: Mail },
  { id: "sparkles", label: "Sparkles / AI", icon: Sparkles },
  { id: "heart", label: "Health / Care", icon: HeartPulse },
  { id: "education", label: "Education / Tutor", icon: GraduationCap },
  { id: "home", label: "Home / Residential", icon: Home },
  { id: "building", label: "Building / Commercial", icon: Building2 },
  { id: "factory", label: "Factory / Industrial", icon: Factory },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = AVAILABLE_ICONS.reduce(
  (acc, item) => ({ ...acc, [item.id]: item.icon }),
  {},
);

export default function CmsEditor() {
  const [pagesList, setPagesList] = useState<PageOption[]>(DEFAULT_PAGES);
  const [selectedSlug, setSelectedSlug] = useState<string>("home");
  const [pageData, setPageData] = useState<CmsPageData | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "saved" | "error">("loading");
  const [dirty, setDirty] = useState<boolean>(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Modals
  const [addBoxOpen, setAddBoxOpen] = useState(false);
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  // New Page form state
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [creatingPage, setCreatingPage] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Fetch page list on mount
  useEffect(() => {
    void fetch("/api/admin/cms?action=list", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { pages?: PageOption[] };
        if (Array.isArray(data.pages) && data.pages.length > 0) {
          setPagesList(data.pages);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_PAGES
      });
  }, []);

  // Fetch active page content
  useEffect(() => {
    setStatus("loading");
    setSelectedBoxId(null);
    setDirty(false);

    void fetch(`/api/admin/cms?page=${encodeURIComponent(selectedSlug)}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load page");
        const data = (await res.json()) as CmsPageData;
        setPageData(data);
        setStatus("saved");
      })
      .catch(() => {
        setStatus("error");
        toast.error(`Unable to load content for ${selectedSlug}`);
      });
  }, [selectedSlug]);

  const updatePage = (changes: Partial<CmsPageData>) => {
    if (!pageData) return;
    setPageData({ ...pageData, ...changes });
    setDirty(true);
    setStatus("ready");
  };

  const updateHero = (field: keyof CmsPageData["hero"], value: string) => {
    if (!pageData) return;
    updatePage({
      hero: {
        ...pageData.hero,
        [field]: value,
      },
    });
  };

  const updateBoxesSection = (field: "title" | "subtitle", value: string) => {
    if (!pageData) return;
    updatePage({
      boxesSection: {
        ...pageData.boxesSection,
        [field]: value,
      },
    });
  };

  const updateBox = (id: string, changes: Partial<CmsBox>) => {
    if (!pageData) return;
    updatePage({
      boxes: pageData.boxes.map((b) => (b.id === id ? { ...b, ...changes } : b)),
    });
  };

  const addBox = (preset?: Partial<CmsBox>) => {
    if (!pageData) return;
    const newId = `box-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newBox: CmsBox = {
      id: newId,
      title: preset?.title || "New Feature Highlight",
      description: preset?.description || "Click to edit this description directly on the card.",
      icon: preset?.icon || "shield",
      badge: preset?.badge,
    };
    updatePage({
      boxes: [...pageData.boxes, newBox],
    });
    setSelectedBoxId(newId);
    setAddBoxOpen(false);
    toast.success("New content box added!");
  };

  const duplicateBox = (id: string) => {
    if (!pageData) return;
    const idx = pageData.boxes.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const source = pageData.boxes[idx];
    if (!source) return;
    const newId = `box-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const copy: CmsBox = {
      ...source,
      id: newId,
      title: `${source.title} (Copy)`,
    };
    const nextBoxes = [...pageData.boxes];
    nextBoxes.splice(idx + 1, 0, copy);
    updatePage({ boxes: nextBoxes });
    setSelectedBoxId(newId);
    toast.success("Content box duplicated");
  };

  const deleteBox = (id: string) => {
    if (!pageData || pageData.boxes.length <= 1) {
      toast.error("A page must have at least one content box.");
      return;
    }
    updatePage({
      boxes: pageData.boxes.filter((b) => b.id !== id),
    });
    if (selectedBoxId === id) setSelectedBoxId(null);
    toast.success("Box removed");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!pageData) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = pageData.boxes.findIndex((b) => b.id === active.id);
    const newIndex = pageData.boxes.findIndex((b) => b.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) {
      updatePage({
        boxes: arrayMove(pageData.boxes, oldIndex, newIndex),
      });
    }
  };

  const saveContent = async () => {
    if (!pageData) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus("saved");
      setDirty(false);
      toast.success(`Published changes for ${pageData.title}!`);
    } catch {
      setStatus("error");
      toast.error("Unable to save changes. Please try again.");
    }
  };

  const handleCreateNewPage = async (e: React.FormEvent) => {
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
      const data = (await res.json()) as { success?: boolean; page?: CmsPageData; error?: string };
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
      toast.success(`Created page "${created.title}" successfully!`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create page");
    } finally {
      setCreatingPage(false);
    }
  };

  const handleDeletePage = async () => {
    if (!pageData?.isCustom) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${pageData.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/cms?slug=${encodeURIComponent(pageData.slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`Deleted page "${pageData.title}"`);
      setPagesList((prev) => prev.filter((p) => p.slug !== pageData.slug));
      setSelectedSlug("home");
    } catch {
      toast.error("Failed to delete page.");
    }
  };

  const currentHref =
    selectedSlug === "home"
      ? "/"
      : selectedSlug === "about"
        ? "/about"
        : pageData?.isCustom
          ? `/p/${selectedSlug}`
          : `/${selectedSlug}`;

  const liveStandaloneHref = `/p/${selectedSlug}`;

  return (
    <div className="space-y-6">
      {/* ================= TOP CMS CONTROL PANEL ================= */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
              <Layers className="h-3.5 w-3.5" />
              Live Visual CMS
            </span>
            <span className="text-xs font-medium text-slate-400">· Click any text to edit live</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Visual Website Editor
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage page sections, text headlines, and content boxes connected directly to the website.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Page Picker (Clean names, ZERO .html) */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Page:
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => {
                if (dirty && !window.confirm("You have unsaved changes. Discard and switch?")) return;
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

          {/* Create New Page Trigger */}
          <button
            type="button"
            onClick={() => setNewPageOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="Create a new dynamic CMS page"
          >
            <Plus className="h-4 w-4 text-blue-600" />
            <span>New Page</span>
          </button>

          {/* Add Box Modal Trigger */}
          <button
            type="button"
            onClick={() => setAddBoxOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Box</span>
          </button>

          {/* SEO Modal Trigger */}
          <button
            type="button"
            onClick={() => setSeoOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Globe className="h-4 w-4 text-blue-600" />
            <span>SEO &amp; Meta</span>
          </button>

          {/* View Live on Website (Opens dedicated CMS standalone route without header/footer) */}
          <a
            href={liveStandaloneHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="View this CMS page live on the website (clean view without header and footer)"
          >
            <Eye className="h-4 w-4 text-emerald-600" />
            <span>Live Website</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>

          {/* Delete Page button if custom */}
          {pageData?.isCustom && (
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
            onClick={() => void saveContent()}
            disabled={status === "saving"}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-60 transition"
          >
            <Save className="h-4 w-4" />
            <span>{status === "saving" ? "Saving Changes…" : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Notification */}
      {dirty && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900 shadow-2xs">
          <span>You have unsaved changes on this page. Click &quot;Save &amp; Publish&quot; to apply to the website.</span>
          <button
            type="button"
            onClick={() => void saveContent()}
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

      {/* ================= LIVE CANVAS PREVIEW (NO HEADER & NO FOOTER) ================= */}
      {status === "loading" && (
        <div className="py-20 text-center font-medium text-slate-500">
          <Sparkles className="mx-auto mb-3 h-8 w-8 animate-pulse text-blue-500" />
          Loading visual editor…
        </div>
      )}

      {pageData && status !== "loading" && (
        <div className="flex justify-center transition-all duration-300">
          <div
            onClickCapture={(e) => {
              const target = e.target as HTMLElement;
              const anchor = target.closest("a");
              if (anchor && !target.isContentEditable) {
                e.preventDefault();
              }
            }}
            className={`w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl transition-all duration-300 ${
              viewport === "tablet"
                ? "max-w-[768px] ring-8 ring-slate-200/80 my-4"
                : viewport === "mobile"
                  ? "max-w-[390px] ring-12 ring-slate-300 my-6 shadow-2xl"
                  : "max-w-full"
            }`}
          >
            {/* Visual Canvas Notice */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/80 px-4 py-2 text-[11px] font-bold text-slate-500">
              <span>CANVAS PREVIEW &middot; {pageData.title} (Pure CMS View &middot; No Header/Footer)</span>
              <span className="text-blue-600 font-semibold">Editable Canvas Mode</span>
            </div>

            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 py-16 sm:py-24">
              <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                {/* Eyebrow / Label */}
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-2xs backdrop-blur-xs">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => updateHero("eyebrow", e.currentTarget.textContent || "")}
                    className="outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
                  >
                    {pageData.hero.eyebrow || "CLICK TO EDIT EYEBROW"}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl sm:leading-[1.15]">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => updateHero("title", e.currentTarget.textContent || "")}
                    className="outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-50/30 rounded px-1"
                  >
                    {pageData.hero.title || "Click to Edit Main Page Title"}
                  </span>
                </h1>

                {/* Subtitle / Description */}
                <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => updateHero("description", e.currentTarget.textContent || "")}
                    className="outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-50/30 rounded px-1"
                  >
                    {pageData.hero.description || "Click to edit this description paragraph live."}
                  </span>
                </p>

                {/* Hero Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => updateHero("primaryCta", e.currentTarget.textContent || "")}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 outline-none focus:ring-2 focus:ring-white cursor-text"
                  >
                    {pageData.hero.primaryCta || "Primary Button"}
                  </span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => updateHero("secondaryCta", e.currentTarget.textContent || "")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-2xs outline-none focus:ring-2 focus:ring-blue-400 cursor-text"
                  >
                    {pageData.hero.secondaryCta || "Secondary Button"}
                  </span>
                </div>
              </div>
            </section>

            {/* 2. CONTENT BOXES & SECTIONS MANAGEMENT */}
            <section className="py-16 sm:py-20 bg-slate-50">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10 text-center">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => updateBoxesSection("title", e.currentTarget.textContent || "")}
                      className="outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
                    >
                      {pageData.boxesSection?.title || "Key Platform Features & Boxes"}
                    </span>
                  </h2>
                  <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => updateBoxesSection("subtitle", e.currentTarget.textContent || "")}
                      className="outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
                    >
                      {pageData.boxesSection?.subtitle || "Click directly on any box title or description below to change text."}
                    </span>
                  </p>
                </div>

                {/* Sortable Drag-and-Drop Boxes Grid */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={pageData.boxes.map((b) => b.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div
                      className={`grid gap-6 ${
                        pageData.boxes.length === 1
                          ? "mx-auto max-w-md"
                          : pageData.boxes.length === 2
                            ? "mx-auto max-w-4xl md:grid-cols-2"
                            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {pageData.boxes.map((box) => (
                        <SortableBoxCard
                          key={box.id}
                          box={box}
                          isSelected={selectedBoxId === box.id}
                          onSelect={() => setSelectedBoxId(box.id)}
                          onChange={(changes) => updateBox(box.id, changes)}
                          onDuplicate={() => duplicateBox(box.id)}
                          onDelete={() => deleteBox(box.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {/* Bottom Add Box Button */}
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setAddBoxOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 px-6 py-4 text-xs font-bold text-slate-600 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Content Box to this Page</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD BOX ================= */}
      <Dialog open={addBoxOpen} onOpenChange={setAddBoxOpen}>
        <DialogContent className="max-w-2xl rounded-3xl bg-white p-6 sm:p-8 border-slate-200">
          <DialogHeader>
            <DialogTitle className="font-display font-extrabold text-xl text-slate-900">
              Add Content Box to {pageData?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select a pre-designed box template to insert directly into this page.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                addBox({
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
                <p className="font-bold text-sm text-slate-900">Trust &amp; Security</p>
                <p className="mt-1 text-xs text-slate-500">Highlight background checks, badges, or escrow safety.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                addBox({
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
                addBox({
                  title: "Fast Verified Matching",
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
                addBox({
                  title: "Custom Highlight Box",
                  description: "Add custom title and description for any service, benefit, or policy.",
                  icon: "award",
                })
              }
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-left hover:border-blue-400 hover:bg-blue-50/40 transition"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-100 text-purple-700">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Custom Feature</p>
                <p className="mt-1 text-xs text-slate-500">Start with a blank card and customize fully.</p>
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

          <form onSubmit={(e) => void handleCreateNewPage(e)} className="mt-4 space-y-4">
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
              Configure search engine snippets and keywords for {pageData?.title}.
            </DialogDescription>
          </DialogHeader>

          {pageData && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Meta Title (Browser Tab &amp; Google)
                </label>
                <input
                  type="text"
                  value={pageData.seo?.metaTitle || ""}
                  onChange={(e) =>
                    updatePage({
                      seo: {
                        ...pageData.seo,
                        metaTitle: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={pageData.seo?.metaDescription || ""}
                  onChange={(e) =>
                    updatePage({
                      seo: {
                        ...pageData.seo,
                        metaDescription: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={pageData.seo?.keywords || ""}
                  onChange={(e) =>
                    updatePage({
                      seo: {
                        ...pageData.seo,
                        keywords: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Google Search Result Preview */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Search Engine Result Preview
                </span>
                <p className="mt-1 text-sm font-semibold text-blue-800 line-clamp-1">
                  {pageData.seo?.metaTitle || `${pageData.title} | Klick-Pro Verified Marketplace`}
                </p>
                <p className="text-[11px] text-emerald-700">
                  https://klick-pro.com/p/{pageData.slug}
                </p>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {pageData.seo?.metaDescription || pageData.hero.description}
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

{/* ================= SORTABLE BOX CARD ================= */}
function SortableBoxCard({
  box,
  isSelected,
  onSelect,
  onChange,
  onDuplicate,
  onDelete,
}: {
  box: CmsBox;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (changes: Partial<CmsBox>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: box.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = ICON_MAP[box.icon] || ShieldCheck;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-7 shadow-xs transition ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50"
          : "border-slate-200/90 hover:border-blue-300"
      } ${isDragging ? "z-20 opacity-60 scale-105 shadow-xl" : ""}`}
    >
      {/* Box Header & Controls */}
      <div>
        <div className="flex items-center justify-between">
          {/* Icon Selector Button */}
          <div className="flex items-center gap-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="h-6 w-6" />
            </div>

            <select
              value={box.icon}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onChange({ icon: e.target.value })}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500"
              title="Select card icon"
            >
              {AVAILABLE_ICONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Drag Handle & Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              title="Duplicate card"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete card"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            <div
              {...attributes}
              {...listeners}
              title="Drag to reorder"
              className="cursor-grab active:cursor-grabbing rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <GripVertical className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Editable Box Title */}
        <h3 className="mt-5 font-display text-lg font-bold text-slate-900">
          <span
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => onChange({ title: e.currentTarget.textContent || "" })}
            className="outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
          >
            {box.title}
          </span>
        </h3>

        {/* Editable Box Description */}
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          <span
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => onChange({ description: e.currentTarget.textContent || "" })}
            className="outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
          >
            {box.description}
          </span>
        </p>
      </div>

      {/* Selected Indicator Badge */}
      {isSelected && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] font-bold text-blue-600">
          <span>Active Card Selected</span>
          <span>Click text to edit inline</span>
        </div>
      )}
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
