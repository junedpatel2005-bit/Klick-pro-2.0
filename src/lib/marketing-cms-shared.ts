export const marketingPageIds = [
  "about",
  "how-it-works",
  "professional-home",
  "services",
  "for-clients",
  "for-professionals",
  "pricing",
  "faq",
  "contact",
] as const;
export type MarketingPageId = (typeof marketingPageIds)[number];
export type MarketingItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  buttonText?: string;
  buttonLink?: string;
  badge?: string;
};
export type MarketingPageContent = {
  hero: {
    label: string;
    title: string;
    description: string;
    primaryCta?: string;
    primaryCtaLink?: string;
    secondaryCta?: string;
    secondaryCtaLink?: string;
  };
  features?: { label: string; title: string; description: string };
  items: MarketingItem[];
  cta?: {
    title?: string;
    primaryBtn?: string;
    primaryLink?: string;
    secondaryBtn?: string;
    secondaryLink?: string;
  };
};
