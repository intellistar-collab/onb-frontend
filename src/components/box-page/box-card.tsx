import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Star, Package } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { MysteryBox } from "@/constant/box-data"

interface BoxCardProps {
  box: MysteryBox
  showOdds?: boolean
}

const RATING_STARS = 5

const BoxCard = ({ box, showOdds = true }: BoxCardProps) => {
  const href = box.href || `/box/${box.id}`
  const oddsValue = showOdds ? box.percentage : "—"

  const cardBody = (
    <Card
      className="group relative h-full border-white/15 py-6 transition-transform hover:-translate-y-1"
      style={{ 
        boxShadow: `0 0 18px -6px ${box.color}`,
        backgroundImage: 'url(/box/card-bg.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="border-white/30 bg-white/10 font-oswald text-[11px] uppercase tracking-[0.2em] text-white"
          >
            {box.tag}
          </Badge>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
              box.status === "OPEN"
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-amber-500/20 text-amber-200"
            )}
          >
            {box.status}
          </span>
        </div>

        <div className="flex items-center justify-center gap-1 text-white/80">
          {Array.from({ length: RATING_STARS }).map((_, idx) => (
            <Star
              key={idx}
              className={cn(
                "h-4 w-4",
                idx < box.star ? "fill-current text-white" : "text-white/20"
              )}
            />
          ))}
        </div>

        <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300">
          {box.image && box.image !== '' ? (
            <Image
              src={box.image}
              alt={box.title}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <Package className="h-16 w-16 text-zinc-400" />
            </div>
          )}
        </div>

        <div className="space-y-1 text-center">
          <h3 className="text-lg font-oswald uppercase text-white">
            {box.title}
          </h3>
          <p className="text-xs font-suisse uppercase tracking-[0.3em] text-white/50">
            Drop #{box.location}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-white w-full">
          <div>
            <p className="text-xs font-suisse text-white/50">Entry</p>
            <p className="font-oswald text-lg text-white">{box.price}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-suisse text-white/50">Odds</p>
            <p className="font-oswald text-lg text-white">{oddsValue}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Exp. Rewards</span>
          <span className="font-semibold text-white">
            +{box.experience.toLocaleString()} XP
          </span>
        </div>
      </CardFooter>

      <div
        className="pointer-events-none absolute inset-0 rounded-xl border border-white/5 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        style={{ boxShadow: `0 0 30px -12px ${box.color}` }}
      />
    </Card>
  )

  return (
    <Link href={href} className="relative block h-full" prefetch={false}>
      {cardBody}
      <span className="pointer-events-none absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

export default BoxCard
 