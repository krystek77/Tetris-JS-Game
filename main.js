const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const ROWS = 20;
const COLUMNS = 10;
const SIZE_SQUARE = 20;

canvas.width = COLUMNS * SIZE_SQUARE;
canvas.height = ROWS * SIZE_SQUARE;

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
 * @param {Object} offset
 */
function drawMatrix(matrix, offset) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				drawSquare(x + offset.x, y + offset.y, colors[value]);
			}
		});
	});
}

/**
 * Draws arena
 *
 * @param {Array} arena
 * @param {Object} offset
 */
function drawArena(arena, offset) {
	arena.forEach((row, y) => {
		row.forEach((value, x) => {
			drawSquare(x + offset.x, y + offset.y, colors[value]);
		});
	});
}

/**
 * Render scene
 *
 */
function draw() {
	context.fillStyle = 'black';
	// context.fillRect(0, 0, canvas.width, canvas.height);

	drawArena(arena, { x: 0, y: 0 });
	drawMatrix(player.matrix, player.position);
}

const arena = createMatrix(COLUMNS, ROWS);

const player = {
	matrix: createTetrimino('T'),
	position: {
		x: 4,
		y: 1,
	},
};

/**
 * Game Loop
 * @param {Number} time
 */
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

function update(time = 0) {
	let deltaTime = time - lastTime;
	lastTime = time;
	dropCounter += deltaTime;
	if (dropCounter > dropInterval) {
        dropCounter = 0;
        
        draw();
        
	}
	requestAnimationFrame(update);
}

update();
