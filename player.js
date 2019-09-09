function Player() {
	this.matrix = randomTetrimino();
	this.nextMatrix = randomTetrimino();
	(this.position = {
		x: 0,
		y: 0,
	}),
		(this.life = 3),
		(this.score = 0),
		(this.level = 1),
		(this.rowCount = 0);
}

Player.prototype.move = function(direction) {
	this.position.x += direction;
	if (collide(arena, this)) {
		this.position.x += -direction;
	}
	dropCounter = 0;
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

	while (collide(arena, this)) {
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
	this.nextMatrix = randomTetrimino();
	this.position.y = 0;
	this.position.x = Math.floor(arena[0].length / 2 - this.matrix[0].length / 2);
	if (collide(arena, this)) {
		this.life--;
		arena.forEach(row => {
			row.fill(0);
		});
	}
};

Player.prototype.drop = function() {
	this.position.y++;
	if (collide(arena, this)) {
		this.position.y--;
		merge(arena, this);
		this.reset();
		checkFullRow();
	}
	dropCounter = 0;
};

