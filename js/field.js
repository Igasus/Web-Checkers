generateField = () => {
	for (let i = 0; i < 5; i++) {
		let fieldSide = document.createElement("div");
		fieldSide.classList.add("field-side");
		fieldSide.id = `field_side_${i}`;
		field.appendChild(fieldSide);
	}
	generateFieldTable();
}





generateFieldTable = () => {
	let table = document.createElement("table");
	table.id = "field_table";

	let createLettersRow = () => {
		let createCornerElement = () => {
			let element = document.createElement("td");
			element.classList.add("field-table-corner-element");

			return element;
		}

		let letters = [ "A", "B", "C", "D", "E", "F", "G", "E" ];
		let row = document.createElement("tr");

		row.appendChild(createCornerElement());
		for (let letter of letters) {
			let letterElement = document.createElement("td");
			letterElement.classList.add("field-table-letter-element");
			letterElement.innerHTML = letter;
			row.appendChild(letterElement);
		}
		row.appendChild(createCornerElement());

		return row;
	}

	let numberElement = (number) => {
		let element = document.createElement("td");
		element.classList.add("field-table-number-element");
		element.innerHTML = number;

		return element;
	}

	
	
	table.appendChild(createLettersRow());
	for (let y = 0; y < 8; y++) {
		let row = document.createElement("tr");

		row.appendChild(numberElement(y));
		for (let x = 0; x < 8; x++) {
			let tableFigureElement = document.createElement("td");
			tableFigureElement.id = `figure_table_square_${x}_${y}`;
			tableFigureElement.classList.add("field-table-figure-element");
			tableFigureElement.style.backgroundColor = defaultColor(x, y);
			row.appendChild(tableFigureElement);
		}
		row.appendChild(numberElement(y));

		table.appendChild(row);
	}
	table.appendChild(createLettersRow());

	field.appendChild(table);
}





setFieldSquareColor = (x, y, color, bannedColor = null) => {
	let square = document.getElementById(`figure_table_square_${x}_${y}`);
	
	if (square.style.backgroundColor == bannedColor)
		return;

	square.style.backgroundColor = color;
}





setAllFieldSquaresDefaultColor = (bannedColor = null) => {
	for (let x = 0; x < 8; x++)
		for (let y = 0; y < 8; y++) {
			let square = document.getElementById(`figure_table_square_${x}_${y}`);
			if (square.style.backgroundColor != bannedColor)
				square.style.backgroundColor = defaultColor(x, y);
		}
}





clearField = () => {
	setAllFieldSquaresDefaultColor();
	let figures = field.getElementsByClassName("figure");
	for (let figure of figures)
		field.removeChild(figure);
}





generateMap = () => {
	clearField();

	for (let y = 0; y < 8; y++)
		for (let x = 0; x < 8; x++)
			if (map[x][y] == 1) {
				let figure = createFigure("white");
				replaceFigure(figure, x, y);
			}
			else if (map[x][y] == -1) {
				let figure = createFigure("black");
				replaceFigure(figure, x, y);
			}
}