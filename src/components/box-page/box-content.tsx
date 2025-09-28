import React from "react"
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react"

import { mockBoxCategories } from "@/constant/box-data"
import BoxCard from "./box-card"

const flattenBoxes = () =>
  mockBoxCategories
    .flatMap((category) => category.boxes)
    .sort((a, b) => a.title.localeCompare(b.title))

const BoxContent = () => {
  const boxes = flattenBoxes()

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-suisse uppercase tracking-[0.3em] text-white/40">
            Mystery box rewards
          </p>
          <h2 className="text-3xl font-pricedown uppercase text-white">
            Complete Box Lineup
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-suisse text-white/60">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-4 py-2">
            <ArrowUpToLine className="h-3.5 w-3.5" />
            Highest odds first
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-4 py-2">
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Filter by tier
          </span>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boxes.map((box) => (
          <BoxCard key={box.id} box={box} />
        ))}
      </div>
    </section>
  )
}

export default BoxContent
 