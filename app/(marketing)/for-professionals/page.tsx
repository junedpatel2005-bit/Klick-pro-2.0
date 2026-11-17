import type { Metadata } from "next";
import { db } from "@/lib/db";
import ForPros, { type SampleProData } from "@/routes/for-professionals";

export const metadata: Metadata = {
  title: "For Professionals",
  description:
    "Find quality jobs, receive 100% full payout on milestones, and grow your professional client base across residential, commercial, and industrial sectors.",
};

async function getSamplePro(): Promise<SampleProData | null> {
  try {
    const pro = await db.user.findFirst({
      where: { role: "PROFESSIONAL", isActive: true },
      orderBy: [
        { isVerified: "desc" },
        { averageRating: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        professionalCategory: true,
        professionalCity: true,
        professionalState: true,
        professionalSkillsJson: true,
        isVerified: true,
        averageRating: true,
        reviewCount: true,
      },
    });

    if (!pro) return null;

    let skills: string[] = [];
    if (pro.professionalSkillsJson) {
      try {
        const parsed = JSON.parse(pro.professionalSkillsJson);
        if (Array.isArray(parsed)) {
          skills = parsed.map(String).slice(0, 4);
        }
      } catch {
        skills = [];
      }
    }

    const first = (pro.firstName || "P")[0]?.toUpperCase() ?? "P";
    const last = (pro.lastName || "R")[0]?.toUpperCase() ?? "R";
    const initials = `${first}${last}`;

    const locationParts = [pro.professionalCity, pro.professionalState].filter(Boolean);
    const location = locationParts.length > 0 ? locationParts.join(", ") : "Serves Your Area";

    return {
      id: pro.id,
      name: `${pro.firstName} ${pro.lastName}`.trim(),
      initials,
      category: pro.professionalCategory ?? "Verified Specialist",
      location,
      skills: skills.length > 0 ? skills : ["Industrial Wiring", "Switchboards", "Electrical Repairs"],
      isVerified: pro.isVerified,
      rating: pro.averageRating > 0 ? pro.averageRating : 4.9,
      reviewCount: pro.reviewCount > 0 ? pro.reviewCount : 15,
    };
  } catch {
    return null;
  }
}

export default async function ForProsPage() {
  const samplePro = await getSamplePro();
  return <ForPros samplePro={samplePro} />;
}
