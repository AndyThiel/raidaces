//
// ModuleResources
//
function ModuleResources(moduleEventBus, moduleRequestDispatcher) {
	AbstractModule.apply(this, arguments);
}

ModuleResources.prototype = Object.create(AbstractModule.prototype);
ModuleResources.prototype.constructor = ModuleResources;

//
// Methods
//

ModuleResources.prototype.init = function() {
	this.isInitialized = true;
};
ModuleResources.prototype.uninit = function() {
	this.isInitialized = false;
};

ModuleResources.prototype.framePrepare = function(timePassed) {
};
ModuleResources.prototype.frameRun = function(timePassed) {
};
ModuleResources.prototype.frameCleanup = function(timePassed) {
};
