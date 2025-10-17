"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import type { BoxReward } from "@/constant/box-data";
import { DollarSign, Package, Loader2 } from "lucide-react";
import SmartImage from "./loading-image";

interface ItemActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: BoxReward | null;
  onSell: (item: BoxReward) => Promise<void>;
  onKeep: (item: BoxReward) => Promise<void>;
  isProcessing?: boolean;
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

export default function ItemActionDialog({
  isOpen,
  onClose,
  item,
  onSell,
  onKeep,
  isProcessing = false,
}: ItemActionDialogProps) {
  const [imagePreloaded, setImagePreloaded] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [isKeeping, setIsKeeping] = useState(false);

  // Preload the image when dialog opens
  React.useEffect(() => {
    if (item?.image && isOpen && !imagePreloaded) {
      const img = new window.Image();
      img.onload = () => setImagePreloaded(true);
      img.src = item.image;
    }
  }, [item?.image, isOpen, imagePreloaded]);

  if (!item) return null;

  const handleSell = async () => {
    setIsSelling(true);
    try {
      await onSell(item);
    } finally {
      setIsSelling(false);
    }
  };

  const handleKeep = async () => {
    setIsKeeping(true);
    try {
      await onKeep(item);
    } finally {
      setIsKeeping(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-gradient-to-br from-gray-900 via-black to-gray-900 border-white/15">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-xl font-pricedown">
            {item.name}
          </DialogTitle>
          <DialogDescription className="text-white/70 text-center font-suisse">
            What would you like to do with this item?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Item Image */}
          <div className="relative w-40 h-40 mx-auto overflow-hidden rounded-lg border-2 bg-white/5"
               style={{ borderColor: getTierBorderColor(item.tier) }}>
            {!imagePreloaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
              </div>
            ) : null}
            <SmartImage
              src={item.image}
              alt={item.name}
              fill
              sizes="160px"
              className="object-contain"
              priority={true}
              preloaded={imagePreloaded}
            />
          </div>
          
          {/* Item Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge 
                className={cn(
                  "text-xs font-bold uppercase tracking-wider bg-gradient-to-r",
                  getTierColor(item.tier)
                )}
              >
                {item.tier}
              </Badge>
              <span className="text-base font-bold text-amber-400 font-pricedown">{formatPrice(item.price)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Sell Button */}
            <Button
              onClick={handleSell}
              disabled={isSelling || isKeeping}
              className="h-10 flex items-center px-4 bg-black hover:bg-gray-800 text-white font-pricedown font-bold border border-gray-600 hover:border-gray-500 transition-all duration-300"
            >
              {isSelling ? (
                <Loader2 className="h-8 w-8 animate-spin text-green-400" />
              ) : (
                <>
                  <DollarSign className="h-8 w-8 text-green-400" />
                  <span className="text-2xl">SELL</span>
                </>
              )}
            </Button>

            {/* Keep Button */}
            <Button
              onClick={handleKeep}
              disabled={isSelling || isKeeping}
              className="h-10 flex items-center px-4 bg-gray-800 hover:bg-gray-700 text-white font-pricedown font-bold border border-gray-600 hover:border-gray-500 transition-all duration-300"
            >
              {isKeeping ? (
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              ) : (
                <>
                  <Package className="h-8 w-8 text-blue-400" />
                  <span className="text-2xl">KEEP</span>
                </>
              )}
            </Button>
          </div>

          {/* Description */}
          <div className="text-center text-xs text-white/60 space-y-1 font-suisse">
            <p>
              <strong className="text-white">Sell:</strong> Add {formatPrice(item.price)} to your wallet
            </p>
            <p>
              <strong className="text-white">Keep:</strong> Add to your inventory for later
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
