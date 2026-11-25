"use client";

import { useEffect, useMemo, useState } from "react";
import { useRealtimeRefresh } from "@/lib/use-realtime-refresh";
import {
  MessageSquareText,
  Pencil,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { capitalizeFirst, capitalizeWords } from "@/lib/utils";

type FaqItem = {
  id?: number;
  question: string;
  answer: string;
  displayOrder: number;
  status?: string;
  category?: string | null;
};

type ContactRequestItem = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function AdminSupportPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequestItem[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Filters & Search
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategoryFilter, setFaqCategoryFilter] = useState("ALL");
  const [faqStatusFilter, setFaqStatusFilter] = useState("ALL");

  const [contactSearch, setContactSearch] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("ALL");

  const [faqPage, setFaqPage] = useState(1);
  const FAQ_PAGE_SIZE = 10;
  const [contactPage, setContactPage] = useState(1);
  const CONTACT_PAGE_SIZE = 10;

  const load = () => {
    setLoading(true);
    void fetch("/api/admin/data/support", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setFaqs(data.faqs ?? []);
        setContactRequests(data.contactRequests ?? []);
      })
      .catch(() => {
        setFaqs([]);
        setContactRequests([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useRealtimeRefresh(
    ["servio:notification", "servio:admin-overview-update", "servio:settings-update"],
    load,
  );

  // Unique categories derived from current FAQs
  const availableCategories = useMemo(() => {
    const set = new Set<string>(["General", "For Clients", "For Professionals", "Payments"]);
    faqs.forEach((f) => {
      if (f.category?.trim()) set.add(f.category.trim());
    });
    return Array.from(set);
  }, [faqs]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    const q = faqSearch.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        (faq.category && faq.category.toLowerCase().includes(q));

      const matchCat =
        faqCategoryFilter === "ALL" ||
        (faq.category?.trim() || "General") === faqCategoryFilter;

      const matchStatus =
        faqStatusFilter === "ALL" || (faq.status || "PUBLISHED") === faqStatusFilter;

      return matchSearch && matchCat && matchStatus;
    });
  }, [faqs, faqSearch, faqCategoryFilter, faqStatusFilter]);

  const paginatedFaqs = useMemo(() => {
    const start = (faqPage - 1) * FAQ_PAGE_SIZE;
    return filteredFaqs.slice(start, start + FAQ_PAGE_SIZE);
  }, [filteredFaqs, faqPage]);

  // Filtered Contact Requests
  const filteredContactRequests = useMemo(() => {
    const q = contactSearch.trim().toLowerCase();
    return contactRequests.filter((item) => {
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q);

      const matchStatus =
        contactStatusFilter === "ALL" || item.status === contactStatusFilter;

      return matchSearch && matchStatus;
    });
  }, [contactRequests, contactSearch, contactStatusFilter]);

  const paginatedContactRequests = useMemo(() => {
    const start = (contactPage - 1) * CONTACT_PAGE_SIZE;
    return filteredContactRequests.slice(start, start + CONTACT_PAGE_SIZE);
  }, [filteredContactRequests, contactPage]);

  async function addFaq(event: React.FormEvent) {
    event.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setMessage("Please add both a question and an answer.");
      return;
    }
    setSaving(true);
    const response = await fetch(
      editingId ? `/api/admin/support?id=${editingId}` : "/api/admin/support",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim(),
          category: category.trim() || "General",
          displayOrder: Number(displayOrder) || (faqs.length + 1),
          status,
        }),
      },
    );
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setMessage(data.error ?? "Unable to save FAQ item.");
      return;
    }
    setFaqs((current) =>
      editingId
        ? current.map((item) => (item.id === editingId ? data.faq : item))
        : [...current, data.faq],
    );
    setMessage(editingId ? "FAQ item updated successfully." : "FAQ item added successfully.");
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setDisplayOrder(faqs.length + 2);
    setStatus("PUBLISHED");
    setEditingId(null);
  }

  function startEdit(faq: FaqItem) {
    if (!faq.id) return;
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category ?? "General");
    setDisplayOrder(faq.displayOrder ?? 1);
    setStatus((faq.status as "PUBLISHED" | "DRAFT") || "PUBLISHED");
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setDisplayOrder(faqs.length + 1);
    setStatus("PUBLISHED");
  }

  async function removeFaq(id: number) {
    if (!confirm("Are you sure you want to delete this FAQ item?")) return;
    const response = await fetch(`/api/admin/support?id=${id}`, { method: "DELETE" });
    if (!response.ok) return setMessage("Unable to delete FAQ item.");
    setFaqs((current) => current.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
    setMessage("FAQ item deleted.");
  }

  async function handleSeedDefaults() {
    if (!confirm("Do you want to seed the official standard FAQs into the database?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/support?action=seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to seed default FAQs");
      setMessage(`Seeded ${data.count ?? 19} standard FAQs into the database.`);
      load();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error seeding FAQs.");
    } finally {
      setSeeding(false);
    }
  }

  async function updateContactStatus(contactId: number, newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED") {
    try {
      const res = await fetch(`/api/admin/support?contactId=${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setContactRequests((current) =>
        current.map((item) => (item.id === contactId ? { ...item, status: newStatus } : item)),
      );
    } catch {
      setMessage("Failed to update contact request status.");
    }
  }

  async function removeContactRequest(contactId: number) {
    if (!confirm("Delete this contact message permanently?")) return;
    try {
      const res = await fetch(`/api/admin/support?contactId=${contactId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete contact message");
      setContactRequests((current) => current.filter((item) => item.id !== contactId));
    } catch {
      setMessage("Failed to delete contact message.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Support & Help Desk</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900">
            FAQ & Contact Requests
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage public FAQs live on the website and resolve incoming client & professional support inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/faq"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-indigo-600 transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            <span>View Public FAQ</span>
          </Link>

          {faqs.length === 0 && (
            <Button
              type="button"
              onClick={() => void handleSeedDefaults()}
              disabled={seeding || loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xs text-xs font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {seeding ? "Seeding..." : "Seed Default FAQs"}
            </Button>
          )}
        </div>
      </div>

      {message && (
        <div className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-2.5 text-xs sm:text-sm font-medium text-indigo-900 shadow-2xs">
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage("")}
            className="text-indigo-500 hover:text-indigo-800 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Add/Edit FAQ Form + Live FAQs List */}
      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        {/* Form: Add or Edit FAQ */}
        <form
          onSubmit={(event) => void addFaq(event)}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              {editingId ? (
                <Pencil className="h-4 w-4 text-indigo-600" />
              ) : (
                <Plus className="h-4 w-4 text-indigo-600" />
              )}
              <h2 className="text-sm font-bold text-slate-900">
                {editingId ? "Edit FAQ Item" : "Add New FAQ Item"}
              </h2>
            </div>
            {editingId && (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                Editing #{editingId}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Question</label>
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              placeholder="e.g. How does milestone escrow protect my payment?"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Answer</label>
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs leading-relaxed"
              placeholder="Explain the answer in simple, helpful language..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Category</label>
              <input
                list="faq-categories"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-2xs"
                placeholder="General"
              />
              <datalist id="faq-categories">
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Display Order</label>
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(event) => setDisplayOrder(Number(event.target.value))}
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Publish Status</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="faq-status"
                  value="PUBLISHED"
                  checked={status === "PUBLISHED"}
                  onChange={() => setStatus("PUBLISHED")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Published (Live)</span>
              </label>

              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 cursor-pointer">
                <input
                  type="radio"
                  name="faq-status"
                  value="DRAFT"
                  checked={status === "DRAFT"}
                  onChange={() => setStatus("DRAFT")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Draft (Hidden)</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white hover:bg-indigo-500 shadow-xs text-xs font-semibold cursor-pointer"
            >
              {saving ? "Saving..." : editingId ? "Save Changes" : "Publish FAQ Item"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs cursor-pointer"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* List of Managed FAQs */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Live Public FAQs</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                {filteredFaqs.length} items
              </span>
            </div>

            {/* FAQ Search & Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => {
                    setFaqSearch(e.target.value);
                    setFaqPage(1);
                  }}
                  placeholder="Search questions..."
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none w-36 sm:w-44"
                />
              </div>

              <select
                value={faqCategoryFilter}
                onChange={(e) => {
                  setFaqCategoryFilter(e.target.value);
                  setFaqPage(1);
                }}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50/50 px-2 text-xs font-semibold text-slate-700 focus:bg-white outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={faqStatusFilter}
                onChange={(e) => {
                  setFaqStatusFilter(e.target.value);
                  setFaqPage(1);
                }}
                className="h-8 rounded-lg border border-slate-200 bg-slate-50/50 px-2 text-xs font-semibold text-slate-700 focus:bg-white outline-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5">
            {loading ? (
              <div className="space-y-3 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700">No matching FAQ entries found.</p>
                <p className="text-xs text-slate-400">
                  {faqs.length === 0
                    ? "Click 'Seed Default FAQs' above to populate the standard FAQ catalogue."
                    : "Try adjusting your search or category filters."}
                </p>
              </div>
            ) : (
              paginatedFaqs.map((faq) => (
                <article
                  key={faq.id ?? `${faq.question}-${faq.displayOrder}`}
                  className={`rounded-xl border p-3.5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    editingId === faq.id
                      ? "border-indigo-400 bg-indigo-50/40 ring-1 ring-indigo-200"
                      : "border-slate-200/90 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs text-slate-400 tabular-nums">
                          #{faq.displayOrder ?? 0}
                        </span>
                        <p className="font-bold text-xs sm:text-sm text-slate-900">
                          {capitalizeFirst(faq.question)}
                        </p>
                        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                          {faq.category?.trim() || "General"}
                        </span>
                        {faq.status === "DRAFT" ? (
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            Draft
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            Live
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {faq.answer}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(faq)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                        title="Edit FAQ"
                        aria-label={`Edit FAQ ${faq.question}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => faq.id && void removeFaq(faq.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Delete FAQ"
                        aria-label={`Delete FAQ ${faq.question}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {!loading && filteredFaqs.length > 0 && (
            <AdminPagination
              currentPage={faqPage}
              totalItems={filteredFaqs.length}
              pageSize={FAQ_PAGE_SIZE}
              onPageChange={setFaqPage}
              className="mt-4"
            />
          )}
        </section>
      </div>

      {/* Section 2: Incoming Contact & Support Requests */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Incoming Contact & Support Messages</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
              {filteredContactRequests.length} total
            </span>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => {
                  setContactSearch(e.target.value);
                  setContactPage(1);
                }}
                placeholder="Search messages..."
                className="h-8 rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 outline-none w-36 sm:w-44"
              />
            </div>

            <select
              value={contactStatusFilter}
              onChange={(e) => {
                setContactStatusFilter(e.target.value);
                setContactPage(1);
              }}
              className="h-8 rounded-lg border border-slate-200 bg-slate-50/50 px-2 text-xs font-semibold text-slate-700 focus:bg-white outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : filteredContactRequests.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No contact inquiries found.</p>
          ) : (
            paginatedContactRequests.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-xs text-slate-900">
                      {capitalizeWords(item.name)}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <a
                      href={`mailto:${item.email}`}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      {item.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                        item.status === "RESOLVED"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : item.status === "IN_PROGRESS"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-indigo-200 bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {item.status}
                    </span>

                    {/* Quick Status Action Buttons */}
                    {item.status !== "RESOLVED" ? (
                      <button
                        type="button"
                        onClick={() => void updateContactStatus(item.id, "RESOLVED")}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                        title="Mark as Resolved"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Resolve</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void updateContactStatus(item.id, "OPEN")}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                        title="Re-open inquiry"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reopen</span>
                      </button>
                    )}

                    {item.status === "OPEN" && (
                      <button
                        type="button"
                        onClick={() => void updateContactStatus(item.id, "IN_PROGRESS")}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-white px-2 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                        title="Mark In Progress"
                      >
                        <Clock className="h-3 w-3" />
                        <span>In Progress</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => void removeContactRequest(item.id)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer ml-1"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-xs font-bold text-slate-800">
                  {capitalizeFirst(item.subject)}
                </p>
                <p className="mt-1 text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {item.message}
                </p>
                <p className="mt-2.5 text-[10px] font-medium text-slate-400">
                  Received on {new Date(item.createdAt).toLocaleString("en-IN")}
                </p>
              </article>
            ))
          )}
        </div>

        {!loading && filteredContactRequests.length > 0 && (
          <AdminPagination
            currentPage={contactPage}
            totalItems={filteredContactRequests.length}
            pageSize={CONTACT_PAGE_SIZE}
            onPageChange={setContactPage}
            className="mt-4"
          />
        )}
      </section>
    </div>
  );
}
