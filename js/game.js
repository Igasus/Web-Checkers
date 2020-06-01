let map = [
	[ 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0 ],
	[ 0, 0, 0, 0, 0, 0, 0, 0 ],
];
let figuresMap = [
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ]
];
let selectedFigure = null;
let currentMoveColor = 1;





refreshMap = () => {
	map = [];
	figuresMap = [];

	for (let x = 0; x < 8; x++) {
		let row = [];
		let figuresRow = [];
		for (let y = 0; y < 8; y++) {
			if ((x + y) % 2 == 1) {
				if (y < 3)
					row.push(-1);
				else if (y >= 5)
					row.push(1);
				else
					row.push(0);
			}
			else
				row.push(0);

			figuresRow.push(null);
		}
			
		map.push(row);
		figuresMap.push(figuresRow);
	}
}





getQueenObligatoryMovesInDirection = (x, y, dx, dy, color = getSign(map[x][y])) => {
	let result = [];

	let firstOpposite;
	let secondOpposite;

	let currentX = x + dx;
	let currentY = y + dy;

	while (currentX >= 0 && currentX <= 7 && currentY >= 0 && currentY <= 7 && !secondOpposite) {
		if (getSign(map[currentX][currentY]) == color)
			secondOpposite = {
				x: currentX,
				y: currentY
			};
		if (getSign(map[currentX][currentY]) == -1 * color)
			if (firstOpposite)
				secondOpposite = {
					x: currentX,
					y: currentY
				};
			else
				firstOpposite = {
					x: currentX,
					y: currentY
				};
		currentX += dx;
		currentY += dy;
	}

	if (firstOpposite) {
		currentX = firstOpposite.x + dx;
		currentY = firstOpposite.y + dy;
		while (currentX >= 0 && currentX <= 7 && currentY >= 0 && currentY <= 7 &&
			  (!secondOpposite || currentX != secondOpposite.x && currentY != secondOpposite.y)
			) {
			result.push({
				moveX: currentX,
				moveY: currentY,
				beatenX: firstOpposite.x,
				beatenY: firstOpposite.y
			});
			currentX += dx;
			currentY += dy
		}
	}

	return result;
}





getSimpleObligatoryMovesInDirection = (x, y, dx, dy, color = getSign(map[x][y])) => {
	let result = [];

	let borderLeft 	 = Math.max(0, -2 * dx);
	let borderRight  = Math.min(0, -2 * dx) + 7;
	let borderTop 	 = Math.max(0, -2 * dy);
	let borderBottom = Math.min(0, -2 * dy) + 7;

	if (x >= borderLeft && x <= borderRight && y >= borderTop && y <= borderBottom)
		if (getSign(map[x + dx][y + dy]) == -1 * color && getSign(map[x + 2 * dx][y + 2 * dy]) == 0)
			result.push({
				moveX: x + 2 * dx,
				moveY: y + 2 * dy,
				beatenX: x + dx,
				beatenY: y + dy
			});

	return result;
}





getObligatoryMovesInDirection = (x, y, dx, dy, color = getSign(map[x][y])) => {
	let result = [];

	if (isQueen(x, y))
		result = getQueenObligatoryMovesInDirection(x, y, dx, dy);
	else
		result = getSimpleObligatoryMovesInDirection(x, y, dx, dy);

	return result;
}





getObligatoryMoves = (x, y, color = getSign(map[x][y])) => {
	let result = [];

	for (let dx = -1; dx <= 1; dx += 2)
		for (let dy = -1; dy <= 1; dy += 2) {
			let obligatoryMoves = getObligatoryMovesInDirection(x, y, dx, dy);
			result = result.concat(obligatoryMoves);
		}
	
	return result;
}





getAllObligatoryMoves = color => {
	let result = [];

	for (let x = 0; x < 8; x++)
		for (let y = 0; y < 8; y++)
			if (getSign(map[x][y]) == color)
				if (getObligatoryMoves(x, y).length != 0) {
					let obligatoryMoves = getObligatoryMoves(x, y);
					result = result.concat(obligatoryMoves);
				}

	return result;
}





allObligatoryMovesContain = (x, y) => {
	let color = getSign(map[x][y]);

	let allObligatoryMoves = getAllObligatoryMoves(color);
	let currentFigureObligatoryMoves = getObligatoryMoves(x, y);

	let obligatoryMoveExist = allObligatoryMoves.length > 0;
	let currentFigureContainsObligatoryMoves = currentFigureObligatoryMoves.length > 0;

	return obligatoryMoveExist == currentFigureContainsObligatoryMoves;
}





getQueenPossibleMoves = (x, y, color = getSign(map[x][y])) => {
	let result = [];

	for (let dx = -1; dx <= 1; dx += 2)
		for (let dy = -1; dy <= 1; dy += 2) {
			let currentX = x + dx;
			let currentY = y + dy;

			while (currentX >= 0 && currentX <= 7 && currentY >= 0 && currentY <= 7 && getSign(map[currentX][currentY]) == 0) {
				result.push({
					moveX: currentX,
					moveY: currentY,
					beatenX: null,
					beatenY: null
				});

				currentX += dx;
				currentY += dy;
			}
		}

	return result;
}





getSimplePossibleMoves = (x, y, color = getSign(map[x][y])) => {
	let result = [];

	if (color == 1) {
		if (x > 0 && y > 0 && map[x - 1][y - 1] == 0)
			result.push({
				moveX: x - 1,
				moveY: y - 1,
				beatenX: null,
				beatenY: null
			});

		if (x < 7 && y > 0 && map[x + 1][y - 1] == 0)
			result.push({
				moveX: x + 1,
				moveY: y - 1,
				beatenX: null,
				beatenY: null
			});
	}

	else if (color == -1) {
		if (x > 0 && y < 7 && map[x - 1][y + 1] == 0)
			result.push({
				moveX: x - 1,
				moveY: y + 1,
				beatenX: null,
				beatenY: null
			});

		if (x < 7 && y < 7 && map[x + 1][y + 1] == 0)
			result.push({
				moveX: x + 1,
				moveY: y + 1,
				beatenX: null,
				beatenY: null
			});
	}

	return result;
}





getPossibleMoves = (x, y, color = getSign(map[x][y])) => {
	let result = [];

	if (allObligatoryMovesContain(x, y)) {
		let obligatoryMoves = getObligatoryMoves(x, y);
		if (obligatoryMoves.length > 0)
			return obligatoryMoves;

		if (isQueen(x, y)) {
			result = getQueenPossibleMoves(x, y);
			return result;
		}

		result = getSimplePossibleMoves(x, y);
	}

	return result;
}





findSelectedFigurePossibleMove = (x, y) => {
	let figureCoordinates = getFigureCoordinates(selectedFigure);
	let possibleMoves = getPossibleMoves(figureCoordinates.x, figureCoordinates.y);

	for (let move of possibleMoves)
		if (move.moveX == x && move.moveY == y)
			return move;
}
	





makeMove = async (x, y) => {
	let move = findSelectedFigurePossibleMove(x, y);

	if (!move)
		return;

	if (currentMoveColor == 1 && y == 0 || currentMoveColor == -1 && y == 7)
		if (!isQueen(x, y))
			makeFigureQueen(x, y);

	setAllFieldSquaresDefaultColor();

	await replaceFigure(selectedFigure, x, y);
	if ((move.beatenX || move.beatenX == 0) && (move.beatenY || move.beatenY == 0)) {
		await removeFigure(move.beatenX, move.beatenY);
		let obligatoryMoves = getObligatoryMoves(x, y);
		if (obligatoryMoves.length > 0) {
			for (obligatoryMove of obligatoryMoves)
				setFieldSquareColor(obligatoryMove.moveX, obligatoryMove.moveY, "red");
			return;
		}
	}

	selectedFigure = null;
	currentMoveColor *= -1;
}