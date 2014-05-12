//
// MirrorModeHelperPoint
//
function MirrorModeHelperPoint(helperMirrorLine, helperMapSize) {

	this.mirrorLine = helperMirrorLine;
	this.mapSize = helperMapSize;
}

MirrorModeHelperPoint.prototype = Object.create(Object.prototype);
MirrorModeHelperPoint.prototype.constructor = MirrorModeHelperPoint;

//
// Methods
//

MirrorModeHelperPoint.prototype.getLogInfo = function(indexX, indexY) {

	if (typeof this.line === 'undefined') {
		this.line = this.getCartesianLine();
	}
	var line = this.line;

	var diffX = line.point2X - line.point1X;
	var diffY = line.point2Y - line.point1Y;
	var slope = (diffY / diffX);
	var offset = this.calculateOffset(line.point1X, line.point1Y, slope);

	return "Point 1: " + line.point1X + " / " + line.point1Y + "<br>"
			+ "Point 2: " + line.point2X + " / " + line.point2Y + "<br>"
			+ "Slope: " + slope + "<br>" + "Offset: " + offset + "<br>"
			+ "comparison: " + this.indexYToCartesian(indexY) + " - "
			+ (Math.floor((slope * this.indexXToCartesian(indexX)) + offset));
};

MirrorModeHelperPoint.prototype.isRowMirrored = function(indexY) {

	if (typeof this.line === 'undefined') {
		this.line = this.getCartesianLine();
	}

	// Why does this not work? A lot of points stay undefined, but when this
	// occurs all the unmirrored points should have been drawn.
	// Maybe it depends on the slope ... because the first lines are skipped
	// and the later ones handled due to the slope > 0 check!?
	// if (indexY > this.line.point1Y && indexY > this.line.point2Y) {
		// return true;
	// }
	return false;
};

MirrorModeHelperPoint.prototype.isPointMirrored = function(indexX, indexY) {

	if (typeof this.line === 'undefined') {
		this.line = this.getLine();
	}

	var line = this.line;

	if ((this.indexXToCartesian(indexX) > line.point1X)
			&& (this.indexXToCartesian(indexX) > line.point2X)) {

		return true;

	} else {

		// Linear function to determine if we are in the mirrored area

		var diffX = line.point2X - line.point1X;
		var diffY = line.point2Y - line.point1Y;
		var slope = diffY / diffX;
		var offset = this.calculateOffset(line.point1X, line.point1Y, slope);

		if ((slope > 0)
				&& (this.indexYToCartesian(indexY) < Math.floor((slope * this
						.indexXToCartesian(indexX))
						+ offset))) {
			return true;
		} else if ((slope < 0)
				&& (this.indexYToCartesian(indexY) > Math.floor((slope * this
						.indexXToCartesian(indexX))
						+ offset))) {
			return true;
		}
	}

	return false;
};

MirrorModeHelperPoint.prototype.getCartesianLine = function() {

	var line = new Object();
	var maxIndexX = this.mapSize - 1;
	var maxIndexY = this.mapSize - 1;

	var indexX1;
	var indexY1;
	var indexX2;
	var indexY2;

	if (this.mirrorLine > maxIndexY) {
		indexX1 = this.mirrorLine - maxIndexY;
		indexY1 = 0;
		indexX2 = maxIndexX - indexX1;
		indexY2 = maxIndexY;
	} else {
		indexX1 = 0;
		indexY1 = maxIndexY - this.mirrorLine;
		indexX2 = maxIndexX;
		indexY2 = this.mirrorLine;
	}

	if (indexX1 < indexX2) {
		line.point1X = this.indexXToCartesian(indexX1);
		line.point1Y = this.indexYToCartesian(indexY1);
		line.point2X = this.indexXToCartesian(indexX2);
		line.point2Y = this.indexYToCartesian(indexY2);
	} else {
		line.point2X = this.indexXToCartesian(indexX1);
		line.point2Y = this.indexYToCartesian(indexY1);
		line.point1X = this.indexXToCartesian(indexX2);
		line.point1Y = this.indexYToCartesian(indexY2);
	}

	return line;
};

MirrorModeHelperPoint.prototype.indexXToCartesian = function(indexX) {
	return indexX;
};
MirrorModeHelperPoint.prototype.indexYToCartesian = function(indexY) {
	return (this.mapSize - 1) - indexY;
};

MirrorModeHelperPoint.prototype.calculateOffset = function(indexX, indexY,
		slope) {
	var offset = Math.floor(-1 * ((indexX * slope) - indexY));
	return offset;
};

MirrorModeHelperPoint.prototype.getMirroredPoint = function(indexX, indexY) {

	var point = new Object();

	var maxIndexX = this.mapSize - 1;
	var maxIndexY = this.mapSize - 1;

	point.indexX = maxIndexY - indexX;
	point.indexY = maxIndexX - indexY;

	return point;
};
