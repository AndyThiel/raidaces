var engine = new Engine();

var MAPSIZE = 128;
var TILESIZE = 64;
var ACTUALLY_DO_STUFF = true;

var creatorThemeWhitelist;
var creatorMap;
var creatorLandscape;

var creatorThemeWhitelistContext = new CreatorThemeWhitelistContext();
var creatorMapContext = new CreatorMap2DContext();
var creatorLandscapeContext = new CreatorLandscape2DContext();

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

	initHiddenContentArea(hiddenContentArea);
	log("finished initializing hidden content area");

	var pcgModule = engine.getModule("pcg");
	var sceneModule = engine.getModule("scene");
	log("modules grabbed from engine");

	// For random content
	var streamSource = pcgModule.getStreamSourceRandom();
	// For reproducible content
	// var streamSource = pcgModule.getStreamSourceFixed(201, 102);
	log("stream source has been requested");

	// Request creators for procedural generation
	creatorThemeWhitelist = pcgModule.getCreatorThemeWhitelist();
	log("whitelist creator requested");
	creatorMap = pcgModule.getCreatorMap2D();
	log("map creator requested");
	creatorLandscape = pcgModule.getCreatorLandscape2D();
	log("landscape creator requested");

	// Register context objects
	creatorThemeWhitelist.setContext(creatorThemeWhitelistContext);
	creatorMap.setContext(creatorMapContext);
	creatorLandscape.setContext(creatorLandscapeContext);
	log("context objects set");

	// Init context objects for desired creation settings
	creatorThemeWhitelistContext.registerThemes(creatorMap.getThemes());
	creatorMapContext.setDimensions(MAPSIZE, MAPSIZE); // Dimension in tiles
	creatorLandscapeContext.setProjectionMode(PROJECTION_TOP);
	// creatorLandscapeContext.setProjectionMode(PROJECTION_ISO);
	creatorLandscapeContext.setTilesize(TILESIZE); // Tile size in pixels
	creatorLandscapeContext.setDimensions(16, 16); // Dimension in tiles
	log("context settings complete");

	if (ACTUALLY_DO_STUFF) {

		// Use the creators to populate more settings in the context objects
		creatorMapContext.setThemeWhitelist(creatorThemeWhitelist.create(streamSource));
		log("Whitelist created");
		creatorLandscapeContext.setMap(creatorMap.create(streamSource));
		log("Map created");

		var indexMapY;
		var indexMapX;
		for (indexMapY = 0; indexMapY < MAPSIZE; indexMapY++) {
			for (indexMapX = 0; indexMapX < MAPSIZE; indexMapX++) {

				mapContext.lineWidth = 1;
				mapContext.beginPath();
				mapContext.rect(indexMapX, indexMapY, 1, 1);

				if ((indexMapY >= 56 && indexMapY <= 72 && (56 == indexMapX || 72 == indexMapX))
					|| (indexMapX >= 56 && indexMapX <= 72 && (56 == indexMapY || 72 == indexMapY))) {
					mapContext.strokeStyle = "#FFFFFF";
				} else {
					if (1 == creatorLandscapeContext.map.mapArray[indexMapY][indexMapX]) {
						mapContext.strokeStyle = "#CD7F32";
					} else {
						mapContext.strokeStyle = "#88BB88";
					}
				}
				mapContext.stroke();
			}
		}
		// There will always be 25 rendered landscape images and parts of 9 of them
		// will be visible ...
		// ... as the player moves, the content of those images will be reorganized
		// and the offsets adjusted accordingly.
		// # # # # #
		// # # # # #
		// # # # # #
		// # # # # #
		// # # # # #
		var indexCurrentLandscape;
		for (indexCurrentLandscape = 0; indexCurrentLandscape < 25; indexCurrentLandscape++) {

			var indexY = Math.floor(indexCurrentLandscape / 5);
			var indexX = Math.floor(indexCurrentLandscape % 5);

			// 120 is the top-left corner when the player is in the center of the map.
			var offsetY = 56 + ((indexY - 2) * 16);
			var offsetX = 56 + ((indexX - 2) * 16);
			creatorLandscapeContext.setOffset(offsetX, offsetY);

			var currentLandscape = creatorLandscape.create(streamSource);
			landscapeToImages(currentLandscape, TILESIZE, indexCurrentLandscape);

			var landscapeEntity = landscapeToEntity(currentLandscape, TILESIZE);

			sceneModule.registerEntity(landscapeEntity);
		}

	} else {

		var index;
		for (index = 0; index < 2; index++) {
			log("Integer: " + streamSource.consumeInt());
			log(streamSource.bufferSequence);
		}
		for (index = 0; index < 2; index++) {
			log("Boolean: " + streamSource.consumeBoolean());
			log(streamSource.bufferSequence);
		}
	}
}

function initHiddenContentArea(hiddenContentArea) {

	// The canvases are used to render the images that are eventually stored in the images created below.
	var landscapeMapCanvas = document.createElement("canvas");
	var landscapeNormalMapCanvas = document.createElement("canvas");
	var landscapeDepthMapCanvas = document.createElement("canvas");

	landscapeMapCanvas.id = "canvasMap";
	landscapeMapCanvas.width = "1024";
	landscapeMapCanvas.height = "1024";
	landscapeNormalMapCanvas.id = "canvasNormalMap";
	landscapeNormalMapCanvas.width = "1024";
	landscapeNormalMapCanvas.height = "1024";
	landscapeDepthMapCanvas.id = "canvasDepthMap";
	landscapeDepthMapCanvas.width = "1024";
	landscapeDepthMapCanvas.height = "1024";

	hiddenContentArea.appendChild(landscapeMapCanvas);
	hiddenContentArea.appendChild(landscapeNormalMapCanvas);
	hiddenContentArea.appendChild(landscapeDepthMapCanvas);

	var indexCurrentLandscape;
	for (indexCurrentLandscape = 0; indexCurrentLandscape < 25; indexCurrentLandscape++) {

		var landscapeMapImage = document.createElement("img");
		var landscapeNormalMapImage = document.createElement("img");
		var landscapeDepthMapImage = document.createElement("img");

		landscapeMapImage.id = "imgMap" + indexCurrentLandscape;
		landscapeMapImage.width = "1024";
		landscapeMapImage.height = "1024";
		landscapeNormalMapImage.id = "imgNormalMap" + indexCurrentLandscape;
		landscapeNormalMapImage.width = "1024";
		landscapeNormalMapImage.height = "1024";
		landscapeDepthMapImage.id = "imgDepthMap" + indexCurrentLandscape;
		landscapeDepthMapImage.width = "1024";
		landscapeDepthMapImage.height = "1024";

		hiddenContentArea.appendChild(landscapeMapImage);
		hiddenContentArea.appendChild(landscapeNormalMapImage);
		hiddenContentArea.appendChild(landscapeDepthMapImage);
		if (12 == indexCurrentLandscape) {
			landscapeMapImage.className = "visible";
			landscapeMapImage.addEventListener('load', function() { updateMap(gameContext); }, false);
		}
	}
}

function landscapeToImages(currentLandscape, tileSize, indexCurrentLandscape) {

	renderLandscapeMaps(currentLandscape, tileSize);

	document.getElementById('imgMap' + indexCurrentLandscape).src = document.getElementById('canvasMap').toDataURL();
	document.getElementById('imgNormalMap' + indexCurrentLandscape).src = document.getElementById('canvasNormalMap').toDataURL();
	document.getElementById('imgDepthMap' + indexCurrentLandscape).src = document.getElementById('canvasDepthMap').toDataURL();
}

function renderLandscapeMaps(currentLandscape, tileSize) {

	var contextMap = document.getElementById('canvasMap').getContext('2d');
	// var contextNormal = document.getElementById('canvasNormalMap').getContext('2d');
	// var contextDepth = document.getElementById('canvasDepthMap').getContext('2d');

	var landscapeArray = currentLandscape.landscapeArray;

	var indexY;
	var indexX;
	for (indexY = 0; indexY < landscapeArray.length; indexY++) {
		for (indexX = 0; indexX < landscapeArray[indexY].length; indexX++) {

			contextMap.lineWidth = 2;

			var posY = indexY * tileSize;
			var posX = indexX * tileSize;
			if (landscapeArray[indexY][indexX]) {

				contextMap.beginPath();
				contextMap.rect(posX, posY, 64, 64);
				contextMap.strokeStyle = "#C19A6B";
				contextMap.stroke();
				contextMap.fillStyle = "#CD7F32";
				contextMap.fill();

			} else {

				contextMap.beginPath();
				contextMap.rect(posX, posY, 64, 64);
				contextMap.strokeStyle = "#99CC99";
				contextMap.stroke();
				contextMap.fillStyle = "#88BB88";
				contextMap.fill();
			}
		}
	}
}

/*
 * Will create an entity object for the scene graph,
 * probably with the collision information ...
 *
 */
function landscapeToEntity(currentLandscape, tileSize) {

	// ...
}

function updateMap(gameContext) {
	var centerImage = document.getElementById("imgMap12");
	gameContext.drawImage(centerImage, 112.0, 212.0, 800.0, 600.0, 0.0, 0.0, 800.0, 600.0);
}

function toggleRunning() {
	if (engine.isRunning) {
		engine.stop();
	} else {
		engine.run();
	}
}
