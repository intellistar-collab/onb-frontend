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
import { Loader2, Sparkles, Zap, Gauge } from "lucide-react"

const REPEAT_COUNT = 16
const EXTRA_LOOPS = 3
const SPIN_DURATION = 4200

// Simple speed multipliers
const SPEED_OPTIONS = [
  { label: "1x", value: "1x", duration: 4200 },
  { label: "2x", value: "2x", duration: 2100 },
  { label: "4x", value: "4x", duration: 1050 },
  { label: "8x", value: "8x", duration: 525 },
]

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
  // Speed control props
  showSpeedControls?: boolean
  defaultSpeed?: string
}

const RewardSpinner = React.forwardRef<RewardSpinnerHandle, RewardSpinnerProps>(
  ({
    rewards,
    disabled = false,
    ctaLabel = "Open Mystery Box",
    experience,
    onSpin,
    className,
    showSpeedControls = false,
    defaultSpeed = "1x",
  }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedReward, setSelectedReward] = useState<BoxReward | null>(null)
    const [currentSpeed, setCurrentSpeed] = useState(defaultSpeed)

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
      console.log('performSpin called', { isSpinning, disabled, rewardsLength: rewards.length });
      
      if (isSpinning || disabled || !rewards.length) {
        console.log('performSpin blocked by conditions', { isSpinning, disabled, rewardsLength: rewards.length });
        return;
      }

      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) {
        console.log('performSpin blocked - missing refs', { container: !!container, track: !!track });
        return;
      }

      setIsSpinning(true)
      setSelectedReward(null)

      const cardElement = track.firstElementChild as HTMLElement | null
      const cardWidth = cardElement?.getBoundingClientRect().width ?? 220
      const containerRect = container.getBoundingClientRect()
      // Account for the gap between cards (gap-6 = 24px)
      const cardGap = 24
      // Account for container padding (p-4 = 16px on each side)
      const containerPadding = 16
      const centerOffset = containerRect.width / 2 - cardWidth / 2 - containerPadding

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
      // Fix: Ensure the final index correctly positions the winning item
      const finalIndex = baseIndex + rewards.length * EXTRA_LOOPS + winningIndex

      track.style.transition = "none"
      track.style.transform = "translateX(0px)"
      void track.offsetWidth

      const targetOffset = finalIndex * (cardWidth + cardGap) - centerOffset
      
      // Get duration based on selected speed
      const speedOption = SPEED_OPTIONS.find(option => option.value === currentSpeed)
      const duration = speedOption?.duration || SPIN_DURATION

      requestAnimationFrame(() => {
        track.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
        track.style.transform = `translateX(-${targetOffset}px)`
      })

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setSelectedReward(winningReward!)
        setIsSpinning(false)
      }, duration)
    }, [disabled, isSpinning, onSpin, repeatedRewards.length, rewards, currentSpeed])

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
      if (selectedReward) {
        return ` CONGRATULATIONS! You won ${selectedReward.name}! `
      }
      return " UNLOCK MYSTERY TREASURES! "
    }, [selectedReward])

    return (
      <div className={cn("w-full space-y-6", className)}>
        <div className="relative">
          <div className="absolute inset-y-0 left-1/2 z-10 w-1 -translate-x-1/2 bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse" aria-hidden="true" />
          <div className="absolute inset-y-0 left-1/2 z-10 w-3 -translate-x-1/2 bg-gradient-to-b from-amber-400/20 via-yellow-300/20 to-amber-400/20 blur-sm" aria-hidden="true" />

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
                        ? "border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.8)] scale-[1.08] ring-4 ring-amber-400/70 bg-gradient-to-br from-amber-500/20 to-yellow-500/10"
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

                    <div className="relative mx-auto mb-4 h-32 w-full overflow-hidden rounded-xl">
                      <Image
                        src={reward.image}
                        alt={reward.name}
                        fill
                        sizes="200px"
                        className="object-cover hover:scale-105 transition-transform duration-300"
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

        <div className="relative flex flex-col items-center justify-center gap-3 text-center">
          {/* Floating sparkles around the button */}
          {!isSpinning && !disabled && rewards.length > 0 && (
            <>
              <div className="absolute -top-4 -left-4 text-yellow-400 animate-bounce delay-100 pointer-events-none z-0">✨</div>
              <div className="absolute -top-2 -right-6 text-pink-400 animate-bounce delay-200 pointer-events-none z-0">💎</div>
              <div className="absolute -bottom-2 -left-6 text-purple-400 animate-bounce delay-300 pointer-events-none z-0">⭐</div>
              <div className="absolute -bottom-4 -right-4 text-yellow-400 animate-bounce delay-500 pointer-events-none z-0">✨</div>
            </>
          )}
          <div className={cn(
            "flex items-center justify-center gap-3 font-suisse transition-all duration-500",
            selectedReward 
              ? "text-lg font-bold text-amber-300 animate-pulse" 
              : "text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 animate-pulse"
          )}>
            {!isSpinning && (
              <>
                <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
                <span className={cn(
                  selectedReward ? "" : "animate-pulse"
                )}>{statusMessage}</span>
              </>
            )}
          </div>

            {selectedReward && (
              <div className="relative">
                <div className="rounded-full border-2 border-amber-400 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 px-6 py-3 text-lg font-bold uppercase tracking-widest text-amber-100 shadow-2xl animate-bounce">
                  💰 {selectedReward.price} 💰
                </div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 opacity-30 blur animate-pulse"></div>
              </div>
            )}

          {/* Simple Speed Controls */}
          {showSpeedControls && (
            <div className="mb-4 flex items-center justify-center gap-1">
              {SPEED_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCurrentSpeed(option.value)}
                  disabled={isSpinning}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                    "border border-white/20 hover:border-white/40",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    currentSpeed === option.value
                      ? "bg-white/20 text-white border-white/40"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col items-center gap-1">
            <div className="relative w-full">
              <Button
                size="lg"
                className={cn(
                  "relative z-10 w-full text-lg font-pricedown text-white shadow-2xl transition-all duration-300",
                  isSpinning || disabled || !rewards.length
                    ? "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 hover:scale-110 hover:shadow-purple-500/50 animate-pulse"
                )}
                disabled={isSpinning || disabled || !rewards.length}
                onClick={() => {
                  console.log('Button clicked!', { isSpinning, disabled, rewardsLength: rewards.length });
                  void performSpin();
                }}
              >
                {isSpinning ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                    <span className="font-bold">SPINNING...</span>
                  </div>
                ) : (
                  ctaLabel
                )}
              </Button>
              {!isSpinning && !disabled && rewards.length > 0 && (
                <>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-lg blur opacity-75 animate-pulse"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 rounded-lg blur-sm opacity-50 animate-ping"></div>
                </>
              )}
            </div>
            {experience !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse">
                  +{experience.toLocaleString()} XP
                </p>
                <span className="text-lg">⚡</span>
              </div>
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


