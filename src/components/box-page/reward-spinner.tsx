"use client"

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { BoxReward } from "@/constant/box-data"
import { Loader2, Sparkles } from "lucide-react"

const REPEAT_COUNT = 16
const EXTRA_LOOPS = 3
const SPIN_DURATION = 4200

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

interface InternalReward extends BoxReward {
  _repeatKey: string
  _originalIndex: number
}

export interface RewardSpinnerHandle {
  spin: () => void
}

interface RewardSpinnerProps {
  rewards: BoxReward[]
  disabled?: boolean
  ctaLabel?: string
  experience?: number
  onSpin?: () => Promise<BoxReward | null | undefined> | BoxReward | null | undefined
  className?: string
}

const RewardSpinner = React.forwardRef<RewardSpinnerHandle, RewardSpinnerProps>(
  ({
    rewards,
    disabled = false,
    ctaLabel = "Open Mystery Box",
    experience,
    onSpin,
    className,
  }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedReward, setSelectedReward] = useState<BoxReward | null>(null)

    const repeatedRewards = useMemo<InternalReward[]>(() => {
      if (!rewards.length) return []
      return Array.from({ length: REPEAT_COUNT }).flatMap((_, repeatIndex) =>
        rewards.map((reward, index) => ({
          ...reward,
          _repeatKey: `${repeatIndex}-${reward.id}-${index}`,
          _originalIndex: index,
        }))
      )
    }, [rewards])

    const performSpin = useCallback(async () => {
      if (isSpinning || disabled || !rewards.length) return

      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) return

      setIsSpinning(true)
      setSelectedReward(null)

      const cardElement = track.firstElementChild as HTMLElement | null
      const cardWidth = cardElement?.getBoundingClientRect().width ?? 220
      const containerRect = container.getBoundingClientRect()
      const centerOffset = containerRect.width / 2 - cardWidth / 2

      let winningReward: BoxReward | null = null

      try {
        const result = typeof onSpin === "function" ? await onSpin() : null
        if (result && rewards.some(reward => reward.id === result.id)) {
          winningReward = result
        }
      } catch (error) {
        console.error("Reward spinner failed to resolve prize", error)
      }

      if (!winningReward) {
        winningReward = rewards[Math.floor(Math.random() * rewards.length)]
      }

      const winningIndex = rewards.findIndex(reward => reward.id === winningReward!.id)
      const totalItems = repeatedRewards.length
      const baseIndex = Math.floor(totalItems / 2)
      const finalIndex = baseIndex + rewards.length * EXTRA_LOOPS + winningIndex

      track.style.transition = "none"
      track.style.transform = "translateX(0px)"
      void track.offsetWidth

      const targetOffset = finalIndex * cardWidth - centerOffset

      requestAnimationFrame(() => {
        track.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
        track.style.transform = `translateX(-${targetOffset}px)`
      })

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setSelectedReward(winningReward!)
        setIsSpinning(false)
      }, SPIN_DURATION)
    }, [disabled, isSpinning, onSpin, repeatedRewards.length, rewards])

    useImperativeHandle(
      ref,
      () => ({
        spin: () => {
          void performSpin()
        },
      }),
      [performSpin]
    )

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    const statusMessage = useMemo(() => {
      if (isSpinning) {
        return "Spinning... good luck!"
      }
      if (selectedReward) {
        return `You won ${selectedReward.name}!`
      }
      return "Press open to spin the mystery box."
    }, [isSpinning, selectedReward])

    return (
      <div className={cn("w-full space-y-6", className)}>
        <div className="relative">
          <div className="absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-gradient-to-b from-white/30 via-white to-white/30" aria-hidden="true" />

          <div
            ref={containerRef}
            className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div
              ref={trackRef}
              className="flex items-start gap-6 will-change-transform"
              style={{ transition: "none", transform: "translateX(0px)" }}
            >
              {repeatedRewards.map(reward => {
                const isSelected = selectedReward?.id === reward.id
                return (
                  <div
                    key={reward._repeatKey}
                    className={cn(
                      "w-[220px] shrink-0 rounded-2xl border bg-white/10/50 px-5 py-6 backdrop-blur transition-all duration-300",
                      isSelected
                        ? "border-emerald-400/80 shadow-[0_0_30px_rgba(52,211,153,0.35)] scale-[1.03]"
                        : "border-white/10"
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Badge
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest text-black/80",
                          "bg-gradient-to-r",
                          getTierColor(reward.tier)
                        )}
                      >
                        {reward.tier}
                      </Badge>
                      <span className="text-xs font-semibold text-white/70">{reward.odds}</span>
                    </div>

                    <div className="relative mx-auto mb-4 h-24 w-full overflow-hidden rounded-xl">
                      <Image
                        src={reward.image}
                        alt={reward.name}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1 text-center">
                      <p className="text-sm font-semibold text-white line-clamp-2">{reward.name}</p>
                      <p className="text-lg font-pricedown text-white">{reward.price}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm font-suisse text-white/80">
            {isSpinning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-300" />}
            <span>{statusMessage}</span>
          </div>

            {selectedReward && (
              <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-200">
                {selectedReward.price}
              </div>
            )}

          <div className="flex flex-col items-center gap-1">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-lg font-pricedown text-white hover:from-purple-600 hover:to-pink-600"
              disabled={isSpinning || disabled || !rewards.length}
              onClick={() => void performSpin()}
            >
              {ctaLabel}
            </Button>
            {experience !== undefined && (
              <p className="text-xs font-suisse uppercase tracking-widest text-white/50">
                +{experience.toLocaleString()} XP
              </p>
            )}
            {disabled && (
              <p className="text-xs font-suisse text-red-300/80">Box is not available right now</p>
            )}
          </div>
        </div>
      </div>
    )
  }
)

RewardSpinner.displayName = "RewardSpinner"

export default RewardSpinner


