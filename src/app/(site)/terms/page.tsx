import LegalPageLayout, { LegalSection } from "@/components/legal/LegalPageLayout";
import Link from "next/link";

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="The terms that govern use of the Catertech website, catalogue, enquiries, quotations, and commercial services across the UAE."
      lastUpdated="July 7, 2026"
    >
      <LegalSection title="1. Acceptance of Terms">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            By accessing or using this website, you agree to comply with these Terms
            &amp; Conditions. If you do not agree with any part of these Terms, please
            discontinue using this website.
          </li>
          <li>
            These Terms apply to all visitors, clients, suppliers, partners, and users
            of the website.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. About Catertech">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            This website is owned and operated by Catertech Food Catering Services LLC.
          </li>
          <li>
            The website is intended to provide information about our catering,
            hospitality, event management, equipment rental, furniture rental, and
            related business services.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Website Usage">
        <p>Users agree to:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Use the website only for lawful purposes.</li>
          <li>Submit accurate and complete information.</li>
          <li>Not impersonate another individual or organization.</li>
          <li>Not upload malicious software, viruses, or harmful code.</li>
          <li>
            Not interfere with the website&apos;s security, servers, or functionality.
          </li>
          <li>
            Not attempt unauthorized access to any part of the website or its systems.
          </li>
          <li>Not use the website for fraudulent or unlawful activities.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Enquiries & Quotations">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            All enquiries submitted through this website are treated as requests for
            information only.
          </li>
          <li>
            Submission of an enquiry does not constitute a confirmed booking,
            agreement, or contractual relationship.
          </li>
          <li>
            Any pricing, estimates, budgets, or verbal discussions are indicative only
            unless confirmed in writing.
          </li>
          <li>
            Official quotations are issued only through Catertech Food Catering Services
            LLC&apos;s authorized company email addresses, including but not limited to:{" "}
            <Link
              href="mailto:sales@catertech.ae"
              className="font-semibold text-primary underline decoration-accent/50 underline-offset-2 transition-colors hover:text-accent-dark"
            >
              sales@catertech.ae
            </Link>{" "}
            and{" "}
            <Link
              href="mailto:info@catertech.ae"
              className="font-semibold text-primary underline decoration-accent/50 underline-offset-2 transition-colors hover:text-accent-dark"
            >
              info@catertech.ae
            </Link>
            .
          </li>
          <li>
            A quotation shall only be considered valid when issued by an authorized
            Catertech representative through an official company email.
          </li>
          <li>
            Quotations are based on the information available at the time of preparation
            and remain subject to scope, site conditions, availability, client
            requirements, and applicable taxes.
          </li>
          <li>
            Catertech reserves the right to revise, withdraw, or update any quotation
            before written acceptance or execution of a formal agreement.
          </li>
          <li>
            Any changes to the project scope, quantities, venue, schedule, or client
            requirements may result in revised pricing and timelines.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Booking Confirmation">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>A quotation does not confirm a booking.</li>
          <li>
            Services are considered confirmed only after written acceptance by Catertech
            and completion of any applicable commercial requirements, including signed
            agreements, purchase orders, or advance payments where applicable.
          </li>
          <li>
            Catertech reserves the right to decline any enquiry or booking request at
            its discretion and in accordance with applicable law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Service Availability">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            All services, rental equipment, furniture, staffing, and related resources
            are subject to availability.
          </li>
          <li>
            Catertech may substitute equivalent products or equipment where operationally
            necessary while maintaining the agreed service standard.
          </li>
          <li>
            Timelines and delivery schedules may be affected by factors beyond our
            reasonable control.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Website Content & Portfolio">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            All information published on this website is provided for general
            informational purposes.
          </li>
          <li>
            Images, videos, and portfolio content are intended to showcase previous work
            and service capabilities.
          </li>
          <li>
            Actual event setups, décor, furniture, equipment, food presentation,
            lighting effects, colours, branding, and final deliverables may vary
            depending on:
            <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-accent/80">
              <li>Client requirements</li>
              <li>Venue conditions</li>
              <li>Product availability</li>
              <li>Lighting and photography</li>
              <li>Seasonal availability</li>
              <li>Operational requirements</li>
            </ul>
          </li>
          <li>
            Images should not be interpreted as an exact representation or guarantee of
            the final deliverables unless expressly agreed in writing.
          </li>
          <li>
            Colours, textures, finishes, and product appearance may vary slightly due
            to photography, lighting, display screens, or manufacturing variations.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Intellectual Property">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            All content on this website, including text, graphics, photographs, videos,
            logos, branding, designs, layouts, and other materials, is the property of
            Catertech Food Catering Services LLC or is used under appropriate licence.
          </li>
          <li>
            No content may be copied, reproduced, modified, distributed, published, or
            commercially used without prior written permission.
          </li>
          <li>Unauthorized use may result in legal action.</li>
        </ul>
      </LegalSection>

      <LegalSection title="9. User Submissions">
        <p>By submitting information through this website, you confirm that:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>The information provided is accurate and complete.</li>
          <li>You have the authority to provide such information.</li>
          <li>
            Your submission does not violate any applicable law or third-party rights.
          </li>
          <li>
            Catertech may contact you regarding your enquiry using the details provided.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Privacy">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            Personal and corporate information is collected, processed, and stored in
            accordance with our{" "}
            <Link
              href="/privacy-policy"
              className="font-semibold text-primary underline decoration-accent/50 underline-offset-2 transition-colors hover:text-accent-dark"
            >
              Privacy Policy
            </Link>
            .
          </li>
          <li>
            By using this website, you acknowledge and agree to the collection and
            processing of information as described in our Privacy Policy.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="11. Third-Party Links">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            This website may contain links to third-party websites for convenience.
          </li>
          <li>
            Catertech is not responsible for the content, availability, security,
            privacy practices, or services provided by third-party websites.
          </li>
          <li>
            Accessing third-party websites is at your own discretion and risk.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="12. Website Availability">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            While we strive to maintain uninterrupted website access, Catertech does
            not guarantee continuous availability.
          </li>
          <li>
            We reserve the right to modify, suspend, update, or discontinue any part of
            the website without prior notice for maintenance, security, or operational
            reasons.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="13. Limitation of Liability">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            To the fullest extent permitted by applicable law, Catertech shall not be
            liable for any direct, indirect, incidental, consequential, special, or
            punitive damages arising from the use of, or inability to use, this website.
          </li>
          <li>
            Catertech shall not be responsible for losses resulting from internet
            failures, technical issues, cyber incidents, third-party services, force
            majeure events, or circumstances beyond its reasonable control.
          </li>
          <li>
            Nothing in these Terms excludes or limits liability where such exclusion is
            prohibited under applicable law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="14. Indemnity">
        <p>
          You agree to indemnify and hold harmless Catertech Food Catering Services LLC,
          its directors, employees, representatives, and affiliates against any claims,
          losses, damages, liabilities, costs, or expenses arising from:
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>Your misuse of this website.</li>
          <li>Your breach of these Terms &amp; Conditions.</li>
          <li>Your violation of any applicable law or third-party rights.</li>
        </ul>
      </LegalSection>

      <LegalSection title="15. Force Majeure">
        <p>
          Catertech shall not be liable for delays or failure to perform obligations
          caused by events beyond its reasonable control, including but not limited to
          natural disasters, fire, floods, pandemics, government actions, transportation
          disruptions, labour disputes, internet outages, power failures, or other force
          majeure events.
        </p>
      </LegalSection>

      <LegalSection title="16. Modifications">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            Catertech reserves the right to amend these Terms &amp; Conditions at any
            time.
          </li>
          <li>
            Updated Terms become effective immediately upon publication on this website.
          </li>
          <li>
            Continued use of the website constitutes acceptance of the revised Terms.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="17. Governing Law">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          <li>
            These Terms &amp; Conditions shall be governed by and interpreted in
            accordance with the laws of the United Arab Emirates.
          </li>
          <li>
            Any dispute arising from the use of this website shall be subject to the
            jurisdiction of the competent courts of the United Arab Emirates, unless
            otherwise required by applicable law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="18. Contact Us">
        <p>
          For any questions regarding these Terms &amp; Conditions, please contact:
        </p>
        <p className="font-semibold text-ink">Catertech Food Catering Services LLC</p>
        <ul className="list-none space-y-2 pl-0">
          <li>
            <span className="font-medium text-ink">Sales:</span>{" "}
            <Link
              href="mailto:sales@catertech.ae"
              className="font-semibold text-primary underline decoration-accent/50 underline-offset-2 transition-colors hover:text-accent-dark"
            >
              sales@catertech.ae
            </Link>
          </li>
          <li>
            <span className="font-medium text-ink">General Enquiries:</span>{" "}
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
