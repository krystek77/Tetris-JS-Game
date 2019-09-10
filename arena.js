function Arena(columns, rows, tetris) {
	this.tetris = tetris;
	this.columns = columns;
	this.rows = rows;
	this.board = this.createMatrix(this.columns, this.rows);
}

Arena.prototype.drawArena = function(arena, offset) {
	arena.board.forEach((row, y) => {
		row.forEach((value, x) => {
			this.tetris.drawSquare(x + offset.x, y + offset.y, this.tetris.colors[value]);
		});
	});
};

Arena.prototype.createMatrix = function(columns, rows) {
	return Array.from({ length: rows }, row => Array.from({ length: columns }).fill(0));
};

Arena.prototype.checkFullRow = function(player) {
	let rowCounter = 1;
	for (let y = this.board.length - 1; y > 0; y--) {
		let isFullRow = true;
		for (let x = 0; x < this.board[y].length; x++) {
			isFullRow = isFullRow && this.board[y][x] != 0;
		}
		if (isFullRow) {
			const row = this.board.splice(y, 1)[0].fill(0);
			this.board.unshift(row);
			player.score += rowCounter * 10;
			player.rowCount++;

			if (player.score - player.lastScores >= this.tetris.SCORE_INTERVAL) {
				player.lastScores = player.score;
				if (player.level <= this.tetris.MAX_LEVEL) {
					player.level += 1;
				}
			}
			y++;
			rowCounter *= 2;
		}
	}
};

Arena.prototype.merge = function(player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				if (
					player.position.x + x >= 0 &&
					player.position.x + x < this.board[0].length &&
					player.position.y + y >= 0 &&
					player.position.y + y < this.board.length
				) {
					this.board[y + player.position.y][x + player.position.x] = value;
				}
			}
		});
	});
};

Arena.prototype.collide = function(player) {
	for (let y = 0; y < player.matrix.length; ++y) {
		for (let x = 0; x < player.matrix[y].length; ++x) {
			if (
				player.matrix[y][x] !== 0 &&
				(this.board[y + player.position.y] && this.board[y + player.position.y][x + player.position.x]) !== 0
			) {
				return true;
			}
		}
	}

	return false;
};
