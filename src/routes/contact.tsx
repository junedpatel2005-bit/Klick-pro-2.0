"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { CmsBoxGroup, CmsPageProvider, CmsText, type PageTextsMap } from "@/components/cms/CmsText";
import {
  Sparkles,
  Briefcase,
  UserPlus,
  Wallet,
  Mail,
  Phone,
  Clock,
  HelpCircle,
  ShieldCheck,
  Send,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const CONTACT_TOPICS = [
  {
    legacyPrefix: "topic1",
    topicValue: "Post a Job",
    icon: "briefcase" as const,
    defaults: {
      title: "Post a Job",
      desc: "Tell us what you need done and get help crafting your requirements.",
    },
  },
  {
    legacyPrefix: "topic2",
    topicValue: "Join as Professional",
    icon: "userPlus" as const,
    defaults: {
      title: "Join as Professional",
      desc: "List your skills, get verified, and learn how to win quality contracts.",
    },
  },
  {
    legacyPrefix: "topic3",
    topicValue: "Payments",
    icon: "wallet" as const,
    defaults: {
      title: "Payments & Escrow",
      desc: "Assistance with milestone escrow, invoices, receipts, and offline settlement.",
    },
  },
];

const CONTACT_SIDEBAR = [
  {
    kind: "email" as const,
    legacyPrefix: "side.email",
    defaults: {
      title: "Email Support",
      desc: "For account, project, or payment inquiries, email our support team directly.",
      addr: "support@klick-pro.com",
    },
  },
  {
    kind: "phone" as const,
    legacyPrefix: "side.phone",
    defaults: {
      title: "Phone Support",
      desc: "Direct phone assistance for priority questions, active projects, or payment verification.",
      num: "+91 80000 00000",
    },
  },
  {
    kind: "steps" as const,
    legacyPrefix: "side.next",
    defaults: {
      title: "What Happens Next",
      step1: "We log your request and route it to the appropriate specialist.",
      step2: "Our team investigates and replies within 24 hours.",
      step3: "We follow up until your case is completely resolved.",
    },
  },
  {
    kind: "faq" as const,
    legacyPrefix: "side.faq",
    defaults: {
      title: "Need an Instant Answer?",
      desc: "Common questions about hiring, verification, and escrow are answered in our FAQ.",
      link: "Visit the FAQ Center",
    },
  },
  {
    kind: "safe" as const,
    legacyPrefix: "side.safe",
    defaults: {
      title: "Confidential & Secure",
      desc: "Your inquiry and transaction details are handled confidentially by authorized staff.",
    },
  },
];

export default function Contact({
  cmsMode = false,
  pageTexts,
  onTextChange,
}: {
  cmsMode?: boolean;
  pageTexts?: PageTextsMap;
  onTextChange?: (id: string, value: string) => void;
} = {}) {
  const [topic, setTopic] = useState("General Question");
  const [role, setRole] = useState("Client looking to hire");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (cmsMode) return;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          const u = data.user;
          const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ");
          if (fullName) setName(fullName);
          if (u.email) setEmail(u.email);
          if (u.role === "CLIENT") setRole("Client looking to hire");
          else if (u.role === "PROFESSIONAL") setRole("Professional offering services");
        }
      })
      .catch(() => {});
  }, [cmsMode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (cmsMode) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccess(false);

    try {
      const cleanSubject = subject.trim()
        ? subject.trim()
        : `Inquiry regarding ${topic} from ${name.trim()}`;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          role,
          topic,
          subject: cleanSubject,
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit inquiry. Please try again.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CmsPageProvider cmsMode={cmsMode} pageTexts={pageTexts} onTextChange={onTextChange}>
      <div className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-[#1748b5]">
        {/* 1. HERO */}
        <section className="gradient-hero border-b border-slate-200/60">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
              <Sparkles className="h-3.5 w-3.5" />{" "}
              <CmsText id="hero.label" defaultText="Contact Klick-Pro" />
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
              <CmsText id="hero.title" defaultText="How Can We Help You?" />
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              <CmsText
                id="hero.description"
                defaultText="Need a job done, looking to offer your services, or have a question about your account or payment? Our support and operations team is here to assist."
              />
            </p>
          </div>
        </section>

        {/* 2. TOPIC QUICK CHIPS */}
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
          <CmsBoxGroup
            groupId="topics"
            templates={CONTACT_TOPICS}
            gridClassName="grid gap-6 md:grid-cols-3"
            renderItem={(tpl) => {
              const Icon =
                tpl.icon === "userPlus" ? UserPlus : tpl.icon === "wallet" ? Wallet : Briefcase;
              const isSelected = topic === tpl.topicValue;
              return (
                <button
                  type="button"
                  onClick={() => setTopic(tpl.topicValue)}
                  className={`rounded-2xl border p-6 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-brand bg-white ring-2 ring-brand/20 shadow-md"
                      : "border-slate-200/90 bg-white hover:border-brand hover:shadow-md"
                  }`}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">
                    <CmsText id="title" defaultText={tpl.defaults.title} />
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    <CmsText id="desc" defaultText={tpl.defaults.desc} />
                  </p>
                </button>
              );
            }}
          />
        </section>

        {/* 3. CONTACT FORM & SIDEBAR */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            {/* SIDEBAR */}
            <CmsBoxGroup
              groupId="sidebarCards"
              templates={CONTACT_SIDEBAR}
              gridClassName="space-y-6"
              renderItem={(tpl) => {
                if (tpl.kind === "email") {
                  return (
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                        <Mail className="h-6 w-6" />
                      </div>
                      <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">
                        <CmsText id="title" defaultText={tpl.defaults.title} />
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        <CmsText id="desc" defaultText={tpl.defaults.desc} />
                      </p>
                      <a
                        href="mailto:support@klick-pro.com"
                        className="mt-4 inline-block text-sm font-bold text-brand hover:underline"
                      >
                        <CmsText id="addr" defaultText={tpl.defaults.addr!} />
                      </a>
                    </div>
                  );
                }
                if (tpl.kind === "phone") {
                  return (
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                        <Phone className="h-6 w-6" />
                      </div>
                      <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">
                        <CmsText id="title" defaultText={tpl.defaults.title} />
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        <CmsText id="desc" defaultText={tpl.defaults.desc} />
                      </p>
                      <a
                        href="tel:+918000000000"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline"
                      >
                        <Phone className="h-4 w-4" />{" "}
                        <CmsText id="num" defaultText={tpl.defaults.num!} />
                      </a>
                    </div>
                  );
                }
                if (tpl.kind === "steps") {
                  return (
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                        <Clock className="h-6 w-6" />
                      </div>
                      <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">
                        <CmsText id="title" defaultText={tpl.defaults.title} />
                      </h2>
                      <ol className="mt-3 space-y-3 text-sm text-slate-500">
                        <li className="flex gap-3">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-brand">
                            1
                          </span>
                          <CmsText id="step1" defaultText={tpl.defaults.step1!} />
                        </li>
                        <li className="flex gap-3">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-brand">
                            2
                          </span>
                          <CmsText id="step2" defaultText={tpl.defaults.step2!} />
                        </li>
                        <li className="flex gap-3">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-brand">
                            3
                          </span>
                          <CmsText id="step3" defaultText={tpl.defaults.step3!} />
                        </li>
                      </ol>
                    </div>
                  );
                }
                if (tpl.kind === "faq") {
                  return (
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                        <HelpCircle className="h-6 w-6" />
                      </div>
                      <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">
                        <CmsText id="title" defaultText={tpl.defaults.title} />
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        <CmsText id="desc" defaultText={tpl.defaults.desc} />
                      </p>
                      <Link
                        href="/faq"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover"
                      >
                        <CmsText id="link" defaultText={tpl.defaults.link!} />{" "}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  );
                }
                return (
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">
                      <CmsText id="title" defaultText={tpl.defaults.title} />
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      <CmsText id="desc" defaultText={tpl.defaults.desc} />
                    </p>
                  </div>
                );
              }}
            />

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="h-fit rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm sm:p-10"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-[#0b1f4d]">
                  <CmsText id="form.title" defaultText="Send Us a Message" />
                </h2>
              </div>

              {success && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-bold text-sm">Thank You for Reaching Out!</p>
                    <p className="mt-1 text-xs text-emerald-700">
                      Your inquiry has been received. A support specialist will review your request and get back to you shortly.
                    </p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                  <div>
                    <p className="font-bold text-sm">Submission Error</p>
                    <p className="mt-1 text-xs text-rose-700">{errorMsg}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Your Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    I Am A
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                  >
                    <option>Client looking to hire</option>
                    <option>Professional offering services</option>
                    <option>Business / enterprise</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                  >
                    <option>General Question</option>
                    <option>Post a Job</option>
                    <option>Join as Professional</option>
                    <option>Payments</option>
                    <option>Dispute or Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Subject
                  </label>
                  <input
                    required
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Summary of your inquiry"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your project, inquiry, or question in detail..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-3.5 text-sm font-bold text-cta-foreground shadow-sm transition hover:bg-cta/90 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <CmsText id="form.submit" defaultText="Send Message" />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </CmsPageProvider>
  );
}
