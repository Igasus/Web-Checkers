createFigure = (color) => {
	let figure = document.createElement("div");
	figure.style.width = `${2 * figure_radius}px`;
	figure.style.height = `${2 * figure_radius}px`;
	figure.classList.add("figure");

	let floor = document.createElement("div");
	floor.classList.add("figure-floor");
	floor.style.backgroundColor = color;
	figure.appendChild(floor);

	let ceil = document.createElement("div");
	ceil.classList.add("figure-ceil");
	ceil.style.transform = `translateZ(${figure_height}px)`;
	ceil.style.backgroundColor = color;
	figure.appendChild(ceil);

	const segmentAngle = 360 / wall_segments_amount

	for (let i = 0; i < wall_segments_amount; i++) {
		let width = 2 * Math.PI * figure_radius / wall_segments_amount - 2;
		let height = figure_height - 2;
		let angle = i * segmentAngle;
		let distance = figure_radius * Math.cos(toRadians(segmentAngle / 2)) - 1;

		let wall = document.createElement("div");
		wall.classList.add("figure-wall");
		wall.style.width = `${width}px`;
		wall.style.height = `${height}px`;
		wall.style.transform = `translateX(calc(-50% - 1px)) translateY(calc(-50% - 1px)) rotateX(90deg) rotateY(${angle}deg) translateZ(${distance}px) translateY(50%)`;
		wall.style.backgroundColor = color;

		figure.appendChild(wall);
	}

	return figure;
}





replaceFigure = async (figure, x, y) => {
	let promise = new Promise((resolve, reject) => {
		let top = (field_border_size + field_square_size * (y + 0.5)) + "px";
		let left = (field_border_size + field_square_size * (x + 0.5)) + "px";

		if (isChildOf(figure, field)) {
			let startCoordinates = getFigureCoordinates(figure);
			let startX = startCoordinates.x;
			let startY = startCoordinates.y;

			inProcess = true;
			figure.transition = `top ${figure_replacing_duration}ms linear, left ${figure_replacing_duration}ms linear, transform ${figure_replacing_duration / 2}ms ease-in-out`;
			figure.style.transform = `translate3d(-50%, -50%, ${figure_replacing_lifting_height}px)`;
			figure.style.top = top;
			figure.style.left = left;
			setTimeout(() => {
				figure.style.transform = "translate3d(-50%, -50%, 1px)";
				setTimeout(() => {
					inProcess = false;
					map[x][y] = map[startX][startY];
					map[startX][startY] = 0;

					figuresMap[x][y] = figure;
					figuresMap[startX][startY] = null;

					resolve();
				}, figure_replacing_duration);
			}, figure_replacing_duration);
		}
		else {
			figure.style.top = top;
			figure.style.left = left;
			field.appendChild(figure);

			map[x][y] = figure.getElementsByClassName("figure-ceil")[0].style.backgroundColor == "white" ? 1 : -1;
			figuresMap[x][y] = figure;
			resolve();
		}
	});
	
	await promise;
}





removeFigure = async (x, y) => {
	let promise = new Promise((resolve, reject) => {
		let figure = figuresMap[x][y];
		figure.style.transition = "opacity 0.2s ease-in-out";
		figure.style.opacity = "0";
		setTimeout(() => {
			field.removeChild(figure);
			figuresMap[x][y] = null;
			map[x][y] = 0;
			resolve();
		}, 200);
	});
	
	await promise;
}





makeFigureQueen = (x, y) => {
	let figure = figuresMap[x][y];
	let walls = figure.getElementsByClassName("figure-wall");
	for (wall of walls)
		wall.style.backgroundColor = "gold";

	map[x][y] *= 2;
}





getFigureCoordinates = figure => {
	let left = parseInt(figure.style.left.slice(0, -2));
	let top = parseInt(figure.style.top.slice(0, -2));

	let resultX = Math.floor((left - field_border_size) / field_square_size);
	let resultY = Math.floor((top - field_border_size) / field_square_size);
	
	let result = {
		x: resultX,
		y: resultY
	};

	return result;
}