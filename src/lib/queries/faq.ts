import "server-only";
import { db } from "@/lib/db";

export type FAQItem = {
  id?: number;
  question: string;
  answer: string;
};

export type FAQCategory = {
  cat: string;
  items: FAQItem[];
};

export type FaqGroup = { title: string; items: { q: string; a: string }[] };

export async function getPublishedFaqCategories(): Promise<FAQCategory[]> {
  const faqs = await db.faq.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    select: { id: true, category: true, question: true, answer: true },
  });

  const order: string[] = [];
  const map = new Map<string, FAQCategory>();

  for (const faq of faqs) {
    const cat = faq.category?.trim() || "General";
    if (!map.has(cat)) {
      order.push(cat);
      map.set(cat, { cat, items: [] });
    }
    map.get(cat)!.items.push({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    });
  }

  return order
    .map((cat) => map.get(cat))
    .filter((item): item is FAQCategory => Boolean(item));
}

export async function getPublishedFaqGroups(): Promise<FaqGroup[]> {
  const categories = await getPublishedFaqCategories();
  return categories.map((c) => ({
    title: c.cat,
    items: c.items.map((i) => ({ q: i.question, a: i.answer })),
  }));
}
