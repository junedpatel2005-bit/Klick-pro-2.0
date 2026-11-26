import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const DEFAULT_FAQS = [
  {
    category: "General",
    question: "What is Klick-Pro?",
    answer:
      "Klick-Pro is an enterprise hybrid marketplace connecting clients with vetted professionals for local on-site services (such as plumbing, electrical, maintenance) and remote digital projects (software development, design, marketing).",
    displayOrder: 1,
  },
  {
    category: "General",
    question: "What kinds of services can I find?",
    answer:
      "We support six major sectors: Residential (home repairs, cleaning, renovation, appliances), Commercial (office fit-outs, facility services, marketing, accounting), Industrial (machinery maintenance, fabrication, industrial electrical, safety), Health Care (caregivers, nursing, physiotherapy), Personal Care & Home Services (wellness, styling, fitness), and Education (tutors, coaches, trainers).",
    displayOrder: 2,
  },
  {
    category: "General",
    question: "Is Klick-Pro only for IT and online work?",
    answer:
      "No. Klick-Pro covers on-site trades and industrial services as well as remote digital work. You can hire qualified experts to visit your home, shop, or factory, or collaborate with remote specialists online.",
    displayOrder: 3,
  },
  {
    category: "General",
    question: "How do I create an account?",
    answer:
      "Sign up with your contact details, choose whether you want to hire or offer services, and complete your profile. You can hire and offer services seamlessly using the same account.",
    displayOrder: 4,
  },
  {
    category: "For Clients",
    question: "How do I post a job?",
    answer:
      "Describe the work, location, budget and timeline, attach photos or sketches if helpful, and submit. Matching professionals in your category and area will review and send you competitive proposals.",
    displayOrder: 5,
  },
  {
    category: "For Clients",
    question: "How do I choose the right professional?",
    answer:
      "Compare itemized quotes, customer ratings, reviews, verified badges, and portfolios. You can also chat directly with your shortlisted candidates before making a hiring decision.",
    displayOrder: 6,
  },
  {
    category: "For Clients",
    question: "Can I hire someone for a small, one-time job?",
    answer:
      "Absolutely. Jobs can be a quick service call, a one-day task, or a multi-month commercial contract. Simply post what you need and agree on scope and milestones up front.",
    displayOrder: 7,
  },
  {
    category: "For Clients",
    question: "Can I hire a professional for both on-site and remote work?",
    answer:
      "Yes. When creating your job posting, choose On-Site, Remote, or Either, and professionals will tailor their proposals accordingly.",
    displayOrder: 8,
  },
  {
    category: "For Clients",
    question: "What if I need to cancel or change the scope?",
    answer:
      "Discuss adjustments with your professional in the project chat and adjust the agreed milestones together. If you cannot reach an agreement, our support and dispute resolution team is here to assist.",
    displayOrder: 9,
  },
  {
    category: "For Professionals",
    question: "How do I join as a professional?",
    answer:
      "Create a profile with your services, rates, service area, and previous work portfolio, then submit your identity verification. Once approved, you can browse open jobs and submit custom proposals immediately.",
    displayOrder: 10,
  },
  {
    category: "For Professionals",
    question: "Do I need a registered business to join?",
    answer:
      "No. Independent tradespeople, individual freelancers, small teams, and registered enterprise businesses are all welcome on Klick-Pro.",
    displayOrder: 11,
  },
  {
    category: "For Professionals",
    question: "How do I get more jobs?",
    answer:
      "Keep your profile complete with photos of past work, respond promptly to inquiries, provide itemized proposals, and deliver great service to accumulate 5-star ratings.",
    displayOrder: 12,
  },
  {
    category: "For Professionals",
    question: "Can I offer services in more than one category?",
    answer:
      "Yes. You can select all service categories you are qualified for, such as both residential electrical maintenance and commercial lighting installations.",
    displayOrder: 13,
  },
  {
    category: "For Professionals",
    question: "When and how do I get paid?",
    answer:
      "For online contracts, funds are deposited into secure milestone escrow and released directly to your wallet upon client approval with 100% full payout. For offline jobs, you collect payment directly upon completion as agreed.",
    displayOrder: 14,
  },
  {
    category: "Payments",
    question: "How does milestone escrow protect my payment?",
    answer:
      "Funds are deposited into neutral escrow before work starts. The professional knows payment is guaranteed, while the client knows money is released only after deliverables are inspected and approved.",
    displayOrder: 15,
  },
  {
    category: "Payments",
    question: "Is it free to post jobs and join as a pro?",
    answer:
      "Yes! Posting jobs for clients is 100% free with zero recurring subscription charges. Professionals can also register and submit proposals for free.",
    displayOrder: 16,
  },
  {
    category: "Payments",
    question: "Can I pay offline or in cash?",
    answer:
      "Yes. For on-site and local trade services, you can agree to pay in person upon job completion. Make sure to agree on the exact price in the proposal up front.",
    displayOrder: 17,
  },
  {
    category: "Payments",
    question: "Which online payment methods are accepted?",
    answer:
      "You can fund escrow using UPI, major debit/credit cards, and net banking through our secure checkout gateway.",
    displayOrder: 18,
  },
  {
    category: "Payments",
    question: "What if there is a payment or milestone dispute?",
    answer:
      "Contact our dedicated support team with your job and milestone ID. We inspect project evidence and logs to ensure fair resolution.",
    displayOrder: 19,
  },
];

async function seed() {
  try {
    const existingCount = await prisma.faq.count();
    console.log(`Existing FAQ count: ${existingCount}`);

    if (existingCount === 0) {
      console.log(`Seeding ${DEFAULT_FAQS.length} default FAQs...`);
      for (const item of DEFAULT_FAQS) {
        await prisma.faq.create({
          data: {
            category: item.category,
            question: item.question,
            answer: item.answer,
            displayOrder: item.displayOrder,
            status: "PUBLISHED",
          },
        });
      }
      console.log("Successfully seeded default FAQs!");
    } else {
      console.log("Database already has FAQs. No seeding needed.");
    }

    const finalCount = await prisma.faq.count();
    console.log(`Final FAQ count in database: ${finalCount}`);
  } catch (err) {
    console.error("Error seeding FAQs:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seed();
