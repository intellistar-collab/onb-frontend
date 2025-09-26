import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const navigationLinks = [
    { label: "Home", href: "#" },
    { label: "Mystery Boxes", href: "#" },
    { label: "How To Play", href: "#" },
    { label: "Ranks", href: "#" },
    { label: "Account", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  const legalLinks = [
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "FAQ", href: "#" },
  ];

  const socialLinks = [
    {
      name: "Discord",
      href: "#",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
    },
    {
      name: "X/Twitter",
      href: "#",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
  ];

  const paymentMethods = [
    {
      name: "Visa",
      className: "w-8 h-6 bg-white rounded flex items-center justify-center",
      content: <span className="text-xs font-bold text-blue-600">VISA</span>,
    },
    {
      name: "Mastercard",
      className: "w-8 h-6 bg-white rounded flex items-center justify-center",
      content: <span className="text-xs font-bold text-red-600">MC</span>,
    },
    {
      name: "Apple Pay",
      className: "w-8 h-6 bg-white rounded flex items-center justify-center",
      content: <span className="text-xs font-bold text-black">PAY</span>,
    },
    {
      name: "Google Pay",
      className: "w-8 h-6 bg-white rounded flex items-center justify-center",
      content: <span className="text-xs font-bold text-blue-600">G</span>,
    },
    {
      name: "Stripe",
      className: "w-8 h-6 bg-white rounded flex items-center justify-center",
      content: <span className="text-xs font-bold text-purple-600">S</span>,
    },
  ];

  const cryptoMethods = [
    {
      name: "Bitcoin",
      className:
        "w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center",
      content: <span className="text-xs font-bold text-white">₿</span>,
    },
    {
      name: "Litecoin",
      className:
        "w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center",
      content: <span className="text-xs font-bold text-white">Ł</span>,
    },
    {
      name: "Ethereum",
      className:
        "w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center",
      content: <span className="text-xs font-bold text-white">Ξ</span>,
    },
    {
      name: "Tether",
      className:
        "w-6 h-6 bg-green-500 rounded-full flex items-center justify-center",
      content: <span className="text-xs font-bold text-white">T</span>,
    },
  ];

  return (
    <footer className="py-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Copyright Section */}
          <div className="md:col-span-1">
            <Image src="/logo.svg" alt="logo" width={200} height={200} />
            <p className="text-sm text-gray-400 mb-4">
              © 2025 OneNightBox. All Rights Reserved.
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <span>Designed by </span>
              <div className="flex items-center ml-1">
                <div className="w-4 h-4 bg-pink-500 rounded mr-1"></div>
                <span className="underline">roobinium.io</span>
              </div>
            </div>
          </div>

            <div className="flex gap-4">

          {/* Navigation Links Column 1 */}
          <div className="md:col-span-1">
            <ul className="space-y-3">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links Column 2 */}
          <div className="md:col-span-1">
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            </div>
            </div>

          {/* Contact and Social Section */}
          <div className="md:col-span-1">
            {/* Social Icons */}
            <div className="flex space-x-3 mb-6">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Contact Us:</p>
              <Link
                href="mailto:Support@onenightbox.com"
                className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
              >
                Support@onenightbox.com
              </Link>
            </div>

            {/* Payment Icons */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((payment, index) => (
                  <div
                    key={index}
                    className={payment.className}
                    title={payment.name}
                  >
                    {payment.content}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {cryptoMethods.map((crypto, index) => (
                  <div
                    key={index}
                    className={crypto.className}
                    title={crypto.name}
                  >
                    {crypto.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
