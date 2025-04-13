import { gameState } from "./gameState.js";
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
  if (gameState.pieceBag.length === 0) {
    gameState.pieceBag = shuffleBag();
  }
  return gameState.pieceBag.pop();
}
/**
 * Creates a piece matrix based on its type identifier.
 *
 * @param {string} type - The type of piece ('T', 'O', 'L', 'J', 'I', 'S', 'Z').
 * @returns {number[][]} A 2D matrix representing the shape.
 */
export function createPiece(type) {
  if (type === "T") {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === "O") {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === "L") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === "J") {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === "I") {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === "S") {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === "Z") {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}
