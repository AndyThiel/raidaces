//
// CreatorMapMoba
//
function CreatorMapMoba() {
	CreatorMap2D.apply(this, []);
	this.creatorRaiseLowerMap = new CreatorMap2D();
	this.creatorRaiseLowerMapContext = new CreatorMap2DContext();
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

	var checkedRaiseAndLowerAction = this
			.createCheckedRaiseAndLowerAction(raiseLowerMap);
	this.helper.forEachPixelToUpdate(streamSource, this,
			checkedRaiseAndLowerAction, map, mirrorMode, mirrorLine);
};

CreatorMapMoba.prototype.createCheckedRaiseAndLowerAction = function(
		raiseLowerMap) {

	return function(streamSource, map, indexX, indexY, mirrorIndexX,
			mirrorIndexY, maxValue, minValue, neighborTopLeft,
			neighborTopCenter, neighborTopRight, neighborLeft, neighborRight,
			neighborBottomLeft, neighborBottomCenter, neighborBottomRight) {

		var currentValue = map.mapArray[indexY][indexX];

		var doRaise = raiseLowerMap.mapArray[indexY][indexX];

		if (doRaise) {
			map.mapArray[indexY][indexX] = currentValue + 1;
		} else if (!doRaise) {
			map.mapArray[indexY][indexX] = currentValue - 1;
		}
	};
};

CreatorMapMoba.prototype.getUpdateStepCount = function() {
	return 2;
};
