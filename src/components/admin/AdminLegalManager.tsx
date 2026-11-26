"use client";

import { FormEvent, useState } from "react";
import { Pencil, Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  LegalDocumentData,
  LegalDocumentKey,
  LegalDocumentsMap,
  LegalRuleItem,
} from "@/lib/legal-content";

interface AdminLegalManagerProps {
  initialDocuments: LegalDocumentsMap;
}

/**
 * Admin CRUD studio to manage Terms and Conditions and Privacy Policy rules
 * stored in PostgreSQL (legal_pages) and rendered live on /terms, /privacy-policy,
 * login, and signup consent popups.
 */
export function AdminLegalManager({ initialDocuments }: AdminLegalManagerProps) {
  const [documents, setDocuments] = useState<LegalDocumentsMap>(initialDocuments);
  const [activeTab, setActiveTab] = useState<LegalDocumentKey>("terms");

  const currentDoc = documents[activeTab];
  const [headerTitle, setHeaderTitle] = useState(currentDoc.title);
  const [headerDesc, setHeaderDesc] = useState(currentDoc.description);
  const [savingHeader, setSavingHeader] = useState(false);

  const [newRuleTitle, setNewRuleTitle] = useState("");
  const [newRuleBody, setNewRuleBody] = useState("");
  const [addingRule, setAddingRule] = useState(false);

  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [savingRule, setSavingRule] = useState(false);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);

  function switchTab(nextTab: LegalDocumentKey) {
    setActiveTab(nextTab);
    setHeaderTitle(documents[nextTab].title);
    setHeaderDesc(documents[nextTab].description);
    setEditingRuleId(null);
    setNewRuleTitle("");
    setNewRuleBody("");
  }

  function applyUpdatedDocument(doc: LegalDocumentData) {
    setDocuments((prev) => ({ ...prev, [doc.slug]: doc }));
    if (doc.slug === activeTab) {
      setHeaderTitle(doc.title);
      setHeaderDesc(doc.description);
    }
  }

  async function handleSaveHeader(event: FormEvent) {
    event.preventDefault();
    if (savingHeader) return;
    setSavingHeader(true);
    try {
      const res = await fetch("/api/admin/legal", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: activeTab,
          title: headerTitle,
          description: headerDesc,
        }),
      });
      const data = (await res.json()) as { document?: LegalDocumentData; error?: string };
      if (!res.ok || !data.document) {
        toast.error(data.error ?? "Unable to update policy header.");
        return;
      }
      applyUpdatedDocument(data.document);
      toast.success("Policy heading updated.");
    } catch {
      toast.error("Failed to save heading.");
    } finally {
      setSavingHeader(false);
    }
  }

  async function handleAddRule(event: FormEvent) {
    event.preventDefault();
    if (addingRule) return;
    if (!newRuleTitle.trim() || !newRuleBody.trim()) {
      toast.error("Enter both rule title and rule content.");
      return;
    }
    setAddingRule(true);
    try {
      const res = await fetch("/api/admin/legal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: activeTab,
          title: newRuleTitle.trim(),
          body: newRuleBody.trim(),
        }),
      });
      const data = (await res.json()) as { document?: LegalDocumentData; error?: string };
      if (!res.ok || !data.document) {
        toast.error(data.error ?? "Unable to add rule.");
        return;
      }
      applyUpdatedDocument(data.document);
      setNewRuleTitle("");
      setNewRuleBody("");
      toast.success("Rule added.");
    } catch {
      toast.error("Network error while adding rule.");
    } finally {
      setAddingRule(false);
    }
  }

  function startEditRule(rule: LegalRuleItem) {
    setEditingRuleId(rule.id);
    setEditTitle(rule.title);
    setEditBody(rule.body);
  }

  async function handleUpdateRule(ruleId: string) {
    if (savingRule) return;
    if (!editTitle.trim() || !editBody.trim()) {
      toast.error("Rule title and content cannot be empty.");
      return;
    }
    setSavingRule(true);
    try {
      const res = await fetch("/api/admin/legal", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: activeTab,
          ruleId,
          title: editTitle.trim(),
          body: editBody.trim(),
        }),
      });
      const data = (await res.json()) as { document?: LegalDocumentData; error?: string };
      if (!res.ok || !data.document) {
        toast.error(data.error ?? "Unable to update rule.");
        return;
      }
      applyUpdatedDocument(data.document);
      setEditingRuleId(null);
      toast.success("Rule updated.");
    } catch {
      toast.error("Network error while updating rule.");
    } finally {
      setSavingRule(false);
    }
  }

  async function handleDeleteRule(ruleId: string) {
    if (deletingRuleId) return;
    setDeletingRuleId(ruleId);
    try {
      const res = await fetch("/api/admin/legal", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: activeTab, ruleId }),
      });
      const data = (await res.json()) as { document?: LegalDocumentData; error?: string };
      if (!res.ok || !data.document) {
        toast.error(data.error ?? "Unable to delete rule.");
        return;
      }
      applyUpdatedDocument(data.document);
      if (editingRuleId === ruleId) setEditingRuleId(null);
      toast.success("Rule deleted.");
    } catch {
      toast.error("Network error while deleting rule.");
    } finally {
      setDeletingRuleId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Terms &amp; Privacy Policy Rules
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the rules shown on public pages, login links, and the registration Accept/Reject
            consent popup.
          </p>
        </div>
        <div className="inline-grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/60 p-1">
          {(["terms", "privacy"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => switchTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "terms" ? "Terms & Conditions" : "Privacy Policy"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left: Add New Rule + Document Header */}
        <div className="space-y-6 lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="h-4 w-4 text-primary" />
                Add New Rule ({activeTab === "terms" ? "Terms" : "Privacy Policy"})
              </CardTitle>
              <CardDescription>
                New rules appear immediately in signup consent popups and public legal pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddRule} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rule-title">Rule Title</Label>
                  <Input
                    id="rule-title"
                    value={newRuleTitle}
                    onChange={(e) => setNewRuleTitle(e.target.value)}
                    placeholder="e.g. Account Responsibility & Conduct"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rule-body">Rule Description</Label>
                  <Textarea
                    id="rule-body"
                    rows={4}
                    value={newRuleBody}
                    onChange={(e) => setNewRuleBody(e.target.value)}
                    placeholder="Enter the exact rule text users must review and accept..."
                    required
                  />
                </div>
                <Button type="submit" disabled={addingRule} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  {addingRule ? "Adding Rule…" : "Add Rule"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Document Title &amp; Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveHeader} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="doc-title">Document Title</Label>
                  <Input
                    id="doc-title"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="doc-desc">Subtitle / Summary</Label>
                  <Textarea
                    id="doc-desc"
                    rows={2}
                    value={headerDesc}
                    onChange={(e) => setHeaderDesc(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="outline" disabled={savingHeader} className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  {savingHeader ? "Saving…" : "Save Heading"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Existing Rules List (Update / Delete) */}
        <div className="space-y-4 lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Active Rules ({currentDoc.rules.length})
              </CardTitle>
              <CardDescription>
                Only rules listed here are displayed to users. Edit or delete any clause below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentDoc.rules.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    No rules added yet for {activeTab === "terms" ? "Terms and Conditions" : "Privacy Policy"}.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Use the form on the left to add your first rule.
                  </p>
                </div>
              ) : (
                currentDoc.rules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="rounded-xl border border-border bg-muted/20 p-4 transition-colors"
                  >
                    {editingRuleId === rule.id ? (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Rule Title</Label>
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Rule Description</Label>
                          <Textarea
                            rows={4}
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRuleId(null)}
                            disabled={savingRule}
                          >
                            <X className="mr-1 h-3.5 w-3.5" />
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => void handleUpdateRule(rule.id)}
                            disabled={savingRule}
                          >
                            <Save className="mr-1 h-3.5 w-3.5" />
                            {savingRule ? "Saving…" : "Save Changes"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-primary">
                            Rule {index + 1}
                          </p>
                          <h3 className="mt-0.5 text-sm font-semibold text-foreground">
                            {rule.title}
                          </h3>
                          <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                            {rule.body}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 px-2.5 text-xs"
                            onClick={() => startEditRule(rule)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => void handleDeleteRule(rule.id)}
                            disabled={deletingRuleId === rule.id}
                            aria-label={`Delete ${rule.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
