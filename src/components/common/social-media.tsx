import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, MessageCircle } from "lucide-react";
import RoundedShape from "./rounded-shape";

const gap = "30px";

const socialMedia = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/onenightboxcom",
  },

  {
    name: "X (Twitter)",
    href: "https://x.com/Onenightbox_com",
  },
  {
    name: "Discord",
    href: "https://discord.gg/fDZ4vsJVUd",
  },
];

const SocialMedia = () => {
  return (
    <section>
      <div className="grid grid-cols-3 gap-4 min-h-80">
        <RoundedShape
          className="relative overflow-hidden rounded-md"
          clipPath={`polygon(0% 0%, 100% 0%, calc(100% - ${gap}) 100%, 0% 100%)`}
        >
          <Image
            src="/social/social-1.png"
            alt="social-media"
            fill
            className="object-cover object-center -z-10 opacity-90"
          />
        </RoundedShape>

        <div className="flex flex-col items-center justify-center space-y-6 p-8">
          <div className="flex w-full max-w-sm space-x-2">
            <Input placeholder="Email" className="flex-1" />
            <Button>Subscribe</Button>
          </div>

          <h2 className="text-xl font-semibold">Our Social Media</h2>

          <div className="flex space-x-4">
            {socialMedia.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                {item.name === "Instagram" && <Instagram className="w-5 h-5" />}
                {item.name === "X (Twitter)" && <Twitter className="w-5 h-5" />}
                {item.name === "Discord" && (
                  <MessageCircle className="w-5 h-5" />
                )}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <RoundedShape
          className="relative overflow-hidden rounded-md"
          clipPath={`polygon(${gap} 0%, 100% 0%, 100% 100%, 0% 100%)`}
        >
          <Image
            src="/social/social-2.png"
            alt="social-media"
            fill
            className="object-cover object-center -z-10 opacity-90"
          />
        </RoundedShape>
      </div>
    </section>
  );
};

export default SocialMedia;
