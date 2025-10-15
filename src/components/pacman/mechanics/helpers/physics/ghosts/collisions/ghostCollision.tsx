import axios from "axios";
import Graphics from "../../../graphics/graphics";
import playGame from "../../../../playGame";
import { isAuthenticated, authClient } from "../../../../../../../lib/auth-client";
import { submitPacmanScore } from "../../../../../../../lib/api/pacman";
import { createRoot } from "react-dom/client";
import React from "react";
import GameOver from "../../../../../game-over";
// Simple toast notification function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  console.log('Showing toast:', message, type);
  
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid;
    transition: all 0.3s ease;
    transform: translateX(100%);
    max-width: 300px;
    ${type === 'success' 
      ? 'background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); color: #10b981;' 
      : 'background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); color: #ef4444;'
    }
  `;
  
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <div style="width: 16px; height: 16px; flex-shrink: 0;">
        ${type === 'success' 
          ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 7h2v6h-2V7m0 8h2v2h-2v-2M1 21h22L12 2L1 21Z"/></svg>'
        }
      </div>
      <span style="font-size: 14px; font-weight: 500;">${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 4 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
};

export default class GhostCollision {
  static collisionConditional(ghost: any, pacman: any) {
    return (
      ghost.position.y - ghost.radius <= pacman.position.y + pacman.radius &&
      ghost.position.y + ghost.radius >= pacman.position.y - pacman.radius &&
      ghost.position.x + ghost.radius >= pacman.position.x - pacman.radius &&
      ghost.position.x - ghost.radius <= pacman.position.x + pacman.radius
    );
  }

  static dealWithCollision(ghost: any, assets: any, variables: any, ctx: CanvasRenderingContext2D) {
    if (!ghost.isScared && !ghost.isRetreating) {
      assets.characters.pacman.radians = Math.PI / 4;
      cancelAnimationFrame(variables.animationId);
      assets.audioPlayer.stopGhostAudio();
      assets.audioPlayer.playPacmanDeath();
      assets.characters.pacman.isShrinking = true;
      Graphics.runDeathAnimation(variables, ctx, assets);
    } else if (ghost.isScared) {
      variables.score += 200 * Math.pow(2, variables.killCount);
      variables.killCount++;
      ghost.changeRetreatingState();
      ghost.retreatingTimer.start();
      ghost.changeScaredState();
      ghost.assignSprite();
      ghost.checkSpeedMatchesState();
    }
  }

  static checkPacmanLives(
    assets: any,
    variables: any,
    ctx: CanvasRenderingContext2D,
    endGame = GhostCollision.endGame,
    resetAfterDeath = GhostCollision.resetAfterDeath
  ) {
    if (assets.characters.pacman.lives <= 0) {
      endGame(variables, assets, ctx);
    } else {
      assets.characters.pacman.lives--;
      resetAfterDeath(assets, variables);
    }
  }

  static async endGame(
    variables: any,
    assets: any,
    ctx: CanvasRenderingContext2D,
    saveScore = GhostCollision.saveScore,
    resetAfterGameOver = GhostCollision.resetAfterGameOver
  ) {
    cancelAnimationFrame(variables.animationId);

    resetAfterGameOver(assets, variables);

    // 🎯 Show game over screen using React component
    const gameOverContainer = document.getElementById("game-over-root") || (() => {
      const div = document.createElement("div");
      div.id = "game-over-root";
      document.body.appendChild(div);
      return div;
    })();

    // Check if user is logged in using the auth client
    const isLoggedIn = await isAuthenticated();
    console.log('Game Over - isLoggedIn:', isLoggedIn);
    
    let username = 'User';
    let userId = null;
    
    if (isLoggedIn) {
      try {
        // Get user data from better-auth session
        const session = await authClient.getSession();
        console.log('Game Over - session:', session);
        
        if (session.data?.user) {
          const userData = session.data.user as any;
          console.log('Game Over - userData:', userData);
          
          username = userData.username || userData.name || userData.email || 'User';
          userId = userData.id;
          
          console.log('Game Over - extracted username:', username, 'userId:', userId);
        }
      } catch (error) {
        console.error('Failed to get user data from session:', error);
        
        // Fallback: try to get from localStorage if session fails
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            username = userData.username || userData.name || userData.email || 'User';
            userId = userData.id || userData.userId;
            console.log('Game Over - fallback from localStorage:', { username, userId });
          }
        } catch (fallbackError) {
          console.error('Failed to get user data from localStorage:', fallbackError);
        }
      }
    }

    // Automatically submit score if user is logged in
    if (isLoggedIn && userId) {
      try {
        console.log('Auto-submitting score:', { userId, score: variables.score });
        const result = await submitPacmanScore({
          userId: userId,
          score: variables.score,
        });
        
        console.log('Auto score submission result:', result);
        
        if (result.success) {
          showToast(`Score of ${variables.score} automatically saved!`, 'success');
        } else {
          showToast(result.message || 'Failed to save score.', 'error');
        }
      } catch (error) {
        console.error('Error auto-submitting score:', error);
        showToast('Error saving score.', 'error');
      }
    }

    // Create React root and render GameOver component
    const root = createRoot(gameOverContainer);
    root.render(
      React.createElement(GameOver, {
        score: variables.score,
        level: variables.level || 1,
        userId: userId,
        username: username,
        isLoggedIn: isLoggedIn,
        onPlayAgain: () => {
          root.unmount();
          gameOverContainer.remove();
          // Reset game and make it ready to play
          variables.start = true;
          variables.score = 0;
          variables.level = 1;
          variables.lastKeyPressed = "";
          variables.gameStarted = false;
          // Reset game state to be ready for immediate play
          variables.isPaused = false;
          variables.lives = 3; // Reset lives
          // Restart the game
          playGame(variables.player, variables.reactRoot);
        },
        onQuit: () => {
          root.unmount();
          gameOverContainer.remove();
          
          // Dispatch custom event to quit the game (return to preview)
          const quitEvent = new CustomEvent('gameQuit', {
            detail: { reason: 'userQuit' }
          });
          window.dispatchEvent(quitEvent);
        },
        onSignIn: () => {
          window.location.href = '/login';
        },
        onClose: () => {
          root.unmount();
          gameOverContainer.remove();
          
          // Dispatch custom event to quit the game (return to preview)
          const quitEvent = new CustomEvent('gameQuit', {
            detail: { reason: 'userClose' }
          });
          window.dispatchEvent(quitEvent);
        }
      })
    );
  }

  static async saveScore(
    variables: any,
    getBackendUrl = GhostCollision.getBackendUrl
  ) {
    const data = {
      username: variables.player.username,
      score: variables.score,
    };
    try {
      const res = await axios.post(
        getBackendUrl(process.env.NEXT_PUBLIC_API_URL),
        data,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return `Success: ${res.data.message}`;
        } catch (err: any) {
          return `Error: ${err.response?.data?.message || err.message}`;
        }
  }

  static getBackendUrl(reactAppUrl: any) {
    let url;
    if (reactAppUrl) {
      url = `${reactAppUrl}/scores`;
    } else {
      url = "http://localhost:8080/scores";
    }
    return url;
  }

  static resetAfterGameOver(assets: any, variables: any) {
    assets.props.pellets.forEach((pellet: any) => {
      if (pellet.hasBeenEaten) pellet.changeEatenState();
    });
    assets.props.powerUps.forEach((powerUp: any) => {
      if (powerUp.hasBeenEaten) powerUp.changeEatenState();
    });
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();
    assets.timers.scaredTimer.duration = 7000;

    // Apply reset with delay for each ghost
    Object.values(assets.characters.ghosts).forEach((ghost: any, index: number) => {
      ghost.reset(index);
    });

    assets.characters.pacman.reset();
    assets.characters.pacman.lives = 2;
    variables.lastKeyPressed = "";
    variables.level = 1;
    window.removeEventListener("keydown", variables.directionEventListener);
    window.removeEventListener(
      "visibilitychange",
      variables.visibilityEventListener
    );
    window.removeEventListener("keydown", variables.pauseEventListener);
  }

  static resetAfterDeath(assets: any, variables: any, callbackOne = playGame) {
    // Store the last direction before reset
    const lastDirection = variables.lastKeyPressed;
    
    // Reset pacman first
    assets.characters.pacman.reset();
    
    // Don't reset lastKeyPressed - keep the direction for better UX
    // variables.lastKeyPressed = "";
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();

    // Apply reset with delay for each ghost
    Object.values(assets.characters.ghosts).forEach((ghost: any, index: number) => {
      ghost.reset(index); // Pass index for delayed release
    });

    assets.timers.cycleTimer.start();
    assets.audioPlayer.ghostAudioWantsToPlay = true;
    
    // Restore the last direction immediately after reset
    if (lastDirection) {
      variables.lastKeyPressed = lastDirection;
      console.log("Restored last direction after death:", lastDirection);
      
      // Let the game's physics system handle the movement
      // The PacmanManager.changeDirection will be called in the next frame
      // and will apply the correct velocity based on lastKeyPressed
    }
    
    callbackOne(variables.player, variables.reactRoot);
  }
}
