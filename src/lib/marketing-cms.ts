import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  marketingPageIds,
  type MarketingPageContent,
  type MarketingPageId,
  type MarketingItem,
} from "@/lib/marketing-cms-shared";
export { marketingPageIds } from "@/lib/marketing-cms-shared";
export type {
  MarketingPageContent,
  MarketingPageId,
  MarketingItem,
} from "@/lib/marketing-cms-shared";

const file = path.resolve(process.cwd(), "data", "cms-marketing.json");

const item = (
  id: string,
  title: string,
  description: string,
  icon = "shield",
  buttonText = "Learn more",
  buttonLink = "/services",
): MarketingItem => ({
  id,
  title,
  description,
  icon,
  buttonText,
  buttonLink,
});

export const marketingDefaults: Record<MarketingPageId, MarketingPageContent> = {
  about: {
    hero: {
      label: "ABOUT KLICK-PRO",
      title: "Empowering honest work through trust & transparency",
      description:
        "Klick-Pro is a milestone-based service marketplace designed to connect clients with verified professionals across India, backed by secure escrow protection and clear accountability.",
      primaryCta: "Explore Services",
      primaryCtaLink: "/services",
      secondaryCta: "Join as Professional",
      secondaryCtaLink: "/signup",
    },
    items: [
      item(
        "trust-verification",
        "Trust & ID Verification",
        "Every professional undergoes identity and credential verification so clients hire with total confidence and peace of mind.",
        "shield",
        "Learn more",
        "/services",
      ),
      item(
        "escrow-protection",
        "Guaranteed Escrow Protection",
        "Milestone payments remain safely deposited in escrow before work begins and are released only when deliverables are approved.",
        "wallet",
        "View escrow safeguards",
        "/how-it-works",
      ),
      item(
        "both-sides",
        "Built for Both Sides",
        "Clients receive reliable work without haggling, while professionals grow sustainable businesses without chasing unpaid invoices.",
        "users",
        "How it works",
        "/how-it-works",
      ),
      item(
        "fair-pricing",
        "Fair & Transparent Pricing",
        "Clear milestones, transparent pricing, and zero hidden platform charges for honest work.",
        "award",
        "View pricing",
        "/pricing",
      ),
      item(
        "community-reputation",
        "Community-Driven Reputation",
        "Only clients with completed, paid projects can leave ratings and reviews, ensuring 100% genuine reputation across the platform.",
        "star",
        "Find professionals",
        "/services",
      ),
      item(
        "support-dispute",
        "Dedicated Support & Mediation",
        "A dedicated support team and built-in dispute resolution protect both parties and ensure fair outcomes if issues ever arise.",
        "message",
        "Contact support",
        "/contact",
      ),
    ],
    cta: {
      title: "Get started with Klick-Pro today",
      primaryBtn: "Post a Job",
      primaryLink: "/post-job",
      secondaryBtn: "Become a Professional",
      secondaryLink: "/signup",
    },
  },
  "how-it-works": {
    hero: {
      label: "How it works",
      title: "A simpler, safer way to hire & get hired",
      description:
        "Klick-Pro connects clients with verified professionals through a secure, milestone-based escrow workflow. Here is how the end-to-end process works.",
      primaryCta: "Post a Job",
      primaryCtaLink: "/post-job",
      secondaryCta: "Browse Services",
      secondaryCtaLink: "/services",
    },
    items: [
      item(
        "step-1-post",
        "1. Post your job",
        "Describe what you need, choose a service category, and specify your budget and timeline. It takes under two minutes.",
        "clipboard",
        "Post a job now",
        "/post-job",
      ),
      item(
        "step-2-proposals",
        "2. Receive & compare quotes",
        "Verified professionals review your job and send customized proposals. Chat directly, compare ratings, and choose the best match.",
        "message",
        "Explore pros",
        "/services",
      ),
      item(
        "step-3-escrow",
        "3. Fund secure escrow",
        "Accept a proposal and deposit milestone funds into secure escrow. Money is protected safely by Klick-Pro before work begins.",
        "shield",
        "Escrow security",
        "/how-it-works",
      ),
      item(
        "step-4-tracking",
        "4. Collaborate & track milestones",
        "Professionals start work, update stages, share progress, and submit completed deliverables directly within the project tracker.",
        "briefcase",
        "Project tracker",
        "/dashboard",
      ),
      item(
        "step-5-approval",
        "5. Inspect & release payment",
        "Review the submitted deliverables. Once you approve the work, funds are released directly to the professional's wallet.",
        "wallet",
        "Payment safety",
        "/pricing",
      ),
      item(
        "step-6-review",
        "6. Rate & review",
        "Both parties leave verified reviews and ratings upon project completion, helping build reputation and trust across the community.",
        "star",
        "Browse verified reviews",
        "/services",
      ),
    ],
    cta: {
      title: "Ready to get work done?",
      primaryBtn: "Post a Job",
      primaryLink: "/post-job",
      secondaryBtn: "Become a Professional",
      secondaryLink: "/signup",
    },
  },
  "professional-home": {
    hero: {
      label: "Grow your professional business",
      title: "Find projects that match your skills",
      description:
        "Browse available projects, bid on work, and build your reputation with satisfied clients worldwide.",
      primaryCta: "Browse Jobs",
      primaryCtaLink: "/services",
      secondaryCta: "Pro Dashboard",
      secondaryCtaLink: "/professional/dashboard",
    },
    features: {
      label: "Why Professionals Choose Us",
      title: "Everything you need to grow",
      description: "Find quality projects, get paid safely, and build a reputation clients trust.",
    },
    items: [
      item("grow", "Grow your business", "Find quality projects and expand your client base with steady work.", "trend", "Find jobs", "/services"),
      item(
        "safe",
        "Get paid safely",
        "Work with clear milestones, upfront escrow deposits, and reliable payments with zero chasing.",
        "shield",
        "View escrow safeguards",
        "/pricing",
      ),
      item(
        "reputation",
        "Build your reputation",
        "Deliver great work, collect 5-star ratings, and become a top-rated verified professional in your area.",
        "star",
        "Manage profile",
        "/professional/profile",
      ),
    ],
    cta: {
      title: "Start earning with Klick-Pro today",
      primaryBtn: "Browse Available Jobs",
      primaryLink: "/services",
      secondaryBtn: "Update Pro Profile",
      secondaryLink: "/professional/profile",
    },
  },
  services: {
    hero: {
      label: "Marketplace jobs",
      title: "Browse client jobs",
      description:
        "Explore open work posted by clients and find the right service category for you.",
      primaryCta: "Post a Job Requirement",
      primaryCtaLink: "/post-job",
      secondaryCta: "Browse Categories",
      secondaryCtaLink: "#categories",
    },
    items: [
      item(
        "local",
        "Local on-site services",
        "Find trusted professionals near you for home repairs, maintenance, renovation, and physical tasks.",
        "map",
        "Browse local work",
        "/services",
      ),
      item(
        "digital",
        "Digital & remote projects",
        "Connect with skilled remote professionals for technology, consulting, design, and flexible project work.",
        "search",
        "Browse remote work",
        "/services",
      ),
      item(
        "managed",
        "Managed contracts & industrial",
        "Track commercial and industrial contracts with milestone escrow, inspection stages, and team collaboration.",
        "briefcase",
        "View contracts",
        "/services",
      ),
    ],
    cta: {
      title: "Need something done today?",
      primaryBtn: "Post a Job",
      primaryLink: "/post-job",
      secondaryBtn: "Join as Professional",
      secondaryLink: "/signup",
    },
  },
  "for-clients": {
    hero: {
      label: "For clients",
      title: "Hire trusted professionals — without the back-and-forth",
      description:
        "Post once. Get qualified, vetted proposals fast. Pay securely only when work is completed and approved.",
      primaryCta: "Post a Job for Free",
      primaryCtaLink: "/post-job",
      secondaryCta: "Explore Professionals",
      secondaryCtaLink: "/services",
    },
    items: [
      item(
        "step-1-post",
        "1. Post your job requirement",
        "Describe your task or project, choose the service category, and set your budget and timeline. It's completely free to post.",
        "clipboard",
        "Post a job",
        "/post-job",
      ),
      item(
        "step-2-proposals",
        "2. Get verified proposals",
        "Receive competitive quotes from ID-verified, background-checked professionals. Review their ratings, completed projects, and client feedback.",
        "users",
        "Compare quotes",
        "/services",
      ),
      item(
        "step-3-chat",
        "3. Chat & finalize scope",
        "Message professionals in real-time to discuss details, ask questions, negotiate terms, and shortlist the top candidate.",
        "message",
        "Direct chat",
        "/dashboard",
      ),
      item(
        "step-4-escrow",
        "4. Secure escrow deposit",
        "Deposit milestone payments securely through Razorpay. Your money is held safely in escrow and never released upfront.",
        "shield",
        "Escrow guarantee",
        "/how-it-works",
      ),
      item(
        "step-5-milestones",
        "5. Track work & inspect results",
        "Follow project stages in real-time, inspect deliverables uploaded by your pro, and request revisions until you are 100% satisfied.",
        "briefcase",
        "Track milestones",
        "/dashboard",
      ),
      item(
        "step-6-release-review",
        "6. Release payment & review",
        "Approve the completed milestone to release payment to the pro, then leave a review to help others in the community.",
        "star",
        "Leave a review",
        "/dashboard",
      ),
    ],
    cta: {
      title: "Hire your first professional today",
      primaryBtn: "Post a Job",
      primaryLink: "/post-job",
      secondaryBtn: "Browse Services",
      secondaryLink: "/services",
    },
  },
  "for-professionals": {
    hero: {
      label: "For professionals",
      title: "Find quality jobs. Get paid safely. Grow your business.",
      description:
        "Connect with verified clients, submit competitive proposals, and receive guaranteed milestone payouts with zero payment chasing.",
      primaryCta: "Register as Professional",
      primaryCtaLink: "/signup",
      secondaryCta: "Browse Jobs",
      secondaryCtaLink: "/services",
    },
    items: [
      item(
        "step-1-profile",
        "1. Build profile & verify ID",
        "Showcase your expertise, add skills, set service areas, and complete verification to earn your verified pro trust badge.",
        "shield",
        "Get verified",
        "/professional/profile",
      ),
      item(
        "step-2-browse",
        "2. Discover matching jobs",
        "Browse local and digital job postings matched to your trade, filtered by budget, location distance, and client urgency.",
        "search",
        "Browse open jobs",
        "/services",
      ),
      item(
        "step-3-proposals",
        "3. Send custom proposals",
        "Pitch your services with tailored quotes and timelines. Chat directly with clients to understand requirements and win contracts.",
        "message",
        "Send proposals",
        "/services",
      ),
      item(
        "step-4-escrow",
        "4. Guaranteed escrow funding",
        "Start work with total peace of mind. Client funds are deposited into secure escrow before you start, guaranteeing payment upon delivery.",
        "clipboard",
        "Escrow security",
        "/how-it-works",
      ),
      item(
        "step-5-deliver",
        "5. Submit milestone deliverables",
        "Keep clients updated with stage progression, upload completed work deliverables, and request milestone review in one click.",
        "briefcase",
        "Deliver work",
        "/professional/dashboard",
      ),
      item(
        "step-6-payouts",
        "6. Instant payouts & reputation",
        "Once milestones are approved, withdraw your earnings directly to your bank account anytime via Razorpay and collect 5-star reviews.",
        "wallet",
        "Fast payout",
        "/professional/dashboard",
      ),
    ],
    cta: {
      title: "Ready to start winning client contracts?",
      primaryBtn: "Become a Professional",
      primaryLink: "/signup",
      secondaryBtn: "View Open Jobs",
      secondaryLink: "/services",
    },
  },
  pricing: {
    hero: {
      label: "Pricing",
      title: "Simple, transparent pricing",
      description: "Free for clients. Professionals pay only when they get paid. No hidden fees.",
      primaryCta: "Post a Job Free",
      primaryCtaLink: "/post-job",
      secondaryCta: "Join as Pro",
      secondaryCtaLink: "/signup",
    },
    items: [
      item(
        "starter",
        "Client - 100% Free",
        "Post jobs, receive verified quotes, chat with professionals, and pay milestone escrow with zero platform fees.",
        "check",
        "Post a Job Free",
        "/post-job",
      ),
      item(
        "pro",
        "Verified Professional",
        "Submit proposals, communicate with clients, and receive 100% full net disbursements upon completed milestones.",
        "star",
        "Register as Pro",
        "/signup",
      ),
      item(
        "business",
        "Commercial & Industrial",
        "Hire at scale with multi-milestone contracts, milestone escrow protection, and dedicated dispute mediation.",
        "briefcase",
        "Contact sales",
        "/contact",
      ),
    ],
    cta: {
      title: "Experience transparent milestone escrow",
      primaryBtn: "Post a Job",
      primaryLink: "/post-job",
      secondaryBtn: "Become a Professional",
      secondaryLink: "/signup",
    },
  },
  faq: {
    hero: {
      label: "Help center",
      title: "Frequently asked questions",
      description: "Can't find what you're looking for? Our team is one click away.",
      primaryCta: "Contact Support",
      primaryCtaLink: "/contact",
      secondaryCta: "How It Works",
      secondaryCtaLink: "/how-it-works",
    },
    items: [
      item(
        "what",
        "What is Klick-Pro?",
        "Klick-Pro is a marketplace that connects clients with verified professionals for local and remote work with milestone escrow.",
        "shield",
        "Learn more",
        "/how-it-works",
      ),
      item(
        "free",
        "Is it free to use for clients?",
        "Posting jobs and receiving quotes is 100% free. Clients pay only the agreed milestone amount for completed deliverables.",
        "wallet",
        "View pricing",
        "/pricing",
      ),
      item(
        "vet",
        "How are professionals vetted?",
        "Every pro completes ID and credential verification. For in-home services, background screening is strictly verified.",
        "star",
        "Find vetted pros",
        "/services",
      ),
    ],
    cta: {
      title: "Still have questions? We're here to help.",
      primaryBtn: "Contact Support",
      primaryLink: "/contact",
      secondaryBtn: "How It Works",
      secondaryLink: "/how-it-works",
    },
  },
  contact: {
    hero: {
      label: "Contact Klick-Pro Support",
      title: "How can our team help you?",
      description: "Have questions about job postings, professional onboarding, milestone escrow, or dispute assistance? Reach out anytime.",
      primaryCta: "Send a Message",
      primaryCtaLink: "#contact-form",
      secondaryCta: "Help Center / FAQ",
      secondaryCtaLink: "/faq",
    },
    items: [
      item(
        "email",
        "Email Support",
        "For account, project, or payment questions, send us a message any time. Average response under 2 hours.",
        "mail",
        "Send email",
        "mailto:support@klick-pro.com",
      ),
      item(
        "phone",
        "Phone & Hotline",
        "Speak directly with our dedicated customer assistance desk for urgent escrow or project mediation inquiries.",
        "phone",
        "Call support",
        "tel:+918000000000",
      ),
      item(
        "whatsapp",
        "WhatsApp Live Chat",
        "Quick questions regarding contractor onboarding, document verification, or milestone status updates.",
        "message",
        "Open WhatsApp",
        "https://wa.me/918000000000",
      ),
      item(
        "safe",
        "Safe & Private Mediation",
        "Your request is treated with complete confidentiality and handled directly by verified Klick-Pro staff.",
        "shield",
        "Escrow safety policy",
        "/how-it-works",
      ),
    ],
    cta: {
      title: "Have an immediate project requirement?",
      primaryBtn: "Post a Job",
      primaryLink: "/post-job",
      secondaryBtn: "Find Professionals",
      secondaryLink: "/services",
    },
  },
};

export async function readMarketingContent(page: MarketingPageId) {
  let all: Partial<Record<MarketingPageId, MarketingPageContent>> = {};
  try {
    all = JSON.parse(await readFile(file, "utf8")) as typeof all;
  } catch {
    /* initialize below */
  }
  const value = all[page] ?? marketingDefaults[page];
  if (!all[page]) {
    all[page] = value;
    await mkdir(path.dirname(file), { recursive: true })
      .then(() => writeFile(file, JSON.stringify(all, null, 2) + "\n", "utf8"))
      .catch(() => undefined);
  }
  return value;
}

export async function writeMarketingContent(page: MarketingPageId, content: MarketingPageContent) {
  let all: Partial<Record<MarketingPageId, MarketingPageContent>> = {};
  try {
    all = JSON.parse(await readFile(file, "utf8")) as typeof all;
  } catch {
    /* recreate */
  }
  all[page] = content;
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(all, null, 2) + "\n", "utf8");
  return content;
}
