export type LegalDocumentKey = "terms" | "privacy";

export interface LegalRuleItem {
  id: string;
  title: string;
  body: string;
}

export interface LegalDocumentData {
  slug: LegalDocumentKey;
  eyebrow: string;
  title: string;
  description: string;
  rules: LegalRuleItem[];
  updatedAt?: string;
}

export type LegalDocumentsMap = Record<LegalDocumentKey, LegalDocumentData>;

export const LEGAL_DOCUMENT_META: Record<
  LegalDocumentKey,
  { eyebrow: string; defaultTitle: string; defaultDescription: string }
> = {
  terms: {
    eyebrow: "Legal",
    defaultTitle: "Terms and Conditions",
    defaultDescription: "Platform terms and conditions configured by Klick-Pro administrators.",
  },
  privacy: {
    eyebrow: "Legal",
    defaultTitle: "Privacy Policy",
    defaultDescription: "Privacy and data protection rules configured by Klick-Pro administrators.",
  },
};
