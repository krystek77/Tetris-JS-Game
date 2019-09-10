function Tetris(canvas) {
	const ROWS = 20;
	const COLUMNS = 10;
	let stop;

	this.SIZE_SQUARE = 20;
	this.MARGIN_TOP = 4;
	this.MARGIN_BOTTOM = 4;
	this.MARGIN_LEFT = 3;
	this.MARGIN_RIGHT = 3;
	this.SCORE_INTERVAL = 100;
	this.MAX_LEVEL = 10;
	this.dropCounter = 0;

	this.colors = ['#000000', '#fe0900', '#999999', '#1bffff', '#fdff00', '#ff00fe', '#2600ff', '#01ff00'];

	this.canvas = canvas;
	this.canvas.width = (COLUMNS + this.MARGIN_LEFT + this.MARGIN_RIGHT) * this.SIZE_SQUARE;
	this.canvas.height = (ROWS + this.MARGIN_TOP + this.MARGIN_BOTTOM) * this.SIZE_SQUARE;
	this.context = this.canvas.getContext('2d');

	this.arena = new Arena(COLUMNS, ROWS, this);
	this.player = new Player(this);

	let lastTime = 0;

	this.update = (time = 0) => {
		let deltaTime = time - lastTime;
		let dropInterval = (1000 * (this.MAX_LEVEL - this.player.level + 1)) / 10;
		lastTime = time;
		this.dropCounter += deltaTime;
		if (this.dropCounter > dropInterval) {
			this.player.drop();
		}

		this.draw();
		stop = requestAnimationFrame(this.update);

		if (this.player.life <= 0) {
			cancelAnimationFrame(stop);
			this.drawText(
				'GAME OVER',
				canvas.width / 2 - 50,
				canvas.height / 2 + 30,
				'white',
				'bold 60px sans-serif',
				100
			);
		} else if (this.player.level > this.MAX_LEVEL) {
			this.drawText(
				'THE END GAME',
				canvas.width / 2 - 50,
				canvas.height / 2 + 30,
				'white',
				'bold 60px sans-serif',
				100
			);
			cancelAnimationFrame(stop);
		}
	};
	this.update();
}
Tetris.prototype.drawSquare = function(x, y, color) {
	this.context.fillStyle = color;
	this.context.strokeStyle = 'grey';
	this.context.fillRect(
		(x + this.MARGIN_LEFT) * this.SIZE_SQUARE,
		(y + this.MARGIN_TOP) * this.SIZE_SQUARE,
		this.SIZE_SQUARE,
		this.SIZE_SQUARE
	);
	this.context.strokeRect(
		(x + this.MARGIN_LEFT) * this.SIZE_SQUARE,
		(y + this.MARGIN_TOP) * this.SIZE_SQUARE,
		this.SIZE_SQUARE,
		this.SIZE_SQUARE
	);
};

Tetris.prototype.drawMatrix = function(matrix, offset) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				this.drawSquare(x + offset.x, y + offset.y, this.colors[value]);
			}
		});
	});
};

Tetris.prototype.drawText = function(text, posX, posY, color, font, maxW) {
	this.context.fillStyle = color;
	this.context.font = font;
	this.context.fillText(text, posX, posY, maxW);
};

Tetris.prototype.drawButton = function() {
	this.context.fillStyle = 'red';
	this.context.fillRect(canvas.width - 90, 10, 80, 40);
	this.context.strokeStyle = 'white';
	this.context.strokeRect(canvas.width - 90, 10, 80, 40);
	this.drawText('RESET', canvas.width - 75, 38, 'white', 'bold 20px sans-serif', 50);
};

Tetris.prototype.draw = function() {
	this.context.fillStyle = 'black';
	this.context.fillRect(0, 0, canvas.width, canvas.height);

	this.drawButton();

	this.drawText('SCORE', 60, 20, 'white', 'bold 20px sans-serif', 40);
	this.drawText(this.player.score, 60, 50, 'green', 'bold 40px sans-serif', 100);
	this.drawText('LIFES', 60, canvas.height - 40, 'orange', 'bold 20px sans-serif', 40);
	this.drawText('00' + this.player.life, 60, canvas.height - 10, 'white', 'bold 40px sans-serif', 40);
	this.drawText('LEVEL', canvas.width - 100, canvas.height - 40, 'orange', 'bold 20px sans-serif', 40);
	this.drawText(this.player.level, canvas.width - 100, canvas.height - 10, 'white', 'bold 40px sans-serif', 40);
	this.drawText('ROWS', 10, canvas.height / 2 + 10, 'white', 'bold 20px sans-serif', 40);
	this.drawText(this.player.rowCount, 10, canvas.height / 2 + 40, 'blue', 'bold 40px sans-serif', 40);
	this.arena.drawArena(this.arena, { x: 0, y: 0 });
	this.drawMatrix(this.player.matrix, this.player.position);
	this.drawMatrix(this.player.nextMatrix, { x: -3, y: -1 });
};

Tetris.prototype.resetGame = function(event) {
	const posX = event.offsetX;
	const posY = event.offsetY;
	if (posX > canvas.width - 90 && posX < canvas.width - 90 + 80 && posY > 10 && posY < 10 + 40) {
		this.player.reset();
		this.player.life = 3;
		this.player.score = 0;
		this.player.level = 1;
		this.player.rowCount = 0;
		this.arena.board.forEach(row => {
			row.fill(0);
		});
		requestAnimationFrame(tetris.update);
	}
};
