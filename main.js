const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
canvas.width = 10 * 20;
canvas.height = 20 * 20;

context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

context.strokeStyle = 'white';
context.strokeRect(0, 0, canvas.width, canvas.height);
