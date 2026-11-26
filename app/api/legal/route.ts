import { NextResponse } from "next/server";
import { getAllLegalDocuments } from "@/lib/legal-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const documents = await getAllLegalDocuments();
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("Failed to load legal documents:", error);
    return NextResponse.json({ error: "Unable to load legal policies." }, { status: 500 });
  }
}
