//
// CreatorMobaLaneContext
//
function CreatorMobaLaneContext() {
	this.allLanes = new Array();
	this.startingPoint;
	this.mirrorMode = MIRRORMODE_RANDOM;
	this.mirrorLine = 0;
	this.map;
}

CreatorMobaLaneContext.prototype = Object.create(Object.prototype);
CreatorMobaLaneContext.prototype.constructor = CreatorMobaBaseContext;

//
// Methods
//

CreatorMobaLaneContext.prototype.setMirrorMode = function(mapMirrorMode, mapMirrorLine) {
	this.mirrorMode = mapMirrorMode;
	this.mirrorLine = mapMirrorLine;
};
