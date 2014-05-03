//
// AbstractEvent
//
function AbstractEvent(eventType) {
	this.type = eventType;
}

AbstractEvent.prototype = Object.create(Object.prototype);
AbstractEvent.prototype.constructor = AbstractEvent;
