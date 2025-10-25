"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { playLoginSuccessSound } from "@/lib/audio-utils";

/**
 * Component to handle login success audio after page load
 * This ensures audio plays after the page is fully rendered
 */
export default function LoginSuccessAudio() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const loginSuccess = searchParams.get('loginSuccess');
    if (loginSuccess === 'true') {
      console.log('LoginSuccessAudio: Detected login success parameter');
      
      // Wait for page to be fully loaded and rendered
      const playAudio = () => {
        console.log('LoginSuccessAudio: Playing audio after page load');
        
        // Enable audio interaction first
        document.dispatchEvent(new CustomEvent('audio-enabled'));
        document.body.setAttribute('data-audio-enabled', 'true');
        
        // Small delay to ensure all components are mounted
        setTimeout(() => {
          console.log('LoginSuccessAudio: Calling playLoginSuccessSound');
          playLoginSuccessSound();
        }, 300);
      };

      // Check if page is already loaded
      if (document.readyState === 'complete') {
        playAudio();
      } else {
        // Wait for page to finish loading
        window.addEventListener('load', playAudio, { once: true });
      }
      
      // Clean up URL by removing the parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('loginSuccess');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  // This component doesn't render anything
  return null;
}
