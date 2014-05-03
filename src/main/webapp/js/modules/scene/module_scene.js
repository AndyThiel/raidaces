//
// ModuleScene
//
function ModuleScene(moduleEventBus, moduleRequestDispatcher) {
	AbstractModule.apply(this, arguments);
}

ModuleScene.prototype = Object.create(AbstractModule.prototype);
ModuleScene.prototype.constructor = ModuleScene;

//
// Methods
//

ModuleScene.prototype.init = function() {
	this.isInitialized = true;
};
ModuleScene.prototype.uninit = function() {
	this.isInitialized = false;
};



ModuleScene.prototype.framePrepare = function(timePassed) {
};
ModuleScene.prototype.frameRun = function(timePassed) {
};
ModuleScene.prototype.frameCleanup = function(timePassed) {
};

ModuleScene.prototype.registerEntity = function(entity) {
};