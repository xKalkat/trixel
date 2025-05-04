import { context, canvas } from "./canvas.js";
import { gameState } from "./gameState.js";
import { hiddenRows, colors } from "./constants.js";
import { collide } from "./arena.js";
import { createPiece } from "./pieces.js";

/**
 * Draws a single Tetris cell at a specific canvas coordinate with glow and border.
 *
 * @param {number} x - X-coordinate in canvas grid units.
 * @param {number} y - Y-coordinate in canvas grid units.
 * @param {string} color - Fill color of the cell.
 * @param {number} pulse - Glow strength for shadow.
 */
function drawCell(x, y, color, pulse) {
  context.shadowBlur = pulse;
  context.shadowColor = color;

  context.fillStyle = color;
  context.fillRect(x, y, 1, 1);

  context.shadowBlur = 0;

  const strokeColor = lightenColor(color, 0.05);
  const lineWidth = 0.05;

  context.strokeStyle = strokeColor;
  context.lineWidth = lineWidth;

  const inset = lineWidth / 2;
  context.strokeRect(x + inset, y + inset, 1 - lineWidth, 1 - lineWidth);
}

/**
 * Lightens an RGB color by a given factor.
 *
 * @param {string} color - The base color in CSS format.
 * @param {number} amount - Amount to lighten (0.0–1.0).
 * @returns {string} The lightened RGB color.
 */
function lightenColor(color, amount = 0.2) {
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);

  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const rgbMatch = computed.match(/\d+/g);
  if (!rgbMatch) return color;

  let [r, g, b] = rgbMatch.map(Number);
  r = Math.min(255, r + 255 * amount);
  g = Math.min(255, g + 255 * amount);
  b = Math.min(255, b + 255 * amount);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Retrieves a CSS variable from the document with optional fallback.
 *
 * @param {string} name - The name of the CSS variable.
 * @param {string} fallback - Default value if the variable is unset.
 * @returns {string} The resolved CSS value.
 */
function getCSSVar(name, fallback = "") {
  return (
    getComputedStyle(document.body).getPropertyValue(name).trim() || fallback
  );
}

/**
 * Draws a matrix of blocks on the canvas at a specified position.
 *
 * @param {number[][]} matrix - 2D array of block values.
 * @param {object} offset - Offset for drawing { x, y }.
 */
function drawMatrix(matrix, offset) {
  const glow = getCSSVar("--cell-glow", "pulse");
  let pulse = 0;

  if (glow === "pulse") {
    pulse = 6 + Math.sin(Date.now() / 300) * 2;
  } else if (!isNaN(parseFloat(glow))) {
    pulse = parseFloat(glow);
  }

  matrix.forEach((row, y) => {
    const drawY = y + offset.y - hiddenRows;
    if (drawY < 0) return;

    row.forEach((value, x) => {
      if (value !== 0) {
        drawCell(x + offset.x, drawY, colors[value], pulse);
      }
    });
  });
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  this.moveTo(x + r, y);
  this.lineTo(x + w - r, y);
  this.quadraticCurveTo(x + w, y, x + w, y + r);
  this.lineTo(x + w, y + h - r);
  this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  this.lineTo(x + r, y + h);
  this.quadraticCurveTo(x, y + h, x, y + h - r);
  this.lineTo(x, y + r);
  this.quadraticCurveTo(x, y, x + r, y);
};

/**
 * Draws a translucent ghost piece at its projected landing position.
 */
function drawGhostPiece() {
  const ghostPos = { x: gameState.player.pos.x, y: gameState.player.pos.y };
  const matrix = gameState.player.matrix;

  while (!collide(gameState.arena, { pos: ghostPos, matrix })) {
    ghostPos.y++;
  }
  ghostPos.y--;

  context.globalAlpha = 0.3;
  drawMatrix(matrix, ghostPos);
  context.globalAlpha = 1.0;
}

/**
 * Draws a red horizontal line across the canvas as a visual marker.
 */
function drawRedLine() {
  context.strokeStyle = "#ee1222";
  context.lineWidth = 0.1;
  context.beginPath();
  context.moveTo(0, 3);
  context.lineTo(10, 3);
  context.stroke();
}

/**
 * Draws the active player piece with fade animation if grounded.
 */
function drawPlayer() {
  const { isTouchingGround, lockTimer, lockDelay, player } = gameState;

  if (isTouchingGround) {
    const progress = Math.min(lockTimer / lockDelay, 1);
    const fade = Math.sin(progress * Math.PI);
    const minAlpha = 0.25;
    const maxAlpha = 1.0;
    const alpha = minAlpha + (maxAlpha - minAlpha) * fade;

    context.globalAlpha = alpha;
    drawMatrix(player.matrix, player.pos);
    context.globalAlpha = 1.0;
  } else {
    drawMatrix(player.matrix, player.pos);
  }
}

/**
 * Renders the entire game frame:
 * - Clears the canvas
 * - Draws the arena
 * - Draws the ghost piece (if enabled)
 * - Animates the player's piece (if touching ground)
 * - Draws red line marker
 */
export function draw() {
  context.fillStyle = getComputedStyle(document.body)
    .getPropertyValue("--bg-color")
    .trim();
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(gameState.arena, { x: 0, y: 0 });

  if (gameState.showGhost) drawGhostPiece();
  drawPlayer();
  drawRedLine();
}

/**
 * Renders the piece preview queue and held piece in the sidebar container.
 */
export function renderPieceBag() {
  const container = document.getElementById("piece-bag");
  document.documentElement.style.setProperty(
    "--total-width",
    gameState.showPieceBag ? "380px" : "300px",
  );

  if (!gameState.showPieceBag) {
    container.style.display = "none";
    return;
  } else {
    container.style.display = "flex";
  }

  container.innerHTML = "";

  const blockSize = 16;
  const previewSize = 64;

  gameState.pieceBag.slice(0, 5).forEach((type) => {
    let matrix = createPiece(type);
    matrix = trimMatrix(matrix);

    const rows = matrix.length;
    const cols = matrix[0].length;

    const canvas = document.createElement("canvas");
    canvas.className = "piece-preview";
    canvas.width = previewSize;
    canvas.height = previewSize;

    const ctx = canvas.getContext("2d");

    const offsetX = Math.floor((previewSize - cols * blockSize) / 2);
    const offsetY = Math.floor((previewSize - rows * blockSize) / 2);

    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.fillStyle = colors[value];
          const px = offsetX + x * blockSize;
          const py = offsetY + y * blockSize;
          ctx.fillRect(px, py, blockSize, blockSize);
          ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, blockSize, blockSize);
        }
      });
    });

    container.appendChild(canvas);
  });

  const separator = document.createElement("div");
  separator.style.height = "2px";
  separator.style.width = "80%";
  separator.style.margin = "4px auto";
  separator.style.background = "rgba(255,255,255,0.2)";
  separator.style.borderRadius = "1px";
  container.appendChild(separator);

  if (gameState.heldPiece) {
    const label = document.createElement("div");
    label.textContent = "HOLD";
    label.style.textAlign = "center";
    label.style.fontSize = "12px";
    label.style.color = "var(--dim-text-color)";
    container.appendChild(label);

    const canvas = renderMiniPieceCanvas(
      gameState.heldPiece,
      blockSize,
      previewSize,
    );
    canvas.style.opacity = 0.9;
    container.appendChild(canvas);
  }
}

/**
 * Renders a single mini-canvas preview of a piece, centered within bounds.
 *
 * @param {string} type - The Tetris piece type (e.g. "I", "O").
 * @param {number} blockSize - Size of each block.
 * @param {number} previewSize - Canvas size (width and height).
 * @returns {HTMLCanvasElement} The canvas element.
 */
function renderMiniPieceCanvas(type, blockSize, previewSize) {
  let matrix = createPiece(type);
  matrix = trimMatrix(matrix);

  const rows = matrix.length;
  const cols = matrix[0].length;

  const canvas = document.createElement("canvas");
  canvas.className = "piece-preview";
  canvas.width = previewSize;
  canvas.height = previewSize;

  const ctx = canvas.getContext("2d");

  const offsetX = Math.floor((previewSize - cols * blockSize) / 2);
  const offsetY = Math.floor((previewSize - rows * blockSize) / 2);

  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = colors[value];
        const px = offsetX + x * blockSize;
        const py = offsetY + y * blockSize;
        ctx.fillRect(px, py, blockSize, blockSize);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, blockSize, blockSize);
      }
    });
  });

  return canvas;
}

/**
 * Trims empty rows and columns (containing only 0s) from the outer edges of a matrix.
 * @param {number[][]} matrix - A 2D array representing a piece shape.
 * @returns {number[][]} A trimmed matrix.
 */
export function trimMatrix(matrix) {
  while (matrix.length && matrix[0].every((cell) => cell === 0)) {
    matrix.shift();
  }

  while (
    matrix.length &&
    matrix[matrix.length - 1].every((cell) => cell === 0)
  ) {
    matrix.pop();
  }

  let left = 0;
  let right = matrix[0].length - 1;

  while (left <= right && matrix.every((row) => row[left] === 0)) {
    left++;
  }

  while (right >= left && matrix.every((row) => row[right] === 0)) {
    right--;
  }

  return matrix.map((row) => row.slice(left, right + 1));
}
