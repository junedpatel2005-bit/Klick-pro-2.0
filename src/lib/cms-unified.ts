import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { readCmsContent, writeCmsContent, defaultContent as defaultAbout } from "@/lib/cms-file";
import { readHomeContent, writeHomeContent, type HomeContent, type HomeFeature } from "@/lib/home-cms-file";
import {
  marketingPageIds,
  readMarketingContent,
  writeMarketingContent,
  marketingDefaults,
  type MarketingPageId,
} from "@/lib/marketing-cms";

export type CmsBox = {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  link?: string;
  buttonText?: string;
  buttonLink?: string;
};

export type CmsSection = {
  id: string;
  title?: string;
  subtitle?: string;
  type?: "boxes" | "text" | "banner" | "faq";
  boxes?: CmsBox[];
  content?: string;
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
  sections?: CmsSection[];
  homeContent?: HomeContent;
  cta?: {
    title?: string;
    primaryBtn?: string;
    primaryLink?: string;
    secondaryBtn?: string;
    secondaryLink?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  updatedAt?: string;
};

export type CmsPageSummary = {
  slug: string;
  title: string;
  href: string;
  isCustom: boolean;
};

export const STANDARD_CMS_PAGES: Array<{ slug: string; title: string; href: string }> = [
  { slug: "home", title: "Home", href: "/" },
  { slug: "about", title: "About Us", href: "/about" },
  { slug: "how-it-works", title: "How It Works", href: "/how-it-works" },
  { slug: "services", title: "Services", href: "/services" },
  { slug: "for-clients", title: "For Clients", href: "/for-clients" },
  { slug: "for-professionals", title: "For Professionals", href: "/for-professionals" },
  { slug: "pricing", title: "Pricing", href: "/pricing" },
  { slug: "faq", title: "FAQ", href: "/faq" },
  { slug: "contact", title: "Contact", href: "/contact" },
  { slug: "professional-home", title: "Professional Home", href: "/professional-home" },
];

const customPagesFile = path.resolve(process.cwd(), "data", "cms-custom-pages.json");

async function ensureCustomPagesFile(): Promise<Record<string, CmsPageData>> {
  await mkdir(path.dirname(customPagesFile), { recursive: true });
  try {
    const raw = await readFile(customPagesFile, "utf8");
    return JSON.parse(raw) as Record<string, CmsPageData>;
  } catch {
    await writeFile(customPagesFile, "{}\n", "utf8");
    return {};
  }
}

async function writeCustomPagesFile(pages: Record<string, CmsPageData>) {
  await mkdir(path.dirname(customPagesFile), { recursive: true });
  await writeFile(customPagesFile, JSON.stringify(pages, null, 2) + "\n", "utf8");
}

export function normalizeSlug(rawSlug: string): string {
  let s = rawSlug.trim().toLowerCase();
  s = s.replace(/^\/+/, "").replace(/\/+$/, "");
  s = s.replace(/\.html$/, "");
  if (!s || s === "index" || s === "home") return "home";
  return s;
}

export async function getAllCmsPages(): Promise<CmsPageSummary[]> {
  const standard: CmsPageSummary[] = STANDARD_CMS_PAGES.map((p) => ({
    ...p,
    isCustom: false,
  }));

  const customPages = await ensureCustomPagesFile();
  const customList: CmsPageSummary[] = Object.values(customPages).map((cp) => ({
    slug: cp.slug,
    title: cp.title,
    href: `/p/${cp.slug}`,
    isCustom: true,
  }));

  // Also check database if custom pages exist there
  try {
    const dbPages = await db.cmsPage.findMany({
      select: { slug: true, title: true },
    });
    for (const dbp of dbPages) {
      const cleanSlug = normalizeSlug(dbp.slug);
      if (
        !standard.some((s) => s.slug === cleanSlug) &&
        !customList.some((c) => c.slug === cleanSlug)
      ) {
        customList.push({
          slug: cleanSlug,
          title: dbp.title || cleanSlug,
          href: `/p/${cleanSlug}`,
          isCustom: true,
        });
      }
    }
  } catch {
    // Database fallback to JSON
  }

  return [...standard, ...customList];
}

export async function getCmsPage(slugInput: string): Promise<CmsPageData> {
  const slug = normalizeSlug(slugInput);

  // 1. HOME PAGE
  if (slug === "home") {
    const home = await readHomeContent();
    return {
      slug: "home",
      title: "Home",
      isCustom: false,
      hero: {
        eyebrow: home.hero.eyebrow,
        title: home.hero.title,
        description: home.hero.description,
        primaryCta: home.hero.primaryCta,
        primaryCtaLink: "/services",
        secondaryCta: home.hero.secondaryCta,
        secondaryCtaLink: "/post-job",
      },
      homeContent: home,
      boxesSection: {
        title: home.whyChooseUsSection?.title || "Platform Capabilities & Features",
        subtitle: home.whyChooseUsSection?.description || "Everything you need to find, hire, and manage verified professionals.",
      },
      boxes: (home.features || []).map((f: HomeFeature) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        icon: f.icon,
      })),
      seo: {
        metaTitle: "Klick-Pro | Verified Professional Marketplace & Milestone Escrow",
        metaDescription:
          "Connect with verified service professionals for residential, commercial, and industrial projects with milestone escrow protection.",
        keywords: "local services, verified professionals, escrow, home repair, commercial contractors",
      },
      updatedAt: new Date().toISOString(),
    };
  }

  // 2. ABOUT US PAGE
  if (slug === "about") {
    const about = await readCmsContent().catch(() => defaultAbout);
    return {
      slug: "about",
      title: "About Us",
      isCustom: false,
      hero: {
        eyebrow: about.hero.label,
        title: about.hero.title,
        description: about.hero.description,
        primaryCta: "Explore Services",
        primaryCtaLink: "/services",
        secondaryCta: "Join as Professional",
        secondaryCtaLink: "/for-professionals",
      },
      boxesSection: {
        title: "Why Clients & Professionals Trust Klick-Pro",
        subtitle: "Built from the ground up for safety, transparent pricing, and guaranteed milestones.",
      },
      boxes: (about.cards || []).map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        icon: c.icon,
      })),
      seo: {
        metaTitle: "About Klick-Pro | Mission, Values & Platform Verification",
        metaDescription:
          "Learn how Klick-Pro protects clients and professionals with verified identities and escrow safeguards.",
        keywords: "about klick-pro, trust, escrow, service guarantee, verified contractors",
      },
      updatedAt: about.updatedAt || new Date().toISOString(),
    };
  }

  // 3. MARKETING PAGES
  if (marketingPageIds.includes(slug as MarketingPageId)) {
    const pageId = slug as MarketingPageId;
    const m = await readMarketingContent(pageId).catch(() => marketingDefaults[pageId]);
    const def = STANDARD_CMS_PAGES.find((p) => p.slug === slug);
    return {
      slug,
      title: def?.title || slug,
      isCustom: false,
      hero: {
        eyebrow: m.hero.label,
        title: m.hero.title,
        description: m.hero.description,
        primaryCta: "Get Started Now",
        primaryCtaLink: slug === "for-professionals" ? "/register?role=PROFESSIONAL" : "/post-job",
        secondaryCta: "Learn More",
        secondaryCtaLink: slug === "for-professionals" ? "/professional-home" : "/services",
      },
      boxesSection: {
        title: m.features?.title || "Key Features & Advantages",
        subtitle: m.features?.description || "How our verified platform works for you.",
      },
      boxes: (m.items || []).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        icon: item.icon,
        buttonText: item.buttonText,
        buttonLink: item.buttonLink,
      })),
      cta: m.cta,
      seo: {
        metaTitle: `${def?.title || slug} | Klick-Pro Verified Marketplace`,
        metaDescription: m.hero.description,
        keywords: `klick-pro, ${slug}, verified professionals, escrow`,
      },
      updatedAt: new Date().toISOString(),
    };
  }

  // 4. CHECK DATABASE CMS PAGES
  try {
    const dbPage = await db.cmsPage.findUnique({
      where: { slug },
    });
    if (dbPage) {
      let parsedSections: Record<string, unknown> = {};
      try {
        parsedSections = JSON.parse(dbPage.sections || "{}");
      } catch {
        parsedSections = {};
      }

      const hero = (parsedSections.hero as Record<string, string>) || {
        eyebrow: "PAGE HIGHLIGHT",
        title: dbPage.title,
        description: dbPage.content || "Welcome to this page.",
      };

      const boxes = Array.isArray(parsedSections.boxes)
        ? (parsedSections.boxes as CmsBox[])
        : [];

      return {
        slug: dbPage.slug,
        title: dbPage.title,
        isCustom: true,
        hero: {
          eyebrow: hero.eyebrow || "KLICK-PRO",
          title: hero.title || dbPage.title,
          description: hero.description || dbPage.content || "",
          primaryCta: hero.primaryCta || "Contact Us",
          primaryCtaLink: hero.primaryCtaLink || "/contact",
          secondaryCta: hero.secondaryCta || "Home",
          secondaryCtaLink: hero.secondaryCtaLink || "/",
        },
        boxesSection: {
          title: (parsedSections.boxesTitle as string) || "Highlighted Features",
          subtitle: (parsedSections.boxesSubtitle as string) || "Key information and benefits.",
        },
        boxes,
        seo: {
          metaTitle: dbPage.metaTitle || `${dbPage.title} | Klick-Pro`,
          metaDescription: dbPage.metaDescription || dbPage.content,
          keywords: dbPage.keywords || "",
        },
        updatedAt: dbPage.updatedAt?.toISOString() || new Date().toISOString(),
      };
    }
  } catch {
    // Database query failed, check JSON custom pages
  }

  // 5. CHECK JSON CUSTOM PAGES
  const customPages = await ensureCustomPagesFile();
  if (customPages[slug]) {
    return customPages[slug];
  }

  // Fallback default page template
  return {
    slug,
    title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
    isCustom: true,
    hero: {
      eyebrow: "NEW PAGE",
      title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
      description: "Manage this page content directly in the CMS visual editor.",
      primaryCta: "Get Started",
      primaryCtaLink: "/post-job",
      secondaryCta: "Learn More",
      secondaryCtaLink: "/services",
    },
    boxesSection: {
      title: "Key Highlights",
      subtitle: "Customize or reorder these content boxes in the visual editor.",
    },
    boxes: [
      {
        id: "box-1",
        title: "Verified Excellence",
        description: "Background-checked professionals delivering quality workmanship.",
        icon: "shield",
      },
      {
        id: "box-2",
        title: "Milestone Escrow",
        description: "Funds are released only when deliverables are fully approved.",
        icon: "briefcase",
      },
      {
        id: "box-3",
        title: "Dedicated Support",
        description: "24/7 responsive customer support and dispute mediation.",
        icon: "users",
      },
    ],
    seo: {
      metaTitle: `${slug} | Klick-Pro`,
      metaDescription: "Verified service marketplace with milestone escrow.",
      keywords: "klick-pro, services, verified",
    },
    updatedAt: new Date().toISOString(),
  };
}

export async function saveCmsPage(data: CmsPageData): Promise<boolean> {
  const slug = normalizeSlug(data.slug);
  const now = new Date();

  // 1. HOME PAGE
  if (slug === "home") {
    const existing = await readHomeContent();
    const homePayload = data.homeContent;
    await writeHomeContent({
      hero: {
        eyebrow: homePayload?.hero?.eyebrow || data.hero.eyebrow || existing.hero.eyebrow,
        title: homePayload?.hero?.title || data.hero.title || existing.hero.title,
        description: homePayload?.hero?.description || data.hero.description || existing.hero.description,
        primaryCta: homePayload?.hero?.primaryCta || data.hero.primaryCta || existing.hero.primaryCta,
        secondaryCta: homePayload?.hero?.secondaryCta || data.hero.secondaryCta || existing.hero.secondaryCta,
      },
      heroShowcase: homePayload?.heroShowcase ?? existing.heroShowcase,
      categoriesSection: homePayload?.categoriesSection ?? existing.categoriesSection,
      whyChooseUsSection: homePayload?.whyChooseUsSection ?? existing.whyChooseUsSection,
      features: (homePayload?.features && homePayload.features.length > 0)
        ? homePayload.features
        : (data.boxes && data.boxes.length > 0)
          ? data.boxes.map((b) => ({
              id: b.id,
              title: b.title,
              description: b.description,
              icon: b.icon,
            }))
          : existing.features,
      featuredProsSection: homePayload?.featuredProsSection ?? existing.featuredProsSection,
      ctaDualBanner: homePayload?.ctaDualBanner ?? existing.ctaDualBanner,
    });
    return true;
  }

  // 2. ABOUT US PAGE
  if (slug === "about") {
    await writeCmsContent({
      hero: {
        label: data.hero.eyebrow,
        title: data.hero.title,
        description: data.hero.description,
      },
      cards: data.boxes.map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        icon: (b.icon as "shield" | "handshake" | "award" | "briefcase" | "users") || "shield",
      })),
      sectionOrder: ["hero", "features"],
    });
    return true;
  }

  // 3. MARKETING PAGES
  if (marketingPageIds.includes(slug as MarketingPageId)) {
    const pageId = slug as MarketingPageId;
    await writeMarketingContent(pageId, {
      hero: {
        label: data.hero.eyebrow,
        title: data.hero.title,
        description: data.hero.description,
      },
      features: data.boxesSection
        ? {
            label: "Features",
            title: data.boxesSection.title || "",
            description: data.boxesSection.subtitle || "",
          }
        : undefined,
      items: data.boxes.map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        icon: b.icon,
        buttonText: b.buttonText,
        buttonLink: b.buttonLink,
      })),
      cta: data.cta,
    });
    return true;
  }

  // 4. CUSTOM PAGES - Persist to JSON file and Database
  const customPages = await ensureCustomPagesFile();
  customPages[slug] = {
    ...data,
    slug,
    isCustom: true,
    updatedAt: now.toISOString(),
  };
  await writeCustomPagesFile(customPages);

  try {
    const sectionsPayload = JSON.stringify({
      hero: data.hero,
      boxesSection: data.boxesSection,
      boxes: data.boxes,
      sections: data.sections || [],
    });

    await db.cmsPage.upsert({
      where: { slug },
      update: {
        title: data.title,
        content: data.hero.description,
        metaTitle: data.seo?.metaTitle || `${data.title} | Klick-Pro`,
        metaDescription: data.seo?.metaDescription || data.hero.description,
        keywords: data.seo?.keywords || "",
        sections: sectionsPayload,
        status: "PUBLISHED",
        updatedAt: now,
      },
      create: {
        title: data.title,
        slug,
        content: data.hero.description,
        metaTitle: data.seo?.metaTitle || `${data.title} | Klick-Pro`,
        metaDescription: data.seo?.metaDescription || data.hero.description,
        keywords: data.seo?.keywords || "",
        sections: sectionsPayload,
        status: "PUBLISHED",
        createdAt: now,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error("Database upsert for cmsPage failed, persisted to JSON:", error);
  }

  return true;
}

export async function createCustomCmsPage(title: string, rawSlug: string): Promise<CmsPageData> {
  const cleanSlug = rawSlug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!cleanSlug) throw new Error("Invalid page slug");

  const newPage: CmsPageData = {
    slug: cleanSlug,
    title,
    isCustom: true,
    hero: {
      eyebrow: "NEW PAGE",
      title,
      description: "Manage this page content directly in the CMS visual editor.",
      primaryCta: "Contact Us",
      primaryCtaLink: "/contact",
      secondaryCta: "Browse Services",
      secondaryCtaLink: "/services",
    },
    boxesSection: {
      title: "Page Highlights",
      subtitle: "Click on any text or box to customize.",
    },
    boxes: [
      {
        id: `box-${Date.now()}-1`,
        title: "Quality Deliverables",
        description: "Verified professionals vetted for track record and reliability.",
        icon: "shield",
      },
      {
        id: `box-${Date.now()}-2`,
        title: "Milestone Security",
        description: "Funds are protected in escrow until you approve the work.",
        icon: "briefcase",
      },
      {
        id: `box-${Date.now()}-3`,
        title: "Fast Collaboration",
        description: "Real-time communication, updates, and clear timelines.",
        icon: "users",
      },
    ],
    seo: {
      metaTitle: `${title} | Klick-Pro`,
      metaDescription: `Explore ${title} on Klick-Pro verified marketplace.`,
      keywords: `klick-pro, ${cleanSlug}`,
    },
    updatedAt: new Date().toISOString(),
  };

  await saveCmsPage(newPage);
  return newPage;
}

export async function deleteCustomCmsPage(slugInput: string): Promise<boolean> {
  const slug = normalizeSlug(slugInput);
  if (STANDARD_CMS_PAGES.some((p) => p.slug === slug)) {
    throw new Error("Cannot delete built-in marketplace page.");
  }

  const customPages = await ensureCustomPagesFile();
  delete customPages[slug];
  await writeCustomPagesFile(customPages);

  try {
    await db.cmsPage.delete({ where: { slug } });
  } catch {
    // Ignore if not in db
  }

  return true;
}
