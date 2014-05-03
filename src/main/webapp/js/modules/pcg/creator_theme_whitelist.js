//
// CreatorThemeWhitelist
//
function CreatorThemeWhitelist() {
}

CreatorThemeWhitelist.prototype = Object.create(AbstractCreator.prototype);
CreatorThemeWhitelist.prototype.constructor = CreatorThemeWhitelist;

//
// Methods
//

CreatorThemeWhitelist.prototype.create = function(streamSource) {

	var whitelist = new Array();

	if (!this.context) {
		throw "error_no_context_set";
	}

	var allThemesArray = this.context.allThemesArray;
	var minThemes = this.context.minThemes;
	var maxThemes = Math.min(this.context.maxThemes, allThemesArray.length);

	var actualThemes;
	if (minThemes == maxThemes) {
		actualThemes = maxThemes;
	} else if (minThemes > maxThemes) {
		throw "error_stupid_bounds";
	} else {
		actualThemes = (minThemes + (streamSource.consumeByte() % (maxThemes - minThemes + 1)));
	}

	log("actualThemes: " + actualThemes);

	var lastRemainingArray = new Array();
	var nextRemainingArray = new Array();

	lastRemainingArray = lastRemainingArray.concat(allThemesArray);
	log("number of themes: " + lastRemainingArray.length);

	while (actualThemes > whitelist.length) {
		var index;
		for (index = 0; index < lastRemainingArray.length; index++) {
			if (streamSource.consumeBoolean()
				&& (actualThemes > whitelist.length)) {

				whitelist.push(lastRemainingArray[index]);
			} else {
				nextRemainingArray.push(lastRemainingArray[index]);
			}
		}

		lastRemainingArray = nextRemainingArray;
		nextRemainingArray = new Array();
	}

	return whitelist;
};
