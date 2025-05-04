import { gameState } from "./gameState.js";
import {
  playerMove,
  playerDrop,
  playerRotateWrapper,
  playerReset,
} from "./player.js";
import { collide, arenaSweep } from "./arena.js";
import { merge } from "./playerState.js";
import { commitChanges, saveGameState } from "./storage.js";
import { SCORE } from "./constants.js";
import { KEY } from "./config.js";
import { holdPiece } from "./player.js";

/**
 * Determines if the provided key matches a bound key or one of multiple keys.
 *
 * @param {string[]|string} keys - The key(s) to check against.
 * @param {string} key - The actual key pressed.
 * @returns {boolean} True if the key matches.
 */
export function isKeyPressed(keys, key) {
  const normalizedKey = key.toLowerCase();
  if (Array.isArray(keys)) {
    return keys.some((k) => k.toLowerCase() === normalizedKey);
  }
  return keys.toLowerCase() === normalizedKey;
}

/**
 * Attaches keyboard listeners for gameplay input.
 * Handles movement, rotation, hard/soft drops, and ghost toggle.
 * Also handles keyup behavior for movement and soft drop.
 */
export function setupControls() {
  document.addEventListener("keydown", (event) => {
    if (gameState.isPaused) return;

    const overlay = document.getElementById("controls-overlay");
    if (overlay && overlay.style.display !== "none") {
      overlay.style.display = "none";
    }

    const key = event.key;

    if (isKeyPressed(KEY.LEFT, key)) {
      playerMove(-1);
      gameState.moveDirection = -1;
      gameState.moveHeld = true;
      gameState.dasTimer = 0;
      gameState.moveTimer = 0;
      saveGameState();
    } else if (isKeyPressed(KEY.RIGHT, key)) {
      playerMove(1);
      gameState.moveDirection = 1;
      gameState.moveHeld = true;
      gameState.dasTimer = 0;
      gameState.moveTimer = 0;
      saveGameState();
    } else if (isKeyPressed(KEY.DOWN, key)) {
      gameState.downHeld = true;
      gameState.downTimer = 0;
      playerDrop();
      commitChanges();
    } else if (isKeyPressed(KEY.ROTATE, key)) {
      playerRotateWrapper();
      saveGameState();
    } else if (isKeyPressed(KEY.HARD_DROP, key)) {
      while (!collide(gameState.arena, gameState.player)) {
        gameState.player.pos.y++;
        gameState.score += SCORE.HARDDROP;
      }
      gameState.player.pos.y--;
      merge(gameState.arena, gameState.player);
      playerReset();
      arenaSweep();
      commitChanges();
    } else if (isKeyPressed(KEY.TOGGLE_GHOST, key)) {
      gameState.showGhost = !gameState.showGhost;
    } else if (isKeyPressed(KEY.HOLD, key)) {
      console.log("Hold key pressed");
      holdPiece();
      console.log("Hold piece:", gameState.heldPiece);
      saveGameState();
    }
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key;
    if (isKeyPressed(KEY.LEFT, key) || isKeyPressed(KEY.RIGHT, key)) {
      gameState.moveHeld = false;
      gameState.moveDirection = 0;
      gameState.dasTimer = 0;
      gameState.moveTimer = 0;
    }
    if (isKeyPressed(KEY.DOWN, key)) {
      gameState.downHeld = false;
      gameState.downTimer = 0;
    }
  });
}
