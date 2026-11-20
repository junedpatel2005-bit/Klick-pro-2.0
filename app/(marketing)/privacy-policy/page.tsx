import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Klick-Pro collects, handles, and safeguards your personal, payment, and marketplace data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How Klick-Pro handles your account and marketplace information."
      sections={[
        {
          title: "Information we use",
          body: "We use account, profile, job, proposal, project, and payment information only to operate and improve the Klick-Pro marketplace.",
        },
        {
          title: "Your choices",
          body: "You can update your profile details and contact information from your account settings. We protect personal data using reasonable security measures.",
        },
      ]}
    />
  );
}
