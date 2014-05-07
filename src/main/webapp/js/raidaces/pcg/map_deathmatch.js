//
// MapDeatchmatch
//
function MapDeatchmatch(mapWidth, mapHeight) {

	this.width = mapWidth;
	this.height = mapHeight;

	this.mapArray = new Array(mapHeight);
	var index;
	for (index = 0; index < mapHeight; index++) {
		this.mapArray[index] = new Array(mapWidth);
	}
}

MapDeatchmatch.prototype = Object.create(Object.prototype);
MapDeatchmatch.prototype.constructor = MapDeatchmatch;

//
// Methods
//
