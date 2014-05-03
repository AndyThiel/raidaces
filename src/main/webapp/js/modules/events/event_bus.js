//
// EventBus
//
function EventBus() {
	this.eventHandler = new Object();
}

EventBus.prototype = Object.create(Object.prototype);
EventBus.prototype.constructor = EventBus;

//
// Methods
//

EventBus.prototype.registerEventHandler = function(eventHandler) {

	var eventType = eventHandler.type;
	if (!this.eventHandler[eventType]) {
		this.eventHandler[eventType].push(new Array());
	}

	this.eventHandler[eventType].push(eventHandler);
};
EventBus.prototype.unregisterEventHandler = function(eventHandlerToDelete) {

	var eventType = eventHandlerToDelete.type;
	if (this.eventHandler[eventType]) {

		var index;
		var currentHandler;
		for (index = 0; index < this.eventHandler[eventType].length; index++) {
			currentHandler = this.eventHandler[eventType][index];
			if (currentHandler == eventHandlerToDelete) {
				this.eventHandler[eventType][index] = false;
			}
		}
	}
};

EventBus.prototype.fireEvent = function(event) {

	var eventHandler = this.eventHandler[event.type];
	if (eventHandler) {

		var index;
		var currentHandler;
		for (index = 0; index < eventHandler.length; index++) {
			currentHandler = eventHandler[index];
			if (currentHandler && currentHandler.isEventHandled(event)) {
				currentHandler.beforeHandleEvent(event);
				currentHandler.handleEvent(event);
				currentHandler.afterHandleEvent(event);
			}
		}
	}
};
