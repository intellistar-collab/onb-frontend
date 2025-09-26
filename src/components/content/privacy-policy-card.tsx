import React from "react";
import Link from "next/link";
import Card from "../common/card";

export default function PrivacyPolicyCard() {
  return (
    <section>
      <Card className="text-content">
        <article>
          <header>
            <h1>Privacy Policy</h1>
            <p>
              <strong>Effective Date:</strong> 01st June, 2025
            </p>
            <p>
              <strong>Operated by:</strong> onenightbox.com, a company
              registered in England and Wales with its registered office at
              Berkeley Square, Mayfair, London, W1J 6BD.
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              <Link href="mailto:support@onenightbox.com">
                support@onenightbox.com
              </Link>
            </p>
          </header>

          <h2 id="intro">Introduction</h2>
          <p>
            This Privacy Policy explains how onenightbox.com (&quot;We,&quot; &quot;Us,&quot;
            &quot;OneNightBox&quot;) collects, uses, shares, and protects your personal
            data when you use OneNightBox.com (&quot;Website&quot;). By using the Website,
            you consent to this policy. If you disagree, do not use the Website.
          </p>
          <p>
            We are a retail mystery box platform, not a gambling service,
            registered in England and Wales, with our registered office at
            Berkeley Square, Mayfair, London, W1J 6BD.
          </p>

          <h2 id="data-we-collect">What Data We Collect</h2>
          <p>We collect:</p>
          <ul>
            <li>
              <strong>Registration Data:</strong> Name, date of birth, address,
              email, phone number, identification documents (e.g., for age
              verification).
            </li>
            <li>
              <strong>Activity Data:</strong> Unboxing transactions, deposits,
              withdrawals, session duration, website interactions, Referral
              Program activity (e.g., referral codes, Referee emails), Loyalty
              Rewards activity (e.g., Points earned/redeemed).
            </li>
            <li>
              <strong>Payment Data:</strong> Credit/debit card details,
              cryptocurrency wallet info, bank account details.
            </li>
            <li>
              <strong>Device Data:</strong> IP address, device type, browser,
              operating system, geolocation (if permitted).
            </li>
            <li>
              <strong>Correspondence:</strong> Emails, live chats, phone calls,
              contact form submissions.
            </li>
            <li>
              <strong>Automatically Collected Data:</strong> Usage data (e.g.,
              pages visited, clicks) via cookies or analytics tools.
            </li>
          </ul>
          <p>
            Data is collected directly from you (e.g., during registration),
            automatically (e.g., via cookies), or from third parties (e.g.,
            payment processors). We do not knowingly collect data from
            individuals under 18.
          </p>

          <h2 id="how-we-use-data">How We Use Your Data</h2>
          <ul>
            <li>Verify your identity and age (ensuring 18+ eligibility).</li>
            <li>
              Process transactions, manage your account, and deliver won items.
            </li>
            <li>
              Administer the Referral Program (e.g., track referrals, award
              Tokens).
            </li>
            <li>
              Administer the Loyalty Rewards program (e.g., track Points,
              process redemptions).
            </li>
            <li>Provide customer support.</li>
            <li>Prevent fraud, money laundering, and irregular activity.</li>
            <li>Improve Website performance and user experience.</li>
            <li>Send marketing communications (with your consent).</li>
            <li>Comply with legal requirements (e.g., tax reporting).</li>
          </ul>

          <h3>Legal Basis</h3>
          <p>We process data based on:</p>
          <ul>
            <li>
              <strong>Consent</strong> (e.g., marketing, certain cookies).
            </li>
            <li>
              <strong>Contract</strong> (e.g., delivering Mystery Box services).
            </li>
            <li>
              <strong>Legal obligation</strong> (e.g., age verification,
              anti-money laundering).
            </li>
            <li>
              <strong>Legitimate interests</strong> (e.g., fraud prevention,
              analytics), where your rights are not overridden.
            </li>
          </ul>

          <h2 id="data-sharing">Data Sharing</h2>
          <p>We share data with:</p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Payment processors, shipping
              companies, IT providers under strict confidentiality agreements.
            </li>
            <li>
              <strong>Regulatory Authorities:</strong> If required by law (e.g.,
              for fraud investigations).
            </li>
            <li>
              <strong>Other Parties:</strong> Only with your explicit consent.
            </li>
          </ul>
          <p>
            We do not sell your data. Data transferred outside the UK/EU (e.g.,
            to international providers) is protected by Standard Contractual
            Clauses or other GDPR-compliant safeguards.
          </p>

          <h2 id="data-retention">Data Retention</h2>
          <ul>
            <li>
              <strong>Account and payment data:</strong> Up to 10 years after
              account closure for tax and regulatory compliance.
            </li>
            <li>
              <strong>Usage and analytics data:</strong> Up to 3 years for
              Website improvements.
            </li>
            <li>
              <strong>Correspondence:</strong> Up to 5 years for support
              records.
            </li>
          </ul>
          <p>Data is securely deleted or anonymised when no longer needed.</p>

          <h2 id="your-rights">Your Rights</h2>
          <p>Under GDPR and UK data protection laws, you can:</p>
          <ul>
            <li>Access your data.</li>
            <li>Correct inaccurate data.</li>
            <li>Request deletion of data (subject to legal obligations).</li>
            <li>Restrict or object to processing (e.g., marketing).</li>
            <li>Request data portability.</li>
            <li>Withdraw consent (e.g., for marketing).</li>
          </ul>
          <p>
            Email{" "}
            <Link href="mailto:support@onenightbox.com">
              support@onenightbox.com
            </Link>{" "}
            to exercise these rights. We&apos;ll respond within 7 days.
          </p>

          <h2 id="cookies">Cookies</h2>
          <p>We use cookies to enhance your experience and analyse usage:</p>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Enable core functions (e.g.,
              account login).
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Track usage (e.g., page
              views).
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Support personalised ads (with
              consent).
            </li>
          </ul>
          <p>
            Manage preferences via your browser or our cookie settings.
            Disabling cookies may limit functionality. See{" "}
            <Link
              href="https://www.aboutcookies.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.aboutcookies.org
            </Link>{" "}
            for details.
          </p>

          <h2 id="security">Security</h2>
          <p>
            We use industry-standard measures (e.g., SSL encryption, access
            controls) on secure servers to protect your data. You must not
            manipulate your IP address to access the Website. No system is 100%
            secure, but we take reasonable steps to safeguard your data.
          </p>

          <h2 id="third-party-links">Third-Party Links</h2>
          <p>
            The Website may link to third-party sites (e.g., payment
            processors). These have their own privacy policies, and we are not
            responsible for their practices.
          </p>

          <h2 id="international-transfers">International Data Transfers</h2>
          <p>Data transferred outside the UK/EU is protected by:</p>
          <ul>
            <li>Adequacy decisions (e.g., for GDPR-equivalent countries).</li>
            <li>Standard Contractual Clauses.</li>
            <li>Other GDPR-compliant safeguards.</li>
          </ul>
          <p>Contact us for details.</p>

          <h2 id="complaints">Complaints</h2>
          <p>
            For data concerns, email{" "}
            <Link href="mailto:support@onenightbox.com">
              support@onenightbox.com
            </Link>
            . We&apos;ll respond within 7 days. If unresolved, contact our
            Alternative Dispute Resolution provider, the Centre for Effective
            Dispute Resolution (CEDR), at{" "}
            <Link
              href="https://www.cedr.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.cedr.com
            </Link>{" "}
            or the UK Information Commissioner&apos;s Office at{" "}
            <Link
              href="https://www.ico.org.uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.ico.org.uk
            </Link>
            .
          </p>

          <h2 id="updates">Updates</h2>
          <p>
            This Privacy Policy may be updated. The latest version is posted on
            the Website with the effective date. Continued use after updates
            constitutes acceptance.
          </p>

          <h2 id="contact">Contact</h2>
          <address>
            For inquiries or to exercise your rights:
            <br />
            Email:{" "}
            <Link href="mailto:support@onenightbox.com">
              support@onenightbox.com
            </Link>
          </address>
        </article>
      </Card>
    </section>
  );
}
