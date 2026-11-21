"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Sparkles,
  Search,
  Home,
  Building2,
  Factory,
  HeartPulse,
  GraduationCap,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Truck,
  Shield,
  FolderTree,
  MapPin,
  Globe,
  Wallet,
  ArrowRight,
  HelpCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import type { CompleteCategoryHierarchy, HierarchyCategory } from "@/lib/queries/categories-hierarchy";
import { capitalizeWords } from "@/lib/utils";

const MASTER_SECTIONS = [
  {
    segment: "RESIDENTIAL",
    id: "residential",
    title: "Residential Services",
    icon: Home,
    blurb: "Home repairs, cleaning, renovation, appliances and household services.",
  },
  {
    segment: "COMMERCIAL",
    id: "commercial",
    title: "Commercial Services",
    icon: Building2,
    blurb: "Offices, shops, hotels and corporate business support services.",
  },
  {
    segment: "INDUSTRIAL",
    id: "industrial",
    title: "Industrial Services",
    icon: Factory,
    blurb: "Factories, plants, warehouses, fabrication and heavy-duty engineering.",
  },
  {
    segment: "HEALTH_CARE",
    id: "healthcare",
    title: "Health Care",
    icon: HeartPulse,
    blurb: "Home visits, nursing, physiotherapy, testing and medical equipment support.",
  },
  {
    segment: "PERSONAL_CARE",
    id: "personalcare",
    title: "Personal Care & Home Services",
    icon: Sparkles,
    blurb: "Wellness, styling, fitness coaching, housekeeping and specialized domestic help.",
  },
  {
    segment: "EDUCATION",
    id: "education",
    title: "Education & Training",
    icon: GraduationCap,
    blurb: "Tutoring, languages, exam preparation, vocational skills and career development.",
  },
];

const FALLBACK_CATEGORIES = [
  // Residential
  { id: 101, name: "Home Cleaning & Housekeeping", segment: "RESIDENTIAL", subs: ["Regular Cleaning", "Deep Cleaning", "Kitchen Cleaning", "Sofa Cleaning"] },
  { id: 102, name: "Electrical Services", segment: "RESIDENTIAL", subs: ["Switchboards", "Wiring Repairs", "Appliance Install", "Inverters"] },
  { id: 103, name: "Plumbing", segment: "RESIDENTIAL", subs: ["Pipe Leaks", "Taps & Showers", "Drainage", "Water Tanks"] },
  { id: 104, name: "AC & HVAC", segment: "RESIDENTIAL", subs: ["AC Servicing", "Installation", "Gas Refill", "Duct Cleaning"] },
  { id: 105, name: "Carpentry", segment: "RESIDENTIAL", subs: ["Door Locks", "Furniture Repair", "Custom Cabinets", "Wood Polishing"] },
  { id: 106, name: "Painting & Wall Services", segment: "RESIDENTIAL", subs: ["Interior Painting", "Waterproofing", "Exterior Painting", "Texture Wall"] },

  // Commercial
  { id: 201, name: "Office Interiors & Fit-Out", segment: "COMMERCIAL", subs: ["Workstations", "False Ceilings", "Glass Partitions", "Soundproofing"] },
  { id: 202, name: "Commercial Electrical & Lighting", segment: "COMMERCIAL", subs: ["Server Room Power", "Commercial Lighting", "UPS Backup", "Generator Sync"] },
  { id: 203, name: "Facility Maintenance & Upkeep", segment: "COMMERCIAL", subs: ["Corporate Janitorial", "Waste Management", "Pest Control", "Lift Maintenance"] },

  // Industrial
  { id: 301, name: "Machinery Maintenance", segment: "INDUSTRIAL", subs: ["Hydraulic Overhauls", "Motor Rewinding", "Preventive Audits", "Compressors"] },
  { id: 302, name: "Welding & Heavy Fabrication", segment: "INDUSTRIAL", subs: ["TIG/MIG Welding", "Structural Steel", "Pressure Vessels", "Piping Racks"] },
  { id: 303, name: "Industrial Electrical & Automation", segment: "INDUSTRIAL", subs: ["PLC Panels", "VFD Controls", "High-Voltage Substations", "SCADA Integration"] },

  // Health Care
  { id: 401, name: "Home Nursing & Patient Care", segment: "HEALTH_CARE", subs: ["Post-Surgery Nursing", "Elderly Care", "ICU at Home", "Medication Setup"] },
  { id: 402, name: "Physiotherapy & Rehabilitation", segment: "HEALTH_CARE", subs: ["Orthopedic Physio", "Stroke Rehab", "Sports Injury", "Geriatric Therapy"] },
  { id: 403, name: "Medical Equipment Support", segment: "HEALTH_CARE", subs: ["Oxygen Concentrators", "Hospital Beds", "Wheelchair Support", "Ventilators"] },

  // Personal Care
  { id: 501, name: "Salon & Styling at Home", segment: "PERSONAL_CARE", subs: ["Hair Styling & Cut", "Facials & Skincare", "Manicure/Pedicure", "Bridal Makeup"] },
  { id: 502, name: "Spa & Wellness Therapy", segment: "PERSONAL_CARE", subs: ["Deep Tissue Massage", "Aromatherapy", "Stress Relief", "Foot Reflexology"] },
  { id: 503, name: "Fitness & Personal Training", segment: "PERSONAL_CARE", subs: ["Weight Loss Coach", "Yoga Instructor", "Strength Conditioning", "Diet Planning"] },

  // Education
  { id: 601, name: "Academic Tutoring (K-12)", segment: "EDUCATION", subs: ["Math & Physics", "Science & Chemistry", "CBSE/ICSE Coaching", "English Language"] },
  { id: 602, name: "Competitive Exam Preparation", segment: "EDUCATION", subs: ["IIT-JEE Prep", "NEET Medical", "UPSC Coaching", "CA Foundation"] },
  { id: 603, name: "Language & Skill Training", segment: "EDUCATION", subs: ["Spoken English", "French / German", "Coding & Python", "Public Speaking"] },
];

// Rich keyword synonyms and stem dictionary so users searching for professions,
// common terms, or colloquial phrases instantly match the catalog.
const SYNONYM_MAP: Record<string, string[]> = {
  plumber: ["plumbing", "pipe", "tap", "drain", "water tank", "leak"],
  plumbers: ["plumbing", "pipe", "tap", "drain", "water tank", "leak"],
  plumbing: ["plumber", "pipe", "tap", "drain", "water tank", "leak"],
  pipe: ["plumbing", "plumber", "drain", "pipe leaks"],
  tap: ["plumbing", "plumber", "taps & showers", "faucet"],
  electrician: ["electrical", "wiring", "switchboard", "inverter", "power", "lighting"],
  electricians: ["electrical", "wiring", "switchboard", "inverter", "power", "lighting"],
  electrical: ["electrician", "wiring", "switchboard", "inverter", "power", "lighting"],
  wiring: ["electrical", "electrician", "wiring repairs", "wire"],
  carpenter: ["carpentry", "furniture", "wood", "cabinet", "door locks", "polishing"],
  carpenters: ["carpentry", "furniture", "wood", "cabinet", "door locks", "polishing"],
  carpentry: ["carpenter", "furniture", "wood", "cabinet", "door locks", "polishing"],
  painter: ["painting", "wall", "waterproofing", "texture wall", "paint"],
  painters: ["painting", "wall", "waterproofing", "texture wall", "paint"],
  painting: ["painter", "wall", "waterproofing", "texture wall", "paint"],
  cleaner: ["cleaning", "housekeeping", "maid", "sofa", "kitchen cleaning", "deep cleaning"],
  cleaners: ["cleaning", "housekeeping", "maid", "sofa", "kitchen cleaning", "deep cleaning"],
  cleaning: ["cleaner", "housekeeping", "maid", "sofa", "kitchen cleaning", "deep cleaning"],
  maid: ["cleaning", "housekeeping", "home services"],
  ac: ["ac", "air conditioner", "hvac", "cooling", "gas refill", "duct cleaning"],
  hvac: ["ac", "air conditioner", "cooling", "duct cleaning"],
  mechanic: ["machinery", "motor", "engine", "hydraulic", "compressor"],
  welder: ["welding", "fabrication", "structural steel", "pressure vessels"],
  welding: ["welder", "fabrication", "structural steel", "pressure vessels"],
  nurse: ["nursing", "patient care", "elderly care", "post-surgery nursing", "icu at home"],
  nursing: ["nurse", "patient care", "elderly care", "post-surgery nursing", "icu at home"],
  physio: ["physiotherapy", "rehabilitation", "stroke rehab", "sports injury"],
  physiotherapist: ["physiotherapy", "rehabilitation", "stroke rehab", "sports injury"],
  physiotherapy: ["physio", "rehabilitation", "stroke rehab", "sports injury"],
  doctor: ["health care", "home visits", "medical equipment", "nursing", "testing"],
  tutor: ["tutoring", "coaching", "math", "physics", "science", "cbse", "icse", "english"],
  tutors: ["tutoring", "coaching", "math", "physics", "science", "cbse", "icse", "english"],
  tutoring: ["tutor", "coaching", "math", "physics", "science", "cbse", "icse", "english"],
  teacher: ["tutoring", "coaching", "academic", "education"],
  coaching: ["exam preparation", "iit-jee", "neet", "upsc", "ca foundation", "tutoring"],
  salon: ["salon & styling", "hair styling", "facials", "skincare", "makeup", "bridal"],
  spa: ["spa & wellness", "massage", "aromatherapy", "reflexology"],
  fitness: ["fitness & personal training", "weight loss", "yoga", "gym", "trainer"],
  yoga: ["fitness", "trainer", "wellness", "yoga instructor"],
  mover: ["packers & movers", "truck", "transport", "shifting"],
  packers: ["packers & movers", "truck", "transport", "shifting"],
  pest: ["pest control", "termites", "cockroach", "fumigation", "rodent"],
};

function matchesQuery(text: string, q: string): boolean {
  if (!q) return true;
  const target = text.toLowerCase();
  const query = q.trim().toLowerCase();

  // Direct substring check
  if (target.includes(query)) return true;

  // Word-by-word with synonyms & stemming
  const words = query.split(/\s+/).filter(Boolean);
  for (const w of words) {
    if (target.includes(w)) return true;

    // Check mapped synonyms
    const syns = SYNONYM_MAP[w];
    if (syns && syns.some((syn) => target.includes(syn))) return true;

    // Stem check (remove common suffixes like ing, ers, er, ed, s)
    const stem = w.replace(/(ing|ers|er|ed|s)$/, "");
    if (stem.length >= 3 && target.includes(stem)) return true;
  }
  return false;
}

function getCategoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("clean") || n.includes("housekeep") || n.includes("sparkle")) return Sparkles;
  if (n.includes("electric") || n.includes("wire") || n.includes("power") || n.includes("zap")) return Zap;
  if (n.includes("plumb") || n.includes("pipe") || n.includes("leak") || n.includes("water")) return Wrench;
  if (n.includes("paint") || n.includes("wall")) return Paintbrush;
  if (n.includes("carpent") || n.includes("wood") || n.includes("furniture") || n.includes("hammer")) return Hammer;
  if (n.includes("move") || n.includes("pack") || n.includes("truck") || n.includes("transport")) return Truck;
  if (n.includes("secur") || n.includes("cctv") || n.includes("guard") || n.includes("safety")) return Shield;
  if (n.includes("commercial") || n.includes("office") || n.includes("business")) return Building2;
  if (n.includes("industrial") || n.includes("factory") || n.includes("machin") || n.includes("plant")) return Factory;
  if (n.includes("health") || n.includes("nurse") || n.includes("physio") || n.includes("therap")) return HeartPulse;
  if (n.includes("edu") || n.includes("tutor") || n.includes("teach") || n.includes("coach")) return GraduationCap;
  if (n.includes("home") || n.includes("house")) return Home;
  return FolderTree;
}

export type CatalogSub = {
  id: number;
  name: string;
  slug: string;
  matched: boolean;
};

export type CatalogCategoryItem = {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  segment: string;
  subs: CatalogSub[];
};

export type CatalogSectionItem = {
  segment: string;
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  blurb: string;
  categories: CatalogCategoryItem[];
};

export function ServicesCatalog({ data }: { data: CompleteCategoryHierarchy }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Map subcategories by categoryId for fast lookup
  const subcategoriesByCat = useMemo(() => {
    const map = new Map<number, Array<{ id: number; name: string; slug: string }>>();
    if (data?.subcategories) {
      for (const sub of data.subcategories) {
        const arr = map.get(sub.categoryId) ?? [];
        arr.push({ id: sub.id, name: sub.name, slug: sub.slug });
        map.set(sub.categoryId, arr);
      }
    }
    return map;
  }, [data?.subcategories]);

  // Filter master sections and categories based on search
  const filteredSections: CatalogSectionItem[] = useMemo(() => {
    const q = searchQuery.trim();
    const categories = data?.categories && data.categories.length > 0 ? data.categories : null;

    if (!categories) {
      // Use fallback preview categories for initial or empty state
      return MASTER_SECTIONS.map((sec) => {
        const secCategories = FALLBACK_CATEGORIES.filter((c) => c.segment === sec.segment);
        const matchedCategories: CatalogCategoryItem[] = [];

        for (const cat of secCategories) {
          const matchCatName = matchesQuery(cat.name, q);
          const matchSecTitle = matchesQuery(sec.title, q);
          const matchCat = !q || matchCatName || matchSecTitle;

          const matchedSubs = matchCat
            ? cat.subs
            : cat.subs.filter((s) => matchesQuery(s, q));

          if (matchedSubs.length > 0 || matchCat) {
            matchedCategories.push({
              id: cat.id,
              name: cat.name,
              slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              description: "",
              iconName: "FolderTree",
              segment: cat.segment,
              subs: matchedSubs.map((s, idx) => ({
                id: cat.id * 10 + idx,
                name: s,
                slug: s.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                matched: Boolean(q && matchesQuery(s, q)),
              })),
            });
          }
        }

        return {
          ...sec,
          categories: matchedCategories,
        };
      }).filter((sec) => sec.categories.length > 0);
    }

    return MASTER_SECTIONS.map((sec) => {
      const secCategories = categories.filter((cat) => cat.segment === sec.segment);
      const matchedCategories: CatalogCategoryItem[] = [];

      for (const cat of secCategories) {
        const subs = subcategoriesByCat.get(cat.id) ?? cat.previewSubcategories ?? [];
        const matchCatName = matchesQuery(cat.name, q);
        const matchCatDesc = matchesQuery(cat.description || "", q);
        const matchSecTitle = matchesQuery(sec.title, q);
        const matchCat = !q || matchCatName || matchCatDesc || matchSecTitle;

        const matchedSubs = matchCat
          ? subs
          : subs.filter((s) => matchesQuery(s.name, q));

        if (matchedSubs.length > 0 || matchCat) {
          matchedCategories.push({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description || "",
            iconName: cat.iconName || "FolderTree",
            segment: cat.segment,
            subs: (matchedSubs.length > 0 ? matchedSubs : subs).map((s) => ({
              id: s.id,
              name: s.name,
              slug: s.slug,
              matched: Boolean(q && matchesQuery(s.name, q)),
            })),
          });
        }
      }

      return {
        ...sec,
        categories: matchedCategories,
      };
    }).filter((sec) => sec.categories.length > 0);
  }, [data?.categories, subcategoriesByCat, searchQuery]);

  const totalResults = filteredSections.reduce((acc, sec) => acc + sec.categories.length, 0);
  const totalSubResults = filteredSections.reduce(
    (acc, sec) => acc + sec.categories.reduce((cAcc, cat) => cAcc + cat.subs.length, 0),
    0,
  );
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-[#1748b5]">
      {/* 1. HERO WITH LIVE SEARCH BAR */}
      <section className="gradient-hero border-b border-slate-200/60">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20 text-center sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
            <Sparkles className="h-3.5 w-3.5" /> Service Directory
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
            Every Service, <span className="text-brand">One Marketplace</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Browse residential, commercial, industrial, health care, personal care and education services. Pick a category, choose a specialty and post your job in minutes.
          </p>

          {/* Interactive Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const el = document.getElementById("directory");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative mx-auto mt-8 max-w-xl"
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. plumber, electrician, AC, carpentry, tutor, cleaning..."
              className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-12 pr-11 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Live Search Status Bar */}
          {isSearching && (
            <div className="mx-auto mt-4 flex max-w-xl items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-2 text-xs font-semibold text-blue-900 shadow-2xs">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Found {totalResults} {totalResults === 1 ? "category" : "categories"} ({totalSubResults} specialties) for &quot;{searchQuery}&quot;
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-blue-700 underline hover:text-blue-900"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. MASTER CATEGORIES TOP GRID (Shown when NOT actively filtering so user gets full overview) */}
      {!isSearching && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MASTER_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="group rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:border-brand hover:shadow-md"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand transition group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 font-display text-lg font-bold text-[#0b1f4d] group-hover:text-brand transition">
                    {sec.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {sec.blurb}
                  </p>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. CATEGORY DIRECTORY SECTIONS */}
      <div id="directory">
        {totalResults === 0 ? (
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
              <HelpCircle className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">
                No Matching Services Found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Cannot find what you are looking for? Try searching by profession (e.g. plumber, electrician, painter) or post your custom requirement.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear Search
                </button>
                <Link
                  href="/contact"
                  className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-hover"
                >
                  Tell Us What You Need
                </Link>
              </div>
            </div>
          </div>
        ) : (
          filteredSections.map((sec, idx) => {
            const Icon = sec.icon;
            const isAlt = idx % 2 === 1;
            const bgClass = isAlt ? "border-y border-slate-200/70 bg-white" : "";
            const cardBg = isAlt ? "bg-slate-50/60" : "bg-white shadow-sm";

            return (
              <section key={sec.id} id={sec.id} className={`scroll-mt-20 ${bgClass}`}>
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-brand">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h2 className="font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
                        {sec.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {sec.blurb}
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sec.categories.map((cat) => {
                      const CatIcon = getCategoryIcon(cat.name);
                      return (
                        <article
                          key={cat.id}
                          className={`rounded-2xl border border-slate-200/90 ${cardBg} p-6 transition hover:border-slate-300 hover:shadow-md`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-brand">
                              <CatIcon className="h-5 w-5" />
                            </span>
                            <h3 className="font-display text-lg font-bold text-[#0b1f4d]">
                              {capitalizeWords(cat.name)}
                            </h3>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {cat.subs.map((s) => (
                              <Link
                                key={s.id}
                                href={`/post-job?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(s.name)}`}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                  s.matched
                                    ? "border-brand bg-blue-50 font-bold text-brand shadow-2xs ring-1 ring-brand/30"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-brand hover:bg-blue-50 hover:text-brand"
                                }`}
                              >
                                {capitalizeWords(s.name)}
                              </Link>
                            ))}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* 4. NOT SURE WHERE YOUR JOB FITS */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#0b1f4d] md:text-4xl">
              Not Sure Where Your Job Fits?
            </h2>
            <p className="mt-3 text-slate-500">
              Post it anyway. Describe what you need and matching verified professionals will reach out with itemized proposals.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 text-center">
              <MapPin className="mx-auto h-7 w-7 text-brand" />
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">On-Site</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Professionals who visit your home, shop, facility or industrial plant.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 text-center">
              <Globe className="mx-auto h-7 w-7 text-brand" />
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Remote</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Specialized digital and consulting experts who deliver online from anywhere.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-7 text-center">
              <Wallet className="mx-auto h-7 w-7 text-brand" />
              <h3 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Online or Offline Pay</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Milestone escrow protection for online jobs, or settle in person on completion.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/post-job"
              className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cta/90"
            >
              Post a Job &mdash; It&apos;s Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicesCatalog;
