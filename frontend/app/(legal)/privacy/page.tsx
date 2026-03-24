import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — GemVault",
  description: "GemVault Privacy Policy — GDPR-compliant, Belgian operator.",
};

export default function PrivacyPage() {
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
      <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated: 16 March 2026</p>

      <div className="mt-10 space-y-10 text-zinc-700 leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">1. Who We Are</h2>
          <p>
            GemVault is operated by <strong>[YOUR FULL NAME]</strong>, a natural person residing in Belgium.
            This is a personal project, not a registered company.
          </p>
          <p className="mt-3">
            Contact: <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">coninx.gemworks@outlook.com</a>
          </p>
          <p className="mt-3">
            As the operator, we act as the <strong>data controller</strong> within the meaning of the General Data
            Protection Regulation (GDPR — Regulation (EU) 2016/679).
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">2. Data We Collect</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-700">
            <li><strong>Account data:</strong> email address, password (hashed with a strong one-way algorithm — never stored in plain text).</li>
            <li><strong>Profile data:</strong> display name (optional).</li>
            <li><strong>Collection data:</strong> gem and parcel details, photos, and certificates you upload.</li>
            <li><strong>Usage data:</strong> session tokens (JWT) stored in httpOnly cookies — these are not readable by JavaScript and are used solely for authentication.</li>
            <li><strong>Technical data:</strong> server logs including IP address, timestamp, HTTP method, and response code. Retained for a maximum of 90 days.</li>
          </ul>
          <p className="mt-4">
            We do not collect payment card numbers directly. Payment data is handled by our payment processor (see Section 5).
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">3. Legal Basis for Processing (GDPR Art. 6)</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-700">
            <li><strong>Account management and service delivery</strong> — Contract performance (Art. 6(1)(b)): processing is necessary to provide the GemVault service you requested.</li>
            <li><strong>Security and fraud prevention</strong> — Legitimate interests (Art. 6(1)(f)): we process technical data to protect the service and its users.</li>
            <li><strong>Billing records</strong> — Legal obligation (Art. 6(1)(c)): Belgian accounting law requires retention of financial records for 7 years.</li>
          </ul>
          <p className="mt-4">
            We do not use your data for marketing, profiling, or advertising.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">4. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-700">
            <li>To provide and operate the GemVault service.</li>
            <li>To authenticate you using JWT tokens stored in httpOnly cookies.</li>
            <li>To store and display your gem collection.</li>
            <li>To process payments, if you are on a paid plan.</li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">5. Data Sharing and Third-Party Processors (GDPR Art. 28)</h2>
          <p>
            We do not sell or share your personal data with third parties for their own purposes.
          </p>
          <p className="mt-3">
            We use the following sub-processors, with whom we have signed (or are in the process of signing) Data
            Processing Agreements:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-700 mt-3">
            <li><strong>Hosting provider:</strong> [VPS PROVIDER PLACEHOLDER] — servers located in [EU / LOCATION PLACEHOLDER]. Processes all application data.</li>
            <li><strong>Payment processor:</strong> [PAYMENT PROVIDER PLACEHOLDER] — processes subscription payment data for paid plans.</li>
          </ul>
          <p className="mt-4">
            We do not use analytics tools, advertising networks, or tracking pixels.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">6. Cookies and Local Storage</h2>
          <p>We use two httpOnly cookies:</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-700 mt-3">
            <li>
              <strong>gemvault_access</strong> — JWT access token, valid for the session duration. Strictly necessary for authentication.
            </li>
            <li>
              <strong>gemvault_refresh</strong> — Refresh token, valid for 7 days. Allows you to remain logged in without re-entering your password. Strictly necessary.
            </li>
          </ul>
          <p className="mt-4">
            These cookies are strictly necessary for the service to function. They cannot be disabled without losing access to your account. Under the ePrivacy Directive as transposed into Belgian law, strictly necessary cookies do not require your consent, and no cookie consent banner is displayed.
          </p>
          <p className="mt-3">
            We do not use tracking, analytics, or advertising cookies. See our full{" "}
            <Link href="/cookies" className="text-violet-600 hover:underline">Cookie Policy</Link>.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">7. Public Scan Pages</h2>
          <p>
            If you enable a public share link for a gem, certain gem details become accessible to anyone with
            that link, without authentication. You control what is public. You can disable public access at any
            time by removing the public token from the gem in your account settings.
          </p>
          <p className="mt-3">
            Public scan pages do not collect visitor personal data beyond standard server logs (see Section 2).
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">8. Data Retention</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-700">
            <li><strong>Account data:</strong> retained until you delete your account, plus a 30-day grace period to allow recovery.</li>
            <li><strong>Collection data (gems, photos, certificates):</strong> deleted immediately upon account deletion.</li>
            <li><strong>Payment records:</strong> retained for 7 years after the last transaction, as required by Belgian accounting law. This retention obligation overrides your right to erasure for billing records only.</li>
            <li><strong>Server logs:</strong> maximum 90 days.</li>
            <li><strong>Refresh tokens:</strong> expire after 7 days; expired tokens are purged regularly.</li>
          </ul>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">9. Your Rights (GDPR Art. 15–22)</h2>
          <p>You have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-700 mt-3">
            <li><strong>Right of access (Art. 15):</strong> request a copy of all personal data we hold about you.</li>
            <li><strong>Right to rectification (Art. 16):</strong> ask us to correct inaccurate or incomplete data.</li>
            <li><strong>Right to erasure / "right to be forgotten" (Art. 17):</strong> request deletion of your account and all associated personal data.</li>
            <li><strong>Right to restriction of processing (Art. 18):</strong> ask us to pause processing of your data in certain circumstances.</li>
            <li><strong>Right to data portability (Art. 20):</strong> receive your data in a machine-readable format.</li>
            <li><strong>Right to object (Art. 21):</strong> object to processing based on legitimate interests.</li>
            <li><strong>Right to withdraw consent:</strong> where we rely on consent (currently none), you may withdraw at any time without affecting the lawfulness of prior processing.</li>
          </ul>
          <div className="mt-4 bg-violet-50 border border-violet-200 rounded-lg p-4 text-violet-900">
            <p className="font-semibold">How to exercise your rights</p>
            <p className="mt-1 text-sm">
              Email <a href="mailto:coninx.gemworks@outlook.com" className="underline">coninx.gemworks@outlook.com</a>{" "}
              with the subject line <strong>"GDPR Request — [Right]"</strong>. We will respond within 30 days.
            </p>
            <p className="mt-2 text-sm">
              <strong>Self-service:</strong> You can delete your account and all associated data directly from
              your profile settings at any time without contacting us.
            </p>
          </div>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">10. Right to Lodge a Complaint</h2>
          <p>
            You have the right to lodge a complaint with the Belgian Data Protection Authority (GBA / APD):
          </p>
          <ul className="list-none space-y-1 text-zinc-700 mt-3">
            <li>Website: <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">www.gegevensbeschermingsautoriteit.be</a></li>
            <li>Address: Rue de la Presse 35, 1000 Brussels, Belgium</li>
            <li>Phone: +32 2 274 48 00</li>
            <li>Email: <a href="mailto:contact@apd-gba.be" className="text-violet-600 hover:underline">contact@apd-gba.be</a></li>
          </ul>
          <p className="mt-3">
            You may also lodge a complaint with the supervisory authority in your EU country of residence.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">11. Data Security</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-700">
            <li>Passwords are hashed using industry-standard algorithms and are never stored in plain text.</li>
            <li>All data is transmitted over HTTPS/TLS.</li>
            <li>JWT tokens are stored in httpOnly, Secure, SameSite=Strict cookies.</li>
            <li>Photos and certificates are stored in private object storage (MinIO) and are not publicly accessible without a valid session.</li>
            <li>Access to your data is restricted to your account only.</li>
          </ul>
        </section>

        {/* 12 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">12. Children's Privacy</h2>
          <p>
            GemVault is not directed at children under 13. We do not knowingly collect personal data from
            children under 13. If you are under 13, please do not create an account. If we become aware that
            a child under 13 has provided personal data, we will delete it promptly. Contact us at{" "}
            <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">coninx.gemworks@outlook.com</a>{" "}
            if you believe this has occurred.
          </p>
        </section>

        {/* 13 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">13. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify registered users of material
            changes by email at least 14 days before the change takes effect. The "last updated" date at the
            top of this page reflects the most recent revision. Continued use of the service after the effective
            date constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* 14 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">14. Contact</h2>
          <p>
            For any privacy-related questions or requests, contact us at:{" "}
            <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">coninx.gemworks@outlook.com</a>
          </p>
        </section>

      </div>
    </div>
  );
}
