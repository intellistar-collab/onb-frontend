"use client";

import React from "react";
import { m } from "motion/react";

interface HowToPlay {
  title: string;
  subtitle: string;
  instructions: Instruction[];
  stepNumber?: number;
}

interface Instruction {
  text: string;
  image?: string;
}

const HowToPlayCard = ({ title, subtitle, instructions, stepNumber }: HowToPlay) => {
  return (
    <m.div
      className="group relative h-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <m.div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/50 via-zinc-800/30 to-black/50 backdrop-blur-sm p-6 h-full"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        {/* Step Number Badge */}
        {stepNumber && (
          <m.div className="absolute -top-3 -right-3 z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary border-2 border-white/20 shadow-lg">
              <span className="text-lg font-oswald text-white font-bold">{stepNumber}</span>
            </div>
          </m.div>
        )}
        
        {/* Header */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-suisse uppercase tracking-[0.4em] text-primary">
              {subtitle}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-pricedown text-white leading-tight">
              {title}
            </h1>
            <div className="mt-1 h-px w-16 bg-gradient-to-r from-primary to-primary/0" />
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          {instructions.map((instruction, index) => (
            <div key={index} className="space-y-3">
              {/* Instruction Text */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                    <span className="text-xs font-oswald text-primary font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-suisse text-white/80 leading-relaxed">
                  {instruction.text}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="pointer-events-none absolute top-4 left-4 h-8 w-8 rounded-full bg-primary/10 blur-sm" />
        <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 rounded-full bg-primary/5 blur-sm" />
      </m.div>
    </m.div>
  );
};

export default HowToPlayCard;
