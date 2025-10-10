"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Instagram, Twitter, MessageCircle, Sparkles, Heart } from "lucide-react";

const EngagementSection = () => {
  return (
    <section className="relative">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Request Box with diagonal mask */}
        <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Background image */}
          <Image
            src="/box/box-request.webp"
            alt="request-box-bg"
            fill
            className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
          />
          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/40 to-transparent" />
          {/* Diagonal mask on the right edge */}
          <div className="absolute right-0 top-0 h-full w-24 bg-black/0" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 20% 100%)" }} />
          {/* Content */}
          <div className="relative z-10 p-6 md:p-10">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-200 border border-yellow-300/30 mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wide">REQUEST A BOX</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-pricedown text-white drop-shadow mb-2">Have a Box Idea?</h3>
              <p className="text-white/85 mb-5">Tell us what you want to see next. We love featuring the best community ideas.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                  <Input placeholder="Your email" className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-yellow-300/50" />
                </div>
                <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-extrabold shadow-lg hover:shadow-yellow-400/30">Send Idea</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Follow Community with diagonal mask */}
        <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Background image */}
          <Image
            src="/social/social-2.png"
            alt="follow-community-bg"
            fill
            className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
          />
          {/* Color overlay */}
          <div className="absolute inset-0 bg-gradient-to-tl from-pink-700/60 via-purple-700/30 to-transparent mix-blend-multiply" />
          {/* Diagonal mask on the left edge */}
          <div className="absolute left-0 top-0 h-full w-24 bg-black/0" style={{ clipPath: "polygon(0 0, 80% 0, 100% 100%, 0 100%)" }} />
          {/* Content */}
          <div className="relative z-10 p-6 md:p-10">
            <div className="max-w-lg ml-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-200 border border-pink-300/30 mb-4">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wide">JOIN OUR COMMUNITY</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-pricedown text-white drop-shadow mb-2">Follow ONB</h3>
              <p className="text-white/90 mb-5">Get updates on new boxes, rewards and exclusive drops.</p>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/onenightboxcom" className="flex-1 p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all text-center">
                  <Instagram className="w-5 h-5 text-white mx-auto" />
                </a>
                <a href="https://x.com/Onenightbox_com" className="flex-1 p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all text-center">
                  <Twitter className="w-5 h-5 text-white mx-auto" />
                </a>
                <a href="https://discord.gg/fDZ4vsJVUd" className="flex-1 p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all text-center">
                  <MessageCircle className="w-5 h-5 text-white mx-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementSection;


