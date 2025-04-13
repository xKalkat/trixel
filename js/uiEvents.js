import { gameState } from "./gameState.js";
import { update } from "./updateLoop.js";
import { playerReset } from "./player.js";
import { gameOverReset } from "./playerState.js";
import { showControlsOverlay } from "./overlay.js";

/**
 * Initializes UI event listeners for restart and pause buttons.
 * Also disables focus behavior on buttons for smoother keyboard play.
 */
export function setupUIEvents() {
  /**
   * Handles click on the "Restart" button.
   * Resets game state, clears saved state, spawns a new piece, and resumes the game if paused.
   */
  document.getElementById("restart").addEventListener("click", () => {
    gameOverReset();
    localStorage.removeItem("trixelGameState");
    gameState.isTouchingGround = false;
    gameState.lockTimer = 0;
    playerReset();

    if (gameState.isPaused) {
      gameState.isPaused = false;
      gameState.lastTime = performance.now();
      document.getElementById("pause").textContent = "⏸";
      update();
    }

    showControlsOverlay(true, 1000);
  });

  /**
   * Handles click on the "Pause" button.
   * Toggles the pause state and resumes the game loop when unpaused.
   */
  document.getElementById("pause").addEventListener("click", () => {
    gameState.isPaused = !gameState.isPaused;
    const pauseBtn = document.getElementById("pause");
    pauseBtn.textContent = gameState.isPaused ? "▶" : "⏸";
    if (!gameState.isPaused) {
      gameState.lastTime = performance.now();
      update();
    }
  });

  /**
   * Prevents buttons from receiving focus or triggering unintended behavior via keyboard/mouse.
   */
  document.querySelectorAll("button").forEach((button) => {
    button.setAttribute("tabindex", "-1");
    button.addEventListener("keydown", (e) => e.preventDefault());
    button.addEventListener("mousedown", (e) => e.preventDefault());
  });
}
