import { gameState } from "./gameState.js";
import { update } from "./updateLoop.js";
import { playerReset } from "./player.js";
import { gameOverReset } from "./playerState.js";
import {
  hidePauseMenu,
  showPauseMenu,
  showControlsOverlay,
  showControlsEditor,
} from "./overlay.js";

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
    if (!gameState.isPaused) {
      gameOverReset();
      localStorage.removeItem("trixelGameState");
      gameState.isTouchingGround = false;
      gameState.lockTimer = 0;
      playerReset();
      showControlsOverlay(true, 1000);
    }
  });

  /**
   * Handles click on the "Pause" button.
   * Toggles the pause state and resumes the game loop when unpaused.
   */
  document.getElementById("pause").addEventListener("click", () => {
    gameState.isPaused = !gameState.isPaused;
    const pauseBtn = document.getElementById("pause");

    if (gameState.isPaused) {
      pauseBtn.textContent = "▶";
      pauseBtn.classList.add("small");
      showPauseMenu();
    } else {
      pauseBtn.textContent = "⏸";
      pauseBtn.classList.remove("small");
      hidePauseMenu();
      gameState.lastTime = performance.now();
      update();
    }

    if (gameState.isPaused) {
      showPauseMenu();
    } else {
      hidePauseMenu();
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

  document.getElementById("btn-edit-controls").addEventListener("click", () => {
    showControlsEditor();
  });

  document.getElementById("btn-edit-theme").addEventListener("click", () => {
    window.location.href = "themeEditor.html";
  });
}
