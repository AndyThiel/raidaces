//
// Engine
//
function Engine() {

	this.isInitialized = false;
	this.isRunning = false;

	this.frameDuration = 30;
	this.interval;

	this.modules = new Object();
	this.eventBus = new EventBus();
	this.requestDispatcher = new RequestDispatcher();
}

Engine.prototype = Object.create(Object.prototype);
Engine.prototype.constructor = Engine;

//
// Methods
//

Engine.prototype.registerCoreModules = function(gameContext) {
	// this.registerModule("audio", new ModuleAudio(this.eventBus, this.requestDispatcher));
	this.registerModule("debug", new ModuleDebug(this.eventBus, this.requestDispatcher));
	this.registerModule("events", new ModuleEvents(this.eventBus, this.requestDispatcher));
	this.registerModule("gui", new ModuleGUI(this.eventBus, this.requestDispatcher));
	this.registerModule("pcg", new ModulePCG(this.eventBus, this.requestDispatcher));
	this.registerModule("render", new ModuleRender(this.eventBus, this.requestDispatcher, gameContext));
	this.registerModule("resources", new ModuleResources(this.eventBus, this.requestDispatcher));
	this.registerModule("scene", new ModuleScene(this.eventBus, this.requestDispatcher));
};
Engine.prototype.registerModule = function(module_id, module) {
	var oldValue = this.modules[module_id];
	this.modules[module_id] = module;
	return oldValue;
};

Engine.prototype.getModule = function(module_id) {
	if (!this.modules[module_id]) {
		throw "error_no_such_module_" + module_id;
	}
	return this.modules[module_id];
};


Engine.prototype.init = function() {
	var moduleInitCount = 0;

	var key;
	var module;
	for (key in this.modules.length) {
		module = this.modules[key];
		if (!module.isInitialized) {
			module.init();
			moduleInitCount++;
		}
	}

	this.isInitialized = true;

	return moduleInitCount;
};
Engine.prototype.uninit = function() {
	var moduleUninitCount = 0;

	var key;
	var module;
	for (key in this.modules) {
		module = this.modules[key];
		if (module.isInitialized) {
			module.uninit();
			moduleUninitCount++;
		}
	}

	this.isInitialized = false;

	return moduleUninitCount;
};



Engine.prototype.run = function() {

	if (!this.isInitialized) {
		throw "error_engine_not_initialized";
	}
	if (this.isRunning) {
		throw "error_engine_already_running";
	}

	this.isRunning = true;

	var engineObject = this;
	this.interval = setInterval(function() {
		engineObject.framePrepare();
		engineObject.frameRun();
		engineObject.frameCleanup();
	}, this.frameDuration);

	return 0;
};

Engine.prototype.stop = function() {

	if (!this.isRunning) {
		throw "error_engine_not_running";
	}

	this.isRunning = false;
	clearInterval(this.interval);

	return 0;
};



Engine.prototype.framePrepare = function() {

	if (!this.isInitialized) {
		throw "error_engine_not_initialized";
	}

	var key;
	var module;

	for (key in this.modules) {
		module = this.modules[key];
		if (module.isInitialized) {
			module.framePrepare(this.frameDuration);
		}
	}
};
Engine.prototype.frameRun = function() {

	if (!this.isInitialized) {
		throw "error_engine_not_initialized";
	}

	var key;
	var module;

	for (key in this.modules) {
		module = this.modules[key];
		if (module.isInitialized) {
			module.frameRun(this.frameDuration);
		}
	}
};
Engine.prototype.frameCleanup = function() {

	if (!this.isInitialized) {
		throw "error_engine_not_initialized";
	}

	var key;
	var module;

	for (key in this.modules) {
		module = this.modules[key];
		if (module.isInitialized) {
			module.frameCleanup(this.frameDuration);
		}
	}
};
