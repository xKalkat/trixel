/**
 * Toggles the visibility of the in-game controls overlay.
 *
 * @param {boolean} [visible=true] - Whether to show the overlay.
 * @param {number} [autoHideMs=1000] - Optional delay in ms to auto-hide the overlay.
 */
export function showControlsOverlay(visible = true, autoHideMs = 1000) {
  const overlay = document.getElementById("controls-overlay");
  if (!overlay) return;

  overlay.style.display = visible ? "block" : "none";

  if (visible && autoHideMs > 0) {
    setTimeout(() => {
      overlay.style.display = "none";
    }, autoHideMs);
  }
}
