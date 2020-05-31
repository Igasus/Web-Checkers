generateField = () => {
	for (let i = 0; i < 5; i++) {
		let fieldSide = document.createElement("div");
		fieldSide.classList.add("field-side");
		fieldSide.id = `field_side_${i}`;
		document.getElementById("field").appendChild(fieldSide);
	}
	generateFieldTable();
}





generateFieldTable = () => {

	let lettersRow = () => {
		let cornerElement = () => {
			let element = document.createElement("td");
			element.classList.add("field-table-corner-element");

			return element;
		}

		let letters = [ "A", "B", "C", "D", "E", "F", "G", "E" ];
		let row = document.createElement("tr");

		row.appendChild(cornerElement());
		for (let letter of letters) {
			let letterElement = document.createElement("td");
			letterElement.classList.add("field-table-letter-element");
			letterElement.innerHTML = letter;
			row.appendChild(letterElement);
		}
		row.appendChild(cornerElement());

		return row;
	}

	let numberElement = (number) => {
		let element = document.createElement("td");
		element.classList.add("field-table-number-element");
		element.innerHTML = number;

		return element;
	}

	let table = document.getElementById("field_table");
	
	table.appendChild(lettersRow());
	for (let i = 0; i < 8; i++) {
		let row = document.createElement("tr");

		row.appendChild(numberElement(i + 1));
		for (let j = 0; j < 8; j++) {
			let tableFigureElement = document.createElement("td");
			tableFigureElement.classList.add("field-table-figure-element");
			tableFigureElement.style.backgroundColor = (i + j) % 2 == 0 ? "white" : "black";
			row.appendChild(tableFigureElement);
		}
		row.appendChild(numberElement(i + 1));

		document.getElementById("field_table").appendChild(row);
	}
	table.appendChild(lettersRow());
}





setAllEventListeners = () => {
	document.getElementById("drag_field").addEventListener("mousedown", event => startFieldRotating(event.clientX, event.clientY));
	document.getElementById("drag_field").addEventListener("mouseup", event => endFieldRotating());
	document.getElementById("drag_field").addEventListener("mousemove", event => rotateField(event.clientX, event.clientY));
	document.getElementById("drag_field").addEventListener("wheel", event => zoomField(event.deltaY));
}





document.addEventListener("DOMContentLoaded", event => {
	generateField();

	setAllEventListeners();
});