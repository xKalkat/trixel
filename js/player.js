import { gameState } from "./gameState.js";
import { SCORE, hiddenRows } from "./constants.js";
import { collide } from "./arena.js";
import { isGrounded } from "./arena.js";
import { saveGameState } from "./storage.js";
import { getNextPiece, createPiece } from "./pieces.js";
/**
 * Moves the active piece down by one row.
 * If a collision occurs, it checks for landing and updates lock state.
 * Otherwise, resets lock state if previously touching ground.
 */
export function playerDrop() {
  gameState.player.pos.y++;
  gameState.score += SCORE.DROP;

  if (collide(gameState.arena, gameState.player)) {
    gameState.player.pos.y--;

    if (!gameState.isTouchingGround) {
      gameState.isTouchingGround = true;
      gameState.lockTimer = 0;
    }
  } else {
    if (gameState.isTouchingGround) {
      gameState.isTouchingGround = false;
      gameState.lockTimer = 0;
    }
  }

  gameState.dropCounter = 0;
}

/**
 * Moves the active piece horizontally (left/right).
 * Cancels the move if it would result in a collision.
 *
 * @param {number} dir - Direction to move (-1 for left, 1 for right).
 */
export function playerMove(dir) {
  gameState.player.pos.x += dir;
  if (collide(gameState.arena, gameState.player)) {
    gameState.player.pos.x -= dir;
  }
}

/**
 * Spawns a new piece from the shuffled bag and centers it horizontally.
 * If the new piece immediately collides, it triggers a game over.
 */
export function playerReset() {
  gameState.player.matrix = createPiece(getNextPiece());
  gameState.player.pos.y = 0;
  gameState.player.pos.x =
    Math.floor(gameState.arena[0].length / 2) -
    Math.floor(gameState.player.matrix[0].length / 2);

  if (collide(gameState.arena, gameState.player)) {
    gameOverReset();
  }
}

/**
 * Rotates a piece matrix 90 degrees clockwise.
 * Transposes and then reverses each row.
 *
 * @param {number[][]} matrix - The matrix representing the piece.
 */
export function playerRotate(matrix) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  matrix.forEach((row) => row.reverse());
}

/**
 * Rotates the player's active piece with collision and wall kick logic.
 * Tries horizontal offsets if the rotated piece would collide.
 * Reverts rotation if no valid position is found.
 */
export function playerRotateWrapper() {
  const clonedMatrix = gameState.player.matrix.map((row) => [...row]);
  const originalX = gameState.player.pos.x;

  playerRotate(gameState.player.matrix);

  let offset = 1;
  while (collide(gameState.arena, gameState.player)) {
    gameState.player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));

    if (Math.abs(offset) > gameState.player.matrix[0].length) {
      gameState.player.matrix = clonedMatrix;
      gameState.player.pos.x = originalX;
      return;
    }
  }

  if (isGrounded(gameState.player) && !gameState.isTouchingGround) {
    gameState.isTouchingGround = true;
    gameState.lockTimer = 0;
  }
  saveGameState();
}
