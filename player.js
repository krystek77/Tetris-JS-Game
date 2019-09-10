function Player(tetris) {
	this.tetris = tetris;
	this.arena = tetris.arena;

	this.matrix = this.randomTetrimino();
	this.nextMatrix = this.randomTetrimino();
	(this.position = {
		x: 0,
		y: 0,
	}),
		(this.life = 3),
		(this.score = 0),
		(this.level = 1),
		(this.rowCount = 0),
		(this.lastScores = 0);
	this.reset();
}

Player.prototype.createTetrimino = function(type) {
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
};

Player.prototype.randomTetrimino = function() {
	const tetrominos = 'ITOLJSZ';
	const tetriminoIndex = Math.floor(Math.random() * tetrominos.length);
	return this.createTetrimino(tetrominos.charAt(tetriminoIndex));
};

Player.prototype.move = function(direction) {
	this.position.x += direction;
	if (this.arena.collide(this)) {
		this.position.x += -direction;
	}
	this.tetris.dropCounter = 0;
};

Player.prototype._rotate = function(matrix, direction = 1) {
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
};

Player.prototype.rotate = function(direction) {
	let offset = 1;
	this.matrix = this._rotate(this.matrix, direction);

	while (this.arena.collide(this)) {
		let pos = this.position.x;

		this.position.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if (offset > this.matrix[0].length) {
			this.position.x = pos;
			this.matrix = this._rotate(this.matrix, -direction);
			return;
		}
	}
};

Player.prototype.reset = function() {
	this.matrix = JSON.parse(JSON.stringify(this.nextMatrix));
	this.nextMatrix = this.randomTetrimino();
	this.position.y = 0;
	this.position.x = Math.floor(this.arena.board[0].length / 2 - this.matrix[0].length / 2);
	if (this.arena.collide(this)) {
		this.life--;
		this.arena.board.forEach(row => {
			row.fill(0);
		});
	}
};

Player.prototype.drop = function() {
	this.position.y++;
	if (this.arena.collide(this)) {
		this.position.y--;
		this.arena.merge(this);
		this.reset();
		this.arena.checkFullRow(this);
	}
	this.tetris.dropCounter = 0;
};
