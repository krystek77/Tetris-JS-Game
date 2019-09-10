const canvas = document.querySelector('.tetris');
const tetris = new Tetris(canvas);

function control(event) {
	if (event.key === 'ArrowLeft') {
		tetris.player.move(-1);
	} else if (event.key === 'ArrowRight') {
		tetris.player.move(+1);
	} else if (event.key === 'ArrowUp') {
		tetris.player.rotate(1);
	} else if (event.key === 'ArrowDown') {
		tetris.player.rotate(-1);
	} else if (event.key === 'd') {
		tetris.player.drop();
	}
}
window.addEventListener('keydown', control);
canvas.addEventListener('click', () => tetris.resetGame(event));

