import { DEFAULT_KEYS } from "./constants.js";

export let KEY = {};
loadCustomKeys();

/**
 * Determines if a key is a special (non-letter) key that should retain its original case.
 * This prevents keys like "ArrowLeft" or "Escape" from being lowercased.
 *
 * @param {string} key - The key to test.
 * @returns {boolean} True if it's a special key.
 */
function isSpecialKey(key) {
  return /^Arrow|^Escape$|^Space$|^Enter$|^Tab$/i.test(key);
}

/**
 * Loads keybindings from localStorage, falling back to defaults if not found or invalid.
 * Keys are normalized to lowercase unless they are special keys.
 * Populates the global `KEY` object.
 */
export function loadCustomKeys() {
  try {
    const saved = localStorage.getItem("trixelKeyBindings");
    if (saved) {
      const parsed = JSON.parse(saved);
      applyKeyBindings(parsed);
      return;
    }
  } catch {
    console.warn("Failed to parse saved keybindings.");
  }

  applyKeyBindings(DEFAULT_KEYS);
}

/**
 * Applies a set of keybindings and updates the global `KEY` object.
 * Keys are normalized: special keys retain their form, others become lowercase.
 *
 * @param {object} bindings - An object where keys are actions (e.g., LEFT, ROTATE),
 *                            and values are either a single key or an array of keys.
 */
function applyKeyBindings(bindings) {
  for (const action in DEFAULT_KEYS) {
    if (bindings[action]) {
      const keys = Array.isArray(bindings[action])
        ? bindings[action]
        : [bindings[action]];
      KEY[action] = keys.map((k) => (isSpecialKey(k) ? k : k.toLowerCase()));
    } else {
      const defaultKeys = Array.isArray(DEFAULT_KEYS[action])
        ? DEFAULT_KEYS[action]
        : [DEFAULT_KEYS[action]];
      KEY[action] = defaultKeys.map((k) =>
        isSpecialKey(k) ? k : k.toLowerCase(),
      );
    }
  }
}

/**
 * Updates the current keybindings with new values, merges them into the global `KEY` object,
 * and saves the result to localStorage.
 *
 * @param {object} newBindings - Partial or full replacement keybindings.
 */
export function updateKeyBindings(newBindings) {
  const merged = { ...KEY, ...newBindings };
  applyKeyBindings(merged);
  localStorage.setItem("trixelKeyBindings", JSON.stringify(merged));
}

/**
 * Clears any custom keybindings from localStorage and restores the defaults.
 */
export function resetKeyBindings() {
  localStorage.removeItem("trixelKeyBindings");
  applyKeyBindings(DEFAULT_KEYS);
}
