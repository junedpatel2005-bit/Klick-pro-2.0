import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactInquiryNotification } from "@/lib/email";
import { capitalizeFirst, capitalizeWords } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(250),
  subject: z.string().trim().min(2).max(180),
  message: z.string().trim().min(5).max(4000),
  phone: z.string().trim().max(50).optional(),
  role: z.string().trim().max(100).optional(),
  topic: z.string().trim().max(100).optional(),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`contact:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please wait a moment before trying again." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
  }

  const { name, email, subject, message, phone, role, topic } = parsed.data;

  // Extract phone, role, topic from message if embedded
  let userPhone = phone?.trim() || "";
  let userRole = role?.trim() || "";
  let userTopic = topic?.trim() || "";
  const rawMessage = message.trim();

  if (!userPhone) {
    const phoneMatch = rawMessage.match(/Phone:\s*([^\n]+)/i);
    if (phoneMatch && phoneMatch[1] && phoneMatch[1].trim() !== "Not provided") {
      userPhone = phoneMatch[1].trim();
    }
  }
  if (!userRole) {
    const roleMatch = rawMessage.match(/Role:\s*([^\n]+)/i);
    if (roleMatch && roleMatch[1]) {
      userRole = roleMatch[1].trim();
    }
  }
  if (!userTopic) {
    const topicMatch = subject.match(/^\[(.*?)\]/);
    if (topicMatch && topicMatch[1]) {
      userTopic = topicMatch[1].trim();
    }
  }

  // Clean actual user message without metadata prefixes
  const cleanMessage =
    rawMessage
      .replace(/^Role:[^\n]*\n?/im, "")
      .replace(/^Phone:[^\n]*\n?/im, "")
      .replace(/^Topic:[^\n]*\n?/im, "")
      .replace(/^Message:\s*/im, "")
      .trim() || rawMessage;

  // Rule 5: Format user-entered details with first-letter capitalization
  const formattedName = capitalizeWords(name);
  const formattedSubject = capitalizeFirst(subject.replace(/^\[.*?\]\s*/, "") || subject);
  const formattedMessage = capitalizeFirst(cleanMessage);

  const contactRecord = await db.contactRequest.create({
    data: {
      name: formattedName,
      email: email.toLowerCase().trim(),
      subject: formattedSubject,
      message: `Role: ${userRole || "Client looking to hire"}\nPhone: ${userPhone || "Not provided"}\nTopic: ${userTopic || "General Question"}\n\nMessage:\n${formattedMessage}`,
    },
  });

  // Send rich HTML notification email to admin (junedpatel2005@gmail.com)
  try {
    await sendContactInquiryNotification({
      contactId: contactRecord.id,
      name: formattedName,
      email: email.trim(),
      subject: formattedSubject,
      message: formattedMessage,
      phone: userPhone,
      role: userRole,
      topic: userTopic,
    });
  } catch (err) {
    console.error("[Contact] Failed to send contact notification email:", err);
  }

  return NextResponse.json({ ok: true, id: contactRecord.id });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
