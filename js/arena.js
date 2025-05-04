import { gameState } from "./gameState.js";
import { SCORE } from "./constants.js";
/**
 * Checks for a collision between a player's piece and the arena.
 * Returns true if any part of the piece overlaps with filled cells in the arena,
 * or goes out of bounds.
 *
 * @param {number[][]} arena - The game arena grid.
 * @param {{ matrix: number[][], pos: { x: number, y: number } }} player - The player object.
 * @returns {boolean} Whether a collision occurs.
 */
export function collide(arena, player) {
  const m = player.matrix;
  const o = player.pos;

  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Clears any full rows in the arena and shifts everything above downward.
 * Updates the score based on the number of lines cleared.
 * Uses the classic Tetris mechanic of checking from the bottom up.
 */
export function arenaSweep() {
  let linesCleared = 0;

  outer: for (let y = gameState.arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < gameState.arena[y].length; ++x) {
      if (gameState.arena[y][x] === 0) {
        continue outer;
      }
    }
    const row = gameState.arena.splice(y, 1)[0].fill(0);
    gameState.arena.unshift(row);
    ++y;
    linesCleared++;
  }

  if (linesCleared > 0) {
    gameState.score += linesCleared * SCORE.LINECLEAR;
  }
}

/**
 * Temporarily moves the player's piece down by 1 to test if it would collide.
 * This is used to check whether the piece is currently on solid ground.
 *
 * @returns {boolean} True if the piece is grounded and cannot move further down.
 */
export function isGrounded() {
  gameState.player.pos.y++;
  const grounded = collide(gameState.arena, gameState.player);
  gameState.player.pos.y--;
  return grounded;
}
