//
// ModuleEvents
//
function ModuleEvents(moduleEventBus, moduleRequestDispatcher) {
	AbstractModule.apply(this, arguments);
	this.gameState = false;
}

ModuleEvents.prototype = Object.create(AbstractModule.prototype);
ModuleEvents.prototype.constructor = ModuleEvents;

//
// Methods
//

ModuleEvents.prototype.changeGameState = function(moduleGameState) {

	var oldGameState = this.gameState;
	if (oldGameState) {
		oldGameState.uninit();
	}

	this.gameState = moduleGameState;
	var callbackFunction = this.makeCallbackExecution(oldGameState,
			this.gameState, this.eventBus);

	setTimeout(callbackFunction, 10);
};

ModuleEvents.prototype.makeCallbackExecution = function(oldGameState,
		newGameState, eventBus) {

	return function() {
		newGameState.init();
		eventBus
				.fireEvent(new EventGameStateChanged(oldGameState, newGameState));
	};
};

ModuleEvents.prototype.init = function() {
	this.isInitialized = true;
};
ModuleEvents.prototype.uninit = function() {
	if (this.gameState && this.gameState.isInitialized) {
		this.gameState.uninit();
	}
	this.isInitialized = false;
};

ModuleEvents.prototype.framePrepare = function(timePassed) {
};
ModuleEvents.prototype.frameRun = function(timePassed) {
};
ModuleEvents.prototype.frameCleanup = function(timePassed) {
};
