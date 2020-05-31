let nowRotating = false;
let currentX = 0;
let currentY = 0;
let xAngle = 0;
let yAngle = 0;
let zoom = 0;



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
	document.getElementById("field").style.transform = `rotateX(${xAngle}deg) rotateY(${yAngle}deg) scale3d(${1 + zoom / 100}, ${1 + zoom / 100}, ${1 + zoom / 100})`;
	currentX = mouseX;
	currentY = mouseY;
}



zoomField = deltaZ => {
	zoom += deltaZ;
	if (zoom < -90)
		zoom = -90;

	document.getElementById("field").style.transform = `rotateX(${xAngle}deg) rotateY(${yAngle}deg) scale3d(${1 + zoom / 100}, ${1 + zoom / 100}, ${1 + zoom / 100})`;
}