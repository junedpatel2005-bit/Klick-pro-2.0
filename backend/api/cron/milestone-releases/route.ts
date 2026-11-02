import { NextRequest, NextResponse } from "next/server";
import { processMilestoneValidityReleases } from "@/lib/milestone-validity";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const configuredSecret = process.env.CRON_SECRET;

  if (!configuredSecret) {
    console.error("[CRON ERROR] CRON_SECRET environment variable is not configured.");
    return NextResponse.json({ error: "Server cron secret is not configured." }, { status: 500 });
  }

  if (authHeader !== `Bearer ${configuredSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron execution." }, { status: 401 });
  }

  try {
    const result = await processMilestoneValidityReleases();
    return NextResponse.json({
      success: true,
      processed: result.processed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON ERROR] processMilestoneValidityReleases failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Milestone cron execution failed." },
      { status: 500 },
    );
  }
}
