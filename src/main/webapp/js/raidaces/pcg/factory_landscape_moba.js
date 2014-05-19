//
// FactoryLandscapeMoba
//
function FactoryLandscapeMoba() {
}

FactoryLandscapeMoba.prototype = Object.create(Object.prototype);
FactoryLandscapeMoba.prototype.constructor = FactoryLandscapeMoba;

//
// Methods
//

FactoryLandscapeMoba.prototype.createFixed = function(map, offsetX, offsetY,
		width, height, seed1, seed2) {
	var streamSource = new StreamSourceFixed(seed1, seed2);
	return this.create(map, offsetX, offsetY, width, height, streamSource);
};

FactoryLandscapeMoba.prototype.createRandom = function(map, offsetX, offsetY,
		width, height) {
	var streamSource = new StreamSourceRandom();
	return this.create(map, offsetX, offsetY, width, height, streamSource);
};

FactoryLandscapeMoba.prototype.create = function(map, offsetX, offsetY, width,
		height, streamSource) {

	var creatorLandscape = new CreatorLandscape2D();
	var creatorLandscapeContext = new CreatorLandscape2DContext();
	creatorLandscape.setContext(creatorLandscapeContext);

	creatorLandscapeContext.setDimensions(width, height);
	creatorLandscapeContext.setMap(map);

	return creatorLandscape.create(streamSource);
};
