import React from "react"
import Image from "next/image"
import { ArrowRight, LocateIcon } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { featuredMysteryBox, mockBoxCategories } from "@/constant/box-data"
import BoxCard from "./box-card"

const BoxHero = () => {
  const heroBox = featuredMysteryBox
  const carouselBoxes = mockBoxCategories[0].boxes

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
      <div className="absolute inset-0">
        <Image
          src="/home-card/banner/city-stays.webp"
          alt="Dubai skyline"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      </div>

      <div className="relative flex flex-col gap-8 px-6 py-12 sm:px-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-suisse uppercase tracking-[0.4em] text-white/60">
              <LocateIcon className="h-3.5 w-3.5" /> Dubai drop
            </span>
            <h1 className="text-4xl font-pricedown uppercase text-white sm:text-5xl">
              {heroBox.title}
            </h1>
            <p className="text-sm font-suisse text-white/60">
              {heroBox.description}
            </p>
          </div>

          <div className="flex items-center gap-6 text-white">
            <div className="text-right">
              <p className="text-xs font-suisse uppercase tracking-[0.4em] text-white/40">
                Entry Price
              </p>
              <p className="text-2xl font-oswald">{heroBox.price}</p>
            </div>
            <div className="hidden h-16 w-px bg-white/10 sm:block" />
            <div className="text-right">
              <p className="text-xs font-suisse uppercase tracking-[0.4em] text-white/40">
                Status
              </p>
              <p className="text-base font-oswald text-emerald-300">
                {heroBox.status}
              </p>
            </div>
            <div className="hidden h-16 w-px bg-white/10 sm:block" />
            <div className="text-right">
              <p className="text-xs font-suisse uppercase tracking-[0.4em] text-white/40">
                Experience
              </p>
              <p className="text-base font-oswald text-white">
                +{heroBox.experience.toLocaleString()} XP
              </p>
            </div>
          </div>
        </header>

        <div className="relative">
          <Carousel className="group/carousel">
            <CarouselContent className="-ml-3">
              {carouselBoxes.map((box) => (
                <CarouselItem
                  key={box.id}
                  className="basis-[85%] pl-3 sm:basis-[45%] md:basis-[28%]"
                >
                  <BoxCard box={box} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 border-white/10 bg-white/10 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100" />
            <CarouselNext className="-right-4 border-white/10 bg-white/10 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100" />
          </Carousel>
        </div>

        <footer className="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/70 sm:flex-row sm:items-center">
          <div>
            <p className="font-suisse uppercase tracking-[0.4em] text-white/40">
              Shipping & Odds
            </p>
            <p>{heroBox.shippingInfo}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-suisse text-white/60">
              {heroBox.rewards.length} featured rewards
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-oswald text-white">
              View box details
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </footer>
      </div>
    </section>
  )
}

export default BoxHero
 

