//
// MirrorModeHelper
//
function MirrorModeHelper(helperMirrorMode, helperMirrorLine, helperMapSize) {
	this.mirrorMode = helperMirrorMode;
	this.mirrorLine = helperMirrorLine;
	this.mapSize = helperMapSize;
	this.logged = false;
}

MirrorModeHelper.prototype = Object.create(Object.prototype);
MirrorModeHelper.prototype.constructor = MirrorModeHelper;

//
// Methods
//

MirrorModeHelper.prototype.getLine = function() {

	var line = new Object();
	var maxIndexX = this.mapSize - 1;
	var maxIndexY = this.mapSize - 1;

	log("mirror line is " + this.mirrorLine);

	if (this.mirrorLine > maxIndexY) {
		var offsetX = this.mirrorLine - maxIndexY;
		line.point1X = offsetX;
		line.point1Y = 0;
		line.point2X = maxIndexX - offsetX;
		line.point2Y = maxIndexY;
	} else {
		line.point1X = 0;
		line.point1Y = maxIndexY - this.mirrorLine;
		line.point2X = maxIndexX;
		line.point2Y = this.mirrorLine;
	}
	return line;
};

MirrorModeHelper.prototype.isRowMirrored = function(indexY, existingLine) {

	var line = existingLine;
	if (!line) {
		line = this.getLine();
	}

	if ((MIRRORMODE_AXIS == this.mirrorMode) || (MIRRORMODE_POINT == this.mirrorMode)) {
		if (0 == this.mirrorLine) {
			if (indexY > ((this.mapSize / 2) - 1)) {
				return true;
			}
		}		
	}

	if (MIRRORMODE_POINT == this.mirrorMode) {
		if ((indexY > line.point1Y) && (indexY > line.point2Y)) {
			return true;
		}
	}
};

MirrorModeHelper.prototype.isPointMirrored = function(indexX, indexY, existingLine) {

	// if (MIRRORMODE_AXIS == this.mirrorMode) {
	if ((MIRRORMODE_AXIS == this.mirrorMode) || (MIRRORMODE_POINT == this.mirrorMode)) {

		if (1 == this.mirrorLine) {
			if (indexX > ((this.mapSize / 2) - 1)) {
				return true;
			}
		} else if (2 == this.mirrorLine) {
			if (indexX > indexY) {
				return true;
			} else if ((MIRRORMODE_POINT == this.mirrorMode)
					&& (indexX == indexY)
					&& (indexX > ((this.mapSize / 2) - 1))) {
				return true;
			}
		} else if (3 == this.mirrorLine) {
			if (indexX > (this.mapSize - 1 - indexY)) {
				return true;
			} else if ((MIRRORMODE_POINT == this.mirrorMode)
					&& (indexX == (this.mapSize - 1 - indexY))
					&& (indexX <= ((this.mapSize / 2) - 1))) {
				return true;
			}
		}
	} else {

		var maxIndexX = this.mapSize - 1;
		var maxIndexY = this.mapSize - 1;

		var line = existingLine;
		if (!line) {
			line = this.getLine();
		}

		if ((indexX > line.point1X) && (indexX > line.point2X)) {

			return true;

		} else if (0 == line.point1Y) {

			// Linear function to determine if we are in the mirrored area
//			var diff = line.point2X - line.point1X;
//			var slope = (maxIndexX + 1) / diff;
			// var offset = ; // ...

//			if (!this.logged) {
//				log("diff: " + diff);
//				log("slope: " + slope);
//				// log("offset: " + offset);
//				// log("comparison: " + indexY + " - " + ((slope * indexX) + offset));
//				this.logged = true;
//			}

//			if (indexY > (slope * indexX + offset)) {
//				return true;
//			}

		} else if (0 == line.point1X) {

			// Linear function to determine if we are in the mirrored area
			var diff = line.point2Y - line.point1Y;
			var slope = diff / (maxIndexY + 1);
			var offset = line.point1Y; // ...

			if (!this.logged && (indexX == Math.round(maxIndexX / 2))) {
				log("diff: " + diff);
				log("slope: " + slope);
				log("offset: " + offset);
				log("indexX: " + indexX);
				log("comparison: " + indexY + " - " + (Math.floor(slope * indexX) + offset));
				this.logged = true;
			}

			if (indexY > (Math.floor(slope * indexX) + offset)) {
				return true;
			}
		}
	}

	return false;
};

MirrorModeHelper.prototype.getMirroredPoint = function(indexX, indexY) {

	if (MIRRORMODE_AXIS == this.mirrorMode) {
		return this.getMirroredPointAxisSymmetry(indexX, indexY);
	}
	return this.getMirroredPointPointSymmetry(indexX, indexY);
};

MirrorModeHelper.prototype.getMirroredPointAxisSymmetry = function(indexX, indexY) {

	var point = new Object();

	var maxIndexX = this.mapSize - 1;
	var maxIndexY = this.mapSize - 1;

	if (0 == this.mirrorLine) {
		point.indexX = indexX;
		point.indexY = maxIndexY - indexY;
	} else if (1 == this.mirrorLine) {
		point.indexX = maxIndexX - indexX;
		point.indexY = indexY;
	} else if (2 == this.mirrorLine) {
		point.indexX = indexY;
		point.indexY = indexX;
	} else if (3 == this.mirrorLine) {
		point.indexX = maxIndexY - indexY;
		point.indexY = maxIndexX - indexX;
	} else {
		throw "error_unexpected_mirror_line";
	}

	return point;
};

MirrorModeHelper.prototype.getMirroredPointPointSymmetry = function(indexX, indexY) {

	var point = new Object();

	var maxIndexX = this.mapSize - 1;
	var maxIndexY = this.mapSize - 1;

	point.indexX = maxIndexY - indexX;
	point.indexY = maxIndexX - indexY;

	return point;
};
