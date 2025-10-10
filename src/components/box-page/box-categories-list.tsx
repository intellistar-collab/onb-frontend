"use client"

import React from "react"

import { mockBoxCategories } from "@/constant/box-data"
import BoxCard from "./box-card"

const BoxCategoriesList = () => {
  return (
    <section className="space-y-12">
      {mockBoxCategories
        .sort((a, b) => a.order - b.order)
        .map((category) => (
          <div key={category.id} className="space-y-6">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs font-suisse uppercase tracking-[0.3em] text-white/40">Category</p>
                <h3 className="text-2xl md:text-3xl font-pricedown text-white">
                  {category.name}
                </h3>
              </div>
              <div
                className="h-2 w-24 rounded-full"
                style={{ backgroundColor: `${category.color}33` }}
                aria-hidden
              />
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {category.boxes.map((box) => (
                <BoxCard key={box.id} box={box} />
              ))}
            </div>
          </div>
        ))}
    </section>
  )
}

export default BoxCategoriesList


