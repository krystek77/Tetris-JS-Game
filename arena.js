function Arena() {
	this.board = createMatrix(COLUMNS, ROWS);
}
Arena.prototype.checkFullRow = function() {
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

Arena.prototype.collide = function(player){
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
}


// /**
//  * Check collision
//  *
//  * @param {Array} arena
//  * @param {Object} player
//  * @returns
//  */
// function collide(arena, player) {
// 	//true && undefined = undefined
// 	for (let y = 0; y < player.matrix.length; ++y) {
// 		for (let x = 0; x < player.matrix[y].length; ++x) {
// 			if (
// 				player.matrix[y][x] !== 0 &&
// 				(arena[y + player.position.y] && arena[y + player.position.y][x + player.position.x]) !== 0
// 			) {
// 				return true;
// 			}
// 		}
// 	}

// 	return false;
// }
