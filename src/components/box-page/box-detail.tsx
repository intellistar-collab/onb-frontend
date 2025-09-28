"use client"

import React, { useCallback } from "react"
import Image from "next/image"
import { Star, Trophy, Clock, Package, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { MysteryBox, BoxReward } from "@/constant/box-data"
import RewardSpinner from "@/components/box-page/reward-spinner"

interface BoxDetailProps {
  box: MysteryBox
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case "legendary":
      return "from-amber-400 to-yellow-600 text-amber-900"
    case "epic":
      return "from-purple-400 to-purple-600 text-purple-900"
    case "rare":
      return "from-blue-400 to-blue-600 text-blue-900"
    case "uncommon":
      return "from-green-400 to-green-600 text-green-900"
    default:
      return "from-gray-400 to-gray-600 text-gray-900"
  }
}

const getTierBorderColor = (tier: string) => {
  switch (tier) {
    case "legendary":
      return "border-amber-400"
    case "epic":
      return "border-purple-400"
    case "rare":
      return "border-blue-400"
    case "uncommon":
      return "border-green-400"
    default:
      return "border-gray-400"
  }
}

const RewardCard: React.FC<{ reward: BoxReward }> = ({ reward }) => {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-2 bg-white/5 transition-all hover:scale-105",
        getTierBorderColor(reward.tier)
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-10" 
           style={{ 
             background: `linear-gradient(135deg, ${getTierColor(reward.tier).split(' ')[0].replace('from-', '')} 0%, ${getTierColor(reward.tier).split(' ')[1].replace('to-', '')} 100%)`
           }} />
      
      <CardContent className="relative p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge 
            className={cn(
              "text-xs font-bold uppercase tracking-wider bg-gradient-to-r",
              getTierColor(reward.tier)
            )}
          >
            {reward.tier}
          </Badge>
          <span className="text-sm font-bold text-white">{reward.odds}</span>
        </div>
        
        <div className="relative mx-auto mb-3 h-32 w-32 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
          <Image
            src={reward.image}
            alt={reward.name}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>
        
        <div className="text-center">
          <h4 className="text-sm font-semibold text-white line-clamp-2 mb-1">
            {reward.name}
          </h4>
          <p className="text-lg font-bold text-white">
            {reward.price}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const BoxDetail: React.FC<BoxDetailProps> = ({ box }) => {
  const RATING_STARS = 5

  const handleSpin = useCallback(async () => {
    const weights = box.rewards.map(reward => {
      const parsed = parseFloat(reward.odds.replace("%", ""))
      return Number.isFinite(parsed) ? parsed : 0
    })

    const sum = weights.reduce((total, weight) => total + weight, 0)

    if (sum <= 0) {
      return box.rewards[Math.floor(Math.random() * box.rewards.length)]
    }

    const threshold = Math.random() * sum
    let cumulative = 0

    for (let index = 0; index < box.rewards.length; index += 1) {
      cumulative += weights[index]
      if (threshold <= cumulative) {
        return box.rewards[index]
      }
    }

    return box.rewards[box.rewards.length - 1]
  }, [box.rewards])

  return (
    <div className="space-y-8">
      <Card className="border-white/15 bg-white/5">
        <CardHeader>
          <CardTitle className="text-2xl font-pricedown text-white">
            Open Mystery Box
          </CardTitle>
          <p className="text-sm font-suisse text-white/60">
            Spin the carousel to reveal what you secure from this drop.
          </p>
        </CardHeader>
        <CardContent>
          <RewardSpinner
            rewards={box.rewards}
            disabled={box.status !== "OPEN"}
            ctaLabel={box.status === "OPEN" ? `Open Box - ${box.price}` : "Coming Soon"}
            experience={box.experience}
            onSpin={async () => {
              await new Promise(resolve => setTimeout(resolve, 400))
              return handleSpin()
            }}
            className="w-full"
          />
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border-white/15 bg-white/5">
          <CardHeader>
            <CardTitle className="text-2xl font-pricedown text-white">
              Box Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="relative mx-auto h-80 w-full max-w-2xl overflow-hidden rounded-2xl lg:mx-0 lg:w-96">
                <Image
                  src={box.heroImage}
                  alt={box.title}
                  fill
                  sizes="400px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  style={{ boxShadow: `inset 0 0 60px ${box.color}40` }}
                />
              </div>

              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center lg:items-start lg:text-left">
                <div className="flex items-center justify-center gap-1 lg:justify-start">
                  {Array.from({ length: RATING_STARS }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={cn(
                        "h-5 w-5",
                        idx < box.star ? "fill-current text-white" : "text-white/20"
                      )}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Badge
                    variant="outline"
                    className="border-white/30 bg-white/10 font-suisse text-sm uppercase tracking-wider text-white"
                  >
                    {box.tag}
                  </Badge>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-sm font-semibold uppercase",
                      box.status === "OPEN"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-200"
                    )}
                  >
                    {box.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-lg font-pricedown text-white">{box.title.replace('\n', ' ')}</p>
                  <p className="text-sm font-suisse text-white/60">Mystery Box #{box.location}</p>
                </div>
              </div>
            </div>

            <p className="text-white/80 font-suisse leading-relaxed">
              {box.description}
            </p>

            <Separator className="bg-white/10" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-suisse text-white/50">Entry Price</p>
                <p className="text-2xl font-pricedown text-white">{box.price}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-suisse text-white/50">Win Odds</p>
                <p className="text-2xl font-pricedown text-white">{box.percentage}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-suisse text-white/50">Experience</p>
                <p className="text-xl font-pricedown text-white">+{box.experience.toLocaleString()} XP</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-suisse text-white/50">Location</p>
                <p className="text-xl font-pricedown text-white">{box.location}</p>
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-2">
              <p className="text-sm font-suisse text-white/50">Shipping Info</p>
              <p className="text-white/80 font-suisse">{box.shippingInfo}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/15 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-pricedown text-white">
              <Trophy className="h-5 w-5" />
              Box Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {box.stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="flex items-center justify-center">
                    {index === 0 && <Clock className="h-5 w-5 text-white/60" />}
                    {index === 1 && <Package className="h-5 w-5 text-white/60" />}
                    {index === 2 && <Trophy className="h-5 w-5 text-white/60" />}
                    {index === 3 && <Zap className="h-5 w-5 text-white/60" />}
                  </div>
                  <p className="text-sm font-suisse text-white/50">{stat.label}</p>
                  <p className="text-lg font-pricedown text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Possible Rewards */}
      <Card className="border-white/15 bg-white/5">
        <CardHeader>
          <CardTitle className="text-xl font-pricedown text-white">
            Possible Rewards
          </CardTitle>
          <p className="text-sm font-suisse text-white/60">
            All possible items you could win from this mystery box
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {box.rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BoxDetail
