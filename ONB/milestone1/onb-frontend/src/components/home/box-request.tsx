import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
 

const BoxRequest = () => {
  return (
    <section>
      <div className="relative rounded-2xl overflow-hidden h-[22rem] md:h-[26rem] group">
        {/* Background image with zoom effect */}
        <Image
          src="/box/box-request.webp"
          alt="Box Request background"
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        
        {/* Content card with glass effect */}
        <div className="absolute left-6 right-6 md:left-12 top-1/2 -translate-y-1/2">
          <div className="max-w-xl backdrop-blur-md bg-white/5 rounded-2xl p-6 md:p-8 border border-white/15 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-200 border border-yellow-300/30 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide">REQUEST A BOX</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-oswald mb-3 bg-gradient-to-r from-yellow-300 via-white to-amber-300 bg-clip-text text-transparent drop-shadow-lg">
              Have a Box Idea?
            </h1>

            {/* Description */}
            <p className="text-base leading-relaxed text-white/90 mb-6">
              Tell us what you want to see next. We love featuring the best community ideas.
            </p>

            {/* Input form */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Your email address"
                className="text-base flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-yellow-300/50 transition-all"
              />
              <Button className="text-base whitespace-nowrap bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-extrabold shadow-lg hover:shadow-yellow-400/30 border-2 border-yellow-300/40">
                Email Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoxRequest;
