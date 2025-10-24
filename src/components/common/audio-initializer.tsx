"use client";

import { useEffect } from "react";
import { initializeAudio } from "@/lib/audio-utils";

/**
 * Component to initialize the audio system
 * This should be included in the root layout to ensure audio is ready
 */
export default function AudioInitializer() {
  useEffect(() => {
    // Initialize audio system when component mounts
    initializeAudio();
  }, []);

  // This component doesn't render anything
  return null;
}

