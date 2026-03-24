import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Notice — GemVault",
  description: "Legal Notice / Impressum for GemVault — Belgian Book XII WER (E-Commerce Law).",
};

export default function LegalNoticePage() {
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
      <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Legal Notice</h1>
      <p className="mt-1 text-sm text-zinc-500 italic">Wettelijke Informatie / Mentions Légales</p>
      <p className="mt-2 text-sm text-zinc-500">
        Published in accordance with Belgian Book XII of the Code of Economic Law (WER) on electronic commerce.
      </p>

      <div className="mt-10 space-y-10 text-zinc-700 leading-relaxed">

        {/* Operator */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Operator</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Name</dt>
              <dd className="font-medium text-zinc-800">[YOUR FULL NAME]</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Address</dt>
              <dd className="font-medium text-zinc-800">[YOUR ADDRESS]<br />Belgium</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Email</dt>
              <dd className="font-medium text-zinc-800">
                <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">
                  coninx.gemworks@outlook.com
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-4 bg-violet-50 border border-violet-200 rounded-lg p-4 text-violet-900 text-sm">
            GemVault is a personal project operated by a natural person. It is not (yet) a registered
            company. No VAT number or KBO / BCE registration number applies at this time.
          </div>
        </section>

        {/* Service */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Service</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Service name</dt>
              <dd className="font-medium text-zinc-800">GemVault</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Description</dt>
              <dd className="font-medium text-zinc-800">Gemstone inventory management web application for collectors and businesses.</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Available at</dt>
              <dd className="font-medium text-zinc-800">gemvault.app</dd>
            </div>
          </dl>
        </section>

        {/* Hosting */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Hosting</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Provider</dt>
              <dd className="font-medium text-zinc-800">[VPS PROVIDER PLACEHOLDER]</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Address</dt>
              <dd className="font-medium text-zinc-800">[VPS PROVIDER ADDRESS PLACEHOLDER]</dd>
            </div>
          </dl>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Intellectual Property</h2>
          <p>
            All content, design, and code of GemVault — including but not limited to text, graphics, logos,
            and software — is the property of the operator unless otherwise noted.
          </p>
          <p className="mt-3">
            Unauthorized reproduction, distribution, or use of any part of GemVault in any form or by any
            means without the prior written permission of the operator is prohibited.
          </p>
          <p className="mt-3">
            Users retain full ownership of content they upload (gem photos, certificates, collection data).
            See the <Link href="/terms" className="text-violet-600 hover:underline">Terms of Service</Link>{" "}
            for details.
          </p>
        </section>

        {/* Liability */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Liability Disclaimer</h2>
          <p>
            GemVault is provided "as is" without warranties of any kind. While we strive for accuracy,
            reliability, and continuous availability, we make no guarantees regarding:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-700 mt-3">
            <li>Uninterrupted or error-free service.</li>
            <li>Loss of data due to technical failures.</li>
            <li>Accuracy of any third-party content.</li>
          </ul>
          <p className="mt-4">
            Users are responsible for maintaining their own backups of important data. The operator's
            liability is limited to the extent permitted by Belgian consumer law.
          </p>
        </section>

        {/* Applicable Law */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Applicable Law and Jurisdiction</h2>
          <p>
            This service is governed by Belgian law. Any dispute arising out of or in connection with this
            service shall be subject to the exclusive jurisdiction of the Belgian courts, unless mandatory
            consumer protection rules of another EU member state apply.
          </p>
          <p className="mt-3">
            EU consumers may also use the EU Online Dispute Resolution platform:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 hover:underline"
            >
              ec.europa.eu/consumers/odr
            </a>
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Contact for Legal Matters</h2>
          <p>
            <a href="mailto:coninx.gemworks@outlook.com" className="text-violet-600 hover:underline">
              coninx.gemworks@outlook.com
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
