let field = document.getElementById("field");
let background = document.getElementById("background");
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'E'];

let generate = () => {
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
				newElement.id = `${x}_${y}`;
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




let createNewFigure = (color, segmentsAmount = 10) => {
	let figure = document.createElement("div");
	figure.classList.add("figure");
	figure.classList.add(color);
	
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

let setFigure = (figure, x, y) => {
	let startPosition = {
		x: 78,
		y: 70
	};

	figure.style.left = `${startPosition.x + 82 * x}px`;
	figure.style.top = `${startPosition.y + 82 * y}px`;
	figure.style.right = "auto";
	figure.style.bottom = "auto";
}





fillField = () => {
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			if (y == 3 || y == 4)
				break;

			if ((x + y) % 2 == 0) {
				let color = y < 3 ? "black" : "white";
				let figure = createNewFigure(color, 20);
				setFigure(figure, x, y);
				field.appendChild(figure);
			}
		}
	}
}





generate();
fillField();