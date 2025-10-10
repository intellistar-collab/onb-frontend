import React from "react";
import Link from "next/link";
import Card from "../common/card";

export default function CookiesCard() {
  return (
    <section>
      <Card className="text-content">
        <article>
          <header>
            <h1>Cookies Policy</h1>
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
            {`This Cookies Policy explains how OneNightBox.com ("We," "Us,"
            "OneNightBox"), registered in England and Wales at Berkeley
            Square, Mayfair, London, W1J 6BD, uses cookies and similar
            technologies on our website, OneNightBox.com ("Website"). By using
            the Website, you agree to our use of cookies as described below.
            If you do not agree, you can manage or disable cookies through our
            cookie preferences tool or your browser settings.`}
          </p>

          <div aria-labelledby="what-are-cookies">
            <h2 id="what-are-cookies">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device (e.g.,
              computer, smartphone) when you visit the Website. They help us
              provide core functions, analyse usage, and deliver personalised
              content. We also use similar technologies, such as pixels, web
              beacons, and local storage, for comparable purposes.
            </p>
          </div>

          <div aria-labelledby="types-of-cookies">
            <h2 id="types-of-cookies">2. Types of Cookies We Use</h2>
            <p>We use the following cookies, categorised by purpose:</p>

            <h3>Essential Cookies</h3>
            <ul>
              <li>
                <strong>Purpose:</strong> Enable core Website functions, such as
                account login, Mystery Box purchases, Referral Program tracking,
                and Loyalty Rewards redemption.
              </li>
              <li>
                <strong>Examples:</strong> Session cookies for user
                authentication, CSRF tokens for security.
              </li>
              <li>
                <strong>Duration:</strong> Typically session-based (expire when
                you close your browser).
              </li>
              <li>
                <strong>Consent:</strong> Not required, as they are necessary
                for Website operation.
              </li>
            </ul>

            <h3>Analytics Cookies</h3>
            <ul>
              <li>
                <strong>Purpose:</strong> Track how users interact with the
                Website (e.g., pages visited, clicks, session duration) to
                improve performance and user experience.
              </li>
              <li>
                <strong>Examples:</strong> Google Analytics cookies (_ga, _gid)
                for usage statistics.
              </li>
              <li>
                <strong>Duration:</strong> Up to 2 years.
              </li>
              <li>
                <strong>Consent:</strong> Requires your explicit consent,
                obtained via our cookie banner.
              </li>
            </ul>

            <h3>Marketing Cookies</h3>
            <ul>
              <li>
                <strong>Purpose:</strong> Deliver personalised ads (e.g., for
                Mystery Box promotions, Referral Program rewards) on the Website
                or third-party platforms.
              </li>
              <li>
                <strong>Examples:</strong> Cookies from advertising networks
                (e.g., DoubleClick, Facebook Pixel).
              </li>
              <li>
                <strong>Duration:</strong> Up to 1 year.
              </li>
              <li>
                <strong>Consent:</strong> Requires your explicit consent,
                obtained via our cookie banner.
              </li>
            </ul>
          </div>

          <div aria-labelledby="third-party-cookies">
            <h2 id="third-party-cookies">3. Third-Party Cookies</h2>
            <p>Some cookies are set by third-party services, including:</p>
            <ul>
              <li>
                <strong>Google Analytics:</strong> To analyse Website usage (see{" "}
                <Link
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`Google's Privacy Policy`}
                </Link>
                ).
              </li>
              <li>
                <strong>Advertising Partners:</strong> To deliver targeted ads
                (e.g., for Loyalty Rewards promotions), subject to their privacy
                policies.
              </li>
              <li>
                <strong>Payment Processors:</strong> To facilitate secure
                transactions, which may use cookies for fraud prevention.
              </li>
            </ul>
            <p>
              These third parties process data under their own privacy policies,
              but we ensure compliance with UK GDPR through contractual
              safeguards (e.g., Standard Contractual Clauses for international
              transfers).
            </p>
          </div>

          <div aria-labelledby="how-we-use-cookies">
            <h2 id="how-we-use-cookies">4. How We Use Cookies</h2>
            <ul>
              <li>
                Enable essential functions (e.g., account access, Mystery Box
                unboxing, secure payments).
              </li>
              <li>
                Analyse usage to optimise features (e.g., Referral Program
                performance, Website navigation).
              </li>
              <li>
                Personalise marketing (e.g., tailored offers for Loyalty
                Rewards), with your consent.
              </li>
              <li>
                Enhance security (e.g., detecting irregular activity, preventing
                fraud).
              </li>
              <li>
                Comply with legal obligations (e.g., age verification, tax
                reporting).
              </li>
            </ul>
          </div>

          <div aria-labelledby="managing-cookies">
            <h2 id="managing-cookies">5. Managing Cookies</h2>
            <p>You can control cookies through:</p>
            <ul>
              <li>
                <strong>Our Cookie Preferences Tool:</strong> Available via the
                cookie banner when you first visit the Website or through the
                footer link (&quot;Cookie Settings&quot;). Adjust settings for analytics
                and marketing cookies.
              </li>
              <li>
                <strong>Browser Settings:</strong> Block, delete, or restrict
                cookies. Visit{" "}
                <Link
                  href="https://www.aboutcookies.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.aboutcookies.org
                </Link>{" "}
                for instructions. <em>Note:</em> Disabling essential cookies may
                prevent access to Website features (e.g., account login, Mystery
                Box purchases).
              </li>
              <li>
                <strong>Do Not Track:</strong> We honour &quot;Do Not Track&quot; browser
                signals where technically feasible, limiting non-essential
                cookie use.
              </li>
            </ul>
          </div>

          <div aria-labelledby="consent">
            <h2 id="consent">6. Consent for Cookies</h2>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> Do not require consent, as
                they are necessary for Website functionality.
              </li>
              <li>
                <strong>Non-Essential Cookies (analytics, marketing):</strong>{" "}
                We request your consent via the cookie banner before setting
                these cookies. You can accept, reject, or customise preferences.
              </li>
              <li>
                <strong>Withdrawing Consent:</strong> Update your preferences at
                any time via the Cookie Preferences Tool or clear cookies in
                your browser. This will not affect essential cookies.
              </li>
            </ul>
          </div>

          <div aria-labelledby="cookie-list">
            <h2 id="cookie-list">7. Cookie List</h2>
            <p>Below is a sample of cookies we may use (subject to change):</p>
            <ul>
              <li>
                _ga (Google Analytics) – used to distinguish users – expires
                after 2 years.
              </li>
              <li>
                _gid (Google Analytics) – used to distinguish users – expires
                after 24 hours.
              </li>
              <li>
                doubleclick.net (Marketing) – used for ad targeting – expires
                after up to 1 year.
              </li>
              <li>
                session_id (Essential) – used for authentication – expires when
                the browser closes.
              </li>
            </ul>
          </div>

          <div aria-labelledby="contact">
            <h2 id="contact">Contact</h2>
            <address>
              For inquiries about this Cookies Policy:
              <br />
              Email:{" "}
              <Link href="mailto:support@onenightbox.com">
                support@onenightbox.com
              </Link>
            </address>
          </div>

          <h2 id="cookie-details">Detailed Cookie Information</h2>
          <p>Below is a sample of cookies we may use (subject to change):</p>
          <ul>
            <li>
              <strong>gtestCookie (Essential):</strong> Maintains user session on login - OneNightBox - Session
            </li>
            <li>
              <strong>_ga (Analytics):</strong> Unique identifier - Google Analytics - 2 years
            </li>
            <li>
              <strong>_gid (Analytics):</strong> Unique identifier - Google Analytics - 1 day
            </li>
            <li>
              <strong>_gat (Analytics):</strong> Distinctive identifier - Google Analytics - 10 minutes
            </li>
            <li>
              <strong>_hjid (Essential):</strong> Prevents cross-site request forgery - OneNightBox - Session
            </li>
          </ul>

          <h2 id="updates">Updates</h2>
          <p>
            We may update this Cookies Policy to reflect changes to our
            practices, technologies, or legal requirements. The latest version
            will be posted on the Website with the effective date.
          </p>
          <p>
            Continued use of the website after any changes constitutes your
            acceptance of the new Cookies Policy.
          </p>
        </article>
      </Card>
    </section>
  );
}
