//
// CreatorMobaLane
//
function CreatorMobaLane() {
}

CreatorMobaLane.prototype = Object.create(AbstractCreator.prototype);
CreatorMobaLane.prototype.constructor = CreatorMobaLane;

//
// Methods
//

CreatorMobaLane.prototype.create = function(streamSource) {

	if (!this.context) {
		throw "error_no_context";
	}

	// Create initial lane
	var lane = new MobaLane();
	var map = this.context.map;
	var allLanes = this.context.allLanes;
	log("There are " + allLanes.length + " lanes in the context.");
	var startingPoint = this.context.startingPoint;

	var mirrorModeHelper;
	if (MIRRORMODE_AXIS == this.context.mirrorMode) {
		mirrorModeHelper = new MirrorModeHelperAxis(this.context.mirrorLine, map.width);
	} else {
		mirrorModeHelper = new MirrorModeHelperPoint(this.context.mirrorLine, map.width);
	}

	var endingPoint = mirrorModeHelper.getMirroredPoint(startingPoint.indexX, startingPoint.indexY);

	lane.pointArray.push(startingPoint);
	allLanes.push(lane);
	log("There are now " + allLanes.length + " lanes.");

	var pointCount = 2 + (streamSource.consumeShort() % 3);

	var previousPoint = startingPoint;
	var pointIndex;
	for (pointIndex = 0; pointIndex < pointCount; pointIndex++) {

		var candidate = new Object();
		var nrTries = 0;
		while (!this.isCandidateValid(candidate, previousPoint, endingPoint, allLanes) && nrTries < 4) {
			candidate.indexX = streamSource.consumeShort() % map.width;
			candidate.indexY = streamSource.consumeShort() % map.height;
			nrTries++;
		}

		if (4 > nrTries) {
			log("Adding candidate: " + candidate.indexX + "/" + candidate.indexY);
			lane.pointArray.push(candidate);
			previousPoint = candidate;
		}
	}

	lane.pointArray.push(endingPoint);

	log("Number of points: " + lane.pointArray.length);
	this.logPoint("start: (" + this.getPointLogInfo(startingPoint) + ")", lane.pointArray[0]);
	this.logPoint("end: (" + this.getPointLogInfo(endingPoint) + ")", lane.pointArray[1]);

	return lane;
};

CreatorMobaLane.prototype.logPoint = function(message, point) {
	log(message + this.getPointLogInfo(point));
};
CreatorMobaLane.prototype.getPointLogInfo = function(point) {
	return "" + point.indexX + "/" + point.indexY;
};

CreatorMobaLane.prototype.isCandidateValid = function(candidate, previousPoint, endingPoint, allLanes) {

	if (typeof candidate.indexX === 'undefined') {
		return false;
	}

	if (this.crossesLane(this.createLine(candidate, previousPoint), allLanes)) {
		return false;
	}
	if (this.crossesLane(this.createLine(candidate, endingPoint), allLanes)) {
		return false;
	}

	return true;
};

CreatorMobaLane.prototype.crossesLane = function(line, allLanes) {

	log("Checking line "+ line.indexX1 + "/" + line.indexY1 + " - " + line.indexX2 + "/" + line.indexY2);
	log("Checking collision for " + allLanes.length + " lanes.");

	var currentLaneIndex;
	for (currentLaneIndex = 0; currentLaneIndex < allLanes.length; currentLaneIndex++) {


		var currentLane = allLanes[currentLaneIndex];
		log("Current lane has " + currentLane.pointArray.length + " points.");

		var previousPoint = currentLane.pointArray[0];
		var currentPointIndex;
		for (currentPointIndex = 1; currentPointIndex < currentLane.pointArray.length; currentPointIndex++) {
			var currentPoint = currentLane.pointArray[currentPointIndex];
			var collisionPoint = this.getCollisionPoint(line, this.createLine(previousPoint, currentPoint));
			log();
			if (typeof collisionPoint.indexX === 'boolean' && (false === collisionPoint)) {
				log("All is well.");
				return false;
			}
			log("All is NOT well.");
			return true;
		}
	}
	return true;
};

CreatorMobaLane.prototype.createLine = function(point1, point2) {
	var line = new Object();
	line.indexX1 = point1.indexX;
	line.indexY1 = point1.indexY;
	line.indexX2 = point2.indexX;
	line.indexY2 = point2.indexY;
	return line;
};

CreatorMobaLane.prototype.getCollisionPoint = function(line1, line2) {

    var s1_x, s1_y, s2_x, s2_y;

    s1_x = line1.indexX2 - line1.indexX1;
    s1_y = line1.indexY2 - line1.indexY1;

    s2_x = line2.indexX2 - line2.indexX1;
    s2_y = line2.indexY2 - line2.indexY1;

    var s, t;
    // s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    s = (-s1_y * (line1.indexX1 - line2.indexX1) + s1_x * (line1.indexY1 - line2.indexY1)) / (-s2_x * s1_y + s1_x * s2_y);
    // t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (line1.indexY1 - line2.indexY1) - s2_y * (line1.indexX1 - line2.indexX1)) / (-s2_x * s1_y + s1_x * s2_y);

	log("Checking collision for lines "
			+ line1.indexX1 + "/" + line1.indexY1 + " - " + line1.indexX2 + "/" + line1.indexY2
			+ " and "
			+ line2.indexX1 + "/" + line2.indexY1 + " - " + line2.indexX2 + "/" + line2.indexY2);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        var collisionPoint = new Object();
        collisionPoint.indexX = line1.indexX1 + (t * s1_x);
        collisionPoint.indexY = line1.indexY1 + (t * s1_y);
    	log("Collision detected at " + collisionPoint.indexX + "/" + collisionPoint.indexY);
        return collisionPoint;
    }

    return false; // No collision
};
