import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sessionCookie, verifySession } from "@/lib/auth";
import {
  addLegalRule,
  deleteLegalRule,
  getAllLegalDocuments,
  getLegalDocument,
  saveLegalDocument,
  updateLegalRule,
} from "@/lib/legal-service";

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

const slugSchema = z.enum(["terms", "privacy"]);

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }
  const documents = await getAllLegalDocuments();
  return NextResponse.json(documents, { status: 200 });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }
  const parsed = z
    .object({
      slug: slugSchema,
      title: z.string().trim().min(2).max(160),
      body: z.string().trim().min(4).max(5000),
    })
    .safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide a valid policy type, rule title, and description." },
      { status: 400 },
    );
  }

  const document = await addLegalRule(parsed.data.slug, {
    title: parsed.data.title,
    body: parsed.data.body,
  });
  return NextResponse.json({ document }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }

  const rawBody = await request.json().catch(() => null);
  const updateRuleParsed = z
    .object({
      slug: slugSchema,
      ruleId: z.string().trim().min(1),
      title: z.string().trim().min(2).max(160),
      body: z.string().trim().min(4).max(5000),
    })
    .safeParse(rawBody);

  if (updateRuleParsed.success) {
    const document = await updateLegalRule(updateRuleParsed.data.slug, updateRuleParsed.data.ruleId, {
      title: updateRuleParsed.data.title,
      body: updateRuleParsed.data.body,
    });
    if (!document) {
      return NextResponse.json({ error: "Rule not found." }, { status: 404 });
    }
    return NextResponse.json({ document }, { status: 200 });
  }

  const updateHeaderParsed = z
    .object({
      slug: slugSchema,
      title: z.string().trim().min(2).max(160),
      description: z.string().trim().max(500),
    })
    .safeParse(rawBody);

  if (updateHeaderParsed.success) {
    const current = await getLegalDocument(updateHeaderParsed.data.slug);
    const document = await saveLegalDocument(updateHeaderParsed.data.slug, {
      title: updateHeaderParsed.data.title,
      description: updateHeaderParsed.data.description,
      rules: current.rules,
    });
    return NextResponse.json({ document }, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid update payload." }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }

  const parsed = z
    .object({
      slug: slugSchema,
      ruleId: z.string().trim().min(1),
    })
    .safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Policy slug and rule id are required." }, { status: 400 });
  }

  const document = await deleteLegalRule(parsed.data.slug, parsed.data.ruleId);
  if (!document) {
    return NextResponse.json({ error: "Rule not found." }, { status: 404 });
  }
  return NextResponse.json({ document }, { status: 200 });
}
