import { gameState } from "./gameState.js";
import { playerReset } from "./player.js";
/**
 * Saves the current game state to localStorage under 'trixelGameState'.
 */
export function saveGameState() {
  localStorage.setItem("trixelGameState", JSON.stringify(gameState));
}

/**
 * Attempts to load saved game state from localStorage.
 * If valid, restores arena, player position, and score.
 * Returns whether a game was in progress.
 *
 * @returns {boolean} Whether a valid game state was loaded.
 */
export function loadGameState() {
  const state = JSON.parse(localStorage.getItem("trixelGameState"));

  if (!state || !state.player || !state.player.matrix) {
    playerReset();
    return false;
  }

  const arenaHasBlocks = state.arena?.some((row) =>
    row.some((cell) => cell !== 0),
  );
  const hasValidPlayerMatrix =
    Array.isArray(state.player.matrix) && state.player.matrix.length > 0;

  const gameInProgress = arenaHasBlocks && hasValidPlayerMatrix;

  for (let y = 0; y < gameState.arena.length; y++) {
    for (let x = 0; x < gameState.arena[y].length; x++) {
      gameState.arena[y][x] = state.arena[y][x];
    }
  }

  gameState.player.pos = { ...state.player.pos };
  gameState.player.matrix = state.player.matrix.map((row) => [...row]);

  gameState.score = state.score;
  gameState.pieceBag = [...state.pieceBag];
  gameState.isTouchingGround = state.isTouchingGround;
  gameState.lockTimer = state.lockTimer;

  updateScore();

  return gameInProgress;
}

/**
 * Compares current score with best score and updates if higher.
 * Saves new best score to localStorage.
 */
export function maybeUpdateBestScore() {
  if (gameState.score > gameState.bestScore) {
    gameState.bestScore = gameState.score;
    localStorage.setItem("bestScore", gameState.bestScore);
  }
}

/**
 * Updates the score and best score elements in the UI.
 */

export function updateScore() {
  document.getElementById("score").textContent = `${gameState.score}`;
  document.getElementById("best-score").textContent =
    `Best Score: ${gameState.bestScore}`;
}

/**
 * Helper function to update the UI and save the game state.
 * Ensures that score, best score, and arena state are synced.
 */
export function commitChanges() {
  maybeUpdateBestScore();
  updateScore();
  saveGameState();
}
