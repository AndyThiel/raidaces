//
// FactoryMapMoba
//
function FactoryMapMoba() {
}

FactoryMapMoba.prototype = Object.create(Object.prototype);
FactoryMapMoba.prototype.constructor = FactoryMapMoba;

//
// Methods
//

FactoryMapMoba.prototype.createFixed = function(mapSize, seed1, seed2) {
	var streamSource = new StreamSourceFixed(seed1, seed2);
	return this.create(mapSize, streamSource);
};

FactoryMapMoba.prototype.createRandom = function(mapSize) {
	var streamSource = new StreamSourceRandom();
	return this.create(mapSize, streamSource);
};

FactoryMapMoba.prototype.create = function(mapSize, streamSource) {

	var creatorMap = new CreatorMapMoba();
	var creatorMapContext = new CreatorMapMobaContext();
	creatorMap.setContext(creatorMapContext);

	var creatorThemeWhitelist = new CreatorThemeWhitelist();
	var creatorThemeWhitelistContext = new CreatorThemeWhitelistContext();
	creatorThemeWhitelist.setContext(creatorThemeWhitelistContext);

	creatorThemeWhitelistContext.registerThemes(creatorMap.getThemes());
	creatorMapContext.setDimensions(mapSize, mapSize); // Dimension in tiles

	creatorMapContext.setThemeWhitelist(creatorThemeWhitelist
			.create(streamSource));

	return creatorMap.create(streamSource);
};
