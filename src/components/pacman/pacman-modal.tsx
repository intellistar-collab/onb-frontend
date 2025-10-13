"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

// Lazy load Game client-side only
const Game = dynamic(() => import("@/components/pacman").then(mod => ({ default: mod.PacmanGame })), {
  ssr: false,
});

interface PacmanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PacmanModal({ isOpen, onClose }: PacmanModalProps) {
  const { user } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-black border-0">
        <DialogHeader className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="w-full h-full relative">
          <Game player={user} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
