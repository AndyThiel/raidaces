//
// ModulePCG
//
function ModulePCG(moduleEventBus, moduleRequestDispatcher) {
	AbstractModule.apply(this, arguments);
}

ModulePCG.prototype = Object.create(AbstractModule.prototype);
ModulePCG.prototype.constructor = ModulePCG;

//
// Methods
//

ModulePCG.prototype.init = function() {
	this.isInitialized = true;
};
ModulePCG.prototype.uninit = function() {
	this.isInitialized = false;
};



ModulePCG.prototype.framePrepare = function(timePassed) {
};
ModulePCG.prototype.frameRun = function(timePassed) {
};
ModulePCG.prototype.frameCleanup = function(timePassed) {
};

ModulePCG.prototype.getStreamSourceRandom = function() {
	return new StreamSourceRandom();
};
ModulePCG.prototype.getStreamSourceFixed = function(sourceSeed1, sourceSeed2) {
	return new StreamSourceFixed(sourceSeed1, sourceSeed2);
};

ModulePCG.prototype.getCreatorThemeWhitelist = function() {
	return new CreatorThemeWhitelist();
};
ModulePCG.prototype.getCreatorMap2D = function() {
	return new CreatorMap2D();
};
ModulePCG.prototype.getCreatorLandscape2D = function() {
	return new CreatorLandscape2D();
};
