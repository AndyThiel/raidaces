//
// MapMoba
//
function MapMoba(mapWidth, mapHeight) {

	this.width = mapWidth;
	this.height = mapHeight;

	this.mapArray = new Array(mapHeight);
	var index;
	for (index = 0; index < mapHeight; index++) {
		this.mapArray[index] = new Array(mapWidth);
	}
}

MapMoba.prototype = Object.create(Object.prototype);
MapMoba.prototype.constructor = MapMoba;

//
// Methods
//
