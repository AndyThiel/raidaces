var engine = new Engine();

function log(message) {
	var debugArea = document.getElementById('debugArea');
	debugArea.innerHTML += ('<br>' + message);
}

function initEngine(gameContext) {

	engine.registerCoreModules(gameContext);
	log("finished registering core modules");

	// TODO register and init game specific logic and structures
	// ...

	engine.init();
	log("finished initializing engine");
}

/*
 * This should be changed later ... the resource creation should be
 * done in a loading gamestate while this initialization should just register
 * the gamestates.
 *
 * TODO Move the theme whitelist over to the landscape generator to keep the
 * map generator theme-neutral.
 */
function initGame(gameContext, hiddenContentArea) {

	if (!engine.isInitialized) {
		throw "error_engine_not_initialized";
	}

	var eventsModule = engine.getModule("events");
	log("Rendering Map, please be patient!");
	eventsModule.changeGameState(new GameStateLoading(engine));
}

function toggleRunning() {
	if (engine.isRunning) {
		engine.stop();
	} else {
		engine.run();
	}
}
