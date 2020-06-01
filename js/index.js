let field;
let dragZone;
const figure_radius = 30;
const figure_height = 25;
const wall_segments_amount = 12;
const figure_replacing_duration = 500;
const figure_replacing_lifting_height = figure_height + 20;

const field_border_size = 50;
const field_square_size = 80;

let inProcess = false;





toRadians = (angleInDegrees) => angleInDegrees * Math.PI / 180;
isChildOf = (child, father) => child.parentNode == father;
getSign = (number) => number > 0 ? 1 : number < 0 ? -1 : 0;
isQueen = (x, y) => Math.abs(map[x][y]) == 2;
defaultColor = (x, y) => (x + y) % 2 == 0 ? "white" : "black";





onFigureMouseEnter = event => {
	let figure = event.target;
	let figureCoordinates = getFigureCoordinates(figure);
	let x = figureCoordinates.x;
	let y = figureCoordinates.y;

	if (getSign(map[x][y]) != currentMoveColor)
		return;

	let possibleMoves = getPossibleMoves(x, y);
	for (let move of possibleMoves)
		setFieldSquareColor(move.moveX, move.moveY, "orange", "red");
}





onFigureMouseLeave = event => {
	let figure = event.target;
	setAllFieldSquaresDefaultColor("red");
}





onFigureClick = event => {
	let figure = event.target.classList.contains("figure") ? event.target : event.target.parentNode;
	let figureCoordinates = getFigureCoordinates(figure);
	let x = figureCoordinates.x;
	let y = figureCoordinates.y;

	if (getSign(map[x][y]) != currentMoveColor)
		return;

	selectedFigure = null;
	setAllFieldSquaresDefaultColor();
	let possibleMoves = getPossibleMoves(x, y);
	for (let move of possibleMoves)
		setFieldSquareColor(move.moveX, move.moveY, "red");

	if (possibleMoves.length > 0)
		selectedFigure = figure;
}





onBlackSquareClick = event => {
	let square = event.target;
	let splitedId = square.id.split('_');
	let x = parseInt(splitedId[splitedId.length - 2]);
	let y = parseInt(splitedId[splitedId.length - 1]);

	if (selectedFigure)
		makeMove(x, y);
}





onModeFormRadioClick = event => {
	let rotatingEnabled = event.target.value == "rotating" ? true : false;
	dragZone.style.display = rotatingEnabled ? "block" : "none";
}





setAllEventListeners = () => {
	dragZone.addEventListener("mousedown", 	event => { if (!inProcess) startFieldRotating(event.clientX, event.clientY); });
	dragZone.addEventListener("mouseup", 	event => { if (!inProcess) endFieldRotating() });
	dragZone.addEventListener("mousemove", 	event => { if (!inProcess) rotateField(event.clientX, event.clientY) });
	dragZone.addEventListener("wheel", 		event => { if (!inProcess) zoomField(event.deltaY) });

	let figures = field.getElementsByClassName("figure");
	for (let i = 0; i < figures.length; i++) {
		figures[i].addEventListener("mouseenter", onFigureMouseEnter);
		figures[i].addEventListener("mouseleave", onFigureMouseLeave);
		figures[i].addEventListener("click", onFigureClick);
		console.log()
	}

	for (let x = 0; x < 8; x++)
		for (let y = 0; y < 8; y++)
			if (defaultColor(x, y) == "black") {
				let square = document.getElementById(`figure_table_square_${x}_${y}`);
				square.addEventListener("click", onBlackSquareClick);
			}

	document.getElementById("playing_radio").addEventListener("click", onModeFormRadioClick);
	document.getElementById("rotating_radio").addEventListener("click", onModeFormRadioClick);
}





document.addEventListener("DOMContentLoaded", event => {
	field = document.getElementById("field");
	dragZone = document.getElementById("drag_zone");

	generateField();
	refreshMap();
	generateMap();
	setAllEventListeners(dragZone);
});