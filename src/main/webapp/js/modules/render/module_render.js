//
// ModuleRender
//
function ModuleRender(moduleEventBus, moduleRequestDispatcher, moduleGameContext) {
	AbstractModule.apply(this, [moduleEventBus, moduleRequestDispatcher]);
	this.gameContext = moduleGameContext;
}

ModuleRender.prototype = Object.create(AbstractModule.prototype);
ModuleRender.prototype.constructor = ModuleRender;

//
// Methods
//

ModuleRender.prototype.init = function() {
	this.isInitialized = true;
};
ModuleRender.prototype.uninit = function() {
	this.isInitialized = false;
};



ModuleRender.prototype.framePrepare = function(timePassed) {
};
ModuleRender.prototype.frameRun = function(timePassed) {
};
ModuleRender.prototype.frameCleanup = function(timePassed) {
};
