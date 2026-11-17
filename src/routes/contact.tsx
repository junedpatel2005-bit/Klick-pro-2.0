"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  Sparkles,
  Briefcase,
  UserPlus,
  Wallet,
  Mail,
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

export default function Contact() {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccess(false);

    try {
      const fullSubject = subject.trim()
        ? `[${topic}] ${subject.trim()}`
        : `[${topic}] Inquiry from ${name.trim()}`;

      const fullMessage = `Role: ${role}\nPhone: ${phone.trim() || "Not provided"}\n\nMessage:\n${message.trim()}`;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: fullSubject,
          message: fullMessage,
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
    <div className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-[#1748b5]">
      {/* 1. HERO */}
      <section className="gradient-hero border-b border-slate-200/60">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1748b5]">
            <Sparkles className="h-3.5 w-3.5" /> Contact Klick-Pro
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#0b1f4d] md:text-5xl">
            How Can We Help You?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Need a job done, looking to offer your services, or have a question about your account or payment? Our support and operations team is here to assist.
          </p>
        </div>
      </section>

      {/* 2. TOPIC QUICK CHIPS */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setTopic("Post a Job")}
            className={`rounded-2xl border p-6 text-left shadow-sm transition ${
              topic === "Post a Job"
                ? "border-brand bg-white ring-2 ring-brand/20 shadow-md"
                : "border-slate-200/90 bg-white hover:border-brand hover:shadow-md"
            }`}
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Briefcase className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Post a Job</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Tell us what you need done and get help crafting your requirements.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setTopic("Join as Professional")}
            className={`rounded-2xl border p-6 text-left shadow-sm transition ${
              topic === "Join as Professional"
                ? "border-brand bg-white ring-2 ring-brand/20 shadow-md"
                : "border-slate-200/90 bg-white hover:border-brand hover:shadow-md"
            }`}
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <UserPlus className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Join as Professional</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              List your skills, get verified, and learn how to win quality contracts.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setTopic("Payments")}
            className={`rounded-2xl border p-6 text-left shadow-sm transition ${
              topic === "Payments"
                ? "border-brand bg-white ring-2 ring-brand/20 shadow-md"
                : "border-slate-200/90 bg-white hover:border-brand hover:shadow-md"
            }`}
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
              <Wallet className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Payments &amp; Escrow</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Assistance with milestone escrow, invoices, receipts, and offline settlement.
            </p>
          </button>
        </div>
      </section>

      {/* 3. CONTACT FORM & SIDEBAR */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Email Support</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                For account, project, or payment inquiries, email our support team directly.
              </p>
              <p className="mt-4 text-sm font-bold text-brand">support@klick-pro.com</p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <Clock className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">What Happens Next</h2>
              <ol className="mt-3 space-y-3 text-sm text-slate-500">
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-brand">
                    1
                  </span>
                  <span>We log your request and route it to the appropriate specialist.</span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-brand">
                    2
                  </span>
                  <span>Our team investigates and replies within 24 hours.</span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-brand">
                    3
                  </span>
                  <span>We follow up until your case is completely resolved.</span>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Need an Instant Answer?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Common questions about hiring, verification, and escrow are answered in our FAQ.
              </p>
              <Link
                href="/faq"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-hover"
              >
                Visit the FAQ Center <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-brand">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-[#0b1f4d]">Confidential &amp; Secure</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your inquiry and transaction details are handled confidentially by authorized staff.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm sm:p-10"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-brand">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0b1f4d]">Send Us a Message</h2>
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
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
