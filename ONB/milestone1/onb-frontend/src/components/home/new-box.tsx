import React from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail, Sparkles } from "lucide-react";

const NewBox = () => {
  return (
    <section className="relative">
      <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Background image */}
        <Image
          src="/box/new-box.webp"
          alt="New Box"
          fill
          className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 p-6 md:p-10">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-200 border border-pink-300/30 mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">NEW BOX LAUNCH</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-pricedown text-white drop-shadow mb-2">NEW BOX LAUNCH!</h1>
            <p className="text-white/85 mb-5">
              Add your email to stay updated with our new box launches! You won't
              want to miss what we have in store for the future drops! Small price
              - Big Experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                <Input 
                  type="email"
                  placeholder="Enter your email address" 
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-pink-300/50" 
                />
              </div>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-extrabold shadow-lg hover:shadow-pink-400/30">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewBox;
