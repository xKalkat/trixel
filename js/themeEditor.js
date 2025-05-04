import { setTheme } from "./theme.js";

function applyCustomTheme() {
  const custom = JSON.parse(localStorage.getItem("trixelCustomTheme") || "{}");
  const cssVars = custom.cssVars || {};

  for (const [key, value] of Object.entries(cssVars)) {
    document.documentElement.style.setProperty(`--${key}`, value);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  function setInputValue(id, value) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn("Missing element:", id);
      return;
    }
    el.value = value;
  }

  const saved = localStorage.getItem("trixelTheme") || "classic";
  document.body.classList.add(`theme-${saved}`);
  if (saved === "custom") {
    applyCustomTheme();
  }
  const customOptions = document.getElementById("custom-theme-form");
  const saveCustomBtn = document.getElementById("save-custom-theme");

  function loadCustomThemeInputs() {
    const custom = JSON.parse(
      localStorage.getItem("trixelCustomTheme") || "{}",
    );

    const css = custom.cssVars || {};
    const defaultCss = {
      "bg-color": "#121212",
      "accent-color": "#fff",
      "text-color": "#ffffff",
      "dim-text-color": "#bbbbbb",
      "border-color": "#333333",
      "box-glow": "0 0 10px #00bcd4",
      "text-glow": "0 0 6px #ffffff",
      "font-family": '"Courier New", monospace',
      "cell-glow": "pulse",
      "editor-bg": "#1e1e1e",
    };

    const cssVarToInputId = {
      "bg-color": "custom-bg",
      "accent-color": "custom-accent",
      "text-color": "custom-text-color",
      "dim-text-color": "custom-dim-color",
      "border-color": "custom-border-color",
      "box-glow": "custom-box-glow",
      "text-glow": "custom-text-glow",
      "font-family": "custom-font",
      "cell-glow": "custom-cell-glow",
      "editor-bg": "custom-editor-bg",
    };

    for (const [cssVar, inputId] of Object.entries(cssVarToInputId)) {
      setInputValue(inputId, css[cssVar] || defaultCss[cssVar]);
    }

    const defaultPieceColors = [
      "#b455ff",
      "#4169e1",
      "#ffa500",
      "#ffeb3b",
      "#4caf50",
      "#f44336",
      "#00e5ff",
    ];

    const pieceColors = custom.pieceColors || defaultPieceColors;
    ["t", "j", "l", "o", "s", "z", "i"].forEach((id, i) => {
      setInputValue(`color-${id}`, pieceColors[i]);
    });

    document.getElementById("custom-theme-form").style.display = "flex";
  }

  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.theme;
      if (selected === "custom") {
        loadCustomThemeInputs();
      } else {
        customOptions.style.display = "none";
        setTheme(selected);
        document.body.className = `theme-${selected}`;
      }
    });
  });

  saveCustomBtn.addEventListener("click", () => {
    const cssVars = {
      "bg-color": document.getElementById("custom-bg").value,
      "accent-color": document.getElementById("custom-accent").value,
      "text-color": document.getElementById("custom-text-color").value,
      "dim-text-color": document.getElementById("custom-dim-color").value,
      "border-color": document.getElementById("custom-border-color").value,
      "box-glow": document.getElementById("custom-box-glow").value,
      "text-glow": document.getElementById("custom-text-glow").value,
      "font-family": document.getElementById("custom-font").value,
      "cell-glow": document.getElementById("custom-cell-glow").value,
      "editor-bg": document.getElementById("custom-editor-bg").value,
    };

    const pieceColors = ["t", "j", "l", "o", "s", "z", "i"].map(
      (id) => document.getElementById(`color-${id}`).value,
    );

    setTheme({ cssVars, pieceColors });
    document.body.className = "theme-custom";
  });

  document.getElementById("cancel-theme").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  if (saved === "custom") {
    loadCustomThemeInputs();
  } else {
    customOptions.style.display = "none";
  }
});
