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
import { cn, formatPrice } from "@/lib/utils"
import type { BoxReward } from "@/constant/box-data"
import { Loader2, Sparkles, Zap, Gauge, ChevronLeft, ChevronRight } from "lucide-react"
import SmartImage from "./loading-image"

const REPEAT_COUNT = 20
const EXTRA_LOOPS = 4
const SPIN_DURATION = 4000

// Simple speed multipliers
const SPEED_OPTIONS = [
  { label: "1x", value: "1x", duration: 4000 },
  { label: "2x", value: "2x", duration: 2000 },
  { label: "4x", value: "4x", duration: 1000 },
  { label: "8x", value: "8x", duration: 500 },
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
  onButtonClick?: () => Promise<boolean> | boolean // Return true to proceed with spin, false to prevent
  onItemClick?: (item: BoxReward) => void // Called when user clicks on selected item
  className?: string
  // Speed control props
  showSpeedControls?: boolean
  defaultSpeed?: string
  // Try for free button
  showTryForFree?: boolean
  tryForFreeLabel?: string
  onTryForFree?: () => void
}

const RewardSpinner = React.forwardRef<RewardSpinnerHandle, RewardSpinnerProps>(
  ({
    rewards,
    disabled = false,
    ctaLabel = "Open Mystery Box",
    experience,
    onSpin,
    onButtonClick,
    onItemClick,
    className,
    showSpeedControls = false,
    defaultSpeed = "1x",
    showTryForFree = false,
    tryForFreeLabel = "Try for Free",
    onTryForFree,
  }, ref) => {
    // Preload all reward images for faster spinner performance
    React.useEffect(() => {
      rewards.forEach(reward => {
        if (reward.image) {
          const img = new window.Image();
          img.src = reward.image;
        }
      });
    }, [rewards]);
    const containerRef = useRef<HTMLDivElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [isSpinning, setIsSpinning] = useState(false)
    const [spinningButton, setSpinningButton] = useState<'try-for-free' | 'open-box' | null>(null)
    const [selectedReward, setSelectedReward] = useState<BoxReward | null>(null)
    const [currentSpeed, setCurrentSpeed] = useState(defaultSpeed)
    const [currentMobileIndex, setCurrentMobileIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

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

    // Detect mobile screen size
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768) // md breakpoint
      }
      
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Mobile navigation functions
    const goToPrevious = useCallback(() => {
      setCurrentMobileIndex(prev => (prev > 0 ? prev - 1 : rewards.length - 1))
    }, [rewards.length])

    const goToNext = useCallback(() => {
      setCurrentMobileIndex(prev => (prev < rewards.length - 1 ? prev + 1 : 0))
    }, [rewards.length])

    // Desktop navigation helpers: scroll one card width
    const scrollDesktopByStep = useCallback((direction: -1 | 1) => {
      if (!containerRef.current || !trackRef.current || isSpinning) return
      const track = trackRef.current
      const firstChild = track.firstElementChild as HTMLElement | null
      const secondChild = track.children.item(1) as HTMLElement | null
      // Fallback step if layout metrics are unavailable
      let step = 244 // ~220px card + 24px gap
      if (firstChild && secondChild) {
        const rect1 = firstChild.getBoundingClientRect()
        const rect2 = secondChild.getBoundingClientRect()
        const delta = Math.abs(rect2.left - rect1.left)
        if (delta > 0) step = delta
      }
      containerRef.current.scrollBy({ left: direction * step, behavior: 'smooth' })
    }, [isSpinning])

    const goToPreviousDesktop = useCallback(() => {
      scrollDesktopByStep(-1)
    }, [scrollDesktopByStep])

    const goToNextDesktop = useCallback(() => {
      scrollDesktopByStep(1)
    }, [scrollDesktopByStep])

    const performSpin = useCallback(async (buttonType: 'try-for-free' | 'open-box' = 'open-box') => {
      if (isSpinning || disabled || !rewards.length) {
        return;
      }

      setIsSpinning(true)
      setSpinningButton(buttonType)
      setSelectedReward(null)

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

      if (isMobile) {
        // Mobile spin animation - simple cycling through items
        const totalItems = rewards.length
        const spinDuration = 2000 // 2 seconds for mobile
        const itemDuration = spinDuration / totalItems
        
        // Get duration based on selected speed
        const speedOption = SPEED_OPTIONS.find(option => option.value === currentSpeed)
        const duration = speedOption?.duration || spinDuration
        
        const winningIndex = rewards.findIndex(reward => reward.id === winningReward!.id)
        
        // Animate through items
        const startTime = Date.now()
        
        const animateMobile = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Calculate which item should be shown
          const totalCycles = 3 // Go through all items 3 times
          const itemsPerCycle = totalItems
          const totalItemsToShow = totalCycles * itemsPerCycle + winningIndex
          const currentItemIndex = Math.floor(progress * totalItemsToShow)
          
          // Show the current item
          setCurrentMobileIndex(currentItemIndex % totalItems)
          
          if (progress < 1) {
            requestAnimationFrame(animateMobile)
          } else {
            // Final result
            setCurrentMobileIndex(winningIndex)
            setSelectedReward(winningReward!)
            setIsSpinning(false)
            setSpinningButton(null)
          }
        }
        
        requestAnimationFrame(animateMobile)
        return
      }

      // Desktop spin animation (original logic)
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) {
        setIsSpinning(false)
        setSpinningButton(null)
        return;
      }

      const cardElement = track.firstElementChild as HTMLElement | null
      const cardWidth = cardElement?.getBoundingClientRect().width ?? 220
      const containerRect = container.getBoundingClientRect()
      // Account for the gap between cards (gap-6 = 24px)
      const cardGap = 24
      // Account for container padding (p-4 = 16px on each side)
      const containerPadding = 16
      const centerOffset = containerRect.width / 2 - cardWidth / 2 - containerPadding

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

      // Create a multi-stage animation for realistic acceleration/deceleration
      const startTime = Date.now()
      let animationId: number

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Create a more dramatic speed curve with pronounced acceleration and deceleration
        let easedProgress: number
        
        if (progress < 0.15) {
          // Gradual acceleration (0-15% of animation)
          easedProgress = Math.pow(progress / 0.15, 2) * 0.1 // Quadratic ease-in
        } else if (progress < 0.75) {
          // High speed section (15-75% of animation)
          const middleProgress = (progress - 0.15) / 0.6
          easedProgress = 0.1 + middleProgress * 0.8 // Linear fast section
        } else {
          // Dramatic deceleration (75-100% of animation)
          const endProgress = (progress - 0.75) / 0.25
          easedProgress = 0.9 + (1 - Math.pow(1 - endProgress, 4)) * 0.1 // Quartic ease-out for dramatic slowdown
        }
        
        const currentOffset = targetOffset * easedProgress
        track.style.transform = `translateX(-${currentOffset}px)`
        
        if (progress < 1) {
          animationId = requestAnimationFrame(animate)
        } else {
          setSelectedReward(winningReward!)
          setIsSpinning(false)
          setSpinningButton(null)
        }
      }

      // Start the animation
      animationId = requestAnimationFrame(animate)

      // Cleanup function
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
      }
    }, [disabled, isSpinning, onSpin, repeatedRewards.length, rewards, currentSpeed, isMobile])

    useImperativeHandle(
      ref,
      () => ({
        spin: () => {
          void performSpin('open-box')
        },
      }),
      [performSpin]
    )

    useEffect(() => {
      const timeout = timeoutRef.current
      return () => {
        if (timeout) {
          clearTimeout(timeout)
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
        {isMobile ? (
          // Mobile carousel view
          <div className="relative">
            <div className="absolute inset-y-0 left-1/2 z-10 w-1 -translate-x-1/2 bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse" aria-hidden="true" />
            <div className="absolute inset-y-0 left-1/2 z-10 w-3 -translate-x-1/2 bg-gradient-to-b from-amber-400/20 via-yellow-300/20 to-amber-400/20 blur-sm" aria-hidden="true" />

            <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <div className="flex items-center justify-center">
                {rewards.map((reward, index) => {
                  const isSelected = selectedReward?.id === reward.id
                  const isCurrent = index === currentMobileIndex
                  return (
                    <div
                      key={reward.id}
                      className={cn(
                        "w-full max-w-[260px] sm:max-w-[280px] rounded-2xl border bg-white/10/50 px-3 py-4 sm:px-4 sm:py-6 backdrop-blur transition-all duration-500 ease-out",
                        isSelected
                          ? "border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.8)] scale-[1.02] ring-4 ring-amber-400/70 bg-gradient-to-br from-amber-500/20 to-yellow-500/10"
                          : "border-white/10 hover:border-white/20 hover:bg-white/15",
                        !isCurrent && "hidden"
                      )}
                      style={isSelected ? {
                        animation: 'subtle-bounce 2s ease-in-out infinite'
                      } : undefined}
                    >
                      <div className="mb-2 sm:mb-3 flex items-center justify-between">
                        <Badge
                          className={cn(
                            "text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-black/80",
                            "bg-gradient-to-r",
                            getTierColor(reward.tier)
                          )}
                        >
                          {reward.tier}
                        </Badge>
                        <span className="text-[10px] sm:text-xs font-semibold text-white/70">{reward.odds}</span>
                      </div>

                      <div className="relative mx-auto mb-3 sm:mb-4 h-32 w-full overflow-hidden rounded-xl">
                        <SmartImage
                          src={reward.image}
                          alt={reward.name}
                          fill
                          sizes="(max-width: 640px) 260px, 280px"
                          className="object-contain transition-transform duration-500 ease-out hover:scale-110"
                          priority={true}
                        />
                      </div>

                      <div className="space-y-1 text-center">
                        <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2">{reward.name}</p>
                        <p className="text-base sm:text-lg font-pricedown text-white">{formatPrice(reward.price)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mobile navigation arrows */}
            <div className="flex items-center justify-between mt-4 px-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={isSpinning}
                className="bg-white/10 border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </Button>
              
              <div className="flex items-center gap-1.5 max-w-[200px] overflow-x-auto scrollbar-hide px-2">
                {rewards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => !isSpinning && setCurrentMobileIndex(index)}
                    disabled={isSpinning}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-200 flex-shrink-0",
                      index === currentMobileIndex
                        ? "bg-amber-400 scale-125"
                        : "bg-white/30 hover:bg-white/50",
                      isSpinning && "cursor-not-allowed opacity-50"
                    )}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={isSpinning}
                className="bg-white/10 border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        ) : (
          // Desktop spinner view
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
                        "w-[220px] shrink-0 rounded-2xl border bg-white/10/50 px-5 py-6 backdrop-blur transition-all duration-500 ease-out",
                        isSelected
                          ? "border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.8)] scale-[1.02] ring-4 ring-amber-400/70 bg-gradient-to-br from-amber-500/20 to-yellow-500/10"
                          : "border-white/10 hover:border-white/20 hover:bg-white/15"
                      )}
                      style={isSelected ? {
                        animation: 'subtle-bounce 2s ease-in-out infinite'
                      } : undefined}
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
                          <SmartImage
                          src={reward.image}
                          alt={reward.name}
                          fill
                          sizes="200px"
                          className="object-contain transition-transform duration-500 ease-out hover:scale-110"
                          priority={true}
                        />
                      </div>

                      <div className="space-y-1 text-center">
                        <p className="text-sm font-semibold text-white line-clamp-2">{reward.name}</p>
                        <p className="text-lg font-pricedown text-white">{formatPrice(reward.price)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Desktop navigation arrows */}
            <div className="pointer-events-none" aria-hidden="true">
              <button
                type="button"
                onClick={goToPreviousDesktop}
                disabled={isSpinning}
                className="pointer-events-auto absolute top-1/2 -translate-y-1/2 left-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goToNextDesktop}
                disabled={isSpinning}
                className="pointer-events-auto absolute top-1/2 -translate-y-1/2 right-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="relative flex flex-col items-center justify-center gap-3 text-center">
          {/* Floating sparkles around the button */}
          {!isSpinning && !disabled && rewards.length > 0 && (
            <>
              <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 text-yellow-400 animate-bounce delay-100 pointer-events-none z-0 text-sm sm:text-base">✨</div>
              <div className="absolute -top-1 sm:-top-2 -right-3 sm:-right-6 text-pink-400 animate-bounce delay-200 pointer-events-none z-0 text-sm sm:text-base">💎</div>
              <div className="absolute -bottom-1 sm:-bottom-2 -left-3 sm:-left-6 text-purple-400 animate-bounce delay-300 pointer-events-none z-0 text-sm sm:text-base">⭐</div>
              <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 text-yellow-400 animate-bounce delay-500 pointer-events-none z-0 text-sm sm:text-base">✨</div>
            </>
          )}
          <div className={cn(
            "flex items-center justify-center gap-2 sm:gap-3 font-suisse transition-all duration-500 mb-4 sm:mb-5",
            selectedReward 
              ? "text-sm sm:text-lg font-bold text-amber-300 animate-pulse" 
              : "text-base sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 animate-pulse"
          )}>
            {!isSpinning && (
              <>
                <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-400 animate-bounce" />
                <span className={`text-lg sm:text-2xl lg:text-3xl font-pricedown ${cn(
                  selectedReward ? "" : "animate-pulse"
                )}`}>{statusMessage}</span>
              </>
            )}
          </div>

          {selectedReward && (
            <div className="relative">
              <Button
                onClick={() => onItemClick?.(selectedReward)}
                className="relative z-10 rounded-full border-2 border-amber-400 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-bold uppercase tracking-widest text-amber-100 shadow-2xl animate-bounce hover:from-amber-500/50 hover:to-yellow-500/50 hover:scale-105 transition-all duration-300"
              >
                💰 {formatPrice(selectedReward.price)} 💰
              </Button>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 opacity-30 blur animate-pulse pointer-events-none"></div>
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
            {showTryForFree ? (
              // Two buttons layout
              <div className="flex gap-3 w-full">
                {/* Try for Free Button */}
                <div className="relative flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      "relative z-10 w-full text-lg font-pricedown text-white shadow-2xl transition-all duration-500 ease-out",
                      isSpinning || disabled || !rewards.length
                        ? "bg-gray-600/50 border-gray-500 cursor-not-allowed"
                        : "bg-gray-600/30 border-gray-400 hover:bg-gray-600/50 hover:border-gray-300 hover:scale-105"
                    )}
                    disabled={isSpinning || disabled || !rewards.length}
                    onClick={() => {
                      if (onTryForFree) {
                        onTryForFree();
                      }
                      void performSpin('try-for-free');
                    }}
                  >
                    {isSpinning && spinningButton === 'try-for-free' ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                        <span className="font-bold">SPINNING...</span>
                      </div>
                    ) : (
                      tryForFreeLabel
                    )}
                  </Button>
                </div>

                {/* Open Box Button */}
                <div className="relative flex-1">
                  <Button
                    size="lg"
                    className={cn(
                      "relative z-10 w-full text-lg font-pricedown text-white shadow-2xl transition-all duration-500 ease-out",
                      isSpinning || disabled || !rewards.length
                        ? "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 hover:scale-105 hover:shadow-purple-500/50 animate-pulse"
                    )}
                    disabled={isSpinning || disabled || !rewards.length}
                    onClick={async () => {
                      // If onButtonClick is provided, call it first
                      if (onButtonClick) {
                        const shouldProceed = await onButtonClick();
                        if (!shouldProceed) {
                          return; // Don't start the spin
                        }
                      }
                      void performSpin('open-box');
                    }}
                  >
                    {isSpinning && spinningButton === 'open-box' ? (
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
              </div>
            ) : (
              // Single button layout (original)
              <div className="relative w-full">
                <Button
                  size="lg"
                  className={cn(
                    "relative z-10 w-full text-lg font-pricedown text-white shadow-2xl transition-all duration-500 ease-out",
                    isSpinning || disabled || !rewards.length
                      ? "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 hover:scale-105 hover:shadow-purple-500/50 animate-pulse"
                  )}
                  disabled={isSpinning || disabled || !rewards.length}
                  onClick={async () => {
                    // If onButtonClick is provided, call it first
                    if (onButtonClick) {
                      const shouldProceed = await onButtonClick();
                      if (!shouldProceed) {
                        return; // Don't start the spin
                      }
                    }
                    void performSpin('open-box');
                  }}
                >
                  {isSpinning && spinningButton === 'open-box' ? (
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
            )}
            {experience !== undefined && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-lg">⚡</span>
                <p className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse">
                  +{experience.toLocaleString()} XP
                </p>
                <span className="text-sm sm:text-lg">⚡</span>
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


