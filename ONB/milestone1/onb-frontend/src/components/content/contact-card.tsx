import React from "react";
import Link from "next/link";
import Card from "../common/card";

const ContactCard = () => {
  return (
    <section>
      <Card className="text-content" heading="OneNightBox.com Contact Us">
        <p className="meta">
          <strong>Effective Date:</strong>{" "}
          <time dateTime="2025-06-01">01st June, 2025</time>
        </p>
        <h1>Contact Us</h1>
        <p>
          Welcome to the OneNightBox.com Contact Us page. We’re here to assist
          with any questions, concerns, or feedback about our retail mystery box
          platform. OneNightBox.com is operated by onenightbox.com, a company
          registered in England and Wales, with our registered office at:
        </p>
        <address>
          Berkeley Square, Mayfair, London, W1J 6BD, United Kingdom
        </address>
        <h2>How to Reach Us</h2>
        <ul>
          <li>
            <strong>Email:</strong>
            <Link href="mailto:support@onenightbox.com">
              support@onenightbox.com
            </Link>
            <br />
            <span className="small">
              For general inquiries, complaints, item-related questions (e.g.,
              products, trips or experiences), or data protection requests
              (e.g., accessing or deleting your data). We aim to respond within
              7 days.
            </span>
          </li>
          <li>
            <strong>Live Chat:</strong>
            <span className="small">
              Available Monday–Friday, 9&nbsp;AM–5&nbsp;PM GMT, via the chat
              icon on the Website.
            </span>
          </li>
          <li>
            <strong>Social Media:</strong>
            <span className="small">
              Available Monday–Friday, 9&nbsp;AM–5&nbsp;PM GMT, via the social
              icons on the Website.
            </span>
          </li>
        </ul>
        <h2>Typical Enquiry Topics</h2>
        <ul>
          <li>
            <strong>General Inquiries:</strong>
            Questions about Mystery Boxes, Referral Program, Loyalty Rewards, or
            Account Management.
          </li>
          <li>
            <strong>Item Support:</strong>
            Assistance with claiming items, including products, trips or
            experiences, or addressing travel restrictions (see our Terms and
            Conditions for details).
          </li>
          <li>
            <strong>Complaints:</strong>
            If you’re unhappy with our service, email
            <Link href="mailto:support@onenightbox.com">
              support@onenightbox.com
            </Link>
            . We aim to resolve complaints fairly within 7 days. If unresolved,
            contact our Alternative Dispute Resolution provider, the Centre for
            Effective Dispute Resolution (CEDR), at
            <Link
              href="https://www.cedr.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              www.cedr.com
            </Link>
            . This does not affect your right to pursue legal action.
          </li>
          <li>
            <strong>Data Protection:</strong>
            For concerns about your personal data (e.g., GDPR rights like access
            or deletion), email
            <Link href="mailto:support@onenightbox.com">
              support@onenightbox.com
            </Link>
            . If unresolved, contact the UK Information Commissioner’s Office at
            <Link
              href="https://www.ico.org.uk"
              rel="noopener noreferrer"
              target="_blank"
            >
              www.ico.org.uk
            </Link>
            (see our Privacy Policy).
          </li>
        </ul>
        <p>
          <strong>We look forward to assisting you!</strong> Email us at
          <Link href="mailto:support@onenightbox.com">
            support@onenightbox.com
          </Link>
          .
        </p>
      </Card>
    </section>
  );
};

export default ContactCard;
