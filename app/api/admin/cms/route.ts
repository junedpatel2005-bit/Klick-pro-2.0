import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sessionCookie, verifySession } from "@/lib/auth";
import {
  getAllCmsPages,
  getCmsPage,
  saveCmsPage,
  createCustomCmsPage,
  deleteCustomCmsPage,
  type CmsPageData,
} from "@/lib/cms-unified";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return false;
  try {
    return (await verifySession(token)).role === "ADMIN";
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    const page = url.searchParams.get("page");

    if (action === "list") {
      const pages = await getAllCmsPages();
      return NextResponse.json({ pages });
    }

    const pageData = await getCmsPage(page || "home");
    return NextResponse.json(pageData);
  } catch (err) {
    console.error("Failed to load CMS content:", err);
    return NextResponse.json({ error: "Unable to read CMS content." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid CMS content payload." }, { status: 400 });
    }

    // Support both direct CmsPageData or legacy { page, content } payload
    let pageData: CmsPageData;

    if ("slug" in body && "hero" in body && "boxes" in body) {
      pageData = body as unknown as CmsPageData;
    } else if ("page" in body && "content" in body) {
      const rawPage = String(body.page);
      const content = body.content as Record<string, unknown>;
      pageData = {
        slug: rawPage,
        title: rawPage.charAt(0).toUpperCase() + rawPage.slice(1).replace(/-/g, " "),
        hero: {
          eyebrow: (content.hero as Record<string, string>)?.eyebrow || (content.hero as Record<string, string>)?.label || "",
          title: (content.hero as Record<string, string>)?.title || "",
          description: (content.hero as Record<string, string>)?.description || "",
          primaryCta: (content.hero as Record<string, string>)?.primaryCta,
          secondaryCta: (content.hero as Record<string, string>)?.secondaryCta,
        },
        boxes: Array.isArray(content.features)
          ? (content.features as CmsPageData["boxes"])
          : Array.isArray(content.items)
            ? (content.items as CmsPageData["boxes"])
            : Array.isArray(content.cards)
              ? (content.cards as CmsPageData["boxes"])
              : [],
      };
    } else {
      return NextResponse.json({ error: "Unrecognized CMS payload structure." }, { status: 400 });
    }

    await saveCmsPage(pageData);
    return NextResponse.json({ success: true, page: pageData.slug });
  } catch (err) {
    console.error("Failed to save CMS content:", err);
    return NextResponse.json({ error: "Unable to save CMS content." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => null)) as { title?: string; slug?: string } | null;
    if (!body?.title || !body?.slug) {
      return NextResponse.json({ error: "Title and slug are required." }, { status: 400 });
    }

    const created = await createCustomCmsPage(body.title, body.slug);
    return NextResponse.json({ success: true, page: created });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unable to create custom page.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    await deleteCustomCmsPage(slug);
    return NextResponse.json({ success: true, slug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unable to delete page.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
