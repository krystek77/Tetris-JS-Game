const canvas = document.querySelector('.tetris');
const context = canvas.getContext('2d');
const ROWS = 20;
const COLUMNS = 10;
const SIZE_SQUARE = 20;
const MARGIN_TOP = 4;
const MARGIN_BOTTOM = 4;
const MARGIN_LEFT = 3;
const MARGIN_RIGHT = 3;
const SCORE_INTERVAL = 100;
const MAX_LEVEL = 10;
let stop;

canvas.width = (COLUMNS + MARGIN_LEFT + MARGIN_RIGHT) * SIZE_SQUARE;
canvas.height = (ROWS + MARGIN_TOP + MARGIN_BOTTOM) * SIZE_SQUARE;

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
	context.fillRect((x + MARGIN_LEFT) * SIZE_SQUARE, (y + MARGIN_TOP) * SIZE_SQUARE, SIZE_SQUARE, SIZE_SQUARE);
	context.strokeRect((x + MARGIN_LEFT) * SIZE_SQUARE, (y + MARGIN_TOP) * SIZE_SQUARE, SIZE_SQUARE, SIZE_SQUARE);
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
	arena.board.forEach((row, y) => {
		row.forEach((value, x) => {
			drawSquare(x + offset.x, y + offset.y, colors[value]);
		});
	});
}


const arena = new Arena();
const player = new Player();
let lastScores = 0;

/**
 * Draw text on canvas
 *
 * @param {*} text
 * @param {Number} posX
 * @param {Number} posY
 * @param {Number} maxW
 * @param {String} color
 */
function drawText(text, posX, posY, color, font, maxW) {
	context.fillStyle = color;
	context.font = font;
	context.fillText(text, posX, posY, maxW);
}
/**
 * Draw reset button on canvas
 *
 */
function drawButton() {
	context.fillStyle = 'red';
	context.fillRect(canvas.width - 90, 10, 80, 40);
	context.strokeStyle = 'white';
	context.strokeRect(canvas.width - 90, 10, 80, 40);
	drawText('RESET', canvas.width - 75, 38, 'white', 'bold 20px sans-serif', 50);
}
/**
 * Render scene
 *
 */
function draw() {
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height);

	drawButton();

	drawText('SCORE', 60, 20, 'white', 'bold 20px sans-serif', 40);
	drawText(player.score, 60, 50, 'green', 'bold 40px sans-serif', 100);
	drawText('LIFES', 60, canvas.height - 40, 'orange', 'bold 20px sans-serif', 40);
	drawText('00' + player.life, 60, canvas.height - 10, 'white', 'bold 40px sans-serif', 40);
	drawText('LEVEL', canvas.width - 100, canvas.height - 40, 'orange', 'bold 20px sans-serif', 40);
	drawText(player.level, canvas.width - 100, canvas.height - 10, 'white', 'bold 40px sans-serif', 40);
	drawText('ROWS', 10, canvas.height / 2 + 10, 'white', 'bold 20px sans-serif', 40);
	drawText(player.rowCount, 10, canvas.height / 2 + 40, 'blue', 'bold 40px sans-serif', 40);
	drawArena(arena, { x: 0, y: 0 });
	drawMatrix(player.matrix, player.position);
	drawMatrix(player.nextMatrix, { x: -3, y: -1 });
}
/**
 * Game Loop
 * @param {Number} time
 */
let lastTime = 0;
let dropCounter = 0;

function update(time = 0) {
	let deltaTime = time - lastTime;
	let dropInterval = (1000 * (MAX_LEVEL - player.level + 1)) / 10;
	lastTime = time;
	dropCounter += deltaTime;
	if (dropCounter > dropInterval) {
		player.drop();
	}

	draw();
	stop = requestAnimationFrame(update);

	if (player.life <= 0) {
		cancelAnimationFrame(stop);
		drawText('GAME OVER', canvas.width / 2 - 50, canvas.height / 2 + 30, 'white', 'bold 60px sans-serif', 100);
	} else if (player.level > 10) {
		drawText('THE END GAME', canvas.width / 2 - 50, canvas.height / 2 + 30, 'white', 'bold 60px sans-serif', 100);
		cancelAnimationFrame(stop);
	}
}
/**
 * Resets game
 *
 */
function resetGame(event) {
	const posX = event.offsetX;
	const posY = event.offsetY;
	if (posX > canvas.width - 90 && posX < canvas.width - 90 + 80 && posY > 10 && posY < 10 + 40) {
		player.reset();
		player.life = 3;
		player.score = 0;
		player.level = 1;
		arena.board.forEach(row => {
			row.fill(0);
		});
		requestAnimationFrame(update);
	}
}

function control(event) {
	if (event.key === 'ArrowLeft') {
		player.move(-1);
	} else if (event.key === 'ArrowRight') {
		player.move(+1);
	} else if (event.key === 'ArrowUp') {
		player.rotate(1);
	} else if (event.key === 'ArrowDown') {
		player.rotate(-1);
	} else if (event.key === 'd') {
		player.drop();
	}
}
window.addEventListener('keydown', control);
canvas.addEventListener('click', resetGame);

player.reset();
update();
