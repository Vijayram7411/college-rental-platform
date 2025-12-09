import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#212121]">Terms and Conditions</h1>
        <p className="mt-2 text-sm text-gray-600">Last Updated: December 9, 2024</p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm text-gray-700">
        {/* Section 1 */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-[#212121]">1. Introduction and Acceptance</h2>
          <p className="mb-3">
            Welcome to our College Rental Platform (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using this Platform, you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Platform.
          </p>
          <h3 className="mb-2 font-semibold text-[#212121]">1.1 Platform Purpose</h3>
          <p className="mb-3">
            This Platform operates as a peer-to-peer marketplace exclusively for college students to rent and lend items within their college community.
          </p>
          <h3 className="mb-2 font-semibold text-[#212121]">1.2 Binding Agreement</h3>
          <p>
            These Terms constitute a legally binding agreement between you and the Platform. By registering an account, listing items, or renting items, you acknowledge that you have read, understood, and agree to be bound by these Terms.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-[#212121]">2. Platform Role and Scope</h2>
          <h3 className="mb-2 font-semibold text-[#212121]">2.1 Intermediary Service</h3>
          <p className="mb-3">
            The Platform acts <strong>solely as a digital intermediary</strong> that facilitates connections between:
          </p>
          <ul className="mb-3 ml-6 list-disc space-y-1">
            <li><strong>Lenders:</strong> Users who list items available for rent</li>
            <li><strong>Borrowers:</strong> Users who rent items from Lenders</li>
          </ul>
          <h3 className="mb-2 font-semibold text-[#212121]">2.2 No Ownership or Control</h3>
          <p className="mb-2">The Platform:</p>
          <ul className="mb-3 ml-6 list-disc space-y-1">
            <li>Does NOT own, control, manage, inspect, certify, or guarantee any items listed</li>
            <li>Does NOT participate in rental transactions between Users</li>
            <li>Does NOT act as an agent, representative, or guarantor for any User</li>
            <li>Does NOT provide storage, delivery, or handling services for items</li>
          </ul>
          <h3 className="mb-2 font-semibold text-[#212121]">2.3 Direct User Transactions</h3>
          <p>
            All rental transactions, agreements, and arrangements occur <strong>directly between the Lender and Borrower</strong>. The Platform merely provides the technology infrastructure to enable these peer-to-peer connections.
          </p>
        </section>

        {/* Section 3 - Critical Section */}
        <section className="rounded-lg border-2 border-red-500 bg-red-50 p-4">
          <h2 className="mb-3 text-xl font-bold text-red-800">3. No Warranty or Guarantee of Product Condition</h2>
          <h3 className="mb-2 font-semibold text-red-800">3.1 As-Is Basis</h3>
          <p className="mb-3 font-bold text-red-800">
            ALL ITEMS LISTED ON THE PLATFORM ARE PROVIDED &quot;AS-IS&quot; BY LENDERS.
          </p>
          <p className="mb-2">The Platform makes <strong>NO WARRANTIES</strong>—express, implied, statutory, or otherwise—regarding:</p>
          <ul className="mb-3 ml-6 list-disc space-y-1">
            <li>The quality, safety, functionality, or performance of any item</li>
            <li>The accuracy, completeness, or truthfulness of item descriptions</li>
            <li>The presence or absence of damage, defects, or technical issues</li>
            <li>The suitability of items for any particular purpose</li>
            <li>The condition of items at the time of listing, rental, or return</li>
          </ul>
        </section>

        {/* Section 6 - Most Critical */}
        <section className="rounded-lg border-2 border-orange-500 bg-orange-50 p-4">
          <h2 className="mb-3 text-xl font-bold text-orange-800">6. Platform Liability Limitation</h2>
          <div className="mb-4 rounded-md bg-orange-100 p-3">
            <h3 className="mb-2 text-lg font-bold text-orange-900">⚠️ CRITICAL LIABILITY CLAUSE</h3>
            <p className="font-bold text-orange-900">
              THE PLATFORM SHALL NOT BE HELD RESPONSIBLE FOR ANY MISSING, LOST, STOLEN, DAMAGED, OR DEFECTIVE PRODUCTS.
            </p>
          </div>
          <p className="mb-3">
            Any issue relating to product condition, breakage, malfunction, non-return, theft, or loss is <strong>strictly a matter between the Lender and the Borrower</strong>.
          </p>
          <p className="mb-3">
            The Platform&apos;s role is <strong>limited to connecting both parties</strong> and does NOT include handling, verifying, or safeguarding any items.
          </p>
          <p className="font-semibold">
            ALL responsibility for item condition, safety, delivery, return, and dispute resolution rests solely with the Lender and Borrower.
          </p>
        </section>

        {/* Remaining sections summary */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-[#212121]">Additional Terms</h2>
          <div className="space-y-2">
            <p><strong>4. Lender Responsibilities:</strong> Lenders must ensure items are safe, functional, and accurately described.</p>
            <p><strong>5. Borrower Responsibilities:</strong> Borrowers must inspect items, use them properly, and return them on time.</p>
            <p><strong>7. No Responsibility for Disputes:</strong> Users must resolve disputes directly with each other.</p>
            <p><strong>8. Right to Remove:</strong> Platform can remove listings or suspend accounts at its discretion.</p>
            <p><strong>9. User Eligibility:</strong> Must be a current college student, 18+ years old.</p>
            <p><strong>10. Prohibited Conduct:</strong> No fraud, harassment, illegal activities, or false information.</p>
            <p><strong>14. Indemnification:</strong> Users agree to hold Platform harmless from claims arising from their use.</p>
            <p><strong>15. Limitation of Liability:</strong> Platform liability capped at ₹1,000 or fees paid.</p>
            <p><strong>18. Governing Law:</strong> Governed by laws of India.</p>
          </div>
        </section>

        {/* Download Link */}
        <section className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-[#212121]">📄 Complete Terms Document</h3>
          <p className="mb-3 text-sm">
            For the complete, detailed Terms and Conditions document, please refer to our full legal document.
          </p>
          <Link
            href="/TERMS_AND_CONDITIONS.md"
            target="_blank"
            className="inline-block rounded-sm bg-[#2874f0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c5bbf]"
          >
            View Full Terms Document
          </Link>
        </section>

        {/* Contact */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-[#212121]">Contact Us</h2>
          <p>For questions about these Terms, please contact:</p>
          <p className="mt-2">
            <strong>Email:</strong> support@collegerentals.com<br />
            <strong>Phone:</strong> +91 XXXXXXXXXX
          </p>
        </section>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-block rounded-sm border-2 border-gray-300 px-6 py-2 text-sm font-semibold text-[#212121] hover:border-[#2874f0]"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
