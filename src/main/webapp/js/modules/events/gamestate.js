//
// AbstractGamestate
//
function AbstractGameState(gamestateEngine) {
	this.isInitialized = false;
	this.engine = gamestateEngine;
	this.eventBus = gamestateEngine.eventBus;
	this.requestDispatcher = gamestateEngine.requestDispatcher;
}

AbstractGameState.prototype = Object.create(Object.prototype);
AbstractGameState.prototype.constructor = AbstractGameState;

//
// Methods
//

AbstractGameState.prototype.init = function() {
	this.isInitialized = true;
};
AbstractGameState.prototype.uninit = function() {
	this.isInitialized = false;
};
