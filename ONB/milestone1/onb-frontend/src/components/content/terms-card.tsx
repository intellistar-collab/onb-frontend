import React from "react";
import Link from "next/link";
import Card from "../common/card";

export default function TermsCard() {
  return (
    <section>
      <Card className="text-content">
        <article>
          <header>
            <h1>Terms of Service</h1>
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

          <h2 id="introduction">Introduction</h2>
          <p>
            Welcome to OneNightBox.com. These Terms of Service ("Terms") govern your use of our website, services, and mystery box platform. By accessing or using OneNightBox.com, you agree to comply with and be bound by these Terms.
          </p>
          <p>
            OneNightBox.com is a retail mystery box platform, not a gambling service. We offer customers the opportunity to purchase mystery boxes containing physical items, digital items, or experiences, with clearly displayed chances of receiving each item.
          </p>
          <p>
            If you do not agree to these Terms, please do not use our website or services. We reserve the right to modify these Terms at any time, and the updated version will be posted on our website with the effective date.
          </p>

          <h2 id="eligibility">1. Eligibility</h2>
          <h3>Age Requirements</h3>
          <p>
            You must be 18 years of age or older to use OneNightBox.com. By using our services, you confirm that you meet this age requirement. We reserve the right to verify your age and identity at any time.
          </p>
          <h3>Geographic Restrictions</h3>
          <p>
            OneNightBox.com is available to residents of the United States, Canada, and all European countries. We may restrict access from certain jurisdictions due to legal or regulatory requirements.
          </p>
          <h3>Account Requirements</h3>
          <p>
            You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <h3>Prohibited Users</h3>
          <p>
            The following individuals are prohibited from using our services:
          </p>
          <ul>
            <li>Individuals under the age of 18</li>
            <li>Residents of prohibited jurisdictions</li>
            <li>Individuals who have been previously banned from our platform</li>
            <li>Individuals using automated systems or bots to access our services</li>
          </ul>

          <h2 id="services">2. Services</h2>
          <h3>Mystery Box Products</h3>
          <p>
            OneNightBox.com offers digital mystery boxes containing various items and experiences. Each box clearly displays the potential contents and the probability of receiving each item. Our mystery boxes may contain:
          </p>
          <ul>
            <li>Physical items (electronics, clothing, accessories, etc.)</li>
            <li>Digital items (gift cards, vouchers, digital content)</li>
            <li>Experiences (event tickets, travel vouchers, activity bookings)</li>
            <li>Tokens for use on our platform</li>
          </ul>
          <h3>Purchase Process</h3>
          <p>
            To purchase a mystery box, you must:
          </p>
          <ol>
            <li>Create an account and verify your identity</li>
            <li>Deposit funds into your wallet using accepted payment methods</li>
            <li>Select a mystery box from our catalog</li>
            <li>Complete the purchase using available tokens</li>
            <li>Reveal your item/experience immediately after purchase</li>
          </ol>
          <h3>Item Delivery</h3>
          <p>
            Physical items are shipped to your registered address within 7-14 business days. Digital items and experiences are delivered via email or credited to your account instantly. Experiences are arranged within 7 business days and scheduled based on availability.
          </p>
          <h3>Exchange and Returns</h3>
          <p>
            Items and experiences can be exchanged for tokens within 14 days of receipt. Physical defective items can be returned for replacement within 14 days. All exchanges and returns are subject to our Return Policy.
          </p>

          <h2 id="payments">3. Payments</h2>
          <h3>Accepted Payment Methods</h3>
          <p>
            We accept the following payment methods:
          </p>
          <ul>
            <li>Credit and debit cards (Visa, Mastercard, American Express)</li>
            <li>Digital wallets (Apple Pay, Google Pay)</li>
            <li>Bank transfers</li>
            <li>Cryptocurrencies (Bitcoin, Ethereum, etc.)</li>
            <li>Other region-specific payment methods</li>
          </ul>
          <h3>Deposit and Withdrawal Limits</h3>
          <p>
            Minimum deposit: £10 (or equivalent in your currency)
          </p>
          <p>
            Maximum deposit: £1,000 per transaction (or equivalent)
          </p>
          <p>
            Withdrawal limits may vary based on your account level and verification status. Contact support for information about increasing your limits.
          </p>
          <h3>Processing Fees</h3>
          <p>
            Most deposits are processed without fees. However, some payment methods may incur small processing fees, which will be clearly displayed before you confirm your transaction.
          </p>
          <h3>Refund Policy</h3>
          <p>
            Refunds are available under the following circumstances:
          </p>
          <ul>
            <li>Technical errors preventing you from accessing purchased items</li>
            <li>Unauthorized transactions</li>
            <li>Defective physical items (as per our Return Policy)</li>
            <li>Service downtime exceeding 24 hours</li>
          </ul>
          <p>
            Refund requests must be submitted within 14 days of the original transaction and will be processed within 5-7 business days.
          </p>

          <h2 id="user-conduct">4. User Conduct</h2>
          <h3>Prohibited Activities</h3>
          <p>
            Users are strictly prohibited from engaging in the following activities:
          </p>
          <ul>
            <li>Creating multiple accounts to circumvent restrictions</li>
            <li>Using automated systems, bots, or scripts to access our services</li>
            <li>Attempting to manipulate or exploit our mystery box system</li>
            <li>Sharing or selling account credentials</li>
            <li>Engaging in fraudulent transactions or chargeback abuse</li>
            <li>Harassing other users or support staff</li>
            <li>Posting false or misleading reviews</li>
            <li>Violating any applicable laws or regulations</li>
          </ul>
          <h3>Account Security</h3>
          <p>
            You are responsible for maintaining the security of your account, including:
          </p>
          <ul>
            <li>Using a strong, unique password</li>
            <li>Enabling two-factor authentication when available</li>
            <li>Keeping your contact information up to date</li>
            <li>Reporting suspicious activity immediately</li>
            <li>Not sharing your account with others</li>
          </ul>
          <h3>Communication Guidelines</h3>
          <p>
            When communicating with our support team or other users, you must:
          </p>
          <ul>
            <li>Be respectful and professional</li>
            <li>Provide accurate information</li>
            <li>Follow our communication protocols</li>
            <li>Avoid spam or unsolicited messages</li>
            <li>Not share personal or sensitive information</li>
          </ul>

          <h2 id="intellectual-property">5. Intellectual Property</h2>
          <h3>Our Intellectual Property</h3>
          <p>
            All content, features, and functionality on OneNightBox.com are owned by or licensed to onenightbox.com and are protected by copyright, trademark, and other intellectual property laws. This includes:
          </p>
          <ul>
            <li>Website design and layout</li>
            <li>Text, graphics, logos, and images</li>
            <li>Software and technology</li>
            <li>Business methods and processes</li>
            <li>Trade secrets and confidential information</li>
          </ul>
          <h3>Trademarks</h3>
          <p>
            OneNightBox, the OneNightBox logo, and other trademarks displayed on our website are registered trademarks of onenightbox.com. You may not use these trademarks without our prior written permission.
          </p>
          <h3>User-Generated Content</h3>
          <p>
            By submitting content to our website (such as reviews, comments, or feedback), you grant us a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, modify, and distribute such content.
          </p>
          <h3>Third-Party Intellectual Property</h3>
          <p>
            Our website may contain content owned by third parties. We make no claims to such content and use it under appropriate licenses or permissions. Any third-party trademarks mentioned belong to their respective owners.
          </p>
          <h3>Copyright Infringement</h3>
          <p>
            If you believe that content on our website infringes your copyright, please contact us at{" "}
            <Link href="mailto:support@onenightbox.com">support@onenightbox.com</Link> with:
          </p>
          <ul>
            <li>A description of the copyrighted work</li>
            <li>The URL where the infringing content is located</li>
            <li>Your contact information</li>
            <li>A statement that you have a good faith belief the use is not authorized</li>
            <li>A statement that the information is accurate, under penalty of perjury</li>
            <li>Your electronic signature</li>
          </ul>

          <h2 id="limitations-disclaimers">6. Limitations and Disclaimers</h2>
          <h3>Service Availability</h3>
          <p>
            We strive to provide uninterrupted service, but we do not guarantee that our website will be available at all times. We may suspend, modify, or discontinue services for maintenance, upgrades, or other reasons without prior notice.
          </p>
          <h3>No Warranties</h3>
          <p>
            Our services are provided "as is" and "as available" without any warranties, express or implied. We disclaim all warranties, including:
          </p>
          <ul>
            <li>Merchantability and fitness for a particular purpose</li>
            <li>Accuracy, completeness, or reliability of content</li>
            <li>Uninterrupted or error-free operation</li>
            <li>Security of your data or transactions</li>
            <li>Compatibility with your devices or software</li>
          </ul>
          <h3>Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, OneNightBox.com shall not be liable for:
          </p>
          <ul>
            <li>Any indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Personal injury or property damage</li>
            <li>Unauthorized access to your account</li>
            <li>System failures or technical issues</li>
          </ul>
          <p>
            Our total liability for any claim related to our services shall not exceed the amount you paid for the mystery box that gave rise to the claim.
          </p>
          <h3>Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless OneNightBox.com, its officers, directors, employees, and agents from any claims, damages, or expenses arising from:
          </p>
          <ul>
            <li>Your use of our services</li>
            <li>Violation of these Terms</li>
            <li>Infringement of third-party rights</li>
            <li>Any illegal or fraudulent activities</li>
          </ul>

          <h2 id="privacy-data">7. Privacy and Data Protection</h2>
          <h3>Data Collection</h3>
          <p>
            We collect various types of information to provide and improve our services:
          </p>
          <ul>
            <li>
              <strong>Personal Information:</strong> Name, email, address, phone number, date of birth
            </li>
            <li>
              <strong>Account Information:</strong> Username, password, transaction history, preferences
            </li>
            <li>
              <strong>Payment Information:</strong> Payment method details, transaction records
            </li>
            <li>
              <strong>Technical Information:</strong> IP address, browser information, device data
            </li>
            <li>
              <strong>Usage Data:</strong> Pages visited, time spent, features used
            </li>
          </ul>
          <h3>Data Usage</h3>
          <p>
            We use your data for the following purposes:
          </p>
          <ul>
            <li>Account creation and management</li>
            <li>Processing transactions and payments</li>
            <li>Verifying identity and age</li>
            <li>Providing customer support</li>
            <li>Improving our services and user experience</li>
            <li>Preventing fraud and ensuring security</li>
            <li>Complying with legal requirements</li>
          </ul>
          <h3>Data Sharing</h3>
          <p>
            We may share your information with:
          </p>
          <ul>
            <li>Payment processors and financial institutions</li>
            <li>Shipping and delivery services</li>
            <li>Regulatory authorities when required by law</li>
            <li>Third-party service providers under strict confidentiality agreements</li>
          </ul>
          <p>
            We do not sell your personal information to third parties for marketing purposes.
          </p>
          <h3>Data Security</h3>
          <p>
            We implement industry-standard security measures to protect your data, including:
          </p>
          <ul>
            <li>SSL encryption for all data transmissions</li>
            <li>Secure storage of payment information</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication systems</li>
          </ul>
          <h3>Your Rights</h3>
          <p>
            Under applicable data protection laws, you have the right to:
          </p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Object to certain processing activities</li>
            <li>Request data portability</li>
            <li>Withdraw consent where applicable</li>
          </ul>
          <p>
            To exercise these rights, please contact us at{" "}
            <Link href="mailto:support@onenightbox.com">support@onenightbox.com</Link>.
          </p>

          <h2 id="termination">8. Termination</h2>
          <h3>Termination by You</h3>
          <p>
            You may terminate your account at any time by contacting our support team at{" "}
            <Link href="mailto:support@onenightbox.com">support@onenightbox.com</Link>. Upon termination:
          </p>
          <ul>
            <li>Your account will be deactivated immediately</li>
            <li>Any remaining tokens in your wallet will be forfeited</li>
            <li>Pending orders will be processed normally</li>
            <li>Your personal data will be retained as required by law</li>
          </ul>
          <h3>Termination by Us</h3>
          <p>
            We reserve the right to terminate or suspend your account immediately if:
          </p>
          <ul>
            <li>You violate these Terms of Service</li>
            <li>You engage in fraudulent or illegal activities</li>
            <li>You provide false information during registration</li>
            <li>You attempt to manipulate our systems</li>
            <li>Your account poses a security risk</li>
            <li>You are located in a prohibited jurisdiction</li>
            <li>You have multiple accounts</li>
          </ul>
          <h3>Effects of Termination</h3>
          <p>
            Upon termination, the following provisions apply:
          </p>
          <ul>
            <li>All rights granted to you under these Terms will cease</li>
            <li>You will no longer have access to our services</li>
            <li>Any outstanding obligations will survive termination</li>
            <li>Sections regarding limitations of liability and indemnification will remain in effect</li>
          </ul>
          <h3>Account Reactivation</h3>
          <p>
            In some cases, terminated accounts may be eligible for reactivation. Contact our support team to discuss your specific situation. Reactivation is subject to our discretion and may require additional verification.
          </p>

          <h2 id="general-provisions">9. General Provisions</h2>
          <h3>Governing Law</h3>
          <p>
            These Terms of Service and your use of OneNightBox.com are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
          <h3>Dispute Resolution</h3>
          <p>
            We encourage users to contact our support team first to resolve any issues informally. If a dispute cannot be resolved through our support channels, you may seek resolution through:
          </p>
          <ul>
            <li>Mediation services</li>
            <li>Alternative Dispute Resolution (ADR) providers</li>
            <li>The Centre for Effective Dispute Resolution (CEDR)</li>
          </ul>
          <h3>Assignment</h3>
          <p>
            You may not assign or transfer your rights or obligations under these Terms without our prior written consent. We may assign these Terms to a successor organization in the event of a merger, acquisition, or sale of our assets.
          </p>
          <h3>Severability</h3>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be replaced by a valid provision that most closely reflects the original intent.
          </p>
          <h3>Waiver</h3>
          <p>
            Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. A waiver of any term shall only be effective if made in writing and signed by an authorized representative of OneNightBox.com.
          </p>
          <h3>Notices</h3>
          <p>
            All notices and communications regarding these Terms shall be in writing and sent to:
          </p>
          <address>
            OneNightBox.com<br />
            Berkeley Square, Mayfair<br />
            London, W1J 6BD<br />
            United Kingdom<br />
            Email:{" "}
            <Link href="mailto:support@onenightbox.com">support@onenightbox.com</Link>
          </address>
          <h3>Entire Agreement</h3>
          <p>
            These Terms of Service, together with our{" "}
            <Link href="/privacy-policy">Privacy Policy</Link> and any other policies referenced herein, constitute the entire agreement between you and OneNightBox.com regarding your use of our services. These Terms supersede all prior agreements, communications, and understandings.
          </p>

          <h2 id="contact">Contact Information</h2>
          <address>
            If you have any questions about these Terms of Service, please contact us at:
            <br />
            Email:{" "}
            <Link href="mailto:support@onenightbox.com">support@onenightbox.com</Link>
            <br />
            Phone: +44 20 1234 5678
            <br />
            Address: Berkeley Square, Mayfair, London, W1J 6BD, United Kingdom
          </address>
        </article>
      </Card>
    </section>
  );
}
