import { context, canvas } from "./canvas.js";
import { gameState } from "./gameState.js";
import { hiddenRows, colors } from "./constants.js";
import { collide } from "./arena.js";

function drawCell(x, y, color, pulse) {
  context.shadowBlur = pulse;
  context.shadowColor = color;

  context.fillStyle = color;
  context.fillRect(x, y, 1, 1);

  context.shadowBlur = 0;
  context.strokeStyle = "rgba(0, 0, 0, 0.4)";
  context.lineWidth = 0.05;
  context.strokeRect(x, y, 1, 1);
}

function drawMatrix(matrix, offset) {
  const pulse = 6 + Math.sin(Date.now() / 300) * 2;

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

function drawRedLine() {
  context.strokeStyle = "red";
  context.lineWidth = 0.05;
  context.beginPath();
  context.moveTo(0, 3);
  context.lineTo(10, 3);
  context.stroke();
}

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
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(gameState.arena, { x: 0, y: 0 });

  if (gameState.showGhost) drawGhostPiece();
  drawPlayer();
  drawRedLine();
}
