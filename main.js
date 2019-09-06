const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const ROWS = 20;
const COLUMNS = 10;
const SIZE_SQUARE = 20;

canvas.width = COLUMNS * SIZE_SQUARE;
canvas.height = ROWS * SIZE_SQUARE;

context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

function drawSquare(x, y, color) {
	context.fillStyle = color;
	context.strokeStyle = 'white';
	context.fillRect(x * SIZE_SQUARE, y * SIZE_SQUARE, SIZE_SQUARE, SIZE_SQUARE);
	context.strokeRect(x * SIZE_SQUARE, y * SIZE_SQUARE, SIZE_SQUARE, SIZE_SQUARE);
}


