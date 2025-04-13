/**
 * Creates a 2D array (matrix) with given width and height.
 * Fills all cells with 0 to represent empty space.
 *
 * @param {number} w - Number of columns.
 * @param {number} h - Number of rows.
 * @returns {number[][]} A 2D matrix of zeros.
 */
export function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}
