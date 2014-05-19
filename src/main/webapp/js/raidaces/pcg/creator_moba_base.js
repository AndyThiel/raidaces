//
// CreatorMobaBase
//
function CreatorMobaBase() {
}

CreatorMobaBase.prototype = Object.create(AbstractCreator.prototype);
CreatorMobaBase.prototype.constructor = CreatorMobaBase;

//
// Methods
//

CreatorMobaBase.prototype.create = function(streamSource) {

	if (typeof this.context === 'undefined') {
		throw "error_no_context";
	}

	var base = new MobaBase(this.context.width, this.context.height);

	var groundHeight = 1 + (streamSource.consumeShort() % 3);
	var baseArray = base.mapArray;

	var indexX;
	var indexY;
	for (indexY = 0; indexY < baseArray.length; indexY++) {
		for (indexX = 0; indexX < baseArray[indexY].length; indexX++) {

			if (0 == (indexY % 2) && 0 == (indexX % 2)) {
				baseArray[indexY][indexX] = groundHeight + 1;
			} else {
				baseArray[indexY][indexX] = groundHeight;
			}
		}
	}

	return base;
};
