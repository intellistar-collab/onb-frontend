"use client"

import React from "react"
import { Box } from "@/lib/api/boxes"
import { BoxCategory } from "@/lib/api/box-categories"
import { groupBoxesByCategory } from "@/lib/box-data-transformer"
import BoxCard from "./box-card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface BoxCategoriesListProps {
  boxes: Box[];
  categories: BoxCategory[];
}

const BoxCategoriesList = ({ boxes, categories }: BoxCategoriesListProps) => {
  const groupedCategories = groupBoxesByCategory(boxes, categories);

  if (groupedCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70 text-lg">No boxes available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="space-y-12">
      {groupedCategories.map((category) => (
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

          {category.boxes.length > 0 ? (
            <div className="relative">
              <Carousel className="group/carousel">
                <CarouselContent className="-ml-3">
                  {category.boxes.map((box) => (
                    <CarouselItem
                      key={box.id}
                      className="basis-[85%] pl-3 sm:basis-[45%] md:basis-[28%] lg:basis-[20%]"
                    >
                      <BoxCard box={box} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 border-white/10 bg-white/10 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100" />
                <CarouselNext className="-right-4 border-white/10 bg-white/10 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100" />
              </Carousel>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/50">No boxes in this category yet.</p>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}

export default BoxCategoriesList


