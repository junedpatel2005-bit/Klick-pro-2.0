"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  LocateFixed,
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
import type {
  MarketingPageContent,
  MarketingPageId,
  MarketingItem,
} from "@/lib/marketing-cms-shared";
import type { MarketplaceCategory } from "@/lib/types/marketplace";
import { getAllStates, getDistrictsByState } from "@/lib/india-locations";

type ServiceJob = {
  id: number;
  title: string | null;
  description: string | null;
  category: string | null;
  locationLabel: string | null;
  locationAddress: string | null;
  locationState: string | null;
  locationDistrict: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  hourlyRate: number | null;
  timingType: string;
  clientName: string;
  createdAt: string;
  clientVerified: boolean;
};

const iconMap = {
  shield: ShieldCheck,
  briefcase: Briefcase,
  users: Users,
  map: MapPin,
  search: Search,
  arrow: Award,
  award: Award,
  clipboard: CheckCircle2,
  message: MessageCircle,
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

// CMS-only drag-and-drop, loaded lazily so the six public marketing pages that
// render this component never download @dnd-kit.
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

export default function MarketingVisualPage({
  page,
  content,
  cmsMode = false,
  onChange,
  selectedId,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  page: MarketingPageId;
  content: MarketingPageContent;
  cmsMode?: boolean;
  onChange?: (content: MarketingPageContent) => void;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}) {
  const editHero = (field: keyof MarketingPageContent["hero"], value: string) =>
    onChange?.({ ...content, hero: { ...content.hero, [field]: value } });
  const updateOrder = (active: string, over: string) => {
    const from = content.items.findIndex((item) => item.id === active);
    const to = content.items.findIndex((item) => item.id === over);
    if (from >= 0 && to >= 0) onChange?.({ ...content, items: moveItem(content.items, from, to) });
  };
  const gridClassName = `grid gap-6 ${content.items.length === 1 ? "mx-auto max-w-md" : content.items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`;
  // Shared by the sortable (CMS) and plain (public) grids.
  const renderItem = (item: MarketingItem, drag?: DragHandle, index?: number) => {
    const idx = index !== undefined ? index : content.items.findIndex((i) => i.id === item.id);
    return (
      <MarketingItemCard
        key={item.id}
        item={item}
        cmsMode={cmsMode}
        drag={drag}
        selected={selectedId === item.id}
        onSelect={() => onSelect?.(item.id)}
        onMoveLeft={
          idx > 0
            ? () => onChange?.({ ...content, items: moveItem(content.items, idx, idx - 1) })
            : undefined
        }
        onMoveRight={
          idx < content.items.length - 1
            ? () => onChange?.({ ...content, items: moveItem(content.items, idx, idx + 1) })
            : undefined
        }
        onChange={(changes) =>
          onChange?.({
            ...content,
            items: content.items.map((current) =>
              current.id === item.id ? { ...current, ...changes } : current,
            ),
          })
        }
        onDelete={() => onDelete?.(item.id)}
        onDuplicate={() => onDuplicate?.(item.id)}
      />
    );
  };
  const text = (value: string, field: keyof MarketingPageContent["hero"], className: string) => (
    <span
      className={className}
      contentEditable={cmsMode}
      suppressContentEditableWarning={cmsMode}
      onInput={(event) => editHero(field, event.currentTarget.textContent ?? "")}
    >
      {value}
    </span>
  );
  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className={`gradient-hero ${page === "for-professionals" ? "bg-ink text-ink-foreground" : ""}`}
        >
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            {text(
              content.hero.label,
              "label",
              "text-xs font-semibold uppercase tracking-wider text-primary",
            )}
            <h1
              className={`font-display mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl ${page === "for-professionals" ? "text-black" : ""}`}
            >
              {text(content.hero.title, "title", "")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {text(content.hero.description, "description", "")}
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          {cmsMode ? (
            <SortableBoard
              ids={content.items.map((item) => item.id)}
              onReorder={(from, to) =>
                onChange?.({ ...content, items: moveItem(content.items, from, to) })
              }
            >
              <div className={gridClassName}>
                {content.items.map((item, index) => (
                  <SortableItem key={item.id} id={item.id}>
                    {(drag) => renderItem(item, drag, index)}
                  </SortableItem>
                ))}
              </div>
            </SortableBoard>
          ) : (
            <div className={gridClassName}>{content.items.map((item) => renderItem(item))}</div>
          )}
        </section>
        {page === "services" && <ServicesJobsSection cmsMode={cmsMode} />}
        {page === "contact" ? (
          <ContactForm cmsMode={cmsMode} />
        ) : page === "pricing" ? (
          <p className="mx-auto max-w-7xl px-4 pb-20 text-center text-sm text-muted-foreground">
            <span
              contentEditable={cmsMode}
              suppressContentEditableWarning={cmsMode}
              className={cmsMode ? "outline-none cursor-text" : ""}
            >
              Need something custom?
            </span>{" "}
            {cmsMode ? (
              <span
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="text-primary hover:underline cursor-text outline-none font-semibold"
              >
                Contact us
              </span>
            ) : (
              <Link href="/contact" className="text-primary hover:underline">
                Contact us
              </Link>
            )}
            .
          </p>
        ) : (
          <CTA
            cmsMode={cmsMode}
            cta={content.cta}
            onCtaChange={(cta) => onChange?.({ ...content, cta })}
          />
        )}
      </main>
    </div>
  );
}

function ServicesJobsSection({ cmsMode }: { cmsMode: boolean }) {
  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [segment, setSegment] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [subSubCategoryId, setSubSubCategoryId] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(!cmsMode);
  const [isAuthenticated, setIsAuthenticated] = useState(cmsMode);
  const [allCategories, setAllCategories] = useState<MarketplaceCategory[]>([]);

  useEffect(() => {
    if (cmsMode) return;
    void fetch("/api/v1/auth/me", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { user: null }))
      .then((data: { user?: unknown }) => setIsAuthenticated(Boolean(data.user)))
      .catch(() => setIsAuthenticated(false));
  }, [cmsMode]);

  useEffect(() => {
    if (cmsMode) return;
    void fetch("/api/v1/marketplace/categories", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: MarketplaceCategory[]) => setAllCategories(Array.isArray(data) ? data : []))
      .catch(() => setAllCategories([]));
  }, [cmsMode]);

  useEffect(() => {
    if (cmsMode) return;
    void fetch("/api/marketplace/jobs", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: ServiceJob[]) => setJobs(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [cmsMode]);

  const parentCategories = allCategories.filter((item) => item.parentId === null);
  const midCategories =
    parentCategoryId === null
      ? []
      : allCategories.filter((item) => item.parentId === parentCategoryId);
  const selectedParent = parentCategories.find((item) => item.id === parentCategoryId) ?? null;
  const subCategories =
    subCategoryId === null ? [] : allCategories.filter((item) => item.parentId === subCategoryId);
  const selectedSubCategory = allCategories.find((item) => item.id === subCategoryId) ?? null;

  const selectedSubSubCategory = allCategories.find((item) => item.id === subSubCategoryId) ?? null;

  const parentMatchNames = new Set<string>();
  if (selectedParent) {
    parentMatchNames.add(selectedParent.name);
    allCategories
      .filter((item) => item.parentId === selectedParent.id)
      .forEach((item) => parentMatchNames.add(item.name));
  }

  const subMatchNames = new Set<string>();
  if (selectedSubCategory) {
    subMatchNames.add(selectedSubCategory.name);
    allCategories
      .filter((item) => item.parentId === selectedSubCategory.id)
      .forEach((item) => subMatchNames.add(item.name));
  }

  const subSubMatchNames = new Set<string>();
  if (selectedSubSubCategory) subSubMatchNames.add(selectedSubSubCategory.name);

  const categories = [...new Set(jobs.map((job) => job.category).filter(Boolean))] as string[];
  const filteredJobs = cmsMode
    ? []
    : jobs.filter((job) => {
        const searchable =
          `${job.title ?? ""} ${job.description ?? ""} ${job.category ?? ""} ${job.locationLabel ?? ""} ${job.locationAddress ?? ""}`.toLowerCase();
        const jobCategory = job.category ?? "";
        const segmentMatch = segment
          ? subSubCategoryId !== null
            ? subSubMatchNames.has(jobCategory)
            : subCategoryId !== null
              ? subMatchNames.has(jobCategory)
              : parentMatchNames.has(jobCategory)
          : true;
        return (
          (!query || searchable.includes(query.toLowerCase())) &&
          (!category || job.category === category) &&
          (!location || searchable.includes(location.toLowerCase())) &&
          (!state || job.locationState === state) &&
          (!district || job.locationDistrict === district) &&
          segmentMatch &&
          (!verifiedOnly || job.clientVerified)
        );
      });
  const filtersEnabled = cmsMode || isAuthenticated;

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Open jobs</p>
        <h2 className="mt-2 font-display text-3xl font-bold">Find work from clients</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Browse open jobs posted by clients and filter them by service or location.
        </p>
        <div className={`mt-8 grid gap-6 ${filtersEnabled ? "lg:grid-cols-[260px_1fr]" : ""}`}>
          {filtersEnabled && (
            <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("");
                    setLocation("");
                    setState("");
                    setDistrict("");
                    setSegment("");
                    setParentCategoryId(null);
                    setSubCategoryId(null);
                    setSubSubCategoryId(null);
                    setVerifiedOnly(false);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    State and district
                  </p>
                  <div className="space-y-2">
                    <select
                      value={state}
                      onChange={(event) => {
                        setState(event.target.value);
                        setDistrict("");
                      }}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="">All states</option>
                      {getAllStates().map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    <select
                      value={district}
                      onChange={(event) => setDistrict(event.target.value)}
                      disabled={!state}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm disabled:opacity-60"
                    >
                      <option value="">All districts</option>
                      {(getDistrictsByState(state) ?? []).map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Category
                  </p>
                  {parentCategories.length > 0 ? (
                    <>
                      <select
                        value={parentCategoryId ?? ""}
                        onChange={(event) => {
                          const next = event.target.value ? Number(event.target.value) : null;
                          if (next === null) {
                            setParentCategoryId(null);
                            setSubCategoryId(null);
                            setSubSubCategoryId(null);
                            setSegment("");
                          } else {
                            const parent = parentCategories.find((item) => item.id === next);
                            setParentCategoryId(next);
                            setSubCategoryId(null);
                            setSubSubCategoryId(null);
                            setSegment(parent?.name ?? "");
                          }
                        }}
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        <option value="">All service types</option>
                        {parentCategories.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name.replace(" Services", "")}
                          </option>
                        ))}
                      </select>
                      {parentCategoryId === null ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Select a service type to narrow the jobs.
                        </p>
                      ) : midCategories.length > 0 ? (
                        <div className="mt-4 space-y-3 border-t border-border pt-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {selectedParent?.name.replace(" Services", "") ?? "Categories"}
                          </p>
                          <div className="max-h-44 space-y-1 overflow-y-auto pr-1">
                            {midCategories.map((item) => {
                              const isActive = subCategoryId === item.id;
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    if (isActive) {
                                      setSubCategoryId(null);
                                      setSubSubCategoryId(null);
                                    } else {
                                      setSubCategoryId(item.id);
                                      setSubSubCategoryId(null);
                                    }
                                  }}
                                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                                    isActive
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border text-foreground hover:border-primary/40"
                                  }`}
                                >
                                  <span>{item.name}</span>
                                </button>
                              );
                            })}
                          </div>
                          {subCategoryId !== null && subCategories.length > 0 && (
                            <div className="mt-3 space-y-2 border-t border-border pt-3">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Sub-categories
                              </p>
                              <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
                                {subCategories.map((item) => {
                                  const isActive = subSubCategoryId === item.id;
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => setSubSubCategoryId(isActive ? null : item.id)}
                                      className={`flex w-full items-center justify-between rounded-md border px-2.5 py-1.5 text-left text-[11px] font-medium transition ${
                                        isActive
                                          ? "border-primary bg-primary/10 text-primary"
                                          : "border-border text-muted-foreground hover:border-primary/40"
                                      }`}
                                    >
                                      <span>{item.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <select
                        value={segment}
                        onChange={(event) => setSegment(event.target.value)}
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        <option value="">All service types</option>
                        {[
                          "Residential",
                          "Commercial",
                          "Industrial",
                          "Health Care",
                          "Personal Care & Home Services",
                          "Education",
                        ].map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Select a service type to narrow the jobs.
                      </p>
                    </>
                  )}
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Location
                  </p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            async (pos) => {
                              try {
                                const res = await fetch(`/api/geocode?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
                                if (res.ok) {
                                  const data = await res.json();
                                  if (data.city || data.district || data.state) {
                                    setLocation(data.city || data.district || data.state);
                                    return;
                                  }
                                }
                              } catch {
                                /* Fall back to generic location label below */
                              }
                              setLocation("Near Me");
                            },
                            () => {
                              setLocation("");
                            }
                          );
                        }
                      }}
                      className="flex h-10 w-full items-center gap-2 rounded-lg border border-border px-3 text-left text-xs font-semibold hover:bg-muted"
                    >
                      <LocateFixed className="h-4 w-4" /> Use my current location
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocation("")}
                      className="flex h-10 w-full items-center gap-2 rounded-lg border border-border px-3 text-left text-xs font-semibold hover:bg-muted"
                    >
                      <Home className="h-4 w-4" /> All Locations / Remote
                    </button>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Verified only
                  </p>
                  <label className="flex items-center justify-between text-sm">
                    <span>Verified clients</span>
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(event) => setVerifiedOnly(event.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                  </label>
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    City
                  </p>
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="e.g. Mumbai, Delhi, Bengaluru, Surat"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  />
                </div>
              </div>
            </aside>
          )}
          <div className="min-w-0">
            {filtersEnabled && (
              <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1.5fr_1fr_auto]">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search jobs"
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                />
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">All services</option>
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <span className="hidden items-center text-sm text-muted-foreground md:flex">
                  {cmsMode ? "Preview filters" : `${filteredJobs.length} jobs`}
                </span>
              </div>
            )}
            {cmsMode ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {["Sample client job", "Sample service request", "Sample local project"].map(
                  (title) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Open job
                      </p>
                      <h3 className="mt-2 font-semibold">{title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Service category · Location
                      </p>
                      <p className="mt-5 text-sm font-semibold">Budget shown here</p>
                    </div>
                  ),
                )}
              </div>
            ) : loading ? (
              <div className="mt-8 h-48 animate-pulse rounded-2xl bg-muted" />
            ) : filteredJobs.length ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/job/${job.id}`}
                    className="rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {job.category || "Open job"}
                    </p>
                    <h3 className="mt-2 font-semibold">{job.title || "Client job"}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {job.description || "View the request details."}
                    </p>
                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {job.locationLabel || job.locationAddress || "Location not specified"}
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {job.timingType === "HOURLY"
                            ? `₹${job.hourlyRate ?? "—"}/hr`
                            : `₹${job.budgetMin ?? "—"}${job.budgetMax ? `–₹${job.budgetMax}` : ""}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{job.clientName}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No open jobs match these filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketingItemCard({
  item,
  cmsMode,
  drag,
  selected,
  onSelect,
  onChange,
  onDelete,
  onDuplicate,
  onMoveLeft,
  onMoveRight,
}: {
  item: MarketingItem;
  cmsMode: boolean;
  drag?: DragHandle;
  selected: boolean;
  onSelect: () => void;
  onChange: (changes: Partial<MarketingItem>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
}) {
  const Icon = iconMap[item.icon as keyof typeof iconMap] ?? ShieldCheck;
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
    <article
      ref={drag?.ref}
      style={drag?.style}
      {...(drag?.handleProps ?? {})}
      onClick={cmsMode ? onSelect : undefined}
      className={`relative rounded-2xl border border-border bg-card p-7 shadow-soft flex flex-col justify-between ${cmsMode ? "cursor-grab active:cursor-grabbing hover:border-blue-400" : ""} ${selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""} ${drag?.isDragging ? "z-10 scale-[1.02] opacity-70 shadow-2xl" : ""}`}
    >
      <div>
        <Icon className="h-7 w-7 text-primary" />
        <h2 className="mt-5 font-display text-xl font-semibold text-foreground" {...editable("title")}>
          {item.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground" {...editable("description")}>
          {item.description}
        </p>
      </div>

      {/* Editable Button for every box */}
      <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4">
        {cmsMode ? (
          <div
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition cursor-text ring-1 ring-blue-200"
            title="Click text to edit button name"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              contentEditable={true}
              suppressContentEditableWarning={true}
              onInput={(e) => onChange({ buttonText: e.currentTarget.textContent ?? "" })}
              className="outline-none"
            >
              {item.buttonText || "Learn more"}
            </span>
            <ArrowRight className="h-3 w-3 pointer-events-none" />
          </div>
        ) : (
          <Link
            href={item.buttonLink || "/services"}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
          >
            <span>{item.buttonText || "Learn more"}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {cmsMode && selected && (
        <div
          className="absolute -top-3 right-3 flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1 text-xs shadow-lg z-20"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {onMoveLeft && (
            <button
              type="button"
              onClick={onMoveLeft}
              className="text-primary font-bold hover:underline"
              title="Move box earlier"
            >
              &larr; Move
            </button>
          )}
          {onMoveRight && (
            <button
              type="button"
              onClick={onMoveRight}
              className="text-primary font-bold hover:underline"
              title="Move box later"
            >
              Move &rarr;
            </button>
          )}
          <label className="text-slate-500 font-medium">
            Icon{" "}
            <select
              value={item.icon}
              onChange={(e) => onChange({ icon: e.target.value })}
              className="bg-background text-foreground font-medium rounded border border-border px-1 py-0.5"
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
              <option value="award">Award</option>
            </select>
          </label>
          <button type="button" onClick={onDelete} className="text-destructive font-bold hover:underline">
            Delete
          </button>
          <button type="button" onClick={onDuplicate} className="text-primary font-bold hover:underline">
            Duplicate
          </button>
        </div>
      )}
    </article>
  );
}

function CTA({
  cmsMode = false,
  cta,
  onCtaChange,
}: {
  cmsMode?: boolean;
  cta?: MarketingPageContent["cta"];
  onCtaChange?: (cta: NonNullable<MarketingPageContent["cta"]>) => void;
}) {
  const currentCta = {
    title: cta?.title || "Get started today",
    primaryBtn: cta?.primaryBtn || "Post a Job",
    primaryLink: cta?.primaryLink || "/post-job",
    secondaryBtn: cta?.secondaryBtn || "Become a Professional",
    secondaryLink: cta?.secondaryLink || "/signup",
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-primary p-10 text-white md:p-14">
        <h3 className="font-display text-3xl font-bold">
          <span
            contentEditable={cmsMode}
            suppressContentEditableWarning={cmsMode}
            onInput={(e) =>
              onCtaChange?.({
                ...currentCta,
                title: e.currentTarget.textContent ?? "",
              })
            }
            className={cmsMode ? "outline-none cursor-text hover:ring-1 hover:ring-white/40 rounded px-1" : ""}
          >
            {currentCta.title}
          </span>
        </h3>
        <div className="mt-5 flex flex-wrap gap-3">
          {cmsMode ? (
            <div
              className="inline-flex items-center rounded-xl bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground shadow-sm cursor-text hover:ring-2 hover:ring-white/40"
              title="Click text to edit button name"
            >
              <span
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={(e) =>
                  onCtaChange?.({
                    ...currentCta,
                    primaryBtn: e.currentTarget.textContent ?? "",
                  })
                }
                className="outline-none focus:underline"
              >
                {currentCta.primaryBtn}
              </span>
            </div>
          ) : (
            <Button asChild size="lg" className="bg-cta text-cta-foreground">
              <Link href={currentCta.primaryLink}>{currentCta.primaryBtn}</Link>
            </Button>
          )}

          {cmsMode ? (
            <div
              className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm cursor-text hover:ring-2 hover:ring-white/40"
              title="Click text to edit button name"
            >
              <span
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={(e) =>
                  onCtaChange?.({
                    ...currentCta,
                    secondaryBtn: e.currentTarget.textContent ?? "",
                  })
                }
                className="outline-none focus:underline"
              >
                {currentCta.secondaryBtn}
              </span>
            </div>
          ) : (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white"
            >
              <Link href={currentCta.secondaryLink}>{currentCta.secondaryBtn}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactForm({ cmsMode = false }: { cmsMode?: boolean }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState("");
  const [sending, setSending] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (cmsMode) {
      setSent("In CMS Editor mode, form submission is simulated.");
      return;
    }
    setSending(true);
    const response = await fetch("/api/v1/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json()) as { error?: string };
    setSending(false);
    setSent(
      response.ok
        ? "Thanks — our team will get back to you shortly."
        : (data.error ?? "Unable to send your message."),
    );
    if (response.ok) setForm({ name: "", email: "", subject: "", message: "" });
  };
  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-16 lg:grid-cols-[.8fr_1.2fr]">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <Mail className="h-6 w-6 text-primary" />
        <h2 className="mt-4 font-display text-xl font-semibold">Email support</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          For account, project, or payment questions, send us a message any time.
        </p>
      </div>
      <form
        className="rounded-3xl border border-border bg-card p-6 shadow-elevated sm:p-8"
        onSubmit={(event) => void submit(event)}
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-semibold">Send a message</h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Your name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
            />
          </label>
          <label className="text-sm font-medium">
            Email address
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
            />
          </label>
        </div>
        <label className="mt-4 block text-sm font-medium">
          Subject
          <input
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Message
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="mt-2 w-full rounded-lg border border-input bg-background p-3 text-sm"
          />
        </label>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{sent}</p>
          <Button type="submit" disabled={sending} className="bg-cta text-cta-foreground">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </div>
      </form>
    </section>
  );
}
