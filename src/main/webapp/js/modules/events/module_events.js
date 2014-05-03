//
// ModuleEvents
//
function ModuleEvents(moduleEventBus, moduleRequestDispatcher) {
	AbstractModule.apply(this, arguments);
}

ModuleEvents.prototype = Object.create(AbstractModule.prototype);
ModuleEvents.prototype.constructor = ModuleEvents;

//
// Methods
//

ModuleEvents.prototype.init = function() {
	this.isInitialized = true;
};
ModuleEvents.prototype.uninit = function() {
	this.isInitialized = false;
};



ModuleEvents.prototype.framePrepare = function(timePassed) {
};
ModuleEvents.prototype.frameRun = function(timePassed) {
};
ModuleEvents.prototype.frameCleanup = function(timePassed) {
};
