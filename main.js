const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const ROWS = 20;
const COLUMNS = 10;
const SIZE_SQUARE = 20;

canvas.width = COLUMNS * SIZE_SQUARE;
canvas.height = ROWS * SIZE_SQUARE;

context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

const colors = ['#000000', '#fe0900', '#999999', '#1bffff', '#fdff00', '#ff00fe', '#2600ff', '#01ff00'];
/**
 * Creates array by given rows and columns and set value of each element of array to zero.
 *
 * @param {Number} columns
 * @param {Number} rows
 * @returns Array
 */
function createMatrix(columns, rows) {
	return Array.from({ length: rows }, row => Array.from({ length: columns }).fill(0));
}

/**
 *  Creates choosen tetrmino
 *
 * @param {String} type
 * @returns {Array}
 */
function createTetrimino(type) {
	switch (type) {
		case 'I':
			return [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]];
		case 'T':
			return [[2, 2, 2], [0, 2, 0], [0, 0, 0]];
		case 'O':
			return [[3, 3], [3, 3]];
		case 'L':
			return [[0, 4, 0], [0, 4, 0], [0, 4, 4]];
		case 'J':
			return [[0, 5, 0], [0, 5, 0], [5, 5, 0]];
		case 'S':
			return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
		default:
			return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];
	}
}
/**
 * Draws a Tetrimino
 *
 * @returns Array
 */
function randomTetrimino() {
	const tetrominos = 'ITOLJSZ';
	const tetriminoIndex = Math.floor(Math.random() * tetrominos.length);
	return createTetrimino(tetrominos.charAt(tetriminoIndex));
}

/**
 * Draw square at position x and y with given fill color
 *
 * @param {Number} x
 * @param {Number} y
 * @param {String} color
 */
function drawSquare(x, y, color) {
	context.fillStyle = color;
	context.strokeStyle = 'grey';
	context.fillRect(x * SIZE_SQUARE, y * SIZE_SQUARE, SIZE_SQUARE, SIZE_SQUARE);
	context.strokeRect(x * SIZE_SQUARE, y * SIZE_SQUARE, SIZE_SQUARE, SIZE_SQUARE);
}
/**
 * Draw matrix
 *
 * @param {Array} matrix
 */
function drawMatrix(matrix) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				drawSquare(x, y, colors[value]);
			}
		});
	});
}

const matrix = createTetrimino('T');
const arena = createMatrix(COLUMNS, ROWS);

function drawArena(arena) {
	arena.forEach((row, y) => {
		row.forEach((value, x) => {
			drawSquare(x, y, colors[value]);
		});
	});
}

drawArena(arena);
drawMatrix(matrix);
