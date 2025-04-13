import { setupControls } from "./js/controls.js";
import { loadGameState } from "./js/storage.js";
import { update } from "./js/updateLoop.js";
import { maybeUpdateBestScore, updateScore } from "./js/storage.js";
import { showControlsOverlay } from "./js/overlay.js";
import { saveGameState } from "./js/storage.js";
import { setupUIEvents } from "./js/uiEvents.js";
const hasLoaded = loadGameState();
update();
maybeUpdateBestScore();
updateScore();
if (!hasLoaded) {
  showControlsOverlay(true, 1000);
}
setupUIEvents();
setupControls();
window.addEventListener("beforeunload", () => {
  saveGameState();
});
