import { setTheme, loadSavedTheme } from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
  loadSavedTheme();
  const saved = localStorage.getItem("trixelTheme") || "classic";
  document.body.classList.add(`theme-${saved}`);

  document.getElementById("btn-play").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  document.getElementById("btn-edit-theme").addEventListener("click", () => {
    window.location.href = "themeEditor.html";
  });

  document.getElementById("btn-edit-controls").addEventListener("click", () => {
    window.location.href = "controlsEditor.html";
  });
});
