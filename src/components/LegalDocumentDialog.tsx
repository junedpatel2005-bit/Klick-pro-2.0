"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LEGAL_DOCUMENT_META,
  type LegalDocumentData,
  type LegalDocumentKey,
  type LegalDocumentsMap,
} from "@/lib/legal-content";

interface LegalDocumentDialogProps {
  document: LegalDocumentKey | null;
  onClose: () => void;
}

function emptyDocs(): LegalDocumentsMap {
  return {
    terms: {
      slug: "terms",
      eyebrow: LEGAL_DOCUMENT_META.terms.eyebrow,
      title: LEGAL_DOCUMENT_META.terms.defaultTitle,
      description: LEGAL_DOCUMENT_META.terms.defaultDescription,
      rules: [],
    },
    privacy: {
      slug: "privacy",
      eyebrow: LEGAL_DOCUMENT_META.privacy.eyebrow,
      title: LEGAL_DOCUMENT_META.privacy.defaultTitle,
      description: LEGAL_DOCUMENT_META.privacy.defaultDescription,
      rules: [],
    },
  };
}

/**
 * Displays live admin-managed Terms and Conditions or Privacy Policy inside a modal popup.
 */
export function LegalDocumentDialog({ document, onClose }: LegalDocumentDialogProps) {
  const [docs, setDocs] = useState<LegalDocumentsMap | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!document) return;
    let active = true;
    setLoading(true);
    fetch("/api/legal", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<LegalDocumentsMap>) : null))
      .then((data) => {
        if (active && data) setDocs(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [document]);

  const activeDoc: LegalDocumentData | null = document
    ? (docs?.[document] ?? emptyDocs()[document])
    : null;

  return (
    <Dialog open={document !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        {activeDoc ? (
          <>
            <DialogHeader className="text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {activeDoc.eyebrow}
              </p>
              <DialogTitle className="font-display text-2xl font-bold">{activeDoc.title}</DialogTitle>
              <DialogDescription>{activeDoc.description}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[55dvh] space-y-3 overflow-y-auto pr-1 py-2">
              {loading && !docs ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading latest policy rules…
                </div>
              ) : activeDoc.rules.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No rules have been added yet by platform administrators.
                </div>
              ) : (
                activeDoc.rules.map((section) => (
                  <section
                    key={section.id}
                    className="rounded-xl border border-border bg-muted/40 p-4"
                  >
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {section.title}
                    </h3>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {section.body}
                    </p>
                  </section>
                ))
              )}
            </div>
            <DialogFooter>
              <Button type="button" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface LegalConsentDialogProps {
  open: boolean;
  acceptLabel?: string;
  onAccept: () => void;
  onReject: (reason: string) => void;
}

const DEFAULT_REJECTION_REASON =
  "Registration cancelled. You must accept our Terms and Conditions and Privacy Policy to create an account on Klick-Pro.";

/**
 * Interactive pre-registration consent modal loaded live from admin legal rules.
 * Displays both Terms and Conditions and Privacy Policy with Accept and Reject controls.
 */
export function LegalConsentDialog({
  open,
  acceptLabel = "Accept Both & Register",
  onAccept,
  onReject,
}: LegalConsentDialogProps) {
  const [docs, setDocs] = useState<LegalDocumentsMap | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTermsAccepted(false);
    setPrivacyAccepted(false);
    let active = true;
    setLoading(true);
    fetch("/api/legal", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<LegalDocumentsMap>) : null))
      .then((data) => {
        if (active && data) setDocs(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  const effectiveDocs = docs ?? emptyDocs();
  const bothAccepted = termsAccepted && privacyAccepted;

  function handleAcceptAll() {
    setTermsAccepted(true);
    setPrivacyAccepted(true);
    onAccept();
  }

  function handleRejectPolicy(label: string) {
    onReject(
      `Registration cancelled because you rejected the ${label}. You must accept both our Terms and Conditions and Privacy Policy to register.`,
    );
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onReject(DEFAULT_REJECTION_REASON)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="text-left">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Required Policy Agreement
          </p>
          <DialogTitle className="font-display text-2xl font-bold">
            Terms and Conditions &amp; Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Review both policies below and click Accept to continue to profile setup, or Reject to
            cancel registration.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[55dvh] space-y-4 overflow-y-auto pr-1 py-2">
          {loading && !docs ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading live platform policies…
            </div>
          ) : (
            (["terms", "privacy"] as const).map((key) => {
              const doc = effectiveDocs[key];
              const isAccepted = key === "terms" ? termsAccepted : privacyAccepted;
              const setAccepted = key === "terms" ? setTermsAccepted : setPrivacyAccepted;

              return (
                <div
                  key={key}
                  className={`rounded-2xl border p-4 transition-colors ${
                    isAccepted
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">
                        {doc.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{doc.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={isAccepted ? "default" : "outline"}
                        className={
                          isAccepted
                            ? "h-8 gap-1 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                            : "h-8 gap-1 text-xs"
                        }
                        onClick={() => setAccepted(true)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        {isAccepted ? "Accepted" : "Accept"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 border-destructive/40 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleRejectPolicy(doc.title)}
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {doc.rules.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-border/80 bg-background/70 px-3 py-2.5 text-xs text-muted-foreground">
                        No custom rules configured by admin yet.
                      </p>
                    ) : (
                      doc.rules.map((rule, idx) => (
                        <div
                          key={rule.id}
                          className="rounded-xl border border-border/70 bg-background p-3"
                        >
                          <p className="text-xs font-bold text-foreground">
                            {idx + 1}. {rule.title}
                          </p>
                          <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                            {rule.body}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onReject(DEFAULT_REJECTION_REASON)}
            className="border-destructive/40 font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Reject &amp; Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAcceptAll}
            disabled={loading && !docs}
            className="font-semibold"
          >
            {bothAccepted ? acceptLabel : acceptLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
