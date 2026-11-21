import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export type PublicFaqItem = {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
};

export type PublicFaqCategory = {
  cat: string;
  items: PublicFaqItem[];
};

export async function GET() {
  try {
    const faqs = await db.faq.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        category: true,
        question: true,
        answer: true,
        displayOrder: true,
      },
    });

    const categoryMap = new Map<string, PublicFaqItem[]>();
    const categoryOrder: string[] = [];

    for (const faq of faqs) {
      const cat = faq.category?.trim() || "General";
      if (!categoryMap.has(cat)) {
        categoryOrder.push(cat);
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        displayOrder: faq.displayOrder,
      });
    }

    const categories: PublicFaqCategory[] = categoryOrder.map((cat) => ({
      cat,
      items: categoryMap.get(cat) || [],
    }));

    return NextResponse.json(
      { categories, total: faqs.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      },
    );
  } catch (err) {
    console.error("[FAQ API] Error loading public FAQs:", err);
    return NextResponse.json({ error: "Failed to load FAQs", categories: [], total: 0 }, { status: 500 });
  }
}
