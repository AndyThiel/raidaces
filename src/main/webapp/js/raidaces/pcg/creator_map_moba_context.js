//
// CreatorMapMobaContext
//
function CreatorMapMobaContext() {
	this.width = 16;
	this.height = 16;
	this.themeWhitelist = false;
	this.mirrorMode = MIRRORMODE_RANDOM;
	this.mirrorLine = 0;
}

CreatorMapMobaContext.prototype = Object.create(Object.prototype);
CreatorMapMobaContext.prototype.constructor = CreatorMapMobaContext;

//
// Methods
//

CreatorMapMobaContext.prototype.setDimensions = function(mapWidth, mapHeight) {
	this.width = mapWidth;
	this.height = mapHeight;
};

CreatorMapMobaContext.prototype.setThemeWhitelist = function(mapThemeWhitelist) {
	this.themeWhitelist = mapThemeWhitelist;
};
