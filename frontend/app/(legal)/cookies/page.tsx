import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — GemVault",
  description: "GemVault Cookie Policy — strictly necessary cookies only, no consent banner required.",
};

export default function CookiesPage() {
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
      <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Cookie Policy</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated: 16 March 2026</p>

      <div className="mt-10 space-y-10 text-zinc-700 leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that a website stores on your device when you visit. They are sent
            back to the website on subsequent requests so the site can remember information about you — for
            example, that you are logged in.
          </p>
          <p className="mt-3">
            GemVault uses <strong>httpOnly cookies</strong>. These are a specific type of cookie that cannot
            be read or modified by JavaScript running in your browser. They are set and read exclusively by
            the server, which makes them significantly more secure than ordinary cookies for storing
            authentication tokens.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">2. Cookies We Use</h2>
          <p className="mb-4">
            GemVault uses exactly two cookies, both strictly necessary for authentication:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-100">
                  <th className="border border-zinc-200 px-4 py-2 text-left font-semibold text-zinc-700">Name</th>
                  <th className="border border-zinc-200 px-4 py-2 text-left font-semibold text-zinc-700">Type</th>
                  <th className="border border-zinc-200 px-4 py-2 text-left font-semibold text-zinc-700">Purpose</th>
                  <th className="border border-zinc-200 px-4 py-2 text-left font-semibold text-zinc-700">Duration</th>
                  <th className="border border-zinc-200 px-4 py-2 text-left font-semibold text-zinc-700">Required?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-zinc-50">
                  <td className="border border-zinc-200 px-4 py-3 font-mono text-xs text-zinc-800 whitespace-nowrap">gemvault_access</td>
                  <td className="border border-zinc-200 px-4 py-3 text-zinc-700">Strictly Necessary</td>
                  <td className="border border-zinc-200 px-4 py-3 text-zinc-700">JWT authentication token — identifies your logged-in session and authorizes API requests.</td>
                  <td className="border border-zinc-200 px-4 py-3 text-zinc-700 whitespace-nowrap">Session (on browser close)</td>
                  <td className="border border-zinc-200 px-4 py-3 text-zinc-700">Yes</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="border border-zinc-200 px-4 py-3 font-mono text-xs text-zinc-800 whitespace-nowrap">gemvault_refresh</td>
                  <td className="border border-zinc-200 px-4 py-3 text-zinc-700">Strictly Necessary</td>
                  <td className="border border-zinc-200 px-4 py-3 text-zinc-700">Refresh token — allows you to remain logged in and obtain a new access token without re-entering your password.</td>
                  <td className="border border-zinc-200 px-4 py-3 text-zinc-700 whitespace-nowrap">7 days</td>
                  <td className="border border-zinc-200 px-4 py-3 text-zinc-700">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            Both cookies are set with the <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">httpOnly</code>,{" "}
            <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">Secure</code>, and{" "}
            <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">SameSite=Strict</code> flags for security.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">3. Strictly Necessary Cookies</h2>
          <p>
            Both cookies listed above are <strong>strictly necessary</strong> for the service to function.
            Under the ePrivacy Directive (Directive 2002/58/EC) as transposed into Belgian law, strictly
            necessary cookies do not require your prior consent. No cookie consent banner or cookie wall
            is displayed because there is nothing optional to consent to.
          </p>
          <p className="mt-3">
            You cannot disable these cookies without losing access to your GemVault account, as they are
            the sole mechanism by which the service authenticates you.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">4. What We Do Not Use</h2>
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 text-violet-900">
            <p className="font-semibold mb-2">GemVault does NOT use:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Analytics cookies (Google Analytics, Plausible, Fathom, Matomo, or similar).</li>
              <li>Advertising or targeting cookies.</li>
              <li>Third-party social media cookies or pixels (Facebook, LinkedIn, Twitter/X, etc.).</li>
              <li>Fingerprinting or device tracking techniques.</li>
              <li>Local storage or IndexedDB for tracking purposes.</li>
              <li>Any third-party scripts that set cookies.</li>
            </ul>
          </div>
          <p className="mt-4">
            As a result, no cookie consent banner is displayed — there are no non-essential cookies to
            consent to.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">5. Managing Cookies</h2>
          <p>
            You can view, manage, and delete cookies at any time using your browser settings:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-700 mt-3">
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data.</li>
            <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data.</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data.</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions.</li>
          </ul>
          <p className="mt-4">
            Please note: clearing your GemVault cookies will log you out of the service.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">6. Future Changes</h2>
          <p>
            If we ever introduce non-essential cookies (for example, optional analytics to improve the
            service), we will update this policy and, where required by law, implement a consent mechanism
            before activating those cookies.
          </p>
          <p className="mt-3">
            Material changes to this Cookie Policy will be announced in line with our{" "}
            <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>{" "}
            (14 days' notice by email for registered users).
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">7. Contact</h2>
          <p>
            Questions about this Cookie Policy:{" "}
            <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">
              coninx.gemworks@outlook.com
            </a>
          </p>
          <p className="mt-3">
            For more information about how we handle personal data, see our full{" "}
            <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>.
          </p>
        </section>

      </div>
    </div>
  );
}
