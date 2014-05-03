//
// AbstractModule
//
function AbstractModule(moduleEventBus, moduleRequestDispatcher) {
	this.isInitialized = false;
	this.eventBus = moduleEventBus;
	this.requestDispatcher = moduleRequestDispatcher;
}

AbstractModule.prototype = Object.create(Object.prototype);
AbstractModule.prototype.constructor = AbstractModule;

//
// Methods
//

AbstractModule.prototype.init = function() {
	this.isInitialized = true;
};
AbstractModule.prototype.uninit = function() {
	this.isInitialized = false;
};



AbstractModule.prototype.framePrepare = function(timePassed) {
};
AbstractModule.prototype.frameRun = function(timePassed) {
};
AbstractModule.prototype.frameCleanup = function(timePassed) {
};
