//
// CreatorMap2DContext
//
function CreatorMap2DContext() {
	this.width = 16;
	this.height = 16;
	this.themeWhitelist = false;
	this.mirrorMode = MIRRORMODE_RANDOM;
	this.mirrorLine = 0;
}

CreatorMap2DContext.prototype = Object.create(Object.prototype);
CreatorMap2DContext.prototype.constructor = CreatorMap2DContext;

//
// Methods
//

CreatorMap2DContext.prototype.setDimensions = function(mapWidth, mapHeight) {
	this.width = mapWidth;
	this.height = mapHeight;
};

CreatorMap2DContext.prototype.setThemeWhitelist = function(mapThemeWhitelist) {
	this.themeWhitelist = mapThemeWhitelist;
};

CreatorMap2DContext.prototype.setMirrorMode = function(mapMirrorMode, mapMirrorLine) {
	this.mirrorMode = mapMirrorMode;
	this.mirrorLine = mapMirrorLine;
};
