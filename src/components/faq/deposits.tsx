import React from "react";

const Deposits = () => {
  return (
    <article>
      <h2>Deposits</h2>
      <p>
        This section explains how customers can fund their accounts, including payment methods and security.
      </p>
      <h3>What payment methods do you accept?</h3>
      <p>
        We accept major credit/debit cards, Apple Pay, Google Pay, Stripe & Cryptocurrencies. Available options depend on your region.
      </p>
      <h3>How do I deposit funds?</h3>
      <p>
        {`Log in, go to "Wallet," select "Deposit," choose your payment method, and follow the prompts. Funds are typically available instantly.`}
      </p>
      <h3>Are there deposit fees?</h3>
      <p>
        Most deposits are fee-free, but some payment methods may incur small processing fees. These are shown before you confirm your deposit.
      </p>
      <h3>What is the minimum/maximum deposit?</h3>
      <p>
        The minimum deposit is £10, and the maximum is £1,000 per transaction (or equivalent, depending on your region). Contact support at support@onenightbox.com to request higher limits.
      </p>
      <h3>Is it safe to deposit money?</h3>
      <p>
        Yes, we use secure SSL encryption and trusted payment processors to protect your transactions. Your financial details are never stored on our servers.
      </p>
    </article>
  );
};

export default Deposits;