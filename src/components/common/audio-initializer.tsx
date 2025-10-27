"use client";

import { useEffect, useState } from "react";
import { initializeAudio } from "@/lib/audio-utils";

/**
 * Component to initialize the audio system
 * This should be included in the root layout to ensure audio is ready
 */
export default function AudioInitializer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    // Initialize audio system when component mounts
    try {
      initializeAudio();
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
    }
  }, []);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  // This component doesn't render anything
  return null;
}

