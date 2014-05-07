//
// CreatorMapDeathmatchContext
//
function CreatorMapDeathmatchContext() {
	this.width = 16;
	this.height = 16;
	this.themeWhitelist = false;
}

CreatorMapDeathmatchContext.prototype = Object.create(Object.prototype);
CreatorMapDeathmatchContext.prototype.constructor = CreatorMapDeathmatchContext;

//
// Methods
//

CreatorMapDeathmatchContext.prototype.setDimensions = function(mapWidth, mapHeight) {
	this.width = mapWidth;
	this.height = mapHeight;
};

CreatorMapDeathmatchContext.prototype.setThemeWhitelist = function(mapThemeWhitelist) {
	this.themeWhitelist = mapThemeWhitelist;
};
