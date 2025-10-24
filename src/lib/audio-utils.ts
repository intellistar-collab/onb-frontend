/**
 * Audio utility functions for playing sounds
 */

// Track active audio instances for control
const activeAudioInstances: Map<string, HTMLAudioElement> = new Map();

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
 * Play the login success sound
 */
export const playLoginSuccessSound = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    const audio = new Audio('/audio/login_success.mp3');
    audio.volume = 0.7; // Set volume to 70%
    audio.play().catch((error) => {
      console.warn('Could not play login success sound:', error);
    });
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
    
    const audio = new Audio('/audio/purchase_box.mp3');
    audio.volume = 0.8; // Set volume to 80%
    audio.play().catch((error) => {
      console.warn('Could not play purchase box sound:', error);
    });
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
    
    const audio = new Audio('/audio/reveal_box_prize.mp3');
    audio.volume = 0.9; // Set volume to 90% for excitement
    audio.play().catch((error) => {
      console.warn('Could not play reveal box prize sound:', error);
    });
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
    
    const audio = new Audio('/audio/visit_account.mp3');
    audio.volume = 0.6; // Set volume to 60%
    audio.play().catch((error) => {
      console.warn('Could not play visit account sound:', error);
    });
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
    
    const audio = new Audio('/audio/login_success.mp3');
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch((error) => {
      console.warn('Could not play success sound:', error);
    });
  } catch (error) {
    console.warn('Error creating audio element:', error);
  }
};
