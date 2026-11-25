import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";

const textsFile = path.resolve(process.cwd(), "data", "cms-page-texts.json");

type AllPageTextsFile = Record<string, Record<string, string>>;

async function readTextsFile(): Promise<AllPageTextsFile> {
  try {
    const raw = await readFile(textsFile, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as AllPageTextsFile) : {};
  } catch {
    return {};
  }
}

async function writeTextsFile(data: AllPageTextsFile): Promise<void> {
  await mkdir(path.dirname(textsFile), { recursive: true });
  await writeFile(textsFile, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/**
 * Loads saved full-page text overrides for a given CMS page slug.
 * Reads from PostgreSQL page_text_overrides and merges with JSON fallback.
 */
export async function readPageTexts(pagePath: string): Promise<Record<string, string>> {
  const fileData = await readTextsFile();
  const base: Record<string, string> = { ...(fileData[pagePath] ?? {}) };

  try {
    const rows = await db.pageTextOverride.findMany({
      where: { pagePath },
      select: { elementKey: true, text: true },
    });
    for (const row of rows) {
      base[row.elementKey] = row.text;
    }
  } catch {
    // Fall back gracefully to JSON file if DB is temporarily unavailable
  }

  return base;
}

/**
 * Persists full-page text overrides for a given CMS page slug
 * to both PostgreSQL (page_text_overrides) and JSON backup.
 */
export async function writePageTexts(
  pagePath: string,
  texts: Record<string, string>,
): Promise<void> {
  const cleanTexts: Record<string, string> = {};
  for (const [key, val] of Object.entries(texts)) {
    if (typeof val === "string") {
      cleanTexts[key] = val;
    }
  }

  const fileData = await readTextsFile();
  fileData[pagePath] = cleanTexts;
  await writeTextsFile(fileData);

  try {
    const entries = Object.entries(cleanTexts);
    if (entries.length === 0) return;

    await db.$transaction(
      entries.map(([elementKey, text]) =>
        db.pageTextOverride.upsert({
          where: {
            pagePath_elementKey: { pagePath, elementKey },
          },
          create: { pagePath, elementKey, text, updatedAt: new Date() },
          update: { text, updatedAt: new Date() },
        }),
      ),
    );
  } catch (err) {
    console.warn(`[CMS] Failed to sync page_text_overrides for "${pagePath}" to DB:`, err);
  }
}
