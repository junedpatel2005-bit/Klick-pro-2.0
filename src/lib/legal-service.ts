import "server-only";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  LEGAL_DOCUMENT_META,
  type LegalDocumentData,
  type LegalDocumentKey,
  type LegalDocumentsMap,
  type LegalRuleItem,
} from "@/lib/legal-content";

interface StoredLegalPayload {
  description?: string;
  rules?: Array<{ id?: string; title?: string; body?: string }>;
}

function parseStoredPayload(rawContent: string, slug: LegalDocumentKey): {
  description: string;
  rules: LegalRuleItem[];
} {
  const meta = LEGAL_DOCUMENT_META[slug];
  if (!rawContent?.trim()) {
    return { description: meta.defaultDescription, rules: [] };
  }

  try {
    const parsed = JSON.parse(rawContent) as StoredLegalPayload;
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.rules)) {
      const rules = parsed.rules
        .map((rule) => ({
          id: typeof rule.id === "string" && rule.id.trim() ? rule.id.trim() : randomUUID(),
          title: typeof rule.title === "string" ? rule.title.trim() : "",
          body: typeof rule.body === "string" ? rule.body.trim() : "",
        }))
        .filter((rule) => rule.title.length > 0 || rule.body.length > 0);
      return {
        description:
          typeof parsed.description === "string"
            ? parsed.description
            : meta.defaultDescription,
        rules,
      };
    }
  } catch {
    // Non-JSON legacy plain text fallback as a single rule
    return {
      description: meta.defaultDescription,
      rules: [{ id: "legacy-content", title: meta.defaultTitle, body: rawContent.trim() }],
    };
  }

  return { description: meta.defaultDescription, rules: [] };
}

function hydrateRow(
  slug: LegalDocumentKey,
  row?: { title: string; content: string; updatedAt: Date } | null,
): LegalDocumentData {
  const meta = LEGAL_DOCUMENT_META[slug];
  const parsed = row ? parseStoredPayload(row.content, slug) : { description: meta.defaultDescription, rules: [] };
  return {
    slug,
    eyebrow: meta.eyebrow,
    title: row?.title?.trim() || meta.defaultTitle,
    description: parsed.description,
    rules: parsed.rules,
    updatedAt: row?.updatedAt?.toISOString(),
  };
}

function revalidateLegalRoutes() {
  try {
    revalidatePath("/terms");
    revalidatePath("/privacy-policy");
    revalidatePath("/signup");
    revalidatePath("/login");
    revalidatePath("/admin/legal");
  } catch {
    // Ignore revalidation outside request context
  }
}

export async function getLegalDocument(slug: LegalDocumentKey): Promise<LegalDocumentData> {
  const row = await db.legalPage
    .findUnique({
      where: { slug },
      select: { title: true, content: true, updatedAt: true },
    })
    .catch(() => null);
  return hydrateRow(slug, row);
}

export async function getAllLegalDocuments(): Promise<LegalDocumentsMap> {
  const rows = await db.legalPage
    .findMany({
      where: { slug: { in: ["terms", "privacy"] } },
      select: { slug: true, title: true, content: true, updatedAt: true },
    })
    .catch(() => []);

  const map = new Map(rows.map((r) => [r.slug, r]));
  return {
    terms: hydrateRow("terms", map.get("terms")),
    privacy: hydrateRow("privacy", map.get("privacy")),
  };
}

export async function saveLegalDocument(
  slug: LegalDocumentKey,
  data: { title: string; description: string; rules: LegalRuleItem[] },
): Promise<LegalDocumentData> {
  const cleanTitle = data.title.trim() || LEGAL_DOCUMENT_META[slug].defaultTitle;
  const payload: StoredLegalPayload = {
    description: data.description.trim(),
    rules: data.rules.map((r) => ({
      id: r.id || randomUUID(),
      title: r.title.trim(),
      body: r.body.trim(),
    })),
  };

  const saved = await db.legalPage.upsert({
    where: { slug },
    create: {
      slug,
      title: cleanTitle,
      content: JSON.stringify(payload),
      status: "PUBLISHED",
      updatedAt: new Date(),
    },
    update: {
      title: cleanTitle,
      content: JSON.stringify(payload),
      status: "PUBLISHED",
      updatedAt: new Date(),
    },
  });

  revalidateLegalRoutes();
  return hydrateRow(slug, saved);
}

export async function addLegalRule(
  slug: LegalDocumentKey,
  rule: { title: string; body: string },
): Promise<LegalDocumentData> {
  const current = await getLegalDocument(slug);
  const nextRules: LegalRuleItem[] = [
    ...current.rules,
    { id: randomUUID(), title: rule.title.trim(), body: rule.body.trim() },
  ];
  return saveLegalDocument(slug, {
    title: current.title,
    description: current.description,
    rules: nextRules,
  });
}

export async function updateLegalRule(
  slug: LegalDocumentKey,
  ruleId: string,
  rule: { title: string; body: string },
): Promise<LegalDocumentData | null> {
  const current = await getLegalDocument(slug);
  const exists = current.rules.some((item) => item.id === ruleId);
  if (!exists) return null;

  const nextRules = current.rules.map((item) =>
    item.id === ruleId
      ? { id: item.id, title: rule.title.trim(), body: rule.body.trim() }
      : item,
  );
  return saveLegalDocument(slug, {
    title: current.title,
    description: current.description,
    rules: nextRules,
  });
}

export async function deleteLegalRule(
  slug: LegalDocumentKey,
  ruleId: string,
): Promise<LegalDocumentData | null> {
  const current = await getLegalDocument(slug);
  const nextRules = current.rules.filter((item) => item.id !== ruleId);
  if (nextRules.length === current.rules.length) return null;

  return saveLegalDocument(slug, {
    title: current.title,
    description: current.description,
    rules: nextRules,
  });
}
