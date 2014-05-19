//
// GamestateLoading
//
function GameStateLoading(gamestateEngine) {

	AbstractGameState.apply(this, arguments);

	this.MAPSIZE = mapCanvas.width;
	this.TILESIZE = 32;
	this.ACTUALLY_DO_STUFF = true;

	this.creatorMap;
	this.creatorLandscape;

	this.creatorMapContext = new CreatorMapMobaContext();
	this.creatorLandscapeContext = new CreatorLandscape2DContext();
}

GameStateLoading.prototype = Object.create(AbstractGameState.prototype);
GameStateLoading.prototype.constructor = GameStateLoading;

//
// Methods
//

GameStateLoading.prototype.init = function() {

	if (this.isInitialized) {
		throw "error_gamestate_loading_already_initialized";
	}

	var hiddenContentArea = document.getElementById('hiddenContentArea');
	this.initHiddenContentArea(hiddenContentArea);
	log("finished initializing hidden content area");

	var pcgModule = this.engine.getModule("pcg");
	var sceneModule = this.engine.getModule("scene");
	log("modules grabbed from engine");

	// For random content
	var streamSource = pcgModule.getStreamSourceRandom();
	// For reproducible content
	// var streamSource = pcgModule.getStreamSourceFixed(201, 102);
	log("stream source has been requested");

	var creatorThemeWhitelist;

	// Request creators for procedural generation
	creatorThemeWhitelist = pcgModule.getCreatorThemeWhitelist();
	log("whitelist creator requested");
	this.creatorMap = new CreatorMapMoba();
	log("map creator requested");
	this.creatorLandscape = pcgModule.getCreatorLandscape2D();
	log("landscape creator requested");

	var creatorThemeWhitelistContext = new CreatorThemeWhitelistContext();
	// Register context objects
	creatorThemeWhitelist.setContext(creatorThemeWhitelistContext);
	this.creatorMap.setContext(this.creatorMapContext);
	this.creatorLandscape.setContext(this.creatorLandscapeContext);
	log("context objects set");

	// Init context objects for desired creation settings
	creatorThemeWhitelistContext.registerThemes(this.creatorMap.getThemes());
	this.creatorMapContext.setDimensions(this.MAPSIZE, this.MAPSIZE); // Dimension
	// in
	// tiles
	this.creatorLandscapeContext.setProjectionMode(PROJECTION_ISO);
	this.creatorLandscapeContext.setTilesize(this.TILESIZE); // Tile size in
	// pixels
	this.creatorLandscapeContext.setDimensions(16, 16); // Dimension in tiles
	log("context settings complete");

	if (this.ACTUALLY_DO_STUFF) {

		// Use the creators to populate more settings in the context objects
		this.creatorMapContext.setThemeWhitelist(creatorThemeWhitelist
				.create(streamSource));
		log("Whitelist created");
		this.creatorLandscapeContext.setMap(this.creatorMap
				.create(streamSource));
		log("Map created");

		var indexMapY;
		var indexMapX;
		for (indexMapY = 0; indexMapY < this.MAPSIZE; indexMapY++) {
			for (indexMapX = 0; indexMapX < this.MAPSIZE; indexMapX++) {

				mapContext.lineWidth = 1;
				mapContext.beginPath();
				mapContext.rect(indexMapX, indexMapY, 1, 1);

				var left = this.MAPSIZE / 2 - 8;
				var right = this.MAPSIZE / 2 + 8;
				var top = this.MAPSIZE / 2 - 8;
				var bottom = this.MAPSIZE / 2 + 8;

				if ((indexMapY >= top && indexMapY <= bottom && (top == indexMapX || bottom == indexMapX))
						|| (indexMapX >= left && indexMapX <= right && (left == indexMapY || right == indexMapY))) {
					mapContext.strokeStyle = "#FFFFFF";
				} else {
					if (typeof this.creatorLandscapeContext.map.mapArray[indexMapY][indexMapX] === 'undefined') {
						log("undefined at: " + indexMapX + "/" + indexMapY);
						mapContext.strokeStyle = "#FF00FF";
					} else if (0 == this.creatorLandscapeContext.map.mapArray[indexMapY][indexMapX]) {
						mapContext.strokeStyle = "#7777AA";
					} else if (1 == this.creatorLandscapeContext.map.mapArray[indexMapY][indexMapX]) {
						mapContext.strokeStyle = "#77AA77";
					} else if (2 == this.creatorLandscapeContext.map.mapArray[indexMapY][indexMapX]) {
						mapContext.strokeStyle = "#88BB88";
					} else if (3 == this.creatorLandscapeContext.map.mapArray[indexMapY][indexMapX]) {
						mapContext.strokeStyle = "#99CC99";
					} else if (4 == this.creatorLandscapeContext.map.mapArray[indexMapY][indexMapX]) {
						mapContext.strokeStyle = "#AADDAA";
					} else {
						log("unsupported ("
								+ this.creatorLandscapeContext.map.mapArray[indexMapY][indexMapX]
								+ ") at: " + indexMapX + "/" + indexMapY);
						mapContext.strokeStyle = "#00FF00";
					}
				}
				mapContext.stroke();
			}
		}

		var left = this.MAPSIZE / 2 - 8;
		var top = this.MAPSIZE / 2 - 8;

		// There will always be 25 rendered landscape images and parts of 9 of
		// them
		// will be visible ...
		// ... as the player moves, the content of those images will be
		// reorganized
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

			// 120 is the top-left corner when the player is in the center of
			// the map.
			var offsetY = top + ((indexY - 2) * 16);
			var offsetX = left + ((indexX - 2) * 16);
			this.creatorLandscapeContext.setOffset(offsetX, offsetY);

			var currentLandscape = this.creatorLandscape.create(streamSource);
			this.landscapeToImages(currentLandscape, this.TILESIZE,
					indexCurrentLandscape);

			var landscapeEntity = this.landscapeToEntity(currentLandscape,
					this.TILESIZE);

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

	this.isInitialized = true;
};
GameStateLoading.prototype.uninit = function() {
	this.isInitialized = false;
};

GameStateLoading.prototype.initHiddenContentArea = function(hiddenContentArea) {

	// The canvases are used to render the images that are eventually stored in
	// the images created below.
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
		if (6 == indexCurrentLandscape || 7 == indexCurrentLandscape
				|| 8 == indexCurrentLandscape || 11 == indexCurrentLandscape
				|| 12 == indexCurrentLandscape || 13 == indexCurrentLandscape
				|| 16 == indexCurrentLandscape || 17 == indexCurrentLandscape
				|| 18 == indexCurrentLandscape) {
			// landscapeMapImage.className = "visible";
			landscapeMapImage.addEventListener('load', function() {
				updateMap(gameContext);
			}, false);
		}
	}
};

GameStateLoading.prototype.landscapeToImages = function(currentLandscape,
		tileSize, indexCurrentLandscape) {

	setTimeout(this.makeRenderExecution(this, currentLandscape,
			indexCurrentLandscape, tileSize), (indexCurrentLandscape * 200));

	// this.renderLandscapeMaps(currentLandscape, tileSize);
	//
	// document.getElementById('imgMap' + indexCurrentLandscape).src =
	// document.getElementById('canvasMap').toDataURL();
	// document.getElementById('imgNormalMap' + indexCurrentLandscape).src =
	// document.getElementById('canvasNormalMap').toDataURL();
	// document.getElementById('imgDepthMap' + indexCurrentLandscape).src =
	// document.getElementById('canvasDepthMap').toDataURL();
};

GameStateLoading.prototype.makeRenderExecution = function(gamestate_loading,
		currentLandscape, indexCurrentLandscape, tileSize) {

	return function() {

		gamestate_loading.renderLandscapeMaps(currentLandscape, tileSize);

		// setTimeout(function() {
		document.getElementById('imgMap' + indexCurrentLandscape).src = document
				.getElementById('canvasMap').toDataURL();
		// }, 10);
		// setTimeout(function() {
		document.getElementById('imgNormalMap' + indexCurrentLandscape).src = document
				.getElementById('canvasNormalMap').toDataURL();
		// }, 10);
		// setTimeout(function() {
		document.getElementById('imgDepthMap' + indexCurrentLandscape).src = document
				.getElementById('canvasDepthMap').toDataURL();
		// }, 10);

		// eventBus
		// .fireEvent(new EventGameStateChanged(oldGameState, newGameState));
	};
};

GameStateLoading.prototype.renderLandscapeMaps = function(currentLandscape,
		tileSize) {

	var renderGrid = true;
	var contextMap = document.getElementById('canvasMap').getContext('2d');
	contextMap.clearRect(0, 0, 1024, 1024);

	// var contextNormal =
	// document.getElementById('canvasNormalMap').getContext('2d');
	// var contextDepth =
	// document.getElementById('canvasDepthMap').getContext('2d');

	var landscapeArray = currentLandscape.landscapeArray;

	var indexY;
	var indexX;

	for (indexY = 0; indexY < landscapeArray.length; indexY++) {

		for (indexX = 0; indexX < landscapeArray[indexY].length; indexX++) {

			var heightStep = tileSize * 3 / 4;

			var height = landscapeArray[indexY][indexX];
			if (typeof height === 'undefined') {
				height = 0;
			} else {
				height -= 2;
			}
			var heightOffset = height * heightStep;

			var posX = indexX * tileSize;
			var posY = indexY * tileSize;
			var isoX = 512 + (posX - posY);
			var isoY = 256 + ((posX + posY) / 2) - heightOffset;

			contextMap.beginPath();
			contextMap.moveTo(isoX, isoY);
			contextMap.lineTo(isoX + tileSize, isoY + (tileSize / 2));
			contextMap.lineTo(isoX, isoY + tileSize);
			contextMap.lineTo(isoX - tileSize, isoY + (tileSize / 2));
			contextMap.lineTo(isoX, isoY);
			contextMap.closePath();
			contextMap.fillStyle = 'transparent';
			contextMap.fill();
			contextMap.fillStyle = this.getFillStyle(height);
			contextMap.fill();

			contextMap.strokeStyle = 'transparent';
			contextMap.stroke();
			if (renderGrid) {
				contextMap.strokeStyle = "#999";
				contextMap.stroke();
			} else {
				contextMap.strokeStyle = this.getFillStyle(height);
				contextMap.stroke();
			}

			var heightNeighborBottomCenter;
			var heightNeighborRight;

			if (indexY >= landscapeArray.length - 1) {
				heightNeighborBottomCenter = -2;
			} else {
				heightNeighborBottomCenter = landscapeArray[indexY + 1][indexX] - 2;
			}
			if (indexX >= landscapeArray[indexY].length - 1) {
				heightNeighborRight = -2;
			} else {
				heightNeighborRight = landscapeArray[indexY][indexX + 1] - 2;
			}

			if (height > heightNeighborBottomCenter) {

				var cliffHeightOffset = (height - heightNeighborBottomCenter)
						* heightStep;

				contextMap.beginPath();
				contextMap.moveTo(isoX - tileSize, isoY + (tileSize / 2));
				contextMap.lineTo(isoX, isoY + tileSize);
				contextMap.lineTo(isoX, isoY + tileSize + cliffHeightOffset);
				contextMap.lineTo(isoX - tileSize, isoY + cliffHeightOffset
						+ (tileSize / 2));
				contextMap.lineTo(isoX - tileSize, isoY + (tileSize / 2));
				contextMap.closePath();
				contextMap.fillStyle = 'transparent';
				contextMap.fill();
				contextMap.fillStyle = "#CC9966";
				contextMap.fill();

				contextMap.strokeStyle = 'transparent';
				contextMap.stroke();
				if (renderGrid) {
					contextMap.strokeStyle = "#999";
					contextMap.stroke();
				} else {
					contextMap.strokeStyle = "#CC9966";
					contextMap.stroke();
				}
			}

			if (height > heightNeighborRight) {

				var cliffHeightOffset = (height - heightNeighborRight)
						* heightStep;

				contextMap.beginPath();
				contextMap.moveTo(isoX, isoY + tileSize);
				contextMap.lineTo(isoX + tileSize, isoY + (tileSize / 2));
				contextMap.lineTo(isoX + tileSize, isoY + cliffHeightOffset
						+ (tileSize / 2));
				contextMap.lineTo(isoX, isoY + cliffHeightOffset + tileSize);
				contextMap.lineTo(isoX, isoY + tileSize);
				contextMap.closePath();
				contextMap.fillStyle = 'transparent';
				contextMap.fill();
				contextMap.fillStyle = "#AA6644";
				contextMap.fill();

				contextMap.strokeStyle = 'transparent';
				contextMap.stroke();
				if (renderGrid) {
					contextMap.strokeStyle = "#999";
					contextMap.stroke();
				} else {
					contextMap.strokeStyle = "#AA6644";
					contextMap.stroke();
				}
			}
		}
	}
};

GameStateLoading.prototype.getFillStyle = function(tileValue) {
	if (-2 == tileValue) {
		return "#7777AA";
	} else if (-1 == tileValue) {
		return "#77AA77";
	} else if (0 == tileValue) {
		return "#88BB88";
	} else if (1 == tileValue) {
		return "#99CC99";
	} else if (2 == tileValue) {
		return "#AADDAA";
	} else {
		return "#00FF00";
	}
	throw "error_unhandled_tile_value " + tileValue;
};

/*
 * Will create an entity object for the scene graph, probably with the collision
 * information ...
 * 
 */
GameStateLoading.prototype.landscapeToEntity = function(currentLandscape,
		tileSize) {

	// ...
};

function updateMap(gameContext) {
	setTimeout(makeUpdateExecution(), 10);
}

function makeUpdateExecution() {

	return function() {

		gameContext.clearRect(0, 0, 800, 600);

		gameContext.drawImage(document.getElementById("imgMap6"), 0.0, 0.0,
				1024.0, 1024.0, -112.0, (-212.0 - 512.0), 1024.0, 1024.0);

		gameContext.drawImage(document.getElementById("imgMap7"), 0.0, 0.0,
				1024.0, 1024.0, (-112.0 + 512.0), (-212.0 - 256.0), 1024.0,
				1024.0);

		gameContext.drawImage(document.getElementById("imgMap8"), 0.0, 0.0,
				1024.0, 1024.0, (-112.0 + 1024.0), -212.0, 1024.0, 1024.0);

		gameContext.drawImage(document.getElementById("imgMap11"), 0.0, 0.0,
				1024.0, 1024.0, (-112.0 - 512.0), (-212.0 - 256.0), 1024.0,
				1024.0);

		gameContext.drawImage(document.getElementById("imgMap12"), 0.0, 0.0,
				1024.0, 1024.0, -112.0, -212.0, 1024.0, 1024.0);

		gameContext.drawImage(document.getElementById("imgMap13"), 0.0, 0.0,
				1024.0, 1024.0, (-112.0 + 512.0), (-212.0 + 256.0), 1024.0,
				1024.0);

		gameContext.drawImage(document.getElementById("imgMap16"), 0.0, 0.0,
				1024.0, 1024.0, -112.0 - 1024.0, -212.0, 1024.0, 1024.0);

		gameContext.drawImage(document.getElementById("imgMap17"), 0.0, 0.0,
				1024.0, 1024.0, -112.0 - 512.0, -212.0 + 256.0, 1024.0, 1024.0);

		gameContext.drawImage(document.getElementById("imgMap18"), 0.0, 0.0,
				1024.0, 1024.0, -112.0, -212.0 + 512.0, 1024.0, 1024.0);

		engine.eventBus.fireEvent(new EventMapUpdated());

	};
};