import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  defaultHomeContent,
  type HomeContent,
  type HomeFeature,
  type HomeConfidenceMetric,
  type HomeCategoryItem,
} from "@/lib/home-cms-shared";

export { defaultHomeContent };
export type {
  HomeContent,
  HomeFeature,
  HomeConfidenceMetric,
  HomeCategoryItem,
};

const file = path.resolve(process.cwd(), "data", "cms-home.json");
let cachedHomeContent: HomeContent | null = null;

export async function readHomeContent(): Promise<HomeContent> {
  if (cachedHomeContent) return cachedHomeContent;

  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Partial<HomeContent>;
    const merged: HomeContent = {
      hero: {
        eyebrow: parsed.hero?.eyebrow ?? defaultHomeContent.hero.eyebrow,
        title: parsed.hero?.title ?? defaultHomeContent.hero.title,
        description: parsed.hero?.description ?? defaultHomeContent.hero.description,
        primaryCta: parsed.hero?.primaryCta ?? defaultHomeContent.hero.primaryCta,
        secondaryCta: parsed.hero?.secondaryCta ?? defaultHomeContent.hero.secondaryCta,
      },
      heroShowcase: parsed.heroShowcase ?? defaultHomeContent.heroShowcase,
      categoriesSection: parsed.categoriesSection ?? defaultHomeContent.categoriesSection,
      whyChooseUsSection: parsed.whyChooseUsSection ?? defaultHomeContent.whyChooseUsSection,
      features: Array.isArray(parsed.features) && parsed.features.length > 0 ? parsed.features : defaultHomeContent.features,
      featuredProsSection: parsed.featuredProsSection ?? defaultHomeContent.featuredProsSection,
      ctaDualBanner: parsed.ctaDualBanner ?? defaultHomeContent.ctaDualBanner,
    };
    cachedHomeContent = merged;
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
