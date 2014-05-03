//
// Map2D
//
function Map2D(mapWidth, mapHeight) {

	this.width = mapWidth;
	this.height = mapHeight;

	this.mapArray = new Array(mapHeight);
	var index;
	for (index = 0; index < mapHeight; index++) {
		this.mapArray[index] = new Array(mapWidth);
	}
}

Map2D.prototype = Object.create(Object.prototype);
Map2D.prototype.constructor = Map2D;

//
// Methods
//
