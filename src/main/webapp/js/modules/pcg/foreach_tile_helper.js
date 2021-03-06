//
// ForeachTileHelper
//
function ForeachTileHelper() {
}

ForeachTileHelper.prototype = Object.create(Object.prototype);
ForeachTileHelper.prototype.constructor = ForeachTileHelper;

//
// Methods
//

ForeachTileHelper.prototype.forEachPixelToUpdate = function(streamSource,
		scope, action, map, mirrorMode, mirrorLine) {

	var mapArray = map.mapArray;
	var mirrorModeHelper;
	if (MIRRORMODE_AXIS == mirrorMode) {
		mirrorModeHelper = new MirrorModeHelperAxis(mirrorLine, mapArray.length);
	} else {
		mirrorModeHelper = new MirrorModeHelperPoint(mirrorLine,
				mapArray.length);
		// log(mirrorModeHelper.getLogInfo(mapArray[0].length / 2, 79));
	}

	var indexTop;
	var indexBottom;
	var indexLeft;
	var indexRight;

	var indexY;
	var indexX;
	var mirrorIndexX = 0;
	var mirrorIndexY = 0;

	var maxIndexX = mapArray[0].length - 1;
	var maxIndexY = mapArray.length - 1;

	vertical: for (indexY = 0; indexY <= maxIndexY; indexY++) {

		if (mirrorModeHelper.isRowMirrored(indexY)) {
			continue vertical;
		}

		indexTop = indexY - 1;
		indexBottom = indexY + 1;
		if (0 > indexTop) {
			indexTop = maxIndexY;
		} else if (maxIndexY < indexBottom) {
			indexBottom = 0;
		}

		horizontal: for (indexX = 0; indexX <= maxIndexX; indexX++) {

			if (mirrorModeHelper.isPointMirrored(indexX, indexY)) {
				continue horizontal;
			}

			var mirroredPoint = mirrorModeHelper.getMirroredPoint(indexX,
					indexY);
			mirrorIndexX = mirroredPoint.indexX;
			mirrorIndexY = mirroredPoint.indexY;

			indexLeft = indexX - 1;
			indexRight = indexX + 1;
			if (0 > indexLeft) {
				indexLeft = maxIndexX;
			} else if (maxIndexY < indexRight) {
				indexRight = 0;
			}

			var neighborTopLeft = mapArray[indexTop][indexLeft];
			var neighborTopCenter = mapArray[indexTop][indexX];
			var neighborTopRight = mapArray[indexTop][indexRight];
			var neighborLeft = mapArray[indexY][indexLeft];
			var neighborRight = mapArray[indexY][indexRight];
			var neighborBottomLeft = mapArray[indexBottom][indexLeft];
			var neighborBottomCenter = mapArray[indexBottom][indexX];
			var neighborBottomRight = mapArray[indexBottom][indexRight];

			var maxValue = this.getBoundValue(true, map, indexX, indexY,
					neighborTopLeft, neighborTopCenter, neighborTopRight,
					neighborLeft, neighborRight, neighborBottomLeft,
					neighborBottomCenter, neighborBottomRight);
			var minValue = this.getBoundValue(false, map, indexX, indexY,
					neighborTopLeft, neighborTopCenter, neighborTopRight,
					neighborLeft, neighborRight, neighborBottomLeft,
					neighborBottomCenter, neighborBottomRight);

			action.apply(scope, [ streamSource, map, indexX, indexY,
					mirrorIndexX, mirrorIndexY, maxValue, minValue,
					neighborTopLeft, neighborTopCenter, neighborTopRight,
					neighborLeft, neighborRight, neighborBottomLeft,
					neighborBottomCenter, neighborBottomRight ]);
		}
	}
};

ForeachTileHelper.prototype.addMirrored = function(streamSource, sourceArray,
		targetMap, targetIndexX, targetIndexY, mirrorMode, mirrorLine) {

	var mapArray = targetMap.mapArray;
	var mirrorModeHelper;
	if (MIRRORMODE_AXIS == mirrorMode) {
		mirrorModeHelper = new MirrorModeHelperAxis(mirrorLine, mapArray.length);
	} else {
		mirrorModeHelper = new MirrorModeHelperPoint(mirrorLine,
				mapArray.length);
		// log(mirrorModeHelper.getLogInfo(mapArray[0].length / 2, 79));
	}

	var indexX;
	var indexY;
	for (indexY = 0; indexY < sourceArray.length; indexY++) {
		for (indexX = 0; indexX < sourceArray[indexY].length; indexX++) {

			var newHeightValue = sourceArray[indexY][indexX];

			var mapIndexX = targetIndexX + indexX;
			var mapIndexY = targetIndexY + indexY;
			var mirroredPoint = mirrorModeHelper.getMirroredPoint(mapIndexX,
					mapIndexY);

			mapArray[targetIndexY + indexY][targetIndexX + indexX] = newHeightValue;
			mapArray[mirroredPoint.indexY][mirroredPoint.indexX] = newHeightValue;
		}
	}
};

ForeachTileHelper.prototype.addLines = function(streamSource, pointArray, map,
		mirrorMode, mirrorLine) {

	var previousPoint = pointArray[0];
	var mirrorModeHelper;
	if (MIRRORMODE_AXIS == mirrorMode) {
		mirrorModeHelper = new MirrorModeHelperAxis(mirrorLine,
				map.mapArray.width);
	} else {
		mirrorModeHelper = new MirrorModeHelperPoint(mirrorLine,
				map.mapArray.width);
		// log(mirrorModeHelper.getLogInfo(mapArray[0].length / 2, 79));
	}

	var currentPointIndex;
	for (currentPointIndex = 1; currentPointIndex < pointArray.length; currentPointIndex++) {

		var currentPoint = pointArray[currentPointIndex];

		var diffX = currentPoint.indexX - previousPoint.indexX;
		var diffY = currentPoint.indexY - previousPoint.indexY;

		var slope = diffY / diffX;
		var offset = Math.floor(-1
				* ((previousPoint.indexX * slope) - previousPoint.indexY));

		var minX = Math.min(previousPoint.indexX, currentPoint.indexX);
		var maxX = Math.max(previousPoint.indexX, currentPoint.indexX);
		// var minY = Math.min(previousPoint.indexY, currentPoint.indexY);
		// var maxY = Math.max(previousPoint.indexY, currentPoint.indexY);

		if (typeof previousPoint.indexX === 'undefined'
				|| typeof currentPoint.indexX === 'undefined') {
			log("Not drawing corrupt line.");
		} else {
			log("Drawing line with slope: " + slope + " and offset: " + offset
					+ " (from " + previousPoint.indexX + "/"
					+ previousPoint.indexY + " to " + currentPoint.indexX + "/"
					+ currentPoint.indexY + ")");
			var indexX;
			for (indexX = minX; indexX < maxX; indexX++) {

				var indexY = Math.floor(slope * indexX) + offset;
				var mirroredPoint = mirrorModeHelper.getMirroredPoint(indexX,
						indexY);

				map.mapArray[indexY][indexX] = 4;
				if (typeof mirroredPoint === 'undefined'
						|| typeof mirroredPoint.indexX === 'undefined'
						|| typeof mirroredPoint.indexY === 'undefined') {
					log("MirroredPoint corrupt");
				} else {
					log(typeof mirroredPoint);
					log(typeof mirroredPoint.indexX);
					log(typeof mirroredPoint.indexY);
					log("MirroredPoint: " + mirroredPoint.indexX + "/"
							+ mirroredPoint.indexY);
					if (typeof map.mapArray[mirroredPoint.indexY] === 'undefined') {
						log("Mirrored Point fail");
					} else {
						map.mapArray[mirroredPoint.indexY][mirroredPoint.indexX] = 4;
					}
				}
			}
		}
	}
};

ForeachTileHelper.prototype.setLowestValue = function(streamSource, map,
		indexX, indexY, mirrorIndexX, mirrorIndexY, maxValue, minValue,
		neighborTopLeft, neighborTopCenter, neighborTopRight, neighborLeft,
		neighborRight, neighborBottomLeft, neighborBottomCenter,
		neighborBottomRight) {

	map.mapArray[indexY][indexX] = 0;
	map.mapArray[mirrorIndexY][mirrorIndexX] = 0;
};
ForeachTileHelper.prototype.setMiddleValue = function(streamSource, map,
		indexX, indexY, mirrorIndexX, mirrorIndexY, maxValue, minValue,
		neighborTopLeft, neighborTopCenter, neighborTopRight, neighborLeft,
		neighborRight, neighborBottomLeft, neighborBottomCenter,
		neighborBottomRight) {

	map.mapArray[indexY][indexX] = 2;
	map.mapArray[mirrorIndexY][mirrorIndexX] = 2;
};
ForeachTileHelper.prototype.setHighestValue = function(streamSource, map,
		indexX, indexY, mirrorIndexX, mirrorIndexY, maxValue, minValue,
		neighborTopLeft, neighborTopCenter, neighborTopRight, neighborLeft,
		neighborRight, neighborBottomLeft, neighborBottomCenter,
		neighborBottomRight) {

	map.mapArray[indexY][indexX] = 4;
	map.mapArray[mirrorIndexY][mirrorIndexX] = 4;
};

ForeachTileHelper.prototype.chooseRandomBooleanValue = function(streamSource,
		map, indexX, indexY, mirrorIndexX, mirrorIndexY, maxValue, minValue,
		neighborTopLeft, neighborTopCenter, neighborTopRight, neighborLeft,
		neighborRight, neighborBottomLeft, neighborBottomCenter,
		neighborBottomRight) {

	var initialValue = (streamSource.consumeShort() % 2);
	map.mapArray[indexY][indexX] = initialValue;
	map.mapArray[mirrorIndexY][mirrorIndexX] = initialValue;
};

ForeachTileHelper.prototype.chooseRandomHeightValue = function(streamSource,
		map, indexX, indexY, mirrorIndexX, mirrorIndexY, maxValue, minValue,
		neighborTopLeft, neighborTopCenter, neighborTopRight, neighborLeft,
		neighborRight, neighborBottomLeft, neighborBottomCenter,
		neighborBottomRight) {

	var initialValue = (streamSource.consumeShort() % 5);
	map.mapArray[indexY][indexX] = initialValue;
	map.mapArray[mirrorIndexY][mirrorIndexX] = initialValue;
};

ForeachTileHelper.prototype.basicCellularAutomationAction = function(
		streamSource, map, indexX, indexY, mirrorIndexX, mirrorIndexY,
		maxValue, minValue, neighborTopLeft, neighborTopCenter,
		neighborTopRight, neighborLeft, neighborRight, neighborBottomLeft,
		neighborBottomCenter, neighborBottomRight) {

	var mapArray = map.mapArray;
	var countNeighborsTrue = 0;

	if (1 == neighborTopLeft) {
		countNeighborsTrue++;
	}
	if (1 == neighborTopCenter) {
		countNeighborsTrue++;
	}
	if (1 == neighborTopRight) {
		countNeighborsTrue++;
	}
	if (1 == neighborLeft) {
		countNeighborsTrue++;
	}
	if (1 == neighborRight) {
		countNeighborsTrue++;
	}
	if (1 == neighborBottomLeft) {
		countNeighborsTrue++;
	}
	if (1 == neighborBottomCenter) {
		countNeighborsTrue++;
	}
	if (1 == neighborBottomRight) {
		countNeighborsTrue++;
	}

	// Guess I should update a buffer array first and keep using the original
	// for the algorithm.
	if (4 < countNeighborsTrue) {
		mapArray[indexY][indexX] = 1;
		mapArray[mirrorIndexY][mirrorIndexX] = 1;
	} else if ((3 < countNeighborsTrue) && (1 == mapArray[indexY][indexX])) {
		mapArray[indexY][indexX] = 1;
		mapArray[mirrorIndexY][mirrorIndexX] = 1;
	} else {
		mapArray[indexY][indexX] = 0;
		mapArray[mirrorIndexY][mirrorIndexX] = 0;
	}
};

ForeachTileHelper.prototype.mildHeightCellularAutomationAction = function(
		streamSource, map, indexX, indexY, mirrorIndexX, mirrorIndexY,
		maxValue, minValue, neighborTopLeft, neighborTopCenter,
		neighborTopRight, neighborLeft, neighborRight, neighborBottomLeft,
		neighborBottomCenter, neighborBottomRight) {

	// var blockIncrement = false;
	var newValue;

	if (neighborLeft < map.mapArray[indexY][indexX]) {
		newValue = neighborLeft;
		if (neighborRight > map.mapArray[indexY][indexX]) {
			newValue++;
			// blockIncrement = true;
		}
	} else if (neighborLeft > map.mapArray[indexY][indexX]) {
		newValue = neighborRight;
		if (neighborRight < map.mapArray[indexY][indexX]) {
			newValue++;
			// blockIncrement = true;
		}
	} else {
		newValue = neighborLeft;
	}

	if (newValue > neighborTopCenter) {
		newValue = neighborTopCenter;
		if (newValue < neighborBottomCenter) {
			newValue++;
		}
	}

	map.mapArray[indexY][indexX] = newValue;
	map.mapArray[mirrorIndexY][mirrorIndexX] = newValue;
};

ForeachTileHelper.prototype.wildHeightCellularAutomationAction = function(
		streamSource, map, indexX, indexY, mirrorIndexX, mirrorIndexY,
		maxValue, minValue, neighborTopLeft, neighborTopCenter,
		neighborTopRight, neighborLeft, neighborRight, neighborBottomLeft,
		neighborBottomCenter, neighborBottomRight) {

	var newValueAmount = -1;
	var newValue = -1;

	var currentValueAmount;
	var currentValue;
	for (currentValue = 0; currentValue < 5; currentValue++) {

		currentValueAmount = 0;

		if (currentValue == map.mapArray[indexY][indexX]) {
			currentValueAmount++;
		}
		if (currentValue == neighborTopLeft) {
			currentValueAmount++;
		}
		if (currentValue == neighborTopCenter) {
			currentValueAmount++;
		}
		if (currentValue == neighborTopRight) {
			currentValueAmount++;
		}
		if (currentValue == neighborLeft) {
			currentValueAmount++;
		}
		if (currentValue == neighborRight) {
			currentValueAmount++;
		}
		if (currentValue == neighborBottomLeft) {
			currentValueAmount++;
		}
		if (currentValue == neighborBottomCenter) {
			currentValueAmount++;
		}
		if (currentValue == neighborBottomRight) {
			currentValueAmount++;
		}

		if (newValueAmount < currentValueAmount) {
			newValueAmount = currentValueAmount;
			newValue = currentValue;
		} else if (newValueAmount == currentValueAmount) {
			if (streamSource.consumeBoolean()) {
				newValue = currentValue;
			}
		}
	}

	map.mapArray[indexY][indexX] = newValue;
	map.mapArray[mirrorIndexY][mirrorIndexX] = newValue;

	// if ((map.mapArray.length / 2) == indexY) {
	// log("New height chosen: " + newValue);
	// }
};

ForeachTileHelper.prototype.getBoundValue = function(isUpperRequested, map,
		indexX, indexY, neighborTopLeft, neighborTopCenter, neighborTopRight,
		neighborLeft, maxValue, minValue, neighborRight, neighborBottomLeft,
		neighborBottomCenter, neighborBottomRight) {

	var boundValue = map.mapArray[indexY][indexX];

	var currentValue;
	for (currentValue = 0; currentValue < 5; currentValue++) {

		if ((currentValue == neighborTopLeft)
				|| (currentValue == neighborTopCenter)
				|| (currentValue == neighborTopRight)
				|| (currentValue == neighborLeft)
				|| (currentValue == neighborRight)
				|| (currentValue == neighborBottomLeft)
				|| (currentValue == neighborBottomCenter)
				|| (currentValue == neighborBottomRight)) {

			if ((isUpperRequested && boundValue < currentValue)
					|| (!isUpperRequested && boundValue > currentValue)) {

				boundValue = currentValue;
			}
		}
	}

	return boundValue;
};
