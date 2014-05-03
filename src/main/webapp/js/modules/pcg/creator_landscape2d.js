//
// CreatorLandscape2D
//
function CreatorLandscape2D() {
}

CreatorLandscape2D.prototype = Object.create(AbstractCreator.prototype);
CreatorLandscape2D.prototype.constructor = CreatorLandscape2D;

//
// Methods
//

CreatorLandscape2D.prototype.create = function(streamSource) {

	var offsetX = this.context.offsetX;
	var offsetY = this.context.offsetY;
	var width = this.context.width;
	var height = this.context.height;
	// var tilesize = this.context.tilesize;
	// var projectionMode = this.context.projectionMode;
	var map = this.context.map;
	var mapArray = map.mapArray;

	var neighborTopLeft;
	var neighborTopCenter;
	var neighborTopRight;
	var neighborLeft;
	var neighborRight;
	var neighborBottomLeft;
	var neighborBottomCenter;
	var neighborBottomRight;

	var indexTop;
	var indexBottom;
	var indexLeft;
	var indexRight;

	var landscape = new Landscape2D(width, height);

	var indexY;
	var indexX;

	var maxIndexY = height - 1;
	for (indexY = 0; indexY <= maxIndexY; indexY++) {

		indexTop = indexY - 1;
		indexBottom = indexY + 1;
		if (0 > indexTop) {
			indexTop = maxIndexY;
		} else if (maxIndexY < indexBottom) {
			indexBottom = 0;
		}

		var maxIndexX = mapArray[indexY].length - 1;
		for (indexX = 0; indexX <= maxIndexX; indexX++) {

			indexLeft = indexX - 1;
			indexRight = indexX + 1;
			if (0 > indexLeft) {
				indexLeft = maxIndexX;
			} else if (maxIndexY < indexRight) {
				indexRight = 0;
			}

			neighborTopLeft = mapArray[indexTop][indexLeft];
			neighborTopCenter = mapArray[indexTop][indexX];
			neighborTopRight = mapArray[indexTop][indexRight];
			neighborLeft = mapArray[indexY][indexLeft];
			neighborRight = mapArray[indexY][indexRight];
			neighborBottomLeft = mapArray[indexBottom][indexLeft];
			neighborBottomCenter = mapArray[indexBottom][indexX];
			neighborBottomRight = mapArray[indexBottom][indexRight];

			var indexMapY = offsetY + indexY;
			var indexMapX = offsetX + indexX;

			if (0 > indexMapY) {
				indexMapY = map.mapArray.length - indexMapY;
			} else if (map.mapArray.length <= indexMapY) {
				indexMapY = 0 + indexMapY - map.mapArray.length;
			}

			if (0 > indexMapX) {
				indexMapX = map.mapArray[indexMapY].length - indexMapX;
			} else if (map.mapArray[indexMapY].length <= indexMapX) {
				indexMapX = 0 + indexMapX - map.mapArray[indexMapY].length;
			}

			var currentTile = this.mapTileToLandscapeTile(map.mapArray[indexMapY][indexMapX],
				neighborTopLeft,
				neighborTopCenter,
				neighborTopRight,
				neighborLeft,
				neighborRight,
				neighborBottomLeft,
				neighborBottomCenter,
				neighborBottomRight);

			landscape.landscapeArray[indexY][indexX] = currentTile;
		}
	}

	return landscape;
};

CreatorLandscape2D.prototype.mapTileToLandscapeTile = function(mapTile,
	neighborTopLeft,
	neighborTopCenter,
	neighborTopRight,
	neighborLeft,
	neighborRight,
	neighborBottomLeft,
	neighborBottomCenter,
	neighborBottomRight) {

	return mapTile;
};
