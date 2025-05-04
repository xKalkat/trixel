import { maybeUpdateBestScore } from "./storage.js";
import { updateScore } from "./storage.js";
import { commitChanges } from "./storage.js";
import { showControlsOverlay } from "./overlay.js";
import { hiddenRows } from "./constants.js";
import { gameState } from "./gameState.js";
import { playerReset } from "./player.js";
import { initializePieceBag } from "./pieces.js";

/**
 * Merges the active piece into the arena.
 * Updates the arena with the piece's cells.
 * If any block is above the red line, triggers a game over.
 *
 * @param {number[][]} arena - The game arena.
 * @param {{ matrix: number[][], pos: { x: number, y: number } }} player - The player object.
 */
export function merge(arena, player) {
  let triggeredGameOver = false;

  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const arenaY = y + player.pos.y;
        arena[arenaY][x + player.pos.x] = value;

        if (arenaY < hiddenRows + 3) {
          triggeredGameOver = true;
        }
      }
    });
  });

  if (triggeredGameOver) {
    gameOverReset();
    maybeUpdateBestScore();
    updateScore();
  }
}

/**
 * Resets the game state after a game over.
 * Clears the arena, resets score and timers, and spawns a new piece.
 */
export function gameOverReset() {
  console.log("Game Over! Resetting game state.");
  gameState.arena.forEach((row) => row.fill(0));
  gameState.score = 0;
  gameState.isTouchingGround = false;
  gameState.lockTimer = 0;
  gameState.heldPiece = null;
  commitChanges();
  playerReset();
  initializePieceBag();
  showControlsOverlay(true, 1000);
}
