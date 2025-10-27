"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { playLoginSuccessSound } from "@/lib/audio-utils";

/**
 * Component to handle login success audio after page load
 * This ensures audio plays after the page is fully rendered
 */
export default function LoginSuccessAudio() {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const loginSuccess = searchParams.get('loginSuccess');
    if (loginSuccess === 'true') {
      console.log('LoginSuccessAudio: Detected login success parameter');
      
      // Wait for page to be fully loaded and rendered
      const playAudio = () => {
        console.log('LoginSuccessAudio: Playing audio after page load');
        
        try {
          // Enable audio interaction first
          document.dispatchEvent(new CustomEvent('audio-enabled'));
          document.body.setAttribute('data-audio-enabled', 'true');
          
          // Small delay to ensure all components are mounted
          setTimeout(() => {
            console.log('LoginSuccessAudio: Calling playLoginSuccessSound');
            playLoginSuccessSound();
          }, 300);
        } catch (error) {
          console.warn('LoginSuccessAudio: Error playing audio:', error);
        }
      };

      // Check if page is already loaded
      if (document.readyState === 'complete') {
        playAudio();
      } else {
        // Wait for page to finish loading
        window.addEventListener('load', playAudio, { once: true });
      }
      
      // Clean up URL by removing the parameter
      try {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('loginSuccess');
        window.history.replaceState({}, '', newUrl.toString());
      } catch (error) {
        console.warn('LoginSuccessAudio: Error cleaning URL:', error);
      }
    }
  }, [searchParams, isClient]);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  // This component doesn't render anything
  return null;
}
