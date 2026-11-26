export type LegalDocumentKey = "terms" | "privacy";

export interface LegalSection {
  title: string;
  body: string;
}

export interface LegalDocumentData {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

export const LEGAL_DOCUMENTS: Record<LegalDocumentKey, LegalDocumentData> = {
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    description: "The basic rules for using the Klick-Pro marketplace.",
    sections: [
      {
        title: "Using Klick-Pro",
        body: "Clients and professionals must provide accurate information and use the marketplace respectfully and lawfully.",
      },
      {
        title: "Marketplace projects",
        body: "Project payments, milestones, reviews, disputes, and communications should be managed through Klick-Pro where available.",
      },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    description: "How Klick-Pro handles your account and marketplace information.",
    sections: [
      {
        title: "Information we use",
        body: "We use account, profile, job, proposal, project, and payment information only to operate and improve the Klick-Pro marketplace.",
      },
      {
        title: "Your choices",
        body: "You can update your profile details and contact information from your account settings. We protect personal data using reasonable security measures.",
      },
    ],
  },
};
