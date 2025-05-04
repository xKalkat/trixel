import { KEY, updateKeyBindings } from "./config.js";
import { gameState } from "./gameState.js";
import { loadGameState, saveGameState } from "./storage.js";
let rebindingKey = null;

/**
 * Normalizes key strings to lowercase unless they are special named keys.
 *
 * @param {string} key - A keyboard key string.
 * @returns {string} Normalized key.
 */
function normalizeKey(key) {
  return /^Arrow|^Escape$|^Space$|^Enter$|^Tab$/i.test(key)
    ? key
    : key.toLowerCase();
}

function applyCustomTheme() {
  const custom = JSON.parse(localStorage.getItem("trixelCustomTheme") || "{}");
  const css = custom.cssVars || {};

  for (const [key, value] of Object.entries(css)) {
    document.documentElement.style.setProperty(`--${key}`, value);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("trixelTheme") || "classic";
  document.body.classList.add(`theme-${savedTheme}`);
  if (savedTheme === "custom") {
    applyCustomTheme();
  }
  const list = document.getElementById("controls-list");
  const cancelBtn = document.getElementById("cancel-edit");

  function formatActionName(action) {
    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function formatKeyDisplay(key) {
    return key === " " ? "SPACE" : key.toUpperCase();
  }

  function renderEditor() {
    list.innerHTML = "";
    Object.entries(KEY).forEach(([action, keys]) => {
      const row = document.createElement("div");
      row.classList.add("control-row");

      const label = document.createElement("span");
      label.textContent = `${formatActionName(action)}:`;

      const keysContainer = document.createElement("div");
      keysContainer.classList.add("keys-container");

      const keysArray = Array.isArray(keys) ? keys : [keys];
      keysArray.forEach((k) => {
        const keyTag = document.createElement("span");
        keyTag.classList.add("key-tag");
        keyTag.textContent = formatKeyDisplay(k);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✖️";
        removeBtn.classList.add("remove-key");
        removeBtn.addEventListener("click", () => {
          KEY[action] = KEY[action].filter(
            (key) => normalizeKey(key) !== normalizeKey(k),
          );
          updateKeyBindings(KEY);
          renderEditor();
        });

        keyTag.appendChild(removeBtn);
        keysContainer.appendChild(keyTag);
      });

      const addBtn = document.createElement("button");
      addBtn.textContent = "Add Key";
      addBtn.classList.add("add-key");
      addBtn.addEventListener("click", () => {
        addBtn.textContent = "Press a key...";
        rebindingKey = { action, button: addBtn };
      });

      row.appendChild(label);
      row.appendChild(keysContainer);
      row.appendChild(addBtn);
      list.appendChild(row);
    });

    const settingsHeader = document.createElement("h3");
    settingsHeader.textContent = "Settings:";
    list.appendChild(settingsHeader);

    const settingsRow = document.createElement("div");
    settingsRow.classList.add("control-row");

    const settingsLabel = document.createElement("span");
    settingsLabel.textContent = "Instant Soft Drop Lock:";

    const settingCheckbox = document.createElement("input");
    settingCheckbox.type = "checkbox";
    settingCheckbox.checked = gameState.instantSoftDropLock;

    settingCheckbox.addEventListener("change", (e) => {
      gameState.instantSoftDropLock = e.target.checked;
      saveGameState();
    });

    settingsRow.appendChild(settingsLabel);
    settingsRow.appendChild(settingCheckbox);
    list.appendChild(settingsRow);

    const pieceBagRow = document.createElement("div");
    pieceBagRow.classList.add("control-row");

    const pieceBagLabel = document.createElement("span");
    pieceBagLabel.textContent = "Show Piece Bag:";

    const pieceBagCheckbox = document.createElement("input");
    pieceBagCheckbox.type = "checkbox";
    pieceBagCheckbox.checked = gameState.showPieceBag;

    pieceBagCheckbox.addEventListener("change", (e) => {
      gameState.showPieceBag = e.target.checked;
      saveGameState();
    });

    pieceBagRow.appendChild(pieceBagLabel);
    pieceBagRow.appendChild(pieceBagCheckbox);
    list.appendChild(pieceBagRow);
  }

  cancelBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  document.addEventListener("keydown", (e) => {
    if (!rebindingKey) return;

    const { action, button } = rebindingKey;
    const key = normalizeKey(e.key);

    if (!Array.isArray(KEY[action])) KEY[action] = [KEY[action]];
    const index = KEY[action].indexOf(key);

    if (index === -1) {
      KEY[action].push(key);
    } else {
      KEY[action].splice(index, 1);
    }

    updateKeyBindings(KEY);
    loadGameState();
    renderEditor();
    rebindingKey = null;
  });

  loadGameState();
  renderEditor();
});
