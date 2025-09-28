import React from "react"
import Image from "next/image"
import { Star, Trophy, Clock, Package, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { MysteryBox, BoxReward } from "@/constant/box-data"

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
        
        <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-lg">
          <Image
            src={reward.image}
            alt={reward.name}
            fill
            sizes="80px"
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

  return (
    <div className="space-y-8">
      {/* Main Box Information */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Box Image and Basic Info */}
        <div className="space-y-6">
          <Card className="border-white/15 bg-white/5">
            <CardContent className="p-6">
              <div className="relative mx-auto h-80 w-80 overflow-hidden rounded-2xl">
                <Image
                  src={box.heroImage}
                  alt={box.title}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  style={{ boxShadow: `inset 0 0 60px ${box.color}40` }}
                />
              </div>
              
              <div className="mt-6 space-y-4 text-center">
                <div className="flex items-center justify-center gap-1">
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
                
                <div className="flex items-center justify-center gap-4">
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Box Details and Purchase */}
        <div className="space-y-6">
          <Card className="border-white/15 bg-white/5">
            <CardHeader>
              <CardTitle className="text-2xl font-pricedown text-white">
                Box Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80 font-suisse leading-relaxed">
                {box.description}
              </p>
              
              <Separator className="bg-white/10" />
              
              <div className="grid grid-cols-2 gap-4">
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
              
              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-pricedown text-lg"
                  disabled={box.status !== "OPEN"}
                >
                  {box.status === "OPEN" ? `Open Box - ${box.price}` : "Coming Soon"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Box Statistics */}
      <Card className="border-white/15 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-pricedown text-white">
            <Trophy className="h-5 w-5" />
            Box Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
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
