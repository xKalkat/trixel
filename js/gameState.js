import { createMatrix } from "./matrix.js";
import { visibleRows, hiddenRows } from "./constants.js";
export const gameState = {
  score: 0,
  bestScore: parseInt(localStorage.getItem("bestScore") || 0),
  moveDirection: 0,
  moveTimer: 0,
  moveInterval: 50,
  dasDelay: 150,
  dasTimer: 0,
  moveHeld: false,
  downHeld: false,
  showPieceBag: true,
  downTimer: 0,
  instantSoftDropLock: false,
  downInterval: 50,
  lockDelay: 1000,
  lockTimer: 0,
  isTouchingGround: false,
  showGhost: true,
  isPaused: false,
  pieceBag: [],
  dropCounter: 0,
  dropInterval: 400,
  lastTime: 0,
  player: {
    pos: { x: 0, y: 0 },
    matrix: null,
  },
  lastPiece: null,
  arena: createMatrix(10, visibleRows + hiddenRows),
  heldPiece: null,
  holdUsed: false,
};
