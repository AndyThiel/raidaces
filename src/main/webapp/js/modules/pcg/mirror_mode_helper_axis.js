//
// MirrorModeHelperAxis
//
function MirrorModeHelperAxis(helperMirrorLine, helperMapSize) {
	this.mirrorLine = helperMirrorLine;
	this.mapSize = helperMapSize;
	this.logged = false;
}

MirrorModeHelperAxis.prototype = Object.create(Object.prototype);
MirrorModeHelperAxis.prototype.constructor = MirrorModeHelperAxis;

//
// Methods
//

MirrorModeHelperAxis.prototype.isRowMirrored = function(indexY, existingLine) {

	if ((0 == this.mirrorLine) && (indexY > ((this.mapSize / 2) - 1))) {
		return true;
	}
};

MirrorModeHelperAxis.prototype.isPointMirrored = function(indexX, indexY,
		existingLine) {

	if (1 == this.mirrorLine) {
		if (indexX > ((this.mapSize / 2) - 1)) {
			return true;
		}
	} else if (2 == this.mirrorLine) {
		if (indexX > indexY) {
			return true;
			// } else if ((MIRRORMODE_POINT == this.mirrorMode)
			// && (indexX == indexY)
			// && (indexX > ((this.mapSize / 2) - 1))) {
			// return true;
		}
	} else if (3 == this.mirrorLine) {
		if (indexX > (this.mapSize - 1 - indexY)) {
			return true;
			// } else if ((MIRRORMODE_POINT == this.mirrorMode)
			// && (indexX == (this.mapSize - 1 - indexY))
			// && (indexX <= ((this.mapSize / 2) - 1))) {
			// return true;
		}
	}

	return false;
};

MirrorModeHelperAxis.prototype.getMirroredPoint = function(indexX, indexY) {

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
