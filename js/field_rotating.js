let xAngle = 0;
let yAngle = 0;
let zoom = 0;
let nowRotating = false;
let currentX = 0;
let currentY = 0;





startFieldRotating = (mouseX, mouseY) => {
	currentX = mouseX;
	currentY = mouseY;
	nowRotating = true;
}



endFieldRotating = () => nowRotating = false;



rotateField = (mouseX, mouseY) => {
	if (!nowRotating)
		return;

	let dx = mouseX - currentX;
	let dy = mouseY - currentY;
	xAngle -= dy;
	yAngle += dx;
	field.style.transform = `translateY(-50%) rotateX(${xAngle}deg) rotateY(${yAngle}deg) scale3d(${1 + zoom / 100}, ${1 + zoom / 100}, ${1 + zoom / 100})`;
	currentX = mouseX;
	currentY = mouseY;
}



zoomField = deltaZ => {
	zoom += deltaZ;
	if (zoom < -90)
		zoom = -90;

	field.style.transform = `translateY(-50%) rotateX(${xAngle}deg) rotateY(${yAngle}deg) scale3d(${1 + zoom / 100}, ${1 + zoom / 100}, ${1 + zoom / 100})`;
}