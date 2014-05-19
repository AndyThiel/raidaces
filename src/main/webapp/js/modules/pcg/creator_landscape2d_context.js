//
// CreatorLandscape2DContext
//
function CreatorLandscape2DContext() {
	this.offsetX = 0;
	this.offsetY = 0;
	this.width = 16;
	this.height = 16;
	this.map = false;
}

CreatorLandscape2DContext.prototype = Object.create(Object.prototype);
CreatorLandscape2DContext.prototype.constructor = CreatorLandscape2DContext;

//
// Methods
//

CreatorLandscape2DContext.prototype.setMap = function(landscapeMap) {
	this.map = landscapeMap;
};

CreatorLandscape2DContext.prototype.setDimensions = function(landscapeWidth, landscapeHeight) {
	this.width = landscapeWidth;
	this.height = landscapeHeight;
};

CreatorLandscape2DContext.prototype.setOffset = function(landscapeOffsetX, landscapeOffsetY) {
	this.offsetX = landscapeOffsetX;
	this.offsetY = landscapeOffsetY;
};
