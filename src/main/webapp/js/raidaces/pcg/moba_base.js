//
// MobaBase
//
function MobaBase(mapWidth, mapHeight) {

	this.width = mapWidth;
	this.height = mapHeight;

	this.mapArray = new Array(mapHeight);
	var index;
	for (index = 0; index < mapHeight; index++) {
		this.mapArray[index] = new Array(mapWidth);
	}
}

MobaBase.prototype = Object.create(Object.prototype);
MobaBase.prototype.constructor = MobaBase;

//
// Methods
//
