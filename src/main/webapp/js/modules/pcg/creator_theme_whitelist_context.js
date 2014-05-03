//
// CreatorThemeWhitelistContext
//
function CreatorThemeWhitelistContext() {
	this.minThemes = 1;
	this.maxThemes = 1;
	this.allThemesArray = new Array();
}

CreatorThemeWhitelistContext.prototype = Object.create(Object.prototype);
CreatorThemeWhitelistContext.prototype.constructor = CreatorThemeWhitelistContext;

//
// Methods
//

CreatorThemeWhitelistContext.prototype.registerThemes = function(themeArray) {
	var index;
	for (index = 0; index < themeArray.length; index++) {
		this.registerTheme(themeArray[index]);
	}
};
CreatorThemeWhitelistContext.prototype.registerTheme = function(theme) {
	this.allThemesArray.push(theme);
};
