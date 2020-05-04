let field = document.getElementById("field");
let background = document.getElementById("background");
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'E'];
let map = [];
let activatedCells = [];
let turn = 1;

generate = () => {
	for (let i = 0; i < 8; i++) {
		let arr = [];
		for (let j = 0; j < 8; j++)
			arr.push(0);
		map.push(arr);
	}

	let frontSide = document.getElementById("field_front");

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			let newElement = document.createElement("div");
			if ((y == 0 || y == 9) && (x == 0 || x == 9))
				newElement.classList.add("corner");
			else if (y == 0 || y == 9) {
				newElement.classList.add("letter");
				let letterElement = document.createElement("p");
				letterElement.innerHTML = letters[x - 1];
				newElement.appendChild(letterElement);
			}
			else if (x == 0 || x == 9) {
				newElement.classList.add("number");
				let numberElement = document.createElement("p");
				numberElement.innerHTML = y;
				newElement.appendChild(numberElement);
			}
			else {
				newElement.classList.add("cell");
				newElement.classList.add((x + y) % 2 == 0 ? "black" : "white");
				newElement.id = `${x - 1}_${y - 1}`;
			}

			frontSide.appendChild(newElement);
		}
	}
}





let scrollingStart = false;

let horizontalAngle = 0;
let verticalAngle = 0;

let lastMouseYPosition = 0;
let lastMouseXPosition = 0;

background.addEventListener("mousedown", e => {
	lastMouseXPosition = e.offsetX;
  	lastMouseYPosition = e.offsetY;
	scrollingStart = true;
});

background.addEventListener("mouseup", e => {
	scrollingStart = false;
});

background.addEventListener("mousemove", e => {
	if (!scrollingStart)
		return false;

	let mouseXPosition = e.offsetX;
	let mouseYPosition = e.offsetY;

	let dx = mouseXPosition - lastMouseXPosition;
	let dy = mouseYPosition - lastMouseYPosition;

	lastMouseXPosition = mouseXPosition;
	lastMouseYPosition = mouseYPosition;

	horizontalAngle = ((horizontalAngle + dx * 0.01) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
	verticalAngle = ((verticalAngle - dy * 0.01) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

	field.style.transform = `rotateX(${verticalAngle}rad) rotateY(${horizontalAngle}rad)`;
});





onModeChange = e => {
	let mode = e.target.value;

	if (mode == "rotate")
		background.style.pointerEvents = "auto";
	else
		background.style.pointerEvents = "none";

}




createNewFigure = (color, segmentsAmount = 20) => {
	let figure = document.createElement("div");
	figure.classList.add("figure");
	figure.classList.add(color);
	figure.style.color = color;
	
	let segmentWidth = 70 * Math.PI / segmentsAmount;
	for (let i = 0; i < segmentsAmount; i++) {
		let rotateAngle = i * 360 / segmentsAmount;
		let segment = document.createElement("div");
		segment.classList.add("figure-segment");
		segment.style.transform = `rotateX(90deg) rotateY(${rotateAngle}deg) translateZ(35px) translateY(13px)`;
		segment.style.width = `${segmentWidth}px`;
		figure.appendChild(segment);
	}

	if (color == "white") {
		figure.style.bottom = "-50px";
		figure.style.left = "-60px";
	}
	else {
		figure.style.top = "-70px";
		figure.style.right = "-50px";
	}

	return figure;
}

setFigure = (figure, x, y) => {
	let startPosition = {
		x: 78,
		y: 70
	};

	figure.style.left = `${startPosition.x + 82 * x}px`;
	figure.style.top = `${startPosition.y + 82 * y}px`;
	figure.style.right = "auto";
	figure.style.bottom = "auto";

	field.appendChild(figure);
	map[x][y] = figure.style.color == "black" ? -1 : 1;
}



getFigureCoordinates = figure => {
	let startPosition = {
		x: 78,
		y: 70
	};

	let top = figure.style.top.slice(0, figure.style.top.length - 2);
	let left = figure.style.left.slice(0, figure.style.left.length - 2);
	
	let result = {
		x: (left - startPosition.x) / 82,
		y: (top - startPosition.y) / 82
	};

	return result;
}




getMustSteps = figureCoordinates => {
	let result = [];

	let figureX = figureCoordinates.x;
	let figureY = figureCoordinates.y;
	if (figureX >= 2 && figureY >= 2)
		if (map[figureX - 1][figureY - 1] == -map[figureX][figureY])
			if (map[figureX - 2][figureY - 2] == 0) {
				let coordinates = {
					x: figureX - 2,
					y: figureY - 2
				};
				result.push(coordinates);
			}

	if (figureX <= 5 && figureY >= 2)
		if (map[figureX + 1][figureY - 1] == -map[figureX][figureY])
			if (map[figureX + 2][figureY - 2] == 0) {
				let coordinates = {
					x: figureX + 2,
					y: figureY - 2
				}
				result.push(coordinates);
			}

	return result;
}



getNextStepCellsCoordinates = figure => {
	let figureCoordinates = getFigureCoordinates(figure);
	let figureX = figureCoordinates.x;
	let figureY = figureCoordinates.y;
	let mustSteps = getMustSteps(figureCoordinates);

	if (mustSteps.length > 0)
		return mustSteps;

	let result = [];

	if (figureX >= 1 && figureY >= 1)
		if (map[figureX - 1][figureY - 1] == 0)
			result.push({
				x: figureX - 1,
				y: figureY - 1
			});
	if (figureX <= 6 && figureY >= 1)
		if (map[figureX + 1][figureY - 1] == 0)
			result.push({
				x: figureX + 1,
				y: figureY - 1
			});

	return result;
}



setCellsColor = (cellsCoordinates, color) => {
	toActivateCells = [];
	for (let toColor of cellsCoordinates) {
		let toAdd = true;
		for (let activatedCell of activatedCells)
			if (toColor.x == activatedCell.x && toColor.y == activatedCell.y)
				toAdd = false;

		if (toAdd)
			toActivateCells.push(toColor);
	}
	
	for (let coordinates of toActivateCells)
		document.getElementById(`${coordinates.x}_${coordinates.y}`).style.backgroundColor = color;
}

setCellsHeight = (cellsCoordinates, height) => {
	for (let coordinates of cellsCoordinates)
		document.getElementById(`${coordinates.x}_${coordinates.y}`).style.transform = `translateZ(${height}px)`;
}




fillField = () => {
	for (let y = 0; y < 8; y++) 
		for (let x = 0; x < 8; x++) {
			if (y == 3 || y == 4)
				break;

			if ((x + y) % 2 == 0) {
				let color = y < 3 ? "black" : "white";
				let figure = createNewFigure(color, 20);
				setFigure(figure, x, y);
				figure.addEventListener("click", e => {
					if (turn != (figure.style.color == "white" ? 1 : -1))
						return;

					temporary = activatedCells;
					activatedCells = [];
					setCellsColor(temporary, "black");
					temporary = getNextStepCellsCoordinates(figure);
					setCellsColor(temporary, "red");
					activatedCells = temporary;
				});
				figure.addEventListener("mouseover", e => {
					if (turn != (figure.style.color == "white" ? 1 : -1))
						return;

					nextCoordinates = getNextStepCellsCoordinates(figure);
					setCellsColor(nextCoordinates, "orange");
					setCellsHeight(nextCoordinates, 10);
					figure.style.transform = "translateZ(25px)";
				});
				figure.addEventListener("mouseleave", e => {
					nextCoordinates = getNextStepCellsCoordinates(figure);
					setCellsColor(nextCoordinates, "black");
					setCellsHeight(nextCoordinates, -20);
					figure.style.transform = "translateZ(5px)";
				});
			}
		}
}




generate();
fillField();
