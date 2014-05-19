//
// GameStateMenu
//
function GameStateMenu(gamestateEngine) {
	AbstractGameState.apply(this, arguments);
}

GameStateMenu.prototype = Object.create(AbstractGameState.prototype);
GameStateMenu.prototype.constructor = GameStateMenu;

//
// Methods
//

GameStateMenu.prototype.init = function() {

	if (this.isInitialized) {
		throw "error_gamestate_loading_already_initialized";
	}

	var guiModule = this.engine.getModule("gui");
	var sceneModule = this.engine.getModule("scene");
	log("modules grabbed from engine");

	this.isInitialized = true;
};
