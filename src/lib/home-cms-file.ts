import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  defaultHomeContent,
  defaultProfessionalHomeContent,
  type HomeContent,
  type HomeFeature,
  type HomeConfidenceMetric,
  type HomeCategoryItem,
} from "@/lib/home-cms-shared";

export { defaultHomeContent, defaultProfessionalHomeContent };
export type {
  HomeContent,
  HomeFeature,
  HomeConfidenceMetric,
  HomeCategoryItem,
};

const file = path.resolve(process.cwd(), "data", "cms-home.json");
const proFile = path.resolve(process.cwd(), "data", "cms-professional-home.json");
let cachedHomeContent: HomeContent | null = null;
let cachedProHomeContent: HomeContent | null = null;

function mergeHomeContent(parsed: Partial<HomeContent>, defaults: HomeContent): HomeContent {
  return {
    hero: {
      eyebrow: parsed.hero?.eyebrow ?? defaults.hero.eyebrow,
      title: parsed.hero?.title ?? defaults.hero.title,
      description: parsed.hero?.description ?? defaults.hero.description,
      primaryCta: parsed.hero?.primaryCta ?? defaults.hero.primaryCta,
      secondaryCta: parsed.hero?.secondaryCta ?? defaults.hero.secondaryCta,
    },
    heroShowcase: parsed.heroShowcase ?? defaults.heroShowcase,
    categoriesSection: parsed.categoriesSection ?? defaults.categoriesSection,
    whyChooseUsSection: parsed.whyChooseUsSection ?? defaults.whyChooseUsSection,
    features:
      Array.isArray(parsed.features) && parsed.features.length > 0
        ? parsed.features
        : defaults.features,
    featuredProsSection: parsed.featuredProsSection ?? defaults.featuredProsSection,
    ctaDualBanner: parsed.ctaDualBanner ?? defaults.ctaDualBanner,
  };
}

export async function readHomeContent(): Promise<HomeContent> {
  if (cachedHomeContent) return cachedHomeContent;

  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Partial<HomeContent>;
    cachedHomeContent = mergeHomeContent(parsed, defaultHomeContent);
    return cachedHomeContent;
  } catch {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(defaultHomeContent, null, 2) + "\n", "utf8");
    cachedHomeContent = defaultHomeContent;
    return cachedHomeContent;
  }
}

export async function writeHomeContent(value: HomeContent): Promise<HomeContent> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2) + "\n", "utf8");
  cachedHomeContent = value;
  return value;
}

export async function readProfessionalHomeContent(): Promise<HomeContent> {
  if (cachedProHomeContent) return cachedProHomeContent;

  try {
    const raw = await readFile(proFile, "utf8");
    const parsed = JSON.parse(raw) as Partial<HomeContent>;
    cachedProHomeContent = mergeHomeContent(parsed, defaultProfessionalHomeContent);
    return cachedProHomeContent;
  } catch {
    await mkdir(path.dirname(proFile), { recursive: true });
    await writeFile(proFile, JSON.stringify(defaultProfessionalHomeContent, null, 2) + "\n", "utf8");
    cachedProHomeContent = defaultProfessionalHomeContent;
    return cachedProHomeContent;
  }
}

export async function writeProfessionalHomeContent(value: HomeContent): Promise<HomeContent> {
  await mkdir(path.dirname(proFile), { recursive: true });
  await writeFile(proFile, JSON.stringify(value, null, 2) + "\n", "utf8");
  cachedProHomeContent = value;
  return value;
}
