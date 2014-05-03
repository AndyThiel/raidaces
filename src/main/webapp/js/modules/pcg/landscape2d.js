//
// Landscape2D
//
function Landscape2D(landscapeWidth, landscapeHeight) {

	this.landscapeArray = new Array(landscapeHeight);
	var index;
	for (index = 0; index < landscapeHeight; index++) {
		this.landscapeArray[index] = new Array(landscapeWidth);
	}
}

Landscape2D.prototype = Object.create(Object.prototype);
Landscape2D.prototype.constructor = Landscape2D;

//
// Methods
//
