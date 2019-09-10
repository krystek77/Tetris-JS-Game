const canvas = document.querySelector('.tetris');
const tetris = new Tetris(canvas);

const submit = document.querySelector('.game-panel__button');
const reload = document.querySelector('.reload');

function start(event) {
	event.preventDefault();
	const mode = document.forms.mode;
	const value = mode.elements.game.value;
	const gamePanel = document.querySelector('.game-panel');
	const gameWrapper = document.querySelector('.game-wrapper');

	reload.classList.remove('hide');

	switch (value) {
		case 'two players':
			gamePanel.classList.add('hide');
			gameWrapper.classList.remove('hide');
			break;
		default:
			gamePanel.classList.add('hide');
			gameWrapper.classList.remove('hide');
			let children = gameWrapper.children;
			children = [...children];
			children[1].classList.add('hide');
	}
}

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

submit.addEventListener('click', start);
reload.addEventListener('click', function(event) {
	location.reload();
});

// window.addEventListener('keydown', keys);
// window.addEventListener('keyup', keys);

// const keyMap = [];
// /**
//  * 
//  *
//  * @param {Event} event
//  */
// function keys(event) {
// 	if (event.type === 'keydown') {
// 		if (event.keyCode === 32 && !keyMap[event.keyCode]) {
// 			keyMap[event.keyCode] = true;
// 			console.log(event.keyCode);
// 		} else if (event.keyCode === 102 && !keyMap[event.keyCode]) {
// 			keyMap[event.keyCode] = true;
// 			console.log(event.keyCode);
// 		}
// 	} else if (event.type === 'keyup') {
// 		keyMap[event.keyCode] = false;
// 	}
// }
