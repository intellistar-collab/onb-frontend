import NewBox from "@/components/home/new-box";
import React from "react";
import { mockBoxCategories } from "@/constant/box-data";
import BoxCard from "@/components/box-page/box-card";
import BoxCategoriesList from "@/components/box-page/box-categories-list";
import BoxHero from "@/components/box-page/hero";

const BoxContentPage = () => {
  return (
    <main>
      <section className="mt-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-pricedown text-pink mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse hover:animate-none transition-all duration-300 hover:scale-105">
              HOT PICKS
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto animate-fade-in-up">
              Handpicked mystery boxes with the best odds and most exclusive rewards
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {mockBoxCategories
              .flatMap((c) => c.boxes)
              .slice(0, 5)
              .map((box) => (
                <BoxCard key={box.id} box={box} />
              ))}
          </div>
        </div>
      </section>
      {/* All boxes grouped by category */}
      <section className="container mx-auto px-4 mt-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-pricedown tracking-wider drop-shadow-xl animate-fade-in-up bg-clip-text text-transparent bg-gradient-to-r from-white via-white/70 to-white animate-gradient-text">
            All Mystery Boxes
          </h2>
          <div className="relative mx-auto mt-3 h-px w-24 overflow-hidden bg-gradient-to-r from-white/15 via-white/10 to-transparent animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div className="absolute inset-0">
              <div className="h-full w-10 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="mt-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-suisse text-white/70 animate-fade-in-up transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/20" style={{ animationDelay: "200ms" }}>
            Browse every box by category
          </p>
        </div>
        <BoxCategoriesList />
      </section>

      <BoxHero />
      <NewBox />
    </main>
  );
};

export default BoxContentPage;
