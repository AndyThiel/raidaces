//
// ModuleDebug
//
function ModuleDebug(moduleEventBus, moduleRequestDispatcher) {
	AbstractModule.apply(this, arguments);
}

ModuleDebug.prototype = Object.create(AbstractModule.prototype);
ModuleDebug.prototype.constructor = ModuleDebug;

//
// Methods
//

ModuleDebug.prototype.init = function() {
	this.isInitialized = true;
};
ModuleDebug.prototype.uninit = function() {
	this.isInitialized = false;
};



ModuleDebug.prototype.framePrepare = function(timePassed) {
};
ModuleDebug.prototype.frameRun = function(timePassed) {
};
ModuleDebug.prototype.frameCleanup = function(timePassed) {
};
