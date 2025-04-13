import { gameState } from "./gameState.js";
import { isGrounded } from "./arena.js";
import { draw } from "./renderer.js";
import { playerDrop } from "./player.js";
import { saveGameState } from "./storage.js";
import { merge } from "./playerState.js";
import { playerReset } from "./player.js";
import { arenaSweep } from "./arena.js";
import { commitChanges } from "./storage.js";
import { SCORE } from "./constants.js";
import { instantLockThreshold } from "./constants.js";
import { playerMove } from "./player.js";

/**
 * Handles repeated downward movement of the piece during soft drop.
 * If the piece is grounded for too long, it locks it in place and spawns a new one.
 *
 * @param {number} deltaTime - Time since last frame in milliseconds.
 */
export function updateSoftDrop(deltaTime) {
  gameState.downTimer += deltaTime;

  if (
    gameState.isTouchingGround &&
    isGrounded(gameState.arena, gameState.player) &&
    gameState.lockTimer > instantLockThreshold
  ) {
    merge(gameState.arena, gameState.player);
    playerReset();
    arenaSweep();
    commitChanges();
    gameState.isTouchingGround = false;
    gameState.lockTimer = 0;
    gameState.downTimer = 0;
  } else if (gameState.downTimer > gameState.downInterval) {
    playerDrop();
    gameState.score += SCORE.DROP;
    gameState.downTimer = 0;
    commitChanges();
  }
}

/**
 * Triggers automatic piece drop at regular intervals.
 * Resets drop counter and saves the game state after drop.
 *
 * @param {number} deltaTime - Time since last frame in milliseconds.
 */
export function checkAutoDrop(deltaTime) {
  gameState.dropCounter += deltaTime;
  if (gameState.dropCounter > gameState.dropInterval) {
    playerDrop();
    saveGameState();
  }
}

/**
 * Handles the lock delay logic for a piece that is grounded.
 * If the piece remains grounded beyond the lock delay, it locks and triggers a reset.
 *
 * @param {number} deltaTime - Time since last frame in milliseconds.
 */
export function checkLockDelay(deltaTime) {
  const grounded = isGrounded(gameState.arena, gameState.player);

  if (grounded && !gameState.isTouchingGround) {
    gameState.isTouchingGround = true;
    gameState.lockTimer = 0;
  } else if (!grounded && gameState.isTouchingGround) {
    gameState.isTouchingGround = false;
    gameState.lockTimer = 0;
  }

  if (gameState.isTouchingGround) {
    gameState.lockTimer += deltaTime;
    if (
      gameState.lockTimer > gameState.lockDelay &&
      isGrounded(gameState.arena, gameState.player)
    ) {
      merge(gameState.arena, gameState.player);
      playerReset();
      arenaSweep();
      commitChanges();
      gameState.isTouchingGround = false;
      gameState.lockTimer = 0;
    }
  }
}

/**
 * Main game loop function.
 * Handles timing logic for dropping, locking, DAS movement, and rendering.
 * Uses requestAnimationFrame for smooth updates.
 *
 * @param {DOMHighResTimeStamp} [time=0] - The timestamp of the current frame.
 */
export function update(time = 0) {
  if (gameState.isPaused) {
    requestAnimationFrame(update);
    return;
  }

  const deltaTime = time - gameState.lastTime;
  gameState.lastTime = time;

  checkAutoDrop(deltaTime);
  checkLockDelay(deltaTime);

  if (gameState.moveHeld) {
    gameState.dasTimer += deltaTime;
    gameState.moveTimer += deltaTime;
    if (
      gameState.dasTimer > gameState.dasDelay &&
      gameState.moveTimer > gameState.moveInterval
    ) {
      playerMove(gameState.moveDirection);
      gameState.moveTimer = 0;
    }
    saveGameState();
  }

  if (gameState.downHeld) {
    updateSoftDrop(deltaTime);
  }

  draw();
  requestAnimationFrame(update);
}
