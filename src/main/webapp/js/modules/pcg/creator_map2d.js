var MIRRORMODE_POINT = 0;
var MIRRORMODE_AXIS = 1;

//
// CreatorMap2D
//
function CreatorMap2D() {
	this.mirrorMode = MIRRORMODE_AXIS;
	this.mirrorLine = 0;
}

CreatorMap2D.prototype = Object.create(AbstractCreator.prototype);
CreatorMap2D.prototype.constructor = CreatorMap2D;

//
// Methods
//

CreatorMap2D.prototype.create = function(streamSource) {

	if (!this.context) {
		throw "error_no_context";
	}

	var width = this.context.width;
	var height = this.context.height;

	// Create initial Map
	var map = new Map2D(width, height);
	this.updateMirrorMode(streamSource);
	this.renderInitialMapArray(streamSource, map, this.mirrorMode,
			this.mirrorLine);

	// Apply update steps
	var indexStep;
	var updateStepCount = this.getUpdateStepCount();
	for (indexStep = 0; indexStep < updateStepCount; indexStep++) {
		this.updateMap(streamSource, map, this.mirrorMode, this.mirrorLine,
				indexStep);
	}

	return map;
};

CreatorMap2D.prototype.updateMirrorMode = function(streamSource) {

	if (streamSource.consumeBoolean()) {
		this.mirrorMode = MIRRORMODE_AXIS;
		this.mirrorLine = streamSource.consumeShort() % 4;
		log("AXIS Symmetry");
	} else {
		this.mirrorMode = MIRRORMODE_POINT;
		this.mirrorLine = streamSource.consumeInt()
				% ((this.width - 1) + (this.height - 1));
		log("POINT Symmetry");
	}
};

CreatorMap2D.prototype.renderInitialMapArray = function(streamSource, map,
		mirrorMode, mirrorLine) {
	this.forEachPixelToUpdate(streamSource, this, this.chooseRandomValue, map,
			mirrorMode, mirrorLine);
};

CreatorMap2D.prototype.chooseRandomValue = function(streamSource, map, indexX,
		indexY, mirrorIndexX, mirrorIndexY, neighborTopLeft, neighborTopCenter,
		neighborTopRight, neighborLeft, neighborRight, neighborBottomLeft,
		neighborBottomCenter, neighborBottomRight) {

	// if (streamSource.consumeBoolean()) {
	// map.mapArray[indexY][indexX] = 1;
	// } else {
	// map.mapArray[indexY][indexX] = 0;
	// }

	var initialValue = (streamSource.consumeShort() % 2);
	map.mapArray[indexY][indexX] = initialValue;
	map.mapArray[mirrorIndexY][mirrorIndexX] = initialValue;
};

CreatorMap2D.prototype.getUpdateStepCount = function() {
	return 1;
};

CreatorMap2D.prototype.updateMap = function(streamSource, map, mirrorMode,
		mirrorLine, indexStep) {
	this.applyCellularAutomation(streamSource, map, mirrorMode, mirrorLine);
};

CreatorMap2D.prototype.applyCellularAutomation = function(streamSource, map,
		mirrorMode, mirrorLine) {
	// this.forEachPixelToUpdate(streamSource, this,
	// this.basicCellularAutomationAction, map, mirrorMode, mirrorLine);
	this.forEachPixelToUpdate(streamSource, this,
			this.heightCellularAutomationAction, map, mirrorMode, mirrorLine);
};

CreatorMap2D.prototype.forEachPixelToUpdate = function(streamSource, scope,
		action, map, mirrorMode, mirrorLine) {

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

	var indexY;
	var indexX;
	var mirrorIndexX = 0;
	var mirrorIndexY = 0;

	var maxIndexX = mapArray[0].length - 1;
	var maxIndexY = mapArray.length - 1;

	var line = new Object();
	if (mirrorLine > maxIndexY) {
		var offsetX = mirrorLine - maxIndexY;
		line.point1X = offsetX;
		line.point1Y = 0;
		line.point2X = maxIndexX - offsetX;
		line.point2Y = maxIndexY;
	} else {
		line.point1X = 0;
		line.point1Y = mirrorLine;
		line.point2X = maxIndexX;
		line.point2Y = maxIndexY - mirrorLine;
	}

	vertical: for (indexY = 0; indexY <= maxIndexY; indexY++) {

		indexTop = indexY - 1;
		indexBottom = indexY + 1;
		if (0 > indexTop) {
			indexTop = maxIndexY;
		} else if (maxIndexY < indexBottom) {
			indexBottom = 0;
		}

		horizontal: for (indexX = 0; indexX <= maxIndexX; indexX++) {

			if (MIRRORMODE_AXIS == mirrorMode) {
				if (0 == mirrorLine) {
					if (indexY > (mapArray.length / 2)) {
						break;
					} else {
						mirrorIndexX = indexX;
						mirrorIndexY = maxIndexY - indexY;
					}
				} else if (1 == mirrorLine) {
					if (indexX > (mapArray[indexY].length / 2)) {
						continue vertical;
					} else {
						mirrorIndexX = maxIndexX - indexX;
						mirrorIndexY = indexY;
					}
				} else if (2 == mirrorLine) {
					if (indexX > indexY) {
						continue vertical;
					} else {
						mirrorIndexX = indexY;
						mirrorIndexY = indexX;
					}
				} else if (3 == mirrorLine) {
					if (indexX > (mapArray.length - indexY)) {
						continue vertical;
					} else {
						mirrorIndexX = maxIndexY - indexY;
						mirrorIndexY = maxIndexX - indexX;
					}
				}
			} else {
				if (((line.point1Y <= indexY) || (line.point2Y <= indexY))
						&& ((line.point1X <= indexX) || (line.point2X <= indexX))) {

					// FIXME: Probably there is a way to determine when we can
					// continue vertical instead, which would be more efficient.
					continue horizontal;
				} else {
					mirrorIndexX = maxIndexY - indexX;
					mirrorIndexY = maxIndexX - indexY;
				}
			}

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

			action.apply(scope, [ streamSource, map, indexX, indexY,
					mirrorIndexX, mirrorIndexY, neighborTopLeft,
					neighborTopCenter, neighborTopRight, neighborLeft,
					neighborRight, neighborBottomLeft, neighborBottomCenter,
					neighborBottomRight ]);
		}
	}
};

CreatorMap2D.prototype.basicCellularAutomationAction = function(streamSource,
		map, indexX, indexY, mirrorIndexX, mirrorIndexY, neighborTopLeft,
		neighborTopCenter, neighborTopRight, neighborLeft, neighborRight,
		neighborBottomLeft, neighborBottomCenter, neighborBottomRight) {

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

CreatorMap2D.prototype.heightCellularAutomationAction = function(streamSource,
		map, indexX, indexY, mirrorIndexX, mirrorIndexY, neighborTopLeft,
		neighborTopCenter, neighborTopRight, neighborLeft, neighborRight,
		neighborBottomLeft, neighborBottomCenter, neighborBottomRight) {

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

CreatorMap2D.prototype.getThemes = function(streamSource) {
	var themeArray = new Array();
	themeArray.push("theme_desert");
	themeArray.push("theme_snow");
	themeArray.push("theme_suburb");
	themeArray.push("theme_city");
	themeArray.push("theme_meadow");
	themeArray.push("theme_forest");
	return themeArray;
};

CreatorMap2D.prototype.logArray = function(mapArray) {

	log("logging " + mapArray.length + " rows");

	var indexY;
	var indexX;
	var logLine;
	for (indexY = 0; indexY < mapArray.length; indexY++) {
		logLine = "";
		log("logging " + mapArray[indexY].length + " columns");
		for (indexX = 0; indexX < mapArray[indexY].length; indexX++) {
			if (1 == mapArray[indexY][indexX]) {
				logLine += "#";
			} else {
				logLine += ".";
			}
		}
		log(logLine);
	}
};
