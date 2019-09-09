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
	arena.forEach((row, y) => {
		row.forEach((value, x) => {
			drawSquare(x + offset.x, y + offset.y, colors[value]);
		});
	});
}

/**
 * Check collision
 *
 * @param {Array} arena
 * @param {Object} player
 * @returns
 */
function collide(arena, player) {
	//true && undefined = undefined
	for (let y = 0; y < player.matrix.length; ++y) {
		for (let x = 0; x < player.matrix[y].length; ++x) {
			if (
				player.matrix[y][x] !== 0 &&
				(arena[y + player.position.y] && arena[y + player.position.y][x + player.position.x]) !== 0
			) {
				return true;
			}
		}
	}

	return false;
}

const arena = createMatrix(COLUMNS, ROWS);
const player = {
	matrix: null,
	position: {
		x: 0,
		y: 0,
	},
	life: 3,
	score: 0,
	level: 1,
	rowCount: 0,
};
/**
 * Drop player
 *
 */
function playerDrop() {
	player.position.y++;
	if (collide(arena, player)) {
		// console.log('collide');
		player.position.y--;
		merge(arena, player);
		playerReset();
		checkFullRow();
	}
	dropCounter = 0;
}
let lastScores = 0;
/**
 * Check if row is full
 *
 */
function checkFullRow() {
	let rowCounter = 1;
	for (let y = arena.length - 1; y > 0; y--) {
		let isFullRow = true;
		// console.log(arena[y]);
		for (let x = 0; x < arena[y].length; x++) {
			isFullRow = isFullRow && arena[y][x] != 0;
		}
		if (isFullRow) {
			// console.log('REMOVE ROW AND ADD AT START');
			const row = arena.splice(y, 1)[0].fill(0);
			arena.unshift(row);
			player.score += rowCounter * 10;
			player.rowCount++;

			if (player.score - lastScores >= SCORE_INTERVAL) {
				lastScores = player.score;
				if (player.level <= MAX_LEVEL) {
					player.level += 1;
				}
			}
			y++;
			rowCounter *= 2;
		}
	}
}

/**
 * Move player to the right or left
 *
 * @param {Number} direction
 */
function playerMove(direction) {
	player.position.x += direction;
	if (collide(arena, player)) {
		player.position.x += -direction;
	}
	dropCounter = 0;
}
/**
 * Reset player
 *
 */
function playerReset() {
	player.matrix = randomTetrimino();
	player.position.y = 0;
	player.position.x = Math.floor(arena[0].length / 2 - player.matrix[0].length / 2);
	if (collide(arena, player)) {
		player.life--;
		console.log(player.life);
		arena.forEach(row => {
			row.fill(0);
		});

		// console.table(arena);
	}
}

/**
 *Rotates matrix 90 degrees clockwise for 1 and counter clockwise for -1 direction
 *
 * @param {Array} matrix
 * @param {Number} [direction=0]
 */
function rotateMatrix(matrix, direction = 1) {
	const m = [];
	matrix.forEach((row, y) => {
		m[y] = [];
		row.forEach((value, x) => {
			m[y][x] = matrix[x][y];
		});
	});
	if (direction > 0) {
		m.forEach((row, y) => {
			m[y].reverse();
		});
	} else if (direction < 0) {
		m.reverse();
	}
	return m;
}
/**
 * Rotates player
 *
 * @param {Number} direction
 */
function playerRotate(direction) {
	let offset = 1;
	player.matrix = rotateMatrix(player.matrix, direction);
	// if (collide(arena, player)) {
	// 	console.log('collision at rotation');
	// 	if (player.position.x < arena[0].length / 2) {
	// 		console.log('collision at left edge');
	// 		player.position.x += offset;
	// 	} else if (player.position.x > arena[0].length / 2) {
	// 		console.log('collision at right edge');
	// 		player.position.x -= offset;
	// 	}
	// }
	while (collide(arena, player)) {
		console.log('collide');
		let pos = player.position.x;
		console.log('pos', pos);
		player.position.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if (offset > player.matrix[0].length) {
			console.log('inner');
			player.position.x = pos;
			player.matrix = rotateMatrix(player.matrix, -direction);
			return;
		}
		console.log(offset);
	}
}

/**
 * Put the player's place in the arena
 *
 * @param {Array} arena
 * @param {Object} player
 */
function merge(arena, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				if (
					player.position.x + x >= 0 &&
					player.position.x + x < arena[0].length &&
					player.position.y + y >= 0 &&
					player.position.y + y < arena.length
				) {
					arena[y + player.position.y][x + player.position.x] = value;
				}
			}
		});
	});
}
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
		playerDrop();
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
		// console.log(posX, posY);
		playerReset();
		player.life = 3;
		player.score = 0;
		player.level = 1;
		arena.forEach(row => {
			row.fill(0);
		});
		requestAnimationFrame(update);
	}
}

function control(event) {
	if (event.key === 'ArrowLeft') {
		// console.log('MOVE LEFT');
		playerMove(-1);
	} else if (event.key === 'ArrowRight') {
		// console.log('MOVE RIGHT');
		playerMove(+1);
	} else if (event.key === 'ArrowUp') {
		// console.log('ROTATE CLOCKWISE');
		playerRotate(1);
	} else if (event.key === 'ArrowDown') {
		// console.log('ROTATE COUNTER CLOCKWISE');
		playerRotate(-1);
	} else if (event.key === 'd') {
		// console.log('DROP');
		playerDrop();
	}
}
window.addEventListener('keydown', control);
canvas.addEventListener('click', resetGame);

playerReset();
update();
