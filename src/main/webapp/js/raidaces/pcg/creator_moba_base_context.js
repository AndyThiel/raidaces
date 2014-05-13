//
// CreatorMobaBaseContext
//
function CreatorMobaBaseContext() {
	this.width = 16;
	this.height = 16;
	this.mirrorMode = MIRRORMODE_RANDOM;
	this.mirrorLine = 0;
	this.themeWhitelist = false;
	this.map;
}

CreatorMobaBaseContext.prototype = Object.create(Object.prototype);
CreatorMobaBaseContext.prototype.constructor = CreatorMobaBaseContext;

//
// Methods
//

CreatorMobaBaseContext.prototype.setDimensions = function(mapWidth, mapHeight) {
	this.width = mapWidth;
	this.height = mapHeight;
};

CreatorMobaBaseContext.prototype.setThemeWhitelist = function(mapThemeWhitelist) {
	this.themeWhitelist = mapThemeWhitelist;
};

CreatorMobaBaseContext.prototype.setMirrorMode = function(mapMirrorMode, mapMirrorLine) {
	this.mirrorMode = mapMirrorMode;
	this.mirrorLine = mapMirrorLine;
};
