import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sessionCookie, verifySession } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(sessionCookie)?.value;
  if (!token) return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  try {
    if ((await verifySession(token)).role !== "ADMIN")
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    const rawBody = await request.json().catch(() => null);
    const body = z.object({ isActive: z.boolean() }).safeParse(rawBody);
    const { id } = await params;
    if (!body.success || !Number.isInteger(Number(id)))
      return NextResponse.json({ error: "Invalid account update." }, { status: 400 });
    const user = await db.$transaction(async (transaction) => {
      const updated = await transaction.user.update({
        where: { id: Number(id) },
        data: { isActive: body.data.isActive },
        select: { id: true, isActive: true },
      });
      if (!body.data.isActive) {
        await transaction.session.updateMany({
          where: { userId: updated.id, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
      return updated;
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Unable to update account." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = request.cookies.get(sessionCookie)?.value;
  if (!token) return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  try {
    if ((await verifySession(token)).role !== "ADMIN")
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    const { id } = await params;
    const userId = Number(id);
    if (!Number.isInteger(userId))
      return NextResponse.json({ error: "Invalid user." }, { status: 400 });
    await db.user.delete({ where: { id: userId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete account. It may have related records." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(sessionCookie)?.value;
  if (!token) return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  try {
    if ((await verifySession(token)).role !== "ADMIN")
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    const { id } = await params;
    const userId = Number(id);
    if (!Number.isInteger(userId))
      return NextResponse.json({ error: "Invalid user." }, { status: 400 });
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        phoneVerifiedAt: true,
        emailVerifiedAt: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        lastLoginAt: true,
        professionalCategory: true,
        professionalCity: true,
        hourlyRate: true,
        fixedRate: true,
        averageRating: true,
        reviewCount: true,
        companyName: true,
        companyWebsite: true,
        industry: true,
        teamSize: true,
        companyDescription: true,
        address: true,
        serviceArea: true,
        workMode: true,
        serviceRadiusKm: true,
        availabilityStatus: true,
        experienceYears: true,
        professionalSkillsJson: true,
        professionalLatitude: true,
        professionalLongitude: true,
        updatedAt: true,
        clientProfiles: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            companyName: true,
            companyWebsite: true,
            industry: true,
            teamSize: true,
            companyDescription: true,
            address: true,
            savedLocations: {
              select: { label: true, address: true, isPrimary: true },
            },
          },
        },
        services: { select: { id: true } },
      },
    });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    const userRoleFilter =
      user.role === "CLIENT" ? { clientId: userId } : { professionalId: userId };
    const [jobsPosted, proposals, allProjects, completedPayments, userJobs, userRequests, latestSession, sessionCount] = await Promise.all([
      db.clientJob.count({ where: { userId } }),
      db.projectRequest.count({ where: userRoleFilter }),
      db.projectTracking.findMany({
        where: userRoleFilter,
        include: {
          job: { select: { id: true, title: true, category: true } },
          milestones: { select: { id: true, title: true, amount: true, status: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 30,
      }),
      db.projectTransaction.aggregate({
        where: {
          ...userRoleFilter,
          status: "COMPLETED",
        },
        _sum: { amount: true },
        _count: true,
      }),
      user.role === "CLIENT"
        ? db.clientJob.findMany({
            where: { userId },
            select: {
              id: true,
              title: true,
              category: true,
              status: true,
              budgetMin: true,
              budgetMax: true,
              createdAt: true,
              _count: { select: { projectRequests: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
          })
        : Promise.resolve([]),
      user.role === "PROFESSIONAL"
        ? db.projectRequest.findMany({
            where: { professionalId: userId },
            select: {
              id: true,
              jobId: true,
              bidAmount: true,
              status: true,
              duration: true,
              createdAt: true,
              job: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
          })
        : Promise.resolve([]),
      db.session.findFirst({
        where: { userId, revokedAt: null },
        orderBy: { createdAt: "desc" },
      }),
      db.session.count({ where: { userId } }),
    ]);
    const completedProjects = allProjects.filter(
      (p) => p.status === "COMPLETED" || p.status.toUpperCase().includes("COMPLETED"),
    ).length;
    const closedProjects = allProjects.filter(
      (p) =>
        p.status === "CLOSED" ||
        p.status.toUpperCase().includes("CLOSED") ||
        p.status.toUpperCase().includes("CANCELLED"),
    ).length;

    const now = Date.now();
    const thirtyMinsAgo = now - 30 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const lastSessionMs = latestSession?.createdAt ? new Date(latestSession.createdAt).getTime() : 0;
    const lastLoginMs = user.lastLoginAt ? new Date(user.lastLoginAt).getTime() : 0;
    const actualLastActiveMs = Math.max(lastLoginMs, lastSessionMs);
    const isOnline = Boolean(
      user.isActive && (
        (lastLoginMs > 0 && lastLoginMs >= thirtyMinsAgo) ||
        (latestSession && latestSession.expiresAt > new Date() && lastSessionMs >= thirtyMinsAgo)
      ),
    );

    let accountState: "ONLINE" | "ACTIVE" | "IDLE" | "NEVER_LOGGED_IN" | "DISABLED" = "NEVER_LOGGED_IN";
    let accountStateLabel = "Never Logged In";

    if (!user.isActive) {
      accountState = "DISABLED";
      accountStateLabel = "Disabled";
    } else if (isOnline) {
      accountState = "ONLINE";
      accountStateLabel = "Online Now";
    } else if (actualLastActiveMs >= sevenDaysAgo && actualLastActiveMs > 0) {
      accountState = "ACTIVE";
      const daysAgo = Math.floor((now - actualLastActiveMs) / (1000 * 60 * 60 * 24));
      accountStateLabel = daysAgo === 0 ? "Active Today" : `Active (${daysAgo}d ago)`;
    } else if (actualLastActiveMs > 0) {
      accountState = "IDLE";
      const daysAgo = Math.floor((now - actualLastActiveMs) / (1000 * 60 * 60 * 24));
      accountStateLabel = `Idle (${daysAgo}d ago)`;
    }

    const enrichedUser = {
      ...user,
      accountState,
      accountStateLabel,
      isOnline,
      lastActiveAt: actualLastActiveMs > 0 ? new Date(actualLastActiveMs).toISOString() : null,
      totalLogins: Math.max(sessionCount, user.lastLoginAt ? 1 : 0),
    };

    return NextResponse.json({
      user: enrichedUser,
      stats: {
        jobsPosted,
        proposals,
        projects: allProjects.length,
        completedProjects,
        closedProjects,
        completedPayments: completedPayments._count,
        money: completedPayments._sum.amount ?? 0,
        services: user.services.length,
      },
      metrics: {
        totalSpent: user.role === "CLIENT" ? (completedPayments._sum.amount ?? 0) : 0,
        totalEarnings: user.role === "PROFESSIONAL" ? (completedPayments._sum.amount ?? 0) : 0,
        completedProjectsCount: completedProjects,
      },
      jobs: (userJobs as Array<{ id: number; title: string; category: string; status: string; budgetMin: number | null; budgetMax: number | null; createdAt: Date; _count: { projectRequests: number } }>).map((j) => ({
        ...j,
        budget: j.budgetMax || j.budgetMin || 0,
        proposalsCount: j._count?.projectRequests ?? 0,
      })),
      projectRequests: userRequests,
      trackings: allProjects,
      projects: allProjects.map((p) => ({
        id: p.id,
        jobId: p.job.id,
        title: p.job.title,
        category: p.job.category,
        status: p.status,
        progress: p.progress,
        milestones: p.milestones,
        totalMilestones: p.milestones.length,
        completedMilestones: p.milestones.filter((m: { status?: string | null }) => m.status === "APPROVED" || m.status === "COMPLETED").length,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Unable to load user details." }, { status: 500 });
  }
}
