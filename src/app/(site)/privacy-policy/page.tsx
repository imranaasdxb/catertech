import LegalPageLayout, { LegalSection } from "@/components/legal/LegalPageLayout";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How Catertech collects, uses, and protects your personal information when you browse our site, request quotes, or work with our team."
      lastUpdated="January 2025"
    >
      <LegalSection title="Overview">
        <p>
          Catertech Food Catering Services LLC is committed to protecting your privacy.
          This policy explains how we collect, use, store, and protect personal
          information when you use our website, submit enquiries, or engage our
          catering and equipment services.
        </p>
      </LegalSection>

      <LegalSection title="Information We Collect">
        <p>We may collect information you provide directly to us, including:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Name, email address, and phone number</li>
          <li>Company or venue details</li>
          <li>Enquiry, quote, and order information</li>
          <li>Account credentials if you register on our platform</li>
        </ul>
        <p>
          We may also collect basic technical data such as browser type, device
          information, and pages visited to improve site performance and security.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Respond to enquiries and provide quotations</li>
          <li>Process orders and deliver services across the UAE</li>
          <li>Send relevant updates about your request or account</li>
          <li>Improve our website, catalogue, and customer experience</li>
          <li>Meet legal, regulatory, and security requirements</li>
        </ul>
      </LegalSection>

      <LegalSection title="Sharing & Retention">
        <p>
          We do not sell your personal information. We may share data with trusted
          service providers who help us operate our website, logistics, or customer
          support — only where necessary and under appropriate safeguards.
        </p>
        <p>
          We retain personal information only for as long as needed to fulfil the
          purposes described in this policy or as required by law.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights">
        <p>
          Depending on applicable law, you may request access to, correction of, or
          deletion of your personal data. You may also opt out of non-essential
          marketing communications at any time.
        </p>
      </LegalSection>

      <LegalSection title="Contact Us">
        <p>
          For privacy-related questions or requests, contact us at{" "}
          <Link
            href="mailto:info@catertech.ae"
            className="font-semibold text-primary underline decoration-accent/50 underline-offset-2 transition-colors hover:text-accent-dark"
          >
            info@catertech.ae
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
