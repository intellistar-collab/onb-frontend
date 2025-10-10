"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  FaDiscord, 
  FaTwitter, 
  FaInstagram,
  FaCcVisa,
  FaCcMastercard,
  FaCcApplePay,
  FaGooglePay,
  FaCcStripe,
  FaBitcoin,
  FaEthereum,
  FaShieldAlt,
  FaBolt,
  FaGift,
  FaHeart,
  FaEnvelope,
  FaArrowRight
} from "react-icons/fa";
import { 
  SiTether,
  SiRipple,
  SiLitecoin
} from "react-icons/si";

const Footer = () => {
  const pathname = usePathname();
  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Mystery Boxes", href: "/box-content" },
    { label: "How To Play", href: "/how-to-play" },
    { label: "Ranks", href: "/ranks" },
    { label: "Account", href: "/account" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  const legalLinks = [
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookies-policy" },
    { label: "FAQ", href: "/faq" },
  ];

  const socialLinks = [
    {
      name: "Discord",
      href: "#",
      icon: <FaDiscord className="w-5 h-5" />,
      color: "hover:from-indigo-600 hover:to-purple-600",
    },
    {
      name: "X/Twitter", 
      href: "#",
      icon: <FaTwitter className="w-4 h-4" />,
      color: "hover:from-sky-600 hover:to-blue-600",
    },
    {
      name: "Instagram",
      href: "#",
      icon: <FaInstagram className="w-5 h-5" />,
      color: "hover:from-gray-600 hover:to-gray-700",
    },
  ];

  const paymentMethods = [
    {
      name: "Visa",
      icon: <FaCcVisa className="w-8 h-6 text-blue-600" />,
      bgColor: "bg-white",
    },
    {
      name: "Mastercard",
      icon: <FaCcMastercard className="w-8 h-6 text-red-500" />,
      bgColor: "bg-white",
    },
    {
      name: "Apple Pay",
      icon: <FaCcApplePay className="w-8 h-6 text-gray-800" />,
      bgColor: "bg-white",
    },
    {
      name: "Google Pay",
      icon: <FaGooglePay className="w-8 h-6 text-blue-500" />,
      bgColor: "bg-white",
    },
    {
      name: "Stripe",
      icon: <FaCcStripe className="w-8 h-6 text-purple-600" />,
      bgColor: "bg-white",
    },
  ];

  const cryptoMethods = [
    {
      name: "Bitcoin",
      icon: <FaBitcoin className="w-6 h-6 text-orange-500" />,
      bgColor: "bg-orange-100",
    },
    {
      name: "Ethereum",
      icon: <FaEthereum className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      name: "Tether",
      icon: <SiTether className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-100",
    },
    {
      name: "Litecoin",
      icon: <SiLitecoin className="w-5 h-5 text-gray-600" />,
      bgColor: "bg-gray-100",
    },
    {
      name: "XRP",
      icon: <SiRipple className="w-5 h-5 text-blue-800" />,
      bgColor: "bg-blue-100",
    },
  ];

  const hiddenPaths = ["/signup", "/login"];

  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
      <footer className="relative py-6 bg-black/60 backdrop-blur-sm">
      {/* Matching background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-black/60 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-black/60 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 mb-2">
          {/* Logo and Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <Image src="/logo.svg" alt="OneNightBox Logo" width={180} height={60} className="h-auto" />
            </div>
            
            <div className="space-y-2">
              <p className="text-white/90 leading-relaxed text-sm">
                Experience the thrill of mystery boxes with exclusive rewards and surprises.
              </p>
              <p className="text-xs text-gray-400">
                © 2025 OneNightBox. All Rights Reserved.
              </p>
            </div>

            {/* Designer Credit */}
            <div className="flex items-center text-xs text-gray-500 group cursor-pointer">
              <span>Designed by </span>
              <div className="flex items-center ml-1 group-hover:text-gray-400 transition-colors">
                <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full mr-1 group-hover:animate-pulse"></div>
                <span className="underline">roobinium.io</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-6 text-lg relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600"></div>
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-sm flex items-center group"
                  >
                    <FaArrowRight className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 h-3 text-gray-500 mr-0 group-hover:mr-2 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-6 text-lg relative">
              Legal & Support
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-gray-500 to-gray-700"></div>
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-sm flex items-center group"
                  >
                    <FaArrowRight className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 h-3 text-gray-500 mr-0 group-hover:mr-2 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Section */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg relative">
                Connect With Us
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600"></div>
              </h3>
              
              {/* Social Icons */}
              <div className="flex space-x-3 mb-6">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className={`w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center ${social.color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500/25 group`}
                    aria-label={social.name}
                  >
                    <div className="text-gray-300 group-hover:text-white transition-colors">
                      {social.icon}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-white">Get Support:</p>
              <Link
                href="mailto:Support@onenightbox.com"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors flex items-center group"
              >
                <FaEnvelope className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Support@onenightbox.com
              </Link>
            </div>
          </div>

          {/* Payment Methods Section - Integrated */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-white font-semibold mb-4 text-lg relative">
              Secure Payment Methods
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-gray-500 to-gray-700"></div>
            </h3>
            
            <div className="space-y-3">
              {/* Traditional Payment Methods */}
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((payment, index) => (
                  <div
                    key={index}
                    className={`w-12 h-8 ${payment.bgColor} rounded flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group border border-gray-200`}
                    title={payment.name}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {payment.icon}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cryptocurrency Methods */}
              <div className="flex flex-wrap gap-2">
                {cryptoMethods.map((crypto, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 ${crypto.bgColor} rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group border border-gray-300`}
                    title={crypto.name}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {crypto.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Breaking News Ticker */}
        <div className="border-t border-gray-800 mt-4 pt-4">
          <div className="relative overflow-hidden bg-black/80 rounded-lg py-2">
            <div className="flex items-center">
              {/* Breaking News Label */}
              {/* <div className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider flex-shrink-0 mr-4">
                🔴 BREAKING NEWS
              </div> */}
              
              {/* Scrolling Ticker */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center space-x-8 text-sm text-white animate-scroll">
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <FaShieldAlt className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">•</span>
                    <span className="font-semibold">SSL Secured</span>
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <FaBolt className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-400">•</span>
                    <span className="font-semibold">24/7 Support Available</span>
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <FaGift className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400">•</span>
                    <span className="font-semibold">Daily Rewards Active</span>
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <FaHeart className="w-4 h-4 text-red-400" />
                    <span className="text-gray-400">•</span>
                    <span className="font-semibold">Made with ❤️ for mystery box enthusiasts</span>
                  </span>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
