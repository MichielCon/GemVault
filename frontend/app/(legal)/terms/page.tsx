import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — GemVault",
  description: "GemVault Terms of Service — free and paid plans, Belgian consumer law.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
      >
        ← Back to home
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated: 16 March 2026</p>

      <div className="mt-10 space-y-10 text-zinc-700 leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">1. Acceptance</h2>
          <p>
            By creating an account or using GemVault, you agree to be bound by these Terms of Service and our{" "}
            <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>. If you do
            not agree, do not use GemVault.
          </p>
          <p className="mt-3">
            Minimum age to create an account: <strong>13 years</strong>. If you are under 18, you confirm that
            a parent or legal guardian has reviewed and consented to these Terms on your behalf where required
            by applicable law.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">2. Service Description</h2>
          <p>
            GemVault is a gemstone inventory management application. It allows you to catalog gems and parcels,
            upload photos and certificates, generate public scan links, track purchase orders and sales, and
            view provenance data. Features available to you depend on your subscription plan (see{" "}
            <Link href="/#pricing" className="text-violet-600 hover:underline">Pricing</Link>).
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">3. Account Registration</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-700">
            <li>You must provide accurate and complete information when creating your account.</li>
            <li>You are responsible for keeping your login credentials secure and confidential.</li>
            <li>One account per person. You may not share your account credentials.</li>
            <li>
              We may suspend or terminate accounts that violate these Terms, without prior notice where
              required to protect the service or other users.
            </li>
            <li>Notify us immediately at <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">coninx.gemworks@outlook.com</a> if you suspect unauthorized access to your account.</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">4. Subscription Plans and Payment</h2>

          <h3 className="text-base font-semibold text-zinc-800 mt-6 mb-2">4.1 Free Plan</h3>
          <p>No payment required. Subject to usage limits described on the pricing page. We reserve the right to update limits with 30 days' notice.</p>

          <h3 className="text-base font-semibold text-zinc-800 mt-6 mb-2">4.2 Business Plan ($29/month)</h3>
          <p>
            Paid monthly. Billed on the same date each month (or the closest valid date for shorter months).
            VAT will be added for EU customers based on your country of residence or establishment.
          </p>

          <h3 className="text-base font-semibold text-zinc-800 mt-6 mb-2">4.3 Enterprise Plan</h3>
          <p>Custom pricing. Contact <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">coninx.gemworks@outlook.com</a> for details.</p>

          <h3 className="text-base font-semibold text-zinc-800 mt-6 mb-2">4.4 Pricing and VAT</h3>
          <p>
            All prices shown on the pricing page are exclusive of VAT. VAT will be calculated and added at
            checkout based on your country. If you are a VAT-registered business in the EU, you may provide
            your VAT number to zero-rate the supply (reverse charge).
          </p>

          <h3 className="text-base font-semibold text-zinc-800 mt-6 mb-2">4.5 Payment Processing</h3>
          <p>
            Payments are processed by <strong>[PAYMENT PROVIDER PLACEHOLDER]</strong>. By subscribing, you
            agree to their terms of service. We do not store your payment card details.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">5. Right of Withdrawal (EU/Belgian Consumers)</h2>
          <p>
            If you are a consumer in the European Union, you have a <strong>14-day right of withdrawal</strong>{" "}
            from the date of your subscription, without giving a reason (Art. XII.47 §1 WER / Directive 2011/83/EU).
          </p>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900">
            <p className="font-semibold">Important: Express waiver of the withdrawal right</p>
            <p className="mt-2 text-sm">
              If you request immediate access to the paid features at the time of subscription — by checking
              the confirmation box at checkout — you <strong>expressly waive your right of withdrawal</strong> for
              the portion of the service already delivered, as permitted by Art. 16(m) of Directive 2011/83/EU
              (Art. VI.53, 13° WER). You acknowledge that the service begins immediately and that, once the
              service has been fully performed, the right of withdrawal is lost.
            </p>
          </div>

          <p className="mt-4">
            To exercise your withdrawal right (if not waived), send an unambiguous statement to{" "}
            <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">coninx.gemworks@outlook.com</a>{" "}
            within 14 days of your subscription. You will receive a full refund within 14 days via the original
            payment method.
          </p>

          <div className="mt-4 bg-zinc-50 border border-zinc-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-zinc-700">Model Withdrawal Form (Annex I, Consumer Rights Directive)</p>
            <p className="mt-2 text-sm text-zinc-600">
              To: coninx.gemworks@outlook.com<br /><br />
              I hereby give notice that I withdraw from my contract for the GemVault [Business / Enterprise] subscription.<br /><br />
              Subscribed on: [DATE]<br />
              Name: [YOUR FULL NAME]<br />
              Address: [YOUR ADDRESS]<br />
              Date: [DATE]
            </p>
          </div>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">6. Cancellation</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-700">
            <li>You may cancel your subscription at any time from your account settings or by emailing <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">coninx.gemworks@outlook.com</a>.</li>
            <li>Cancellation takes effect at the end of the current billing period. You retain access to paid features until then.</li>
            <li>No partial refunds are given for unused time, except within the withdrawal period (Section 5).</li>
            <li>After cancellation, your account reverts to the Free plan. Your data is retained subject to Free plan limits.</li>
          </ul>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">7. Auto-Renewal</h2>
          <p>
            Paid subscriptions renew automatically at the end of each billing period at the then-current price.
            We will send a reminder email at least <strong>7 days before renewal</strong>. To disable
            auto-renewal, cancel your subscription before the renewal date (see Section 6).
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">8. Acceptable Use</h2>
          <p>You may not use GemVault to:</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-700 mt-3">
            <li>Violate any applicable law or regulation.</li>
            <li>Infringe the intellectual property rights of any third party.</li>
            <li>Upload malicious files, malware, or harmful content.</li>
            <li>Attempt to gain unauthorized access to other accounts, systems, or data.</li>
            <li>Reverse-engineer, decompile, or attempt to extract the source code of GemVault.</li>
            <li>Use the service for commercial resale or redistribution without our written permission.</li>
            <li>Scrape or systematically download data from the service.</li>
          </ul>
          <p className="mt-4">
            Violation of these rules may result in immediate account suspension without refund.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">9. User Content</h2>
          <p>
            You retain full ownership of all content you upload to GemVault, including photos, certificates,
            and gem data. By uploading content, you grant us a limited, non-exclusive, royalty-free license
            to store and serve that content solely for the purpose of providing the service to you.
          </p>
          <p className="mt-3">
            We do not claim ownership of your content. We will not use your content for any purpose other than
            operating the service.
          </p>
          <p className="mt-3">
            You are responsible for ensuring you have the right to upload any content you add to GemVault
            (e.g., photos, certificates obtained from third parties).
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">10. Data and Privacy</h2>
          <p>
            Our collection and use of your personal data is described in our{" "}
            <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>, which
            forms part of these Terms.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">11. Service Availability</h2>
          <p>
            We aim for high availability but do not guarantee uninterrupted or error-free service. Planned
            maintenance will be communicated in advance when possible. We are not liable for losses resulting
            from downtime, except to the extent required by mandatory Belgian consumer law.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">12. Conformity of Digital Service (Directive 2019/770)</h2>
          <p>
            GemVault will be maintained and updated to conform to its described functionality. If the service
            materially fails to conform, you may request a remedy. For paid plans, persistent non-conformity
            entitles you to a proportionate price reduction or contract termination in accordance with Belgian
            consumer law implementing Directive 2019/770 on contracts for digital content and services.
          </p>
        </section>

        {/* 13 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">13. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by Belgian consumer law, our total liability for any claim arising
            out of or relating to these Terms or the service is limited to the total amount you paid to us in
            the <strong>3 months preceding the claim</strong>.
          </p>
          <p className="mt-3">
            Nothing in these Terms limits or excludes liability for death, personal injury caused by
            negligence, fraud, or any other liability that cannot be excluded under applicable law.
          </p>
        </section>

        {/* 14 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">14. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be communicated by email at
            least <strong>14 days before the effective date</strong>. Minor changes (such as corrections or
            clarifications that do not affect your rights) may be made without notice. The "last updated"
            date at the top of this page reflects the most recent revision. Continued use of the service
            after the effective date constitutes acceptance of the updated Terms.
          </p>
        </section>

        {/* 15 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">15. Governing Law and Disputes</h2>
          <p>
            These Terms are governed by Belgian law. Disputes arising out of or in connection with these
            Terms are subject to the jurisdiction of the Belgian courts.
          </p>
          <p className="mt-3">
            As an EU consumer, you may also use the EU Online Dispute Resolution platform:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 hover:underline"
            >
              ec.europa.eu/consumers/odr
            </a>.
            Our email address for ODR purposes is{" "}
            <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">
              coninx.gemworks@outlook.com
            </a>.
          </p>
        </section>

        {/* 16 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">16. Contact</h2>
          <p>
            For questions about these Terms:{" "}
            <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">
              coninx.gemworks@outlook.com
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
