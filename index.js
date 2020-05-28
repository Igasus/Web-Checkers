let field = document.getElementById("field");
let background = document.getElementById("background");
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'E'];
let map = [];
let activatedCells = [];
let turn = 1;
let selectedFigure;
let clearedFigures = [];
let inProcess = false;

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

				newElement.addEventListener("click", async e => {
					inProcess = true;

					let cellActivated = false;
					for (let cell of activatedCells)
						if (cell.x == x - 1 && cell.y == y - 1) {
							cellActivated = true;
							break;
						}

					if (!cellActivated)
						return;

					setCellsColor(activatedCells, "black");
					activatedCells = [];
					
					let toClearFigure;
					let selectedFigureCoordinates = getFigureCoordinates(selectedFigure);
					if (Math.abs(selectedFigureCoordinates.x - x + 1) == 2)
						toClearFigure = getFigure((selectedFigureCoordinates.x + x - 1) / 2, (selectedFigureCoordinates.y + y - 1) / 2);
					
					await moveFigure(selectedFigure, x - 1, y - 1);
					if (toClearFigure) {
						await clearFigure(toClearFigure);
						let mustSteps = getMustSteps(x - 1, y - 1)
						if (mustSteps.length == 0)
							changeTurn();
						else {
							activatedCells = mustSteps;
							setCellsColor(activatedCells, "red");
						}
					}
					else
						changeTurn();

					inProcess = false;
				});

				newElement.addEventListener("mouseover", e => {
					let cellActivated = false;
					for (let cell of activatedCells)
						if (cell.x == x - 1 && cell.y == y - 1) {
							cellActivated = true;
							break;
						}
					if (!cellActivated)
						return;
					newElement.style.cursor = "pointer";
					setCellsHeight([{x: x - 1, y: y - 1}], -5);
				});

				newElement.addEventListener("mouseleave", e => {
					newElement.style.cursor = "default";
					setCellsHeight([{x: x - 1, y: y - 1}], -20);
				});
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

	field.style.transform = `rotateX(${verticalAngle}rad) rotateY(${horizontalAngle}rad) rotateZ(${90 - turn * 90}deg)`;
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

	figure.addEventListener("click", e => {
		if (inProcess)
			return;
		let mustStepsFigures = getMustStepsFigures();
		let breakFunction = true;
		if (mustStepsFigures.length > 0) {
			for (let element of mustStepsFigures)
				if (element == figure) {
					breakFunction = false;
					break;
				}
		}
		else if (turn == (figure.style.color == "white" ? 1 : -1) && !isCleared(figure))
			breakFunction = false;
		if (breakFunction)
			return;
		if (selectedFigure && selectedFigure != figure)
			return;
		setCellsColor(activatedCells, "black");
		activatedCells = getNextStepCellsCoordinates(figure);
		setCellsColor(activatedCells, "red");
		selectedFigure = figure;
	});

	figure.addEventListener("mouseover", e => {
		if (inProcess)
			return;
		let mustStepsFigures = getMustStepsFigures();
		let breakFunction = true;
		if (mustStepsFigures.length > 0) {
			for (let element of mustStepsFigures)
				if (element == figure) {
					breakFunction = false;
					break;
				}
		}
		else if (turn == (figure.style.color == "white" ? 1 : -1) && !isCleared(figure))
			breakFunction = false;
		if (breakFunction)
			return;
		if (selectedFigure && selectedFigure != figure)
			return;
		nextCoordinates = getNextStepCellsCoordinates(figure);
		setCellsColor(nextCoordinates, "orange", true);
		setCellsHeight(nextCoordinates, -5);
		figure.style.transform = "translateZ(25px)";
		figure.style.cursor = "pointer";
	});

	figure.addEventListener("mouseleave", e => {
		if (inProcess)
			return;
		if (isCleared(figure))
			return;
		nextCoordinates = getNextStepCellsCoordinates(figure);
		setCellsColor(nextCoordinates, "black", true);
		setCellsHeight(nextCoordinates, -20);
		figure.style.cursor = "default";
		figure.style.transform = "translateZ(5px)";
	});

	field.appendChild(figure);

	return figure;
}

setFigurePlace = (figure, x, y) => {
	let currentCoordinates = getFigureCoordinates(figure);
	let startPosition = {
		x: 78,
		y: 70
	};

	figure.style.left = `${startPosition.x + 82 * x}px`;
	figure.style.top = `${startPosition.y + 82 * y}px`;
	figure.style.right = "auto";
	figure.style.bottom = "auto";

	if (currentCoordinates.x >= 0 && currentCoordinates.x < 8 && currentCoordinates.y >= 0 && currentCoordinates.y < 8)
		map[currentCoordinates.x][currentCoordinates.y] = 0;
	if (x >= 0 && x < 8 && y >= 0 && y < 8)
		map[x][y] = figure.style.color == "black" ? -1 : 1;
}

moveFigure = async (figure, x, y) => {
	animationDuration = 600;
	let moving = new Promise((resolve, reject) => {
		figure.style.transition = `transform ${animationDuration / 2000}s linear, left ${animationDuration / 1000}s ease-in-out, top ${animationDuration / 1000}s ease-in-out`;
		figure.style.transform = "translateZ(50px)";
		setFigurePlace(figure, x, y);
		setTimeout(() => {
			figure.style.transform = "translateZ(5px)";
			setTimeout(() => {
				figure.style.transition = "all 0.1s ease-in-out";
				resolve();
			}, animationDuration / 2);
		}, animationDuration / 2);
	});
	return await moving;
}

clearFigure = async figure => {
	await moveFigure(figure, -3, -3);
	clearedFigures.push(figure);
}

isCleared = figure => {
	for (let element of clearedFigures)
		if (element == figure)
			return true;
	return false;
}

changeTurn = () => {
	let rotatingDuration = 1000;
	turn *= -1;
	selectedFigure = null;
	field.style.transition = `transform ${rotatingDuration / 1000}s ease-in-out`;
	field.style.transform = `rotateX(${verticalAngle}rad) rotateY(${horizontalAngle}rad) rotateZ(${90 - turn * 90}deg)`;
	setTimeout(() => {
		field.style.transition = "none";
	}, rotatingDuration);
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

getFigure = (x, y) => {
	let allFigures = field.getElementsByClassName("figure");
	for (let element of allFigures) {
		let coordinates = getFigureCoordinates(element);
		if (coordinates.x == x && coordinates.y == y)
			return element;
	}
}




getMustSteps = (figureX, figureY) => {
	let result = [];

	if (figureX >= 2 && figureY >= 2)
		if (map[figureX - 1][figureY - 1] == -map[figureX][figureY])
			if (map[figureX - 2][figureY - 2] == 0)
				result.push({
					x: figureX - 2,
					y: figureY - 2
				});

	if (figureX <= 5 && figureY >= 2)
		if (map[figureX + 1][figureY - 1] == -map[figureX][figureY])
			if (map[figureX + 2][figureY - 2] == 0)
				result.push({
					x: figureX + 2,
					y: figureY - 2
				});

	if (figureX >= 2 && figureY <= 5)
		if (map[figureX - 1][figureY + 1] == -map[figureX][figureY])
			if (map[figureX - 2][figureY + 2] == 0)
				result.push({
					x: figureX - 2,
					y: figureY + 2
				});

	if (figureX <= 5 && figureY <= 5)
		if (map[figureX + 1][figureY + 1] == -map[figureX][figureY])
			if (map[figureX + 2][figureY + 2] == 0)
				result.push({
					x: figureX + 2,
					y: figureY + 2
				});

	return result;
}

getMustStepsFigures = () => {
	let allFigures = field.getElementsByClassName("figure");
	let result = [];
	for (let x = 0; x < 8; x++)
		for (let y = 0; y < 8; y++)
			if (map[x][y] == turn) {
				let mustSteps = getMustSteps(x, y);
				if (mustSteps.length > 0)
					result.push(getFigure(x, y));
			}
	return result;
}



getNextStepCellsCoordinates = figure => {
	let figureCoordinates = getFigureCoordinates(figure);
	let figureX = figureCoordinates.x;
	let figureY = figureCoordinates.y;
	let mustSteps = getMustSteps(figureX, figureY);

	if (mustSteps.length > 0)
		return mustSteps;

	let result = [];

	if (turn == 1 && figureX >= 1 && figureY >= 1)
		if (map[figureX - 1][figureY - 1] == 0)
			result.push({
				x: figureX - 1,
				y: figureY - 1
			});

	if (turn == 1 && figureX <= 6 && figureY >= 1)
		if (map[figureX + 1][figureY - 1] == 0)
			result.push({
				x: figureX + 1,
				y: figureY - 1
			});

	if (turn == -1 && figureX >= 1 && figureY <= 6)
		if (map[figureX - 1][figureY + 1] == 0)
			result.push({
				x: figureX - 1,
				y: figureY + 1
			});

	if (turn == -1 && figureX <= 6 && figureY <= 6)
		if (map[figureX + 1][figureY + 1] == 0)
			result.push({
				x: figureX + 1,
				y: figureY + 1
			});

	return result;
}



setCellsColor = (cellsCoordinates, color, activatdBlock = false) => {
	toActivateCells = [];
	if (activatdBlock) {
		for (let toColor of cellsCoordinates) {
			let toAdd = true;
			for (let activatedCell of activatedCells)
				if (toColor.x == activatedCell.x && toColor.y == activatedCell.y)
					toAdd = false;

			if (toAdd)
				toActivateCells.push(toColor);
		}
	}
	else
		toActivateCells = activatedCells;
	
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
				let figure = createNewFigure(color, 15);
				setFigurePlace(figure, x, y);
			}
		}
}

document.getElementById("refresh").addEventListener("click", e => {
	let classList = field.getElementsByClassName("figure");
	while (classList[0])
		field.removeChild(classList[0]);

	fillField();	
});


generate();

