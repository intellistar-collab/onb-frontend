/**
 * Audio utility functions for playing sounds
 */

// Track active audio instances for control
const activeAudioInstances: Map<string, HTMLAudioElement> = new Map();

// Track if user has interacted with the page (required for audio autoplay)
let hasUserInteracted = false;

// Preloaded audio instances
const preloadedAudio: Map<string, HTMLAudioElement> = new Map();

// Initialize user interaction detection
if (typeof window !== 'undefined') {
  const enableAudio = () => {
    hasUserInteracted = true;
    
    // Dispatch custom event to notify components
    document.dispatchEvent(new CustomEvent('audio-enabled'));
    
    // Set body attribute for CSS/styling purposes
    document.body.setAttribute('data-audio-enabled', 'true');
    
    // Remove event listeners after first interaction
    document.removeEventListener('click', enableAudio);
    document.removeEventListener('keydown', enableAudio);
    document.removeEventListener('touchstart', enableAudio);
  };
  
  // Listen for custom audio enable events (from modals, etc.)
  document.addEventListener('audio-enabled', () => {
    hasUserInteracted = true;
  });
  
  document.addEventListener('click', enableAudio);
  document.addEventListener('keydown', enableAudio);
  document.addEventListener('touchstart', enableAudio);
}

/**
 * Stop a specific audio by key
 */
export const stopAudio = (key: string): void => {
  const audio = activeAudioInstances.get(key);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    activeAudioInstances.delete(key);
  }
};

/**
 * Stop all active audio
 */
export const stopAllAudio = (): void => {
  activeAudioInstances.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  activeAudioInstances.clear();
};

/**
 * Preload audio files for better performance
 */
export const preloadAudio = (audioPath: string, key: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const audio = new Audio(audioPath);
    audio.preload = 'auto';
    preloadedAudio.set(key, audio);
  } catch (error) {
    console.warn(`Error preloading audio ${key}:`, error);
  }
};

/**
 * Get or create audio instance
 */
const getAudioInstance = (audioPath: string, key: string): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try to get preloaded audio first
    let audio = preloadedAudio.get(key);
    
    if (!audio) {
      // Create new audio instance
      audio = new Audio(audioPath);
      audio.preload = 'auto';
    }
    
    // Reset audio to beginning
    audio.currentTime = 0;
    
    return audio;
  } catch (error) {
    console.warn(`Error creating audio instance for ${key}:`, error);
    return null;
  }
};

/**
 * Play the login success sound
 */
export const playLoginSuccessSound = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Check if user has interacted with the page
    if (!hasUserInteracted) return;
    
    const audio = getAudioInstance('/audio/login_success.mp3', 'loginSuccess');
    if (!audio) return;
    
    audio.volume = 0.7; // Set volume to 70%
    
    // Try to play the audio
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Could not play login success sound:', error);
      });
    }
  } catch (error) {
    console.warn('Error creating audio element:', error);
  }
};

/**
 * Play the open box sound
 */
export const playOpenBoxSound = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Stop any existing open box sound
    stopAudio('openBox');
    
    const audio = new Audio('/audio/open_box.mp3');
    audio.volume = 0.8; // Set volume to 80%
    
    // Track this audio instance
    activeAudioInstances.set('openBox', audio);
    
    // Clean up when audio ends
    audio.addEventListener('ended', () => {
      activeAudioInstances.delete('openBox');
    });
    
    audio.play().catch((error) => {
      console.warn('Could not play open box sound:', error);
    });
  } catch (error) {
    console.warn('Error creating audio element:', error);
  }
};

/**
 * Stop the open box sound
 */
export const stopOpenBoxSound = (): void => {
  stopAudio('openBox');
};

/**
 * Play the play game sound
 */
export const playGameSound = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    const audio = new Audio('/audio/play_game.mp3');
    audio.volume = 0.8; // Set volume to 80%
    audio.play().catch((error) => {
      console.warn('Could not play game sound:', error);
    });
  } catch (error) {
    console.warn('Error creating audio element:', error);
  }
};

/**
 * Play the purchase box sound
 */
export const playPurchaseBoxSound = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Check if user has interacted with the page
    if (!hasUserInteracted) return;
    
    const audio = getAudioInstance('/audio/purchase_box.mp3', 'purchaseBox');
    if (!audio) return;
    
    audio.volume = 0.8; // Set volume to 80%
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Could not play purchase box sound:', error);
      });
    }
  } catch (error) {
    console.warn('Error creating audio element:', error);
  }
};

/**
 * Play the reveal box prize sound
 */
export const playRevealBoxPrizeSound = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Check if user has interacted with the page
    if (!hasUserInteracted) return;
    
    const audio = getAudioInstance('/audio/reveal_box_prize.mp3', 'revealBoxPrize');
    if (!audio) return;
    
    audio.volume = 0.9; // Set volume to 90% for excitement
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Could not play reveal box prize sound:', error);
      });
    }
  } catch (error) {
    console.warn('Error creating audio element:', error);
  }
};

/**
 * Play the visit account sound
 */
export const playVisitAccountSound = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Check if user has interacted with the page
    if (!hasUserInteracted) return;
    
    const audio = getAudioInstance('/audio/visit_account.mp3', 'visitAccount');
    if (!audio) return;
    
    audio.volume = 0.6; // Set volume to 60%
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Could not play visit account sound:', error);
      });
    }
  } catch (error) {
    console.warn('Error creating audio element:', error);
  }
};

/**
 * Play a generic success sound
 */
export const playSuccessSound = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Check if user has interacted with the page
    if (!hasUserInteracted) return;
    
    const audio = getAudioInstance('/audio/login_success.mp3', 'success');
    if (!audio) return;
    
    audio.volume = 0.5; // Set volume to 50%
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Could not play success sound:', error);
      });
    }
  } catch (error) {
    console.warn('Error creating audio element:', error);
  }
};

/**
 * Initialize audio system and preload important sounds
 */
export const initializeAudio = (): void => {
  if (typeof window === 'undefined') return;
  
  // Preload important audio files
  preloadAudio('/audio/login_success.mp3', 'loginSuccess');
  preloadAudio('/audio/open_box.mp3', 'openBox');
  preloadAudio('/audio/purchase_box.mp3', 'purchaseBox');
  preloadAudio('/audio/reveal_box_prize.mp3', 'revealBoxPrize');
};
