import LegalPageLayout, { LegalSection } from "@/components/legal/LegalPageLayout";
import Link from "next/link";

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="The terms that govern use of the Catertech website, catalogue, quotations, and commercial services across the UAE."
      lastUpdated="January 2025"
    >
      <LegalSection title="Agreement">
        <p>
          By accessing or using the Catertech website and services, you agree to
          these terms and conditions. If you do not agree, please do not use our
          website or submit enquiries through our platform.
        </p>
      </LegalSection>

      <LegalSection title="Use of Website">
        <p>
          This website is provided for informational and commercial purposes related
          to catering, event equipment, kitchen supplies, and related services.
        </p>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Misuse, copy, or redistribute content without permission</li>
          <li>Attempt to disrupt site security or access restricted areas</li>
          <li>Submit false, misleading, or unlawful information</li>
        </ul>
      </LegalSection>

      <LegalSection title="Orders & Request for Quotation (RFQ)">
        <p>
          Product listings and online selections are subject to availability.
          Orders placed through our website are processed as a Request for
          Quotation (RFQ) unless explicitly confirmed otherwise in writing by
          Catertech.
        </p>
        <p>
          Pricing, delivery timelines, and final specifications are confirmed only
          after review by our sales team. We reserve the right to decline or modify
          an order where stock, logistics, or commercial terms require it.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <p>
          All branding, imagery, product descriptions, and site content remain the
          property of Catertech or its licensors. Unauthorised reproduction or
          commercial use is prohibited without prior written consent.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          We aim to keep website information accurate and up to date, but content
          may change without notice. Catertech is not liable for indirect or
          consequential losses arising from use of this website, except where
          liability cannot be excluded under applicable UAE law.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For questions regarding these terms, contact us at{" "}
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
