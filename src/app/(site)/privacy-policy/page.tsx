import LegalPageLayout, { LegalSection } from "@/components/legal/LegalPageLayout";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How Catertech Food Catering Services LLC collects, uses, stores, and protects your personal and business information when you use our website."
      lastUpdated="July 7, 2026"
    >
      <LegalSection title="1. Introduction">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            Catertech Food Catering Services LLC (&quot;Catertech&quot;, &quot;we&quot;,
            &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to
            protecting your personal and business information.
          </li>
          <li>
            This Privacy Policy explains how we collect, use, store, disclose, and
            safeguard information submitted through our website.
          </li>
          <li>
            By using our website, you acknowledge and accept the practices described in
            this Privacy Policy, subject to applicable laws of the United Arab Emirates.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We may collect the following information when you interact with our website:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Full Name</li>
          <li>Company Name</li>
          <li>Email Address</li>
          <li>Phone Number</li>
          <li>Job Title (if provided)</li>
          <li>Business Address (if provided)</li>
          <li>Service or event enquiry details</li>
          <li>Messages submitted through contact forms</li>
        </ul>
        <p>We may also automatically collect:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>IP Address</li>
          <li>Browser Type</li>
          <li>Device Information</li>
          <li>Operating System</li>
          <li>Website Usage Data</li>
          <li>Pages Visited</li>
          <li>Date &amp; Time of Visit</li>
          <li>Referral Source</li>
          <li>Cookie Information</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>Your information may be used to:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Respond to enquiries and quotation requests.</li>
          <li>Provide information regarding our products and services.</li>
          <li>Prepare proposals and service agreements.</li>
          <li>Communicate regarding ongoing or future business opportunities.</li>
          <li>Improve website performance and user experience.</li>
          <li>Analyse website traffic and visitor behaviour.</li>
          <li>Maintain internal business records.</li>
          <li>Prevent fraud, misuse, or unauthorized activities.</li>
          <li>Comply with legal and regulatory obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Corporate Information">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            Business information shared with Catertech is treated with appropriate
            confidentiality.
          </li>
          <li>
            Corporate information is used solely for legitimate business purposes.
          </li>
          <li>
            We do not disclose confidential business information except where required
            for service delivery, legal compliance, or with proper authorization.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Cookies & Tracking Technologies">
        <p>Our website may use:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Essential Cookies</li>
          <li>Google Analytics</li>
          <li>Meta Pixel</li>
          <li>Similar website analytics technologies</li>
        </ul>
        <p>These technologies help us:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Improve website functionality.</li>
          <li>Understand visitor behaviour.</li>
          <li>Measure marketing performance.</li>
          <li>Enhance user experience.</li>
          <li>Improve our services.</li>
        </ul>
        <p>
          Users may disable cookies through their browser settings; however, certain
          website features may not function correctly.
        </p>
      </LegalSection>

      <LegalSection title="6. Marketing Communications">
        <p>We may use your contact information to:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Respond to your enquiries.</li>
          <li>Send quotations.</li>
          <li>Share service updates.</li>
          <li>Inform you about promotions or offers.</li>
          <li>
            Communicate regarding products and services relevant to your enquiry.
          </li>
        </ul>
        <p>You may opt out of marketing communications at any time.</p>
      </LegalSection>

      <LegalSection title="7. Information Sharing">
        <p>
          Catertech does not sell, rent, or trade personal or corporate information.
          Information may only be shared with:
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Authorized employees.</li>
          <li>Trusted service providers.</li>
          <li>Professional consultants or advisers.</li>
          <li>Government or regulatory authorities where legally required.</li>
          <li>
            Courts or law enforcement agencies when required by applicable law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Data Security">
        <p>
          We implement reasonable administrative, technical, and organizational security
          measures, including:
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Secure website technologies.</li>
          <li>Access restrictions for authorized personnel.</li>
          <li>Confidentiality obligations for employees.</li>
          <li>Regular software and security updates.</li>
          <li>Security monitoring.</li>
          <li>Secure backup procedures.</li>
          <li>
            Protection against unauthorized access, alteration, or disclosure.
          </li>
        </ul>
        <p>
          While we take appropriate measures to protect information, no online
          transmission or storage system can be guaranteed to be completely secure.
        </p>
      </LegalSection>

      <LegalSection title="9. Data Retention">
        <p>Information may be retained:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>For as long as necessary to provide our services.</li>
          <li>To maintain business records.</li>
          <li>To comply with UAE legal and regulatory requirements.</li>
          <li>To resolve disputes.</li>
          <li>To enforce contractual rights.</li>
          <li>Until it is no longer required for legitimate business purposes.</li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Your Privacy Rights">
        <p>Subject to applicable UAE laws, you may request to:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Access your personal information.</li>
          <li>Correct inaccurate information.</li>
          <li>Update your information.</li>
          <li>Request deletion where legally permissible.</li>
          <li>Withdraw consent where applicable.</li>
          <li>
            Raise concerns regarding the processing of your information.
          </li>
        </ul>
        <p>
          Certain requests may be declined where Catertech is legally required to retain
          information.
        </p>
      </LegalSection>

      <LegalSection title="11. Third-Party Websites">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Our website may contain links to third-party websites.</li>
          <li>
            Catertech is not responsible for the privacy practices, content, or security
            of third-party websites.
          </li>
          <li>
            Users should review the privacy policies of external websites before
            providing any personal information.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="12. Children's Privacy">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            Our website is intended primarily for businesses and individuals aged 18 years
            or older.
          </li>
          <li>We do not knowingly collect personal information from children.</li>
          <li>
            If such information is identified, reasonable steps will be taken to remove
            it where appropriate.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="13. Compliance">
        <p>
          Catertech is committed to handling personal information in accordance with
          applicable laws and regulations of the United Arab Emirates, including relevant
          data protection requirements.
        </p>
      </LegalSection>

      <LegalSection title="14. Changes to this Privacy Policy">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            Catertech reserves the right to modify or update this Privacy Policy at any
            time.
          </li>
          <li>
            Updates become effective once published on this website.
          </li>
          <li>
            Continued use of the website constitutes acceptance of the revised Privacy
            Policy.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="15. Contact Information">
        <p>For any privacy-related enquiries, please contact:</p>
        <p className="font-semibold text-ink">Catertech Food Catering Services LLC</p>
        <ul className="list-none space-y-2 pl-0">
          <li>
            <span className="font-medium text-ink">Sales Email:</span>{" "}
            <Link
              href="mailto:sales@catertech.ae"
              className="font-semibold text-primary underline decoration-accent/50 underline-offset-2 transition-colors hover:text-accent-dark"
            >
              sales@catertech.ae
            </Link>
          </li>
          <li>
            <span className="font-medium text-ink">General Email:</span>{" "}
            <Link
              href="mailto:info@catertech.ae"
              className="font-semibold text-primary underline decoration-accent/50 underline-offset-2 transition-colors hover:text-accent-dark"
            >
              info@catertech.ae
            </Link>
          </li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
