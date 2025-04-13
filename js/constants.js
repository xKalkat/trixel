// Stores global configuration values like score amounts, control keys, and color definitions.
export const hiddenRows = 4;
export const visibleRows = 18;
export const SCORE = {
  DROP: 1,
  HARDDROP: 3,
  LANDING: 10,
  LINECLEAR: 75,
};
export const colors = [
  null,
  "#00faff",
  "#ff0055",
  "#00ff6e",
  "#ffb300",
  "#8e00ff",
  "#ffee00",
  "#ff3030",
];

export const KEY = {
  LEFT: ["ArrowLeft", "a"],
  RIGHT: ["ArrowRight", "d"],
  DOWN: ["ArrowDown", "s"],
  ROTATE: ["ArrowUp", "w"],
  HARD_DROP: " ",
  TOGGLE_GHOST: "x",
};
KEY.HORIZONTAL = [...KEY.LEFT, ...KEY.RIGHT];
export const instantLockThreshold = 100;
