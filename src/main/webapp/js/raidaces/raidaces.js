//
// TODO Decide: should this be a class, e.g. RaidacesRunner
//
function resetLog() {
	var debugArea = document.getElementById('debugArea');
	debugArea.innerHTML = '';
}
function log(message) {
	var debugArea = document.getElementById('debugArea');
	debugArea.innerHTML += ('<br>' + message);
}

function initEngine(gameContext) {

	gameContext.beginPath();
	gameContext.rect(0, 0, 800, 600);
	gameContext.fillStyle = "#cb2c0c";
	gameContext.fill();
	gameContext.font = "bold 16px sans-serif";
	gameContext.fillStyle = "#FFFFFF";
	gameContext.fillText("Loading", 350, 294);

	mapContext.beginPath();
	mapContext.rect(0, 0, mapCanvas.width, mapCanvas.height);
	mapContext.fillStyle = "#cb2c0c";
	mapContext.fill();
	mapContext.font = "bold 10px sans-serif";
	mapContext.fillStyle = "#FFFFFF";
	mapContext.fillText("Loading", (mapCanvas.width / 2) - 12, (mapCanvas.height / 2) - 2);

	engine.registerCoreModules(gameContext);
	log("finished registering core modules");

	// TODO register and init game specific logic and structures
	// ...

	engine.init();
	log("finished initializing engine");
}

/*
 * This should be changed later ... the resource creation should be done in a
 * loading gamestate while this initialization should just register the
 * gamestates.
 * 
 * TODO Move the theme whitelist over to the landscape generator to keep the map
 * generator theme-neutral.
 */
function initGame(gameContext) {

	if (!engine.isInitialized) {
		throw "error_engine_not_initialized";
	}

	var eventsModule = engine.getModule("events");
	log("Rendering Map, please be patient!");
	eventsModule.changeGameState(new GameStateLoading(engine));
}

function restart(gameContext, hiddenContentArea) {
	resetLog();
	if (engine.isRunning) {
		engine.stop();
	}
	if (engine.isInitialized) {
		engine.uninit();
	}
	engine = new Engine();
	initEngine(gameContext);
	initGame(gameContext, hiddenContentArea);
	toggleRunning();
}

function toggleRunning() {
	if (engine.isRunning) {
		engine.stop();
	} else {
		engine.run();
	}
}
