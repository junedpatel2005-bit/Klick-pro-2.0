"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LEGAL_DOCUMENTS, type LegalDocumentKey } from "@/lib/legal-content";

interface LegalDocumentDialogProps {
  document: LegalDocumentKey | null;
  onClose: () => void;
}

/**
 * Displays Terms of Service or Privacy Policy inside an in-page modal dialog
 * so users on login and signup can review legal terms without leaving the form.
 */
export function LegalDocumentDialog({ document, onClose }: LegalDocumentDialogProps) {
  const data = document ? LEGAL_DOCUMENTS[document] : null;

  return (
    <Dialog open={document !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        {data ? (
          <>
            <DialogHeader className="text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {data.eyebrow}
              </p>
              <DialogTitle className="font-display text-2xl font-bold">{data.title}</DialogTitle>
              <DialogDescription>{data.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {data.sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-xl border border-border bg-muted/40 p-4"
                >
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {section.body}
                  </p>
                </section>
              ))}
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
