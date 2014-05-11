var MIRRORMODE_RANDOM = -1;
var MIRRORMODE_POINT = 0;
var MIRRORMODE_AXIS = 1;

//
// CreatorMap2D
//
function CreatorMap2D() {
	this.mirrorMode = MIRRORMODE_RANDOM;
	this.mirrorLine = 0;
	this.helper = new ForeachTileHelper();
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

	this.mirrorMode = this.context.mirrorMode;
	this.mirrorLine = this.context.mirrorLine;

	if (MIRRORMODE_RANDOM == this.mirrorMode) {
		if (false) {//streamSource.consumeBoolean()) {
			this.mirrorMode = MIRRORMODE_AXIS;
			this.mirrorLine = streamSource.consumeShort() % 4;
			log("AXIS Symmetry");
		} else {
			this.mirrorMode = MIRRORMODE_POINT;
			this.mirrorLine = streamSource.consumeInt()
					% ((this.context.width - 1) + (this.context.height - 1));
			log("POINT Symmetry");
		}
	}
};

CreatorMap2D.prototype.renderInitialMapArray = function(streamSource, map,
		mirrorMode, mirrorLine) {
	this.helper.forEachPixelToUpdate(streamSource, this,
			this.helper.chooseRandomBooleanValue, map, mirrorMode, mirrorLine);
};

CreatorMap2D.prototype.getUpdateStepCount = function() {
	return 3;
};

CreatorMap2D.prototype.updateMap = function(streamSource, map, mirrorMode,
		mirrorLine, indexStep) {
	this.applyCellularAutomation(streamSource, map, mirrorMode, mirrorLine,
			true);
};

CreatorMap2D.prototype.applyCellularAutomation = function(streamSource, map,
		mirrorMode, mirrorLine, doBasicAutomation) {

	if (doBasicAutomation) {
		this.helper.forEachPixelToUpdate(streamSource, this,
				this.helper.basicCellularAutomationAction, map, mirrorMode,
				mirrorLine);
	} else {
		this.helper.forEachPixelToUpdate(streamSource, this,
				this.helper.mildHeightCellularAutomationAction, map,
				mirrorMode, mirrorLine);
	}
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
