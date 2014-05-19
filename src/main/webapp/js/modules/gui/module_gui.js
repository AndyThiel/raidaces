//
// ModuleGUI
//
function ModuleGUI(moduleEventBus, moduleRequestDispatcher) {
	AbstractModule.apply(this, arguments);
}

ModuleGUI.prototype = Object.create(AbstractModule.prototype);
ModuleGUI.prototype.constructor = ModuleGUI;

//
// Methods
//

ModuleGUI.prototype.init = function() {
	this.isInitialized = true;
};
ModuleGUI.prototype.uninit = function() {
	this.isInitialized = false;
};

ModuleGUI.prototype.framePrepare = function(timePassed) {
};
ModuleGUI.prototype.frameRun = function(timePassed) {
};
ModuleGUI.prototype.frameCleanup = function(timePassed) {
};
