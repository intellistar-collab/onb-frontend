import axios from "axios";
import Graphics from "../../../graphics/graphics";
import playGame from "../../../../playGame";
import { isAuthenticated } from "../../../../../../../lib/auth-client";
import { submitPacmanScore } from "../../../../../../../lib/api/pacman";

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

    if (variables.player) await saveScore(variables);
    resetAfterGameOver(assets, variables);

    // 🎯 Show game over message
    const gameOverContainer =
      document.getElementById("game-over-root") ||
      (() => {
        const div = document.createElement("div");
        div.id = "game-over-root";
        div.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          color: white;
          font-family: 'Oswald', sans-serif;
        `;
        document.body.appendChild(div);
        return div;
      })();

    // Check if user is logged in using the auth client
    const isLoggedIn = await isAuthenticated();
    const userData = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : {};
    const username = userData.username || userData.email || 'User';
    
    // Create buttons based on login status
    const buttonsHtml = isLoggedIn 
      ? `
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
          <button onclick="window.location.reload()" style="
            padding: 1rem 2rem;
            font-size: 1.2rem;
            background: #47761E;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Oswald', sans-serif;
            transition: background 0.3s;
          " onmouseover="this.style.background='#5a8a2a'" onmouseout="this.style.background='#47761E'">Play Again</button>
          <button onclick="submitScore()" style="
            padding: 1rem 2rem;
            font-size: 1.2rem;
            background: #FFDD00;
            color: #000;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Oswald', sans-serif;
            font-weight: bold;
            transition: background 0.3s;
          " onmouseover="this.style.background='#FFE55C'" onmouseout="this.style.background='#FFDD00'">Submit Score</button>
        </div>
      `
      : `
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
          <button onclick="window.location.reload()" style="
            padding: 1rem 2rem;
            font-size: 1.2rem;
            background: #47761E;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Oswald', sans-serif;
            transition: background 0.3s;
          " onmouseover="this.style.background='#5a8a2a'" onmouseout="this.style.background='#47761E'">Play Again</button>
          <button onclick="window.location.href='/login'" style="
            padding: 1rem 2rem;
            font-size: 1.2rem;
            background: #FF6B6B;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Oswald', sans-serif;
            font-weight: bold;
            transition: background 0.3s;
          " onmouseover="this.style.background='#FF5252'" onmouseout="this.style.background='#FF6B6B'">Sign In to Save Score</button>
        </div>
      `;

    gameOverContainer.innerHTML = `
      <h1 style="font-size: 3rem; margin-bottom: 1rem; color: #FFDD00;">GAME OVER</h1>
      <p style="font-size: 1.5rem; margin-bottom: 2rem;">Final Score: $${variables.score}</p>
      ${buttonsHtml}
      ${isLoggedIn ? `<p style="font-size: 0.9rem; margin-top: 1rem; color: #ccc;">Score automatically saved for ${username}</p>` : ''}
    `;

    // Add submitScore function to window if user is logged in
    if (isLoggedIn) {
      (window as any).submitScore = async () => {
        try {
          const result = await submitPacmanScore({
            username: username,
            points: variables.score,
            level: variables.level || 1,
          });
          
          if (result.success) {
            alert('Score submitted successfully!');
          } else {
            alert(result.message || 'Failed to submit score. Please try again.');
          }
        } catch (error) {
          console.error('Error submitting score:', error);
          alert('Error submitting score. Please try again.');
        }
      };
    }
  }

  static async saveScore(
    variables: any,
    getBackendUrl = GhostCollision.getBackendUrl
  ) {
    const data = {
      username: variables.player.username,
      points: variables.score,
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
    assets.characters.pacman.reset();
    variables.lastKeyPressed = "";
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();

        // Apply reset with delay for each ghost
        Object.values(assets.characters.ghosts).forEach((ghost: any, index: number) => {
          ghost.reset(index); // Pass index for delayed release
        });

    assets.timers.cycleTimer.start();
    assets.audioPlayer.ghostAudioWantsToPlay = true;
    callbackOne(variables.player, variables.reactRoot);
  }
}
