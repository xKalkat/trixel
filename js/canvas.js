// Sets up the canvas element and scales it for block-based rendering.
export const canvas = document.getElementById("trixel");
export const context = canvas.getContext("2d");
context.scale(30, 30);
