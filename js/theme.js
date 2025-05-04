import { colors } from "./constants.js";

/**
 * Applies a visual theme by updating CSS variables and block colors.
 * @param {string} name - Theme name: "light", "neon", "classic", etc.
 */
export function setTheme(nameOrCustom) {
  const body = document.body;

  if (typeof nameOrCustom === "string") {
    localStorage.setItem("trixelTheme", nameOrCustom);
    body.classList.remove(
      "theme-neon",
      "theme-light",
      "theme-classic",
      "theme-custom",
    );
    body.classList.add(`theme-${nameOrCustom}`);

    // Set piece colors
    const themeColors = {
      light: [
        "#b388ff",
        "#66aaff",
        "#ff9966",
        "#ffee77",
        "#66cc99",
        "#ff6677",
        "#66d9ff",
      ],
      // T, O, L, J, I, S, Z
      classic: [
        "#f438ff",
        "#ffe038",
        "#fe8d0f",
        "#3877ff",
        "#0dc2ff",
        "#00f867",
        "#ff002b",
      ],
      neon: [
        "#ff66ff",
        "#6688ff",
        "#ffaa66",
        "#ffff66",
        "#66ff99",
        "#ff6666",
        "#66ffff",
      ],
    };

    colors.splice(0, colors.length, null, ...themeColors[nameOrCustom]);
  } else if (typeof nameOrCustom === "object") {
    const { cssVars, pieceColors } = nameOrCustom;
    localStorage.setItem("trixelTheme", "custom");
    localStorage.setItem("trixelCustomTheme", JSON.stringify(nameOrCustom));

    Object.entries(cssVars).forEach(([key, val]) => {
      document.documentElement.style.setProperty(`--${key}`, val);
    });

    colors.splice(0, colors.length, null, ...pieceColors);
    body.className = "theme-custom";
    return;
  }
}

/**
 * Loads and applies the theme from localStorage if available.
 */
export function loadSavedTheme() {
  const saved = localStorage.getItem("trixelTheme") || "classic";

  if (saved === "custom") {
    const raw = localStorage.getItem("trixelCustomTheme");
    try {
      const custom = JSON.parse(raw);
      setTheme(custom);
    } catch {
      console.warn("Invalid custom theme; falling back to classic");
      setTheme("classic");
    }
  } else {
    setTheme(saved);
  }
}
