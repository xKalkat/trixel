import { gameState } from "./gameState.js";

const ALL_PIECES = ["T", "J", "L", "O", "S", "Z", "I"];

/**
 * Shuffles a standard 7-piece Tetris bag using Fisher-Yates algorithm.
 *
 * @returns {string[]} A randomly shuffled array of piece identifiers.
 */
export function shuffleBag() {
  const pieces = ["T", "J", "L", "O", "S", "Z", "I"];
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}

/**
 * Returns the next piece from the current shuffled bag.
 * If the bag is empty, reshuffles before drawing a new piece.
 *
 * @returns {string} The identifier for the next piece.
 */
export function getNextPiece() {
  if (!gameState.pieceBag || gameState.pieceBag.length < 1) {
    initializePieceBag();
  }

  const next = gameState.pieceBag.shift();

  const lastInBag = gameState.pieceBag[gameState.pieceBag.length - 1] || null;
  let newPiece = getRandomPiece(lastInBag);

  while (newPiece === next) {
    newPiece = getRandomPiece(lastInBag);
  }

  gameState.pieceBag.push(newPiece);
  gameState.lastPiece = next;

  return next;
}

/**
 * Selects a random piece different from the provided one.
 *
 * @param {string|null} notThis - A piece type to exclude from selection.
 * @returns {string} A randomly chosen piece identifier.
 */
function getRandomPiece(notThis) {
  const options = ALL_PIECES.filter((p) => p !== notThis);
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Initializes the piece bag with 7 unique random pieces.
 */
export function initializePieceBag() {
  gameState.pieceBag = shuffleArray([...ALL_PIECES]);
}

/**
 * Fisher-Yates shuffle.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Creates a piece matrix based on its type identifier.
 *
 * @param {string} type - The type of piece ('T', 'O', 'L', 'J', 'I', 'S', 'Z').
 * @returns {number[][]} A 2D matrix representing the shape.
 */
export function createPiece(type) {
  switch (type) {
    case "T":
      return [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
      ];
    case "O":
      return [
        [0, 0, 0, 0],
        [0, 2, 2, 0],
        [0, 2, 2, 0],
        [0, 0, 0, 0],
      ];
    case "L":
      return [
        [0, 0, 0, 0],
        [0, 3, 0, 0],
        [0, 3, 0, 0],
        [0, 3, 3, 0],
      ];
    case "J":
      return [
        [0, 0, 0, 0],
        [0, 0, 4, 0],
        [0, 0, 4, 0],
        [0, 4, 4, 0],
      ];
    case "I":
      return [
        [0, 0, 0, 0],
        [5, 5, 5, 5],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    case "S":
      return [
        [0, 0, 0, 0],
        [0, 0, 6, 6],
        [0, 6, 6, 0],
        [0, 0, 0, 0],
      ];
    case "Z":
      return [
        [0, 0, 0, 0],
        [0, 7, 7, 0],
        [0, 0, 7, 7],
        [0, 0, 0, 0],
      ];
  }
}
