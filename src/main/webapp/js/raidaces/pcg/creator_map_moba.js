//
// CreatorMapMoba
//
function CreatorMapMoba() {
	CreatorMap2D.apply(this, []);
	this.creatorRaiseLowerMap = new CreatorMap2D();
	this.creatorRaiseLowerMapContext = new CreatorMap2DContext();
	this.creatorLane = new CreatorMobaLane();
	this.creatorLaneContext = new CreatorMobaLaneContext();
	this.creatorBase = new CreatorMobaBase();
	this.creatorBaseContext = new CreatorMobaBaseContext();
}

CreatorMapMoba.prototype = Object.create(CreatorMap2D.prototype);
CreatorMapMoba.prototype.constructor = CreatorMapMoba;

//
// Methods
//

CreatorMapMoba.prototype.renderInitialMapArray = function(streamSource, map,
		mirrorMode, mirrorLine) {

	this.creatorRaiseLowerMapContext.setDimensions(map.mapArray.length,
			map.mapArray.length);
	this.creatorRaiseLowerMapContext.setMirrorMode(mirrorMode, mirrorLine);
	this.creatorRaiseLowerMap.setContext(this.creatorRaiseLowerMapContext);

	this.helper.forEachPixelToUpdate(streamSource, this,
			this.helper.setMiddleValue, map, mirrorMode, mirrorLine);
};

CreatorMapMoba.prototype.updateMap = function(streamSource, map, mirrorMode,
		mirrorLine, indexStep) {

	var raiseLowerMap = this.creatorRaiseLowerMap.create(streamSource);

	if (4 == indexStep) {
		this.setMobaAreas(streamSource, map, mirrorMode, mirrorLine);
	} else {
		var checkedRaiseAndLowerAction = this.createCheckedRaiseAndLowerAction(
				(0 == (indexStep % 2)), raiseLowerMap);

		this.helper.forEachPixelToUpdate(streamSource, this,
				checkedRaiseAndLowerAction, map, mirrorMode, mirrorLine);
	}
};

CreatorMapMoba.prototype.createCheckedRaiseAndLowerAction = function(doRaise,
		raiseLowerMap) {

	return function(streamSource, map, indexX, indexY, mirrorIndexX,
			mirrorIndexY, maxValue, minValue, neighborTopLeft,
			neighborTopCenter, neighborTopRight, neighborLeft, neighborRight,
			neighborBottomLeft, neighborBottomCenter, neighborBottomRight) {

		var currentValue = map.mapArray[indexY][indexX];
		if (1 == raiseLowerMap.mapArray[indexY][indexX]) {
			if (doRaise) {
				map.mapArray[indexY][indexX] = currentValue + 1;
				map.mapArray[mirrorIndexY][mirrorIndexX] = currentValue + 1;
			} else {
				map.mapArray[indexY][indexX] = currentValue - 1;
				map.mapArray[mirrorIndexY][mirrorIndexX] = currentValue - 1;
			}
		}
	};
};

CreatorMapMoba.prototype.setMobaAreas = function(streamSource, map, mirrorMode,
		mirrorLine) {

	var startingPoint = new Object;
	startingPoint.indexX = streamSource.consumeShort() % (map.width);
	startingPoint.indexY = streamSource.consumeShort() % (map.height);

	this.creatorLaneContext.setMirrorMode(mirrorMode, mirrorLine);
	this.creatorLaneContext.map = map;
	this.creatorLaneContext.startingPoint = startingPoint;

	this.creatorLane.context = this.creatorLaneContext;

	var indexLane;
	for (indexLane = 0; indexLane < 3; indexLane++) {

		log("Lane number " + (indexLane + 1) + " will be created.");

		var lane = this.creatorLane.create(streamSource);
		log("Lane created with pointArray size being: "
				+ lane.pointArray.length);
		this.helper.addLines(streamSource, lane.pointArray, map, mirrorMode,
				mirrorLine);
	}

	var optionalWidth = streamSource.consumeShort() % 8;
	var optionalHeight = streamSource.consumeShort() % 8;

	this.creatorBaseContext
			.setDimensions(9 + optionalWidth, 9 + optionalHeight);
	this.creatorBaseContext.setThemeWhitelist(this.context.themeWhitelist);

	this.creatorBase.context = this.creatorBaseContext;

	var base = this.creatorBase.create(streamSource);
	this.helper.addMirrored(streamSource, base.mapArray, map, streamSource
			.consumeShort()
			% (map.mapArray[0].length - base.width), streamSource
			.consumeShort()
			% (map.mapArray.length - base.height), mirrorMode, mirrorLine);
};

CreatorMapMoba.prototype.getUpdateStepCount = function() {
	return 5;
};
