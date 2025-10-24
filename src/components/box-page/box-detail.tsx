"use client"

import React, { useCallback, useState } from "react"
import Image from "next/image"
import { Star, Trophy, Clock, Package, Zap, Search, ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn, formatPrice } from "@/lib/utils"
import type { MysteryBox, BoxReward } from "@/constant/box-data"
import RewardSpinner from "@/components/box-page/reward-spinner"
import SmartImage from "@/components/box-page/loading-image"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import AuthDialogs from "@/components/auth/auth-dialogs"
import ItemActionDialog from "@/components/box-page/item-action-dialog"
import { inventoryAPI } from "@/lib/api/inventory"
import { boxOpeningAPI } from "@/lib/api/box-opening"
import { playOpenBoxSound, playPurchaseBoxSound } from "@/lib/audio-utils"

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreloaded, setImagePreloaded] = useState(false);

  // Preload the image when component mounts or on hover
  React.useEffect(() => {
    if (reward.image && !imagePreloaded) {
      const img = new window.Image();
      img.onload = () => setImagePreloaded(true);
      img.onerror = () => setImagePreloaded(false);
      img.src = reward.image;
    }
  }, [reward.image, imagePreloaded]);

  const handleMouseEnter = () => {
    // Start preloading on hover if not already preloaded
    if (reward.image && !imagePreloaded) {
      const img = new window.Image();
      img.onload = () => setImagePreloaded(true);
      img.onerror = () => setImagePreloaded(false);
      img.src = reward.image;
    }
  };  

  return (
    <>
      <div 
        className="group relative cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
        onMouseEnter={handleMouseEnter}
        suppressHydrationWarning
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-lg border-2 bg-white/5 transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400/50"
             style={{ borderColor: getTierBorderColor(reward.tier) }}
             suppressHydrationWarning>
          <SmartImage
            src={reward.image}
            alt={reward.name}
            fill
            sizes="120px"
            className="object-contain"
            priority={true}
          />
          
          {/* Magnifier Icon Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center" suppressHydrationWarning>
            <Search className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" suppressHydrationWarning />
          </div>
          
          {/* Tier Badge */}
          <div className="absolute top-1 left-1" suppressHydrationWarning>
            <Badge 
              className={cn(
                "text-[8px] font-bold uppercase tracking-wider bg-gradient-to-r",
                getTierColor(reward.tier)
              )}
            >
              {reward.tier}
            </Badge>
          </div>
        </div>
        
        {/* Item Information Below Image */}
        <div className="mt-2 text-center" suppressHydrationWarning>
          <h4 className="text-xs font-semibold text-white line-clamp-1 mb-1">
            {reward.name}
          </h4>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-white/70">{reward.odds}</span>
            <span className="text-xs text-white/50">•</span>
            <span className="text-xs font-bold text-amber-400">{formatPrice(reward.price)}</span>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm bg-gradient-to-br from-gray-900 via-black to-gray-900 border-white/15">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-lg">
              {reward.name}
            </DialogTitle>
            <DialogDescription className="text-white/70 text-center">
              View detailed information about this item
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            {/* Large Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg border-2 bg-white/5"
                 style={{ borderColor: getTierBorderColor(reward.tier) }}>
              {!imagePreloaded ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : null}
              <SmartImage
                src={reward.image}
                alt={reward.name}
                fill
                sizes="300px"
                className="object-contain"
                priority={true}
                preloaded={imagePreloaded}
              />
            </div>
            
            {/* Item Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge 
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider bg-gradient-to-r",
                    getTierColor(reward.tier)
                  )}
                >
                  {reward.tier}
                </Badge>
                <span className="text-base font-bold text-amber-400">{formatPrice(reward.price)}</span>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-white/70 mb-1">Drop Rate</p>
                <p className="text-xl font-bold text-white">{reward.odds}</p>
              </div>
            </div>

            {/* More Information Button */}
            <div className="pt-3 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                onClick={() => window.open(`/item/${reward.id}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                More Information
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Constants
const CONSTANTS = {
  RATING_STARS: 5,
  DEFAULT_ODDS: "100%",
  DEFAULT_TIER: "uncommon",
  DEFAULT_DESCRIPTION: "",
  BOX_STATUS: {
    OPEN: "OPEN",
    COMING_SOON: "COMING_SOON"
  },
  ITEM_STATUS: {
    SOLD: "SOLD",
    KEPT: "KEPT"
  },
  TOAST_VARIANTS: {
    DEFAULT: "default",
    DESTRUCTIVE: "destructive"
  },
  MESSAGES: {
    AUTH_REQUIRED: "🔐 User not authenticated, showing auth dialog",
    BALANCE_CHECK: "💰 Balance check:",
    CHECKS_PASSED: "✅ All checks passed, allowing box opening",
    TRY_FOR_FREE: "🎮 User clicked Try for Free - no authentication required",
    BOX_OPENED: "Box Opened!",
    ITEM_SOLD: "Item Sold!",
    ITEM_KEPT: "Item Kept!",
    ERROR: "Error",
    INSUFFICIENT_BALANCE: "Insufficient Balance",
    INSUFFICIENT_BALANCE_DESC: "You don't have enough balance to open this box. Please check your wallet balance.",
    BOX_OPENED_DESC: "You received {itemName} worth {price}!",
    ITEM_SOLD_DESC: "{itemName} has been sold for {price}. The amount has been added to your wallet balance.",
    ITEM_KEPT_DESC: "{itemName} has been added to your inventory. You can view and manage it in your inventory page.",
    FAILED_TO_OPEN: "Failed to open box. Please try again.",
    FAILED_TO_SELL: "Failed to sell item. Please try again.",
    FAILED_TO_KEEP: "Failed to keep item. Please try again.",
    FAILED_TO_REFRESH: "Failed to refresh user data:"
  },
  UI_LABELS: {
    OPEN_BOX: "Open Box",
    COMING_SOON: "Coming Soon",
    TRY_FOR_FREE: "Try for Free",
    BOX_INFORMATION: "Box Information",
    OPEN_MYSTERY_BOX: "Open Mystery Box",
    SPIN_DESCRIPTION: "Spin the carousel to reveal what you secure from this drop.",
    BOX_DETAILS: "Box Details",
    REWARDS: "Rewards",
    BOX_STATISTICS: "Box Statistics",
    SHIPPING_INFO: "Shipping Info",
    EXPERIENCE: "Experience",
    LOCATION: "Location",
    MYSTERY_BOX: "Mystery Box #",
    ALL_ITEMS: "All Items",
    ALL_ITEMS_DESC: "All possible items you could win from this mystery box",
    NO_ITEMS: "No items available in this box yet."
  }
} as const;

const BoxDetail: React.FC<BoxDetailProps> = ({ box }) => {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth()
  const { toast } = useToast()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showItemActionDialog, setShowItemActionDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BoxReward | null>(null)
  const [isProcessingItem, setIsProcessingItem] = useState(false)

  const handleBoxOpen = useCallback(async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      setShowAuthDialog(true)
      return false // Don't proceed with spin
    }

    // Check if user has sufficient balance
    const boxPrice = parseFloat(box.price.replace(/[^0-9.-]+/g, ""))
    const userBalance = user.wallet?.balance || 0

    if (userBalance < boxPrice) {
      toast({
        title: CONSTANTS.MESSAGES.INSUFFICIENT_BALANCE,
        description: CONSTANTS.MESSAGES.INSUFFICIENT_BALANCE_DESC,
        variant: CONSTANTS.TOAST_VARIANTS.DESTRUCTIVE,
      })
      return false // Don't proceed with spin
    }

    return true
  }, [isAuthenticated, user, box.price, toast])


  const handleItemClick = useCallback((item: BoxReward) => {
    setSelectedItem(item)
    setShowItemActionDialog(true)
  }, [])

  const handleItemProcessed = useCallback((itemId: string) => {
    // This will be called when an item is processed (sold/kept)
    // The reward spinner will handle disabling the button
  }, [])

  const handleSellItem = useCallback(async (item: BoxReward) => {
    setIsProcessingItem(true)
    try {
      // Add item to inventory with SOLD status
      // This will create transaction and update item stats
      await inventoryAPI.addToInventory({
        itemId: item.id,
        boxId: box.id,
        status: CONSTANTS.ITEM_STATUS.SOLD
      })
      
      toast({
        title: CONSTANTS.MESSAGES.ITEM_SOLD,
        description: CONSTANTS.MESSAGES.ITEM_SOLD_DESC
          .replace('{itemName}', item.name)
          .replace('{price}', formatPrice(item.price)),
        variant: CONSTANTS.TOAST_VARIANTS.DEFAULT,
      })
      
      // Refresh user data to get updated wallet balance
      try {
        await refreshUser();
      } catch (error) {
        console.error(CONSTANTS.MESSAGES.FAILED_TO_REFRESH, error);
      }
      
      setShowItemActionDialog(false)
      setSelectedItem(null)
      
      // Notify that the item has been processed
      handleItemProcessed(item.id)
    } catch (error) {
      console.error("Error selling item:", error)
      toast({
        title: CONSTANTS.MESSAGES.ERROR,
        description: CONSTANTS.MESSAGES.FAILED_TO_SELL,
        variant: CONSTANTS.TOAST_VARIANTS.DESTRUCTIVE,
      })
    } finally {
      setIsProcessingItem(false)
    }
  }, [toast, box.id, handleItemProcessed, refreshUser])

  const handleKeepItem = useCallback(async (item: BoxReward) => {
    setIsProcessingItem(true)
    try {
      // Add item to inventory with KEPT status
      // No transaction needed since user doesn't sell it yet
      await inventoryAPI.addToInventory({
        itemId: item.id,
        boxId: box.id,
        status: CONSTANTS.ITEM_STATUS.KEPT
      })
      
      toast({
        title: CONSTANTS.MESSAGES.ITEM_KEPT,
        description: CONSTANTS.MESSAGES.ITEM_KEPT_DESC
          .replace('{itemName}', item.name),
        variant: CONSTANTS.TOAST_VARIANTS.DEFAULT,
      })
      
      setShowItemActionDialog(false)
      setSelectedItem(null)
      
      // Notify that the item has been processed
      handleItemProcessed(item.id)
    } catch (error) {
      console.error("Error keeping item:", error)
      toast({
        title: CONSTANTS.MESSAGES.ERROR,
        description: CONSTANTS.MESSAGES.FAILED_TO_KEEP,
        variant: CONSTANTS.TOAST_VARIANTS.DESTRUCTIVE,
      })
    } finally {
      setIsProcessingItem(false)
    }
  }, [toast, box.id, handleItemProcessed])

  const handleSpin = useCallback(async () => {
    try {
      // Play purchase sound when starting to open box
      playPurchaseBoxSound();
      
      // Call the backend API to open the box
      const result = await boxOpeningAPI.openBox(box.id)
      
      // Convert the selected item to BoxReward format for the spinner
      const selectedReward: BoxReward = {
        id: result.selectedItem.id,
        name: result.selectedItem.name,
        price: result.selectedItem.price.toString(),
        image: result.selectedItem.imageUrl || "",
        odds: CONSTANTS.DEFAULT_ODDS, // Since it's already selected
        tier: CONSTANTS.DEFAULT_TIER, // Default tier
        description: CONSTANTS.DEFAULT_DESCRIPTION
      }

      // Play box opening sound
      playOpenBoxSound();

      return selectedReward
    } catch (error) {
      console.error("Error opening box:", error)
      toast({
        title: CONSTANTS.MESSAGES.ERROR,
        description: error instanceof Error ? error.message : CONSTANTS.MESSAGES.FAILED_TO_OPEN,
        variant: CONSTANTS.TOAST_VARIANTS.DESTRUCTIVE,
      })
      throw error
    }
  }, [box.id, toast])

  const handleAnimationComplete = useCallback(async (selectedReward: BoxReward) => {
    // Show success message after spinner animation completes
    toast({
      title: CONSTANTS.MESSAGES.BOX_OPENED,
      description: CONSTANTS.MESSAGES.BOX_OPENED_DESC
        .replace('{itemName}', selectedReward.name)
        .replace('{price}', formatPrice(selectedReward.price)),
      variant: CONSTANTS.TOAST_VARIANTS.DEFAULT,
    })
    
    // Refresh user data to get updated wallet balance
    try {
      await refreshUser();
    } catch (error) {
      console.error(CONSTANTS.MESSAGES.FAILED_TO_REFRESH, error);
    }
  }, [toast, refreshUser])

  const handleDialogClose = useCallback(() => {
    // Reset dialog state when dialog closes
    setShowItemActionDialog(false)
    setSelectedItem(null)
  }, [])

  const handleTryForFree = useCallback(() => {
  }, [])

  return (
    <>
    <div className="space-y-6 sm:space-y-8 overflow-hidden">
      <Card className="border-white/15 bg-white/5">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl font-pricedown text-white">
            {CONSTANTS.UI_LABELS.OPEN_MYSTERY_BOX}
          </CardTitle>
          <p className="text-xs sm:text-sm font-suisse text-white/60">
            {CONSTANTS.UI_LABELS.SPIN_DESCRIPTION}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <RewardSpinner
            rewards={box.rewards}
            disabled={box.status !== CONSTANTS.BOX_STATUS.OPEN}
            ctaLabel={box.status === CONSTANTS.BOX_STATUS.OPEN 
              ? `${CONSTANTS.UI_LABELS.OPEN_BOX} - ${formatPrice(box.price)}` 
              : CONSTANTS.UI_LABELS.COMING_SOON}
            experience={box.experience}
            onButtonClick={handleBoxOpen}
            onItemClick={handleItemClick}
            onSpin={handleSpin}
            onAnimationComplete={handleAnimationComplete}
            onItemProcessed={handleItemProcessed}
            onDialogClose={handleDialogClose}
            className="w-full"
            showSpeedControls={true}
            defaultSpeed="1x"
            showTryForFree={box.status === CONSTANTS.BOX_STATUS.OPEN}
            tryForFreeLabel={CONSTANTS.UI_LABELS.TRY_FOR_FREE}
            onTryForFree={handleTryForFree}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border-white/15 bg-white/5">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl font-pricedown text-white">
              {CONSTANTS.UI_LABELS.BOX_INFORMATION}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 pt-0">
            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row">
              <div className="relative mx-auto h-64 sm:h-80 w-full max-w-sm sm:max-w-2xl overflow-hidden rounded-2xl lg:mx-0 lg:w-96">
                <Image
                  src={box.heroImage}
                  alt={box.title}
                  fill
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 400px, 400px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  style={{ boxShadow: `inset 0 0 60px ${box.color}40` }}
                />
              </div>

              <div className="flex flex-1 flex-col items-center justify-center gap-3 sm:gap-4 text-center lg:items-start lg:text-left">
                <div className="flex items-center justify-center gap-1 lg:justify-start">
                  {Array.from({ length: CONSTANTS.RATING_STARS }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5",
                        idx < box.star ? "fill-current text-white" : "text-white/20"
                      )}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-start">
                  <Badge
                    variant="outline"
                    className="border-white/30 bg-white/10 font-suisse text-xs sm:text-sm uppercase tracking-wider text-white"
                  >
                    {box.tag}
                  </Badge>
                  <span
                    className={cn(
                      "rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold uppercase",
                      box.status === "OPEN"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-200"
                    )}
                  >
                    {box.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-base sm:text-lg font-pricedown text-white break-words">{box.title.replace('\n', ' ')}</p>
                  <p className="text-xs sm:text-sm font-suisse text-white/60">{CONSTANTS.UI_LABELS.MYSTERY_BOX}{box.location}</p>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-white/80 font-suisse leading-relaxed">
              {box.description}
            </p>

            <Separator className="bg-white/10" />

            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-suisse text-white/50">Entry Price</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-pricedown text-white">{formatPrice(box.price)}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-suisse text-white/50">Win Odds</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-pricedown text-white">{box.percentage}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-suisse text-white/50">{CONSTANTS.UI_LABELS.EXPERIENCE}</p>
                <p className="text-base sm:text-lg lg:text-xl font-pricedown text-white">+{box.experience.toLocaleString()} XP</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-suisse text-white/50">{CONSTANTS.UI_LABELS.LOCATION}</p>
                <p className="text-base sm:text-lg lg:text-xl font-pricedown text-white">{box.location}</p>
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-suisse text-white/50">{CONSTANTS.UI_LABELS.SHIPPING_INFO}</p>
              <p className="text-sm sm:text-base text-white/80 font-suisse">{box.shippingInfo}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/15 bg-white/5">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-pricedown text-white">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              {CONSTANTS.UI_LABELS.BOX_STATISTICS}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {box.stats.map((stat, index) => (
                <div key={index} className="text-center space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-center">
                    {index === 0 && <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" />}
                    {index === 1 && <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" />}
                    {index === 2 && <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" />}
                    {index === 3 && <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" />}
                  </div>
                  <p className="text-xs sm:text-sm font-suisse text-white/50">{stat.label}</p>
                  <p className="text-sm sm:text-base lg:text-lg font-pricedown text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Items Section */}
      <Card className="border-white/15 bg-white/5">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl font-pricedown text-white">
            {CONSTANTS.UI_LABELS.ALL_ITEMS}
          </CardTitle>
          <p className="text-xs sm:text-sm font-suisse text-white/60">
            {CONSTANTS.UI_LABELS.ALL_ITEMS_DESC}
          </p>
        </CardHeader>
        <CardContent className="pt-0 overflow-hidden">
          {box.rewards && box.rewards.length > 0 ? (
            <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
              {box.rewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Package className="h-8 w-8 sm:h-12 sm:w-12 text-white/40 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-white/60">{CONSTANTS.UI_LABELS.NO_ITEMS}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>

    {/* Authentication Dialog */}
    <AuthDialogs
      isOpen={showAuthDialog}
      onClose={() => setShowAuthDialog(false)}
      defaultTab="login"
    />

    {/* Item Action Dialog */}
    <ItemActionDialog
      isOpen={showItemActionDialog}
      onClose={() => {
        setShowItemActionDialog(false)
        setSelectedItem(null)
      }}
      item={selectedItem}
      onSell={handleSellItem}
      onKeep={handleKeepItem}
      isProcessing={isProcessingItem}
    />
    </>
  )
}

export default BoxDetail
